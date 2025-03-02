"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPageOne() {
  const [images, setImages] = useState<File[]>([]);
  const [plantType, setPlantType] = useState("");
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)].slice(0, 5));
    }
  };

  const handleSubmit = () => {
    router.push("/inputPageTwo");
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Upload Plant Images</h2>
      <input type="file" multiple onChange={handleImageUpload} className="mb-4" />

      <select
        className="border p-2 mb-4 rounded-md"
        onChange={(e) => setPlantType(e.target.value)}
      >
        <option value="">Select Plant Type</option>
        <option value="tomato">Tomato Plant</option>
        <option value="potato">Potato Plant</option>
      </select>

      <button
        className="bg-green-700 text-white px-6 py-2 rounded-lg"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
