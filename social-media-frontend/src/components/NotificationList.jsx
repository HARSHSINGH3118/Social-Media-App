"use client";

import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import api from "@/lib/api";

export default function NotificationList() {
  const socket = useSocket();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const realtimeBuffer = useRef([]);

  // ✅ Merge notifications by ID
  const mergeUnique = (a, b) => {
    const map = new Map();
    [...a, ...b].forEach((n) => n?.id && map.set(n.id, n));
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const res = await api.get("/notifications");
      const serverNotes = res.data.notifications || res.data;
      const merged = mergeUnique(realtimeBuffer.current, serverNotes);
      setNotes(merged);
      realtimeBuffer.current = []; // clear after merge
    } catch (e) {
      console.error("❌ Failed to fetch notifications", e);
    } finally {
      setLoading(false);
    }
  };

  // ✅ On mount
  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // ✅ Real-time update from socket
  // ✅ Store and show real-time notifications immediately
  useEffect(() => {
    if (!socket) return;

    const handler = (notif) => {
      console.log("🟢 RECEIVED notification via socket:", notif);
      setNotes((prev) => {
        const updated = mergeUnique([notif], prev);
        return updated.slice(0, 30); // ✅ Limit to latest 30
      });
    };

    socket.on("notification", handler);
    return () => socket.off("notification", handler);
  }, [socket]);

  // ✅ Refetch on focus/tab change
  useEffect(() => {
    const onFocus = () => fetchNotifications();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleMarkAllRead = async () => {
    setMarking(true);
    try {
      await api.put("/notifications/read");
      setNotes((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const formatText = (n) => {
    switch (n.type) {
      case "message":
        return `sent you: "${n.message}"`; // ✅ SHOW MESSAGE CONTENT
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      default:
        return "sent you a notification";
    }
  };

  if (loading) return <p className="p-4">Loading notifications…</p>;
  if (!notes.length) return <p className="p-4">You have no notifications.</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button
          onClick={handleMarkAllRead}
          disabled={marking}
          className="text-blue-600 hover:underline"
        >
          {marking ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <ul className="space-y-3">
        {notes.slice(0, 10).map((n, idx) => (
          <li
            key={n.id || `notif-${idx}`}
            className={`flex items-start gap-3 p-3 rounded-md border ${
              n.is_read ? "bg-gray-50" : "bg-blue-50 border-blue-300"
            }`}
          >
            <img
              src={n.sender_avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <Link
                href={
                  n.post_id ? `/posts/${n.post_id}` : `/profile/${n.sender_id}`
                }
                className="text-sm"
              >
                <span className="font-semibold">{n.sender_name}</span>{" "}
                {formatText(n)}
              </Link>
              <div className="text-xs text-gray-500">
                {new Date(n.created_at || Date.now()).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
