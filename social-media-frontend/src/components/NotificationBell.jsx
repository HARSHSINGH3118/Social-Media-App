"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const socket = useSocket();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("notification", (notification) => {
      console.log("📥 Received notification:", notification);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, user]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setUnreadCount(0); // Reset count on open
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={toggleDropdown}
        className="relative hover:text-yellow-400 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-xl z-50 border border-gray-200">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm px-4 py-3">No notifications</p>
          ) : (
            notifications.map((notif, index) => (
              <Link
                key={index}
                href={notif.post_id ? `/posts/${notif.post_id}` : "#"}
                className="block px-4 py-3 hover:bg-gray-100 transition"
              >
                <div className="flex items-start gap-3">
                  {/* Placeholder Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />

                  {/* Message & Timestamp */}
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold text-black">
                        {notif.sender_name || "Someone"}
                      </span>{" "}
                      <span className="text-pink-600">
                        {notif.message || notif.type || "sent you a message"}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {notif.created_at
                        ? new Date(notif.created_at).toLocaleString()
                        : "Just now"}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
