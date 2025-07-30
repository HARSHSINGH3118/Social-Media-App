"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, CornerDownLeft } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function MessageBubble({ msg, mine, onDelete, onReply }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close menu when clicking outside
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div
      ref={ref}
      className={`relative flex my-2 ${
        mine ? "justify-end" : "justify-start"
      } group`}
    >
      {/* Avatar (incoming) */}
      {!mine && (
        <img
          src={msg.sender.avatar}
          alt="avatar"
          className="w-8 h-8 rounded-full mr-2"
        />
      )}

      {/* Bubble */}
      <div
        className={`px-4 py-2 rounded-2xl max-w-[70%] break-words ${
          mine ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {msg.content.startsWith("data:image") ? (
          <img
            src={msg.content}
            alt="sent"
            className="w-32 h-32 object-cover rounded-lg"
          />
        ) : (
          msg.content
        )}
        <div className="text-[10px] text-gray-400 mt-1 text-right">
          {dayjs(msg.created_at).fromNow()}
        </div>
      </div>

      {/* “…” toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <MoreVertical size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded-lg overflow-hidden z-10">
          <button
            onClick={() => {
              onReply(msg);
              setOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left"
          >
            <CornerDownLeft size={14} /> Reply
          </button>
          {mine && (
            <button
              onClick={() => {
                onDelete(msg.id);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full text-left text-red-500"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
