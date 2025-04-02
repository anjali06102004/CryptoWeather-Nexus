"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [favorites, setFavorites] = useState(["New York", "Tokyo"]);
  const [weatherCities, setWeatherCities] = useState(["New York", "London", "Tokyo"]);
  const [cryptoData, setCryptoData] = useState(null);
  const [news, setNews] = useState([]);
  const [newCity, setNewCity] = useState("");

  // ✅ Add new city (fixed)
  const addCity = () => {
    if (newCity.trim() !== "" && !weatherCities.includes(newCity)) {
      setWeatherCities([...weatherCities, newCity.trim()]);
      setNewCity("");
    }
  };

  // ✅ Remove city (optimized)
  const removeCity = (city) => {
    setWeatherCities(weatherCities.filter((c) => c !== city));
  };

  // ✅ Fetch Cryptocurrency Data
  useEffect(() => {
    async function fetchCrypto() {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
        );
        if (!res.ok) throw new Error("Failed to fetch crypto data");

        const data = await res.json();
        setCryptoData(data);
      } catch (error) {
        setCryptoData(null);
      }
    }
    fetchCrypto();
  }, []);

  // ✅ Fetch News Data
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          "https://newsdata.io/api/1/news?apikey=pub_77788ffd151a7e7c03c759b030a1debce66f1&q=crypto&language=en"
        );
        if (!res.ok) throw new Error("Failed to fetch news");

        const data = await res.json();
        setNews(data.results.slice(0, 5)); // Limit to 5 articles
      } catch (error) {
        setNews([]);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold text-white text-center">🌍 Dashboard</h1>

      {/* Favorites Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">⭐ Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-400">No favorites added</p>
        ) : (
          <div className="flex flex-wrap gap-3 mt-3">
            {favorites.map((city, index) => (
              <div key={index} className="flex items-center bg-gray-700 px-4 py-2 rounded-lg shadow">
                <span className="text-white">{city}</span>
                <button
                  onClick={() => setFavorites(favorites.filter((fav) => fav !== city))}
                  className="ml-3 text-red-400 hover:text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weather Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">🌦 Weather</h2>
        <div className="flex gap-3 mt-3">
          <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-400 w-full"
            placeholder="Enter city name"
          />
          <button onClick={addCity} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white">
            ➕ Add
          </button>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {weatherCities.map((city, index) => (
            <li key={index} className="flex justify-between bg-gray-700 p-3 rounded-lg shadow">
              <span className="text-white">{city}</span>
              <button onClick={() => removeCity(city)} className="text-red-400 hover:text-red-500">
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Cryptocurrency Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">💰 Cryptocurrency</h2>
        {cryptoData ? (
          <div className="flex flex-wrap gap-6 mt-3 text-white">
            <p>
              Bitcoin: <span className="text-yellow-400">${cryptoData.bitcoin.usd}</span>
            </p>
            <p>
              Ethereum: <span className="text-green-400">${cryptoData.ethereum.usd}</span>
            </p>
          </div>
        ) : (
          <p className="text-gray-400">No cryptocurrency data available.</p>
        )}
      </div>

      {/* News Section */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-white">📰 News</h2>
        <ul className="space-y-3 mt-3">
          {news.length > 0 ? (
            news.map((article, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition">
                <a href={article.link} target="_blank" className="text-blue-400 hover:underline">
                  {article.title}
                </a>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No news available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
