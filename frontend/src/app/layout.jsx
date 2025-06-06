"use client";
import { Lato, Roboto } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/store";
import { ToastContainer } from "react-toastify";
import Loader from "@/lib/Loader";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>TASKY</title>
      </head>
      <body className={`${roboto.variable} ${lato.variable} antialiased`}>
        <Provider store={store}>
          {children}
          <ToastContainer theme="dark" />
          <Loader />
        </Provider>
      </body>
    </html>
  );
}
