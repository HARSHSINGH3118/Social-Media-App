// src/components/AppLayout.jsx
"use client";

import { SocketProvider } from "@/contexts/SocketContext";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <SocketProvider>
      <div className="flex h-screen    bg-gray-100 text-gray-900">
        {/* Sidebar – fixed, never scrolls */}
        <aside className="w-64 flex-shrink-0 h-full overflow-hidden">
          <Sidebar />
        </aside>

        {/* Main content – scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  );
}
