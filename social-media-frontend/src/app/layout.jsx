// src/app/layout.jsx
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar"; // ✅ optional

export const metadata = {
  title: "Social Media App",
  description: "Login to get started",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
