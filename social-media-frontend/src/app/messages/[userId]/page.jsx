// src/app/messages/[userId]/page.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";

const EMOJI_LIST = ["😀", "😂", "😍", "😢", "👍", "🙏", "🎉", "💬"];
const STUN_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function ChatPage() {
  const { user, loading } = useAuth();
  const { userId } = useParams();
  const router = useRouter();
  const socket = useSocket();

  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Video call state
  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [calling, setCalling] = useState(false);

  const fileInputRef = useRef();
  const endRef = useRef();
  const typingTimer = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const pendingCandidates = useRef([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // Fetch partner info
  useEffect(() => {
    api
      .get(`/api/users/profile/${userId}`)
      .then(({ data }) => setPartner(data.user))
      .catch(console.error);
  }, [userId]);

  // Chat and signaling listeners
  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join", user.id);

    api
      .get(`/api/messages/${userId}`)
      .then(({ data }) => setMessages(data))
      .catch(console.error);

    socket.on("receive_message", (m) => setMessages((ms) => [...ms, m]));
    socket.on("message_sent", (m) => setMessages((ms) => [...ms, m]));
    socket.on("typing", ({ from }) => from === userId && setIsTyping(true));
    socket.on(
      "stop_typing",
      ({ from }) => from === userId && setIsTyping(false)
    );

    // Video call signaling
    socket.on("incoming_call", ({ from, offer }) =>
      setIncomingCall({ from, offer })
    );
    socket.on("call_accepted", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
      setInCall(true);
    });
    socket.on("ice_candidate", async ({ candidate }) => {
      if (pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch (e) {
          console.error("Error adding ICE candidate:", e);
        }
      } else {
        pendingCandidates.current.push(candidate);
      }
    });
    socket.on("call_ended", () => endCall());

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("ice_candidate");
      socket.off("call_ended");
    };
  }, [socket, user, userId]);

  // Auto-scroll chat
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Chat Handlers ────────────────────────────────────────────────────────────
  const sendChat = () => {
    if (!socket || !input.trim()) return;
    socket.emit("send_message", {
      receiver_id: userId,
      content: input,
    });
    setInput("");
    setShowEmojiPicker(false);
    socket.emit("stop_typing", { to: userId });
  };
  const onType = (e) => {
    setInput(e.target.value);
    if (!socket) return;
    socket.emit("typing", { to: userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      socket.emit("stop_typing", { to: userId });
    }, 600);
  };
  const addEmoji = (emoji) => setInput((i) => i + emoji);
  const pickPhoto = () => fileInputRef.current.click();
  const onPhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(reader.result);
    reader.readAsDataURL(file);
  };

  // ── Video Call Handlers ──────────────────────────────────────────────────────
  const startCall = () => setCalling(true);

  // Setup WebRTC once `calling` is true
  useEffect(() => {
    if (!calling || !socket) return;
    (async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (err) {
        console.warn("getUserMedia(video+audio) failed:", err);
        if (err.name === "NotFoundError") {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: false,
              audio: true,
            });
            alert("No camera found — starting audio-only call.");
          } catch (err2) {
            console.error("getUserMedia(audio) also failed:", err2);
            alert("No camera or microphone available.");
            setCalling(false);
            return;
          }
        } else {
          console.error("getUserMedia error:", err);
          setCalling(false);
          return;
        }
      }
      localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(STUN_CONFIG);
      pcRef.current = pc;

      // Drain buffered ICE candidates
      for (let cand of pendingCandidates.current) {
        try {
          await pc.addIceCandidate(cand);
        } catch (e) {
          console.error("Error adding buffered ICE candidate:", e);
        }
      }
      pendingCandidates.current = [];

      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      pc.ontrack = (e) => {
        remoteVideoRef.current.srcObject = e.streams[0];
      };
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("ice_candidate", { to: userId, candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call_user", { to: userId, offer });
    })();
  }, [calling, socket, userId]);

  const acceptCall = async () => {
    if (!socket || !incomingCall) return;
    setIncomingCall(null);
    setInCall(true);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (err) {
      console.warn("getUserMedia(video+audio) failed:", err);
      if (err.name === "NotFoundError") {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          alert("No camera found — accepting audio-only call.");
        } catch (err2) {
          console.error("getUserMedia(audio) also failed:", err2);
          alert("No camera or microphone available.");
          setInCall(false);
          return;
        }
      } else {
        console.error("getUserMedia error:", err);
        setInCall(false);
        return;
      }
    }
    localVideoRef.current.srcObject = stream;

    const { from, offer } = incomingCall;
    const pc = new RTCPeerConnection(STUN_CONFIG);
    pcRef.current = pc;

    for (let cand of pendingCandidates.current) {
      try {
        await pc.addIceCandidate(cand);
      } catch (e) {
        console.error("Error adding buffered ICE candidate:", e);
      }
    }
    pendingCandidates.current = [];

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("ice_candidate", { to: from, candidate });
      }
    };

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer_call", { to: from, answer });
  };

  const endCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    setInCall(false);
    setCalling(false);
    setIncomingCall(null);
    socket.emit("end_call", { to: userId });
  };

  if (loading || !user || !socket || !partner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="text-2xl">
              ←
            </button>
            <img
              src={partner.avatar}
              alt={partner.username}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-xl font-semibold">{partner.username}</h2>
          </div>
          {!inCall && !incomingCall && (
            <button
              onClick={startCall}
              className="bg-green-500 px-3 py-1 rounded"
            >
              📹 Call
            </button>
          )}
          {inCall && (
            <button onClick={endCall} className="bg-red-500 px-3 py-1 rounded">
              ✖️ End
            </button>
          )}
        </div>

        {/* Video Streams */}
        {(calling || inCall) && (
          <div className="flex-1 relative bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              className="w-full h-full object-cover"
            />
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="absolute bottom-4 right-4 w-32 h-24 object-cover rounded-lg border-2 border-white"
            />
          </div>
        )}

        {/* Incoming Call Overlay */}
        {incomingCall && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <p className="mb-4">{partner.username} is calling…</p>
              <button
                onClick={acceptCall}
                className="bg-blue-500 px-4 py-2 rounded"
              >
                Accept
              </button>
            </div>
          </div>
        )}

        {/* Chat UI */}
        {!calling && !inCall && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg, i) => {
                const mine = msg.sender_id === user.id;
                return (
                  <div
                    key={i}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    {!mine && (
                      <img
                        src={partner.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`px-4 py-2 rounded-lg max-w-[70%] ${
                        mine
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-700 text-white rounded-bl-none"
                      }`}
                    >
                      {msg.content.startsWith("data:image") ? (
                        <img
                          src={msg.content}
                          alt="sent"
                          className="rounded max-w-full"
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {isTyping && (
              <div className="px-6 pb-1">
                <span className="italic text-sm text-gray-400">Typing…</span>
              </div>
            )}

            <div className="bg-gray-900 px-6 py-4 flex items-center gap-3">
              <button
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="text-2xl"
              >
                😀
              </button>
              <button onClick={pickPhoto} className="text-2xl">
                📷
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={onPhotoChange}
                className="hidden"
              />

              <input
                type="text"
                value={input}
                onChange={onType}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Type your message…"
                className="flex-1 bg-gray-700 px-4 py-2 rounded-full focus:outline-none"
              />

              <button
                onClick={sendChat}
                className="bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>

            {showEmojiPicker && (
              <div className="bg-gray-700 p-4 grid grid-cols-8 gap-2 overflow-y-auto max-h-40">
                {EMOJI_LIST.map((e) => (
                  <button
                    key={e}
                    onClick={() => addEmoji(e)}
                    className="text-2xl"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
