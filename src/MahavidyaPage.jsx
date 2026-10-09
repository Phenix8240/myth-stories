import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import maakaliImg from "./images/maakali.jpg";
import maakali from "./images/kali.jpg";
//  import API_BASE_URL from './api.js';

/* ===== Import the other images here (uncomment each after adding the file) ===== */
import taraImg from "./images/tara.jpg";
import tripuraSundariImg from "./images/tripurasundari.jpg";
import bhuvaneshwariImg from "./images/bhuvaneshwari.jpg";
import bhairaviImg from "./images/bhairavi.jpg";
import chhinnamastaImg from "./images/chhinnamasta.jpg";
import dhumavatiImg from "./images/dhumavati.jpg";
import bagalamukhiImg from "./images/bagalamukhi.jpg";
import matangiImg from "./images/matangi.jpg";
import kamalaImg from "./images/kamala.jpg";

const serif = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif" };
const sans = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };

const GOLD = "#e7c66b";
const GOLD_D = "#c9993a";
const NIGHT = "#140d12";

/* BACKGROUND IMAGE (set to "" for none) */
const BG_IMAGE = maakaliImg;
/* How dark the veil over the background is (0 = none, 1 = black) */
const BG_VEIL = 0.55;

/* Must match the `slug` column in the database: "Tripura Sundari" -> "tripura-sundari" */
const slug = (n) => n.toLowerCase().trim().replace(/\s+/g, "-");

/* DEVI IMAGES: set `img` to the imported variable (or "" until you add it) */
const DEVIS = [
  { n: "Kali", dv: "काली", img: maakali, c: "#8a1c2b", t: "Time and liberation", d: "The first Mahavidya. She devours time itself, dissolving fear and ego so the seeker can be free." },
  { n: "Tara", dv: "तारा", img: taraImg /* taraImg */, c: "#2b5fa8", t: "The guide who carries you across", d: "Blue-skinned saviour who ferries devotees across the ocean of suffering. Deeply honoured at Tarapith." },
  { n: "Tripura Sundari", dv: "त्रिपुरसुन्दरी", img:  tripuraSundariImg , c: "#d9547a", t: "Beauty beyond the three worlds", d: "Also called Shodashi. The supreme Shakti of Sri Vidya, seated on a lotus of perfect bliss." },
  { n: "Bhuvaneshwari", dv: "भुवनेश्वरी", img: bhuvaneshwariImg , c: "#d9a441", t: "Sovereign of the cosmos", d: "Mistress of space. She holds the whole world as her body and rules with calm authority." },
  { n: "Bhairavi", dv: "भैरवी", img: bhairaviImg , c: "#c8321e", t: "Fierce discipline", d: "The burning energy of tapas. She destroys impurity so inner strength can rise." },
  { n: "Chhinnamasta", dv: "छिन्नमस्ता", img:  chhinnamastaImg , c: "#b3122a", t: "Sacrifice and self-mastery", d: "The self-decapitated goddess. A bold image of giving up ego and mastering desire and life force." },
  { n: "Dhumavati", dv: "धूमावती", img: dhumavatiImg , c: "#7b7f86", t: "Emptiness and detachment", d: "An old widow with a crow. She teaches that wisdom begins where illusion and longing end." },
  { n: "Bagalamukhi", dv: "बगलामुखी", img: bagalamukhiImg , c: "#e0b21f", t: "Stillness of speech", d: "Golden-yellow goddess who stops hostile words and thoughts, and brings the mind to a standstill." },
  { n: "Matangi", dv: "मातंगी", img: matangiImg , c: "#1f8a5f", t: "Music, speech and art", d: "Emerald goddess with a veena. She governs inspired expression, the arts and inner knowledge." },
  { n: "Kamala", dv: "कमला", img: kamalaImg , c: "#e86f9d", t: "Abundance and grace", d: "The lotus-born, Lakshmi in her tantric form. Two white elephants bathe her with water." },
];
/* ===== Shakti Mandala: Adi Shakti at the centre, 10 Mahavidyas on the circle ===== */
const MANDALA_R = 36;
const NODE_POS = DEVIS.map((_, i) => {
  const a = ((i * 360) / DEVIS.length - 90) * (Math.PI / 180);
  return {
    x: 50 + MANDALA_R * Math.cos(a),
    y: 50 + MANDALA_R * Math.sin(a),
    rx: 50 + 16 * Math.cos(a),
    ry: 50 + 16 * Math.sin(a),
    ex: 50 + (MANDALA_R - 7) * Math.cos(a),
    ey: 50 + (MANDALA_R - 7) * Math.sin(a),
  };
});

