"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import NewsSection from "@/components/NewsSection";
import ReelsSection from "@/components/ReelsSection";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Main Area */}
        <div className="md:col-span-2 space-y-6">
          {/* Welcome Section */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <h1 className="text-3xl font-extrabold mb-2 text-gray-900">
              Welcome to Huddle,{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text animate-pulse">
                {user?.username || "User"}
              </span>
              !
            </h1>
            <p className="text-gray-700 text-sm mb-4">
              Your one-stop community hub to chat, post, share, and stay in the
              loop.
            </p>
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
              <iframe
                src="https://my.spline.design/3dtextbluecopy-wxFYL9id0twcH3OJLN3cBU2r/"
                frameBorder="0"
                width="100%"
                height="100%"
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 space-y-5">
            <h2 className="text-2xl font-semibold text-purple-700 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              About Huddle
            </h2>

            <p className="text-gray-700 text-sm leading-relaxed">
              Huddle is your one-stop community hub — empowering users to
              connect, collaborate, and stay updated. Whether it’s sharing
              moments, discovering trends, or interacting in real-time, Huddle
              brings <strong>clarity</strong>, <strong>focus</strong>, and{" "}
              <strong>impact</strong> to your social experience.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Feature Card */}
              {[
                {
                  icon: "💬",
                  title: "Real-Time Communication",
                  desc: "Chat, call, and engage instantly with community members.",
                },
                {
                  icon: "📢",
                  title: "Trend-Driven Content",
                  desc: "Stay on top of the latest news, reels, and discussions around you.",
                },
                {
                  icon: "🔒",
                  title: "Private & Secure",
                  desc: "Your data and interactions stay private, always.",
                },
                {
                  icon: "🧠",
                  title: "AI-Powered Insights",
                  desc: "Smart recommendations, trending tags, and real-time suggestions.",
                },
              ].map((f, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="text-2xl">{f.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-600">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed pt-2">
              What sets Huddle apart is its unique blend of{" "}
              <strong>community-first features</strong>, seamless design, and
              future-ready technology — built to foster meaningful conversations
              and shared experiences.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <NewsSection />
          <ReelsSection />
        </div>
      </div>
    </AppLayout>
  );
}
