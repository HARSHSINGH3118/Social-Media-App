(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/services/api.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/services/api.js
__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Only read window.location.hostname when in the browser
const getHost = ()=>("TURBOPACK compile-time truthy", 1) ? window.location.hostname : "TURBOPACK unreachable";
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: "http://".concat(getHost(), ":5000"),
    withCredentials: true
});
// Only attach the interceptor in the browser
if ("TURBOPACK compile-time truthy", 1) {
    api.interceptors.request.use((config)=>{
        const token = localStorage.getItem("token");
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: "Bearer ".concat(token)
            };
        }
        return config;
    });
}
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/call/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/call/page.jsx
__turbopack_context__.s({
    "default": ()=>CallPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/SocketContext.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const STUN_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};
function CallPage() {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    // Online users
    const [onlineIds, setOnlineIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [profiles, setProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Call state
    const [incomingCall, setIncomingCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // { from, offer, isVoice }
    const [calling, setCalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inCall, setInCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVoiceOnly, setIsVoiceOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [peerId, setPeerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Refs for WebRTC
    const localRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const remoteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pcRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const iceQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // ─── 1) Join & track online users ─────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!socket || !user) return;
            socket.emit("join", user.id);
            const onOnline = {
                "CallPage.useEffect.onOnline": (ids)=>{
                    const others = ids.filter({
                        "CallPage.useEffect.onOnline.others": (id)=>id !== user.id
                    }["CallPage.useEffect.onOnline.others"]);
                    setOnlineIds(others);
                    Promise.all(others.map({
                        "CallPage.useEffect.onOnline": (id)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/users/profile/".concat(id)).then({
                                "CallPage.useEffect.onOnline": (r)=>r.data.user
                            }["CallPage.useEffect.onOnline"])
                    }["CallPage.useEffect.onOnline"])).then(setProfiles);
                }
            }["CallPage.useEffect.onOnline"];
            socket.on("user_online", onOnline);
            return ({
                "CallPage.useEffect": ()=>socket.off("user_online", onOnline)
            })["CallPage.useEffect"];
        }
    }["CallPage.useEffect"], [
        socket,
        user
    ]);
    // ─── 2) Signaling listeners ───────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!socket) return;
            const onIncoming = {
                "CallPage.useEffect.onIncoming": (param)=>{
                    let { from, offer, isVoice } = param;
                    setIncomingCall({
                        from,
                        offer,
                        isVoice
                    });
                }
            }["CallPage.useEffect.onIncoming"];
            const onAccepted = {
                "CallPage.useEffect.onAccepted": async (param)=>{
                    let { answer } = param;
                    const pc = pcRef.current;
                    if (!pc) return;
                    await pc.setRemoteDescription(answer);
                    setInCall(true);
                }
            }["CallPage.useEffect.onAccepted"];
            const onIce = {
                "CallPage.useEffect.onIce": (param)=>{
                    let { candidate } = param;
                    const pc = pcRef.current;
                    if (pc && pc.remoteDescription) {
                        pc.addIceCandidate(candidate).catch(console.error);
                    } else {
                        iceQueue.current.push(candidate);
                    }
                }
            }["CallPage.useEffect.onIce"];
            const onEnd = {
                "CallPage.useEffect.onEnd": ()=>hangUp()
            }["CallPage.useEffect.onEnd"];
            socket.on("incoming_call", onIncoming);
            socket.on("call_accepted", onAccepted);
            socket.on("ice_candidate", onIce);
            socket.on("call_ended", onEnd);
            return ({
                "CallPage.useEffect": ()=>{
                    socket.off("incoming_call", onIncoming);
                    socket.off("call_accepted", onAccepted);
                    socket.off("ice_candidate", onIce);
                    socket.off("call_ended", onEnd);
                }
            })["CallPage.useEffect"];
        }
    }["CallPage.useEffect"], [
        socket
    ]);
    // ─── 3) Outgoing call (triggered by clicking 🎥/🎤) ──────────
    const startCall = (id, voice)=>{
        setPeerId(id);
        setIsVoiceOnly(voice);
        setCalling(true);
    };
    // ─── 4) Create offer once `calling` is true ───────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!calling || !socket || !peerId) return;
            ({
                "CallPage.useEffect": async ()=>{
                    let stream;
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({
                            video: !isVoiceOnly,
                            audio: true
                        });
                    } catch (e) {
                        alert("Camera/microphone access denied");
                        setCalling(false);
                        return;
                    }
                    localRef.current.srcObject = stream;
                    const pc = new RTCPeerConnection(STUN_CONFIG);
                    pcRef.current = pc;
                    iceQueue.current.forEach({
                        "CallPage.useEffect": (c)=>pc.addIceCandidate(c).catch(console.error)
                    }["CallPage.useEffect"]);
                    iceQueue.current = [];
                    stream.getTracks().forEach({
                        "CallPage.useEffect": (t)=>pc.addTrack(t, stream)
                    }["CallPage.useEffect"]);
                    pc.ontrack = ({
                        "CallPage.useEffect": (e)=>remoteRef.current.srcObject = e.streams[0]
                    })["CallPage.useEffect"];
                    pc.onicecandidate = ({
                        "CallPage.useEffect": (param)=>{
                            let { candidate } = param;
                            if (candidate) {
                                socket.emit("ice_candidate", {
                                    to: peerId,
                                    candidate
                                });
                            }
                        }
                    })["CallPage.useEffect"];
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit("call_user", {
                        to: peerId,
                        offer,
                        isVoice: isVoiceOnly
                    });
                }
            })["CallPage.useEffect"]();
        }
    }["CallPage.useEffect"], [
        calling,
        socket,
        peerId,
        isVoiceOnly
    ]);
    // ─── 5) Accept incoming call ───────────────────────────────
    const acceptCall = async ()=>{
        if (!incomingCall || !socket) return;
        const { from, offer, isVoice } = incomingCall;
        setPeerId(from);
        setIncomingCall(null);
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: !isVoice,
                audio: true
            });
        } catch (e) {
            alert("Camera/microphone access denied");
            return;
        }
        localRef.current.srcObject = stream;
        const pc = new RTCPeerConnection(STUN_CONFIG);
        pcRef.current = pc;
        iceQueue.current.forEach((c)=>pc.addIceCandidate(c).catch(console.error));
        iceQueue.current = [];
        stream.getTracks().forEach((t)=>pc.addTrack(t, stream));
        pc.ontrack = (e)=>remoteRef.current.srcObject = e.streams[0];
        pc.onicecandidate = (param)=>{
            let { candidate } = param;
            if (candidate) socket.emit("ice_candidate", {
                to: from,
                candidate
            });
        };
        await pc.setRemoteDescription(offer);
        const ans = await pc.createAnswer();
        await pc.setLocalDescription(ans);
        socket.emit("answer_call", {
            to: from,
            answer: ans
        });
        setInCall(true);
    };
    // ─── 6) Hang up ───────────────────────────────────────────
    const hangUp = ()=>{
        const pc = pcRef.current;
        if (pc) pc.close();
        [
            localRef,
            remoteRef
        ].forEach((r)=>{
            const v = r.current;
            if (v === null || v === void 0 ? void 0 : v.srcObject) {
                v.srcObject.getTracks().forEach((t)=>t.stop());
                v.srcObject = null;
            }
        });
        if (peerId) {
            socket.emit("end_call", {
                to: peerId
            });
        }
        setCalling(false);
        setInCall(false);
        setPeerId(null);
        iceQueue.current = [];
    };
    if (loading || !socket) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-white",
        children: "Loading…"
    }, void 0, false, {
        fileName: "[project]/src/app/call/page.jsx",
        lineNumber: 192,
        columnNumber: 34
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4 text-white",
                children: "Start a Call"
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-3 mb-6",
                children: profiles.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center justify-between bg-gray-700 px-4 py-2 rounded",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: p.avatar || "/default-avatar.png",
                                        alt: p.username,
                                        className: "w-10 h-10 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 206,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white",
                                        children: p.username
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 211,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/call/page.jsx",
                                lineNumber: 205,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>startCall(p.id, false),
                                        className: "bg-green-500 px-3 py-1 rounded",
                                        children: "🎥"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>startCall(p.id, true),
                                        className: "bg-blue-500 px-3 py-1 rounded",
                                        children: "🎤"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 220,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/call/page.jsx",
                                lineNumber: 213,
                                columnNumber: 13
                            }, this)
                        ]
                    }, p.id, true, {
                        fileName: "[project]/src/app/call/page.jsx",
                        lineNumber: 201,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            (calling || inCall || incomingCall) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 p-6 rounded-lg flex flex-col items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: remoteRef,
                            autoPlay: true,
                            playsInline: true,
                            className: "w-80 h-60 mb-4 bg-black"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 235,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: localRef,
                            autoPlay: true,
                            playsInline: true,
                            muted: true,
                            className: "w-32 h-24 rounded-lg border-2 border-white mb-4 bg-black"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 241,
                            columnNumber: 13
                        }, this),
                        incomingCall && !inCall && !calling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: acceptCall,
                            className: "bg-blue-500 px-4 py-2 rounded text-white mb-4",
                            children: [
                                "Accept Call from ",
                                incomingCall.from
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 250,
                            columnNumber: 15
                        }, this),
                        (calling || inCall) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: hangUp,
                            className: "bg-red-600 px-4 py-2 rounded text-white",
                            children: "End Call"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 259,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/call/page.jsx",
                    lineNumber: 234,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 233,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/call/page.jsx",
        lineNumber: 195,
        columnNumber: 5
    }, this);
}
_s(CallPage, "mx8adzVhuVHo9w5O3z/1t2fBbVI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = CallPage;
var _c;
__turbopack_context__.k.register(_c, "CallPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_555f5346._.js.map