const MANDALA_CSS = `
@keyframes sm-spin{to{transform:rotate(360deg)}}
@keyframes sm-spin-rev{to{transform:rotate(-360deg)}}
@keyframes sm-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes sm-flow{to{stroke-dashoffset:-14}}
@keyframes sm-burst{from{left:50%;top:50%;opacity:0;transform:translate(-50%,-50%) scale(.15) rotate(-200deg)}}
@keyframes sm-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes sm-ping{0%{transform:scale(1);opacity:.9}100%{transform:scale(1.75);opacity:0}}
@keyframes sm-breathe{
  0%,100%{box-shadow:0 0 28px 4px var(--c),0 0 70px 10px var(--c),inset 0 0 22px rgba(255,255,255,.28)}
  50%{box-shadow:0 0 46px 12px var(--c),0 0 110px 26px var(--c),inset 0 0 34px rgba(255,255,255,.45)}
}
@keyframes sm-fade{from{opacity:0}to{opacity:1}}
.sm-svg-spin{transform-box:view-box;transform-origin:50% 50%;animation:sm-spin 70s linear infinite}
.sm-svg-spin-rev{transform-box:view-box;transform-origin:50% 50%;animation:sm-spin-rev 110s linear infinite}
.sm-lotus{transform-box:view-box;transform-origin:50% 50%;animation:sm-spin 40s linear infinite}
.sm-ray{stroke-dasharray:1;animation:sm-draw 1s ease-out both}
.sm-ray-flow{stroke-dasharray:2.4 2.2;animation:sm-flow .9s linear infinite}
.sm-node{animation:sm-burst .9s cubic-bezier(.2,.9,.3,1.2) both}
.sm-float{animation:sm-float 5s ease-in-out infinite}
.sm-ping{animation:sm-ping 1.8s ease-out infinite}
.sm-core{animation:sm-breathe 3.2s ease-in-out infinite,sm-fade 1s both}
@media (prefers-reduced-motion:reduce){
  .sm-svg-spin,.sm-svg-spin-rev,.sm-lotus,.sm-ray,.sm-ray-flow,.sm-node,.sm-float,.sm-ping,.sm-core,.sm-particle{animation:none!important}
  .sm-particle{display:none}
}
`;

