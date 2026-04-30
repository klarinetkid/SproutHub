import { format, isAfter, max, parseISO, startOfDay } from "date-fns";
import {
  Calendar,
  Clock,
  Droplet,
  Droplets,
  Leaf,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getApiReadings } from "../api/generated/api";
import { type TblMoistureReading, type TblPlant } from "../api/generated/model";
import { cn } from "../lib/utils";

interface FooterInfoProps {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
  className?: string;
}

function FooterInfo({ label, value, icon: Icon, className }: FooterInfoProps) {
  return (
    <div className={cn("flex items-center gap-3 flex-1 px-4", className)}>
      <Icon className="w-10 h-10 p-2 rounded-full text-white bg-green-900" />
      <div className="flex flex-col items-start">
        <span className="font-semibold">{label}</span>
        <span className="text-gray-500">{value}</span>
      </div>
    </div>
  );
}

interface PlantCardProps {
  plant: TblPlant;
  showFrom: Date;
}

export default function PlantCard({ plant, showFrom }: PlantCardProps) {
  const [data, setData] = useState<TblMoistureReading[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApiReadings({
        plantId: plant.id,
        from: showFrom.toISOString(),
      });
      setData(data);
    };

    fetchData();
  }, []);

  const gradientId = useId().replace(/:/g, "");
  const gradientUrl =
    typeof window !== "undefined"
      ? `url(${window.location.href.split("#")[0]}#${gradientId})`
      : `url(#${gradientId})`;

  const todayMidnight = startOfDay(new Date());

  const dataToday = useMemo(() => {
    return data
      ? data
          .filter((d) => d.date && isAfter(d.date, todayMidnight))
          .map((d) => d.moistureReading ?? 0)
      : [0];
  }, [data]);

  const todayMin = useMemo(() => Math.min(...dataToday), [dataToday]);
  const todayMax = useMemo(() => Math.max(...dataToday), [dataToday]);
  const lastUpdate = useMemo(() => {
    if (!data?.length) return undefined;

    const withDates = data.filter(
      (d): d is typeof d & { date: string } => !!d.date,
    );

    if (!withDates.length) return undefined;

    const maxDate = max(withDates.map((d) => parseISO(d.date)));

    return withDates.find(
      (d) => parseISO(d.date).getTime() === maxDate.getTime(),
    );
  }, [data]);

  if (!data?.length) return <></>;

  const chartData = data.map((d) => ({
    date: new Date(d.date!).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: d.moistureReading!,
  }));

  const renderLastDot = (props: any) => {
    const { cx, cy, index } = props;

    // only render for the last point
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

  return (
    <div className="rounded-2xl  border-light border p-5 shadow-lg flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-col justify-between">
          <span className="font-bold text-3xl">
            {plant.displayName || `Plant ${plant.id}`}
          </span>
          <div className="flex gap-1 items-center">
            <Droplet className="w-4 h-4 text-blue-600 stroke-3 fill-blue-500" />
            <span className="text-gray-700">Live moisture reading</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <div
            className="text-2xl text-[#0000ff] font-bold flex gap-2 items-center"
            style={{
              opacity: 0.4 + (lastUpdate?.moistureReading ?? 0) / 100 / 2,
            }}
          >
            <Droplets className="w-6 h-6 stroke-3" />
            {lastUpdate?.moistureReading}%
          </div>
          <div className="flex items-center gap-1 text-black/70 text-sm">
            <Clock className="w-4 h-4" />
            Last updated:{" "}
            {lastUpdate?.date && format(lastUpdate.date, "h:mm aaa")}
          </div>
        </div>
      </div>

      {data !== null && (
        <>
          <ResponsiveContainer width="100%" height={380} className="">
            <AreaChart
              data={chartData}
              className="border-gray-300/70 shadow-sm rounded-xl py-2"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff2d2d" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#ff2d2d" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="date"
                interval={Math.ceil(chartData.length / 7)}
              />
              <YAxis domain={[0, 100]} />
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

          <div className="flex rounded-xl bg-green-500/12 py-4">
            <FooterInfo icon={Leaf} label="Plant ID" value={plant.id} />
            <FooterInfo
              icon={Calendar}
              label="Today's Range"
              value={`${Math.floor((todayMin ?? 0) * 10) / 10}% - ${Math.floor((todayMax ?? 0) * 10) / 10}%`}
              className="border-x border-gray-400"
            />
            <FooterInfo
              icon={TrendingDown}
              label="Trend"
              value={`${Math.floor((todayMax - todayMin) * 10) / 10}% difference today`}
            />
          </div>
        </>
      )}
    </div>
  );
}
