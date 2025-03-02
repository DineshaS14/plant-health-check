import os
import base64
import json
import cv2
import numpy as np

from typing import List
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

###############################################################################
# 1. Existing Functions (unchanged)
###############################################################################
def load_treatment_data(filepath):
    with open(filepath, "r") as f:
        return json.load(f)

def get_core_disease(full_name):
    if "___" in full_name:
        parts = full_name.split("___")
        if len(parts) > 1:
            species = parts[0].lower()
            disease = parts[1].lower()
            if species in disease:
                disease = disease.replace(species, "")
            return disease.replace("_", " ").strip()
    return full_name.lower()

def generate_detection_message(full_name, conf, env, treatment_data, class_shorthand):
    core_disease = get_core_disease(full_name)
    if "healthy" in core_disease:
        return (
            f"{core_disease.capitalize()} detected with {conf * 100:.1f}% confidence. "
            f"No treatment necessary; maintain standard care.",
            full_name,
            conf
        )
    code = class_shorthand.get(full_name)
    if not code:
        rec_text = "No treatment recommendations available."
    else:
        recs = []
        dt = treatment_data.get(code, {}).get("treatment", {})
        
        # Default recommendations
        if dt.get("default"):
            recs.extend(dt["default"])
        
        # Humidity-based recommendations
        if env.get("humidity", 0) > 70 and dt.get("humidity"):
            recs.extend(dt["humidity"])
        
        # Temperature-based recommendations
        temp = env.get("temperature", 25)
        if (temp > 30 or temp < 10) and dt.get("temperature"):
            recs.extend(dt["temperature"])
        
        # pH-based recommendations
        ph = env.get("pH", 6.5)
        if (ph < 6.0 or ph > 7.0) and dt.get("pH"):
            recs.extend(dt["pH"])
        
        # Fertilizer or pesticide
        if dt.get("fertilizer"):
            recs.extend(dt["fertilizer"])
        if dt.get("pesticide"):
            recs.extend(dt["pesticide"])
        
        rec_text = " ".join(sorted(set(recs)))

    msg = (
        f"Disease: {core_disease.capitalize()} detected with {conf * 100:.1f}% confidence. "
        f"Recommended treatment: {rec_text}"
    )
    return msg, full_name, conf

def generate_custom_messages(detections, env, treatment_data, id_to_name, name_to_code):
    plants = {}
    for det in detections:
        pid = det.get("plant_id")
        plants.setdefault(pid, []).append(det)
    
    messages = {}
    for pid, dets in plants.items():
        if all(d["class_id"] is None for d in dets):
            messages[pid] = f"Plant {pid}: No disease detected (all images below confidence threshold)."
            continue
        
        agg_msgs, confs, diseases = [], [], set()
        for d in dets:
            if d["class_id"] is None:
                continue
            conf = d["confidence"]
            full_name = id_to_name.get(d["class_id"], "Unknown")
            confs.append(conf)
            diseases.add(full_name)
            msg, _, _ = generate_detection_message(full_name, conf, env, treatment_data, name_to_code)
            agg_msgs.append(msg)
        
        if not agg_msgs:
            messages[pid] = f"Plant {pid}: No disease detected (all images below confidence threshold)."
        elif all("healthy" in get_core_disease(n).lower() for n in diseases):
            avg_conf = sum(confs) / len(confs)
            messages[pid] = (
                f"Plant {pid}: Healthy detected with average confidence {avg_conf * 100:.1f}%. "
                "No treatment necessary; maintain standard care."
            )
        else:
            # Multiple diseases might appear; we just join all messages
            messages[pid] = f"Plant {pid}: " + " ".join(agg_msgs)
    return messages

def get_detections_from_images(model, image_list, conf_thresh=0.25):
    detections = []
    results = model.predict(source=image_list, conf=conf_thresh)
    
    for idx, res in enumerate(results):
        plant_id = f"plant_{idx}"
        if res.boxes is not None and len(res.boxes) > 0:
            for box in res.boxes:
                class_id = int(box.cls.cpu().numpy()[0])
                conf = float(box.conf.cpu().numpy()[0])
                detections.append({"plant_id": plant_id, "class_id": class_id, "confidence": conf})
        else:
            detections.append({"plant_id": plant_id, "class_id": None, "confidence": None})
    return detections, results

###############################################################################
# 2. Global Variables: load model, load data, ID->Name, Name->Code
###############################################################################

app = FastAPI()

# Enable CORS if your frontend is on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your YOLO model once at startup
model_path = "best.pt"  # Adjust this to your actual path if needed
model = YOLO(model_path)

# Load your treatment JSON once
treatment_data_path = "treatments.json"  # Adjust if in a different location
treatment_data = load_treatment_data(treatment_data_path)

