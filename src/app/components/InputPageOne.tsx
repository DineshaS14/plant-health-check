"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPageOne() {
  const [images, setImages] = useState<File[]>([]);
  const [plantType, setPlantType] = useState("");
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newImages = [...images, ...Array.from(event.target.files)].slice(0, 5);
      setImages(newImages);
    }
  };

  const handleSubmit = () => {
    router.push("/inputPageTwo");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Upload Plant Images</h2>
        {/* File Upload Label (Dynamic Text) */}
      {images.length < 5 ? (
        <p className="text-gray-600 mb-2">
          Choose up to {5 - images.length} {5 - images.length === 1 ? "file" : "files"}
        </p>
      ) : (
        <p className="text-green-600 font-medium">All 5 images uploaded! Pick a plant type to proceed.</p>
      )}
      {/* Image Upload Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Image Preview Squares */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center bg-gray-100"
          >
            {images[index] ? (
              <img
                src={URL.createObjectURL(images[index])}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">+</span>
            )}
          </div>
        ))}
      </div>

      {/* Select Plant Type */}
      <select
        className="border p-2 mb-4 rounded-md"
        onChange={(e) => setPlantType(e.target.value)}
      >
        <option value="">Select Plant Type</option>
        <option value="">Select Plant Type</option>
  <option value="apple">Apple Plant</option>
  <option value="cherry">Cherry Plant</option>
  <option value="blueberry">Blueberry Plant</option>
  <option value="corn">Corn Plant</option>
  <option value="grape">Grape Plant</option>
  <option value="peach">Peach Plant</option>
  <option value="potato">Potato Plant</option>
  <option value="raspberry">Raspberry Plant</option>
  <option value="strawberry">Strawberry Plant</option>
  <option value="tomato">Tomato Plant</option>
      </select>

      {/* Submit Button */}
      <button
        className="bg-green-700 text-white px-6 py-2 rounded-lg"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
