import { useEffect, useRef, useCallback, useState, RefObject } from "react";

/* ─── color constants ─── */
export const LIME = "#e4f222";
export const LIME_RGB = "228,242,34";
export const BG = "#08090a";
const MONO = "'JetBrains Mono', monospace";

/* ─── isometric projection ─── */
const iso = (x: number, y: number, z: number) => {
  const a = Math.PI / 6;
  return { x: (x - z) * Math.cos(a), y: y + (x + z) * Math.sin(a) };
};

/* ─── dpr line-width compensation ───
   Hairline strokes (lineWidth ~1) anti-alias thinner/fainter on standard-DPI
   desktop screens (dpr 1) than on high-DPI mobile screens (dpr 2-3), because
   the same 1 CSS-px stroke covers fewer physical pixels to blend across.
   This factor boosts lineWidth on low-dpr screens so strokes read as
   consistently opaque everywhere. */
const dprCompFor = (dpr: number) => (dpr < 1.5 ? 1.6 : dpr < 2 ? 1.2 : 1);

/* ─── canvas loop: draw is stored in a ref so it never re-triggers the effect ─── */
function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number, dprComp: number) => void
) {
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let w = 0, h = 0, t = 0, raf = 0, dprComp = 1;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dprComp = dprCompFor(dpr);
      w = Math.max(rect.width, 1); h = Math.max(rect.height, 1);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    window.addEventListener("resize", resize);
    resize();

    const loop = () => {
      t += 0.015;
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2 + 5);
        drawRef.current(ctx, t, w, h, dprComp);
        ctx.restore();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [ref]);
}

/* ─── BgWavesCanvas ─── */
export function BgWavesCanvas({ opacity = 0.35 }: { opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let bw = 0, bh = 0, bgT = 0, raf = 0, dprComp = 1;
    const resize = () => {
      bw = window.innerWidth; bh = window.innerHeight;
      canvas.width = bw; canvas.height = bh;
      dprComp = dprCompFor(window.devicePixelRatio || 1);
    };
    window.addEventListener("resize", resize);
    resize();
    const drawBg = () => {
      bgT += 0.012;
      ctx.clearRect(0, 0, bw, bh);
      ctx.save();
      ctx.translate(bw / 2, bh / 2 + 150);
      const cols = 32, rows = 22, sp = 65;
      ctx.lineWidth = 1 * dprComp;
      for (let z = 0; z < rows; z++) {
        for (let x = 0; x < cols; x++) {
          const px = (x - cols / 2) * sp, pz = z * sp;
          const scale = 800 / (800 + pz), sx = px * scale;
          const y = Math.sin(x * 0.3 + bgT) * Math.cos(z * 0.3 + bgT) * 60;
          const sy = (y + 50) * scale - 200;
          ctx.fillStyle = `rgba(255,255,255,${0.4 * scale})`;
          ctx.beginPath(); ctx.arc(sx, sy, 1.2 * scale, 0, Math.PI * 2); ctx.fill();
          if (x > 0) {
            const pxL = (x-1-cols/2)*sp, sxL = pxL*scale;
            const yL = Math.sin((x-1)*0.3+bgT)*Math.cos(z*0.3+bgT)*60;
            const syL = (yL+50)*scale-200;
            ctx.strokeStyle = `rgba(255,255,255,${0.06*scale})`;
            ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(sxL,syL); ctx.stroke();
          }
        }
      }
      ctx.restore();
      raf = requestAnimationFrame(drawBg);
    };
    drawBg();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity }} />;
}

