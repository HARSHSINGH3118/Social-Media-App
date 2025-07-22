module.exports = {

"[project]/src/contexts/AuthContext.jsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const bcrypt = (()=>{
    const e = new Error("Cannot find module 'bcryptjs'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const cloudinary = (()=>{
    const e = new Error("Cannot find module '../config/cloudinary'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const { createUser, getUserByEmail, getUserById, updateUserProfile, findUserByEmail, createOAuthUser, getUserByUsernameWithPosts } = (()=>{
    const e = new Error("Cannot find module '../models/userModel'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const { getPostsByUserId } = (()=>{
    const e = new Error("Cannot find module '../models/postModel'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
const generateToken = (()=>{
    const e = new Error("Cannot find module '../utils/generateToken'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
// =============================
// 🧾 Register New User
// =============================
async function registerUser(req, res) {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({
        message: "All fields are required"
    });
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(409).json({
            message: "User already exists"
        });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
}
// =============================
// 🔐 Login
// =============================
async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({
        message: "Email and password required"
    });
    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({
            message: "Invalid credentials"
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({
            message: "Invalid credentials"
        });
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user.id)
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
}
// =============================
// 🔑 OAuth Login or Register
// =============================
async function oauthLogin(req, res) {
    const { email, username, avatar, provider } = req.body;
    if (!email || !username || !provider) return res.status(400).json({
        message: "Missing required fields"
    });
    try {
        let user = await findUserByEmail(email);
        if (!user) {
            user = await createOAuthUser({
                email,
                username,
                avatar,
                provider
            });
        }
        res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            provider: user.provider,
            token: generateToken(user.id)
        });
    } catch (err) {
        console.error("OAuth Login Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
}
// =============================
// 👤 Get Current Profile (with posts)
// =============================
async function getProfile(req, res) {
    try {
        const user = await getUserById(req.user.id);
        if (!user) return res.status(404).json({
            message: "User not found"
        });
        const posts = await getPostsByUserId(user.id);
        res.json({
            user,
            posts
        });
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
}
// =============================
// 📄 Public Profile by ID
// =============================
async function getPublicProfileById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }
        const user = await getUserById(id);
        if (!user) return res.status(404).json({
            message: "User not found"
        });
        const posts = await getPostsByUserId(id);
        res.json({
            user,
            posts
        });
    } catch (err) {
        console.error("Get Public Profile by ID Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
}
// =============================
// ✏️ Update Profile
// =============================
const updateProfile = async (req, res)=>{
    try {
        const { username, bio } = req.body;
        let avatarUrl;
        if (req.file && req.file.buffer) {
            const streamUpload = (buffer)=>new Promise((resolve, reject)=>{
                    const stream = cloudinary.uploader.upload_stream({
                        folder: "avatars",
                        resource_type: "image"
                    }, (error, result)=>{
                        if (error) return reject(error);
                        resolve(result);
                    });
                    stream.end(buffer);
                });
            const uploadResult = await streamUpload(req.file.buffer);
            avatarUrl = uploadResult.secure_url;
        }
        const updatedUser = await updateUserProfile(req.user.id, {
            username: username || null,
            bio: bio || null,
            avatar: avatarUrl || null
        });
        res.json(updatedUser);
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
    oauthLogin,
    getProfile,
    updateProfile,
    getPublicProfileById
};
}}),
"[project]/src/components/Navbar.jsx [app-rsc] (client reference proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/Navbar.jsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/Navbar.jsx <module evaluation>", "default");
}),
"[project]/src/components/Navbar.jsx [app-rsc] (client reference proxy)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/Navbar.jsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/Navbar.jsx", "default");
}),
"[project]/src/components/Navbar.jsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/Navbar.jsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.jsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/layout.jsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

// src/app/layout.jsx
__turbopack_context__.s({
    "default": ()=>RootLayout,
    "metadata": ()=>metadata
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.jsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Navbar$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Navbar.jsx [app-rsc] (ecmascript)"); // ✅ optional
;
;
;
;
const metadata = {
    title: "Social Media App",
    description: "Login to get started"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
            className: "bg-gray-900 text-white",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$jsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AuthProvider"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/src/app/layout.jsx",
                lineNumber: 15,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/layout.jsx",
            lineNumber: 14,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/layout.jsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { m: module, e: exports } = __turbopack_context__;
{
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-rsc] (ecmascript)").vendored['react-rsc'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),

};

//# sourceMappingURL=_81a8b168._.js.map