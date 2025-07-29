// src/app/notifications/page.jsx
"use client";

import AppLayout from "@/components/AppLayout";
import NotificationList from "@/components/NotificationList";

export default function NotificationsPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <NotificationList />
      </div>
    </AppLayout>
  );
}
