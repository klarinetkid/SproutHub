import { LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { getApiReadings } from "../api/generated/api";
import { type TblMoistureReading, type TblPlant } from "../api/generated/model";

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

  return (
    <div className="rounded-lg bg-gray-100/50 border-gray-100 border pt-2">
      <span className="font-semibold ms-4">
        {plant.displayName || `Plant ${plant.id}`}
      </span>

      {data === null ? (
        "Loading..."
      ) : (
        <LineChart
          xAxis={[
            {
              data: data.map((d) => new Date(d.date!)),
              scaleType: "time",
            },
          ]}
          series={[
            {
              data: data.map((d) => d.moistureReading!),
              label: "Moisture reading",
              color: "red",
            },
          ]}
          // width={600}
          height={300}
          hideLegend
        />
      )}
    </div>
  );
}
