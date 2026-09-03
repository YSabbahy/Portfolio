import { useEffect } from "react";
import { prefersReducedMotion } from "./mediaFlags";

const FRAME_INTERVAL = 25;
const LINE_ALPHA_BUCKETS = 8;

/**
 * Drives the animated particle-field canvas behind the hero section,
 * including accent-color theming, pointer repulsion, and connecting lines
 * between nearby particles. Ported 1:1 from the original vanilla script.
 */
export function useHeroParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let particles = [];
    const lineBucketPaths = new Array(LINE_ALPHA_BUCKETS).fill(null);
    let rafId = null;
    let docHeight = 0;
    const mouse = { x: null, y: null };
    let accentRGB = "239, 68, 68";
    let alphas = { dot: 0.55, line: 0.3 };

    const refreshThemeCache = () => {
      const styles = getComputedStyle(document.documentElement);
      accentRGB = styles.getPropertyValue("--red-rgb").trim() || "239, 68, 68";
      alphas = {
        dot: parseFloat(styles.getPropertyValue("--particle-dot-alpha")) || 0.55,
        line: parseFloat(styles.getPropertyValue("--particle-line-alpha")) || 0.3,
      };
    };

    const sizeCanvas = () => {
      docHeight = document.documentElement.scrollHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const isMobile = window.innerWidth < 768;
      const divisor = prefersReducedMotion ? 16000 : isMobile ? 26000 : 11000;
      const cap = isMobile ? 160 : 260;
      const count = Math.min(cap, Math.floor((window.innerWidth * docHeight) / divisor));

      particles = Array.from({ length: count }, () => {
        const depth = 0.55 + 0.9 * Math.random();
        return {
          x: Math.random() * window.innerWidth,
          y: Math.random() * docHeight,
          vx: 0.22 * (Math.random() - 0.5) * depth,
          vy: 0.22 * (Math.random() - 0.5) * depth,
          depth,
        };
      });
    };

    const refreshDocHeight = () => {
      const nextHeight = document.documentElement.scrollHeight;
      if (nextHeight > docHeight) sizeCanvas();
    };

    refreshThemeCache();
    const themeObserver = new MutationObserver(refreshThemeCache);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    let lastFrame = 0;

    const step = (now) => {
      if (now - lastFrame < FRAME_INTERVAL) {
        if (!prefersReducedMotion && !document.hidden) rafId = requestAnimationFrame(step);
        return;
      }
      lastFrame = now;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((p) => {
        if (prefersReducedMotion) return;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > docHeight) p.vy *= -1;
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - scrollTop - mouse.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 110) {
            const push = ((110 - dist) / 110) * 1.1;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push;
          }
        }
      });

      const visible = particles
        .filter((p) => {
          const y = p.y - scrollTop;
          return y > -150 && y < window.innerHeight + 150;
        })
        .sort((a, b) => a.x - b.x);

      const lineBuckets = lineBucketPaths;
      for (let b = 0; b < LINE_ALPHA_BUCKETS; b++) lineBuckets[b] = null;

      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const dx = visible[j].x - visible[i].x;
          if (dx > 170) break;
          const dy = visible[i].y - visible[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 170) {
            const depth = (visible[i].depth + visible[j].depth) / 2;
            const strength = ((1 - dist / 170) * alphas.line) * depth;
            const bucket = Math.max(
              0,
              Math.min(LINE_ALPHA_BUCKETS - 1, Math.round((strength / alphas.line) * (LINE_ALPHA_BUCKETS - 1)))
            );
            let path = lineBuckets[bucket];
            if (!path) {
              path = new Path2D();
              lineBuckets[bucket] = path;
            }
            path.moveTo(visible[i].x, visible[i].y - scrollTop);
            path.lineTo(visible[j].x, visible[j].y - scrollTop);
          }
        }
      }

      ctx.lineWidth = 1;
      for (let b = 0; b < LINE_ALPHA_BUCKETS; b++) {
        const path = lineBuckets[b];
        if (!path) continue;
        const strength = (alphas.line * (b + 1)) / LINE_ALPHA_BUCKETS;
        ctx.strokeStyle = `rgba(${accentRGB}, ${strength.toFixed(3)})`;
        ctx.stroke(path);
      }

      visible.forEach((p) => {
        ctx.fillStyle = `rgba(${accentRGB}, ${(alphas.dot * p.depth).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y - scrollTop, 1.5 * p.depth, 0, 2 * Math.PI);
        ctx.fill();
      });

      if (!prefersReducedMotion && !document.hidden) rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (!rafId || prefersReducedMotion) step(performance.now());
    };
    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onPointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onMouseOut = (e) => {
      if (!e.relatedTarget) {
        mouse.x = null;
        mouse.y = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onMouseOut);

    sizeCanvas();
    canvas.classList.add("is-active");
    start();

    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeCanvas, 150);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("load", refreshDocHeight);

    let resizeObserver = null;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(refreshDocHeight);
      resizeObserver.observe(document.body);
    }

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      themeObserver.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", refreshDocHeight);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, [canvasRef]);
}
