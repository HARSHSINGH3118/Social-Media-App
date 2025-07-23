// src/app/messages/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";

export default function MessagesListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // Fetch all users (excluding yourself)
  useEffect(() => {
    async function fetchUsers() {
      try {
        // GET http://<HOST>:5000/api/users
        const res = await api.get("/api/users");
        setUsers(res.data.users || res.data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    }
    fetchUsers();
  }, []);

  // Listen for online‐users from Socket.IO
  useEffect(() => {
    if (!socket || !user) return;
    socket.on("user_online", (list) => {
      setOnlineUsers(list);
    });
    return () => {
      socket.off("user_online");
    };
  }, [socket, user]);

  if (loading || !user) return <p>Loading…</p>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl mb-4 text-white">All Users</h2>
      <ul>
        {users
          .filter((u) => u.id !== user.id)
          .map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer text-white"
              onClick={() => router.push(`/messages/${u.id}`)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span>{u.username}</span>
              </div>
              <span
                className={`w-3 h-3 rounded-full ${
                  onlineUsers.includes(String(u.id))
                    ? "bg-green-500"
                    : "bg-gray-600"
                }`}
              />
            </li>
          ))}
      </ul>
    </div>
  );
}
