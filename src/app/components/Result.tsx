'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Correct import for useSearchParams

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherDescriptions: string[];
  weatherIcon: string;
}

export default function Result() {
  const searchParams = useSearchParams();
  const location = searchParams.get('location');
  const soilType = searchParams.get('soilType');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (location) {
      const fetchWeatherData = async () => {
        try {
          setIsLoading(true);
          setIsError(false);

          // Fetch weather data from the weatherstack API route
          const response = await fetch(`/api/weather?city=${encodeURIComponent(location)}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch weather data: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          setIsError(true);
          console.error('Error fetching weather data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchWeatherData();
    }
  }, [location]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4">Result</h2>

      <div className="bg-white p-4 rounded-lg shadow-md w-96">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Soil Type:</strong> {soilType}</p>
      </div>

      <div className="mt-6">
        {isError ? (
          <p className="text-red-600">Error fetching weather data. Please try again.</p>
        ) : weatherData ? (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p><strong>Temperature:</strong> {weatherData.temperature} °C</p>
            <p><strong>Humidity:</strong> {weatherData.humidity}%</p>
            <p><strong>Weather:</strong> {weatherData.weatherDescriptions.join(', ')}</p>
            <img src={weatherData.weatherIcon} alt="Weather icon" className="w-16 h-16" />
          </div>
        ) : (
          <p>No weather data available</p>
        )}
      </div>
    </div>
  );
}
