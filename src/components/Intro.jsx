import { useEffect, useRef, useState } from "react";

const CHARS = " .:-=+*#%@";
const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function AsciiImage({ src, cols = 80, fontSize = 11 }) {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      if (!active) return;

      const rows = Math.floor(cols * (img.height / img.width) * 0.45);
      const canvas = document.createElement("canvas");
      canvas.width = cols;
      canvas.height = rows;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, cols, rows);

      const { data } = ctx.getImageData(0, 0, cols, rows);
      let target = "";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const brightness =
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          target += CHARS[Math.floor(brightness * (CHARS.length - 1))];
        }
        target += "\n";
      }

      // shuffle non-newline indices for random resolution order
      const indices = target
        .split("")
        .map((c, i) => (c !== "\n" ? i : null))
        .filter((i) => i !== null);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      // start with all random chars
      setDisplayed(
        target
          .split("")
          .map((c) =>
            c === "\n"
              ? "\n"
              : SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ],
          )
          .join(""),
      );

      const charsPerTick = Math.ceil(indices.length / (2000 / 30));
      let resolved = 0;

      intervalRef.current = setInterval(() => {
        resolved = Math.min(resolved + charsPerTick, indices.length);
        const chars = target.split("");
        for (let i = 0; i < resolved; i++)
          chars[indices[i]] = target[indices[i]];
        for (let i = resolved; i < indices.length; i++)
          chars[indices[i]] =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        setDisplayed(chars.join(""));
        if (resolved >= indices.length) clearInterval(intervalRef.current);
      }, 30);
    };

    return () => {
      active = false;
      clearInterval(intervalRef.current);
    };
  }, [src, cols]);

  return (
    <pre
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        fontFamily: "monospace",
        color: "#fb923c",
      }}
    >
      {displayed}
    </pre>
  );
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
    <div className="flex flex-row items-center justify-center gap-12 min-h-screen px-12">
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
