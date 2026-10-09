import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* Typography styles */
const serif = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif" };
const sans = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };

/* Color Palette Constants */
const GOLD = "#d4a437";
const INK = "#2e1b0c";
const MAROON = "#5c1a1b";
const PARCH = "#ecdcb4";
const PARCH2 = "#f6ebcb";

/* Background Patterns */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .18 0 0 0 0 .05 0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const FRIEZE = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='16'><path d='M16 2l6 6-6 6-6-6z' fill='%23d4a437'/><path d='M0 8h6M26 8h6' stroke='%23d4a437' stroke-width='2'/></svg>")`;

const friezeStyle = { backgroundColor: "#2e1b0c", backgroundImage: FRIEZE, backgroundRepeat: "repeat-x", backgroundPosition: "center" };
const plate = { background: PARCH2, border: "2px solid #5a3a1a", boxShadow: "0 8px 18px rgba(46,27,12,.3), 4px 4px 0 #b8860b66" };

/* Monument silhouettes */
const SHAPES = {
  town: (<><rect x="15" y="62" width="38" height="38" /><rect x="62" y="44" width="34" height="56" /><rect x="105" y="66" width="30" height="34" /><rect x="144" y="52" width="40" height="48" /><rect x="4" y="94" width="192" height="6" /></>),
  stupa: (<><path d="M45 88 A55 55 0 0 1 155 88Z" /><rect x="30" y="88" width="140" height="12" /><rect x="90" y="22" width="20" height="12" /><rect x="99" y="4" width="2" height="18" /><rect x="86" y="10" width="28" height="3" /></>),
  pillar: (<><rect x="91" y="32" width="18" height="60" /><rect x="82" y="24" width="36" height="8" /><rect x="86" y="8" width="28" height="16" rx="6" /><rect x="68" y="92" width="64" height="8" /></>),
  cave: (<><path d="M20 100 V56 A32 32 0 0 1 84 56 V100Z" /><path d="M116 100 V56 A32 32 0 0 1 180 56 V100Z" /><rect x="8" y="94" width="184" height="6" /></>),
  temple: (<><path d="M50 100 L62 76 H138 L150 100Z" /><path d="M62 76 L72 56 H128 L138 76Z" /><path d="M72 56 L82 38 H118 L128 56Z" /><path d="M82 38 L92 22 H108 L118 38Z" /><rect x="96" y="6" width="8" height="16" rx="4" /></>),
  fort: (<><rect x="16" y="60" width="168" height="40" /><rect x="16" y="34" width="30" height="66" /><rect x="154" y="34" width="30" height="66" /><rect x="84" y="28" width="32" height="72" />{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (<rect key={i} x={20 + i * 22} y="52" width="12" height="8" />))}<rect x="16" y="26" width="30" height="8" /><rect x="154" y="26" width="30" height="8" /><rect x="84" y="20" width="32" height="8" /></>),
  dome: (<><path d="M58 68 A42 42 0 0 1 142 68Z" /><rect x="58" y="68" width="84" height="32" /><rect x="97" y="18" width="6" height="12" /><rect x="26" y="42" width="12" height="58" /><rect x="162" y="42" width="12" height="58" /><circle cx="32" cy="38" r="7" /><circle cx="168" cy="38" r="7" /></>),
};

const Sil = ({ t, className = "" }) => (
  <svg viewBox="0 0 200 100" className={className} fill="currentColor" aria-hidden="true" preserveAspectRatio="xMidYMax meet">
    {SHAPES[t]}
  </svg>
);

const Orn = ({ c = "#a8661e", className = "" }) => (
  <svg viewBox="0 0 240 20" className={`h-5 w-60 ${className}`} aria-hidden="true">
    <path d="M0 10H102M138 10H240" stroke={c} strokeWidth="1.5" />
    <path d="M120 2l8 8-8 8-8-8z" fill={c} />
    <circle cx="106" cy="10" r="2.5" fill={c} />
    <circle cx="134" cy="10" r="2.5" fill={c} />
  </svg>
);

