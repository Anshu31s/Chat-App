import localFont from "next/font/local";
import "./globals.css";
import NextAuthProvider from "./Authprovider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Chat App",
  description: "create by Anshukiran sharma",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased select-none`}
      >
        <NextAuthProvider>
        {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
