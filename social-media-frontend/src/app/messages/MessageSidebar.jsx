"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";

export default function MessageSidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/api/users");
        setUsers(res.data.users || res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchLastMessages() {
      try {
        const res = await api.get("/api/messages/last");
        setLastMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch last messages:", err);
      }
    }
    fetchLastMessages();
  }, []);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join", user.id);
    socket.on("user_online", (list) => setOnlineUsers(list));

    return () => {
      socket.off("user_online");
    };
  }, [socket, user]);

  if (loading || !user)
    return <p className="text-center text-white">Loading…</p>;

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Messages</h2>

      <ul className="space-y-4">
        {users
          .filter((u) => u.id !== user.id)
          .map((u) => {
            const isOnline = onlineUsers.includes(String(u.id));
            const lastMsg = lastMessages[u.id]?.content || "";
            const createdAt = lastMessages[u.id]?.created_at;
            const time = createdAt
              ? new Date(createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <li
                key={u.id}
                onClick={() =>
                  router.push(`/messages?userId=${u.id}`, { scroll: false })
                }
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm hover:shadow-md cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{u.username}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">
                      {lastMsg}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500">{time}</p>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
