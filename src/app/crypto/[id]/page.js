"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../features/favoriteSlice";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function CryptoDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites?.favorites || []);
  const [cryptoData, setCryptoData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCryptoDetails() {
      try {
        // Fetch current crypto details
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
        if (!res.ok) throw new Error("Failed to fetch crypto details");
        
        const data = await res.json();
        setCryptoData(data);

        // Fetch historical data for past 7 days
        const historyRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7`
        );
        if (!historyRes.ok) throw new Error("Failed to fetch historical data");

        const historyData = await historyRes.json();
        setHistoricalData(historyData.prices.map(([timestamp, price]) => ({ date: new Date(timestamp).toLocaleDateString(), price })));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCryptoDetails();
  }, [id]);

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">📈 {cryptoData?.name} Details</h1>
      {cryptoData ? (
        <div className="border p-4 rounded">
          <p>💰 Current Price: ${cryptoData.market_data.current_price.usd}</p>
          <p>📉 24h Change: {cryptoData.market_data.price_change_percentage_24h}%</p>
          <p>🏦 Market Cap: ${cryptoData.market_data.market_cap.usd}</p>

          {/* Favorite Button */}
          <button
            onClick={() =>
              favorites.some((fav) => fav.id === id)
                ? dispatch(removeFavorite(id))
                : dispatch(addFavorite({ id, name: cryptoData.name }))
            }
            className={`mt-4 px-4 py-2 rounded ${
              favorites.some((fav) => fav.id === id) ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {favorites.some((fav) => fav.id === id) ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {/* Price History Chart */}
      {historicalData.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">📊 7-Day Price Trend</h2>
          <Line
            data={{
              labels: historicalData.map((entry) => entry.date),
              datasets: [
                {
                  label: "Price (USD)",
                  data: historicalData.map((entry) => entry.price),
                  borderColor: "green",
                  backgroundColor: "rgba(0, 255, 0, 0.2)",
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
