"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    // Replace with your preferred email capture service (Mailchimp, ConvertKit, etc.)
    // For now, logs to console and shows success state
    console.log("Signup:", email);
    setStatus("success");
    setEmail("");
  }

  return (
    <main
      className="min-h-screen flex flex-col justify-between"
      style={{
        backgroundColor: "#0a0a0a",
        color: "#f5f5f0",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 pt-10 pb-0">
        <span
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            opacity: 0.4,
            fontWeight: 700,
          }}
        >
          asunder.studio
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.4,
            fontWeight: 400,
          }}
        >
          Coming Soon
        </span>
      </header>

      {/* Hero */}
      <section
        className="flex flex-col justify-center px-8"
        style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%" }}
      >
        {/* Agency name — dominant */}
        <h1
          style={{
            fontSize: "clamp(4.5rem, 18vw, 18rem)",
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Asunder
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: "clamp(0.9rem, 2vw, 1.35rem)",
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginTop: "clamp(1.25rem, 3vw, 2.5rem)",
          }}
        >
          Veteran meets Vision
        </p>

        {/* Divider */}
        <div
          style={{
            width: "clamp(2.5rem, 6vw, 5rem)",
            height: "2px",
            backgroundColor: "#f5f5f0",
            opacity: 0.25,
            marginTop: "clamp(2rem, 5vw, 4rem)",
            marginBottom: "clamp(2rem, 5vw, 4rem)",
          }}
        />

        {/* Email capture */}
        {status === "success" ? (
          <p
            style={{
              fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: 0.7,
            }}
          >
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0", maxWidth: "480px" }}>
            <input
              type="email"
              required
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(245, 245, 240, 0.3)",
                color: "#f5f5f0",
                fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
                padding: "0.75rem 0",
                outline: "none",
                letterSpacing: "0.05em",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) =>
                (e.target.style.borderBottomColor = "rgba(245, 245, 240, 0.9)")
              }
              onBlur={(e) =>
                (e.target.style.borderBottomColor = "rgba(245, 245, 240, 0.3)")
              }
            />
            <button
              type="submit"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid rgba(245, 245, 240, 0.3)",
                color: "#f5f5f0",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "0.75rem 0 0.75rem 1.5rem",
                cursor: "pointer",
                fontWeight: 700,
                opacity: 0.6,
                transition: "opacity 0.2s ease",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              Notify Me
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer
        className="px-8 pb-10"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.25,
          }}
        >
          &copy; {new Date().getFullYear()} Asunder Studio
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            opacity: 0.25,
          }}
        >
          A creative agency
        </span>
      </footer>
    </main>
  );
}