/* ─── LayersCanvas: floating isometric planes (white) ─── */
export function LayersCanvas({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, _w: number, _h: number, dprComp: number = 1) => {
    const size = 42, layers = 5, gap = 20;
    ctx.lineWidth = 1 * dprComp;
    for (let i = layers - 1; i >= 0; i--) {
      const yOff = i * gap - (layers * gap) / 2 + Math.sin(t + i * 0.4) * 4;
      const p1 = iso(-size, yOff, -size), p2 = iso(size, yOff, -size);
      const p3 = iso(size, yOff, size), p4 = iso(-size, yOff, size);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y); ctx.lineTo(p4.x, p4.y); ctx.closePath();
      ctx.fillStyle = BG; ctx.fill();
      ctx.strokeStyle = i === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.12)";
      ctx.stroke();
      if (i === 0) {
        const center = iso(0, yOff, 0);
        ctx.save(); ctx.translate(center.x, center.y); ctx.scale(1, 0.5);
        const sq = size * 0.55;
        ctx.beginPath(); ctx.rect(-sq, -sq, sq * 2, sq * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.stroke(); ctx.clip();
        ctx.lineWidth = 1 * dprComp;
        for (let j = -sq; j < sq; j += 4) {
          ctx.beginPath(); ctx.moveTo(-sq, j); ctx.lineTo(sq, j);
          ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.stroke();
        }
        ctx.restore();
      }
      if (i < layers - 1) {
        const nextY = (i+1)*gap-(layers*gap)/2+Math.sin(t+(i+1)*0.4)*4;
        const p1n = iso(-size, nextY, -size), p3n = iso(size, nextY, size);
        ctx.beginPath(); ctx.setLineDash([2, 2]);
        ctx.moveTo(p1.x, p1.y); ctx.lineTo(p1n.x, p1n.y);
        ctx.moveTo(p3.x, p3.y); ctx.lineTo(p3n.x, p3n.y);
        ctx.strokeStyle = "rgba(255,255,255,0.07)"; ctx.stroke(); ctx.setLineDash([]);
      }
    }
  }, []);
  useCanvasLoop(ref, draw);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }} />;
}

/* ─── NodesCanvas: floating isometric cubes (white) ─── */
export function NodesCanvas({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawCube = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, z: number, s: number, color: string, dprComp: number = 1) => {
    const pts = [
      iso(x-s,y-s,z-s), iso(x+s,y-s,z-s), iso(x+s,y-s,z+s), iso(x-s,y-s,z+s),
      iso(x-s,y+s,z-s), iso(x+s,y+s,z-s), iso(x+s,y+s,z+s), iso(x-s,y+s,z+s),
    ];
    ctx.strokeStyle = color; ctx.lineWidth = 1 * dprComp;
    ctx.beginPath();
    ctx.moveTo(pts[0].x,pts[0].y); ctx.lineTo(pts[1].x,pts[1].y);
    ctx.lineTo(pts[2].x,pts[2].y); ctx.lineTo(pts[3].x,pts[3].y); ctx.closePath();
    ctx.moveTo(pts[4].x,pts[4].y); ctx.lineTo(pts[5].x,pts[5].y);
    ctx.lineTo(pts[6].x,pts[6].y); ctx.lineTo(pts[7].x,pts[7].y); ctx.closePath();
    [0,1,2,3].forEach(i => { ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[i+4].x,pts[i+4].y); });
    ctx.stroke();
  }, []);
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, _w: number, _h: number, dprComp: number = 1) => {
    const s = 22, f = Math.sin(t) * 4;
    drawCube(ctx, -35, -f, -35, s, "rgba(255,255,255,0.12)", dprComp);
    drawCube(ctx, 35, f, -35, s, "rgba(255,255,255,0.12)", dprComp);
    drawCube(ctx, -35, f, 35, s, "rgba(255,255,255,0.12)", dprComp);
    drawCube(ctx, 35, -f, 35, s, "rgba(255,255,255,0.12)", dprComp);
    drawCube(ctx, 0, Math.cos(t)*6-15, 0, s*0.9, "rgba(255,255,255,0.65)", dprComp);
  }, [drawCube]);
  useCanvasLoop(ref, draw);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }} />;
}

