import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
/* Same background image as the Mahavidya list page */
import maakaliImg from "./images/maakali.jpg";

const serif = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif" };
const sans = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" };

const GOLD = "#e7c66b";
const GOLD_D = "#c9993a";
const NIGHT = "#140d12";

const BG_IMAGE = maakaliImg; // set to "" for no image
const BG_VEIL = 0.55;        // 0 = none, 1 = black

/* Look & feel per devi, keyed by the backend slug.
   Text content (description, stories, etc.) comes from the API. */
const LOOK = {
  "kali": { n: "Kali", dv: "काली", c: "#8a1c2b", img: "/images/mahavidya/kali.jpg" },
  "tara": { n: "Tara", dv: "तारा", c: "#2b5fa8", img: "/images/mahavidya/tara.jpg" },
  "tripura-sundari": { n: "Tripura Sundari", dv: "त्रिपुरसुन्दरी", c: "#d9547a", img: "/images/mahavidya/tripura-sundari.jpg" },
  "bhuvaneshwari": { n: "Bhuvaneshwari", dv: "भुवनेश्वरी", c: "#d9a441", img: "/images/mahavidya/bhuvaneshwari.jpg" },
  "bhairavi": { n: "Bhairavi", dv: "भैरवी", c: "#c8321e", img: "/images/mahavidya/bhairavi.jpg" },
  "chhinnamasta": { n: "Chhinnamasta", dv: "छिन्नमस्ता", c: "#b3122a", img: "/images/mahavidya/chhinnamasta.jpg" },
  "dhumavati": { n: "Dhumavati", dv: "धूमावती", c: "#7b7f86", img: "/images/mahavidya/dhumavati.jpg" },
  "bagalamukhi": { n: "Bagalamukhi", dv: "बगलामुखी", c: "#e0b21f", img: "/images/mahavidya/bagalamukhi.jpg" },
  "matangi": { n: "Matangi", dv: "मातंगी", c: "#1f8a5f", img: "/images/mahavidya/matangi.jpg" },
  "kamala": { n: "Kamala", dv: "कमला", c: "#e86f9d", img: "/images/mahavidya/kamala.jpg" },
};
const ORDER = Object.keys(LOOK);
const DEFAULT_LOOK = { dv: "", c: "#8a1c2b", img: "" };

const Lotus = ({ color, className = "" }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <g transform="translate(100 100)" fill={color} fillOpacity=".28" stroke={color} strokeWidth="1.5">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <ellipse key={i} cx="0" cy="-52" rx="16" ry="42" transform={`rotate(${i * 45})`} />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <ellipse key={`b${i}`} cx="0" cy="-30" rx="9" ry="24" transform={`rotate(${i * 45 + 22.5})`} fillOpacity=".5" />
      ))}
    </g>
    <circle cx="100" cy="100" r="95" fill="none" stroke={color} strokeOpacity=".5" strokeWidth="1" />
    <circle cx="100" cy="100" r="14" fill={color} />
  </svg>
);

/* Tries the backend imageUrl first, then the local image, then a lotus emblem */
function Pic({ devi, src, glyphClass = "text-5xl", className = "" }) {
  const sources = [src, devi.img].filter(Boolean);
  const key = sources.join("|");
  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [key]);
  const failed = idx >= sources.length;

  return (
    <span
      className={`relative block overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 50% 38%, ${devi.c}, ${NIGHT} 85%)` }}
    >
      {!failed ? (
        <img
          src={sources[idx]}
          alt={devi.n}
          onError={() => setIdx((i) => i + 1)}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <>
          <Lotus color={GOLD} className="absolute inset-0 m-auto h-[85%] w-[85%] opacity-80" />
          <span className={`absolute inset-0 grid place-items-center text-white drop-shadow-lg ${glyphClass}`} style={serif}>
            {devi.dv}
          </span>
        </>
      )}
      <span className="pointer-events-none absolute inset-0 block" style={{ boxShadow: "inset 0 0 40px rgba(10,5,8,.65)" }} />
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

function PageBackground({ color }) {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0"
        style={{ backgroundImage: `radial-gradient(ellipse at 20% 0%, ${color}55 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, #3b1030 0%, transparent 55%), linear-gradient(180deg, #1b0f18, ${NIGHT})` }}
      />
      {BG_IMAGE && (
        <div className="pointer-events-none fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${BG_IMAGE})` }} />
      )}
      <div className="pointer-events-none fixed inset-0" style={{ background: `rgba(0,0,0,${BG_VEIL})` }} />
    </>
  );
}

/* Leave VITE_API_URL empty if you use the Vite proxy (recommended in dev).
   Otherwise set it in .env, e.g. VITE_API_URL=http://localhost:8080 */
