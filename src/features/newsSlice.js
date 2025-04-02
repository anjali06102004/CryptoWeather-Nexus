import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Replace with your API key
const API_KEY = "pub_77788ffd151a7e7c03c759b030a1debce66f1"; 
const NEWS_API_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=crypto&language=en`;

// ✅ Create async thunk for fetching news
export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  try {
    const response = await fetch(NEWS_API_URL);
    if (!response.ok) throw new Error("Failed to fetch news");

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("No news available");
    }

    return data.results;
  } catch (error) {
    throw new Error(error.message || "Error fetching news");
  }
});


const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

//  Export the function properly
export default newsSlice.reducer;