function ShaktiMandala({ sel, onSelect }) {
  const d = DEVIS[sel];

  return (
    <div className="mx-auto mt-10 w-full max-w-[560px] px-2 sm:max-w-[640px]">
      <style>{MANDALA_CSS}</style>

      <div className="relative aspect-square w-full" role="group" aria-label="Select a Mahavidya">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            {DEVIS.map((v, i) => (
              <linearGradient
                key={v.n}
                id={`sm-g${i}`}
                gradientUnits="userSpaceOnUse"
                x1={NODE_POS[i].rx} y1={NODE_POS[i].ry}
                x2={NODE_POS[i].ex} y2={NODE_POS[i].ey}
              >
                <stop offset="0" stopColor={GOLD} />
                <stop offset="1" stopColor={v.c} />
              </linearGradient>
            ))}
            <radialGradient id="sm-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor={d.c} stopOpacity=".35" />
              <stop offset="60%" stopColor={d.c} stopOpacity=".08" />
              <stop offset="100%" stopColor={d.c} stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="50" cy="50" r="49" fill="url(#sm-halo)" style={{ transition: "all .6s" }} />

          <circle className="sm-svg-spin" cx="50" cy="50" r="47.5" fill="none" stroke={GOLD_D} strokeOpacity=".55" strokeWidth=".35" strokeDasharray=".4 1.6" strokeLinecap="round" />
          <circle className="sm-svg-spin-rev" cx="50" cy="50" r={MANDALA_R} fill="none" stroke={GOLD} strokeOpacity=".35" strokeWidth=".3" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="22" fill="none" stroke={GOLD_D} strokeOpacity=".3" strokeWidth=".25" />

          {DEVIS.map((v, i) => {
            const p = NODE_POS[i];
            const on = sel === i;
            return (
              <g key={v.n}>
                <line
                  className="sm-ray"
                  pathLength="1"
                  x1={p.rx} y1={p.ry} x2={p.ex} y2={p.ey}
                  stroke={`url(#sm-g${i})`}
                  strokeWidth={on ? 1.1 : 0.55}
                  strokeOpacity={on ? 1 : 0.65}
                  strokeLinecap="round"
                  style={{ animationDelay: `${0.35 + i * 0.07}s`, transition: "stroke-width .4s, stroke-opacity .4s" }}
                />
                {on && (
                  <line
                    className="sm-ray-flow"
                    x1={p.rx} y1={p.ry} x2={p.ex} y2={p.ey}
                    stroke="#fff" strokeOpacity=".85" strokeWidth=".35" strokeLinecap="round"
                  />
                )}
                {[0, 1].map((k) => (
                  <circle key={k} className="sm-particle" r={on ? 1.1 : 0.7} fill={on ? "#fff" : v.c} opacity=".95">
                    <animateMotion
                      dur={on ? "1.6s" : "3.2s"}
                      begin={`${1.2 + i * 0.15 + k * 1.6}s`}
                      repeatCount="indefinite"
                      path={`M${p.rx} ${p.ry} L${p.ex} ${p.ey}`}
                    />
                    <animate attributeName="opacity" values="0;1;1;0" dur={on ? "1.6s" : "3.2s"} begin={`${1.2 + i * 0.15 + k * 1.6}s`} repeatCount="indefinite" />
                  </circle>
                ))}
              </g>
            );
          })}

          <g className="sm-lotus">
            {DEVIS.map((v, i) => (
              <ellipse
                key={v.n}
                cx="50" cy="39.5" rx="2.7" ry="6.2"
                transform={`rotate(${i * 36} 50 50)`}
                fill={v.c} fillOpacity={sel === i ? 1 : 0.7}
                stroke={GOLD} strokeOpacity=".7" strokeWidth=".25"
                style={{ transition: "fill-opacity .4s" }}
              />
            ))}
          </g>
        </svg>

        <div
          className="sm-core absolute left-1/2 top-1/2 z-10 grid aspect-square w-[21%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-[#e7c66b]/80 text-center"
          style={{
            "--c": `${d.c}aa`,
            background: `radial-gradient(circle at 50% 35%, #fff6d6 0%, ${GOLD} 22%, ${d.c} 70%, ${NIGHT} 130%)`,
            transition: "background .6s",
          }}
        >
          <div className="leading-none">
            <div className="text-2xl text-[#2a1208] sm:text-4xl" style={serif}>ॐ</div>
            <div className="mt-0.5 text-[8px] font-semibold tracking-wide text-[#2a1208] sm:text-xs" style={serif}>আদ্যাশক্তি মহামায়া</div>
            {/* <div className="hidden text-[8px] uppercase tracking-[0.2em] text-[#2a1208]/80 sm:block">Adi Shakti</div> */}
          </div>
        </div>

        {DEVIS.map((v, i) => {
          const p = NODE_POS[i];
          const on = sel === i;
          return (
            <div
              key={v.n}
              className="sm-node absolute w-[16%] sm:w-[14%]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: "translate(-50%,-50%)",
                animationDelay: `${0.1 + i * 0.08}s`,
                zIndex: on ? 30 : 20,
              }}
            >
              <div className="sm-float" style={{ animationDelay: `${i * 0.35}s` }}>
                <button
                  onClick={() => onSelect(i)}
                  aria-pressed={on}
                  aria-label={v.n}
                  className="group relative block w-full focus:outline-none"
                  style={{ transition: "transform .35s cubic-bezier(.3,1.4,.5,1)", transform: on ? "scale(1.28)" : "scale(1)" }}
                >
                  {on && (
                    <span className="sm-ping pointer-events-none absolute inset-0 rounded-full border-2" style={{ borderColor: v.c }} />
                  )}
                  <span
                    className="block aspect-square w-full rounded-full p-[3px] transition-all duration-300 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white"
                    style={{
                      background: on ? `linear-gradient(135deg, ${GOLD}, ${v.c})` : `linear-gradient(135deg, ${v.c}, ${GOLD_D}66)`,
                      boxShadow: on ? `0 0 28px 4px ${v.c}` : `0 0 12px ${v.c}88`,
                    }}
                  >
                    <Pic devi={v} glyphClass="text-lg" className="h-full w-full rounded-full" />
                  </span>
                  <span
                    className={`pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-xs ${on ? "block" : "hidden sm:block"}`}
                    style={{ color: on ? GOLD : "rgba(243,233,210,.75)", textShadow: "0 1px 6px #000, 0 0 10px #000" }}
                  >
                    {v.n}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
/* Devi picture; shows gradient + Devanagari name when there is no image */
function Pic({ devi, glyphClass = "text-5xl", className = "", children }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [devi.img]);

  const showImg = devi.img && !failed;

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 50% 38%, ${devi.c}, ${NIGHT} 85%)` }}
    >
      {showImg ? (
        <img
          src={devi.img}
          alt={devi.n}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
        />
      ) : (
        <span className={`absolute inset-0 grid place-items-center text-white drop-shadow-lg ${glyphClass}`} style={serif}>
          {devi.dv}
        </span>
      )}
      <span className="pointer-events-none absolute inset-0 block" style={{ boxShadow: "inset 0 0 40px rgba(10,5,8,.65)" }} />
      {children}
    </span>
  );
}

const Divider = () => (
  <div className="flex items-center gap-3" aria-hidden="true">
    <span className="h-px w-16" style={{ background: `linear-gradient(90deg, transparent, ${GOLD_D})` }} />
    <span className="h-2 w-2 rotate-45" style={{ background: GOLD }} />
    <span className="h-px w-16" style={{ background: `linear-gradient(270deg, transparent, ${GOLD_D})` }} />
  </div>
);

export default function MahavidyaPage() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(0);
  const d = DEVIS[sel];
  const featuredRef = useRef(null);

  const choose = (i, scroll = true) => {
    setSel(i);
    if (scroll && featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };



const openDetails = (devi) => {
  const deitySlug = slug(devi.n); // "Kali" -> "kali"
  
  // ব্যাকএন্ডের সঠিক Endpoint: /api/deities/{slug}
  fetch(`${API_BASE_URL}/api/deities/${deitySlug}`)
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      navigate(`/mahavidya/${deitySlug}`, { state: data });
    })
    .catch((err) => {
      console.error("Error fetching deity details:", err);
    });
};

  return (
    <main className="relative min-h-screen overflow-x-hidden pt-28 text-[#f3e9d2]" style={{ ...sans, backgroundColor: NIGHT }}>
      {/* Layer 1: colour glow that changes with the selected devi */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 0%, ${d.c}55 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, #3b1030 0%, transparent 55%), linear-gradient(180deg, #1b0f18, ${NIGHT})`,
          transition: "background-image .6s",
        }}
      />

      {/* Layer 2: background image */}
      {BG_IMAGE && (
        <div className="pointer-events-none fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      )}

      {/* Layer 3: dark veil */}
      <div className="pointer-events-none fixed inset-0" style={{ background: `rgba(0,0,0,${BG_VEIL})` }} />

      <div className="relative mx-auto max-w-6xl px-5 pb-24">
        {/* HEADER */}
        <header className="text-center">
          {/* <p className="text-sm tracking-[0.35em] text-[#c9993a]" style={serif}>दश महाविद्या</p> */}
          <h1 className="mt-3 text-5xl font-semibold md:text-7xl" style={{ ...serif, color: GOLD }}>
           दश महाविद्या
          </h1>
          {/* <div className="mt-5 flex justify-center"><Divider /></div>
          <p className="mx-auto mt-5 max-w-xl text-[#f3e9d2]/80">
            Ten great wisdom goddesses, ten paths to knowledge. Preview a name below, or open any card for her full page.
          </p> */}
        </header>

        {/* MEDALLION SELECTOR */}
        
        <ShaktiMandala sel={sel} onSelect={(i) => choose(i, false)} />
        {/* FEATURED PANEL */}
        <section
          ref={featuredRef}
          className="mt-8 grid scroll-mt-28 gap-0 overflow-hidden rounded-3xl border border-[#c9993a]/40 bg-[#1b1016]/80 shadow-2xl backdrop-blur md:grid-cols-[minmax(260px,380px)_1fr]"
          style={{ boxShadow: `0 0 60px ${d.c}44` }}
        >
          <div className="group relative p-6 md:p-8" style={{ background: `linear-gradient(160deg, ${d.c}55, transparent 70%)` }}>
            <Pic
              devi={d}
              glyphClass="text-6xl"
              className="mx-auto aspect-[3/4] w-full max-w-xs rounded-t-[999px] rounded-b-2xl border-2 border-[#e7c66b]/70"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <p className="text-sm tracking-widest text-[#c9993a]">
              MAHAVIDYA {String(sel + 1).padStart(2, "0")} / 10
            </p>
            <h2 className="mt-2 text-5xl md:text-6xl" style={serif}>{d.n}</h2>
            <p className="mt-1 text-3xl" style={{ ...serif, color: d.c === "#7b7f86" ? "#c3c6cc" : d.c, filter: "brightness(1.35)" }}>
              {d.dv}
            </p>
            <p className="mt-4 text-xl italic" style={{ ...serif, color: GOLD }}>{d.t}</p>
            <p className="mt-4 max-w-lg leading-relaxed text-[#f3e9d2]/85">{d.d}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => choose((sel + 9) % 10, false)}
                className="rounded-full border border-[#c9993a] px-6 py-2.5 transition hover:bg-[#c9993a]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                ← Previous
              </button>
              <button
                onClick={() => choose((sel + 1) % 10, false)}
                className="rounded-full border border-[#c9993a] px-6 py-2.5 transition hover:bg-[#c9993a]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Next →
              </button>
              <button
                onClick={() => openDetails(d)}
                className="rounded-full bg-[#c9993a] px-6 py-2.5 font-semibold text-[#1b1016] transition hover:bg-[#e7c66b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View full details
              </button>
            </div>
          </div>
        </section>

        {/* CARD GRID */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl md:text-4xl" style={{ ...serif, color: GOLD }}>All ten goddesses</h3>
          <div className="mt-4 flex justify-center"><Divider /></div>
        </div>

        
<ul className="mt-10 flex flex-wrap gap-5 sm:gap-6 lg:gap-7">
  {DEVIS.map((v, i) => (
    <li
      key={v.n}
      className="w-full min-w-0 sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-21px)] 2xl:w-[calc(20%-23px)]"
    >
      <button
        onClick={() => openDetails(v)}
        aria-label={`Open details for ${v.n}`}
        className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#d9c3a0]/25 bg-[#1b1016]/75 text-left backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:border-[#c9993a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c66b]"
        style={{ boxShadow: "0 10px 24px rgba(0,0,0,.35)" }}
      >
        <Pic devi={v} glyphClass="text-4xl" className="h-56 w-full sm:h-60 lg:h-64 2xl:h-72">
          <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs tracking-widest text-[#e7c66b] backdrop-blur">
            {String(i + 1).padStart(2, "0")}
          </span>

          <span
            className="absolute inset-x-0 bottom-0 block h-20"
            style={{
              background: "linear-gradient(transparent, rgba(20,13,18,.95))",
            }}
          />

          <span
            className="absolute bottom-3 left-4 text-xl text-white drop-shadow sm:text-2xl"
            style={serif}
          >
            {v.dv}
          </span>
        </Pic>

        <span className="block h-1 w-full shrink-0" style={{ background: v.c }} />

        <span className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
          <span className="text-2xl sm:text-3xl" style={serif}>
            {v.n}
          </span>

          <span
            className="mt-1 text-sm italic sm:text-base"
            style={{ ...serif, color: GOLD }}
          >
            {v.t}
          </span>

          <span className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#f3e9d2]/75">
            {v.d}
          </span>

          <span className="mt-auto pt-4 text-sm font-semibold text-[#c9993a] transition group-hover:text-[#e7c66b]">
            View details →
          </span>
        </span>
      </button>
    </li>
  ))}
</ul>

      </div>
    </main>
  );
}