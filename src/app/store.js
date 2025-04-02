import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../features/weatherSlice";
import cryptoReducer from "../features/cryptoSlice";
import newsReducer from "../features/newsSlice";
import favoritesReducer from "../features/favoritesSlice";
import notificationsReducer from "../features/notificationsSlice"; // ✅ Import notifications slice

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    favorites: favoritesReducer,
    notifications: notificationsReducer, // ✅ Add notifications to store
  },
});

export default store;
