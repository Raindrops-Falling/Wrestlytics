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

// ─── Design tokens ───────────────────────────────────────────────────────────
const C_BG       = "#08090a";
const C_CARD     = "#0f1011";
const C_ELEVATED = "#161718";
const C_BORDER   = "#23252a";
const C_BODY     = "#d0d6e0";
const C_MUTED    = "#8a8f98";
const C_WHITE    = "#ffffff";
const F_MONO     = '"JetBrains Mono", monospace';
const F_SANS     = '"Inter", sans-serif';

// ─── Logo (defined here, not imported from Canvases) ─────────────────────────
function WrestlyticsLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* bounding-box corner brackets — top pair bright, bottom pair dimmed */}
      <path d="M2 8 L2 2 L8 2" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 2 L30 2 L30 8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 24 L2 30 L8 30" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24 30 L30 30 L30 24" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* two athlete circles — slightly offset, touching */}
      <circle cx="12" cy="16" r="3.5" fill="#ffffff"/>
      <circle cx="20" cy="16" r="3.5" fill="rgba(255,255,255,0.45)"/>
    </svg>
  );
}

// ─── MonoLabel helper ─────────────────────────────────────────────────────────
function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: F_MONO,
      fontSize: 11,
      color: C_MUTED,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      margin: "0 0 16px 0",
    }}>
      {children}
    </p>
  );
}

