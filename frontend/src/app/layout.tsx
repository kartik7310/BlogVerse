
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AppProvider } from "./context/appContext";



export const metadata: Metadata = {
  title: "BlogVerse",
  description: "explore your ideas by blog ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
        
          {children}
        </AppProvider>
      </body>
    </html>
  );
}