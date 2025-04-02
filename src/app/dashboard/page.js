import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeatherData, simulateWeatherAlerts } from "../../features/weatherSlice"; 
import { fetchNews } from "../../features/newsSlice";
import { fetchCryptoData, connectCryptoWebSocket } from "../../features/cryptoSlice";
import { addNotification } from "../../features/notificationsSlice";
import Link from "next/link";

export default function Dashboard() {
  const dispatch = useDispatch();
  const cryptoPrices = useSelector((state) => state.crypto.cryptoPrices);
  const weatherAlert = useSelector((state) => state.weather.weatherAlert);
  const news = useSelector((state) => state.news.articles);
  const notifications = useSelector((state) => state.notifications.notifications);

  useEffect(() => {
    dispatch(fetchWeatherData());
    dispatch(fetchNews());
    dispatch(fetchCryptoData());
    dispatch(connectCryptoWebSocket());
    dispatch(simulateWeatherAlerts());

    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const coin = Object.keys(data)[0];
      const newPrice = parseFloat(data[coin]).toFixed(2);

      dispatch(
        addNotification({
          type: "price_alert",
          message: `🔔 ${coin.toUpperCase()} price updated: $${newPrice}`,
        })
      );
    };

    return () => ws.close();
  }, [dispatch]);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">🌍 CryptoWeather Nexus</h1>

      {/* 🔔 Real-Time Notifications */}
      {notifications.length > 0 && (
        <div className="bg-blue-500 text-white p-3 rounded-lg shadow-lg mb-4 transition-all duration-300">
          {notifications.map((notif, index) => (
            <p key={index} className="text-sm font-medium">{notif.message}</p>
          ))}
        </div>
      )}

      {/* Weather Alert */}
      {weatherAlert && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4 shadow-lg animate-pulse">
          🚨 {weatherAlert.alert} in {weatherAlert.city}
        </div>
      )}

      {/* Crypto Live Prices */}
      <h2 className="text-2xl font-bold mt-6 mb-4">💰 Live Cryptocurrency Prices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {["bitcoin", "ethereum", "cardano"].map((coin) => (
          <Link key={coin} href={`/crypto/${coin}`} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition">
            <p className="font-semibold text-lg">{coin.toUpperCase()}</p>
            <p className="text-green-400 text-xl font-bold">
              💲 {cryptoPrices[coin] ? parseFloat(cryptoPrices[coin]).toFixed(2) : "Loading..."}
            </p>
          </Link>
        ))}
      </div>

      {/* News Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">📰 Crypto News</h2>
      <ul className="space-y-2">
        {news.map((article, index) => (
          <li key={index} className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
