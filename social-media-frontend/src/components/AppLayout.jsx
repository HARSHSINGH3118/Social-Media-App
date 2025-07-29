"use client";

import { SocketProvider } from "@/contexts/SocketContext";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }) {
  return (
    <SocketProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">
        {/* Sidebar on the left */}
        <Sidebar />

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </SocketProvider>
  );
}
