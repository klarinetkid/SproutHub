import { isAfter, startOfDay } from "date-fns";
import {
  Calendar,
  Leaf,
  TrendingDown,
  Triangle,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import type { MoistureReadingDto, VwPlant } from "../api/generated/model";
import { cn } from "../lib/utils";

interface PlantCardFooterProps {
  plant: VwPlant;
  data: MoistureReadingDto[];
}

interface FooterInfoProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  border?: boolean;
}

function FooterInfo({ label, value, icon: Icon, border }: FooterInfoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 flex-1 px-0 py-2 lg:px-4 lg:py-0",
        border ? "border-y lg:border-x lg:border-y-0 border-gray-400" : "",
      )}
    >
      <Icon className="w-10 h-10 p-2 rounded-full text-white bg-green-900 overflow-visible" />
      <div className="flex flex-col items-start">
        <span className="font-semibold">{label}</span>
        <span className="text-gray-500">{value ?? "-"}</span>
      </div>
    </div>
  );
}

export default function PlantCardFooter({ plant, data }: PlantCardFooterProps) {
  const todayMidnight = startOfDay(new Date());

  const dataToday = useMemo(
    () =>
      data?.length > 0
        ? data
            .filter((d) => isAfter(d.date, todayMidnight))
            .map((d) => d.moistureReading)
        : null,
    [data],
  );

  const todayMin = useMemo(
    () => (dataToday ? Math.min(...dataToday) : null),
    [dataToday],
  );
  const todayMax = useMemo(
    () => (dataToday ? Math.max(...dataToday) : null),
    [dataToday],
  );

  const hasData = (todayMin || todayMin === 0) && (todayMax || todayMax === 0);

  const getTodaysRange = () => {
    if (!hasData) return;

    return `${todayMin.toFixed(1)}% - ${todayMax.toFixed(1)}%`;
  };

  const getTrend = () => {
    if (!hasData) return;

    return (
      <span className="flex gap-0 items-center">
        <Triangle className="w-3 h-3 stroke-3" />
        {`${(todayMax - todayMin).toFixed(1)} pp today`}
      </span>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row rounded-xl bg-green-500/12 px-2 lg:px-0 lg:py-4">
      <FooterInfo icon={Leaf} label="Plant ID" value={plant.id} />
      <FooterInfo
        icon={Calendar}
        label="Today's Range"
        value={getTodaysRange()}
        border
      />
      <FooterInfo icon={TrendingDown} label="Trend" value={getTrend()} />
    </div>
  );
}
