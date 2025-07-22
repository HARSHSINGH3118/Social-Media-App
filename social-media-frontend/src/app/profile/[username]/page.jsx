// Fully Updated ProfilePage.jsx with All Features
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, UserPlus, UserMinus } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const isOwnProfile = currentUser?.username === user?.username;

  useEffect(() => {
    if (!username) return;
    const fetchUserProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${username}`);
        setUser(res.data.user);
        setBioInput(res.data.user.bio || "");
        setPosts(res.data.posts || []);
        if (!isOwnProfile) {
          const followRes = await api.get(
            `/users/${res.data.user.id}/followers`
          );
          setIsFollowing(followRes.data.some((f) => f.id === currentUser?.id));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchUserProfile();
  }, [username, currentUser]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      await api.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const refreshed = await api.get(`/users/profile/${username}`);
      setUser(refreshed.data.user);
      setPosts(refreshed.data.posts || []);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleBioSave = async () => {
    try {
      await api.put("/users/profile", { bio: bioInput });
      const refreshed = await api.get(`/users/profile/${username}`);
      setUser(refreshed.data.user);
      setEditingBio(false);
    } catch (err) {
      console.error("Bio update failed:", err);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/users/${user.id}/follow`);
        setIsFollowing(false);
      } else {
        await api.post(`/users/${user.id}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  };

  if (!user)
    return (
      <div className="text-center mt-20 text-gray-300">Loading profile...</div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 group">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
          />
          {isOwnProfile && (
            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer">
              <Pencil size={20} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-400">@{user.username}</h1>
          <p className="text-gray-400 mb-1">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>

          <div className="text-white mb-2">
            {editingBio ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-800 border text-white"
                />
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={handleBioSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p>{user.bio || (isOwnProfile ? "No bio added." : "")}</p>
                {isOwnProfile && (
                  <button onClick={() => setEditingBio(true)}>
                    <Pencil size={16} className="text-blue-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-6 text-white mb-2">
            <p>
              <span className="font-semibold">{posts.length}</span> Posts
            </p>
            <p>
              <span className="font-semibold">0</span> Followers
            </p>
            <p>
              <span className="font-semibold">0</span> Following
            </p>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`mt-1 px-4 py-1 rounded text-white ${
                isFollowing ? "bg-gray-500" : "bg-blue-500"
              }`}
            >
              {isFollowing ? (
                <span className="flex items-center gap-2">
                  <UserMinus size={16} /> Unfollow
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={16} /> Follow
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2 text-white">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg p-4 shadow text-black"
            >
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full h-60 object-cover mb-2 rounded"
                />
              )}
              <p className="mb-2">{post.content}</p>
              <p className="text-sm text-gray-600">{post.like_count} likes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
