import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { useVisible } from "../hooks/useVisible";

const projects = [
  {
    title: "Discord Omni Bot",
    description:
      "An all-in-one Discord bot that provides sports statistics, injury reports, betting lines, and AI-powered chat assistance.",
    tags: ["Python", "discord.py", "yfinance", "matplotlib", "Deepseek AI"],
    github: "https://github.com/d-fung/omni-bot",
    demo: "",
    gif: "",
  },
  {
    title: "Genetic Sequence Analyzer",
    description:
      "A web-based bioinformatics tool for analyzing DNA sequences from FASTA files. Built with React to provide real-time sequence analysis, visualization, and protein translation capabilities.",
    tags: ["JavaScript", "React.js", "Recharts"],
    github: "https://github.com/d-fung/genetic-analyzer",
    demo: "https://d-fung.github.io/genetic-analyzer/",
    gif: "",
  },
  {
    title: "Credit Card Statement Analyzer",
    description:
      "A frontend-only React web application that parses American Express & CIBC PDF statements, categorizes transactions, and provides summary reports with filtering and export capabilities.",
    tags: ["JavaScript", "React.js"],
    github: "https://github.com/d-fung/credit-card-statement-analyzer",
    demo: "https://d-fung.github.io/credit-card-statement-analyzer/",
    gif: "",
  },
];

function Projects() {
  const [ref, visible] = useVisible(0.3);
  const anim = (delay) =>
    visible ? { animationDelay: delay } : { opacity: 0 };
  const cls = visible ? "fade-slide-in" : "";

  return (
    <div id="projects" ref={ref} className="flex flex-col justify-center py-50 px-12">
      <h2
        className={`text-5xl text-white/80 font-bold mb-12 ${cls}`}
        style={anim("0s")}
      >
        / projects
      </h2>
      <div className="grid grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <div
            key={p.title}
            className={`flex flex-col justify-between p-6 rounded-lg border border-white/10 bg-white/5 hover:border-orange-400/40 transition-colors ${cls}`}
            style={anim(`${0.15 + i * 0.15}s`)}
          >
            <div>
              {p.gif && (
                <img
                  src={p.gif}
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold text-white mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-white/60 mb-4">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded bg-orange-400/10 text-orange-400 font-mono border-orange-400/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              {p.github && (
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-orange-400 transition-colors"
                >
                  <FaGithub size={18} />
                </a>
              )}
              {p.demo && (
                <a
                  href={p.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-orange-400 transition-colors"
                >
                  <FaExternalLinkAlt size={18}/>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