# Mappings
id_to_name = {
    0: "Apple___Apple_scab", 1: "Apple___Black_rot", 2: "Apple___Cedar_apple_rust",
    3: "Apple___healthy", 4: "Blueberry___healthy", 5: "Cherry___Powdery_mildew",
    6: "Cherry___healthy", 7: "Corn___Cercospora_leaf_spot Gray_leaf_spot", 8: "Corn___Common_rust",
    9: "Corn___Northern_Leaf_Blight", 10: "Corn___healthy", 11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)", 13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy", 15: "Orange___Haunglongbing_(Citrus_greening)", 16: "Peach___Bacterial_spot",
    17: "Peach___healthy", 18: "Pepper,_bell___Bacterial_spot", 19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight", 21: "Potato___Late_blight", 22: "Potato___healthy",
    23: "Raspberry___healthy", 24: "Soybean___healthy", 25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch", 27: "Strawberry___healthy", 28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight", 30: "Tomato___Late_blight", 31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot", 33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot", 35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus", 37: "Tomato___healthy"
}
name_to_code = {
    "Apple___Apple_scab": "APAS", "Apple___Black_rot": "APBR",
    "Apple___Cedar_apple_rust": "APCR", "Apple___healthy": "APHE",
    "Blueberry___healthy": "BLHE", "Cherry___Powdery_mildew": "CHPM",
    "Cherry___healthy": "CHHE", "Corn___Cercospora_leaf_spot Gray_leaf_spot": "CCGL",
    "Corn___Common_rust": "CCOR", "Corn___Northern_Leaf_Blight": "CNLB",
    "Corn___healthy": "CNHE", "Grape___Black_rot": "GRBR",
    "Grape___Esca_(Black_Measles)": "GRES", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": "GRLB",
    "Grape___healthy": "GRHE", "Orange___Haunglongbing_(Citrus_greening)": "ORHL",
    "Peach___Bacterial_spot": "PCBS", "Peach___healthy": "PCHE",
    "Pepper,_bell___Bacterial_spot": "PBBP", "Pepper,_bell___healthy": "PBHE",
    "Potato___Early_blight": "PTEB", "Potato___Late_blight": "PTLB",
    "Potato___healthy": "PTHE", "Raspberry___healthy": "RAHE",
    "Soybean___healthy": "SOHE", "Squash___Powdery_mildew": "SQPM",
    "Strawberry___Leaf_scorch": "STLS", "Strawberry___healthy": "STHE",
    "Tomato___Bacterial_spot": "TMBS", "Tomato___Early_blight": "TMEB",
    "Tomato___Late_blight": "TMLB", "Tomato___Leaf_Mold": "TMLM",
    "Tomato___Septoria_leaf_spot": "TMSL", "Tomato___Spider_mites Two-spotted_spider_mite": "TMSM",
    "Tomato___Target_Spot": "TMTS", "Tomato___Tomato_Yellow_Leaf_Curl_Virus": "TMYC",
    "Tomato___Tomato_mosaic_virus": "TMMV", "Tomato___healthy": "TMHE"
}

###############################################################################
# 3. FastAPI Endpoint: Accept images & environment data, return results
###############################################################################

@app.post("/analyze")
async def analyze_plant_images(
    files: List[UploadFile] = File(...),
    humidity: float = Form(...),
    temperature: float = Form(...),
    pH: float = Form(...),
    conf_thresh: float = Form(0.25)
):
    """
    Accept multiple images (files) + environment conditions.
    Return disease detection messages + annotated images.
    """
    # 1) Convert each UploadFile to a NumPy array
    image_list = []
    for f in files:
        file_bytes = await f.read()
        np_arr = np.frombuffer(file_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        if image is not None:
            image_list.append(image)

    # 2) If no valid images, return early
    if not image_list:
        return {"error": "No valid images provided."}

    # 3) Use YOLO to detect diseases
    detections, results = get_detections_from_images(model, image_list, conf_thresh=conf_thresh)

    # 4) Build environment dict
    env_conditions = {
        "humidity": humidity,
        "temperature": temperature,
        "pH": pH
    }

    # 5) Generate custom messages
    custom_messages = generate_custom_messages(
        detections,
        env_conditions,
        treatment_data=treatment_data,
        id_to_name=id_to_name,
        name_to_code=name_to_code
    )

    # 6) Annotate images (optional)
    annotated_images = []
    for res in results:
        annotated_img = res.plot()  # YOLO bounding boxes on the image
        _, buffer = cv2.imencode(".jpg", annotated_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")
        annotated_images.append(img_base64)

    # 7) Return JSON with messages + base64 images
    return {
        "messages": custom_messages,
        "annotatedImages": annotated_images
    }
