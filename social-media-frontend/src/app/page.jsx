"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import api from "@/services/api";

const res = await api.get("/api/posts");

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold">Welcome to Social App</h1>
    </div>
  );
}
