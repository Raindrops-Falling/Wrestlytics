import { useState, useRef } from "react";
import {
  WireframeCanvas,
  LayersCanvas,
  NodesCanvas,
  ThreeOrbit,
  WrestlingTerminal,
  useScrollReveal,
} from "@/components/shared/Canvases";

import asciiMagic3 from "@/imports/ascii-magic-3-1.mp4";
import asciiMagic5 from "@/imports/ascii-magic-5-1.mp4";
import asciiAnim1 from "@/imports/ascii-animation__1_.mp4";
import asciiAnim3 from "@/imports/ascii-animation__3_.mp4";
import asciiAnim4 from "@/imports/ascii-animation__4_-1.mp4";
import mountainImg from "@/imports/images__19_-1.jpg";
import annotatedVideo1 from "@/imports/annotated_video_h264__3_.mp4";
import annotatedVideo2 from "@/imports/annotated_video_h264__2_-1.mp4";

/* ─── tokens ─── */
const T = {
  bg: "#08090a",
  card: "#0f1011",
  elevated: "#161718",
  border: "#23252a",
  body: "#d0d6e0",
  muted: "#8a8f98",
  white: "#ffffff",
};

const fontMono = "'JetBrains Mono', monospace";
const fontInter = "Inter, sans-serif";

/* ─── Logo ─── */
function WrestlyticsLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M2 8 L2 2 L8 2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 2 L30 2 L30 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 24 L2 30 L8 30" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 30 L30 30 L30 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="16" r="3.5" fill="#ffffff" />
      <circle cx="20" cy="16" r="3.5" fill="rgba(255,255,255,0.45)" />
    </svg>
  );
}

/* ─── MonoLabel ─── */
function MonoLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: fontMono,
        fontSize: 11,
        letterSpacing: "0.12em",
        color: T.muted,
        textTransform: "uppercase",
        margin: 0,
        marginBottom: 18,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ─── J3 ─── */
