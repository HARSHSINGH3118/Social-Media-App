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
"[project]/src/app/messages/[userId]/page.jsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/messages/[userId]/page.jsx
__turbopack_context__.s({
    "default": ()=>ChatPage
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
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
;
const EMOJI_LIST = [
    "😀",
    "😂",
    "😍",
    "😢",
    "👍",
    "🙏",
    "🎉",
    "💬"
];
const STUN_CONFIG = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};
function ChatPage() {
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { userId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])();
    const [partner, setPartner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showEmojiPicker, setShowEmojiPicker] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [incomingCall, setIncomingCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inCall, setInCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calling, setCalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVoiceOnly, setIsVoiceOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const endRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const typingTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const localVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const remoteVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const pcRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingCandidates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!loading && !user) router.push("/login");
        }
    }["ChatPage.useEffect"], [
        loading,
        user,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/users/profile/".concat(userId)).then({
                "ChatPage.useEffect": (param)=>{
                    let { data } = param;
                    return setPartner(data.user);
                }
            }["ChatPage.useEffect"]).catch(console.error);
        }
    }["ChatPage.useEffect"], [
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!socket || !user) return;
            socket.emit("join", user.id);
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/api/messages/".concat(userId)).then({
                "ChatPage.useEffect": (param)=>{
                    let { data } = param;
                    return setMessages(data);
                }
            }["ChatPage.useEffect"]).catch(console.error);
            socket.on("receive_message", {
                "ChatPage.useEffect": (m)=>setMessages({
                        "ChatPage.useEffect": (ms)=>[
                                ...ms,
                                m
                            ]
                    }["ChatPage.useEffect"])
            }["ChatPage.useEffect"]);
            socket.on("message_sent", {
                "ChatPage.useEffect": (m)=>setMessages({
                        "ChatPage.useEffect": (ms)=>[
                                ...ms,
                                m
                            ]
                    }["ChatPage.useEffect"])
            }["ChatPage.useEffect"]);
            socket.on("typing", {
                "ChatPage.useEffect": (param)=>{
                    let { from } = param;
                    return from === userId && setIsTyping(true);
                }
            }["ChatPage.useEffect"]);
            socket.on("stop_typing", {
                "ChatPage.useEffect": (param)=>{
                    let { from } = param;
                    return from === userId && setIsTyping(false);
                }
            }["ChatPage.useEffect"]);
            socket.on("incoming_call", {
                "ChatPage.useEffect": (param)=>{
                    let { from, offer, isVoice } = param;
                    return setIncomingCall({
                        from,
                        offer,
                        isVoice
                    });
                }
            }["ChatPage.useEffect"]);
            socket.on("call_accepted", {
                "ChatPage.useEffect": async (param)=>{
                    let { answer } = param;
                    await pcRef.current.setRemoteDescription(answer);
                    setInCall(true);
                }
            }["ChatPage.useEffect"]);
            socket.on("ice_candidate", {
                "ChatPage.useEffect": async (param)=>{
                    let { candidate } = param;
                    if (pcRef.current) {
                        try {
                            await pcRef.current.addIceCandidate(candidate);
                        } catch (e) {
                            console.error("Error adding ICE candidate:", e);
                        }
                    } else {
                        pendingCandidates.current.push(candidate);
                    }
                }
            }["ChatPage.useEffect"]);
            socket.on("call_ended", {
                "ChatPage.useEffect": ()=>endCall()
            }["ChatPage.useEffect"]);
            return ({
                "ChatPage.useEffect": ()=>{
                    socket.off("receive_message");
                    socket.off("message_sent");
                    socket.off("typing");
                    socket.off("stop_typing");
                    socket.off("incoming_call");
                    socket.off("call_accepted");
                    socket.off("ice_candidate");
                    socket.off("call_ended");
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        socket,
        user,
        userId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            var _endRef_current;
            (_endRef_current = endRef.current) === null || _endRef_current === void 0 ? void 0 : _endRef_current.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["ChatPage.useEffect"], [
        messages
    ]);
    const sendChat = ()=>{
        if (!socket || !input.trim()) return;
        socket.emit("send_message", {
            receiver_id: userId,
            content: input
        });
        setInput("");
        setShowEmojiPicker(false);
        socket.emit("stop_typing", {
            to: userId
        });
    };
    const onType = (e)=>{
        setInput(e.target.value);
        socket.emit("typing", {
            to: userId
        });
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(()=>socket.emit("stop_typing", {
                to: userId
            }), 600);
    };
    const addEmoji = (emoji)=>setInput((i)=>i + emoji);
    const pickPhoto = ()=>fileInputRef.current.click();
    const onPhotoChange = (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ()=>setInput(reader.result);
        reader.readAsDataURL(file);
    };
    const startCall = function() {
        let voiceOnly = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        setIsVoiceOnly(voiceOnly);
        setCalling(true);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            if (!calling || !socket) return;
            ({
                "ChatPage.useEffect": async ()=>{
                    let stream;
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({
                            video: !isVoiceOnly,
                            audio: true
                        });
                    } catch (err) {
                        alert("Camera or microphone access denied");
                        setCalling(false);
                        return;
                    }
                    localVideoRef.current.srcObject = stream;
                    const pc = new RTCPeerConnection(STUN_CONFIG);
                    pcRef.current = pc;
                    pendingCandidates.current.forEach({
                        "ChatPage.useEffect": async (cand)=>{
                            try {
                                await pc.addIceCandidate(cand);
                            } catch (e) {
                                console.error("Buffered ICE Error:", e);
                            }
                        }
                    }["ChatPage.useEffect"]);
                    pendingCandidates.current = [];
                    stream.getTracks().forEach({
                        "ChatPage.useEffect": (t)=>pc.addTrack(t, stream)
                    }["ChatPage.useEffect"]);
                    pc.ontrack = ({
                        "ChatPage.useEffect": (e)=>remoteVideoRef.current.srcObject = e.streams[0]
                    })["ChatPage.useEffect"];
                    pc.onicecandidate = ({
                        "ChatPage.useEffect": (param)=>{
                            let { candidate } = param;
                            if (candidate) socket.emit("ice_candidate", {
                                to: userId,
                                candidate
                            });
                        }
                    })["ChatPage.useEffect"];
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit("call_user", {
                        to: userId,
                        offer,
                        isVoice: isVoiceOnly
                    });
                }
            })["ChatPage.useEffect"]();
        }
    }["ChatPage.useEffect"], [
        calling,
        socket,
        userId,
        isVoiceOnly
    ]);
    const acceptCall = async ()=>{
        if (!socket || !incomingCall) return;
        const { from, offer, isVoice } = incomingCall;
        setIncomingCall(null);
        setInCall(true);
        let stream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: !isVoice,
                audio: true
            });
        } catch (err) {
            alert("No camera/mic access");
            setInCall(false);
            return;
        }
        localVideoRef.current.srcObject = stream;
        const pc = new RTCPeerConnection(STUN_CONFIG);
        pcRef.current = pc;
        pendingCandidates.current.forEach(async (cand)=>{
            try {
                await pc.addIceCandidate(cand);
            } catch (e) {
                console.error("Buffered ICE Error:", e);
            }
        });
        pendingCandidates.current = [];
        stream.getTracks().forEach((t)=>pc.addTrack(t, stream));
        pc.ontrack = (e)=>remoteVideoRef.current.srcObject = e.streams[0];
        pc.onicecandidate = (param)=>{
            let { candidate } = param;
            if (candidate) socket.emit("ice_candidate", {
                to: from,
                candidate
            });
        };
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer_call", {
            to: from,
            answer
        });
    };
    const endCall = ()=>{
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        [
            localVideoRef,
            remoteVideoRef
        ].forEach((ref)=>{
            var _ref_current;
            if ((_ref_current = ref.current) === null || _ref_current === void 0 ? void 0 : _ref_current.srcObject) {
                ref.current.srcObject.getTracks().forEach((t)=>t.stop());
                ref.current.srcObject = null;
            }
        });
        setInCall(false);
        setCalling(false);
        setIncomingCall(null);
        socket.emit("end_call", {
            to: userId
        });
    };
    if (loading || !user || !socket || !partner) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-800 w-full max-w-3xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between bg-gray-900 px-6 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.back(),
                                    className: "text-2xl",
                                    children: "←"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 244,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: partner.avatar,
                                    alt: partner.username,
                                    className: "w-10 h-10 rounded-full"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-semibold",
                                    children: partner.username
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 243,
                            columnNumber: 11
                        }, this),
                        !inCall && !incomingCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>startCall(false),
                                    className: "bg-green-500 px-3 py-1 rounded",
                                    children: "📹"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>startCall(true),
                                    className: "bg-blue-500 px-3 py-1 rounded",
                                    children: "🎤"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 262,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 255,
                            columnNumber: 13
                        }, this),
                        inCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: endCall,
                            className: "bg-red-500 px-3 py-1 rounded",
                            children: "✖️"
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 271,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                    lineNumber: 242,
                    columnNumber: 9
                }, this),
                (calling || inCall) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 relative bg-black",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: remoteVideoRef,
                            autoPlay: true,
                            className: "w-full h-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: localVideoRef,
                            autoPlay: true,
                            muted: true,
                            className: "absolute bottom-4 right-4 w-32 h-24 object-cover rounded-lg border-2 border-white"
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 285,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                    lineNumber: 279,
                    columnNumber: 11
                }, this),
                incomingCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-900 p-6 rounded-lg text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-4",
                                children: [
                                    partner.username,
                                    " is calling…"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                lineNumber: 298,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: acceptCall,
                                className: "bg-blue-500 px-4 py-2 rounded",
                                children: "Accept"
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                lineNumber: 299,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/messages/[userId]/page.jsx",
                        lineNumber: 297,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                    lineNumber: 296,
                    columnNumber: 11
                }, this),
                !calling && !inCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto px-6 py-4 space-y-3",
                            children: [
                                messages.map((msg, i)=>{
                                    const mine = msg.sender_id === user.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex ".concat(mine ? "justify-end" : "justify-start"),
                                        children: [
                                            !mine && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: partner.avatar,
                                                className: "w-8 h-8 rounded-full mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                                lineNumber: 321,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-4 py-2 rounded-lg max-w-[70%] ".concat(mine ? "bg-blue-500 text-white" : "bg-gray-700 text-white"),
                                                children: msg.content.startsWith("data:image") ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: msg.content,
                                                    alt: "sent",
                                                    className: "rounded max-w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                                    lineNumber: 334,
                                                    columnNumber: 25
                                                }, this) : msg.content
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                                lineNumber: 326,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                        lineNumber: 316,
                                        columnNumber: 19
                                    }, this);
                                }),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: endRef
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 346,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 312,
                            columnNumber: 13
                        }, this),
                        isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 pb-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "italic text-sm text-gray-400",
                                children: "Typing…"
                            }, void 0, false, {
                                fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                lineNumber: 351,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 350,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-900 px-6 py-4 flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowEmojiPicker((v)=>!v),
                                    className: "text-2xl",
                                    children: "😀"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: pickPhoto,
                                    className: "text-2xl",
                                    children: "📷"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "file",
                                    accept: "image/*",
                                    ref: fileInputRef,
                                    onChange: onPhotoChange,
                                    className: "hidden"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 365,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: input,
                                    onChange: onType,
                                    onKeyDown: (e)=>e.key === "Enter" && sendChat(),
                                    placeholder: "Type your message…",
                                    className: "flex-1 bg-gray-700 px-4 py-2 rounded-full focus:outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 372,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: sendChat,
                                    className: "bg-blue-600 px-5 py-2 rounded-full hover:bg-blue-700",
                                    children: "Send"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 380,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this),
                        showEmojiPicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-gray-700 p-4 grid grid-cols-8 gap-2 overflow-y-auto max-h-40",
                            children: EMOJI_LIST.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>addEmoji(e),
                                    className: "text-2xl",
                                    children: e
                                }, e, false, {
                                    fileName: "[project]/src/app/messages/[userId]/page.jsx",
                                    lineNumber: 391,
                                    columnNumber: 19
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/app/messages/[userId]/page.jsx",
                            lineNumber: 389,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/messages/[userId]/page.jsx",
            lineNumber: 240,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/messages/[userId]/page.jsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_s(ChatPage, "+zcvItyuuM4drBut1w+nv7Aircg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$SocketContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = ChatPage;
var _c;
__turbopack_context__.k.register(_c, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_59c60c83._.js.map