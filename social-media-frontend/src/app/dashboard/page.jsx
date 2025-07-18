// src/app/dashboard/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

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
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Welcome, {user?.username}!
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md shadow"
      >
        Logout
      </button>
    </div>
  );
}
