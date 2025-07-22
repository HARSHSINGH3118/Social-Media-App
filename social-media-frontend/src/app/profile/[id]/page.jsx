"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, UserPlus, UserMinus } from "lucide-react";
import PostCard from "@/components/PostCard";

export default function ProfilePage() {
  const router = useRouter();
  const { id: rawId } = useParams(); // now matches [id]
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bioInput, setBioInput] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const profileId = Number(rawId); // parse to number

  // 1️⃣ Redirect off invalid IDs
  useEffect(() => {
    if (!currentUser) return;
    if (!profileId || isNaN(profileId)) {
      router.replace(`/profile/${currentUser.id}`);
    }
  }, [currentUser, profileId, router]);

  // 2️⃣ Own vs public
  const isOwnProfile = profileId === currentUser?.id;

  // 3️⃣ Fetch profile
  const fetchProfile = async () => {
    try {
      const endpoint = isOwnProfile
        ? "/users/profile"
        : `/users/profile/${profileId}`;
      const res = await api.get(endpoint);

      // Both return { user, posts }
      const u = res.data.user;
      const p = res.data.posts || [];

      setUser(u);
      setBioInput(u.bio || "");
      setPosts(
        p.map((post) => ({
          ...post,
          imageUrl: post.image_url,
          caption: post.content,
          createdBy: { username: u.username },
        }))
      );

      if (!isOwnProfile) {
        const fr = await api.get(`/users/${u.id}/followers`);
        setIsFollowing(fr.data.some((f) => f.id === currentUser.id));
      }
    } catch (e) {
      console.error("Failed to fetch profile:", e);
      if (!isOwnProfile) {
        router.replace(`/profile/${currentUser.id}`);
      }
    }
  };

  useEffect(() => {
    if (currentUser && profileId) {
      fetchProfile();
    }
  }, [currentUser, profileId]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-300">Loading profile…</div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      {/* Avatar + Edit */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-24 group">
          <img
            src={user.avatar || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-400"
          />
          {isOwnProfile && (
            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 cursor-pointer">
              <Pencil size={20} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append("avatar", file);
                  await api.put("/users/profile", fd);
                  fetchProfile();
                }}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Username & Bio */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-400">@{user.username}</h1>
          <p className="text-gray-400 mb-1">
            Joined: {new Date(user.created_at).toLocaleDateString()}
          </p>

          <div className="mb-2">
            {editingBio ? (
              <div className="flex gap-2">
                <input
                  className="px-2 py-1 rounded bg-gray-800 border text-white"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                />
                <button
                  className="px-2 py-1 bg-blue-500 rounded text-white"
                  onClick={async () => {
                    await api.put("/users/profile/bio", { bio: bioInput });
                    setEditingBio(false);
                    fetchProfile();
                  }}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p>{user.bio || (isOwnProfile ? "No bio yet." : "")}</p>
                {isOwnProfile && (
                  <button onClick={() => setEditingBio(true)}>
                    <Pencil size={16} className="text-blue-400" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Stats & Follow */}
          <div className="flex gap-6 mb-2">
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
              className={`px-4 py-1 rounded text-white ${
                isFollowing ? "bg-gray-500" : "bg-blue-500"
              }`}
              onClick={async () => {
                if (isFollowing) {
                  await api.delete(`/users/${user.id}/follow`);
                  setIsFollowing(false);
                } else {
                  await api.post(`/users/${user.id}/follow`);
                  setIsFollowing(true);
                }
              }}
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

      {/* Posts */}
      <h2 className="text-2xl font-semibold mb-2">Posts</h2>
      {posts.length === 0 ? (
        <p className="text-gray-400">No posts yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
