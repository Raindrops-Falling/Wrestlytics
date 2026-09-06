import { useRef, useState, useEffect } from "react";
import {
  WireframeCanvas,
  NodesCanvas,
  LayersCanvas,
  useScrollReveal,
} from "@/components/shared/Canvases";

import { supabase } from "@/lib/supabase";

const asciiMagic5 = "https://pub-9660dda224dc4727bc1eadab5cf0a535.r2.dev/ascii-magic-5.mp4";
const asciiAnim3 = "https://pub-9660dda224dc4727bc1eadab5cf0a535.r2.dev/ascii-animation%20%283%29.mp4";

const mountainImg = "https://pub-9660dda224dc4727bc1eadab5cf0a535.r2.dev/images%20%2819%29.jpg";
const annotatedVideo2 = "https://pub-9660dda224dc4727bc1eadab5cf0a535.r2.dev/annotated_video_h264%20%283%29.mp4";

const annotatedVideo1 = "https://pub-9660dda224dc4727bc1eadab5cf0a535.r2.dev/annotated_video_h264%20%282%29.mp4";


/* ─── tokens ─── */
const T = {
  bg: "#08090a",
  card: "#0f1011",
  border: "#23252a",
  body: "#d0d6e0",
  muted: "#8a8f98",
  white: "#ffffff",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const h = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

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

const monoLabel: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.12em",
  color: T.muted,
  textTransform: "uppercase" as const,
  marginBottom: 16,
};

const sectionWrap: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
const linkedInUrl = "https://www.linkedin.com/in/derek-t-40779a354/";
const videoProps = {
  autoPlay: true,
  muted: true,
  loop: true,
  playsInline: true,
  preload: "auto" as const,
};

const TERMINAL_LINES = [
  { text: "$ wrestlytics analyze --input match.mp4", bright: true },
  { text: "", bright: false },
  { text: "[INIT] Loading detection model v1.2...", bright: false },
  { text: "[INIT] CUDA backend initialized", bright: false },
  { text: "[1/4] Extracting frames...           done", bright: false },
  { text: "[2/4] Running detection pipeline...  done", bright: false },
  { text: "[3/4] Tracking athlete identities... done", bright: false },
  { text: "[4/4] Aggregating event data...      done", bright: false },
  { text: "", bright: false },
  { text: "847 frames processed · 2 athletes tracked", bright: true },
  { text: "→  Output: match_analysis.json", bright: true },
];

const ROADMAP_TERMINAL_LINES = [
  { text: "$ wrestlytics roadmap --phase 4", bright: true },
  { text: "", bright: false },
  { text: "[1/4] Release product...                done", bright: false },
  { text: "    → launch alpha to a few programs", bright: false },
  { text: "[2/4] Get researchers...               done", bright: false },
  { text: "    → recruit collaborators for data + review", bright: false },
  { text: "[3/4] Expand across NJ...              done", bright: false },
  { text: "    → bring the system to more mats and clubs", bright: false },
  { text: "[4/4] New model development...        in progress", bright: false },
  { text: "", bright: false },
  { text: "→  status: we are absolutely not done", bright: true },
];

