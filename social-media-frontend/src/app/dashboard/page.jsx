"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center gap-4 bg-white text-gray-800 p-8 rounded shadow">
        <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>
        <p className="text-lg">This is your personalized Huddle dashboard.</p>
      </div>
    </AppLayout>
  );
}
