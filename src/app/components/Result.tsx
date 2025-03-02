"use client";

import { useEffect, useState } from "react";

interface AnalysisData {
  messages: Record<string, string>;
  annotatedImages: string[];
}

export default function ResultPage() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisData");
    if (stored) {
      setAnalysisData(JSON.parse(stored));
    }
  }, []);

  if (!analysisData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p>No analysis data found. Please go back and run the analysis.</p>
      </div>
    );
  }

  const { messages, annotatedImages } = analysisData;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Analysis Results</h1>

      {/* Container to hold both sections side by side */}
      <div className="flex flex-row items-start w-full max-w-5xl space-x-6">

        {/* 1. Render Disease/Treatment Messages */}
        <div className="bg-white p-4 rounded-md shadow-md w-1/2">
          <h2 className="text-xl font-semibold mb-2">Disease Messages</h2>
          {Object.entries(messages).map(([plantId, message]) => (
            <div key={plantId} className="mb-2">
              <strong>{plantId}:</strong> {message}
            </div>
          ))}
        </div>

        {/* 2. Render Annotated Images (Base64) */}
        <div className="bg-white p-4 rounded-md shadow-md w-1/2">
          <h2 className="text-xl font-semibold mb-2">Annotated Images</h2>
          {annotatedImages.length === 0 ? (
            <p>No annotated images returned.</p>
          ) : (
            annotatedImages.map((imgBase64, idx) => (
              <img
                key={idx}
                src={`data:image/jpg;base64,${imgBase64}`}
                alt={`Annotated result ${idx}`}
                className="mb-4 border rounded"
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
