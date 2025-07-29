(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

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
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    // call state
    const [callData, setCallData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [inCall, setInCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calling, setCalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // refs
    const localRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const remoteRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pcRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pendingICE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // 1) Join your socket room
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!socket || !user) return;
            socket.emit("join", user.id);
        }
    }["CallPage.useEffect"], [
        socket,
        user
    ]);
    // 2) Signaling listeners (exactly like in your chat page)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!socket) return;
            // Incoming call
            const onIncoming = {
                "CallPage.useEffect.onIncoming": (param)=>{
                    let { from, offer, isVoice } = param;
                    setCallData({
                        from,
                        incoming: true,
                        offer,
                        isVoice
                    });
                }
            }["CallPage.useEffect.onIncoming"];
            socket.on("incoming_call", onIncoming);
            // Callee accepts our outgoing call
            const onAccepted = {
                "CallPage.useEffect.onAccepted": async (param)=>{
                    let { answer } = param;
                    const pc = pcRef.current;
                    if (!pc) return;
                    await pc.setRemoteDescription(answer);
                    setInCall(true);
                }
            }["CallPage.useEffect.onAccepted"];
            socket.on("call_accepted", onAccepted);
            // ICE candidates
            const onIce = {
                "CallPage.useEffect.onIce": (param)=>{
                    let { candidate } = param;
                    const pc = pcRef.current;
                    if (pc && pc.remoteDescription) {
                        pc.addIceCandidate(candidate).catch(console.error);
                    } else {
                        pendingICE.current.push(candidate);
                    }
                }
            }["CallPage.useEffect.onIce"];
            socket.on("ice_candidate", onIce);
            // Hang-up
            socket.on("call_ended", {
                "CallPage.useEffect": ()=>{
                    hangUp();
                }
            }["CallPage.useEffect"]);
            return ({
                "CallPage.useEffect": ()=>{
                    socket.off("incoming_call", onIncoming);
                    socket.off("call_accepted", onAccepted);
                    socket.off("ice_candidate", onIce);
                    socket.off("call_ended", hangUp);
                }
            })["CallPage.useEffect"];
        }
    }["CallPage.useEffect"], [
        socket
    ]);
    // 3) Kick off outgoing call when `callData` is set with `{ to, incoming:false }`
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallPage.useEffect": ()=>{
            if (!callData || !socket) return;
            const { incoming, to, from, offer, isVoice } = callData;
            ({
                "CallPage.useEffect": async ()=>{
                    // 3a) Grab media
                    let stream;
                    try {
                        stream = await navigator.mediaDevices.getUserMedia({
                            video: !isVoice,
                            audio: true
                        });
                    } catch (e) {
                        alert("Camera/microphone access denied");
                        setCallData(null);
                        return;
                    }
                    localRef.current.srcObject = stream;
                    // 3b) Create PeerConnection
                    const pc = new RTCPeerConnection(STUN_CONFIG);
                    pcRef.current = pc;
                    pendingICE.current.forEach({
                        "CallPage.useEffect": (c)=>pc.addIceCandidate(c).catch(console.error)
                    }["CallPage.useEffect"]);
                    pendingICE.current = [];
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
                                    to: incoming ? from : to,
                                    candidate
                                });
                            }
                        }
                    })["CallPage.useEffect"];
                    // 3c) Offer or answer
                    if (incoming) {
                        await pc.setRemoteDescription(offer);
                        const ans = await pc.createAnswer();
                        await pc.setLocalDescription(ans);
                        socket.emit("answer_call", {
                            to: from,
                            answer: ans
                        });
                        setInCall(true);
                    } else {
                        const off = await pc.createOffer();
                        await pc.setLocalDescription(off);
                        socket.emit("call_user", {
                            to,
                            offer: off,
                            isVoice
                        });
                    }
                    setCalling(true);
                }
            })["CallPage.useEffect"]();
        }
    }["CallPage.useEffect"], [
        callData,
        socket
    ]);
    // 4) Hang-up helper
    const hangUp = ()=>{
        const pc = pcRef.current;
        if (pc) pc.close();
        [
            localRef,
            remoteRef
        ].forEach((r)=>{
            var _r_current;
            if ((_r_current = r.current) === null || _r_current === void 0 ? void 0 : _r_current.srcObject) {
                r.current.srcObject.getTracks().forEach((t)=>t.stop());
                r.current.srcObject = null;
            }
        });
        if (callData) {
            const peer = callData.incoming ? callData.from : callData.to;
            socket.emit("end_call", {
                to: peer
            });
        }
        setCallData(null);
        setCalling(false);
        setInCall(false);
        pendingICE.current = [];
    };
    if (loading || !socket) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
        className: "text-white",
        children: "Loading…"
    }, void 0, false, {
        fileName: "[project]/src/app/call/page.jsx",
        lineNumber: 151,
        columnNumber: 34
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-bold mb-4",
                children: "Start a Call"
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-3",
                children: [
                    "userA",
                    "userB",
                    "userC"
                ].map((id)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: id
                            }, void 0, false, {
                                fileName: "[project]/src/app/call/page.jsx",
                                lineNumber: 162,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCallData({
                                                to: id,
                                                incoming: false,
                                                isVoice: false
                                            }),
                                        className: "bg-green-500 px-3 py-1 rounded",
                                        children: "🎥"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 164,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setCallData({
                                                to: id,
                                                incoming: false,
                                                isVoice: true
                                            }),
                                        className: "bg-blue-500 px-3 py-1 rounded",
                                        children: "🎤"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/call/page.jsx",
                                        lineNumber: 172,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/call/page.jsx",
                                lineNumber: 163,
                                columnNumber: 13
                            }, this)
                        ]
                    }, id, true, {
                        fileName: "[project]/src/app/call/page.jsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            (calling || inCall) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 p-4 rounded-lg flex flex-col items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: remoteRef,
                            autoPlay: true,
                            playsInline: true,
                            className: "w-80 h-60 mb-4"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: localRef,
                            autoPlay: true,
                            playsInline: true,
                            muted: true,
                            className: "w-32 h-24 rounded-lg border-2 border-white"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 195,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: hangUp,
                            className: "mt-4 bg-red-600 px-4 py-2 rounded",
                            children: "End Call"
                        }, void 0, false, {
                            fileName: "[project]/src/app/call/page.jsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/call/page.jsx",
                    lineNumber: 188,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/call/page.jsx",
                lineNumber: 187,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/call/page.jsx",
        lineNumber: 154,
        columnNumber: 5
    }, this);
}
_s(CallPage, "btGYnwwOLnZBfP4FeC1fj+XUgNw=", false, function() {
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

//# sourceMappingURL=src_app_call_page_jsx_46561aa1._.js.map