/* ─── FlowCanvas: isometric terrain mesh (white) ─── */
export function FlowCanvas({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, _w: number, _h: number, dprComp: number = 1) => {
    const size = 65, segs = 22, step = (size * 2) / segs;
    ctx.lineWidth = 1 * dprComp;
    const getH = (x: number, z: number) => {
      const dist = Math.sqrt(x*x+z*z);
      const peak = Math.max(0, 45-dist*1.1);
      const wave = Math.sin(x*0.2+t*1.5)*Math.cos(z*0.2+t*1.5)*5;
      return -peak-wave+15;
    };
    for (let z = -size; z < size; z += step) {
      for (let x = -size; x < size; x += step) {
        const y1=getH(x,z),y2=getH(x+step,z),y3=getH(x+step,z+step),y4=getH(x,z+step);
        const p1=iso(x,y1,z),p2=iso(x+step,y2,z),p3=iso(x+step,y3,z+step),p4=iso(x,y4,z+step);
        ctx.beginPath();
        ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
        ctx.lineTo(p3.x,p3.y); ctx.lineTo(p4.x,p4.y); ctx.closePath();
        ctx.fillStyle = BG; ctx.fill();
        const hr = Math.max(0, (-y1)/30), al = 0.05+hr*0.4;
        ctx.strokeStyle = hr>0.6 ? `rgba(255,255,255,${al+0.3})` : `rgba(255,255,255,${al+0.05})`;
        ctx.stroke();
      }
    }
  }, []);
  useCanvasLoop(ref, draw);
  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", ...style }} />;
}

/* ─── WireframeCanvas: rotating 3D wireframe shapes ─── */
export function WireframeCanvas({ shape = "cube", color = "255,255,255", style }: {
  shape?: "cube" | "cylinders" | "sphere"; color?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, cx = 0, cy = 0, angleX = 0, angleY = 0, raf = 0, dprComp = 1;
    const pts: { x: number; y: number; z: number }[] = [];
    const edges: [number, number][] = [];

    if (shape === "cube") {
      const s = 52;
      pts.push({x:s,y:s,z:s},{x:-s,y:-s,z:s},{x:-s,y:s,z:-s},{x:s,y:-s,z:-s});
      pts.push({x:-s,y:-s,z:-s},{x:s,y:s,z:-s},{x:s,y:-s,z:s},{x:-s,y:s,z:s});
      edges.push([0,1],[0,2],[0,3],[1,2],[1,3],[2,3],[4,5],[4,6],[4,7],[5,6],[5,7],[6,7]);
    } else if (shape === "cylinders") {
      const r = 50, segs = 20;
      for (let i = 0; i < segs; i++) {
        const theta = (i/segs)*Math.PI*2;
        pts.push({x:Math.cos(theta)*r,y:Math.sin(theta)*r,z:-24});
        pts.push({x:Math.cos(theta)*r,y:Math.sin(theta)*r,z:24});
        const next = (i+1)%segs;
        edges.push([i*2,next*2],[i*2+1,next*2+1],[i*2,i*2+1]);
      }
      const off = pts.length;
      for (let i = 0; i < segs; i++) {
        const theta = (i/segs)*Math.PI*2;
        pts.push({x:Math.cos(theta)*r,y:-24,z:Math.sin(theta)*r});
        pts.push({x:Math.cos(theta)*r,y:24,z:Math.sin(theta)*r});
        const next=(i+1)%segs;
        edges.push([off+i*2,off+next*2],[off+i*2+1,off+next*2+1],[off+i*2,off+i*2+1]);
      }
    } else {
      const tau=(1+Math.sqrt(5))/2, s=40;
      const verts=[[-1,tau,0],[1,tau,0],[-1,-tau,0],[1,-tau,0],[0,-1,tau],[0,1,tau],[0,-1,-tau],[0,1,-tau],[tau,0,-1],[tau,0,1],[-tau,0,-1],[-tau,0,1]];
      verts.forEach(v=>pts.push({x:v[0]*s,y:v[1]*s,z:v[2]*s}));
      for (let i=0;i<pts.length;i++)
        for (let j=i+1;j<pts.length;j++)
          if (Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y,pts[i].z-pts[j].z)<s*2.1) edges.push([i,j]);
      const off=pts.length;
      verts.forEach(v=>pts.push({x:v[0]*s*0.5,y:v[1]*s*0.5,z:v[2]*s*0.5}));
      for (let i=0;i<12;i++){
        for (let j=i+1;j<12;j++)
          if (Math.hypot(pts[off+i].x-pts[off+j].x,pts[off+i].y-pts[off+j].y,pts[off+i].z-pts[off+j].z)<s*1.1) edges.push([off+i,off+j]);
        edges.push([i,off+i]);
      }
    }

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() ?? canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      dprComp = dprCompFor(dpr);
      w = Math.max(rect.width, 1); h = Math.max(rect.height, 1);
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      cx = w/2; cy = h/2;
    };
    window.addEventListener("resize", resize);
    resize();

    const project = (p:{x:number;y:number;z:number}) => {
      const rx=p.x*Math.cos(angleY)-p.z*Math.sin(angleY);
      const rz=p.z*Math.cos(angleY)+p.x*Math.sin(angleY);
      const ry=p.y*Math.cos(angleX)-rz*Math.sin(angleX);
      const rzf=rz*Math.cos(angleX)+p.y*Math.sin(angleX);
      const fov=280, sc=fov/(fov+rzf);
      return {x:rx*sc+cx,y:ry*sc+cy,z:rzf};
    };

    const draw = () => {
      ctx.clearRect(0,0,w,h);
      angleY+=0.005; angleX+=0.002;
      const projected=pts.map(p=>project(p));
      ctx.lineWidth=0.7 * dprComp;
      edges.forEach(([i,j])=>{
        const p1=projected[i],p2=projected[j];
        const alpha=Math.max(0.04,(1-(p1.z+p2.z)/2/160)*0.45);
        ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y);
        ctx.strokeStyle=`rgba(${color},${alpha})`; ctx.stroke();
      });
      projected.forEach(p=>{
        const alpha=Math.max(0.08,(1-p.z/160)*0.9);
        if (alpha>0.35){ctx.fillStyle=`rgba(${color},${alpha})`;ctx.fillRect(p.x-1,p.y-1,2,2);}
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);};
  }, [shape, color]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",...style}} />;
}

