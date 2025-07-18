"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { login } = useAuth();

  useEffect(() => {
    if (token) {
      login(token); // ✅ Triggers router.push("/dashboard") inside context
    } else {
      router.push("/login");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-lg text-gray-700">Logging in with Google...</p>
    </div>
  );
}
