# 🌿 Plant Disease Detector  

<iframe width="560" height="315" src="https://www.youtube.com/embed/zMcpogar-SM?si=H_KJ4w0yVnZvvHce" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Overview  

This is a **React (Next.js) with TypeScript** frontend for a **Plant Disease Detection** application. The UI allows users to:  

- Upload images of affected plant leaves.  
- Use the **city name** to fetch **humidity** and **temperature** data.  
- Send this data, along with soil type and images, to **FastAPI (Python backend)** for **YOLO-based** plant disease analysis.  
- Receive **diagnostic results** and **treatment recommendations**, which are displayed in the **Result Component**.  

## 🚀 Tech Stack  

### **Framework & Language**  
- **Next.js** (Server-side rendering & static generation)  
- **TypeScript** (Static typing for better maintainability)  
- **FastAPI** (Python backend for model inference and API communication)  

### **Styling**  
- **TailwindCSS** (Utility-first CSS framework for responsive UI)  

### **State Management**  
- **useState (React Hooks)** (For managing image uploads & selections)  
- _(Future plans: Zustand or Redux for advanced state management)_  

### **Image Handling**  
- **`<input type="file">`** for image uploads  
- **`next/image`** for optimized rendering  

### **Machine Learning Integration**  
- **YOLOv8** (Trained on **PlantVillage Dataset** for Object Detection)  
- **FastAPI** server to process image inputs, run inference, and return results  
- **JSON mapping** for disease-specific treatments, factoring in environmental conditions  

### **Routing**  
- **Next.js Router (`useRouter()`)** for handling navigation  

## 🌱 **Inspiration**  
Many **small-scale farmers** and **home gardeners** struggle with **early plant disease detection**. Our goal is to **reduce crop losses** and **provide actionable insights** with minimal effort.  

## 🌟 **Features**  

- 📸 **Upload plant leaf images**  
- 📍 **Auto-fill location & soil type**  
- 🔍 **AI-powered disease detection**  
- 🌡️ **Fetch real-time weather conditions**  
- 🩺 **Get personalized treatment recommendations**  

## 🛠 **How We Built It**  

1. **Trained a YOLO model** on the **PlantVillage Object Detection Dataset** from Kaggle.  
2. **Created a JSON file** mapping **diseases** to **recommended treatments** based on environmental data.  
3. **Integrated FastAPI** to handle **image processing & model inference**.  
4. **Built a Next.js frontend** for a seamless **user experience**.  

## 🔥 **Challenges We Faced**  

- Ensuring **high accuracy** for diverse diseases & similar symptoms.  
- Handling **low-confidence detections** when images were blurry or incomplete.  
- Fine-tuning the **YOLO model** to **generalize well** beyond the training set.  

## 🎉 **Accomplishments**  

✅ Achieved **98% precision & recall** on test data.  
✅ Delivered **real-time disease detection** within **seconds**.  
✅ Provided **context-aware treatment** recommendations.  

## 📚 **What We Learned**  

- **Data augmentation** is key for real-world accuracy.  
- **Mapping model outputs** to specific treatments via a **JSON structure** improves usability.  
- **Optimizing FastAPI performance** to handle multiple image uploads efficiently.  

## 🚀 **Future Plans**  

🔹 **Expand support for more plant species & diseases.**  
🔹 **Enhance model performance for broader input types (e.g., full plant images).**  
🔹 **Build a mobile-friendly version for instant on-the-go detection.**  
🔹 **Fix backend connectivity issues for a smoother user experience.**  

## 🏗 **How to Run Locally**  

### **Clone the Repository:**  
```sh
git clone https://github.com/your-repo-url.git

cd plant-disease-frontend

npm install 

npm run dev

Open the app in your browser at http://localhost:3000

## 🎯 How It Works (Backend Integration Flow)

1. **User uploads plant images** & selects the **tree type**.  
2. **Location & soil type** are entered.  
3. **Weather API** fetches **temperature & humidity** based on location.  
4. **Data is sent to FastAPI backend** for processing.  
5. **FastAPI calls `final.py`**, which:  
   - 📸 Runs the **YOLO model** on images.  
   - 🌡 Uses **environmental data** (humidity, temperature, soil pH) to adjust recommendations.  
   - 🩺 Returns **disease diagnosis & treatment options**.  
6. **Results are displayed** on the frontend with:  
   - ✅ **Detected Disease Name**  
   - 💊 **Recommended Treatment**  
   - 📊 **Confidence Score**  
   - 🌍 **Environmental Factors Considered**  

🚀 **Fast, accurate, and user-friendly plant disease detection!**

⚡ Contributors
🚀 Your Name (@DineshaS14)
🔗 LinkedIn: https://www.linkedin.com/in/dineshas14/

⭐ Support & Contributions
If you find this project useful, consider giving it a ⭐ on GitHub!

📩 Open Issues & PRs Welcome!

References: 
https://www.kaggle.com/datasets/sebastianpalaciob/plantvillage-for-object-detection-yolo