/* Fallback Unsplash image URLs */
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop",
  "eras/indus": "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=800&auto=format&fit=crop",
  "eras/early": "https://images.unsplash.com/photo-1627894006505-8822003c467a?q=80&w=800&auto=format&fit=crop",
  "eras/maurya": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop",
  "eras/gupta": "https://images.unsplash.com/photo-1608885898808-1f5583b63d76?q=80&w=800&auto=format&fit=crop",
  "eras/chola": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
  "eras/sultan": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop",
  "eras/mughal": "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop",
  "wars/hydaspes": "https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=600&auto=format&fit=crop",
  "wars/kalinga": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop",
  "wars/tarain": "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop",
  "wars/panipat": "https://images.unsplash.com/photo-1585135497273-1a86b09fe707?q=80&w=600&auto=format&fit=crop",
  "wars/talikota": "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=600&auto=format&fit=crop",
  "wars/plassey": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop",
  "faiths/hindu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
  "faiths/buddhism": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop",
  "faiths/jainism": "https://images.unsplash.com/photo-1608885898808-1f5583b63d76?q=80&w=600&auto=format&fit=crop",
  "sites/sanchi": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=600&auto=format&fit=crop",
  "sites/ajanta": "https://images.unsplash.com/photo-1608885898808-1f5583b63d76?q=80&w=600&auto=format&fit=crop",
  "sites/nalanda": "https://images.unsplash.com/photo-1627894006505-8822003c467a?q=80&w=600&auto=format&fit=crop",
  "sites/thanjavur": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=600&auto=format&fit=crop",
  "sites/konark": "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=600&auto=format&fit=crop",
  "sites/hampi": "https://images.unsplash.com/photo-1600100397608-f010e423b971?q=80&w=600&auto=format&fit=crop",
  "sites/chittorgarh": "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop",
  "sites/redfort": "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=600&auto=format&fit=crop",
};

function Photo({ name, t, bg, alt = "", className = "", children }) {
  const [imgSrc, setImgSrc] = useState(`/images/${name}.jpg`);
  const [isFailed, setIsFailed] = useState(false);

  /* Reset when the image name changes (e.g. switching era tabs) */
  useEffect(() => {
    setImgSrc(`/images/${name}.jpg`);
    setIsFailed(false);
  }, [name]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMAGES[name] && FALLBACK_IMAGES[name]) {
      setImgSrc(FALLBACK_IMAGES[name]);
    } else {
      setIsFailed(true);
    }
  };

  return (
    <div className={`overflow-hidden ${className}`} style={{ background: bg }}>
      {!isFailed && (
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          onError={handleError}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 [filter:sepia(.6)_contrast(1.05)] group-hover:[filter:sepia(.1)]"
        />
      )}
      {isFailed && t && (
        <Sil t={t} className="absolute bottom-0 left-4 h-4/5 w-[calc(100%-2rem)] text-[#f6ebcb]/75" />
      )}
      <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 45px rgba(30,14,4,.65)" }} />
      {children}
    </div>
  );
}

const ERAS = [
  { id: "indus", t: "town", c: "#a8661e", name: "Indus cities", span: "c. 2600 to 1900 BCE", lead: "Planned towns with brick streets, drains and standard weights.", body: "Harappa, Mohenjo-daro, Dholavira and Lothal traded with Mesopotamia. No king or palace has been identified, and the script is still undeciphered.", sites: "Mohenjo-daro, Harappa, Dholavira, Lothal" },
  { id: "early", t: "stupa", c: "#4d6b35", name: "Early kingdoms", span: "c. 1500 to 322 BCE", lead: "Vedic tribes give way to sixteen kingdoms along the Ganges.", body: "Magadha rises to the top. The Buddha and Mahavira teach in this age, and Alexander meets King Porus at the Hydaspes in 326 BCE.", sites: "Rajgir, Vaishali, Sarnath, Bodh Gaya" },
  { id: "maurya", t: "pillar", c: "#a6451f", name: "Mauryan empire", span: "322 to 185 BCE", lead: "Chandragupta unites most of the subcontinent from Pataliputra.", body: "His grandson Ashoka wins the Kalinga war around 261 BCE, turns to Buddhism and carves his edicts on rocks and polished pillars across the empire.", sites: "Sanchi, Sarnath pillar, Girnar edicts" },
  { id: "gupta", t: "cave", c: "#2f4a7a", name: "Gupta age", span: "c. 320 to 550 CE", lead: "Temples, coins, Sanskrit drama and mathematics flourish.", body: "Nalanda is founded and grows into a great Buddhist university. The last Ajanta cave paintings are made. Hunnic invasions end Gupta power.", sites: "Nalanda, Ajanta, Udayagiri, Deogarh" },
  { id: "chola", t: "temple", c: "#7a1f2b", name: "Chola kingdoms", span: "c. 850 to 1279 CE", lead: "Stone temples rise across south and east India.", body: "Rajaraja I completes the Brihadisvara temple in 1010. Chola fleets cross to Southeast Asia. In the east, the Eastern Gangas build Konark.", sites: "Thanjavur, Gangaikonda Cholapuram, Konark" },
  { id: "sultan", t: "fort", c: "#2f6b62", name: "Sultanates and Vijayanagara", span: "1206 to 1646 CE", lead: "Delhi's sultans rule the north while Vijayanagara holds the south.", body: "Hampi grows into one of the largest cities in the world. A coalition of Deccan sultans defeats Vijayanagara at Talikota in 1565.", sites: "Qutb Minar, Hampi, Golconda, Bidar" },
  { id: "mughal", t: "dome", c: "#2a3a72", name: "Mughal empire", span: "1526 to 1857 CE", lead: "Babur wins at Panipat and founds a dynasty that lasts three centuries.", body: "Akbar, Shah Jahan and Aurangzeb build forts, tombs and gardens. After Plassey in 1757 the empire loses ground to the East India Company.", sites: "Fatehpur Sikri, Red Fort, Agra Fort, Taj Mahal" },
];

