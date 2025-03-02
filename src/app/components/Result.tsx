'use client';

import { useRouter } from "next/navigation";

export default function Result() {
    const router = useRouter();
  
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <h2 className="text-2xl font-bold mb-4">Diagnosis Result</h2>
        <p className="text-lg text-gray-600 mb-6">Your plant has been analyzed.</p>
  
        <button
          className="bg-green-700 text-white px-6 py-2 rounded-lg mb-4"
          onClick={() => router.push("/")}
        >
          Back to Start
        </button>
      </div>
    );
  } // Result