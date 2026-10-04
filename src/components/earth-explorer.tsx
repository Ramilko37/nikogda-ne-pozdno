"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from "react";
import { Pause, Play, X } from "lucide-react";
import { programs } from "@/lib/content";
import { projectPoint, starPoint } from "@/lib/earth-model";
const Scene = dynamic(() => import("./earth-scene"), { ssr: false, loading: () => null });
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}
export function EarthExplorer() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const [paused, setPaused] = useState(false), [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(true), [inView, setInView] = useState(false);
  const [enabled, setEnabled] = useState(false), [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false), [lowPower, setLowPower] = useState(false);
  const [started, setStarted] = useState(false), [capture, setCapture] = useState(false);
  const root = useRef<HTMLDivElement>(null), stage = useRef<HTMLDivElement>(null);
  const labels = useRef<Record<string, HTMLDivElement | null>>({});
  const lastTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update(); media.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      if (entry.isIntersecting) setStarted(true);
    }, { threshold: .01 });
    // Do not spend GPU frames while only hero copy or details are visible.
    if (stage.current) observer.observe(stage.current);
    const query = new URLSearchParams(location.search);
    setCapture(query.has("earth-capture"));
    setLowPower(matchMedia("(max-width: 760px)").matches || navigator.hardwareConcurrency <= 4);
    if (!query.has("static")) {
      const canvas = document.createElement("canvas");
      let context: WebGL2RenderingContext | null = null;
      try { context = canvas.getContext("webgl2"); } catch { /* HTML controls remain available. */ }
      setEnabled(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    }
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  // The initial and no-WebGL composition uses the very same camera/anchors.
  useEffect(() => {
    if (!stage.current || (ready && !failed)) return;
    const project = () => {
      const { width, height } = stage.current!.getBoundingClientRect();
      if (!height) return;
      programs.forEach((p) => {
        const [x, y] = projectPoint(starPoint(p.id), width / height);
        labels.current[p.id]?.style.setProperty("--star-x", `${x}%`);
        labels.current[p.id]?.style.setProperty("--star-y", `${y}%`);
      });
    };
    const resize = new ResizeObserver(project); resize.observe(stage.current); project();
    return () => resize.disconnect();
  }, [ready, failed]);
  const close = useCallback(() => {
    setSelected(null); setHovered(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!selected) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); close(); } };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [selected, close]);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => { setFailed(true); setReady(false); }, []);
  const moving = enabled && !failed && !capture && !paused && !reduced && visible && inView && !hovered && !focused && !selected;
  const choose = (id: string, el: HTMLElement) => { lastTrigger.current = el; setSelected(id); setHovered(null); };
  const interaction = (id: string) => ({
    onMouseEnter: () => setHovered(id), onMouseLeave: () => setHovered(null),
    onFocus: () => setFocused(id), onBlur: () => setFocused(null),
  });
  return (
    <div ref={root} className="earth-explorer" data-moving={moving} data-renderer={ready && !failed ? "webgl" : "static"} data-failed={failed} data-selected={selected || undefined}>
      <div ref={stage} className="earth-stage" aria-label="Земля и четыре программы фонда">
        <div className="earth-halo" aria-hidden="true" />
        <div className="earth-visual" aria-hidden="true">
          <img className="earth-fallback" src="/assets/earth-static.webp" srcSet="/assets/earth-static.webp 1200w, /assets/earth-static-2400.webp 2400w" sizes="(max-width: 760px) 92vw, (max-width: 1100px) 83vw, 74vw" alt="" width="2400" height="2400" fetchPriority="high" style={{ opacity: ready && !failed ? 0 : 1 }} />
          {enabled && started && !failed && <div className="earth-canvas" style={{ opacity: ready ? 1 : 0 }}>
            <SceneBoundary onError={onFailure}>
              <Scene onReady={onReady} onFailure={onFailure} lowPower={lowPower} moving={moving} selected={selected} labels={labels} capture={capture} />
            </SceneBoundary>
          </div>}
        </div>
        {programs.map((p, i) => {
          const [x,y] = projectPoint(starPoint(p.id));
          return <div className="orb-position" data-program={p.id} key={p.id} ref={(el) => { labels.current[p.id] = el; }} style={{ "--star-x": `${x}%`, "--star-y": `${y}%` } as CSSProperties}>
            <button className={`orb-button ${selected === p.id ? "is-selected" : ""}`} aria-label={p.name} aria-expanded={selected === p.id} aria-controls="program-detail" {...interaction(p.id)} onClick={(e) => choose(p.id, e.currentTarget)}>
              <span className="star-static" aria-hidden="true">✦</span>
              <span className="star-number" aria-hidden="true">{i+1}</span>
              <span className="orb-label">{p.short}</span>
            </button>
          </div>;
        })}
      </div>
      <div className="earth-caption">
        <p>Четыре программы — четыре возможности помочь</p>
        <button className="motion-control" onClick={() => setPaused((p) => !p)} aria-pressed={paused || reduced} disabled={reduced || !enabled || failed}>
          {paused || reduced || !enabled || failed ? <Play size={14} /> : <Pause size={14} />}
          <span>{reduced || !enabled || failed ? "Без анимации" : paused ? "Включить анимацию" : "Остановить анимацию"}</span>
        </button>
      </div>
      <div className="program-selector" role="group" aria-label="Выберите программу">
        {programs.map((p, i) => <button key={p.id} aria-pressed={selected === p.id} aria-controls="program-detail" {...interaction(p.id)} onClick={(e) => choose(p.id, e.currentTarget)}><span aria-hidden="true">0{i+1}</span>{p.short}</button>)}
      </div>
      <div className="program-detail-slot" id="program-detail" aria-live="polite" aria-atomic="true">
        <div className="program-detail-intro" aria-hidden={!!selected} style={{ visibility: selected ? "hidden" : "visible" }}>
          <span className="detail-spark" aria-hidden="true">✦</span>
          <div><p>Большие перемены начинаются<br />с небольшого участия.</p><span>Выберите огонёк и познакомьтесь с программой.</span></div>
        </div>
        {programs.map((p) => <div key={p.id} className="selected-program" id={selected === p.id ? "selected-program" : undefined} aria-hidden={selected !== p.id} inert={selected !== p.id} style={{ visibility: selected === p.id ? "visible" : "hidden" }}>
          <button className="close-card" aria-label="Закрыть карточку программы" onClick={close}><X size={18} /></button>
          <h3>{p.name}</h3><p>{p.summary}</p><Link href={`/programs/${p.slug}`} className="text-link">О программе</Link>
        </div>)}
      </div>
      <p className="geography-caption">Огоньки обозначают программы, а не места оказания помощи. <a href="/assets/earth/CREDITS.txt">Источники изображения</a></p>
    </div>
  );
}
