import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { requireChatGPTUser } from "./chatgpt-auth";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Octopus Admin",
  description: "Octopus Release platform operations console.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireChatGPTUser("/");
  const allowed = new Set(["suzywang168@gmail.com"]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {allowed.has(user.email.toLowerCase()) ? (
          children
        ) : (
          <main style={{ padding: 48, fontFamily: "system-ui" }}>
            <h1>Access denied</h1>
            <p>This account does not have Octopus Admin access.</p>
          </main>
        )}
      </body>
    </html>
  );
}
