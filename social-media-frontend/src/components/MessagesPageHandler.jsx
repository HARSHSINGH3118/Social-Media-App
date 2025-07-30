"use client";

import { useSearchParams } from "next/navigation";
import MessageSidebar from "@/app/messages/MessageSidebar";
import ChatWindow from "@/app/messages/ChatWindow";

export default function MessagesPageHandler() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 border-r border-gray-300 overflow-y-auto">
        <MessageSidebar />
      </div>

      {/* Chat Window or Prompt */}
      <div className="w-full md:w-2/3">
        {userId ? (
          <ChatWindow userId={userId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to chat
          </div>
        )}
      </div>
    </div>
  );
}
