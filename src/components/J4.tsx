import { useState, useRef } from "react";
import {
  WireframeCanvas,
  LayersCanvas,
  NodesCanvas,
  WrestlingTerminal,
  useScrollReveal,
} from "@/components/shared/Canvases";

import asciiMagic5 from "@/imports/ascii-magic-5-1.mp4";
import asciiMagic3 from "@/imports/ascii-magic-3-1.mp4";
import asciiAnim1 from "@/imports/ascii-animation__1_.mp4";
import asciiAnim3 from "@/imports/ascii-animation__3_.mp4";
import asciiAnim4 from "@/imports/ascii-animation__4_-1.mp4";
import mountainImg from "@/imports/images__19_-1.jpg";
import annotatedVideo2 from "@/imports/annotated_video_h264__2_-1.mp4";
import annotatedVideo1 from "@/imports/annotated_video_h264__3_.mp4";

/* ─── tokens ─── */
const BG = "#08090a";
const CARD = "#0f1011";
const ELEVATED = "#161718";
const BORDER = "#23252a";
const BODY = "#d0d6e0";
const MUTED = "#8a8f98";
const WHITE = "#ffffff";

const MONO: React.CSSProperties["fontFamily"] = "'JetBrains Mono', monospace";
const SANS: React.CSSProperties["fontFamily"] = "'Inter', sans-serif";

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

/* ─── Mono Label ─── */
function MonoLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 11,
        color: MUTED,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        marginBottom: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── White button ─── */
