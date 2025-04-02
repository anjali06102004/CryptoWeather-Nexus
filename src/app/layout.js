"use client";
import { Provider } from "react-redux";
import store from "../app/store"; // Import your Redux store
import './globals.css';


export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