/* ─── ThreeOrbit: WebGL orbit rings ─── */
export function ThreeOrbit({ style }: { style?: React.CSSProperties }) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0, cancelled = false;
    let renderer: import("three").WebGLRenderer | undefined;
    (async () => {
      const THREE = await import("three");
      if (cancelled || !mountRef.current) return;
      const el = mountRef.current;
      const w = el.clientWidth || 400, h = el.clientHeight || 400;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w/h, 0.1, 1000);
      camera.position.set(0, 80, 200); camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);
      const mats = [
        new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.5}),
        new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.2}),
        new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:0.1}),
      ];
      const rings = [60,80,100].map((r,i)=>{
        const geo=new THREE.BufferGeometry().setFromPoints(
          Array.from({length:65},(_,j)=>{const a=(j/64)*Math.PI*2;return new THREE.Vector3(Math.cos(a)*r,0,Math.sin(a)*r);})
        );
        const mesh=new THREE.Line(geo,mats[i]);
        if(i===1) mesh.rotation.x=Math.PI/4;
        if(i===2) mesh.rotation.z=Math.PI/5;
        scene.add(mesh); return mesh;
      });
      const pts: import("three").Vector3[]=[];
      for(let i=0;i<180;i++){
        const phi=Math.acos(2*Math.random()-1),theta=Math.random()*Math.PI*2;
        pts.push(new THREE.Vector3(Math.sin(phi)*Math.cos(theta)*55,Math.sin(phi)*Math.sin(theta)*55,Math.cos(phi)*55));
      }
      const dotGeo=new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Points(dotGeo,new THREE.PointsMaterial({color:0xffffff,size:1.2,transparent:true,opacity:0.3})));
      let t=0;
      const loop=()=>{
        if(cancelled||!renderer) return;
        t+=0.008;
        rings[0].rotation.y=t; rings[1].rotation.y=-t*0.7;
        rings[2].rotation.y=t*0.4; rings[2].rotation.x=Math.PI/5+Math.sin(t*0.3)*0.2;
        renderer.render(scene,camera);
        raf=requestAnimationFrame(loop);
      };
      loop();
    })();
    return ()=>{
      cancelled=true;
      cancelAnimationFrame(raf);
      if(renderer){renderer.dispose();if(renderer.domElement.parentNode)renderer.domElement.remove();}
    };
  }, []);
  return <div ref={mountRef} style={{position:"absolute",inset:0,width:"100%",height:"100%",...style}} />;
}

