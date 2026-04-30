import { isAfter, startOfDay } from "date-fns";
import { Calendar, Leaf, TrendingDown, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import type { MoistureReadingDto, TblPlant } from "../api/generated/model";
import { cn } from "../lib/utils";

interface PlantCardFooterProps {
  plant: TblPlant;
  data: MoistureReadingDto[];
}

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

export default function PlantCardFooter({ plant, data }: PlantCardFooterProps) {
  const todayMidnight = startOfDay(new Date());

  const dataToday = useMemo(
    () =>
      data
        ? data
            .filter((d) => isAfter(d.date, todayMidnight))
            .map((d) => d.moistureReading)
        : [],
    [data],
  );

  const todayMin = useMemo(() => Math.min(...dataToday), [dataToday]);
  const todayMax = useMemo(() => Math.max(...dataToday), [dataToday]);

  return (
    <div className="flex rounded-xl bg-green-500/12 py-4">
      <FooterInfo icon={Leaf} label="Plant ID" value={plant.id} />
      <FooterInfo
        icon={Calendar}
        label="Today's Range"
        value={`${Math.floor(todayMin * 10) / 10}% - ${Math.floor(todayMax * 10) / 10}%`}
        className="border-x border-gray-400"
      />
      <FooterInfo
        icon={TrendingDown}
        label="Trend"
        value={`${Math.floor((todayMax - todayMin) * 10) / 10} pp difference today`}
      />
    </div>
  );
}
