"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/posts");
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar fixed without scroll */}
      <div className="w-64 flex-shrink-0 bg-[#0B1220] text-white">
        <div className="flex flex-col justify-between h-full">
          <Sidebar />
        </div>
      </div>

      {/* Right side scrolls */}
      <main className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-black">Explore</h1>
          <div className="space-y-6">
            {loading ? (
              <div className="text-center mt-10">Loading...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-gray-500">No posts found.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
