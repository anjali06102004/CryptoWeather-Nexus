# CryptoWeather Nexus

CryptoWeather Nexus is a multi-page dashboard that integrates **weather data**, **cryptocurrency information**, and **real-time notifications** to provide users with an interactive experience. Built using **Next.js, React, Redux, WebSockets, and Tailwind CSS**, this project offers real-time insights and data visualization.

## 🚀 Features
- **Real-time Weather Updates**: Fetch current weather details for cities.
- **Cryptocurrency Tracking**: Monitor real-time crypto prices and market trends.
- **Historical Data Visualization**: View weather and crypto trends over time.
- **Custom Alerts & Notifications**: Get alerts based on market or weather changes.
- **Responsive UI**: Fully optimized for mobile and desktop views.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), React, Redux
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Data Fetching**: REST APIs (Weather API, Crypto API)
- **Real-time Updates**: WebSockets
- **Deployment**: Vercel

## 📂 Project Structure
```
crypto-weather-nexus/
│── public/           # Static assets
│── src/
│   ├── app/         # Next.js App Router pages
│   │   ├── dashboard/
│   │   ├── city/[name]/
│   │   ├── crypto/[id]/
│   ├── components/  # Reusable UI components
│   ├── features/    # Redux slices for state management
│   ├── utils/       # Helper functions
│── .env.local       # Environment variables
│── package.json     # Dependencies and scripts
│── tailwind.config.js # Tailwind CSS config
│── next.config.js   # Next.js configuration
```

## 🔧 Setup Instructions
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/anjali06102004/CryptoWeather-Nexus.git
cd CryptoWeather-Nexus
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env.local` file in the root directory and add your API keys:
```env
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_CRYPTO_API_KEY=your_crypto_api_key
```

### **4️⃣ Run the Development Server**
```sh
npm run dev
```
- The app will be available at `http://localhost:3000`

### **5️⃣ Build for Production**
```sh
npm run build
```

### **6️⃣ Deploy to Vercel**
```sh
vercel --prod
```

## 🎨 Design Decisions
### **1️⃣ Next.js for Performance & SEO**
- Uses **App Router** for server-side rendering and dynamic routing.
- Optimized for fast loading times.

### **2️⃣ Redux for State Management**
- Stores weather and crypto data efficiently.
- Enables **real-time updates** via WebSockets.

### **3️⃣ Tailwind CSS for UI**
- Faster styling with utility classes.
- Fully **responsive** for all devices.

### **4️⃣ WebSockets for Live Data**
- Provides **real-time price and weather updates** without refreshing the page.

## 📌 Future Improvements
- 🌍 **Multi-language support**
- 📈 **More chart visualizations** for data analysis
- 🔔 **User-customized alerts** based on preferences

## 📜 License
This project is open-source under the [MIT License](LICENSE).

---
Made with ❤️ by Anjali Kumari 🚀

