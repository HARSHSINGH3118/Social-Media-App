"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import PostCard from "@/components/PostCard";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]); // ✅ Initialize with empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/api/posts");
        setPosts(res.data.posts || []); // ✅ Fallback to [] if undefined
      } catch (err) {
        console.error("Failed to fetch posts", err);
        setPosts([]); // ✅ Avoid undefined state
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      <div className="space-y-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
