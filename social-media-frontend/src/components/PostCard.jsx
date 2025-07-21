import React, { useState } from "react";
import api from "@/services/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentSection from "./CommentSection";

const PostCard = ({ post }) => {
  const { id, imageUrl, caption, tags, createdBy, likedByUser, likeCount } =
    post;

  const [liked, setLiked] = useState(!!likedByUser);

  const [likes, setLikes] = useState(likeCount || 0);

  const toggleLike = async () => {
    try {
      const res = await api.post(`/api/posts/${id}/like`);
      setLiked(res.data.liked); // Update UI toggle
      setLikes(res.data.likes); // Update like count
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={imageUrl} alt="post" className="w-full h-64 object-cover" />
      <div className="p-4">
        <div className="font-semibold mb-2 text-neutral-800">
          @{createdBy?.username || "Unknown"}
        </div>
        <p className="text-gray-800 mb-2">
          {caption.replace(/#[\w_]+/g, "").trim()}
        </p>

        <div className="flex flex-wrap gap-2 mb-2">
          {tags?.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button onClick={toggleLike}>
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          {likes} likes
        </div>

        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default PostCard;
