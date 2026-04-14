

import React, { useState } from "react";

function buildPath(data, key, W, H, pad) {
  if (!data.length) return "";
  const vals = data.map((d) => d[key]);
  const min = Math.min(...vals) - 5;
  const max = Math.max(...vals) + 5;
  const xStep = (W - pad * 2) / (data.length - 1);
  const yScale = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);

  return data
    .map((d, i) => {
      const x = pad + i * xStep;
      const y = yScale(d[key]);
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(" ");
}

function buildSmoothPath(data, key, W, H, pad) {
  if (!data.length) return "";
  const vals = data.map((d) => d[key]);
  const min = Math.min(...vals) - 5;
  const max = Math.max(...vals) + 5;
  const xStep = (W - pad * 2) / (data.length - 1);
  const yScale = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);

  const points = data.map((d, i) => ({
    x: pad + i * xStep,
    y: yScale(d[key]),
  }));

  return points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (p.x - prev.x) / 2;
      const cpx2 = cpx1;
      return `C ${cpx1} ${prev.y} ${cpx2} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");
}

export default function CommissionTrendsChart({ data }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const W = 600, H = 180, PAD = 24;

  const xStep = (W - PAD * 2) / (data.length - 1);
  const vals = data.map((d) => d.current);
  const min  = Math.min(...vals) - 5;
  const max  = Math.max(...vals) + 5;
  const yScale = (v) => H - PAD - ((v - min) / (max - min)) * (H - PAD * 2);

  const currentPath = buildSmoothPath(data, "current", W, H, PAD);
  const prevPath    = buildSmoothPath(data, "prev",    W, H, PAD);

  // Area fill
  const lastX = PAD + (data.length - 1) * xStep;
  const areaPath = `${currentPath} L ${lastX} ${H - PAD} L ${PAD} ${H - PAD} Z`;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Commission Trends</h3>
          <p className="text-xs text-slate-400 mt-0.5">Daily volume comparison over 30 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 inline-block" />
            Current
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            Previous
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: "320px" }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#1e3a6e" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1e3a6e" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <line
              key={i}
              x1={PAD} x2={W - PAD}
              y1={PAD + f * (H - PAD * 2)}
              y2={PAD + f * (H - PAD * 2)}
              stroke="#f1f5f9" strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Previous line */}
          <path d={prevPath}    fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3" />

          {/* Current line */}
          <path d={currentPath} fill="none" stroke="#1e3a6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Hover dots + tooltip zones */}
          {data.map((d, i) => {
            const x = PAD + i * xStep;
            const y = yScale(d.current);
            const isHover = hoverIdx === i;
            return (
              <g key={i}>
                {/* Invisible hit area */}
                <rect
                  x={x - xStep / 2} y={0}
                  width={xStep} height={H}
                  fill="transparent"
                  onMouseEnter={() => setHoverIdx(i)}
                />
                {isHover && (
                  <>
                    <line x1={x} x2={x} y1={PAD} y2={H - PAD} stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx={x} cy={y} r={5} fill="#1e3a6e" stroke="white" strokeWidth="2" />
                    {/* Tooltip */}
                    <rect
                      x={x - 38} y={y - 32}
                      width={76} height={24}
                      rx={6}
                      fill="#1e3a6e"
                    />
                    <text
                      x={x} y={y - 16}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ${(d.current * 1000).toLocaleString()}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.filter((_, i) => i % 2 === 0).map((d, i) => (
            <text
              key={i}
              x={PAD + i * xStep * 2}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#94a3b8"
              fontWeight="500"
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}