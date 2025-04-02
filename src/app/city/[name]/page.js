"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; 
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function CityDetail() {
  const params = useParams(); // ✅ Correct way to fetch dynamic params in App Router
  const name = decodeURIComponent(params?.name || ""); // ✅ Handle encoding issues

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    async function fetchWeather() {
      try {
        if (!name) return;

        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&units=metric`
        );
        if (!res.ok) throw new Error("Failed to fetch weather data");

        const data = await res.json();
        setWeather(data);

        // Simulated historical weather data (replace with actual API if available)
        setHistoricalData([
          { day: "Day 1", temp: data.main.temp - 2 },
          { day: "Day 2", temp: data.main.temp - 1 },
          { day: "Day 3", temp: data.main.temp },
          { day: "Day 4", temp: data.main.temp + 1 },
          { day: "Day 5", temp: data.main.temp + 2 },
        ]);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchWeather();
  }, [name]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">🌦 Weather Details - {name}</h1>
      {weather ? (
        <div className="border p-4 rounded">
          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌍 Condition: {weather.weather && weather.weather[0]?.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Weather History Chart */}
      {historicalData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">📊 Temperature Trend (Past Days)</h2>
          <Line
            data={{
              labels: historicalData.map((entry) => entry.day),
              datasets: [
                {
                  label: "Temperature (°C)",
                  data: historicalData.map((entry) => entry.temp),
                  borderColor: "blue",
                  backgroundColor: "rgba(0, 0, 255, 0.2)",
                  fill: true,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}