/* ─── WrestlingTerminal: animated typewriter terminal ─── */
const TERMINAL_LINES = [
  { text: "$ wrestlytics detect --input match_2024.mp4", color: "#d0d6e0" },
  { text: "> Loading detection model...", color: "#8a8f98" },
  { text: "> Model ready  [38ms]", color: "#ffffff" },
  { text: "> Scanning 1,847 frames", color: "#8a8f98" },
  { text: "> frame  0847/1847  wrestlers: 2  status: tracking", color: "#8a8f98" },
  { text: "> frame  0848/1847  occlusion detected — resolving", color: "#d0d6e0" },
  { text: "> frame  0849/1847  wrestlers: 2  occlusion: resolved ✓", color: "#ffffff" },
  { text: "> frame  1847/1847  complete", color: "#8a8f98" },
  { text: "> Athletes tracked: 2 across 1,847 frames", color: "#ffffff" },
  { text: "> Occlusion events: 23  —  resolved: 23/23", color: "#ffffff" },
  { text: "> Analysis complete.", color: "#d0d6e0" },
];

export function WrestlingTerminal({ triggerOnScroll = true, style }: { triggerOnScroll?: boolean; style?: React.CSSProperties }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [started, setStarted] = useState(!triggerOnScroll);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerOnScroll) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnScroll]);

  useEffect(() => {
    if (!started) return;
    setVisibleLines(0);
    const timers = TERMINAL_LINES.map((_, i) =>
      setTimeout(() => setVisibleLines(i + 1), i * 320 + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, [started]);

  return (
    <div ref={ref} style={{
      background: "#0a0a0b", border: "1px solid #23252a",
      borderRadius: 4, padding: 24, fontFamily: MONO,
      ...style,
    }}>
      {/* window chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #23252a" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#303236" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#303236" }} />
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#303236" }} />
        <span style={{ fontFamily: MONO, fontSize: 11, color: "#8a8f98", marginLeft: 8, letterSpacing: "0.06em" }}>wrestlytics — detection</span>
      </div>
      {/* lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ fontSize: 13, lineHeight: 1.65, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: line.color }}>{line.text}</span>
            {i === visibleLines - 1 && visibleLines < TERMINAL_LINES.length && (
              <span style={{ color: "#ffffff", animation: "cursor-blink 0.8s step-end infinite" }}>█</span>
            )}
          </div>
        ))}
        {visibleLines >= TERMINAL_LINES.length && (
          <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
            <span style={{ color: "#8a8f98" }}>&gt; </span>
            <span style={{ color: "#ffffff", animation: "cursor-blink 0.8s step-end infinite" }}>█</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── useScrollReveal ─── */
export function useScrollReveal(containerRef?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef?.current ?? document;
    const targets = (root instanceof Element ? root : document).querySelectorAll("[data-reveal],[data-stagger]");
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); } }); },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [containerRef]);
}

/* ─── Logo ─── */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="7" cy="5" r="2.5" fill="#ffffff" />
      <circle cx="21" cy="5" r="2.5" fill="#ffffff" />
      <line x1="7" y1="5" x2="14" y2="13" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="21" y1="5" x2="14" y2="13" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="14" cy="13" r="2.5" fill="#d0d6e0" />
      <line x1="10" y1="13" x2="7" y2="22" stroke="#d0d6e0" strokeWidth="1.5" />
      <line x1="18" y1="13" x2="21" y2="22" stroke="#d0d6e0" strokeWidth="1.5" />
      <circle cx="7" cy="22" r="2" fill="#8a8f98" />
      <circle cx="21" cy="22" r="2" fill="#8a8f98" />
    </svg>
  );
}