"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) return;

    // remove the transports override so polling can happen first,
    // which lets the WebSocket handshake succeed
    const s = io("http://localhost:5000", {
      path: "/socket.io",
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
      s.emit("join", user.id);
    });

    s.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
    });

    return () => {
      s.off("connect");
      s.off("connect_error");
      s.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
