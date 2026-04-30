import { format } from "date-fns";
import { Clock, Droplet, Droplets } from "lucide-react";
import type { MoistureReadingDto, TblPlant } from "../api/generated/model";

interface PlantCardHeaderProps {
  plant: TblPlant;
  lastUpdate: MoistureReadingDto | undefined;
}

export default function PlantCardHeader({
  plant,
  lastUpdate,
}: PlantCardHeaderProps) {
  return (
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

      {lastUpdate && (
        <div className="flex flex-col items-end justify-between">
          <div
            className="text-2xl text-[#0000ff] font-bold flex gap-2 items-center"
            style={{
              opacity: 0.4 + lastUpdate.moistureReading / 100 / 2,
            }}
          >
            <Droplets className="w-6 h-6 stroke-3" />
            {lastUpdate.moistureReading}%
          </div>
          <div className="flex items-center gap-1 text-black/70 text-sm">
            <Clock className="w-4 h-4" />
            <span className="flex items-center">
              Last updated: {format(lastUpdate.date, "h:mm aaa")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
