"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "@/services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import { useAuth } from "@/contexts/AuthContext";

const PostCard = ({ post }) => {
  const { id, imageUrl, caption, tags, createdBy, likedByUser, likeCount } =
    post;

  const { user } = useAuth();
  const isOwner = user?.username === createdBy?.username;

  const [liked, setLiked] = useState(!!likedByUser);
  const [likes, setLikes] = useState(likeCount || 0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [postState, setPostState] = useState(post); // Editable post state

  const toggleLike = async () => {
    try {
      const res = await api.post(`/api/posts/${id}/like`);
      setLiked(res.data.liked);
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={postState.imageUrl}
        alt="post"
        className="w-full h-64 object-cover"
      />

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-neutral-800">
            @{postState.createdBy?.username || "Unknown"}
          </div>
          {isOwner && (
            <button
              onClick={() => setShowEditModal(true)}
              className="text-sm text-blue-500 hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        <p className="text-gray-800 mb-2">
          {postState.caption?.replace(/#[\w_]+/g, "").trim()}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {postState.tags?.map((tag, i) => (
            <Link key={i} href={`/explore/tag/${tag}`}>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full cursor-pointer hover:underline">
                #{tag}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button onClick={toggleLike}>
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          {likes} likes
        </div>

        <CommentSection postId={id} />

        {showEditModal && (
          <EditPostModal
            post={postState}
            onClose={() => setShowEditModal(false)}
            onPostUpdated={(updated) =>
              setPostState((prev) => ({ ...prev, ...updated }))
            }
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;
