"use client";

import { useEffect, useState, useRef } from "react";
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
  const [incomingCall, setIncomingCall] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // Fetch all users
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

  // Handle online users + incoming call
  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join", user.id);

    socket.on("user_online", (list) => setOnlineUsers(list));

    socket.on("incoming_call", async ({ from, offer }) => {
      setIncomingCall({ from, offer });
      try {
        const res = await api.get(`/api/users/profile/${from}`);
        setCallerInfo(res.data.user);
      } catch (e) {
        console.error("Failed to fetch caller info:", e);
      }
    });

    socket.on("call_ended", () => {
      setIncomingCall(null);
      setCallerInfo(null);
    });

    return () => {
      socket.off("user_online");
      socket.off("incoming_call");
      socket.off("call_ended");
    };
  }, [socket, user]);

  const acceptCall = () => {
    if (!incomingCall) return;
    router.push(`/messages/${incomingCall.from}?acceptCall=true`);
  };

  const rejectCall = () => {
    if (!socket || !incomingCall) return;
    socket.emit("end_call", { to: incomingCall.from });
    setIncomingCall(null);
    setCallerInfo(null);
  };

  if (loading || !user)
    return <p className="text-center text-white">Loading…</p>;

  return (
    <div className="relative max-w-lg mx-auto mt-8 px-4">
      <h2 className="text-2xl font-semibold text-white mb-4">Messages</h2>
      <ul className="space-y-2">
        {users
          .filter((u) => u.id !== user.id)
          .map((u) => {
            const isOnline = onlineUsers.includes(String(u.id));
            return (
              <li
                key={u.id}
                className="flex items-center justify-between bg-gray-800 hover:bg-gray-700 p-3 rounded-lg cursor-pointer transition"
                onClick={() => router.push(`/messages/${u.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                        isOnline ? "bg-green-500" : "bg-gray-500"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-white font-medium">{u.username}</p>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>

      {/* Incoming Call Overlay */}
      {incomingCall && callerInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl text-center shadow-xl w-80">
            <img
              src={callerInfo.avatar}
              alt={callerInfo.username}
              className="w-16 h-16 rounded-full mx-auto mb-3"
            />
            <p className="text-white text-lg mb-2 font-medium">
              {callerInfo.username} is calling…
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={acceptCall}
                className="bg-green-500 px-4 py-2 rounded text-white font-semibold"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-500 px-4 py-2 rounded text-white font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
