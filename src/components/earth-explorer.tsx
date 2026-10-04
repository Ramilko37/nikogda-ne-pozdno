"use client";
import dynamic from "next/dynamic";
import {
  Component,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { Pause, Play } from "lucide-react";
import { programs } from "@/lib/content";
import { ProgramCard } from "./ui";
const Scene = dynamic(() => import("./earth-scene"), {
  ssr: false,
  loading: () => null,
});
class SceneBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function EarthExplorer() {
  const [selected, setSelected] = useState<string | null>(null),
    [hovered, setHovered] = useState<string | null>(null),
    [paused, setPaused] = useState(false),
    [reduced, setReduced] = useState(true),
    [visible, setVisible] = useState(true),
    [inView, setInView] = useState(false),
    [enabled, setEnabled] = useState(false),
    [failed, setFailed] = useState(false),
    [ready, setReady] = useState(false),
    [lowPower, setLowPower] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (root.current) observer.observe(root.current);
    const low = innerWidth < 640 || navigator.hardwareConcurrency <= 4;
    setLowPower(low);
    const canvas = document.createElement("canvas");
    let supported = false;
    try {
      supported = !!canvas.getContext("webgl2");
    } catch {}
    setEnabled(
      supported && !new URLSearchParams(location.search).has("static"),
    );
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);
  const close = useCallback(() => {
    setSelected(null);
    lastTrigger.current?.focus();
  }, []);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHovered(null);
        if (selected) close();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [selected, close]);
  const onReady = useCallback(() => setReady(true), []),
    onFailure = useCallback(() => {
      setFailed(true);
      setReady(false);
    }, []);
  const current = programs.find((p) => p.id === selected);
  const moving =
    !paused && !reduced && visible && inView && !hovered && !selected;
  const choose = (id: string, el: HTMLElement) => {
    lastTrigger.current = el;
    setSelected(id);
    setHovered(null);
  };
  return (
    <div
      ref={root}
      className="earth-explorer"
      data-moving={moving}
      data-renderer={ready && !failed ? "webgl" : "static"}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null);
      }}
    >
      <div className="earth-stage" aria-label="Земля и четыре программы фонда">
        <div className="earth-halo" />
        <div className="earth-visual">
          <img
            className="earth-fallback"
            src="/assets/earth-static.webp"
            alt="Земля со стороны Евразии, Россия в центре видимого полушария"
            width="800"
            height="800"
            style={{ opacity: ready && !failed ? 0 : 1 }}
          />
          {enabled && inView && !failed && (
            <div className="earth-canvas" aria-hidden="true">
              <SceneBoundary onError={onFailure}>
                <Scene
                  onReady={onReady}
                  onFailure={onFailure}
                  lowPower={lowPower}
                />
              </SceneBoundary>
            </div>
          )}
        </div>
        {programs.map((p, i) => (
          <div
            className="orb-position"
            key={p.id}
            style={
              {
                left: p.position[0] + "%",
                top: p.position[1] + "%",
                "--delay": `${-i * 1.9}s`,
              } as CSSProperties
            }
          >
            <button
              className={
                "orb-button " + (selected === p.id ? "is-selected" : "")
              }
              aria-label={p.name}
              aria-expanded={selected === p.id}
              aria-controls="selected-program"
              aria-describedby={
                hovered === p.id ? `tooltip-${p.id}` : undefined
              }
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p.id)}
              onClick={(e) => choose(p.id, e.currentTarget)}
            >
              <span className="orb-light" />
              <span className="orb-label">{p.short}</span>
            </button>
            {hovered === p.id && !selected && (
              <p className="orb-tooltip" role="tooltip" id={`tooltip-${p.id}`}>
                {p.summary}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="earth-caption">
        <p>Каждый огонёк — одна из наших программ</p>
        <button
          className="motion-control"
          onClick={() => setPaused(!paused)}
          aria-pressed={paused || reduced}
          disabled={reduced}
        >
          {paused || reduced ? <Play size={14} /> : <Pause size={14} />}
          <span>
            {reduced
              ? "Без анимации"
              : paused
                ? "Включить анимацию"
                : "Остановить анимацию"}
          </span>
        </button>
      </div>
      <p className="geography-caption">
        Огоньки обозначают программы, а не места оказания помощи.
      </p>
      <div className="program-selector" aria-label="Выберите программу">
        {programs.map((p) => (
          <button
            key={p.id}
            aria-pressed={selected === p.id}
            onClick={(e) => choose(p.id, e.currentTarget)}
          >
            {p.short}
          </button>
        ))}
      </div>
      {current && <ProgramCard program={current} onClose={close} />}
    </div>
  );
}
