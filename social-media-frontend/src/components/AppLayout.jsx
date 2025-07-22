// src/components/AppLayout.jsx
"use client";

import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="px-4">{children}</main>
    </div>
  );
}