function ContactMenu() {
  return (
    <details style={{ position: "relative", width: "100%" }}>
      <summary style={{ listStyle: "none", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: T.white, background: "transparent", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, padding: "14px 12px", cursor: "pointer", whiteSpace: "nowrap", display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
        Contact Me
      </summary>
      <div style={{ position: "absolute", zIndex: 10, right: 0, top: "calc(100% + 8px)", minWidth: 150, padding: 6, background: T.card, border: `1px solid ${T.border}`, borderRadius: 6, boxShadow: "0 12px 28px rgba(0,0,0,0.35)" }}>
        <a href={linkedInUrl} target="_blank" rel="noreferrer" style={{ display: "block", padding: "10px 12px", color: T.white, fontFamily: "Inter, sans-serif", fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
          My LinkedIn
        </a>
        <a href="mailto:tursoderek@gmail.com" style={{ display: "block", padding: "10px 12px", color: T.white, fontFamily: "Inter, sans-serif", fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>
          Email Me
        </a>
      </div>
    </details>
  );
}

function WaitlistControls({
  email,
  setEmail,
  submitted,
  handleSubmit,
}: {
  email: string;
  setEmail: (email: string) => void;
  submitted: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  if (submitted) {
    return (
      <div style={{ display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <p style={{ fontSize: 18, color: T.white, fontWeight: 500, margin: 0 }}>You&apos;re on the list.</p>
        <ContactMenu />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateRows: "auto auto", gap: 12, width: "100%", maxWidth: 620, margin: "0 auto" }}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 6, padding: "14px 20px", fontSize: 15, color: T.white, fontFamily: "Inter, sans-serif", width: "100%", outline: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, width: "100%" }}>
        <button type="submit" style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: T.bg, background: T.white, border: "none", borderRadius: 6, padding: "14px 12px", cursor: "pointer", whiteSpace: "nowrap", width: "100%" }}>
          Join Waitlist
        </button>
        <ContactMenu />
      </div>
    </form>
  );
}

function StaticTerminal({ minH = 320 }: { minH?: number }) {
  return (
    <div style={{ background: "rgba(8,9,10,0.92)", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", minHeight: minH, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {(["#ff5f57", "#febc2e", "#28c840"] as const).map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ padding: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.85, flex: 1 }}>
        {TERMINAL_LINES.map((line, i) => (
          <div key={i} style={{ color: line.bright ? T.body : T.muted }}>{line.text || " "}</div>
        ))}
      </div>
    </div>
  );
}

function RoadmapTerminal({ minH = 320 }: { minH?: number }) {
  return (
    <div style={{ background: "rgba(8,9,10,0.94)", border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", minHeight: minH, display: "flex", flexDirection: "column", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        {(["#ff5f57", "#febc2e", "#28c840"] as const).map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ padding: "20px", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.85, flex: 1 }}>
        {ROADMAP_TERMINAL_LINES.map((line, i) => (
          <div key={i} style={{ color: line.bright ? T.body : T.muted }}>{line.text || " "}</div>
        ))}
      </div>
    </div>
  );
}

export default function J5() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef as React.RefObject<HTMLElement | null>);
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    const { error } = await supabase.from("waitlist").insert({ email: email.trim() });

    if (error) {
      if (error.code === "23505") {
        setError("That email's already on the list.");
      } else {
        setError("Something went wrong — try again.");
      }
      return;
    }

    setError("");
    setSubmitted(true);
  }

  return (
    <div ref={containerRef} style={{ background: T.bg, color: T.body, fontFamily: "Inter, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, background: T.bg, borderBottom: `1px solid ${T.border}`, zIndex: 100, display: "flex", alignItems: "center", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={28} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", color: T.white }}>WRESTLYTICS</span>
        </div>
      </nav>

      {/* ─── HERO — 45/55 split ─── */}
      <section style={{ position: "relative", minHeight: "100vh", paddingTop: 60, background: T.bg, display: "flex", alignItems: "stretch", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "45fr 55fr", width: "100%", alignItems: "center" }}>
          <div data-reveal="up" style={{ padding: isMobile ? "80px 32px 52px" : "120px 64px 80px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontSize: "clamp(48px,5.5vw,76px)", fontWeight: 510, letterSpacing: "-0.026em", lineHeight: 1.05, whiteSpace: "pre-line", color: T.white, margin: 0 }}>
              {"Wrestling\nIntelligence."}
            </h1>
            <p style={{ fontSize: 17, color: T.body, lineHeight: 1.65, maxWidth: 460, margin: "18px 0 0" }}>
              We&apos;re building computer vision software for wrestling — detection, event tracking, match analytics, and team-level data. The infrastructure the sport has never had.
            </p>
            <div style={{ marginTop: submitted ? 72 : 40 }}>
              <WaitlistControls email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
            </div>
          </div>
          {!isMobile ? (
            <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
              <video {...videoProps} src={asciiMagic5} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65, pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #08090a 0%, transparent 30%)", pointerEvents: "none" }} />
            </div>
          ) : (
            <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
              <video {...videoProps} src={asciiMagic5} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.5, display: "block", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #08090a 0%, transparent 30%, transparent 70%, #08090a 100%)", pointerEvents: "none" }} />
            </div>
          )}
        </div>
      </section>

      {/* ─── PROBLEM — video BG, centered text ─── */}
      <section style={{ position: "relative", overflow: "hidden", borderTop: `1px solid ${T.border}` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.88)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, ...sectionWrap, textAlign: "center", padding: "96px 40px" }}>
          <h2 data-reveal="up" style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, color: T.white, margin: "0 auto 24px", maxWidth: 700 }}>
            The sport that data forgot.
          </h2>
          <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, maxWidth: 640, margin: "0 auto" }}>
            In wrestling, athletes are in contact for the majority of a match. Standard pose estimation and tracking models were never designed for this — they lose identity, merge bounding boxes, and fail entirely when two bodies overlap. Wrestlytics built a detection model from the ground up, trained on wrestling footage and designed around the contact problem.
          </p>
        </div>
      </section>

      {/* ─── OCCLUSION ANALYSIS ─── */}
      <section style={{ background: T.card, padding: "96px 40px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ ...sectionWrap, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 48 : 80, alignItems: "center" }}>
          <div data-reveal="right">
            <p style={monoLabel}>OCCLUSION ANALYSIS</p>
            <h2 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, whiteSpace: "pre-line", color: T.white, margin: "0 0 20px" }}>
              {"Identity through\nthe hardest moments."}
            </h2>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, marginBottom: 16 }}>
              Every time two wrestlers lock up, standard trackers lose identity. Bounding boxes merge, athletes disappear — exactly when the data matters most.
            </p>
            <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7 }}>
              Our first tracking model was built around this problem. We&apos;re continuing to improve occlusion handling — it&apos;s an active area of our research.
            </p>
          </div>
          <div data-reveal="up" style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, aspectRatio: "16/9" }}>
            <video {...videoProps} src={annotatedVideo2} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ─── DETECTING IN REAL TIME — terminal on RIGHT, no video ─── */}
      <section style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "96px 40px" }}>
          <div style={{ ...sectionWrap, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 64, alignItems: "start" }}>
            {/* left: heading + description */}
            <div data-reveal="up">
              <h2 style={{ fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, color: T.white, margin: "0 0 20px" }}>
                Detecting in Real Time.
              </h2>
              <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.75, marginBottom: 20 }}>
                Our first model processes wrestling video frame by frame — tracking both athletes through contact, overlap, and every occlusion event.
              </p>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75 }}>
                Identity is preserved across every frame transition. When athletes separate after a clinch, the model re-distinguishes both tracks without ambiguity.
              </p>
            </div>
            {/* right: terminal */}
            <div data-reveal="right">
              <StaticTerminal minH={360} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE CARDS ─── */}
      <section style={{ padding: "96px 40px", background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <div style={sectionWrap}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ ...monoLabel, textAlign: "center" }}>HOW IT WORKS</p>
            <h2 data-reveal="up" style={{ fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, color: T.white, margin: "0 auto 16px" }}>
              Our Most Important Goals
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
              We didn&apos;t patch an existing model. We built for wrestling, which meant solving three specific technical problems.
            </p>
          </div>
          <div data-stagger style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 24 }}>
            {[
              { Canvas: NodesCanvas, title: "Multi-body tracking", body: "Two independent tracks maintained simultaneously through every position and level of contact." },
              { Canvas: LayersCanvas, title: "Occlusion resolution", body: "Identity doesn't break during stacking. The model holds both athletes through the event." },
              { Canvas: (p: any) => <WireframeCanvas shape="cube" {...p} />, title: "Wrestling-specific training", body: "Built from wrestling footage, not adapted from other sports." },
            ].map(({ Canvas, title, body }) => (
              <div key={title} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ position: "relative", height: 200 }}>
                  <Canvas style={{ position: "absolute", inset: 0 }} />
                </div>
                <div style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: T.white, margin: "0 0 10px" }}>{title}</h3>
                  <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: 0 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DETECTION IS THE FOUNDATION — 2-col: text + annotated video ─── */}
      <section style={{ background: T.bg, borderTop: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? "auto" : 520, alignItems: "center" }}>
          <div data-reveal="up" style={{ padding: isMobile ? "64px 32px" : "96px 64px 96px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={monoLabel}>WHAT&apos;S NEXT</p>
            <h2 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, whiteSpace: "pre-line", color: T.white, margin: "0 0 20px" }}>
              {"Detection is the foundation.\nEverything else\nbuilds here."}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, maxWidth: 440 }}>
              Once you can reliably see every wrestler in every frame, the harder questions become answerable. We&apos;re building the next layer: match events, statistics, and team-level pattern analysis.
            </p>
          </div>
          {/* right: annotated video (the "associated video" from Detecting section) */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: isMobile ? 280 : 520 }}>
            <video {...videoProps} src={annotatedVideo1} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(to bottom, #08090a 0%, transparent 20%, transparent 80%, #08090a 100%)" : "linear-gradient(to right, #08090a 0%, transparent 30%)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* ─── STARTED AT ZERO — numbered list LEFT, text RIGHT ─── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 400, display: "flex", alignItems: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, ...sectionWrap, padding: "96px 40px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 64, alignItems: "start" }}>
            <div data-reveal="up" style={{ display: "flex", flexDirection: "column", gap: 16, order: isMobile ? 2 : 1 }}>
              {[
                { num: "01", text: "Trained exclusively on wrestling footage" },
                { num: "02", text: "Occlusion as the primary design constraint" },
                { num: "03", text: "Tested on collegiate match video" },
              ].map((item) => (
                <div key={item.num} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.muted, letterSpacing: "0.06em", flexShrink: 0 }}>{item.num}</span>
                  <span style={{ fontSize: 15, color: T.body, lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div data-reveal="right" style={{ order: isMobile ? 1 : 2 }}>
              <p style={monoLabel}>OUR APPROACH</p>
              <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 510, letterSpacing: "-0.02em", lineHeight: 1.1, color: T.white, margin: "0 0 20px" }}>
                We started at zero.
              </h2>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, marginBottom: 16 }}>
                Detection models built for soccer, football, and basketball weren&apos;t built for contact. We found that out the hard way. So we started from scratch, built training data specific to wrestling, and designed the architecture around the contact problem.
              </p>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7 }}>
                This is our first model. It does one thing. That&apos;s intentional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VERSION ONE ─── */}
      <section style={{ background: T.bg, borderTop: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? "auto" : 440 }}>
          <div data-reveal="up" style={{ padding: isMobile ? "64px 32px" : "96px 64px 96px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={monoLabel}>WHERE WE ARE</p>
            <h2 style={{ fontSize: "clamp(28px,3.5vw,44px)", fontWeight: 510, letterSpacing: "-0.02em", lineHeight: 1.1, color: T.white, margin: "0 0 20px" }}>
              This is version one.
            </h2>
            <p style={{ fontSize: 17, color: T.body, lineHeight: 1.7 }}>
              We built the detection layer first. Everything else — event classification, match statistics, team-level patterns — is on the roadmap. We&apos;re building it alongside coaches and programs who want it to exist.
            </p>
          </div>
          <div data-reveal="up" style={{ position: "relative", overflow: "hidden", minHeight: isMobile ? 260 : 340, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <RoadmapTerminal minH={isMobile ? 240 : 280} />
          </div>
        </div>
      </section>

      {/* ─── WRESTLING IS UNSOLVED ─── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video {...videoProps} src={asciiAnim3} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.88)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "80px 24px" : "80px 40px" }}>
          <h2 data-reveal="up" style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 510, letterSpacing: "-0.026em", color: T.white, margin: 0 }}>
            Wrestling Is Unsolved.
          </h2>
          <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.65, marginTop: 20, marginBottom: 0 }}>
            Join the advancement of wrestling.
          </p>
          <div style={{ marginTop: 40, minHeight: 60, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
            <div style={{
              transform: submitted ? "translateY(28px)" : "translateY(0px)",
              transition: "transform 0.3s ease",
              display: "flex", gap: 12, justifyContent: "center", alignItems: "center", flexWrap: "wrap",
            }}>
              <WaitlistControls email={email} setEmail={setEmail} submitted={submitted} handleSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ position: "relative", overflow: "hidden", borderTop: `1px solid ${T.border}`, background: T.bg }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${mountainImg})`, backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #08090a 0%, rgba(8,9,10,0.5) 100%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <WrestlyticsLogo size={24} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: T.white }}>WRESTLYTICS</span>
          </div>
          <span style={{ fontSize: 13, color: T.muted }}>© 2025 Wrestlytics</span>
        </div>
      </footer>
    </div>
  );
}
