/* ===== Shakti Mandala: Adi Shakti at the centre, 10 Mahavidyas on the circle ===== */
const MANDALA_R = 36;                 // radius of the devi circle (viewBox units)
const NODE_POS = DEVIS.map((_, i) => {
  const a = ((i * 360) / DEVIS.length - 90) * (Math.PI / 180);
  return {
    x: 50 + MANDALA_R * Math.cos(a),
    y: 50 + MANDALA_R * Math.sin(a),
    rx: 50 + 16 * Math.cos(a),        // ray start (outside the lotus)
    ry: 50 + 16 * Math.sin(a),
    ex: 50 + (MANDALA_R - 7) * Math.cos(a), // ray end (edge of node)
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
        {/* ---------- Rings, rays, energy particles ---------- */}
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

          {/* soft halo that takes the selected devi's colour */}
          <circle cx="50" cy="50" r="49" fill="url(#sm-halo)" style={{ transition: "all .6s" }} />

          {/* outer dotted ring (slow spin) */}
          <circle className="sm-svg-spin" cx="50" cy="50" r="47.5" fill="none" stroke={GOLD_D} strokeOpacity=".55" strokeWidth=".35" strokeDasharray=".4 1.6" strokeLinecap="round" />
          {/* main devi orbit (counter spin) */}
          <circle className="sm-svg-spin-rev" cx="50" cy="50" r={MANDALA_R} fill="none" stroke={GOLD} strokeOpacity=".35" strokeWidth=".3" strokeDasharray="3 2" />
          {/* inner thin ring */}
          <circle cx="50" cy="50" r="22" fill="none" stroke={GOLD_D} strokeOpacity=".3" strokeWidth=".25" />

          {/* the 10 rays: Adi Shakti splitting into 10 energies */}
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
                {/* energy particles travelling centre -> devi */}
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

          {/* 10-petal lotus: one petal per devi colour */}
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

        {/* ---------- Centre: Adi Shakti ---------- */}
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
            <div className="mt-0.5 text-[8px] font-semibold tracking-wide text-[#2a1208] sm:text-xs" style={serif}>आदि शक्ति</div>
            <div className="hidden text-[8px] uppercase tracking-[0.2em] text-[#2a1208]/80 sm:block">Adi Shakti</div>
          </div>
        </div>

        {/* ---------- 10 Mahavidya nodes ---------- */}
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