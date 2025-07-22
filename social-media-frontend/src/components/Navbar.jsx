"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <nav className="w-full bg-gray-900 text-white shadow px-6 py-4 flex justify-between items-center">
      {/* App Logo or Name */}
      <div
        className="text-2xl font-bold text-blue-400 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        Huddle
      </div>

      {/* Right Side Navigation */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <button
              onClick={() => router.push(`/profile/${user.id}`)}
              className="text-gray-300 hover:text-blue-400 transition"
            >
              My Profile
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
