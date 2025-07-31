
# 🧑‍💻 Huddle – Full Stack Social Media App

Huddle is a full-featured real-time social media platform built with **Node.js + Express**, **PostgreSQL**, **Next.js (App Router)**, **Tailwind CSS**, **Socket.IO**, **Cloudinary**, and more.

---

## 🚀 Live Features Overview

### 🔐 Authentication
- **JWT + Google OAuth** login
- **Register/Login** with role support (`admin`, `user`)
- Protected routes, logout, and session-based auth

### 👤 User Profiles
- View & edit profile with bio and avatar
- Avatar upload via Cloudinary
- Follow / Unfollow + counts
- View other public profiles

### 📝 Posts
- Create text/image posts with hashtags + @mentions
- Like/unlike with live count
- Edit or delete own posts
- View posts by tag in Explore

### 💬 Comments
- Add and view threaded comments on posts
- Show commenter's info and timestamps

### 📬 Messages (DMs)
- Real-time one-to-one messaging via **Socket.IO**
- Features: 
  - **Online/offline status**
  - **Typing indicator**
  - **Reply to message**
  - **Delete own message**
  - **Timestamps + Today/Yesterday separators**

### 🎥 Calls (WebRTC)
- Video and voice calling
- Signal exchange using socket.io
- Show calling modal and permission handling

### 🔔 Notifications
- Realtime notifications on like, follow, mention
- Notification counter + listing page
- Mark all as read

### 🔍 Explore
- Browse by tags (`/explore/tag/:tag`)
- Trending tags (if enabled)

---

## 🗂️ Folder Structure

### 🔙 Backend (Node.js + Express)
```
backend/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── commentController.js
│   │   ├── followController.js
│   │   ├── likeController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── postController.js
│   │   ├── tagController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── avatarUpload.js
│   │   ├── errorHandler.js
│   │   ├── optionalAuth.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── commentModel.js
│   │   ├── followModel.js
│   │   ├── likeModel.js
│   │   ├── messageModel.js
│   │   ├── notificationModel.js
│   │   ├── postModel.js
│   │   ├── tagModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── postRoutes.js
│   │   ├── tagRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── parseHashtags.js
│   │   ├── parseMentions.js
│   │   └── sendEmail.js
│   ├── index.js
│   └── socket.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── Procfile

```

### 🖥️ Frontend (Next.js App Router)
```
social-media-frontend/
├── .next/
├── node_modules/
├── public/
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── call/
│   │   ├── create/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── reset-password/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   ├── components/
│   │   └── [all reusable UI components]
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── SocketContext.jsx
│   ├── lib/
│   │   ├── api.js
│   │   └── auth.js
│   ├── services/
│   │   ├── api.js
│   │   └── notificationAPI.js
│   ├── styles/
│   │   └── [Tailwind/global styles if any]
│   └── utils/
│       └── [utility functions like formatDate, etc.]
├── .env.local
├── .gitignore
├── eslint.config.mjs
└── jsconfig.json

```

---

## 🌐 Pages Overview

| Page                   | Route                 | Description                        |
|------------------------|-----------------------|------------------------------------|
| Login / Register       | `/login`, `/register` | Auth forms + Google OAuth          |
| Dashboard              | `/dashboard`          | News, Reels, Feed, Explore         |
| Explore Tag            | `/explore/tag/[tag]`  | Posts by Hashtag                   |
| Messages               | `/messages`           | Chat inbox with all users          |
| Chat                   | `/messages/[userId]`  | Real-time DMs, call support        |
| Call                   | `/call`               | WebRTC-based voice/video calling   |
| Notifications          | `/notifications`      | All received notifications         |
| Profile                | `/profile/[id]`       | View/edit user profiles            |
| Forgot / Reset Pass    | `/forgot-password`    | Forgot password flow               |
|                        | `/reset-password`     | Reset password (via email link)    |

---

## 🧠 Tech Stack

| Layer      | Tech                                     |
|------------|------------------------------------------|
| Frontend   | Next.js (App Router), Tailwind CSS, Axios |
| Backend    | Node.js, Express.js, PostgreSQL          |
| Auth       | JWT, Passport.js (Google OAuth)          |
| Realtime   | Socket.IO, WebRTC                        |
| Uploads    | Cloudinary, Multer                       |
| Deploy     | Vercel (frontend), Render (backend)      |

---

## ⚙️ Local Development

### 🔧 Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 🧑‍🎨 Frontend Setup
```bash
cd social-media-frontend
npm install
npm run dev
```

---

## 🧪 API Summary

### 📌 Auth Routes
```
POST   /api/users/register
POST   /api/users/login
POST   /api/users/oauth
GET    /api/users/profile (auth)
PUT    /api/users/profile (auth)
```

### 📌 Posts
```
POST   /api/posts       (create)
GET    /api/posts       (all)
GET    /api/posts/:id   (single)
PUT    /api/posts/:id   (edit)
DELETE /api/posts/:id   (delete)
```

### 📌 Messages
```
GET    /api/messages/:userId
POST   /api/messages
```

### 📌 Notifications
```
GET    /api/notifications
PUT    /api/notifications/read
```

---

## 📸 Screenshots

### 🏠 Dashboard & Explore

| Dashboard (Feed + Sidebar) | Trending Tags |
|----------------------------|----------------|
| ![Dashboard](https://github.com/user-attachments/assets/123c07a1-ac2d-4122-97c6-aad17790c174) | ![Tags](https://github.com/user-attachments/assets/949a43a8-a4fb-4e92-a79b-96aa57eca779) |

---

### 💬 Messages & Realtime Chat

| DM Inbox | Create Post |
|----------|-------------|
| ![Messages](https://github.com/user-attachments/assets/dcf56f2a-bf52-454b-b7be-96c4e3074fe5) | ![Chat](https://github.com/user-attachments/assets/1111e5bc-0cf2-45b6-a4a8-994de91b3c4b) |

---

### 🔔 Notifications

| Notifications Page |
|---------------------|
 | ![Profile](https://github.com/user-attachments/assets/89ec2f36-1bcc-441a-9e7e-0ec642165673) |

---

### 👤 Profile & Auth

| Profile Page | Reset Password |
|--------------|---------------|
| ![Notifications](https://github.com/user-attachments/assets/fc93b4e5-69ce-42f2-ab8f-587a35445b3c) | ![Avatar Upload](https://github.com/user-attachments/assets/e93296fb-ef42-4138-be46-9e7306d4e11a) |

| Register Page |Login Page |
|------------|---------------|
| ![Login](https://github.com/user-attachments/assets/f18c8cbf-048e-470c-88ec-0377f7be0ddd) | ![Register](https://github.com/user-attachments/assets/7d3c6162-41ba-4eb2-bc48-1fc3505bfcce) |


---




---

## 📣 Credits

Built with ❤️ by **Harsh** — the proud solo creator of this social media platform.

> This project is the outcome of deep learning, late nights, and relentless passion for tech.  
> Every line of code here represents the journey of a student building for a better digital world.

---

## 📄 License

**© 2025 Harsh – All Rights Reserved**

This repository is not open for unrestricted modification.  
To add a feature or fix:
- Submit a Pull Request
- Mention clearly what you’re adding
- Await review & approval

🛑 Unauthorized use, redistribution, or commercial cloning is **not permitted**.

---

> ✍️ _Created by a student, for the students._

---

### 🌍 Personal Note

**Pitaji,**  
**_My world revolves around you!_** ❤️

 