export default function J3() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef as React.RefObject<HTMLElement | null>);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: T.bg,
        color: T.body,
        fontFamily: fontInter,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ── 1. Nav ─────────────────────────────────────────────────── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: T.bg,
          borderBottom: `1px solid ${T.border}`,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={28} />
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 13,
              letterSpacing: "0.1em",
              color: T.white,
              fontWeight: 600,
            }}
          >
            WRESTLYTICS
          </span>
        </div>
        <button
          style={{
            fontFamily: fontMono,
            fontSize: 12,
            letterSpacing: "0.08em",
            color: T.white,
            background: "transparent",
            border: `1px solid rgba(255,255,255,0.25)`,
            borderRadius: 20,
            padding: "8px 20px",
            cursor: "pointer",
          }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* ── 2. Hero — SPLIT ────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "55fr 45fr",
        }}
      >
        {/* Left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "120px 40px 80px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <MonoLabel>Computer Vision / Wrestling</MonoLabel>
          <h1
            data-reveal="up"
            style={{
              fontSize: "clamp(44px,6vw,72px)",
              fontWeight: 510,
              letterSpacing: "-0.026em",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
              color: T.white,
              margin: 0,
              marginBottom: 24,
            }}
          >
            {"Tracking wrestlers\nthat other systems\ncannot see."}
          </h1>
          <p
            data-reveal="up"
            data-stagger
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: T.body,
              margin: 0,
              marginBottom: 32,
              maxWidth: 520,
            }}
          >
            We built a person detection model trained specifically for wrestling — one that tracks both athletes through contact, occlusion, and full body overlap.
          </p>
          <div
            data-reveal="up"
            data-stagger
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <button
              style={{
                fontFamily: fontInter,
                fontSize: 15,
                fontWeight: 500,
                color: T.bg,
                background: T.white,
                border: "none",
                borderRadius: 6,
                padding: "13px 24px",
                cursor: "pointer",
              }}
            >
              Join the Waitlist
            </button>
            <button
              style={{
                fontFamily: fontInter,
                fontSize: 15,
                fontWeight: 500,
                color: T.white,
                background: "transparent",
                border: `1px solid rgba(255,255,255,0.25)`,
                borderRadius: 6,
                padding: "13px 24px",
                cursor: "pointer",
              }}
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            src={asciiMagic3}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Left-edge gradient overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "40%",
              height: "100%",
              background: `linear-gradient(to right, ${T.bg}, transparent)`,
            }}
          />
        </div>
      </section>

      {/* ── 3. Trust Strip ─────────────────────────────────────────── */}
      <div
        style={{
          padding: "20px 40px",
          borderTop: `1px solid ${T.border}`,
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: fontMono,
            fontSize: 11,
            letterSpacing: "0.1em",
            color: T.muted,
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Teams at
        </span>
        {["Penn State", "Iowa", "Ohio State", "Oklahoma", "Stanford", "Cornell"].map((name) => (
          <span
            key={name}
            style={{
              fontFamily: fontInter,
              fontSize: 14,
              color: T.muted,
              fontWeight: 500,
            }}
          >
            {name}
          </span>
        ))}
      </div>

      {/* ── 4. Problem Section ─────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 40px",
          background: T.bg,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "60fr 40fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          <div>
            <MonoLabel>The Problem</MonoLabel>
            <h2
              data-reveal="up"
              style={{
                fontSize: "clamp(36px,5vw,48px)",
                fontWeight: 510,
                letterSpacing: "-0.022em",
                lineHeight: 1.08,
                color: T.white,
                margin: 0,
                marginBottom: 24,
              }}
            >
              The sport that vision forgot.
            </h2>
            <p
              data-reveal="up"
              data-stagger
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                color: T.body,
                margin: 0,
                marginBottom: 20,
              }}
            >
              Every major sport has computer vision infrastructure built around it. Baseball tracks pitch spin. Basketball maps player positioning. Football analyzes route depth. Wrestling has almost nothing.
            </p>
            <p
              data-reveal="up"
              data-stagger
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: T.muted,
                margin: 0,
                marginBottom: 16,
              }}
            >
              The reason isn&apos;t lack of interest. It&apos;s that wrestling breaks the assumptions every general-purpose tracking model is built on. In most sports, athletes stay separated. In wrestling, they don&apos;t. Two people spend the majority of a match in full contact, stacked, twisted, or fully overlapping.
            </p>
            <p
              data-reveal="up"
              data-stagger
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: T.muted,
                margin: 0,
              }}
            >
              When existing tracking systems hit that contact, they fail. Bounding boxes merge. Identities swap. Athletes disappear from the feed entirely. We built a model specifically trained to handle this — treating occlusion not as an edge case, but as the primary challenge to solve.
            </p>
          </div>

          <div style={{ position: "relative", height: 320 }}>
            <LayersCanvas style={{ position: "absolute", inset: 0 }} />
          </div>
        </div>
      </section>

      {/* ── 5. Occlusion Analysis Feature ──────────────────────────── */}
      <section
        style={{
          background: T.card,
          padding: "96px 40px",
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left: video */}
          <div
            style={{
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${T.border}`,
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              src={annotatedVideo1}
              style={{ width: "100%", display: "block" }}
            />
          </div>

          {/* Right: copy */}
          <div data-reveal="left">
            <MonoLabel>Occlusion Analysis</MonoLabel>
            <h2
              style={{
                fontSize: "clamp(28px,3.5vw,44px)",
                fontWeight: 510,
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
                color: T.white,
                margin: 0,
                marginBottom: 20,
              }}
            >
              Identity through the tangle.
            </h2>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: T.body,
                margin: 0,
                marginBottom: 16,
              }}
            >
              When wrestlers fully overlap, most tracking systems merge their bounding boxes and lose one athlete entirely. Our model maintains separate identities for both through the entire contact event.
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: T.body,
                margin: 0,
                marginBottom: 40,
              }}
            >
              This is the core technical problem in wrestling computer vision. We trained specifically for it — and we measure it in every match.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <p
                  style={{
                    fontFamily: fontMono,
                    fontSize: 36,
                    fontWeight: 700,
                    color: T.white,
                    margin: 0,
                    marginBottom: 6,
                    lineHeight: 1,
                  }}
                >
                  23
                </p>
                <p
                  style={{
                    fontFamily: fontMono,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: T.muted,
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Occlusion Events
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: fontMono,
                    fontSize: 36,
                    fontWeight: 700,
                    color: T.white,
                    margin: 0,
                    marginBottom: 6,
                    lineHeight: 1,
                  }}
                >
                  100%
                </p>
                <p
                  style={{
                    fontFamily: fontMono,
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    color: T.muted,
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  Resolution Rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Detecting In Real Time (asciiMagic5 bg) ─────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={asciiMagic5}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
            zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.91)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "96px 40px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 64,
              alignItems: "start",
            }}
          >
            {/* Left */}
            <div>
              <MonoLabel>Under the Hood</MonoLabel>
              <h2
                data-reveal="up"
                style={{
                  fontSize: "clamp(28px,3.5vw,44px)",
                  fontWeight: 510,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.1,
                  color: T.white,
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                Detecting in Real Time.
              </h2>
              <p
                data-reveal="up"
                data-stagger
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: T.body,
                  margin: 0,
                  marginBottom: 14,
                }}
              >
                Frame by frame. Every athlete, every frame, through every position.
              </p>
              <p
                data-reveal="up"
                data-stagger
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: T.body,
                  margin: 0,
                  marginBottom: 28,
                }}
              >
                When occlusion happens, the model resolves it automatically.
              </p>
              <WrestlingTerminal triggerOnScroll={true} style={{ marginTop: 28 }} />
            </div>

            {/* Right: video card */}
            <div
              style={{
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                overflow: "hidden",
                position: "relative",
                aspectRatio: "16/9",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  zIndex: 2,
                  background: "rgba(8,9,10,0.75)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 4,
                  padding: "4px 10px",
                  fontFamily: fontMono,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: T.muted,
                  textTransform: "uppercase",
                }}
              >
                Live Output
              </div>
              <video
                autoPlay
                muted
                loop
                playsInline
                src={annotatedVideo2}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Feature Cards ────────────────────────────────────────── */}
      <section
        style={{
          padding: "96px 40px",
          background: T.bg,
          borderTop: `1px solid ${T.border}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <MonoLabel>How It Works</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(28px,3.5vw,44px)",
              fontWeight: 510,
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
              color: T.white,
              margin: 0,
              marginBottom: 16,
              maxWidth: 560,
            }}
          >
            Three things we got right.
          </h2>
          <p
            data-reveal="up"
            data-stagger
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: T.muted,
              margin: 0,
              marginBottom: 48,
              maxWidth: 560,
            }}
          >
            Building a detection system for wrestling meant solving three distinct problems that existing systems never had to face.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 24,
            }}
          >
            {/* Card 1 */}
            <div
              data-reveal="up"
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <ThreeOrbit style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>
              <div style={{ padding: 24 }}>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: T.white,
                    margin: 0,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  Multi-athlete tracking
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
                  Both wrestlers tracked independently, even at full stack.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div
              data-reveal="up"
              data-stagger
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <WireframeCanvas shape="sphere" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>
              <div style={{ padding: 24 }}>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: T.white,
                    margin: 0,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  Through-overlap identity
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
                  The model doesn&apos;t lose track when wrestlers completely overlap.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div
              data-reveal="up"
              data-stagger
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <NodesCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
              </div>
              <div style={{ padding: 24 }}>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: T.white,
                    margin: 0,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  Wrestling-native training
                </p>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: T.muted, margin: 0 }}>
                  Trained on wrestling footage, not adapted from other sports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Built From Scratch (asciiAnim1 bg) ──────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "96px 40px",
        }}
      >
        {/* BG video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={asciiAnim1}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.14,
            zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.93)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div>
            <MonoLabel>Our Approach</MonoLabel>
            <h2
              data-reveal="up"
              style={{
                fontSize: "clamp(28px,3.5vw,44px)",
                fontWeight: 510,
                letterSpacing: "-0.022em",
                lineHeight: 1.1,
                color: T.white,
                margin: 0,
                marginBottom: 20,
              }}
            >
              We built this from scratch.
            </h2>
            <p
              data-reveal="up"
              data-stagger
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: T.body,
                margin: 0,
                marginBottom: 18,
              }}
            >
              Every detection model we found was built for a sport where athletes stay separated. Wrestling breaks all of them. So we started with nothing and built for wrestling specifically.
            </p>
            <p
              data-reveal="up"
              data-stagger
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                color: T.body,
                margin: 0,
              }}
            >
              Our first model does one thing: detect and track wrestlers through contact and occlusion. It&apos;s the foundation. Everything else we&apos;re building depends on getting this right.
            </p>
          </div>

          {/* Right: stacked bordered items */}
          <div
            data-reveal="left"
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {[
              { num: "01", text: "Trained on wrestling footage specifically" },
              { num: "02", text: "Occlusion as the primary design constraint" },
              { num: "03", text: "Tested on real collegiate match video" },
            ].map(({ num, text }) => (
              <div
                key={num}
                style={{
                  padding: 20,
                  background: T.elevated,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: fontMono,
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    color: T.muted,
                    flexShrink: 0,
                  }}
                >
                  {num}
                </span>
                <span style={{ fontSize: 15, color: T.body, lineHeight: 1.4 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Saturn Section (asciiAnim4 bg) ──────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* BG video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={asciiAnim4}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.88)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 40px",
            maxWidth: 680,
            margin: "96px auto",
            textAlign: "center",
          }}
        >
          <MonoLabel style={{ textAlign: "center" }}>What Comes Next</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(32px,4.5vw,52px)",
              fontWeight: 510,
              letterSpacing: "-0.024em",
              lineHeight: 1.08,
              color: T.white,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Detection is just the first step.
          </h2>
          <p
            data-reveal="up"
            data-stagger
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              color: T.body,
              margin: 0,
            }}
          >
            Once the model can see every wrestler in every frame, we can start building the layer above it. Match events. Score tracking. Pattern analysis across a full season. These are all on the roadmap.
          </p>
        </div>
      </section>

      {/* ── 10. Mountain Section ────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 460,
          display: "flex",
          alignItems: "center",
          backgroundImage: `url(${mountainImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(8,9,10,0.97) 0%, rgba(8,9,10,0.75) 55%, rgba(8,9,10,0.1) 100%)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "0 40px",
            maxWidth: 520,
          }}
        >
          <MonoLabel>Built for Wrestling</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(28px,4vw,48px)",
              fontWeight: 510,
              letterSpacing: "-0.022em",
              lineHeight: 1.1,
              color: T.white,
              whiteSpace: "pre-line",
              margin: 0,
              marginBottom: 20,
            }}
          >
            {"The hardest sport\ngot the most attention."}
          </h2>
          <p
            data-reveal="up"
            data-stagger
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: T.muted,
              margin: 0,
            }}
          >
            We chose wrestling because it&apos;s the problem nobody solved. Contact-heavy, identity-breaking, and analytically dark. We&apos;re changing that.
          </p>
        </div>
      </section>

      {/* ── 11. Wrestling Is Unsolved (email CTA) ───────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* BG video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          src={asciiAnim3}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.22,
            zIndex: 0,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.90)",
            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "80px 40px",
          }}
        >
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(52px,7vw,80px)",
              fontWeight: 510,
              letterSpacing: "-0.026em",
              color: T.white,
              margin: 0,
              marginBottom: 48,
              lineHeight: 1,
            }}
          >
            Wrestling Is Unsolved.
          </h2>

          {submitted ? (
            <p
              style={{
                fontFamily: fontMono,
                fontSize: 15,
                letterSpacing: "0.06em",
                color: T.white,
                margin: 0,
              }}
            >
              You&apos;re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 6,
                  padding: "14px 20px",
                  fontSize: 15,
                  color: T.white,
                  fontFamily: fontInter,
                  width: 280,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  fontFamily: fontInter,
                  fontSize: 15,
                  fontWeight: 500,
                  color: T.bg,
                  background: T.white,
                  border: "none",
                  borderRadius: 6,
                  padding: "14px 24px",
                  cursor: "pointer",
                }}
              >
                Join the Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 12. Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          padding: "32px 40px",
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={24} />
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 12,
              letterSpacing: "0.1em",
              color: T.white,
              fontWeight: 600,
            }}
          >
            WRESTLYTICS
          </span>
        </div>
        <p
          style={{
            fontFamily: fontMono,
            fontSize: 11,
            letterSpacing: "0.06em",
            color: T.muted,
            margin: 0,
          }}
        >
          &copy; 2026 Wrestlytics. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