const WARS = [
  ["326 BCE", "Battle of the Hydaspes", "Alexander defeats Porus on the Jhelum, then turns back at the Beas.", "#4d6b35"],
  ["c. 261 BCE", "Kalinga war", "Ashoka's conquest of Kalinga causes mass death. His edicts later express remorse.", "#a6451f"],
  ["1192 CE", "Second Battle of Tarain", "Muhammad of Ghor defeats Prithviraj Chauhan and opens the way to Delhi.", "#2f4a7a"],
  ["1526 CE", "First Battle of Panipat", "Babur's cannon and cavalry beat Ibrahim Lodi and begin Mughal rule.", "#2a3a72"],
  ["1565 CE", "Battle of Talikota", "The Deccan sultanates defeat Vijayanagara. Hampi is sacked.", "#2f6b62"],
  ["1757 CE", "Battle of Plassey", "Robert Clive's forces beat Siraj ud-Daulah and the Company gains Bengal.", "#7a1f2b"],
];

const FAITHS = [
  { n: "Vedic and Hindu traditions", t: "temple", c: "#e0a458", d: "Oral hymns of the Rigveda come first, then ritual texts, the Upanishads and the epics. Stone temples begin in the Gupta age and peak under the Cholas, Chalukyas and Hoysalas.", s: "Deogarh, Thanjavur, Konark, Hampi" },
  { n: "Buddhism", t: "stupa", c: "#e8c868", d: "Taught in the Ganges plain in the 5th century BCE. Ashoka sends missions abroad. Stupas, rock-cut monasteries and universities mark its growth before it declines in India after the 12th century.", s: "Sanchi, Ajanta, Nalanda, Bodh Gaya" },
  { n: "Jainism", t: "cave", c: "#8fbf9f", d: "Built on Mahavira's teaching of non-violence. Patronised by Mauryan, Chalukyan and Rashtrakutan kings. Known for cave shrines and marble temples.", s: "Shravanabelagola, Udayagiri, Dilwara, Ellora" },
];

const SITES = [
  ["Great Stupa", "Sanchi, Madhya Pradesh", "3rd century BCE", "Ashoka, enlarged by the Shungas", "stupa", "#4d6b35"],
  ["Ajanta Caves", "Maharashtra", "2nd century BCE to c. 480 CE", "Satavahana and Vakataka patrons", "cave", "#2f4a7a"],
  ["Nalanda Mahavihara", "Bihar", "5th century CE", "Gupta kings, later the Palas", "town", "#a8661e"],
  ["Brihadisvara Temple", "Thanjavur, Tamil Nadu", "Completed 1010 CE", "Rajaraja I of the Cholas", "temple", "#7a1f2b"],
  ["Sun Temple", "Konark, Odisha", "c. 1250 CE", "Narasimhadeva I, Eastern Gangas", "temple", "#a6451f"],
  ["Vijayanagara ruins", "Hampi, Karnataka", "14th to 16th century", "Sangama and Tuluva dynasties", "pillar", "#2f6b62"],
  ["Chittorgarh Fort", "Rajasthan", "Sieged 1303, 1535, 1568", "Guhila and Sisodia rulers", "fort", "#7a4a1c"],
  ["Red Fort", "Delhi", "1639 to 1648", "Shah Jahan", "dome", "#2a3a72"],
];

