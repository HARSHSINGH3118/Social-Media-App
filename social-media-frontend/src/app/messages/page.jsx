"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";

export default function MessagesListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const socket = useSocket();
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // redirect if not authed
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  // fetch all users (exclude yourself)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await api.get("/users");
        setUsers(data.users || data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, []);

  // listen for online‐users updates
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
    <AppLayout>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl mb-4">All Users</h2>
        <ul>
          {users
            .filter((u) => u.id !== user.id)
            .map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between p-2 hover:bg-gray-800 rounded cursor-pointer"
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
    </AppLayout>
  );
}
