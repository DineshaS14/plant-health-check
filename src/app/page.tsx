"use client";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-3xl font-bold mb-6">Check Your Fruit's Health</h1>
      <button
        className="px-6 py-3 bg-green-700 text-white rounded-lg"
        onClick={() => router.push("/inputPageOne")}
      >
        Get Started
      </button>
    </div>
  );
}
