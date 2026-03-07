import { useVisible } from "../hooks/useVisible";

function About() {
  const [ref, visible] = useVisible(0.5);

  const anim = (delay) =>
    visible ? { animationDelay: delay } : { opacity: 0 };
  const cls = visible ? "fade-slide-in" : "";

  return (
    <div id="about" ref={ref} className="flex flex-row items-center justify-center gap-12 min-h-screen px-12">
      <div>
        <h2 className={`text-5xl text-white/80 font-bold mb-10 ${cls}`} style={anim("0s")}>/ about me</h2>
        <p className={`mt-4 text-lg text-white/70 max-w-xl ${cls}`} style={anim("0.15s")}>
          I’m currently a{" "}
          <span className="font-bold">Software Engineer</span> at{" "}
          <a
            href="https://www.uhn.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            University Health Network
          </a>
          , where I design and build integrations that connect critical
          healthcare systems across Toronto.
        </p>
        <p className={`mt-4 text-lg text-white/70 max-w-xl ${cls}`} style={anim("0.3s")}>
          Previously, I worked as a software engineering intern at{" "}
          <a
            href="https://www.opg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:text-orange-300 transition-colors"
          >
            Ontario Power Generation
          </a>{" "}
          and <span className="text-orange-400">Mission MomN’Pop</span>. I hold a Bachelor of Engineering in Software
          Engineering and a Bachelor of Science (Major in Medical Sciences).
        </p>
        <div className="mt-8">
          <p className={`text-lg text-white/70 mb-4 ${cls}`} style={anim("0.45s")}>
            Here are some of the technologies I have been working with:
          </p>
          <ul className="grid grid-cols-2 gap-2 text-white/70 text-sm max-w-xs mb-7">
            {[
              "Python",
              "Java",
              "C#",
              "JavaScript",
              "TypeScript",
              "React.js",
            ].map((tech, i) => (
              <li key={tech} className={`flex items-center gap-2 ${cls}`} style={anim(`${0.9 + i * 0.1}s`)}>
                <span className="text-orange-400">▸</span> {tech}
              </li>
            ))}
          </ul>
        </div>
        <p className={`mt-8 text-lg text-white/70 max-w-xl ${cls}`} style={anim("0.6s")}>
          Outside of work, I like to stay active through volleyball, golf, and
          workouts. I’m an avid gamer and play many genres, with League of
          Legends being a longtime favorite (since 2011). I also enjoy traveling
          and capturing moments on my film camera.
        </p>
      </div>
      <img
        src="/assets/me2.jpg"
        alt="David"
        className={`w-72 h-72 object-cover rounded-lg drop-shadow-[0_0_10px_rgba(251,146,60,0.5)] ${cls}`}
        style={anim("0.75s")}
      />
    </div>
  );
}

export default About;