const STATS = [
  ["5,000", "years of history", "#a6451f"],
  ["7", "great periods", "#2f4a7a"],
  ["6", "turning battles", "#7a1f2b"],
  ["8", "monuments to visit", "#2f6b62"],
];

const WAR_IMG = ["hydaspes", "kalinga", "tarain", "panipat", "talikota", "plassey"];
const WAR_T = ["town", "pillar", "fort", "dome", "fort", "fort"];
const FAITH_IMG = ["hindu", "buddhism", "jainism"];
const SITE_IMG = ["sanchi", "ajanta", "nalanda", "thanjavur", "konark", "hampi", "chittorgarh", "redfort"];

const Head = ({ title, sub, light }) => (
  <div>
    <h2 className="text-3xl font-bold md:text-5xl" style={{ ...serif, color: light ? "#f1d98f" : MAROON }}>{title}</h2>
    <Orn className="mt-3" c={light ? GOLD : "#a8661e"} />
    <p className="mt-3 max-w-xl" style={{ color: light ? PARCH2 : INK, opacity: 0.85 }}>{sub}</p>
  </div>
);

const linkStyle = "hover:text-[#f1d98f] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a437]";

export function HomePage() {
  const navigate = useNavigate();
  const [sel, setSel] = useState(2);
  const e = ERAS[sel];

  return (
    <div className="min-h-screen pt-16" style={{ ...sans, color: INK, backgroundColor: PARCH, backgroundImage: GRAIN }}>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-48 pt-32 text-[#f6ebcb] md:pb-56">
        <Photo name="hero" className="absolute inset-0" bg="linear-gradient(180deg,#1f1208 0%,#4a2310 40%,#9a4a1e 78%,#d9a24a 100%)" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(31,18,8,.78),rgba(74,35,16,.45) 55%,rgba(154,74,30,.4))" }} />
        <div className="absolute bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-70 md:h-96 md:w-96" style={{ background: "radial-gradient(circle,#f1d98f 0%,#d4a437 40%,transparent 70%)" }} />
        <div className="relative mx-auto max-w-6xl">
          <p className="inline-block rounded-sm border border-[#d4a437] bg-black/25 px-4 py-1 text-sm text-[#f1d98f]">Kings, wars, faiths and monuments of India</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] md:text-6xl" style={serif}>
            Five thousand years of India, <span style={{ color: "#f1d98f" }}>read from stone</span>
          </h1>
          <Orn className="mt-4" c={GOLD} />
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-[#f6ebcb]/90">
            Walk from the brick cities of the Indus to the Mughal forts. Meet the emperors, follow the battles and see the temples, stupas and ruins they left.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#periods" className="rounded-sm border-2 border-[#d4a437] bg-[#d4a437] px-7 py-3 font-semibold text-[#2e1b0c] shadow-lg transition hover:bg-[#f1d98f] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Explore the periods</a>
            <a href="#sites" className="rounded-sm border-2 border-[#d4a437] px-7 py-3 font-semibold text-[#f1d98f] transition hover:bg-[#d4a437]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">See the monuments</a>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-2 text-[#1a0e05]">
          <Sil t="fort" className="h-28 w-1/4 md:h-40" />
          <Sil t="stupa" className="h-24 w-1/4 md:h-36" />
          <Sil t="temple" className="h-36 w-1/4 md:h-52" />
          <Sil t="dome" className="h-28 w-1/4 md:h-40" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-4" style={friezeStyle} />
      </section>

      {/* STATS */}
      <div className="relative z-10 mx-auto -mt-10 grid max-w-5xl grid-cols-2 gap-4 px-5 md:grid-cols-4">
        {STATS.map(([n, l, c]) => (
          <div key={l} className="p-5 text-center" style={{ ...plate, borderBottom: `6px solid ${c}` }}>
            <p className="text-4xl font-bold" style={{ ...serif, color: c }}>{n}</p>
            <p className="mt-1 text-sm opacity-80">{l}</p>
          </div>
        ))}
      </div>

      {/* PERIODS */}
      <section id="periods" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Head title="Seven periods of Indian history" sub="Pick a period to see its rulers, events and sites." />
          <div className="mt-8 flex flex-wrap gap-2" role="tablist">
            {ERAS.map((x, i) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={sel === i}
                onClick={() => setSel(i)}
                className="rounded-sm border-2 px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ borderColor: x.c, background: sel === i ? x.c : PARCH2, color: sel === i ? PARCH2 : x.c }}
              >
                {x.name}
              </button>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-[1fr_1.5fr]" style={plate} role="tabpanel">
            <Photo name={`eras/${e.id}`} t={e.t} alt={e.name} className="group relative min-h-72" bg={`linear-gradient(160deg,${e.c},${INK})`}>
              <div className="absolute inset-x-0 bottom-0 p-6 text-[#f6ebcb]" style={{ background: "linear-gradient(transparent,rgba(30,14,4,.88))" }}>
                <p className="text-sm text-[#f1d98f]">{e.span}</p>
                <h3 className="mt-1 text-3xl font-bold" style={serif}>{e.name}</h3>
              </div>
            </Photo>
            <div className="p-8 md:p-10">
              <p className="text-2xl font-semibold leading-snug" style={{ ...serif, color: e.c }}>{e.lead}</p>
              <p className="mt-4 leading-relaxed opacity-90">{e.body}</p>
              <div className="mt-6 border-l-4 p-4" style={{ background: `${e.c}1f`, borderColor: e.c }}>
                <p className="text-sm font-semibold" style={{ color: e.c }}>Key sites</p>
                <p className="mt-1">{e.sites}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => setSel((sel + 6) % 7)} className="rounded-sm border-2 px-5 py-2 font-semibold focus:outline-none focus-visible:ring-2" style={{ borderColor: e.c, color: e.c }}>Earlier</button>
                <button onClick={() => setSel((sel + 1) % 7)} className="rounded-sm px-5 py-2 font-semibold text-[#f6ebcb] focus:outline-none focus-visible:ring-2" style={{ background: e.c }}>Later</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BATTLES */}
      <section id="battles" className="border-y-4 border-double border-[#5a3a1a]/60 px-5 py-20" style={{ backgroundColor: "#dfc994", backgroundImage: GRAIN }}>
        <div className="mx-auto max-w-6xl">
          <Head title="Battles that changed the map" sub="Six turning points, from Alexander's campaign to Company rule." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WARS.map(([y, n, d, c], i) => (
              <article key={n} className="group flex flex-col transition hover:-translate-y-1" style={plate}>
                <Photo name={`wars/${WAR_IMG[i]}`} t={WAR_T[i]} alt={n} className="relative h-40" bg={`linear-gradient(160deg,${c},${INK})`}>
                  <span className="absolute bottom-2 left-2 rounded-sm bg-[#2e1b0c]/90 px-3 py-1 text-xl font-bold text-[#f1d98f]" style={serif}>{y}</span>
                </Photo>
                <div className="h-1.5" style={{ background: c }} />
                <div className="p-5">
                  <h3 className="text-xl font-bold" style={{ ...serif, color: MAROON }}>{n}</h3>
                  <p className="mt-2 leading-relaxed opacity-90">{d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRADITIONS */}
      <section id="traditions" className="px-5 py-20 text-[#f6ebcb]" style={{ backgroundColor: "#3a0f12", backgroundImage: `${GRAIN}, linear-gradient(135deg,#4a1416,#2e1b0c 75%)` }}>
        <div className="mx-auto max-w-6xl">
          <Head light title="Three old traditions, one landscape" sub="Kings patronised all three, and their monuments often stand within a day's travel of each other." />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FAITHS.map((f, i) => (
              <article key={f.n} className="group border border-[#d4a437]/70 bg-[#f6ebcb]/10 shadow-[4px_4px_0_rgba(212,164,55,.35)]">
                <Photo name={`faiths/${FAITH_IMG[i]}`} t={f.t} alt={f.n} className="relative h-44" bg={`linear-gradient(160deg,${f.c}66,#1a0e05)`} />
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#f1d98f]" style={serif}>{f.n}</h3>
                  <p className="mt-3 leading-relaxed text-[#f6ebcb]/90">{f.d}</p>
                  <p className="mt-4 text-sm font-semibold" style={{ color: f.c }}>{f.s}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MONUMENTS */}
      <section id="sites" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <Head title="Monuments, forts and ruins" sub="Eight places where this history can still be walked." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SITES.map(([n, p, dt, b, t, c], i) => (
              <article key={n} className="group flex flex-col transition hover:-translate-y-1" style={plate}>
                <Photo name={`sites/${SITE_IMG[i]}`} t={t} alt={n} className="relative h-40" bg={`linear-gradient(180deg,${c},${INK})`} />
                <div className="h-1.5" style={{ background: c }} />
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-bold leading-snug" style={{ ...serif, color: MAROON }}>{n}</h3>
                  <p className="mt-1 text-sm opacity-75">{p}</p>
                  <p className="mt-3 inline-block self-start rounded-sm px-3 py-1 text-xs font-semibold text-[#f6ebcb]" style={{ background: c }}>{dt}</p>
                  <p className="mt-3 text-sm leading-relaxed opacity-90">{b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="px-5 py-16" style={{ backgroundColor: GOLD, backgroundImage: `${GRAIN}, linear-gradient(90deg,#d4a437,#b8741a)` }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <p className="max-w-xl text-2xl font-bold leading-snug text-[#2e1b0c] md:text-3xl" style={serif}>
            Start with the Mauryan empire and follow the thread forward.
          </p>
          <button onClick={() => navigate("/history")} className="rounded-sm bg-[#2e1b0c] px-8 py-3 font-semibold text-[#f1d98f] shadow-lg transition hover:bg-[#4a2310] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Read the full timeline
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-[#e8d7a8]" style={{ backgroundColor: "#1a0e05", backgroundImage: GRAIN }}>
        <div className="h-4" style={friezeStyle} />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-3xl font-bold text-[#f1d98f]" style={serif}>Chronicles in Stone</p>
            <Orn className="mt-2" c={GOLD} />
            <p className="mt-4 max-w-sm leading-relaxed text-[#e8d7a8]/85">
              A short guide to the kings, battles, faiths and monuments of the Indian subcontinent, from the Indus cities to the Mughal age.
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#f1d98f]" style={serif}>Explore</p>
            <ul className="mt-3 space-y-2">
              {[["#periods", "Periods"], ["#battles", "Battles"], ["#traditions", "Traditions"], ["#sites", "Monuments"]].map(([h, l]) => (
                <li key={h}><a href={h} className={linkStyle}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#f1d98f]" style={serif}>Periods</p>
            <ul className="mt-3 space-y-2">
              {ERAS.map((x, i) => (
                <li key={x.id}><a href="#periods" onClick={() => setSel(i)} className={linkStyle}>{x.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#f1d98f]" style={serif}>About the sources</p>
            <p className="mt-3 text-sm leading-relaxed text-[#e8d7a8]/80">
              Dates follow commonly cited scholarly chronologies and are approximate before 500 BCE. Credit your photographs here, for example Wikimedia Commons or the Archaeological Survey of India.
            </p>
          </div>
        </div>
        <div className="border-t border-[#d4a437]/30 px-5 py-5">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-sm text-[#e8d7a8]/70">
            <p>© 2026 Chronicles in Stone. Made for learning about India's past.</p>
            <a href="#periods" className={linkStyle} onClick={(ev) => { ev.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Secondary page: Full Timeline */
export function TimelinePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-28 px-5 pb-20" style={{ ...sans, color: INK, backgroundColor: PARCH, backgroundImage: GRAIN }}>
      <div className="mx-auto max-w-4xl">
        <Head title="Full Chronological Timeline" sub="From early urban settlements to the dawn of modernity." />
        <div className="mt-10 space-y-8">
          {ERAS.map((era) => (
            <div key={era.id} className="p-6" style={plate}>
              <span className="text-sm font-semibold text-[#a6451f]">{era.span}</span>
              <h3 className="text-2xl font-bold mt-1" style={{ ...serif, color: MAROON }}>{era.name}</h3>
              <p className="mt-2 text-base leading-relaxed opacity-90">{era.body}</p>
              <p className="mt-3 text-sm font-semibold opacity-75">Key Sites: {era.sites}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-10 rounded-sm bg-[#2e1b0c] px-6 py-3 text-sm font-bold text-[#f1d98f] shadow transition hover:bg-[#4a2310]"
        >
          ← Back to Main Explorer
        </button>
      </div>
    </div>
  );
}

export default HomePage;