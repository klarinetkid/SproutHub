import { differenceInDays, format } from "date-fns";
import { Clock, Droplet, Droplets } from "lucide-react";
import { useMemo } from "react";
import type { VwPlant } from "../api/generated/model";

interface PlantCardHeaderProps {
  plant: VwPlant;
}

export default function PlantCardHeader({ plant }: PlantCardHeaderProps) {
  const daysWateredAgo = useMemo(
    () =>
      plant.lastSpikeDate
        ? differenceInDays(new Date(), new Date(plant.lastSpikeDate))
        : null,
    [plant.lastSpikeDate],
  );

  return (
    <div className="flex justify-between">
      <div className="flex flex-col justify-between">
        <span className="font-bold text-3xl">
          {plant.displayName || `Plant ${plant.id}`}
        </span>
        <div className="flex gap-1 items-center">
          {daysWateredAgo && (
            <>
              <Droplet className="w-4 h-4 text-blue-600 stroke-3 fill-blue-500" />
              <span className="text-gray-700">
                Watered{" "}
                {daysWateredAgo === 0
                  ? "today"
                  : `${daysWateredAgo} day${daysWateredAgo === 1 ? "" : "s"} ago`}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        {plant.lastMoistureReading && (
          <div
            className="text-2xl text-[#0000ff] font-bold flex gap-2 items-center"
            style={{
              opacity: 0.4 + plant.lastMoistureReading / 100 / 2,
            }}
          >
            <Droplets className="w-6 h-6 stroke-3" />
            {plant.lastMoistureReading}%
          </div>
        )}
        {plant.lastReadingDate && (
          <div className="flex items-center gap-1 text-black/70 text-sm">
            <Clock className="w-4 h-4" />
            <span className="flex items-center">
              Last updated: {format(plant.lastReadingDate, "h:mm aaa")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
