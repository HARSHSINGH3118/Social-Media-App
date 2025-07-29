// src/app/call/page.jsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext";
import api from "@/services/api";

const STUN_CONFIG = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function CallPage() {
  const { user, loading } = useAuth();
  const socket = useSocket();

  // Online users
  const [onlineIds, setOnlineIds] = useState([]);
  const [profiles, setProfiles] = useState([]);

  // Call state
  const [incomingCall, setIncomingCall] = useState(null); // { from, offer, isVoice }
  const [calling, setCalling] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const [peerId, setPeerId] = useState(null);

  // Refs for WebRTC
  const localRef = useRef(null);
  const remoteRef = useRef(null);
  const pcRef = useRef(null);
  const iceQueue = useRef([]);

  // ─── 1) Join & track online users ─────────────────────────
  useEffect(() => {
    if (!socket || !user) return;
    socket.emit("join", user.id);

    const onOnline = (ids) => {
      const others = ids.filter((id) => id !== user.id);
      setOnlineIds(others);
      Promise.all(
        others.map((id) =>
          api.get(`/api/users/profile/${id}`).then((r) => r.data.user)
        )
      ).then(setProfiles);
    };
    socket.on("user_online", onOnline);
    return () => socket.off("user_online", onOnline);
  }, [socket, user]);

  // ─── 2) Signaling listeners ───────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onIncoming = ({ from, offer, isVoice }) => {
      setIncomingCall({ from, offer, isVoice });
    };
    const onAccepted = async ({ answer }) => {
      const pc = pcRef.current;
      if (!pc) return;
      await pc.setRemoteDescription(answer);
      setInCall(true);
    };
    const onIce = ({ candidate }) => {
      const pc = pcRef.current;
      if (pc && pc.remoteDescription) {
        pc.addIceCandidate(candidate).catch(console.error);
      } else {
        iceQueue.current.push(candidate);
      }
    };
    const onEnd = () => hangUp();

    socket.on("incoming_call", onIncoming);
    socket.on("call_accepted", onAccepted);
    socket.on("ice_candidate", onIce);
    socket.on("call_ended", onEnd);

    return () => {
      socket.off("incoming_call", onIncoming);
      socket.off("call_accepted", onAccepted);
      socket.off("ice_candidate", onIce);
      socket.off("call_ended", onEnd);
    };
  }, [socket]);

  // ─── 3) Outgoing call (triggered by clicking 🎥/🎤) ──────────
  const startCall = (id, voice) => {
    setPeerId(id);
    setIsVoiceOnly(voice);
    setCalling(true);
  };

  // ─── 4) Create offer once `calling` is true ───────────────
  useEffect(() => {
    if (!calling || !socket || !peerId) return;
    (async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: !isVoiceOnly,
          audio: true,
        });
      } catch {
        alert("Camera/microphone access denied");
        setCalling(false);
        return;
      }
      localRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(STUN_CONFIG);
      pcRef.current = pc;
      iceQueue.current.forEach((c) =>
        pc.addIceCandidate(c).catch(console.error)
      );
      iceQueue.current = [];

      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      pc.ontrack = (e) => (remoteRef.current.srcObject = e.streams[0]);
      pc.onicecandidate = ({ candidate }) => {
        if (candidate) {
          socket.emit("ice_candidate", { to: peerId, candidate });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("call_user", { to: peerId, offer, isVoice: isVoiceOnly });
    })();
  }, [calling, socket, peerId, isVoiceOnly]);

  // ─── 5) Accept incoming call ───────────────────────────────
  const acceptCall = async () => {
    if (!incomingCall || !socket) return;
    const { from, offer, isVoice } = incomingCall;
    setPeerId(from);
    setIncomingCall(null);

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: !isVoice,
        audio: true,
      });
    } catch {
      alert("Camera/microphone access denied");
      return;
    }
    localRef.current.srcObject = stream;

    const pc = new RTCPeerConnection(STUN_CONFIG);
    pcRef.current = pc;
    iceQueue.current.forEach((c) => pc.addIceCandidate(c).catch(console.error));
    iceQueue.current = [];

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));
    pc.ontrack = (e) => (remoteRef.current.srcObject = e.streams[0]);
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) socket.emit("ice_candidate", { to: from, candidate });
    };

    await pc.setRemoteDescription(offer);
    const ans = await pc.createAnswer();
    await pc.setLocalDescription(ans);
    socket.emit("answer_call", { to: from, answer: ans });
    setInCall(true);
  };

  // ─── 6) Hang up ───────────────────────────────────────────
  const hangUp = () => {
    const pc = pcRef.current;
    if (pc) pc.close();

    [localRef, remoteRef].forEach((r) => {
      const v = r.current;
      if (v?.srcObject) {
        v.srcObject.getTracks().forEach((t) => t.stop());
        v.srcObject = null;
      }
    });

    if (peerId) {
      socket.emit("end_call", { to: peerId });
    }
    setCalling(false);
    setInCall(false);
    setPeerId(null);
    iceQueue.current = [];
  };

  if (loading || !socket) return <p className="text-white">Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Start a Call</h1>

      {/* User list */}
      <ul className="space-y-3 mb-6">
        {profiles.map((p) => (
          <li
            key={p.id}
            className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded"
          >
            <div className="flex items-center gap-3">
              <img
                src={p.avatar || "/default-avatar.png"}
                alt={p.username}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-white">{p.username}</span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startCall(p.id, false)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                🎥
              </button>
              <button
                onClick={() => startCall(p.id, true)}
                className="bg-blue-500 px-3 py-1 rounded"
              >
                🎤
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Call overlay */}
      {(calling || inCall || incomingCall) && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg flex flex-col items-center">
            <video
              ref={remoteRef}
              autoPlay
              playsInline
              className="w-80 h-60 mb-4 bg-black"
            />
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className="w-32 h-24 rounded-lg border-2 border-white mb-4 bg-black"
            />

            {incomingCall && !inCall && !calling && (
              <button
                onClick={acceptCall}
                className="bg-blue-500 px-4 py-2 rounded text-white mb-4"
              >
                Accept Call from {incomingCall.from}
              </button>
            )}

            {(calling || inCall) && (
              <button
                onClick={hangUp}
                className="bg-red-600 px-4 py-2 rounded text-white"
              >
                End Call
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
