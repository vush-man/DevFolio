import React, { useState } from 'react';
import { TelemetryPoint } from '../../types';

export interface TelemetryChartProps {
  data: TelemetryPoint[];
  type?: 'latency' | 'throughput' | 'errors';
  height?: number;
  className?: string;
}

export const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  type = 'latency',
  height = 240,
  className = ''
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className={`flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs ${className}`}
      >
        <span>No telemetry data collected yet</span>
        <span className="text-[11px] text-slate-500 mt-1">Data points will stream here when workload executes</span>
      </div>
    );
  }

  const padding = { top: 20, right: 24, bottom: 32, left: 48 };
  const width = 800; // SVG viewBox coordinate width
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const pointsCount = Math.max(data.length, 1);
  const getX = (index: number) => padding.left + (index / Math.max(pointsCount - 1, 1)) * chartWidth;

  // Compute Scales
  let maxY = 100;
  if (type === 'latency') {
    maxY = Math.max(50, ...data.map(d => Math.max(d.p99Ms, d.p95Ms, d.p50Ms, 10))) * 1.15;
  } else if (type === 'throughput') {
    maxY = Math.max(20, ...data.map(d => Math.max(d.rps, d.status2xx, 10))) * 1.2;
  } else {
    // Errors
    maxY = Math.max(10, ...data.map(d => Math.max(d.errorRate, d.status5xx, 5))) * 1.2;
  }

  const getY = (val: number) => padding.top + chartHeight - (Math.min(val, maxY) / maxY) * chartHeight;

  // Build path strings
  const buildPath = (accessor: (d: TelemetryPoint) => number) => {
    return data.reduce((acc, d, i) => {
      const x = getX(i);
      const y = getY(accessor(d));
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  const buildAreaPath = (accessor: (d: TelemetryPoint) => number) => {
    const linePath = buildPath(accessor);
    if (!linePath) return '';
    const firstX = getX(0);
    const lastX = getX(data.length - 1);
    const bottomY = padding.top + chartHeight;
    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  };

  // Y-ticks
  const yTicks = [0, maxY * 0.25, maxY * 0.5, maxY * 0.75, maxY];

  const hoveredPoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* Legend */}
      <div className="flex items-center justify-between text-xs mb-2 px-1">
        <div className="flex items-center gap-4">
          {type === 'latency' && (
            <>
              <span className="flex items-center gap-1.5 text-sky-500 font-mono">
                <span className="w-2.5 h-0.5 bg-sky-500 rounded" /> p50 (Median)
              </span>
              <span className="flex items-center gap-1.5 text-amber-500 font-mono">
                <span className="w-2.5 h-0.5 bg-amber-500 rounded" /> p95
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-mono">
                <span className="w-2.5 h-0.5 bg-rose-500 rounded" /> p99 (Tail)
              </span>
            </>
          )}
          {type === 'throughput' && (
            <>
              <span className="flex items-center gap-1.5 text-sky-500 font-mono">
                <span className="w-2.5 h-0.5 bg-sky-500 rounded" /> Requests / Sec
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500 font-mono">
                <span className="w-2.5 h-0.5 bg-emerald-500 rounded" /> 2xx OK
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-mono">
                <span className="w-2.5 h-0.5 bg-rose-500 rounded" /> 5xx Fail
              </span>
            </>
          )}
        </div>

        {hoveredPoint && (
          <div className="text-xs font-mono text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            t={hoveredPoint.second}s |{' '}
            {type === 'latency' ? (
              <>p50: <span className="text-sky-500 font-bold">{hoveredPoint.p50Ms}ms</span>, p95: <span className="text-amber-500 font-bold">{hoveredPoint.p95Ms}ms</span>, p99: <span className="text-rose-500 font-bold">{hoveredPoint.p99Ms}ms</span></>
            ) : (
              <>RPS: <span className="text-sky-500 font-bold">{hoveredPoint.rps}</span>, 2xx: <span className="text-emerald-500 font-bold">{hoveredPoint.status2xx}</span>, 5xx: <span className="text-rose-500 font-bold">{hoveredPoint.status5xx}</span></>
            )}
          </div>
        )}
      </div>

      {/* SVG Viewport */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible select-none"
        style={{ height }}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="skyArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="emeraldArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal gridlines */}
        {yTicks.map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeDasharray={idx === 0 ? '' : '3 3'}
                strokeWidth={1}
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
              >
                {type === 'latency' ? `${Math.round(val)}ms` : Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* X-axis ticks */}
        {data.map((d, i) => {
          // Render tick every 5 or 10 points
          const step = Math.max(1, Math.floor(data.length / 6));
          if (i % step !== 0 && i !== data.length - 1) return null;
          const x = getX(i);
          return (
            <g key={i}>
              <line
                x1={x}
                y1={padding.top + chartHeight}
                x2={x}
                y2={padding.top + chartHeight + 4}
                stroke="currentColor"
                className="text-slate-300 dark:text-slate-700"
              />
              <text
                x={x}
                y={padding.top + chartHeight + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500"
              >
                {d.second}s
              </text>
            </g>
          );
        })}

        {/* Chart Series Lines */}
        {type === 'latency' ? (
          <>
            {/* p50 Area */}
            <path d={buildAreaPath(d => d.p50Ms)} fill="url(#skyArea)" />
            {/* p99 Line */}
            <path
              d={buildPath(d => d.p99Ms)}
              fill="none"
              stroke="#ef4444"
              strokeWidth={1.8}
              strokeDasharray="4 2"
            />
            {/* p95 Line */}
            <path
              d={buildPath(d => d.p95Ms)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth={2}
            />
            {/* p50 Line */}
            <path
              d={buildPath(d => d.p50Ms)}
              fill="none"
              stroke="#0284c7"
              strokeWidth={2.5}
            />
          </>
        ) : (
          <>
            {/* Throughput Area */}
            <path d={buildAreaPath(d => d.rps)} fill="url(#skyArea)" />
            {/* 2xx Line */}
            <path
              d={buildPath(d => d.status2xx)}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
            />
            {/* 5xx Line */}
            <path
              d={buildPath(d => d.status5xx)}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
            />
            {/* Total RPS Line */}
            <path
              d={buildPath(d => d.rps)}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth={2.5}
            />
          </>
        )}

        {/* Interactive Hover Crosshair */}
        {hoverIndex !== null && (
          <g>
            <line
              x1={getX(hoverIndex)}
              y1={padding.top}
              x2={getX(hoverIndex)}
              y2={padding.top + chartHeight}
              stroke="currentColor"
              className="text-slate-400 dark:text-slate-300"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            <circle
              cx={getX(hoverIndex)}
              cy={getY(type === 'latency' ? data[hoverIndex].p95Ms : data[hoverIndex].rps)}
              r={4}
              className="fill-sky-500 stroke-white dark:stroke-slate-900"
              strokeWidth={2}
            />
          </g>
        )}

        {/* Transparent overlay for mouse hover detection */}
        {data.map((_, i) => {
          const x = getX(i);
          const colWidth = chartWidth / pointsCount;
          return (
            <rect
              key={i}
              x={x - colWidth / 2}
              y={padding.top}
              width={colWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(i)}
            />
          );
        })}
      </svg>
    </div>
  );
};
