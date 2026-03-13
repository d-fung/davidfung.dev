import { useEffect, useRef, useState } from "react";

const CHARS = " .:-=+*#%@";
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const ORANGE = [251, 146, 60];
const WHITE  = [255, 255, 255];
const TRAIL_LENGTH  = 6;           // rows of glowing trail behind the drop head
const FALL_SPEED_MIN = 14;         // rows per second (slowest)
const FALL_SPEED_MAX = 35;         // rows per second (fastest)

function lerpColor([r1, g1, b1], [r2, g2, b2], t) {
  return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
}

function makeDrop(col) {
  return { col, y: -TRAIL_LENGTH, speed: FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN), startAt: performance.now(), done: false };
}

function AsciiImage({ src, cols = 80, fontSize = 8 }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const dataRef   = useRef(null);
  const [ready, setReady] = useState(false);

  // Load image → build ASCII lines → init drop state
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (!active) return;

      const rows = Math.floor(cols * (img.height / img.width) * 0.45);
      const offscreen = document.createElement("canvas");
      offscreen.width = cols;
      offscreen.height = rows;
      const ctx = offscreen.getContext("2d");
      ctx.drawImage(img, 0, 0, cols, rows);
      const { data } = ctx.getImageData(0, 0, cols, rows);

      const lines = [];
      for (let y = 0; y < rows; y++) {
        const line = [];
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const b = (0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]) / 255;
          line.push(CHARS[Math.floor(b * (CHARS.length - 1))]);
        }
        lines.push(line);
      }

      // One drop per column, staggered randomly over 1.2 s
      const now = performance.now();
      const drops = Array.from({ length: cols }, (_, col) => ({
        ...makeDrop(col),
        startAt: now + Math.random() * 1200,
      }));

      // settleAt[idx]: -1 = not yet reached, >0 = timestamp when char stops scrambling
      const settleAt = new Float64Array(rows * cols).fill(-1);

      dataRef.current = { lines, rows, drops, settleAt, initialDone: false, nextSpawnAt: Infinity, charW: 0 };
      setReady(true);
    };
    return () => { active = false; };
  }, [src, cols]);

  // Canvas render loop
  useEffect(() => {
    if (!ready || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontSize}px monospace`;
    const charW = ctx.measureText("M").width;
    const d = dataRef.current;
    d.charW = charW;
    canvas.width  = cols * charW;
    canvas.height = d.rows * fontSize;

    let lastTime = performance.now();

    const tick = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap dt to avoid jumps
      lastTime = now;
      const { lines, rows, drops, settleAt } = d;

      // Spawn periodic drops once initial phase is done
      if (d.initialDone && now >= d.nextSpawnAt) {
        drops.push(makeDrop(Math.floor(Math.random() * cols)));
        d.nextSpawnAt = now + 300 + Math.random() * 900;
      }

      // Advance each drop and activate rows it passes through
      for (const drop of drops) {
        if (drop.done || now < drop.startAt) continue;
        const prevY = drop.y;
        drop.y += drop.speed * dt;

        const from = Math.max(0, Math.floor(prevY) + 1);
        const to   = Math.min(rows - 1, Math.floor(drop.y));
        for (let row = from; row <= to; row++) {
          settleAt[row * cols + drop.col] = now + 150 + Math.random() * 350;
        }

        if (drop.y > rows + TRAIL_LENGTH) drop.done = true;
      }

      // Remove finished drops
      for (let i = drops.length - 1; i >= 0; i--) {
        if (drops[i].done) drops.splice(i, 1);
      }

      // Transition to post-initial phase once every char has settled
      if (!d.initialDone && drops.length === 0) {
        if (settleAt.every(t => t > 0 && now >= t)) {
          d.initialDone = true;
          d.nextSpawnAt = now + 800 + Math.random() * 2000;
        }
      }

      // --- Render ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let row = 0; row < rows; row++) {
        const line = lines[row];
        for (let col = 0; col < line.length; col++) {
          const idx = row * cols + col;
          const st  = settleAt[idx];
          if (st < 0) continue; // not yet reached by any drop

          const x = col * charW;
          const y = row * fontSize;

          // Check if a drop's trail is over this char
          let trailT = -1;
          for (const drop of drops) {
            if (drop.col !== col) continue;
            const dist = drop.y - row;
            if (dist >= 0 && dist < TRAIL_LENGTH)
              trailT = Math.max(trailT, 1 - dist / TRAIL_LENGTH);
          }

          let ch, color;
          if (trailT >= 0) {
            // In a glowing trail: scrambled, white → orange
            ch    = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            color = lerpColor(ORANGE, WHITE, trailT);
          } else if (now < st) {
            // Drop just passed, still scrambling before settling
            ch    = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
            color = "#fb923c";
          } else {
            // Settled — show real ASCII char
            ch    = line[col];
            color = "#fb923c";
          }

          ctx.fillStyle = color;
          ctx.fillText(ch, x, y + fontSize);
        }
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [ready, fontSize, cols]);

  const handleClick = (e) => {
    const d = dataRef.current;
    if (!d || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const col = Math.floor(((e.clientX - rect.left) * scaleX) / d.charW);
    if (col >= 0 && col < cols) d.drops.push(makeDrop(col));
  };

  return <canvas ref={canvasRef} onClick={handleClick} style={{ display: "block", cursor: "crosshair" }} />;
}

const FULL_TEXT = "Hi, I'm David.";
const ORANGE_START = 8;  // "Hi, I'm " = 8 chars
const ORANGE_END = 13;   // "David" = 5 chars, ends at index 13
const TYPING_SPEED = 80; // ms per character

function Intro() {
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (typed >= FULL_TEXT.length) return;
    const timeout = setTimeout(() => setTyped((t) => t + 1), TYPING_SPEED);
    return () => clearTimeout(timeout);
  }, [typed]);

  const plainBefore = FULL_TEXT.slice(0, Math.min(typed, ORANGE_START));
  const orangePart = typed > ORANGE_START ? FULL_TEXT.slice(ORANGE_START, Math.min(typed, ORANGE_END)) : "";
  const plainAfter = typed > ORANGE_END ? FULL_TEXT.slice(ORANGE_END, typed) : "";
  const typingDelay = (FULL_TEXT.length * TYPING_SPEED) / 1000;

  return (
    <div id="intro" className="flex flex-row items-center justify-center gap-12 min-h-screen px-12">
      <AsciiImage src="/assets/me.png" cols={80} fontSize={8} />
      <div>
        <h1 className="text-5xl font-semibold text-white">
          {plainBefore}
          {orangePart && <span style={{ color: "#fb923c" }}>{orangePart}</span>}
          {plainAfter}
          <span className="cursor font-normal">|</span>
        </h1>
        <p
          className="mt-4 text-lg text-white/70 max-w-xl fade-slide-in"
          style={{ animationDelay: `${typingDelay + 0.1}s` }}
        >
          I'm a software engineer based in Toronto with a dual background in
          Software Engineering and Medical Sciences. I'm passionate about the
          intersection of technology and health, and I enjoy building scalable,
          high-performance systems that make an impact.
        </p>
        <a
          href="mailto:davidfung998@gmail.com"
          className="inline-block mt-6 px-4 py-2 text-sm rounded transition-colors hover:bg-white/5 fade-slide-in"
          style={{ color: "#fb923c", border: "1px solid rgba(251, 146, 60, 0.4)", animationDelay: `${typingDelay + 0.3}s` }}
        >
          get in touch ↗
        </a>
      </div>
    </div>
  );
}

export default Intro;
