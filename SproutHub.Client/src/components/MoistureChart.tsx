import { useId, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MoistureReadingDto } from "../api/generated/model";

interface MoistureChartProps {
  data: MoistureReadingDto[];
}

export default function MoistureChart({ data }: MoistureChartProps) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: new Date(d.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: d.moistureReading,
      })),
    [data],
  );

  const renderLastDot = ({ cx, cy, index }: any) => {
    if (index !== chartData.length - 1) return null;

    return (
      <g>
        <circle cx={cx} cy={cy} r={14} fill="#ff2d2d" opacity={0.15} />
        <circle cx={cx} cy={cy} r={10} fill="#ff2d2d" />
        <circle cx={cx} cy={cy} r={8} fill="#fff" />
        <circle cx={cx} cy={cy} r={6} fill="#ff2d2d" />
      </g>
    );
  };

  const gradientId = useId().replace(/:/g, "");
  const gradientUrl =
    typeof window !== "undefined"
      ? `url(${window.location.href.split("#")[0]}#${gradientId})`
      : `url(#${gradientId})`;

  return (
    <div className="p-2">
      <ResponsiveContainer width="100%" height={228} className="">
        <AreaChart
          data={chartData}
          className="border-gray-300/70 shadow-sm rounded-xl"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff2d2d" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#ff2d2d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="date" interval={Math.ceil(chartData.length / 7)} />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => (value === 0 ? "" : value)}
          />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#ff2d2d"
            strokeWidth={3}
            fill={gradientUrl}
            fillOpacity={1}
            dot={renderLastDot}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
