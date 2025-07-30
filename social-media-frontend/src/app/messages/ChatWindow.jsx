// src/components/ChatWindow.jsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import { Trash2, Reply, MoreVertical, Phone, Video } from "lucide-react";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

const EMOJI_LIST = ["😀", "😂", "😍", "😢", "👍", "🙏", "🎉", "💬"];
const STUN_CONFIG = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export default function ChatWindow({ userId }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const socket = useSocket();

  const [partner, setPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [incomingCall, setIncomingCall] = useState(null);
  const [inCall, setInCall] = useState(false);
  const [calling, setCalling] = useState(false);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);

  const fileInputRef = useRef();
  const cameraInputRef = useRef();
  const endRef = useRef();
  const typingTimer = useRef();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef(null);
  const pendingCandidates = useRef([]);

  // redirect if not authed
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // load partner profile
  useEffect(() => {
    if (!userId) return;
    api
      .get(`/api/users/profile/${userId}`)
      .then(({ data }) => setPartner(data.user))
      .catch(console.error);
  }, [userId]);

  // socket & messages setup
  useEffect(() => {
    if (!socket || !user || !userId) return;

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
    socket.on("incoming_call", ({ from, offer, isVoice }) =>
      setIncomingCall({ from, offer, isVoice })
    );
    socket.on("call_accepted", async ({ answer }) => {
      await pcRef.current.setRemoteDescription(answer);
      setInCall(true);
    });
    socket.on("ice_candidate", async ({ candidate }) => {
      if (pcRef.current) {
        try {
          await pcRef.current.addIceCandidate(candidate);
        } catch {}
      } else {
        pendingCandidates.current.push(candidate);
      }
    });
    socket.on("call_ended", () => endCall());

    return () => socket.off();
  }, [socket, user, userId]);

  // scroll to bottom
  useEffect(
    () => endRef.current?.scrollIntoView({ behavior: "smooth" }),
    [messages]
  );

  // group messages by day
  const formatDateLabel = (date) => {
    const d = dayjs(date);
    if (d.isToday()) return "Today";
    if (d.isYesterday()) return "Yesterday";
    return d.format("DD MMM YYYY");
  };
  const groupMessages = (msgs) => {
    const out = [];
    let lastDay = null;
    msgs.forEach((msg) => {
      const day = dayjs(msg.created_at).startOf("day");
      if (!lastDay || !day.isSame(lastDay, "day")) {
        out.push({
          type: "separator",
          label: formatDateLabel(msg.created_at),
          key: day.toString(),
        });
        lastDay = day;
      }
      out.push({ type: "message", msg, key: msg.id });
    });
    return out;
  };
  const grouped = groupMessages(messages);

  // send message
  const sendChat = () => {
    if (!socket || !input.trim()) return;
    socket.emit("send_message", {
      receiver_id: userId,
      content: input,
      reply_to: replyingTo?.id || null,
    });
    setInput("");
    setReplyingTo(null);
    socket.emit("stop_typing", { to: userId });
  };

  // typing indicator
  const onType = (e) => {
    setInput(e.target.value);
    socket.emit("typing", { to: userId });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(
      () => socket.emit("stop_typing", { to: userId }),
      600
    );
  };

  // delete
  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/messages/${id}`);
      setMessages((ms) => ms.filter((m) => m.id !== id));
    } catch {}
  };

  // emoji + photo
  const addEmoji = (e) => setInput((i) => i + e);
  const pickPhoto = () => fileInputRef.current.click();
  const takePhoto = () => cameraInputRef.current.click();
  const onPhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setInput(r.result);
    r.readAsDataURL(f);
  };

  // call controls
  const startCall = (voiceOnly) => {
    setIsVoiceOnly(voiceOnly);
    setCalling(true);
  };

  // WebRTC offer logic (unchanged)
  useEffect(() => {
    if (!calling || !socket) return;
    (async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: !isVoiceOnly,
          audio: true,
        });
      } catch {
        alert("Media access denied");
        setCalling(false);
        return;
      }
      localVideoRef.current.srcObject = stream;
      const pc = new RTCPeerConnection(STUN_CONFIG);
      pcRef.current = pc;
      pendingCandidates.current.forEach(
        async (c) => await pc.addIceCandidate(c)
      );
      pendingCandidates.current = [];
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      pc.ontrack = (e) => (remoteVideoRef.current.srcObject = e.streams[0]);
      pc.onicecandidate = ({ candidate }) =>
        candidate && socket.emit("ice_candidate", { to: userId, candidate });
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call_user", { to: userId, offer, isVoice: isVoiceOnly });
    })();
  }, [calling, socket, userId, isVoiceOnly]);

  // accept call
  const acceptCall = async () => {
    if (!incomingCall) return;
    const { from, offer, isVoice } = incomingCall;
    setIncomingCall(null);
    setInCall(true);
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: !isVoice,
        audio: true,
      });
    } catch {
      alert("Media access denied");
      setInCall(false);
      return;
    }
    localVideoRef.current.srcObject = stream;
    const pc = new RTCPeerConnection(STUN_CONFIG);
    pcRef.current = pc;
    pendingCandidates.current.forEach(async (c) => await pc.addIceCandidate(c));
    pendingCandidates.current = [];
    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.ontrack = (e) => (remoteVideoRef.current.srcObject = e.streams[0]);
    pc.onicecandidate = ({ candidate }) =>
      candidate && socket.emit("ice_candidate", { to: from, candidate });
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit("answer_call", { to: from, answer });
  };

  // end call
  const endCall = () => {
    if (pcRef.current) pcRef.current.close();
    [localVideoRef, remoteVideoRef].forEach((r) => {
      if (r.current?.srcObject) {
        r.current.srcObject.getTracks().forEach((t) => t.stop());
        r.current.srcObject = null;
      }
    });
    setCalling(false);
    setInCall(false);
    setIncomingCall(null);
    socket.emit("end_call", { to: userId });
  };

  if (loading || !user || !socket || !partner) return null;

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-2 flex items-center justify-between shadow">
        <div className="flex items-center space-x-3">
          <img
            src={partner.avatar}
            alt={partner.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{partner.username}</span>
        </div>
        {!inCall && !incomingCall && (
          <div className="flex space-x-2">
            <button
              onClick={() => startCall(false)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Video"
            >
              <Video size={18} />
            </button>
            <button
              onClick={() => startCall(true)}
              className="p-1 hover:bg-gray-200 rounded"
              title="Voice"
            >
              <Phone size={18} />
            </button>
          </div>
        )}
        {(inCall || calling) && (
          <button
            onClick={endCall}
            className="p-1 hover:bg-gray-200 rounded text-red-600"
            title="End Call"
          >
            ✖️
          </button>
        )}
      </div>

      {/* Incoming call */}
      {incomingCall && (
        <div className="p-4 bg-yellow-100 text-gray-800 text-center">
          <p>{partner.username} is calling…</p>
          <button
            onClick={acceptCall}
            className="mt-2 px-4 py-1 bg-green-500 text-white rounded"
          >
            Accept
          </button>
        </div>
      )}

      {/* Video panes */}
      {(calling || inCall) && (
        <div className="relative flex-1 bg-black">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="absolute bottom-4 right-4 w-32 h-24 object-cover rounded border-2 border-white"
          />
        </div>
      )}

      {/* Chat area */}
      {!calling && !inCall && (
        <>
          {/* Reply preview */}
          {replyingTo && (
            <div className="px-4 py-2 bg-gray-200 flex justify-between items-center text-sm">
              <span>Replying to: {replyingTo.content}</span>
              <button onClick={() => setReplyingTo(null)}>✖</button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
            {grouped.map((item) =>
              item.type === "separator" ? (
                <div
                  key={item.key}
                  className="text-center text-xs text-gray-500"
                >
                  {item.label}
                </div>
              ) : (
                <div
                  key={item.key}
                  className={`flex items-end ${
                    item.msg.sender_id === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.msg.sender_id !== user.id && (
                    <img
                      src={partner.avatar}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  )}
                  <div className="relative group max-w-[70%]">
                    {item.msg.reply_to && (
                      <div className="bg-gray-200 px-2 py-1 text-xs italic rounded-t">
                        {messages
                          .find((m) => m.id === item.msg.reply_to)
                          ?.content.slice(0, 20) || "(deleted)"}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl break-words shadow-sm ${
                        item.msg.sender_id === user.id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      {item.msg.content.startsWith("data:image") ? (
                        <img
                          src={item.msg.content}
                          alt="sent"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        item.msg.content
                      )}
                      <div className="text-[10px] text-gray-500 mt-1 text-right">
                        {dayjs(item.msg.created_at).format("h:mm A")}
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex space-x-1">
                      <button
                        onClick={() => setReplyingTo(item.msg)}
                        className="text-blue-500 p-1 hover:bg-gray-200 rounded"
                      >
                        <Reply size={12} />
                      </button>
                      {item.msg.sender_id === user.id && (
                        <button
                          onClick={() => handleDelete(item.msg.id)}
                          className="text-red-500 p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                      <button className="text-gray-500 p-1 hover:bg-gray-200 rounded">
                        <MoreVertical size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
            <div ref={endRef} />
          </div>

          {isTyping && (
            <div className="px-4 pb-1 italic text-gray-500">Typing…</div>
          )}

          {/* …later in your JSX, replace your old “input bar” with: */}
          <div className="px-4 py-3 bg-white border-t flex items-center space-x-2">
            {/* emoji toggle */}
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              className="text-2xl"
              title="Emoji"
            >
              😀
            </button>

            {/* take a photo via camera */}
            <button onClick={takePhoto} className="text-2xl" title="Take Photo">
              📸
            </button>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={onPhotoChange}
              className="hidden"
            />

            {/* pick from gallery */}
            <button
              onClick={pickPhoto}
              className="text-2xl"
              title="Choose Image"
            >
              🖼️
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onPhotoChange}
              className="hidden"
            />

            {/* text input */}
            <input
              type="text"
              value={input}
              onChange={onType}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Type a message…"
              className="flex-1 border border-gray-300 px-3 py-2 rounded-full focus:outline-none"
            />

            {/* send button */}
            <button
              onClick={sendChat}
              className="bg-blue-500 text-white px-4 py-2 rounded-full"
            >
              Send
            </button>
          </div>

          {showEmojiPicker && (
            <div className="grid grid-cols-8 gap-2 bg-white border-t px-4 py-2 max-h-40 overflow-y-auto">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  className="text-2xl"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
