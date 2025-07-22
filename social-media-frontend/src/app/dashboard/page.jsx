"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout"; // ✅ Add this

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
      <div className="flex flex-col items-center justify-center gap-4 bg-gray-900 text-white p-8 min-h-screen">
        <h1 className="text-3xl font-bold">Welcome, {user?.username}!</h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md shadow"
        >
          Logout
        </button>
      </div>
    </AppLayout>
  );
}