// ─── VideoOverlay helper ──────────────────────────────────────────────────────
function VideoOverlay({ src, opacity }: { src: string; opacity: number }) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      src={src}
      style={{
        position: "absolute",
        inset: 0,
        objectFit: "cover",
        width: "100%",
        height: "100%",
        opacity,
      }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function J1() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: F_SANS, background: C_BG, color: C_BODY, minHeight: "100vh" }}
    >

      {/* ── 1. NAV ───────────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 100,
        background: C_BG,
        borderBottom: `1px solid ${C_BORDER}`,
        display: "flex",
        alignItems: "center",
        padding: "0 40px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={28} />
          <span style={{
            fontFamily: F_MONO,
            fontSize: 12,
            color: C_WHITE,
            letterSpacing: "0.14em",
          }}>
            WRESTLYTICS
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {["Platform", "Research", "About"].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: 14,
                color: C_MUTED,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              {link}
            </a>
          ))}
          <button style={{
            background: C_WHITE,
            color: C_BG,
            border: "none",
            borderRadius: 20,
            padding: "8px 18px",
            fontSize: 14,
            fontFamily: F_SANS,
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* ── 2. HERO ──────────────────────────────────────────────────────────── */}
      <section style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        paddingTop: 100,
        overflow: "hidden",
      }}>
        <VideoOverlay src={asciiMagic3} opacity={0.55} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(8,9,10,0.96) 0%, rgba(8,9,10,0.7) 60%, rgba(8,9,10,0.4) 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, padding: "0 40px" }}>
          <MonoLabel>Computer Vision for Wrestling</MonoLabel>

          <h1 style={{
            fontSize: "clamp(52px, 7vw, 80px)",
            fontWeight: 510,
            letterSpacing: "-0.026em",
            lineHeight: 1.05,
            color: C_WHITE,
            margin: "0 0 24px 0",
            whiteSpace: "pre-line",
          }}>
            {"Seeing wrestlers\nother systems miss."}
          </h1>

          <p style={{
            fontSize: 17,
            color: C_BODY,
            lineHeight: 1.65,
            maxWidth: 480,
            margin: "0 0 36px 0",
          }}>
            We built the first person detection model trained specifically for
            wrestling — one that holds identity through contact, overlap, and
            complete body stacking.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <button style={{
              background: C_WHITE,
              color: C_BG,
              border: "none",
              borderRadius: 6,
              padding: "13px 24px",
              fontSize: 15,
              fontFamily: F_SANS,
              fontWeight: 500,
              cursor: "pointer",
            }}>
              Join the Waitlist
            </button>
            <button style={{
              background: "transparent",
              color: C_WHITE,
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 6,
              padding: "13px 24px",
              fontSize: 15,
              fontFamily: F_SANS,
              cursor: "pointer",
            }}>
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. TRUST STRIP ───────────────────────────────────────────────────── */}
      <div style={{
        padding: "20px 40px",
        borderTop: `1px solid ${C_BORDER}`,
        borderBottom: `1px solid ${C_BORDER}`,
        background: C_BG,
        display: "flex",
        alignItems: "center",
        gap: 40,
        flexWrap: "wrap",
      }}>
        <span style={{ fontFamily: F_MONO, fontSize: 13, color: C_MUTED }}>Teams at</span>
        {["Iowa", "Penn State", "Ohio State", "Oklahoma", "Michigan", "Cornell"].map((name) => (
          <span key={name} style={{ fontFamily: F_MONO, fontSize: 13, color: C_MUTED }}>
            {name}
          </span>
        ))}
      </div>

      {/* ── 4. PROBLEM SECTION ───────────────────────────────────────────────── */}
      <section style={{ padding: "96px 40px", background: C_BG }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "60fr 40fr",
          gap: 64,
          alignItems: "center",
        }}>
          <div data-reveal="up">
            <MonoLabel>The Problem</MonoLabel>
            <h2 style={{
              fontSize: "clamp(36px,5vw,48px)",
              fontWeight: 510,
              color: C_WHITE,
              lineHeight: 1.1,
              margin: "0 0 24px 0",
            }}>
              The Sport That Vision Forgot.
            </h2>
            <p style={{ fontSize: 20, color: C_BODY, lineHeight: 1.65, margin: "0 0 20px 0" }}>
              Most computer vision systems were built for sports where athletes
              stay apart. Wrestling is different.
            </p>
            <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 16px 0" }}>
              In wrestling, athletes are in constant contact. They stack, overlap,
              and pile on top of each other in every position. Traditional systems
              — built for soccer, basketball, football — were never designed for
              this. They fail.
            </p>
            <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: 0 }}>
              We set out to change that. We built a detection system designed
              specifically for wrestling — one that could see every athlete
              regardless of overlap.
            </p>
          </div>

          <div style={{ position: "relative", width: 300, height: 300, justifySelf: "center" }}>
            <LayersCanvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          </div>
        </div>
      </section>

      {/* ── 5. OCCLUSION ANALYSIS ────────────────────────────────────────────── */}
      <section style={{
        background: C_CARD,
        padding: "96px 40px",
        borderTop: `1px solid ${C_BORDER}`,
      }}>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}>
          {/* Video left */}
          <div style={{
            borderRadius: 12,
            overflow: "hidden",
            border: `1px solid ${C_BORDER}`,
            aspectRatio: "16/9",
          }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              src={annotatedVideo1}
              style={{ width: "100%", display: "block" }}
            />
          </div>

          {/* Copy right */}
          <div data-reveal="left">
            <MonoLabel>Occlusion Analysis</MonoLabel>
            <h2 style={{
              fontSize: "clamp(28px,3.5vw,40px)",
              fontWeight: 510,
              color: C_WHITE,
              whiteSpace: "pre-line",
              lineHeight: 1.2,
              margin: "0 0 24px 0",
            }}>
              {"Through contact.\nThrough overlap.\nThrough the stack."}
            </h2>
            <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 16px 0" }}>
              Standard models fall apart when wrestlers lock up. Bounding boxes
              merge, identities swap, and the data becomes useless — exactly when
              you need it most.
            </p>
            <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 28px 0" }}>
              Our model was trained on these moments. When two athletes fully
              overlap, it uses frame context and learned wrestling-specific
              patterns to maintain separate identities for both. Twenty-three
              occlusion events in this clip — resolved: 23.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 500, color: C_WHITE, lineHeight: 1 }}>23</div>
                <div style={{ fontFamily: F_MONO, fontSize: 12, color: C_MUTED, marginTop: 6 }}>
                  Occlusion events
                </div>
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 500, color: C_WHITE, lineHeight: 1 }}>100%</div>
                <div style={{ fontFamily: F_MONO, fontSize: 12, color: C_MUTED, marginTop: 6 }}>
                  Resolution rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. DETECTING IN REAL TIME ────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <VideoOverlay src={asciiMagic5} opacity={0.18} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "96px 40px" }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}>
            {/* Left: terminal */}
            <div>
              <MonoLabel>Under the Hood</MonoLabel>
              <h2 style={{
                fontSize: "clamp(28px,3.5vw,40px)",
                fontWeight: 510,
                color: C_WHITE,
                lineHeight: 1.2,
                margin: "0 0 20px 0",
              }}>
                Detecting in Real Time.
              </h2>
              <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 4px 0" }}>
                Our model processes wrestling video frame by frame. When occlusion
                happens, it resolves it — automatically, in real time.
              </p>
              <WrestlingTerminal triggerOnScroll={true} style={{ marginTop: 28 }} />
            </div>

            {/* Right: annotated video */}
            <div style={{ position: "relative" }}>
              <div style={{
                position: "relative",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                aspectRatio: "16/9",
              }}>
                <div style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  zIndex: 2,
                  fontFamily: F_MONO,
                  fontSize: 10,
                  color: C_WHITE,
                  background: "rgba(0,0,0,0.65)",
                  padding: "4px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                }}>
                  LIVE OUTPUT
                </div>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={annotatedVideo2}
                  style={{ width: "100%", display: "block" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FEATURE CARDS ─────────────────────────────────────────────────── */}
      <section style={{
        padding: "96px 40px",
        background: C_BG,
        borderTop: `1px solid ${C_BORDER}`,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <MonoLabel>How It Works</MonoLabel>
          <h2 style={{
            fontSize: "clamp(32px,4vw,48px)",
            fontWeight: 510,
            color: C_WHITE,
            maxWidth: 560,
            lineHeight: 1.15,
            margin: "0 0 16px 0",
          }}>
            Built for the hardest contact sport.
          </h2>
          <p style={{ fontSize: 17, color: C_MUTED, margin: "0 0 48px 0" }}>
            Three years building one thing right before building anything else.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {/* Card 1 */}
            <div style={{
              background: C_CARD,
              border: `1px solid ${C_BORDER}`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <div style={{ position: "relative", height: 200 }}>
                <NodesCanvas style={{ position: "absolute", inset: 0 }} />
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: C_WHITE, margin: "0 0 10px 0" }}>
                  Multi-body detection
                </h3>
                <p style={{ fontSize: 14, color: C_MUTED, lineHeight: 1.6, margin: 0 }}>
                  Two wrestlers tracked independently — even when stacked or fully
                  overlapping.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              background: C_CARD,
              border: `1px solid ${C_BORDER}`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <div style={{ position: "relative", height: 200 }}>
                <ThreeOrbit style={{ position: "absolute", inset: 0 }} />
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: C_WHITE, margin: "0 0 10px 0" }}>
                  Identity through occlusion
                </h3>
                <p style={{ fontSize: 14, color: C_MUTED, lineHeight: 1.6, margin: 0 }}>
                  When wrestlers overlap completely, the model uses context to hold
                  each athlete&apos;s identity separate.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{
              background: C_CARD,
              border: `1px solid ${C_BORDER}`,
              borderRadius: 12,
              overflow: "hidden",
            }}>
              <div style={{ position: "relative", height: 200 }}>
                <WireframeCanvas shape="sphere" style={{ position: "absolute", inset: 0 }} />
              </div>
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 500, color: C_WHITE, margin: "0 0 10px 0" }}>
                  Built for wrestling
                </h3>
                <p style={{ fontSize: 14, color: C_MUTED, lineHeight: 1.6, margin: 0 }}>
                  Not adapted from another sport. Trained from scratch on wrestling
                  footage and wrestling-specific scenarios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. BUILT FROM SCRATCH ────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 40px" }}>
        <VideoOverlay src={asciiAnim1} opacity={0.15} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
            {/* Left: copy */}
            <div>
              <MonoLabel>Our Approach</MonoLabel>
              <h2 style={{
                fontSize: "clamp(28px,3.5vw,40px)",
                fontWeight: 510,
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                color: C_WHITE,
                margin: "0 0 24px 0",
              }}>
                {"We didn't borrow from\nother sports."}
              </h2>
              <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                Every other sport&apos;s detection model assumes athletes stay
                separated. Wrestling doesn&apos;t. Borrowing those models and
                tuning them didn&apos;t work — we tried. So we started from
                scratch.
              </p>
              <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: 0 }}>
                This is our first model. It does one thing: detect and track
                wrestlers through every position, every level of contact.
                It&apos;s a foundation, not a finished product.
              </p>
            </div>

            {/* Right: numbered list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { num: "01", text: "Trained on wrestling footage specifically" },
                { num: "02", text: "Built around occlusion as the primary challenge" },
                { num: "03", text: "Tested on real match video from collegiate competition" },
              ].map((item) => (
                <div
                  key={item.num}
                  style={{
                    padding: 20,
                    background: C_ELEVATED,
                    border: `1px solid ${C_BORDER}`,
                    borderRadius: 8,
                  }}
                >
                  <div style={{
                    fontFamily: F_MONO,
                    fontSize: 11,
                    color: C_MUTED,
                    marginBottom: 8,
                  }}>
                    {item.num}
                  </div>
                  <div style={{ fontSize: 15, color: C_WHITE, fontWeight: 500 }}>
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. MOUNTAIN SECTION ──────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 480,
        display: "flex",
        alignItems: "center",
      }}>
        <img
          src={mountainImg}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 1,
          }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(8,9,10,0.95) 0%, rgba(8,9,10,0.75) 50%, rgba(8,9,10,0.3) 100%)",
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, padding: "0 40px" }}>
          <MonoLabel>What Comes Next</MonoLabel>
          <h2 style={{
            fontSize: "clamp(32px,4.5vw,56px)",
            fontWeight: 510,
            lineHeight: 1.1,
            whiteSpace: "pre-line",
            color: C_WHITE,
            margin: "0 0 24px 0",
          }}>
            {"Detection is the foundation.\nEverything else builds here."}
          </h2>
          <p style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: C_MUTED,
            maxWidth: 440,
            margin: 0,
          }}>
            Once you can reliably see every wrestler in every frame, the rest
            becomes possible. Match events. Statistics. Team-level patterns.
            We&apos;re building those next.
          </p>
        </div>
      </section>

      {/* ── 10. PROGRAMS SECTION (asciiAnim4) ────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <VideoOverlay src={asciiAnim4} opacity={0.2} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.88)" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "96px 40px" }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}>
            <div data-reveal="up">
              <MonoLabel>Who We Work With</MonoLabel>
              <h2 style={{
                fontSize: "clamp(28px,3.5vw,40px)",
                fontWeight: 510,
                color: C_WHITE,
                lineHeight: 1.2,
                margin: "0 0 20px 0",
              }}>
                Open to coaches, teams, and programs at every level.
              </h2>
              <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: "0 0 16px 0" }}>
                We&apos;re working directly with coaches and programs to refine
                the model on real footage. Early access is limited — we want to
                build this right, with the right partners.
              </p>
              <p style={{ fontSize: 15, color: C_MUTED, lineHeight: 1.7, margin: 0 }}>
                Whether you&apos;re a D1 program or a community club, the
                fundamental challenge is the same. If you&apos;re serious about
                data-driven wrestling, we want to hear from you.
              </p>
            </div>

            {/* 2×2 tier grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { tier: "D1", label: "Collegiate programs" },
                { tier: "D2 / D3", label: "Programs in pipeline" },
                { tier: "High School", label: "Partners onboarding" },
                { tier: "Club", label: "Community programs" },
              ].map((item) => (
                <div
                  key={item.tier}
                  style={{
                    background: C_CARD,
                    border: `1px solid ${C_BORDER}`,
                    borderRadius: 10,
                    padding: 24,
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: C_WHITE, marginBottom: 6 }}>
                    {item.tier}
                  </div>
                  <div style={{ fontFamily: F_MONO, fontSize: 11, color: C_MUTED }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. WRESTLING IS UNSOLVED ─────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 560,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <VideoOverlay src={asciiAnim3} opacity={0.22} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.90)" }} />

        <div style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 700,
          padding: "80px 40px",
        }}>
          <h2 style={{
            fontSize: "clamp(52px,7vw,80px)",
            fontWeight: 510,
            letterSpacing: "-0.026em",
            lineHeight: 1.05,
            color: C_WHITE,
            margin: "0 0 48px 0",
          }}>
            Wrestling Is Unsolved.
          </h2>

          {submitted ? (
            <p style={{ fontSize: 18, color: C_BODY, lineHeight: 1.6 }}>
              You&apos;re on the list.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", gap: 12, justifyContent: "center" }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 6,
                  padding: "14px 20px",
                  fontSize: 15,
                  color: C_WHITE,
                  fontFamily: F_SANS,
                  width: 280,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  background: C_WHITE,
                  color: C_BG,
                  border: "none",
                  borderRadius: 6,
                  padding: "14px 24px",
                  fontSize: 15,
                  fontFamily: F_SANS,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Join the Waitlist
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── 12. FOOTER ───────────────────────────────────────────────────────── */}
      <footer style={{
        padding: "32px 40px",
        borderTop: `1px solid ${C_BORDER}`,
        background: C_BG,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <WrestlyticsLogo size={24} />
          <span style={{ fontFamily: F_MONO, fontSize: 11, color: C_WHITE, letterSpacing: "0.14em" }}>
            WRESTLYTICS
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: C_MUTED }}>© 2025 Wrestlytics</span>
      </footer>

    </div>
  );
}
