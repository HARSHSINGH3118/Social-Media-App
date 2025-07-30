"use client";

import { useSearchParams } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import MessageSidebar from "./MessageSidebar";
import ChatWindow from "./ChatWindow";

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-64px)]">
        <div className="w-full md:w-1/3 border-r border-gray-300 overflow-y-auto">
          <MessageSidebar />
        </div>
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
    </AppLayout>
  );
}
