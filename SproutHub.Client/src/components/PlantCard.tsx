import {
  Calendar,
  Clock,
  Dot,
  Droplet,
  Leaf,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
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

interface FooterInfoProps {
  label: string;
  value: string | number | undefined;
  icon: LucideIcon;
}

function FooterInfo({ label, value, icon: Icon }: FooterInfoProps) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <Icon className="w-10 h-10 p-2 rounded-full text-white bg-green-900" />
      <div className="flex flex-col items-start">
        <span>{label}</span>
        <span className="text-gray-700">{value}</span>
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

  if (!data) return <></>;

  const chartData = data.map((d) => ({
    date: new Date(d.date!).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: d.moistureReading!,
  }));

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
        <div className="flex flex-col justify-between">
          <div className="flex font-semibold text-green-600 bg-green-100/60 border-green-100 border rounded-full px-2 py-1 text-center">
            <Dot className="w-6 h-6 stroke-5" />
            Healthy
          </div>
          <div className="flex items-center gap-1 text-black/70 text-sm">
            <Clock className="w-4 h-4" />
            Last updated:
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
                  <stop offset="0%" stopColor="#ff2d2d" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#ff2d2d" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#ff2d2d"
                strokeWidth={3}
                fill={gradientUrl}
                fillOpacity={1}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>

          <div className="flex rounded-xl bg-green-500/12 font-semibold p-4">
            <FooterInfo icon={Leaf} label="Plant ID" value={plant.id} />
            <FooterInfo
              icon={Calendar}
              label="Today's Range"
              value={plant.id}
            />
            <FooterInfo
              icon={TrendingDown}
              label="Trend"
              value="-X% since time"
            />
          </div>
        </>
      )}
    </div>
  );
}
