"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/** screen = world × k + (x, y) */
export interface Transform {
  k: number;
  x: number;
  y: number;
}

interface Options {
  svg: RefObject<SVGSVGElement | null>;
  /** Groups drawn in world coordinates (marks and lines). */
  world: RefObject<SVGGElement | null>;
  /** Group for the time axis: scaled horizontally only. */
  axis: RefObject<SVGGElement | null>;
  minK: number;
  maxK: number;
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Pan and zoom for the map: wheel and trackpad pinch, mouse drag, one-finger
 * drag and two-finger pinch on touch, and programmatic animation for the
 * buttons and keyboard. The transform is written to the DOM directly while
 * a gesture runs (no re-render per frame); React state follows a moment
 * later, which is what decides labels and detail.
 */
export function useViewport({ svg, world, axis, minK, maxK }: Options) {
  const t = useRef<Transform>({ k: 1, x: 0, y: 0 });
  const [view, setView] = useState<Transform>(t.current);
  const [moving, setMoving] = useState(false);
  const settle = useRef<number | undefined>(undefined);
  const throttle = useRef(0);
  const anim = useRef<number | undefined>(undefined);
  const limits = useRef({ minK, maxK });
  limits.current = { minK, maxK };

  const write = useCallback(() => {
    const { k, x, y } = t.current;
    world.current?.setAttribute("transform", `matrix(${k} 0 0 ${k} ${x} ${y})`);
    axis.current?.setAttribute("transform", `matrix(${k} 0 0 1 ${x} 0)`);
    svg.current?.style.setProperty("--inv", String(1 / k));
  }, [svg, world, axis]);

  const commit = useCallback(() => {
    write();
    const now = performance.now();
    // Detail follows the gesture at most every 140 ms, and once more when it stops.
    if (now - throttle.current > 140) {
      throttle.current = now;
      setView({ ...t.current });
    }
    setMoving(true);
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      setView({ ...t.current });
      setMoving(false);
    }, 90);
  }, [write]);

  const set = useCallback(
    (next: Transform) => {
      const { minK: lo, maxK: hi } = limits.current;
      t.current = { ...next, k: Math.min(hi, Math.max(lo, next.k)) };
      commit();
    },
    [commit],
  );

  const stop = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = undefined;
  };

  const animateTo = useCallback(
    (to: Transform, ms = 420) => {
      stop();
      const from = { ...t.current };
      const { minK: lo, maxK: hi } = limits.current;
      const target = { ...to, k: Math.min(hi, Math.max(lo, to.k)) };
      if (ms <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return set(target);
      const start = performance.now();
      const step = (now: number) => {
        const p = ease(Math.min(1, (now - start) / ms));
        // Interpolate zoom geometrically so scale changes feel even.
        const k = from.k * Math.pow(target.k / from.k, p);
        set({ k, x: from.x + (target.x - from.x) * p, y: from.y + (target.y - from.y) * p });
        if (p < 1) anim.current = requestAnimationFrame(step);
        else anim.current = undefined;
      };
      anim.current = requestAnimationFrame(step);
    },
    [set],
  );

  /** Zoom by a factor about a screen point (the centre by default). */
  const zoomBy = useCallback(
    (factor: number, at?: { x: number; y: number }, animate = false) => {
      const el = svg.current;
      if (!el) return;
      const { k, x, y } = t.current;
      const { minK: lo, maxK: hi } = limits.current;
      const nk = Math.min(hi, Math.max(lo, k * factor));
      const px = at?.x ?? el.clientWidth / 2;
      const py = at?.y ?? el.clientHeight / 2;
      const next = { k: nk, x: px - ((px - x) / k) * nk, y: py - ((py - y) / k) * nk };
      if (animate) animateTo(next, 260);
      else set(next);
    },
    [svg, set, animateTo],
  );

  const panBy = useCallback((dx: number, dy: number, animate = false) => {
    const next = { ...t.current, x: t.current.x + dx, y: t.current.y + dy };
    if (animate) animateTo(next, 200);
    else set(next);
  }, [set, animateTo]);

  // Gestures. Wheel listeners must be non-passive to keep the page from scrolling under the map.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { d: number; k: number; cx: number; cy: number; x: number; y: number } | null = null;
    let last: { x: number; y: number } | null = null;
    const local = (e: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      stop();
      const p = local(e);
      const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
      const dx = e.deltaX * scale;
      const dy = e.deltaY * scale;
      // Trackpads: pinch arrives as ctrl+wheel; a two-finger sideways stroke pans.
      if (!e.ctrlKey && Math.abs(dx) > Math.abs(dy) * 1.2) return panBy(-dx, 0);
      const factor = Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0018));
      zoomBy(factor, p);
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      stop();
      pointers.set(e.pointerId, local(e));
      if (pointers.size === 1) last = local(e);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: t.current.k, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, x: t.current.x, y: t.current.y };
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      const p = local(e);
      pointers.set(e.pointerId, p);
      if (pointers.size >= 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const cx = (a.x + b.x) / 2;
        const cy = (a.y + b.y) / 2;
        const { minK: lo, maxK: hi } = limits.current;
        const k = Math.min(hi, Math.max(lo, (pinch.k * d) / Math.max(1, pinch.d)));
        // Keep the world point under the original pinch centre under the fingers.
        const wx = (pinch.cx - pinch.x) / pinch.k;
        const wy = (pinch.cy - pinch.y) / pinch.k;
        set({ k, x: cx - wx * k, y: cy - wy * k });
        return;
      }
      if (last && (e.buttons & 1 || e.pointerType !== "mouse")) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        if (dx || dy) {
          if (!el.hasPointerCapture(e.pointerId) && Math.hypot(dx, dy) > 3) el.setPointerCapture(e.pointerId);
          if (el.hasPointerCapture(e.pointerId)) {
            panBy(dx, dy);
            last = p;
            el.dataset.dragging = "1";
          }
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 1) last = [...pointers.values()][0];
      if (!pointers.size) {
        last = null;
        // Let the click that ends a drag see the flag, then clear it.
        window.setTimeout(() => delete el.dataset.dragging, 0);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [svg, zoomBy, panBy, set]);

  useEffect(() => () => {
    stop();
    window.clearTimeout(settle.current);
  }, []);

  return { view, moving, current: t, set, animateTo, zoomBy, panBy, write };
}
