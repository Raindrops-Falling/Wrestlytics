import { useRef, useState, useEffect } from "react";
import {
  WireframeCanvas,
  NodesCanvas,
  LayersCanvas,
  useScrollReveal,
} from "@/components/shared/Canvases";

import asciiMagic3 from "@/imports/ascii-magic-3-1.mp4";
import asciiMagic5 from "@/imports/ascii-magic-5-1.mp4";
import asciiMagic4 from "@/imports/ascii-magic-4-1.mp4";
import asciiAnim1 from "@/imports/ascii-animation__1_.mp4";
import asciiAnim3 from "@/imports/ascii-animation__3_.mp4";
import mountainImg from "@/imports/images__19_-1.jpg";
import annotatedVideo2 from "@/imports/annotated_video_h264__2_-1.mp4";
import annotatedVideo1 from "@/imports/annotated_video_h264__3_.mp4";

/* ─── tokens ─── */
const T = {
  bg: "#08090a",
  card: "#0f1011",
  border: "#23252a",
  body: "#d0d6e0",
  muted: "#8a8f98",
  white: "#ffffff",
};

/* ─── mobile hook ─── */
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

/* ─── halftone canvas — canvas-ref approach for reliable sizing ─── */
function HalftoneCanvas({ overlay = 0.78 }: { overlay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;
    let animId = 0;
    let renderer: any = null;
    let removeResize = () => {};
    import("three").then((THREE) => {
      if (cancelled || !canvas) return;
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x08090a, 1);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;
      const resize = () => {
        if (!canvas || !renderer) return;
        const parent = canvas.parentElement;
        const w = Math.max(1, parent ? parent.clientWidth : 1);
        const h = Math.max(1, parent ? parent.clientHeight : 1);
        renderer.setSize(w, h, false);
        const aspect = w / h;
        camera.left = -aspect;
        camera.right = aspect;
        camera.bottom = -1;
        camera.top = 1;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", resize);
      removeResize = () => window.removeEventListener("resize", resize);
      setTimeout(resize, 0);
      const gridSize = 22;
      const pos: number[] = [];
      const sc: number[] = [];
      for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
          pos.push(x * 0.15, y * 0.15, 0);
          sc.push(1);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute("scale", new THREE.Float32BufferAttribute(sc, 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x383b3f) },
          color2: { value: new THREE.Color(0x62666d) },
        },
        vertexShader: `
          attribute float scale;
          varying vec2 vUv;
          varying float vScale;
          uniform float time;
          void main() {
            vUv = position.xy;
            float dist = length(position.xy);
            float animatedScale = scale * (sin(dist * 6.0 - time * 2.5) * 0.5 + 0.5);
            vScale = animatedScale;
            gl_PointSize = animatedScale * 5.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec2 vUv;
          varying float vScale;
          void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            if(length(coord) > 0.5) discard;
            vec3 finalColor = mix(color2, color1, (vUv.y + 1.0) * 0.5);
            gl_FragColor = vec4(finalColor, vScale * 0.9);
          }
        `,
        transparent: true,
      });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      const clock = new THREE.Clock();
      const animate = () => {
        if (cancelled) return;
        animId = requestAnimationFrame(animate);
        mat.uniforms.time.value = clock.getElapsedTime();
        renderer.render(scene, camera);
      };
      animate();
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      removeResize();
      if (renderer) { renderer.dispose(); renderer = null; }
    };
  }, []);
  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: `rgba(8,9,10,${overlay})` }} />
    </>
  );
}

/* ─── logo ─── */
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

