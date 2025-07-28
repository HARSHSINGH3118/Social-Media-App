"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/api";
import PostCard from "@/components/PostCard";

const TagExplorePage = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tag) return;
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/api/tags/${tag}/posts`);

        setPosts(res.data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts for tag:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [tag]);

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!posts || posts.length === 0)
    return (
      <div className="text-center p-6">
        No posts found for <span className="font-semibold">#{tag}</span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-4">#{tag}</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default TagExplorePage;
