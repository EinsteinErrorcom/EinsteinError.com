"use client";

import { useEffect, useState } from "react";
import { getLemonSqueezyPricesUrl } from "@/lib/lemon-squeezy";

const pricesUrl = getLemonSqueezyPricesUrl();
const REDIRECT_DELAY_MS = 4000;

export default function TrialExpiredPage() {
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(REDIRECT_DELAY_MS / 1000)
  );

  useEffect(() => {
    if (!pricesUrl) {
      return;
    }

    const redirectTimer = window.setTimeout(() => {
      window.location.href = pricesUrl;
    }, REDIRECT_DELAY_MS);

    const countdownTimer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      window.clearTimeout(redirectTimer);
      window.clearInterval(countdownTimer);
    };
  }, []);

  return (
    <main className="page-wrapper">
      <div
        style={{
          background: "#161b22",
          padding: "40px 30px",
          borderRadius: "12px",
          margin: "40px auto",
          maxWidth: "900px",
          border: "6px solid #C5A059",
          textAlign: "center",
        }}
      >
        <img
          src="/MAX-LIT PRICES2.png"
          alt="MAX-LIT Prices"
          width={600}
          height={400}
          style={{ marginBottom: "30px" }}
        />

        <p
          style={{
            fontWeight: "bold",
            fontStyle: "italic",
            color: "#00FFFF",
            fontSize: "28px",
            lineHeight: 1.5,
            margin: "0 0 24px",
          }}
        >
          Your FREE trial time has expired.
          <br />
          Click{" "}
          {pricesUrl ? (
            <a
              href={pricesUrl}
              style={{
                color: "#FFFF00",
                fontWeight: "bold",
                textDecoration: "underline",
              }}
            >
              HERE
            </a>
          ) : (
            <span style={{ color: "#FFFF00" }}>HERE</span>
          )}{" "}
          to purchase time on MAX-LIT,
          <br />
          the World&apos;s Most POWERFUL Physics Processor.
        </p>

        {pricesUrl ? (
          <p
            style={{
              fontWeight: "bold",
              fontStyle: "italic",
              color: "#FFFFFF",
              fontSize: "20px",
            }}
          >
            Redirecting to the MAX-LIT prices page in {secondsLeft} second
            {secondsLeft === 1 ? "" : "s"}...
          </p>
        ) : (
          <p
            role="alert"
            style={{
              fontWeight: "bold",
              color: "#FF6B6B",
              fontSize: "18px",
            }}
          >
            Prices page is unavailable. Please contact support.
          </p>
        )}
      </div>
    </main>
  );
}
