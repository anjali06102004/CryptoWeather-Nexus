import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addNotification } from "./notificationsSlice"; // ✅ Import notifications

// Replace with your API key
const API_KEY = "abdc771b305c9c9c2af99f0cf4ac66af";
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${API_KEY}&units=metric`;

// Async thunk for fetching weather data
export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async () => {
  const response = await fetch(WEATHER_API_URL);
  const data = await response.json();
  return data;
});

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    weather: null,
    loading: false,
    error: null,
    weatherAlert: null, // State for weather alerts
  },
  reducers: {
    setWeatherAlert: (state, action) => {
      state.weatherAlert = action.payload; // ✅ Store alert in state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.weather = action.payload;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Action creator for setting alerts
export const { setWeatherAlert } = weatherSlice.actions;

// ✅ Function to simulate weather alerts & dispatch notifications
export const simulateWeatherAlerts = () => (dispatch) => {
  setInterval(() => {
    const mockAlert = {
      city: "New York",
      alert: "⚠️ Heavy Rain Expected 🌧️",
    };

    dispatch(setWeatherAlert(mockAlert)); // ✅ Store in Redux state

    // ✅ Dispatch a notification
    dispatch(
      addNotification({
        type: "weather_alert",
        message: `🌧️ Weather Alert: ${mockAlert.alert} in ${mockAlert.city}`,
      })
    );
  }, 30000);
};

export default weatherSlice.reducer;
