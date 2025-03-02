"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface WeatherData {
  temperature: number;
  humidity: number;
  // Add other fields if your /api/weather returns more
}

export default function InputPage() {
  // States
  const [images, setImages] = useState<File[]>([]);
  const [location, setLocation] = useState("");
  const [pH, setPh] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Handle up to 5 images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = [
        ...images,
        ...Array.from(e.target.files)
      ].slice(0, 5);
      setImages(newImages);
    }
  };

  // 1) Fetch weather from Next.js API
  const handleFetchWeather = async () => {
    if (!location) {
      setError("Please enter a location.");
      return;
    }
    try {
      setIsFetchingWeather(true);
      setError(null);

      const res = await fetch(`/api/weather?city=${encodeURIComponent(location)}`);
      if (!res.ok) {
        throw new Error(`Weather API error: ${res.status}`);
      }
      const data = await res.json();
      console.log("Weather data:", data);
      setWeatherData(data);
    } catch (err: any) {
      console.error("Failed to fetch weather:", err);
      setError("Failed to fetch weather data. Check console for details.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  // 2) Submit to Python server
  const handleSubmit = async () => {
    try {
      if (!weatherData) {
        setError("Please fetch weather data before submitting.");
        return;
      }
      setError(null);

      // Build the FormData
      const formData = new FormData();
      images.forEach((file) => {
        formData.append("files", file);
      });

      // If your Python code also wants location, you can pass that too
      formData.append("location", location);

      // pH is optional, but pass it anyway (empty if not set)
      formData.append("pH", pH);

      // Append weather data
      formData.append("humidity", String(weatherData.humidity));
      formData.append("temperature", String(weatherData.temperature));

      // POST to your main.py endpoint
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errText}`);
      }

      const result = await response.json();
      console.log("Python server response:", result);

      // Optionally store in local storage so the /result page can pick it up
      localStorage.setItem("analysisData", JSON.stringify(result));

      // Navigate to /result
      router.push("/result");
    } catch (err: any) {
      console.error("Submission error:", err);
      setError(err.message || "Error submitting data to the server.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">
        Upload Diseased Plant Images
      </h2>
	<h4>Try to use only the diseased leaf for best results</h4>
      {/* Location Input */}
      <input
        type="text"
        className="border p-2 mb-2 rounded-md w-64"
        placeholder="Enter Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {/* Fetch Weather Button */}
      <button
        onClick={handleFetchWeather}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
        disabled={isFetchingWeather}
      >
        {isFetchingWeather ? "Fetching..." : "Fetch Weather"}
      </button>

      {/* Show Weather Info */}
      {weatherData && (
        <div className="border border-gray-200 rounded p-4 w-64 mb-4">
          <p><strong>Temperature:</strong> {weatherData.temperature} °C</p>
          <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
        </div>
      )}

      {/* pH Input (Optional) */}
      <input
        type="number"
        className="border p-2 mb-4 rounded-md w-64"
        placeholder="Enter pH (Optional)"
        value={pH}
        onChange={(e) => setPh(e.target.value)}
      />

      {/* Image Upload */}
      {images.length < 5 ? (
        <p className="text-gray-600 mb-2">
          Choose up to {5 - images.length}{" "}
          {5 - images.length === 1 ? "file" : "files"}
        </p>
      ) : (
        <p className="text-green-600 mb-2">All 5 images uploaded!</p>
      )}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Preview squares */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center bg-gray-100"
          >
            {images[idx] ? (
              <img
                src={URL.createObjectURL(images[idx])}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">+</span>
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 mb-2">{error}</p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-green-700 text-white px-6 py-2 rounded-lg"
      >
        Submit
      </button>
    </div>
  );
}
