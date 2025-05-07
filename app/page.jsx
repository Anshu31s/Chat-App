"use client";
import { signIn } from "next-auth/react";
export default function ChatApp() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-purple-400 to-pink-100 text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold tracking-tight">ChatApp</h1>
        <button
          onClick={() => signIn("google")}
          className="bg-white text-indigo-600 font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Sign in
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-20 max-w-6xl mx-auto gap-10">
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Real-time Chat. <br />
            Simple. Fast. Private.
          </h2>
          <p className="text-lg mb-6">
            Connect instantly with friends and colleagues. Share messages,
            files, and media — all in real-time with end-to-end security.
          </p>
          <button
            onClick={() => signIn("google")}
            className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition text-lg"
          >
            Get Started
          </button>
        </div>

        <div className="md:w-1/2">
          <div className="w-full h-72 bg-white/20 rounded-3xl shadow-lg flex items-center justify-center text-white text-xl font-medium">
            [ Chat UI Preview Here ]
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">⚡ Live Messaging</h3>
            <p>Instant delivery with zero lag using WebSockets.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">📎 File Sharing</h3>
            <p>Send images, documents, and videos with ease.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">🔒 Secure & Private</h3>
            <p>End-to-end encrypted. Your chats stay yours.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white py-6">
        &copy; {new Date().getFullYear()} ChatSphere. All rights reserved.
      </footer>
    </div>
  );
}
