"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function ChatApp() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">ChatApp</h1>
          <button
            onClick={() => signIn("google")}
            className="border border-gray-300 bg-white px-4 py-2 rounded-md text-sm hover:bg-gray-100 transition"
          >
            Sign in with Google
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Real-time Chat. <br /> Simple. Fast. Private.
          </h2>
          <p className="text-gray-600 text-base">
            ChatApp is a modern, real-time messaging platform that allows users to send and receive messages instantly with no lag. 
            It supports sending files of various formats like images, videos, Word documents, PDFs, Excel files, and more.
            Enjoy seamless communication with friends and colleagues while ensuring end-to-end security of your messages.
          </p>
          <p className="text-gray-600 text-base">
            With features like online status, typing indicators, and friend management, you can stay connected and keep track of your conversations. 
            Everything is securely stored in MongoDB, with efficient data management powered by Prisma.
          </p>
          <button
            onClick={() => signIn("google")}
            className="bg-black text-white px-5 py-2 rounded-md text-sm hover:bg-neutral-800 transition"
          >
            Get Started
          </button>
        </div>

        <div className="w-full">
          <div className="rounded-md overflow-hidden border shadow-sm">
            <Image
              src="/ui.png"
              alt="Chat UI"
              width={1200}
              height={700}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="border-t py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div className="space-y-2">
            <h3 className="font-medium">⚡ Live Messaging</h3>
            <p className="text-gray-600">ChatApp uses WebSockets to provide real-time messaging. Send and receive messages instantly with zero lag. Whether you&apos;re chatting with a friend or in a group, messages are delivered in real-time, giving you an instant communication experience.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">📎 File Sharing</h3>
            <p className="text-gray-600">Easily send files, images, videos, Word documents, PDFs, Excel sheets, and more with a simple upload. All file transfers are securely handled, and you can store and manage your files with Azure Blob Storage for better accessibility.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">🔒 End-to-End Security</h3>
            <p className="text-gray-600">ChatApp ensures that all messages and media are encrypted end-to-end. Your privacy is our priority, and all communications stay secure and private between you and your contacts. We never compromise on your security.</p>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="border-t py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-2">
            <h3 className="font-medium">👥 Friend Management</h3>
            <p className="text-gray-600">You can easily add or remove friends, helping you manage your chat contacts efficiently. Whether it&apos;s adding someone new or removing someone you no longer wish to chat with, managing friends is seamless.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">🕒 Last Seen &amp; Online Status</h3>
            <p className="text-gray-600">Stay informed about your friends&apos; availability with the &quot;last seen&quot; and &quot;online status&quot; features. You&apos;ll always know when your contacts are online, and you can choose to message them at the right time.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">✏️ Typing Indicators</h3>
            <p className="text-gray-600">Get real-time feedback when someone is typing. The typing indicator ensures that you know when your friend is actively engaged in a conversation, improving your chat experience.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t text-center text-sm text-gray-500 py-6 mt-auto">
        © {new Date().getFullYear()} ChatApp. All rights reserved.
      </footer>
    </div>
  );
}
