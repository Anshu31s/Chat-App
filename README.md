## **ChatApp: Real-time Messaging and File Sharing Platform**

### **Overview**

ChatApp is a powerful, real-time messaging platform built with **Next.js**, **Socket.IO**, and **MongoDB**. It allows users to send and receive messages instantly, share a variety of media files (images, videos, documents, PDFs, Excel files .etc), and enjoy a seamless chat experience with additional features like online status, typing indicators, last seen, and more.

### **Key Features**

1. **Real-Time Messaging**

   * Powered by **Socket.IO**, ChatApp allows users to send and receive messages without any delay.
   * Experience instant communication as soon as messages are sent.

2. **Multi-File Share support**

   * Users can send a wide range of file types: images, videos, Word documents, PDFs, Excel files, etc.
   * File uploads are handled securely using **Azure Blob Storage** for seamless file management.
   * The app uses **Axios** and **Sharp** to efficiently manage and process file uploads and images.

3. **Online Status & Last Seen**

   * Users can see when their friends are online in real-time, providing better interaction and user experience.
   * The **last seen** feature allows users to see when a friend was last active.

4. **Friend Management**

   * Easily **add or remove friends** to manage your contacts.
   * Friend requests are managed with a simple click, helping users keep their social network organized.

5. **Typing Indicator**

   * ChatApp features a **typing indicator** that shows when the other user is typing a message, making the chat more interactive and engaging.

6. **Unread chat indicator**

   * ChatApp features if user is offline when they come online they see dots with number that represent unread message they receive when they are offline that they have to read.

7. **User Authentication**

   * Secure authentication is handled by **NextAuth**, allowing users to sign in using their Google accounts.
   * Authentication ensures privacy and personalized user experiences.

8. **Database Integration**

   * All messages and user data are stored in **MongoDB**, providing a robust and scalable database solution.
   * Prisma ORM is used to simplify database queries and interaction with MongoDB.


### **Tech Stack**

* **Frontend**:

  * Built with **Next.js**, providing fast page loads and seamless routing.
  * **ShadCN components**, **Lucide React**, and **React Icons** for a modern, minimalist UI.
  * **Socket.IO** for real-time communication and dynamic interactions.

* **Backend**:

  * **MongoDB** as the database, storing user data, chat logs, and other important information.
  * **Prisma ORM** for efficient database management and queries.

* **cloud storage**:

  * **Azure Blob Storage** for secure, scalable file uploads (images, videos, documents).
  * **Axios** for HTTP requests to manage file transfers and API communication.
  * **Sharp** for image processing (e.g., resizing, optimization).

* **Authentication**:

  * **NextAuth** for managing user authentication via Google login.

---

### **How It Works**

1. **User Interaction**:

   * A user can sign in with Google via **NextAuth** and immediately start chatting.
   * After signing in, the user can search for friends, send messages, share files, and see when friends are online.

2. **Real-Time Messaging**:

   * **Socket.IO** establishes a live connection between users. Messages are transmitted instantly.
   * The **typing indicator** feature ensures users know when the other is composing a message.

3. **File Sharing**:

   * The user can upload various types of files (images, documents, etc.), which are stored securely in **Azure Blob Storage**.
   * Once uploaded, the file link is shared with the other user in the chat, enabling easy access and downloads.

4. **User Status**:

   * Users can see whether their friends are **online** in real-time and view their **last seen** time.

---

### **Future Plans**

* **Group Chats**: Adding support for group messaging.
* **Message Search**: Users will be able to search for messages and files within their conversations.
* **Push Notifications**: To notify users of new messages even when they are not active in the app.

---

### **Try ChatApp Now!**

Experience a modern, fast, and private chat app. \[Sign in now] and start chatting with your friends!


