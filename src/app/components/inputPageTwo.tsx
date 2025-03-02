// InputPageTwo.tsx
'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InputPageTwo() {
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    router.push(`/result?location=${encodeURIComponent(location)}&soilType=${encodeURIComponent(soilType)}`);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-green-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>

      <input
        type="text"
        placeholder="Enter Location"
        className="border p-2 rounded-md w-64 mb-4"
        onChange={(e) => setLocation(e.target.value)}
      />

      <select
        className="border p-2 mb-4 rounded-md w-64"
        onChange={(e) => setSoilType(e.target.value)}
      >
        <option value="">Select Soil Type</option>
        <option value="loamy">Loamy Soil - Ideal for plant growth</option>
        <option value="sandy">Sandy Soil - Drains quickly</option>
        <option value="peaty">Peaty Soil - Rich in organic matter</option>
        <option value="silty">Silty Soil - Smooth and fertile</option>
        <option value="chalky">Chalky Soil - Alkaline and rocky</option>
        <option value="clay">Clay Soil - Dense and rich in nutrients</option>
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
