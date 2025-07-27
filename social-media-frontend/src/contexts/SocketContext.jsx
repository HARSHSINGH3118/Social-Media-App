// src/contexts/SocketContext.jsx
"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    const s = io("http://localhost:5000", {
      path: "/socket.io",
      withCredentials: true,
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("🟢 Socket connected:", s.id);
      s.emit("join", user.id);
    });

    s.on("incoming_call", ({ from, offer }) => {
      console.log("📞 Incoming call from:", from);
      alert(`\uD83D\uDCDE Incoming call from ${from}`);
    });

    s.on("receive_message", (msg) => {
      console.log("📥 New message:", msg);
    });

    s.on("notification", (notif) => {
      console.log("🔔 Notification:", notif);
    });

    return () => {
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
