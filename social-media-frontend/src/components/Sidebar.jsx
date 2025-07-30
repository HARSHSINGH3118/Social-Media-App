// src/components/Sidebar.jsx
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import {
  FaHome,
  FaCompass,
  FaComment,
  FaBell,
  FaUser,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const socket = useSocket();

  const [unreadCount, setUnreadCount] = useState(0);

  // Increment counter on every real-time notification
  useEffect(() => {
    if (!socket) return;
    const handler = () => setUnreadCount((c) => c + 1);
    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [socket]);

  // Reset counter when user navigates to /notifications
  useEffect(() => {
    if (pathname === "/notifications") {
      setUnreadCount(0);
    }
  }, [pathname]);

  return (
    <aside
      className="w-64 bg-gray-900 text-white flex flex-col p-4 min-h-screen overflow-hidden
"
    >
      <div
        className="text-3xl font-bold text-blue-400 mb-8 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Huddle
      </div>

      <nav className="flex flex-col gap-6 text-lg">
        <Link
          href="/dashboard"
          className="hover:text-blue-400 flex items-center gap-3"
        >
          <FaHome /> Home
        </Link>
        <Link
          href="/explore"
          className="hover:text-blue-400 flex items-center gap-3"
        >
          <FaCompass /> Explore
        </Link>
        <Link
          href="/create"
          className="hover:text-blue-400 flex items-center gap-3"
        >
          <FaPlus /> Create Post
        </Link>
        <Link
          href="/messages"
          className="hover:text-blue-400 flex items-center gap-3"
        >
          <FaComment /> Messages
        </Link>
        <Link
          href="/notifications"
          className="relative hover:text-blue-400 flex items-center gap-3"
        >
          <FaBell /> Notifications
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link
          href={`/profile/${user?.id}`}
          className="hover:text-blue-400 flex items-center gap-3"
        >
          <FaUser /> Profile
        </Link>
      </nav>

      <button
        onClick={logout}
        className="mt-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
}
