"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/utils/cropImage";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import AppLayout from "@/components/AppLayout";

export default function CreatePostPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onCropComplete = useCallback((_, area) => {
    setCroppedAreaPixels(area);
  }, []);

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
      const croppedFile = await getCroppedImg(preview, croppedAreaPixels);

      const formData = new FormData();
      formData.append("content", caption);
      formData.append("image", croppedFile);

      await api.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post created!");
      router.push("/dashboard");
    } catch (err) {
      console.error("❌ Post creation failed:", err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold  mb-6 text-black">Create Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />

          {preview && (
            <>
              <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden shadow-md">
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full accent-blue-600"
              />
            </>
          )}

          <textarea
            className="w-full bg-white text-black border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your caption with #hashtags..."
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Create Post"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
