import { useEffect } from "react";
import { prefersReducedMotion } from "./mediaFlags";

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Cheap, ambient flowing-field shader — a handful of sine waves blended into
// a soft, low-contrast gradient. No textures, no heavy math: safe on a static
// GitHub Pages deploy with no build-time shader compilation.
const FRAG = `
precision mediump float;
uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv - 0.5;
  p.x *= uResolution.x / uResolution.y;

  vec2 m = (uMouse - 0.5);
  m.x *= uResolution.x / uResolution.y;

  float d = length(p - m * 0.6);
  float t = uTime * 0.05;

  float wave = sin((p.x + t) * 3.0) * 0.15 + sin((p.y - t * 0.8) * 4.0) * 0.15;
  float field = smoothstep(0.9, 0.0, d + wave);

  vec3 color = uColor * field * 0.35;
  gl_FragColor = vec4(color, field * 0.5);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Renders a subtle, mouse-reactive WebGL gradient field into the given
 * canvas ref. Fails (and does nothing) silently if WebGL is unavailable,
 * and is skipped entirely for prefers-reduced-motion / small screens by the
 * caller. This is decorative background chrome, never required for the
 * site to function.
 */
export function useShaderField(canvasRef, { color = [1, 0.18, 0.18] } = {}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return undefined;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return undefined;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uColor = gl.getUniformLocation(program, "uColor");

    let mouse = [0.5, 0.5];
    let frame = 0;
    let raf;
    let destroyed = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse = [(e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height];
    };

    const render = () => {
      if (destroyed || document.hidden) {
        raf = null;
        return;
      }
      resize();
      frame += 1;
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, frame);
      gl.uniform2f(uMouse, mouse[0], mouse[1]);
      gl.uniform3f(uColor, color[0], color[1], color[2]);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(render);
    };

    // Tab-hidden tabs still tick rAF in most browsers (just throttled), which
    // wastes GPU/battery on a purely decorative effect — stop the loop
    // outright and pick it back up when the tab regains visibility.
    const onVisibilityChange = () => {
      if (!document.hidden && !destroyed && raf === null) {
        raf = requestAnimationFrame(render);
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    raf = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [canvasRef, color]);
}
