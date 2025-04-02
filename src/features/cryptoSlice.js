import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addNotification } from "./notificationsSlice";

// Replace CoinCap API Key
const API_KEY = "123f31f7-65fc-43d2-b8c3-1c77eaa6b623";
const API_URL = "https://api.coincap.io/v2/assets";

// Fetch initial crypto data
export const fetchCryptoData = createAsyncThunk("crypto/fetchCrypto", async () => {
  const response = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });
  const data = await response.json();
  return data.data.slice(0, 3); // Get top 3 cryptocurrencies
});

const initialState = {
    crypto: [], // Ensures crypto is always an array
    loading: false,
    error: null,
  };
  
// Create a slice for crypto data
const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    cryptos: [],
    cryptoPrices: {}, // Stores live prices
    status: "idle",
    error: null,
  },
  reducers: {
    updateCryptoPrices: (state, action) => {
      const newPrices = action.payload;

      Object.keys(newPrices).forEach((cryptoId) => {
        const oldPrice = state.cryptoPrices[cryptoId];
        const newPrice = newPrices[cryptoId];

        if (oldPrice) {
          const priceChange = Math.abs((newPrice - oldPrice) / oldPrice) * 100;

          // 🔥 Notify if price change is >5%
          if (priceChange >= 5) {
            action.asyncDispatch(
              addNotification({
                type: "price_alert",
                message: `🚀 ${cryptoId.toUpperCase()} price changed by ${priceChange.toFixed(2)}%!`,
              })
            );
          }
        }
      });

      state.cryptoPrices = { ...state.cryptoPrices, ...newPrices }; // Merge new prices
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cryptos = action.payload;
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Action to update live prices
export const { updateCryptoPrices } = cryptoSlice.actions;

// WebSocket function for live price updates
export const connectCryptoWebSocket = () => (dispatch) => {
  const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,cardano");

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    dispatch(updateCryptoPrices(data)); // Dispatch price update
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  ws.onclose = () => {
    console.warn("WebSocket closed. Attempting to reconnect...");
    setTimeout(() => dispatch(connectCryptoWebSocket()), 5000); // Auto-reconnect after 5 sec
  };
};

export default cryptoSlice.reducer;
