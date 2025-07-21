"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function CreatePostPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !caption.trim()) {
      toast.error("Image and caption are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", caption); // ✅ used for hashtags too
      formData.append("image", image); // ✅ image file

      await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created!");
      router.push("/dashboard");
    } catch (err) {
      console.error(
        "❌ Post creation failed:",
        err?.response?.data || err.message
      );
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded"
          />
        )}
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Write your caption with #hashtags..."
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

// Optional: Debug info
if (typeof window !== "undefined") {
  console.log("🔥 Final check before submit:");
  console.log("Token from localStorage:", localStorage.getItem("token"));
  console.log("API baseURL:", api.defaults.baseURL);
}
