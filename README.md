
# **ChatApp: Real-time Messaging and File Sharing Platform**

### **Try ChatApp Now!**  
Experience a modern, fast, and private chat app.  

👉 [**Live Demo**](https://chat-app-jrrj.onrender.com)  

[Sign in now] and start chatting with your friends!

---

## **Overview**

ChatApp is a powerful, real-time messaging platform built with **Next.js**, **Socket.IO**, and **MongoDB**. It allows users to send and receive messages instantly, share a variety of media files (images, videos, documents, PDFs, Excel files, etc.), and enjoy a seamless chat experience with additional features like online status, typing indicators, last seen, and more.

---

## **Key Features**

- ⚡ **Real-Time Messaging** – Powered by **Socket.IO** for instant communication.  
- 📁 **Multi-File Sharing** – Send images, videos, PDFs, Word, Excel, and more via **Azure Blob Storage**.  
- 🟢 **Online Status & Last Seen** – Know when your friends are online or last active.  
- 👥 **Friend Management** – Add/remove friends with ease.  
- ⌨️ **Typing Indicator** – See when the other user is typing.  
- 🔔 **Unread Chat Indicator** – Offline messages are tracked and shown as unread.  
- 🔐 **User Authentication** – Secure login with **Google (NextAuth)**.  
- 🗄 **Database Integration** – Built on **MongoDB** with **Prisma ORM**.

---

## **Tech Stack**

**Frontend**  
- Next.js  
- ShadCN components, Lucide React, React Icons  
- Socket.IO (real-time updates)  

**Backend**  
- MongoDB + Prisma ORM  
- NextAuth (Google authentication)  

**Cloud Storage**  
- Azure Blob Storage (secure file uploads)  
- Axios (API/file transfers)  
- Sharp (image optimization)  

---

## **How It Works**

1. Users log in with Google using **NextAuth**.  
2. Add friends, send messages, and share files instantly via **Socket.IO**.  
3. Files are uploaded securely to **Azure Blob Storage**.  
4. ChatApp shows **online status, last seen, typing indicator, and unread messages** in real time.  

---

## **Future Plans**

- 👨‍👩‍👧 **Group Chats** – Multiple participants in one conversation.  
- 🔎 **Message Search** – Search messages and files inside chats.  
- 📲 **Push Notifications** – Real-time notifications even when offline.  

---

## **Installation & Setup**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/chatapp.git
cd chatapp
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root folder and add the following:

```env
GOOGLE_CLIENT_ID=8hogqd87csm.apps.googleusercontent.com 
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
PORT=3000
NEXTAUTH_URL=http://localhost:3000

DATABASE_URL="mongodb+srv://username:password@cluster0.qbeaq.mongodb.net/chatapp?retryWrites=true&w=majority"

AZURE_STORAGE_CONNECTION_STRING=""
AZURE_CONTAINER_NAME=
AZURE_STORAGE_ACCOUNT_NAME=
```

> ⚠️ Replace empty values (`""`) with your actual credentials.

### 4. Run the development server

```bash
npm run dev
```

### 5. Open the app

👉 Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## **Deployment**

* **Frontend & Backend** → Deploy on **Vercel** (works great with Next.js).
* **Database** → Use **MongoDB Atlas**.
* **Storage** → Configure **Azure Blob Storage** for file uploads.
* **Authentication** → Set Google credentials in your Vercel environment variables.

---

💬 **ChatApp – Fast. Secure. Real-time.**
Start chatting today! 🚀