function StaticTerminal({ minH = 320 }: { minH?: number }) {
  return (
    <div
      style={{
        background: "rgba(8,9,10,0.92)",
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        overflow: "hidden",
        minHeight: minH,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {(["#ff5f57", "#febc2e", "#28c840"] as const).map((c) => (
          <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div
        style={{
          padding: "20px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          lineHeight: 1.85,
          flex: 1,
        }}
      >
        {TERMINAL_LINES.map((line, i) => (
          <div key={i} style={{ color: line.bright ? T.body : T.muted }}>
            {line.text || " "}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── main component ─── */
export default function J2() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollReveal(containerRef as React.RefObject<HTMLElement | null>);
  const isMobile = useIsMobile();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <div ref={containerRef} style={{ background: T.bg, color: T.body, fontFamily: "Inter, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ─── NAV ─── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 60, background: T.bg, borderBottom: `1px solid ${T.border}`, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <WrestlyticsLogo size={28} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", color: T.white }}>WRESTLYTICS</span>
        </div>
        <button style={{ fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 500, color: T.white, background: "transparent", border: `1px solid rgba(255,255,255,0.25)`, borderRadius: 20, padding: "7px 18px", cursor: "pointer" }}>
          Join Waitlist
        </button>
      </nav>

      {/* ─── HERO — 55/45 split ─── */}
      <section style={{ position: "relative", minHeight: "100vh", paddingTop: 60, background: T.bg, display: "flex", alignItems: "stretch", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "55fr 45fr", width: "100%", alignItems: "center" }}>
          <div data-reveal="up" style={{ padding: isMobile ? "80px 32px 52px" : "120px 64px 80px 80px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ ...monoLabel, marginBottom: 20 }}>COMPUTER VISION · WRESTLING</p>
            <h1 style={{ fontSize: "clamp(48px,5.5vw,76px)", fontWeight: 510, letterSpacing: "-0.026em", lineHeight: 1.05, whiteSpace: "pre-line", color: T.white, margin: 0 }}>
              {"Wrestling\nIntelligence."}
            </h1>
            <p style={{ fontSize: 17, color: T.body, lineHeight: 1.65, maxWidth: 460, margin: "18px 0 0" }}>
              We&apos;re building computer vision software for wrestling — detection, event tracking, match analytics, and team-level data. The infrastructure the sport has never had.
            </p>
            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: T.bg, background: T.white, border: "none", borderRadius: 6, padding: "13px 24px", cursor: "pointer" }}>
                Join the Waitlist
              </button>
              <button style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: T.white, background: "transparent", border: `1px solid rgba(255,255,255,0.25)`, borderRadius: 6, padding: "13px 24px", cursor: "pointer" }}>
                See the technology
              </button>
            </div>
          </div>
          {!isMobile ? (
            <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh" }}>
              <video autoPlay muted loop playsInline src={asciiMagic5} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.65, pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #08090a 0%, transparent 30%)", pointerEvents: "none" }} />
            </div>
          ) : (
            <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
              <video autoPlay muted loop playsInline src={asciiMagic5} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.5, display: "block", pointerEvents: "none" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #08090a 0%, transparent 30%, transparent 70%, #08090a 100%)", pointerEvents: "none" }} />
            </div>
          )}
        </div>
      </section>

      {/* ─── PROBLEM — halftone BG, centered text ─── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "96px 40px", borderTop: `1px solid ${T.border}` }}>
        <HalftoneCanvas overlay={0.82} />
        <div style={{ position: "relative", zIndex: 1, ...sectionWrap, textAlign: "center" }}>
          <p style={{ ...monoLabel, textAlign: "center" }} data-reveal="up">THE PROBLEM</p>
          <h2 data-reveal="up" style={{ fontSize: "clamp(36px,5vw,52px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, color: T.white, margin: "0 auto 20px", maxWidth: 700 }}>
            The sport that data forgot.
          </h2>
          <p style={{ fontSize: 19, color: T.body, lineHeight: 1.6, maxWidth: 600, margin: "0 auto 20px" }}>
            Most computer vision systems were built for sports where athletes stay apart. Wrestling is different.
          </p>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 640, margin: "0 auto 16px" }}>
            In wrestling, athletes are in contact for the majority of a match. Standard pose estimation and tracking models were never designed for this. They lose identity, merge bounding boxes, and fail entirely when two bodies overlap.
          </p>
          <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 640, margin: "0 auto" }}>
            Wrestlytics built a detection model from the ground up for wrestling — trained on wrestling footage, tuned for wrestling positions, tested on real collegiate matches. This is the infrastructure that should have existed years ago.
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
            <video autoPlay muted loop playsInline src={annotatedVideo2} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ─── DETECTING IN REAL TIME — terminal + video side by side ─── */}
      <section style={{ position: "relative" }}>
        <video autoPlay muted loop playsInline src={asciiMagic4} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "96px 40px" }}>
          <div style={{ ...sectionWrap, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 64, alignItems: "start" }}>
            <div data-reveal="up">
              <h2 style={{ fontSize: "clamp(32px,4.5vw,48px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, color: T.white, margin: "0 0 16px" }}>
                Detecting in Real Time.
              </h2>
              <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>
                Our first model processes wrestling video frame by frame — tracking both athletes through contact, overlap, and every occlusion event.
              </p>
              <StaticTerminal minH={320} />
            </div>
            <div data-reveal="right" style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, minHeight: isMobile ? 240 : 420 }}>
              <video autoPlay muted loop playsInline src={annotatedVideo1} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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

      {/* ─── DETECTION IS THE FOUNDATION — 2-col: text + asciiAnim1 ─── */}
      <section style={{ background: T.bg, borderTop: `1px solid ${T.border}`, overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", minHeight: isMobile ? "auto" : 480, alignItems: "center" }}>
          <div data-reveal="up" style={{ padding: isMobile ? "64px 32px" : "96px 64px 96px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={monoLabel}>WHAT&apos;S NEXT</p>
            <h2 style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 510, letterSpacing: "-0.022em", lineHeight: 1.1, whiteSpace: "pre-line", color: T.white, margin: "0 0 20px" }}>
              {"Detection is the foundation.\nEverything else\nbuilds here."}
            </h2>
            <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, maxWidth: 440 }}>
              Once you can reliably see every wrestler in every frame, the harder questions become answerable. We&apos;re building the next layer: match events, statistics, and team-level pattern analysis.
            </p>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: isMobile ? 280 : 480 }}>
            <video autoPlay muted loop playsInline src={asciiAnim1} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.6, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(to bottom, #08090a 0%, transparent 25%, transparent 75%, #08090a 100%)" : "linear-gradient(to right, #08090a 0%, transparent 35%)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* ─── STARTED AT ZERO — numbered list LEFT, text RIGHT ─── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 400, display: "flex", alignItems: "center" }}>
        <video autoPlay muted loop playsInline src={asciiAnim1} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.92)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, ...sectionWrap, padding: "96px 40px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 64, alignItems: "start" }}>
            <div data-reveal="up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <div data-reveal="right">
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
            <p style={{ fontSize: 17, color: T.body, lineHeight: 1.7, marginBottom: 32 }}>
              We built the detection layer first. Everything else — event classification, match statistics, team-level patterns — is on the roadmap. We&apos;re building it alongside coaches and programs who want it to exist.
            </p>
            <button style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 500, color: T.white, background: "transparent", border: `1px solid rgba(255,255,255,0.25)`, borderRadius: 6, padding: "12px 22px", cursor: "pointer", alignSelf: "flex-start" }}>
              Read about our approach
            </button>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: isMobile ? 260 : "auto" }}>
            <video autoPlay muted loop playsInline src={asciiMagic3} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.55, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, background: isMobile ? "linear-gradient(to bottom, #08090a 0%, transparent 25%, transparent 75%, #08090a 100%)" : "linear-gradient(to right, #08090a 0%, transparent 40%)", pointerEvents: "none" }} />
          </div>
        </div>
      </section>

      {/* ─── WRESTLING IS UNSOLVED ─── */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <video autoPlay muted loop playsInline src={asciiAnim3} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,10,0.88)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: isMobile ? "80px 24px" : "80px 40px" }}>
          <h2 data-reveal="up" style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 510, letterSpacing: "-0.026em", color: T.white, margin: 0 }}>
            Wrestling Is Unsolved.
          </h2>
          <div style={{ marginTop: 48 }}>
            {submitted ? (
              <p style={{ fontSize: 18, color: T.white, fontWeight: 500 }}>You&apos;re on the list.</p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 6, padding: "14px 20px", fontSize: 15, color: T.white, fontFamily: "Inter, sans-serif", width: isMobile ? "100%" : 280, outline: "none" }} />
                <button type="submit" style={{ fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, color: T.bg, background: T.white, border: "none", borderRadius: 6, padding: "14px 24px", cursor: "pointer", whiteSpace: "nowrap" }}>
                  Join the Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ─── FOOTER — mountain image as subtle bg ─── */}
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
