"use client";

import Image from "next/image";
import { useState } from "react";
import Chatbox from "@/components/chat/Chatbox";

export default function FREETrialApprovedClient() {
  const [chatOpen, setChatOpen] = useState(false);

  if (chatOpen) {
    return (
      <main style={{ textAlign: "center", padding: "24px 16px" }}>
        <Chatbox embedded onClose={() => setChatOpen(false)} />
      </main>
    );
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => setChatOpen(true)}
        aria-label="Open MAX-LIT Chat"
        style={{
          border: "none",
          background: "none",
          padding: 0,
          cursor: "pointer",
          display: "block",
          width: "500px",
          maxWidth: "100%",
        }}
      >
        <Image
          src="/FREETRIALAPPROVED.png"
          alt="Free Trial Approved - Click to open MAX-LIT Chat"
          width={500}
          height={800}
          priority
          style={{ width: "500px", height: "800px", maxWidth: "100%", objectFit: "contain" }}
        />
      </button>
    </main>
  );
}