function BtnWhite({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: WHITE,
        color: BG,
        border: "none",
        borderRadius: 6,
        padding: "12px 24px",
        fontSize: 14,
        fontFamily: SANS,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Ghost button ─── */
function BtnGhost({ children }: { children: React.ReactNode }) {
  return (
    <button
      style={{
        background: "transparent",
        color: BODY,
        border: `1px solid ${BORDER}`,
        borderRadius: 6,
        padding: "12px 24px",
        fontSize: 14,
        fontFamily: SANS,
        fontWeight: 500,
        cursor: "pointer",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </button>
  );
}

/* ─── J4 ─── */
export default function J4() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: BG,
        color: BODY,
        fontFamily: SANS,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      {/* ── 1. NAV ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: BG,
          borderBottom: `1px solid ${BORDER}`,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
        }}
      >
        {/* Left: logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={28} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: WHITE,
              letterSpacing: "0.10em",
              textTransform: "uppercase" as const,
            }}
          >
            WRESTLYTICS
          </span>
        </div>

        {/* Center: links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Platform", "Research", "About"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 14,
                color: MUTED,
                textDecoration: "none",
                fontFamily: SANS,
                transition: "color 0.15s",
              }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: CTA */}
        <button
          style={{
            background: WHITE,
            color: BG,
            border: "none",
            borderRadius: 999,
            padding: "8px 20px",
            fontSize: 13,
            fontFamily: SANS,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "-0.01em",
          }}
        >
          Join Waitlist
        </button>
      </nav>

      {/* ── 2. HERO ── */}
      <section
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 100,
        }}
      >
        {/* Background video */}
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
            opacity: 0.45,
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom right, rgba(8,9,10,0.97) 30%, rgba(8,9,10,0.65) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 40px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <MonoLabel style={{ marginBottom: 24 }}>WRESTLYTICS — COMPUTER VISION</MonoLabel>

          <h1
            data-reveal="up"
            style={{
              fontSize: "clamp(44px, 6vw, 72px)",
              fontWeight: 510,
              letterSpacing: "-0.026em",
              lineHeight: 1.05,
              color: WHITE,
              maxWidth: 820,
              margin: "0 0 0 0",
              whiteSpace: "pre-line",
              fontFamily: SANS,
            }}
          >
            {"We built a detection model for wrestling.\nEverything else comes next."}
          </h1>

          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.12)",
              margin: "32px 0",
              maxWidth: 820,
            }}
          />

          <p
            data-reveal="up"
            data-stagger
            style={{
              maxWidth: 560,
              fontSize: 17,
              color: BODY,
              lineHeight: 1.65,
              margin: "0 0 32px 0",
              fontFamily: SANS,
            }}
          >
            Our first model tracks two wrestlers through contact, occlusion, and complete body
            overlap. That&apos;s the foundation. We&apos;re building the rest.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <BtnWhite>Join the Waitlist</BtnWhite>
            <BtnGhost>See the technology</BtnGhost>
          </div>
        </div>
      </section>

      {/* ── 3. TRUST STRIP ── */}
      <section
        style={{
          padding: "20px 40px",
          borderTop: `1px solid ${BORDER}`,
          borderBottom: `1px solid ${BORDER}`,
          background: BG,
          display: "flex",
          alignItems: "center",
          gap: 40,
          flexWrap: "wrap" as const,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            whiteSpace: "nowrap" as const,
          }}
        >
          Teams at
        </span>
        {[
          "Penn State",
          "Iowa",
          "Ohio State",
          "Oklahoma State",
          "Cornell",
          "Stanford",
        ].map((school) => (
          <span
            key={school}
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: MUTED,
              letterSpacing: "0.08em",
              opacity: 0.7,
            }}
          >
            {school}
          </span>
        ))}
      </section>

      {/* ── 4. PROBLEM SECTION ── */}
      <section
        style={{
          padding: "96px 40px",
          background: BG,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Left */}
          <div>
            <MonoLabel>THE PROBLEM</MonoLabel>
            <h2
              data-reveal="up"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                fontWeight: 510,
                letterSpacing: "-0.024em",
                lineHeight: 1.1,
                color: WHITE,
                margin: "0 0 24px 0",
                fontFamily: SANS,
              }}
            >
              The sport that data forgot.
            </h2>
            <p
              style={{
                fontSize: 20,
                color: BODY,
                lineHeight: 1.65,
                margin: "0 0 20px 0",
                fontFamily: SANS,
              }}
            >
              Most computer vision systems were built for sports where athletes stay apart.
              Wrestling is different.
            </p>
            <p
              style={{
                fontSize: 15,
                color: MUTED,
                lineHeight: 1.7,
                margin: "0 0 16px 0",
                fontFamily: SANS,
              }}
            >
              In wrestling, contact is not an edge case — it&apos;s the entire sport. From
              the opening whistle, two athletes are locked together. Traditional tracking
              systems assume space between subjects. Wrestling never provides it.
            </p>
            <p
              style={{
                fontSize: 15,
                color: MUTED,
                lineHeight: 1.7,
                fontFamily: SANS,
              }}
            >
              We couldn&apos;t adapt existing models. We built specifically for wrestling:
              the physics of contact, the geometry of grappling, the visual patterns that
              emerge when two athletes become one tangled silhouette.
            </p>
          </div>

          {/* Right */}
          <div
            style={{
              borderLeft: `1px solid ${BORDER}`,
              paddingLeft: 48,
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {[
              {
                num: "01",
                label: "WHY SYSTEMS FAIL",
                desc: "Athletes are always in contact. Other sports assume separation. Wrestling never has it.",
              },
              {
                num: "02",
                label: "WHY SYSTEMS FAIL",
                desc: "Identity swaps when stacked. Bounding boxes merge, athletes disappear from tracking.",
              },
              {
                num: "03",
                label: "WHY SYSTEMS FAIL",
                desc: "No wrestling-specific training data existed. We had to build it ourselves.",
              },
            ].map(({ num, label, desc }) => (
              <div
                key={num}
                data-reveal="up"
                data-stagger
                style={{
                  paddingBottom: 32,
                  borderBottom: `1px solid ${BORDER}`,
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontFamily: MONO,
                    fontWeight: 700,
                    color: WHITE,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: MUTED,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    marginBottom: 10,
                  }}
                >
                  {label}
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: MUTED,
                    lineHeight: 1.65,
                    margin: 0,
                    fontFamily: SANS,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. OCCLUSION ANALYSIS ── */}
      <section
        style={{
          background: CARD,
          padding: "96px 40px",
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <MonoLabel style={{ marginBottom: 0 }}>OCCLUSION ANALYSIS</MonoLabel>
            <span
              style={{
                fontSize: "clamp(20px, 2.5vw, 28px)",
                fontWeight: 510,
                color: WHITE,
                fontFamily: SANS,
                letterSpacing: "-0.02em",
              }}
            >
              23 events — 23 resolved
            </span>
          </div>

          {/* Horizontal rule */}
          <div style={{ height: 1, background: BORDER, marginBottom: 48 }} />

          {/* Two-col */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* Left: video */}
            <div
              style={{
                borderRadius: 12,
                border: `1px solid ${BORDER}`,
                overflow: "hidden",
                aspectRatio: "16/9",
                position: "relative",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                src={annotatedVideo2}
                style={{ width: "100%", display: "block" }}
              />
            </div>

            {/* Right: text */}
            <div>
              <h2
                data-reveal="up"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  fontWeight: 510,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.15,
                  color: WHITE,
                  margin: "0 0 24px 0",
                  fontFamily: SANS,
                }}
              >
                Identity through the hardest moments.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: MUTED,
                  lineHeight: 1.7,
                  margin: "0 0 18px 0",
                  fontFamily: SANS,
                }}
              >
                Standard trackers lose athletes the moment they make contact. Bounding boxes
                merge and identity swaps happen silently, corrupting every downstream analysis.
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: MUTED,
                  lineHeight: 1.7,
                  margin: "0 0 18px 0",
                  fontFamily: SANS,
                }}
              >
                We trained specifically for these moments. The model doesn&apos;t just handle
                occlusion — it was designed around it.
              </p>
              <p
                style={{
                  fontSize: 16,
                  color: BODY,
                  lineHeight: 1.7,
                  margin: 0,
                  fontFamily: SANS,
                }}
              >
                This match has 23 occlusion events. The model resolved all of them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. DETECTING IN REAL TIME ── */}
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
          src={asciiMagic3}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.91)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
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
              <MonoLabel>UNDER THE HOOD</MonoLabel>
              <h2
                data-reveal="up"
                style={{
                  fontSize: "clamp(28px, 3.5vw, 42px)",
                  fontWeight: 510,
                  letterSpacing: "-0.022em",
                  lineHeight: 1.15,
                  color: WHITE,
                  margin: "0 0 20px 0",
                  fontFamily: SANS,
                }}
              >
                Detecting in Real Time.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: MUTED,
                  lineHeight: 1.7,
                  margin: "0 0 28px 0",
                  fontFamily: SANS,
                }}
              >
                The model processes video frame by frame, flagging and resolving occlusion
                events automatically. No manual annotation. No post-processing pipeline.
                Detection happens as each frame is analyzed.
              </p>
              <WrestlingTerminal triggerOnScroll={true} style={{ marginTop: 28 }} />
            </div>

            {/* Right: video with badge */}
            <div>
              <div
                style={{
                  borderRadius: 12,
                  border: `1px solid ${BORDER}`,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 2,
                    background: "rgba(8,9,10,0.85)",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 4,
                    padding: "4px 10px",
                    fontFamily: MONO,
                    fontSize: 10,
                    color: WHITE,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  LIVE OUTPUT
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={annotatedVideo1}
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FEATURE CARDS ── */}
      <section
        style={{
          padding: "96px 40px",
          background: BG,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <MonoLabel>HOW IT WORKS</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 510,
              letterSpacing: "-0.024em",
              lineHeight: 1.1,
              color: WHITE,
              maxWidth: 520,
              margin: "0 0 20px 0",
              fontFamily: SANS,
            }}
          >
            Three specific problems.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: MUTED,
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 0 56px 0",
              fontFamily: SANS,
            }}
          >
            We picked wrestling because it breaks every assumption other detection models make.
            Here&apos;s what we had to solve.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {/* Card 1: NodesCanvas */}
            <div
              data-reveal="up"
              data-stagger
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <NodesCanvas />
              </div>
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: WHITE,
                    margin: "0 0 10px 0",
                    fontFamily: SANS,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Multi-body detection
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: MUTED,
                    lineHeight: 1.6,
                    margin: 0,
                    fontFamily: SANS,
                  }}
                >
                  Two independent identities maintained through full contact. Positions tracked
                  without merging or swapping IDs.
                </p>
              </div>
            </div>

            {/* Card 2: WireframeCanvas cylinders */}
            <div
              data-reveal="up"
              data-stagger
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <WireframeCanvas shape="cylinders" />
              </div>
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: WHITE,
                    margin: "0 0 10px 0",
                    fontFamily: SANS,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Occlusion as a first-class problem
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: MUTED,
                    lineHeight: 1.6,
                    margin: 0,
                    fontFamily: SANS,
                  }}
                >
                  Not an edge case. The primary design challenge. Every architecture decision
                  was made with occlusion in mind.
                </p>
              </div>
            </div>

            {/* Card 3: LayersCanvas */}
            <div
              data-reveal="up"
              data-stagger
              style={{
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", height: 200 }}>
                <LayersCanvas />
              </div>
              <div style={{ padding: 24 }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: WHITE,
                    margin: "0 0 10px 0",
                    fontFamily: SANS,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Wrestling-specific training data
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: MUTED,
                    lineHeight: 1.6,
                    margin: 0,
                    fontFamily: SANS,
                  }}
                >
                  Not adapted. Built from scratch with wrestling footage. Every annotation
                  reflects the specific visual patterns of the sport.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. OUR WORK ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "96px 40px",
          borderTop: `1px solid ${BORDER}`,
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
            opacity: 0.13,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.93)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
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
            <MonoLabel>WHERE WE ARE</MonoLabel>
            <h2
              data-reveal="up"
              style={{
                fontSize: "clamp(28px, 3.5vw, 44px)",
                fontWeight: 510,
                letterSpacing: "-0.024em",
                lineHeight: 1.15,
                color: WHITE,
                margin: "0 0 24px 0",
                whiteSpace: "pre-line",
                fontFamily: SANS,
              }}
            >
              {"Version one.\nOne thing done right."}
            </h2>
            <p
              style={{
                fontSize: 16,
                color: MUTED,
                lineHeight: 1.7,
                margin: "0 0 18px 0",
                fontFamily: SANS,
              }}
            >
              We&apos;re not a full analytics platform. We&apos;re one model that does one
              thing well: detect and track wrestlers through contact and occlusion. That&apos;s
              it.
            </p>
            <p
              style={{
                fontSize: 16,
                color: MUTED,
                lineHeight: 1.7,
                fontFamily: SANS,
              }}
            >
              This is the foundation. Every statistic, every event flag, every team insight
              depends on knowing where the wrestlers are. We built that first.
            </p>
          </div>

          {/* Right: numbered list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {[
              "01 — Person detection for wrestling specifically",
              "02 — Handles full-body occlusion and stacking",
              "03 — Tested on real collegiate match footage",
            ].map((item, i) => (
              <div
                key={i}
                data-reveal="up"
                data-stagger
                style={{
                  padding: "24px 0",
                  borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
                  fontFamily: MONO,
                  fontSize: 14,
                  color: BODY,
                  letterSpacing: "0.01em",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. SATURN VISION ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 420,
          display: "flex",
          alignItems: "center",
          borderTop: `1px solid ${BORDER}`,
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
            opacity: 0.2,
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.88)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "80px 40px",
            maxWidth: 700,
            margin: "0 auto",
            textAlign: "center",
            width: "100%",
          }}
        >
          <MonoLabel style={{ textAlign: "center" }}>ROADMAP</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(32px, 4.5vw, 52px)",
              fontWeight: 510,
              letterSpacing: "-0.026em",
              lineHeight: 1.1,
              color: WHITE,
              margin: "0 0 28px 0",
              fontFamily: SANS,
            }}
          >
            Detection is the floor.
          </h2>
          <p
            style={{
              fontSize: 17,
              color: BODY,
              lineHeight: 1.7,
              margin: "0 0 20px 0",
              fontFamily: SANS,
            }}
          >
            Every piece of analysis we want to build — match events, scoring, positioning
            patterns, team tendencies — depends on reliably seeing both wrestlers. That&apos;s
            what we built first. Now we&apos;re building the rest.
          </p>
          <p
            style={{
              fontSize: 17,
              color: MUTED,
              lineHeight: 1.7,
              margin: 0,
              fontFamily: SANS,
            }}
          >
            The list: event classification, match statistics, period-by-period patterns,
            season-level team data.
          </p>
        </div>
      </section>

      {/* ── 10. MOUNTAIN SECTION ── */}
      <section
        style={{
          minHeight: 440,
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
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
              "linear-gradient(to right, rgba(8,9,10,0.97) 0%, rgba(8,9,10,0.8) 50%, rgba(8,9,10,0.15) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0 40px",
            maxWidth: 540,
          }}
        >
          <MonoLabel>BUILT FOR THIS</MonoLabel>
          <h2
            data-reveal="up"
            style={{
              fontSize: "clamp(26px, 3.5vw, 44px)",
              fontWeight: 510,
              letterSpacing: "-0.024em",
              lineHeight: 1.15,
              color: WHITE,
              margin: "0 0 24px 0",
              whiteSpace: "pre-line",
              fontFamily: SANS,
            }}
          >
            {"The hardest sport to analyze.\nThe most important to try."}
          </h2>
          <p
            style={{
              fontSize: 16,
              color: MUTED,
              lineHeight: 1.7,
              margin: 0,
              fontFamily: SANS,
            }}
          >
            Wrestling has no playbook, no possession, no score until it happens. Every second
            is contested. That complexity is exactly what makes it worth building for.
          </p>
        </div>
      </section>

      {/* ── 11. WRESTLING IS UNSOLVED ── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: 560,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderTop: `1px solid ${BORDER}`,
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
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(8,9,10,0.90)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "80px 40px",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(52px, 7vw, 80px)",
              fontWeight: 510,
              letterSpacing: "-0.026em",
              color: WHITE,
              margin: 0,
              fontFamily: SANS,
              lineHeight: 1.05,
            }}
          >
            Wrestling Is Unsolved.
          </h2>

          <div style={{ marginTop: 48 }}>
            {submitted ? (
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: 16,
                  color: WHITE,
                  letterSpacing: "0.04em",
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
                  flexWrap: "wrap" as const,
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
                    color: WHITE,
                    width: 280,
                    outline: "none",
                    fontFamily: SANS,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: WHITE,
                    color: BG,
                    border: "none",
                    borderRadius: 6,
                    padding: "14px 28px",
                    fontSize: 15,
                    fontFamily: SANS,
                    fontWeight: 600,
                    cursor: "pointer",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Join the Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── 12. FOOTER ── */}
      <footer
        style={{
          padding: "32px 40px",
          borderTop: `1px solid ${BORDER}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={24} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: MUTED,
              letterSpacing: "0.10em",
              textTransform: "uppercase" as const,
            }}
          >
            WRESTLYTICS
          </span>
        </div>

        {/* Right: copyright */}
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            color: MUTED,
            letterSpacing: "0.06em",
          }}
        >
          © 2026 Wrestlytics. All rights reserved.
        </span>
      </footer>

      {/* Cursor blink keyframe (injected globally) */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
