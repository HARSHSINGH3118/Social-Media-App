// src/app/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);

  // Redirect logged-in users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  // Fetch public posts preview (only on client)
  useEffect(() => {
    async function fetchPosts() {
      try {
        // baseURL is http://<host>:5000/api
        const res = await api.get("/posts");
        setPosts(res.data.posts || res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold">Welcome to Social App</h1>
      {posts.length > 0 && (
        <p className="mt-2 text-gray-300">
          Previewing {posts.length} public post{posts.length > 1 ? "s" : ""}.
        </p>
      )}
    </div>
  );
}
