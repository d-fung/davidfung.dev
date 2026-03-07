import { useState, useRef, useEffect } from "react";
import { useVisible } from "../hooks/useVisible";

const jobs = [
  {
    company: "University Health Network",
    title: "Software Engineer",
    dates: "Jul 2024 – Present",
    url: "https://www.uhn.ca/",
    bullets: [
      "Designed and maintained distributed backend services powering integrations that process millions of messages daily across multiple hospital systems",
      "Implemented event-driven integrations using HL7 messaging standards with routing, validation, and error handling to connect critical clinical systems",
      "Optimized data pipelines and backend workflows in Java, SQL, and ObjectScript, improving throughput and system reliability across production environments",
    ],
  },
  {
    company: "Ontario Power Generation",
    title: "Software Engineer Intern",
    dates: "May 2022 – Aug 2023",
    url: "https://www.opg.com/",
    bullets: [
      "Built a real-time electricity demand visualization tool in .NET, serving internal energy trading teams with live generation data",
      "Designed a Python LSTM forecasting pipeline for short-term electricity demand prediction, improving model accuracy",
      "Automated deployments and provisioned cloud data storage via Azure DevOps and Azure SQL",
    ],
  },
  {
    company: "Mission MomN'Pop",
    title: "Front End Developer",
    dates: "May 2021 – Sept 2021",
    url: "",
    bullets: [
      "Designed and deployed websites for small business clients using Wix and Shopify, improving online presence and product visibility.",
      "Applied SEO best practices, increasing client website traffic and social media engagement by 30%",
      "Gathered requirements and delivered responsive, user-friendly interfaces through direct client collaboration",
    ],
  },
];

function Experience() {
  const [selected, setSelected] = useState(0);
  const job = jobs[selected];
  const tabRefs = useRef([]);
  const [ref, visible] = useVisible(0.5);
  const [initDone, setInitDone] = useState(false);
  const anim = (delay) =>
    visible ? { animationDelay: delay } : { opacity: 0 };
  const cls = visible ? "fade-slide-in" : "";

  useEffect(() => {
    if (visible && !initDone) {
      const t = setTimeout(() => setInitDone(true), 900);
      return () => clearTimeout(t);
    }
  }, [visible]);

  function handleKeyDown(e, i) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (i + 1) % jobs.length;
      setSelected(next);
      tabRefs.current[next].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (i - 1 + jobs.length) % jobs.length;
      setSelected(prev);
      tabRefs.current[prev].focus();
    }
  }

  function handleRipple(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple-origin";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  return (
    <div id="experience"
      ref={ref}
      className="flex flex-row items-center justify-start gap-12 min-h-screen px-12"
    >
      <div>
        <h2
          className={`text-5xl text-white/80 font-bold mb-12 ${cls}`}
          style={anim("0s")}
        >
          / experience
        </h2>
        <div className="flex flex-row gap-12">
          {/* Left: company tabs */}
          <div
            className={`flex flex-col border-l border-white/10 w-50 ${cls}`}
            style={anim("0.15s")}
          >
            {jobs.map((j, i) => (
              <button
                key={j.company}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={(e) => {
                  setSelected(i);
                  handleRipple(e);
                }}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`relative overflow-hidden px-6 py-3 text-lg text-left transition-colors border-l-2 -ml-px cursor-pointer ${
                  selected === i
                    ? "border-orange-400 text-orange-400 bg-orange-400/5"
                    : "border-transparent text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
              >
                {j.company}
              </button>
            ))}
          </div>

          {/* Right: job details */}
          <div className={`h-64 ${cls}`} style={anim("0.3s")}>
            <h3 className="text-2xl font-semibold text-white">
              {job.title} <span className="text-orange-400"> @ </span>
              {job.url ? (
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {job.company}
                </a>
              ) : (
                <span className="text-orange-400">{job.company}</span>
              )}
            </h3>
            <p className="mt-1 mb-4 text-base text-white/40 font-mono">
              {job.dates}
            </p>
            <ul key={selected} className="space-y-3">
              {job.bullets.map((b, i) => (
                <li
                  key={i}
                  className={`flex items-start gap-2 text-white/70 text-base max-w-xl fade-slide-in`}
                  style={{
                    animationDelay: initDone
                      ? `${i * 0.08}s`
                      : `${0.4 + i * 0.1}s`,
                    ...(visible ? {} : { opacity: 0 }),
                  }}
                >
                  <span className="text-orange-400 mt-0.5">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;