const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function getJson(path, signal) {
  const res = await fetch(`${API}${path}`, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/* First non-empty value among several possible field names */
const pick = (o, ...keys) => {
  for (const k of keys) if (o && o[k] != null && o[k] !== "") return o[k];
  return undefined;
};
const pretty = (s = "") => String(s).toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function Section({ title, children }) {
  return (
    <section className="mt-14">
      <h2 className="text-3xl md:text-4xl" style={{ ...serif, color: GOLD }}>{title}</h2>
      <div className="mt-3"><Divider /></div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Facts({ items }) {
  const shown = items.filter(([, v]) => v != null && v !== "");
  if (!shown.length) return null;
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {shown.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[#c9993a]/30 bg-[#1b1016]/75 p-5 backdrop-blur">
          <dt className="text-xs uppercase tracking-widest text-[#c9993a]">{label}</dt>
          <dd className="mt-1 text-lg text-[#f3e9d2]" style={serif}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

const Prose = ({ children }) =>
  children ? <p className="max-w-3xl whitespace-pre-line leading-relaxed text-[#f3e9d2]/85">{children}</p> : null;

export default function MahavidyaDetailPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading" });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    const ctrl = new AbortController();
    setState({ status: "loading" });

    const base = `/api/deities/${encodeURIComponent(slug)}`;
    Promise.all([
      getJson(base, ctrl.signal),
      getJson(`${base}/stories`, ctrl.signal).catch(() => []),
      getJson(`${base}/details`, ctrl.signal).catch(() => []),
      getJson(`${base}/relationships`, ctrl.signal).catch(() => []),
    ])
      .then(([deity, stories, details, rels]) => setState({ status: "ready", deity, stories, details, rels }))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setState({ status: "error", notFound: err.status === 404 });
      });

    return () => ctrl.abort();
  }, [slug, reload]);

  const local = LOOK[slug];
  const idx = ORDER.indexOf(slug);
  const accent = local?.c ?? DEFAULT_LOOK.c;

  const shell = (inner) => (
    <main className="relative min-h-screen overflow-x-hidden pt-28 text-[#f3e9d2]" style={{ ...sans, backgroundColor: NIGHT }}>
      <PageBackground color={accent} />
      <div className="relative mx-auto max-w-6xl px-5 pb-24">{inner}</div>
    </main>
  );

  const back = (
    <Link to="/mahavidya" className="inline-flex items-center gap-2 text-sm text-[#c9993a] transition hover:text-[#e7c66b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
      ← All Mahavidyas
    </Link>
  );

  /* ---------- Loading ---------- */
  if (state.status === "loading") {
    return shell(
      <div className="grid min-h-[50vh] place-items-center text-center" role="status" aria-live="polite">
        <div>
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-[#c9993a]/30 border-t-[#e7c66b]" />
          <p className="mt-5 text-lg text-[#f3e9d2]/80" style={serif}>Gathering her story…</p>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (state.status === "error") {
    return shell(
      <div className="mx-auto max-w-xl rounded-3xl border border-[#c9993a]/40 bg-[#1b1016]/80 p-10 text-center backdrop-blur">
        <h1 className="text-4xl" style={{ ...serif, color: GOLD }}>
          {state.notFound ? "Deity not found" : "Could not load this page"}
        </h1>
        <div className="mt-4 flex justify-center"><Divider /></div>
        <p className="mt-5 text-[#f3e9d2]/80">
          {state.notFound
            ? `There is no deity with the slug "${slug}" in the database. Check that the slug column matches the URL.`
            : "The server did not respond. Make sure the Spring Boot backend is running and the /api proxy or CORS is set up."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {!state.notFound && (
            <button onClick={() => setReload((n) => n + 1)} className="rounded-full bg-[#c9993a] px-6 py-2.5 font-semibold text-[#1b1016] transition hover:bg-[#e7c66b]">
              Try again
            </button>
          )}
          <Link to="/mahavidya" className="rounded-full border border-[#c9993a] px-6 py-2.5 transition hover:bg-[#c9993a]/20">
            Back to all
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Ready ---------- */
  const { deity, stories, details, rels } = state;
  const devi = {
    n: deity.name,
    dv: local?.dv ?? deity.sanskritName ?? "",
    img: local?.img ?? "",
    c: accent,
  };

  const groups = {};
  details.forEach((x) => {
    const t = pick(x, "type") || "OTHER";
    (groups[t] = groups[t] || []).push(x);
  });

  const prevSlug = idx >= 0 ? ORDER[(idx + ORDER.length - 1) % ORDER.length] : null;
  const nextSlug = idx >= 0 ? ORDER[(idx + 1) % ORDER.length] : null;
  const prev = prevSlug ? LOOK[prevSlug] : null;
  const next = nextSlug ? LOOK[nextSlug] : null;
  const number = deity.orderNumber ?? (idx >= 0 ? idx + 1 : null);

  /* Prev / All Mahavidyas / Next bar, used at both top and bottom */
  const pager = (position) => {
    const isTop = position === "top";
    return prev && next ? (
      <nav
        aria-label={isTop ? "Mahavidya navigation (top)" : "Mahavidya navigation (bottom)"}
        className={`flex flex-wrap items-center justify-between gap-3 ${
          isTop ? "" : "mt-16 border-t border-[#c9993a]/30 pt-8"
        }`}
      >
        <Link
          to={`/mahavidya/${prevSlug}`}
          className="rounded-full border border-[#c9993a] px-4 py-2 text-sm transition hover:bg-[#c9993a]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6 sm:py-2.5 sm:text-base"
        >
          ← {prev.n}
        </Link>
        {back}
        <Link
          to={`/mahavidya/${nextSlug}`}
          className="rounded-full bg-[#c9993a] px-4 py-2 text-sm font-semibold text-[#1b1016] transition hover:bg-[#e7c66b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6 sm:py-2.5 sm:text-base"
        >
          {next.n} →
        </Link>
      </nav>
    ) : (
      <div className={isTop ? "" : "mt-16"}>{back}</div>
    );
  };

  return shell(
    <>
      {/* TOP NAV */}
      {pager("top")}

      {/* HERO */}
      <section
        className="mt-6 grid gap-0 overflow-hidden rounded-3xl border border-[#c9993a]/40 bg-[#1b1016]/80 shadow-2xl backdrop-blur md:grid-cols-[minmax(260px,380px)_1fr]"
        style={{ boxShadow: `0 0 60px ${accent}44` }}
      >
        <div className="group relative p-6 md:p-8" style={{ background: `linear-gradient(160deg, ${accent}55, transparent 70%)` }}>
          <Pic
            devi={devi}
            src={deity.imageUrl}
            glyphClass="text-6xl"
            className="mx-auto aspect-[3/4] w-full max-w-xs rounded-t-[999px] rounded-b-2xl border-2 border-[#e7c66b]/70"
          />
        </div>

        <div className="flex flex-col justify-center p-8 md:p-12">
          {number && (
            <p className="text-sm tracking-widest text-[#c9993a]">
              {deity.category ? deity.category.toUpperCase() : "DEITY"} {String(number).padStart(2, "0")}
            </p>
          )}
          <h1 className="mt-2 text-5xl md:text-6xl" style={serif}>{deity.name}</h1>
          {devi.dv && (
            <p className="mt-1 text-3xl" style={{ ...serif, color: accent === "#7b7f86" ? "#c3c6cc" : accent, filter: "brightness(1.35)" }}>
              {devi.dv}
            </p>
          )}
          {(deity.englishName || deity.sanskritName) && (
            <p className="mt-3 text-lg italic" style={{ ...serif, color: GOLD }}>
              {[deity.englishName, deity.sanskritName].filter(Boolean).join("  ·  ")}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {[deity.tradition, deity.category, deity.type && pretty(deity.type)].filter(Boolean).map((b) => (
              <span key={b} className="rounded-full border border-[#c9993a]/60 px-3 py-1 text-xs tracking-wider text-[#e7c66b]">{b}</span>
            ))}
          </div>
          <p className="mt-5 max-w-lg leading-relaxed text-[#f3e9d2]/85">{deity.shortDescription}</p>
        </div>
      </section>

      {/* ABOUT */}
      {deity.description && (
        <Section title="About">
          <Prose>{deity.description}</Prose>
        </Section>
      )}

      {/* DIVINE NATURE */}
      {(deity.primaryRole || deity.divinePower || deity.spiritualMeaning || deity.teachings) && (
        <Section title="Divine nature">
          <Facts items={[["Primary role", deity.primaryRole], ["Divine power", deity.divinePower]]} />
          {deity.spiritualMeaning && (
            <div className="mt-8">
              <h3 className="text-2xl" style={{ ...serif, color: GOLD }}>Spiritual meaning</h3>
              <div className="mt-2"><Prose>{deity.spiritualMeaning}</Prose></div>
            </div>
          )}
          {deity.teachings && (
            <div className="mt-8">
              <h3 className="text-2xl" style={{ ...serif, color: GOLD }}>Teachings</h3>
              <div className="mt-2"><Prose>{deity.teachings}</Prose></div>
            </div>
          )}
        </Section>
      )}

      {/* ICONOGRAPHY */}
      {(deity.complexion || deity.numberOfArms || deity.posture || deity.appearance) && (
        <Section title="Iconography">
          <Facts items={[["Complexion", deity.complexion], ["Arms", deity.numberOfArms], ["Posture", deity.posture]]} />
          {deity.appearance && <div className="mt-6"><Prose>{deity.appearance}</Prose></div>}
        </Section>
      )}

      {/* DETAILS (weapons, ornaments, vehicles… grouped by type) */}
      {Object.entries(groups).map(([type, list]) => (
        <Section key={type} title={pretty(type)}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((x, i) => (
              <li key={x.id ?? i} className="overflow-hidden rounded-2xl border border-[#c9993a]/30 bg-[#1b1016]/75 backdrop-blur">
                {x.imageUrl && (
                  <img
                    src={x.imageUrl}
                    alt={x.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-44 w-full object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="text-2xl" style={serif}>{x.name}</h3>
                  {x.handPosition && <p className="mt-1 text-xs uppercase tracking-widest text-[#c9993a]">{x.handPosition}</p>}
                  {x.description && <p className="mt-3 text-sm leading-relaxed text-[#f3e9d2]/80">{x.description}</p>}
                  {x.symbolism && (
                    <p className="mt-3 text-sm italic leading-relaxed" style={{ ...serif, color: GOLD }}>
                      Symbolism: {x.symbolism}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ))}

      {/* WORSHIP */}
      {(deity.mantra || deity.importantTithi || deity.mainFestival || deity.worshipDescription) && (
        <Section title="Worship">
          {deity.mantra && (
            <blockquote className="mb-6 rounded-2xl border-l-4 bg-[#1b1016]/75 p-6 text-2xl italic backdrop-blur md:text-3xl" style={{ ...serif, borderColor: GOLD_D, color: GOLD }}>
              {deity.mantra}
              <footer className="mt-2 text-xs not-italic uppercase tracking-widest text-[#c9993a]" style={sans}>Mantra</footer>
            </blockquote>
          )}
          <Facts items={[["Important tithi", deity.importantTithi], ["Main festival", deity.mainFestival]]} />
          {deity.worshipDescription && <div className="mt-6"><Prose>{deity.worshipDescription}</Prose></div>}
        </Section>
      )}

      {/* STORIES */}
      {stories.length > 0 && (
        <Section title="Stories">
          <div className="space-y-4">
            {stories.map((s, i) => (
              <details key={s.id ?? i} className="group rounded-2xl border border-[#c9993a]/30 bg-[#1b1016]/75 backdrop-blur open:border-[#e7c66b]/60" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e7c66b]">
                  <span>
                    <span className="block text-2xl" style={serif}>{s.title}</span>
                    {s.summary && <span className="mt-1 block text-sm text-[#f3e9d2]/70">{s.summary}</span>}
                  </span>
                  <span className="mt-1 text-[#c9993a] transition group-open:rotate-180" aria-hidden="true">▾</span>
                </summary>
                <div className="border-t border-[#c9993a]/20 px-6 pb-6 pt-4">
                  <Prose>{s.fullStory}</Prose>
                  {s.source && <p className="mt-4 text-xs uppercase tracking-widest text-[#c9993a]">Source: {s.source}</p>}
                </div>
              </details>
            ))}
          </div>
        </Section>
      )}

      {/* RELATIONSHIPS */}
      {rels.length > 0 && (
        <Section title="Related deities">
          <ul className="grid gap-4 sm:grid-cols-2">
            {rels.map((r, i) => {
              const otherName = pick(r, "name", "otherDeityName", "deityName", "targetDeityName", "relatedDeityName");
              const otherSlug = pick(r, "slug", "otherDeitySlug", "deitySlug", "targetDeitySlug", "relatedDeitySlug");
              const kind = pick(r, "relationshipType", "type");
              return (
                <li key={r.id ?? i} className="rounded-2xl border border-[#c9993a]/30 bg-[#1b1016]/75 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center gap-2">
                    {kind && <span className="rounded-full border border-[#c9993a]/60 px-3 py-0.5 text-xs tracking-wider text-[#e7c66b]">{pretty(kind)}</span>}
                    {r.direction && <span className="text-xs uppercase tracking-widest text-[#f3e9d2]/50">{r.direction === "INCOMING" ? "← incoming" : "outgoing →"}</span>}
                  </div>
                  <h3 className="mt-3 text-2xl" style={serif}>
                    {otherSlug ? (
                      <Link to={`/mahavidya/${otherSlug}`} className="transition hover:text-[#e7c66b] hover:underline">{otherName ?? otherSlug}</Link>
                    ) : (
                      otherName
                    )}
                  </h3>
                  {r.description && <p className="mt-2 text-sm leading-relaxed text-[#f3e9d2]/75">{r.description}</p>}
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {/* BOTTOM NAV */}
      {pager("bottom")}
    </>
  );
}