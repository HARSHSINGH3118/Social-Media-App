// src/components/EditPostModal.jsx
"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function EditPostModal({ post, onClose, onPostUpdated }) {
  const [content, setContent] = useState(post.caption || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return toast.error("Caption cannot be empty");
    setLoading(true);
    try {
      const res = await api.put(`/posts/${post.id}`, { content });
      onPostUpdated(res.data);
      toast.success("Post updated");
      onClose();
    } catch (err) {
      toast.error("Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-32 border rounded p-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
