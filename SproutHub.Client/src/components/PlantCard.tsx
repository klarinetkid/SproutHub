import { useEffect, useState } from "react";
import { getApiReadings } from "../api/generated/api";
import { type MoistureReadingDto, type VwPlant } from "../api/generated/model";
import MoistureChart from "./MoistureChart";
import PlantCardFooter from "./PlantCardFooter";
import PlantCardHeader from "./PlantCardHeader";
import LoadingSpinner from "./ui/LoadingSpinner";

interface PlantCardProps {
  plant: VwPlant;
  showFrom: Date;
}

export default function PlantCard({ plant, showFrom }: PlantCardProps) {
  const [data, setData] = useState<MoistureReadingDto[] | null>(null);

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
    <div className="w-3xl rounded-2xl bg-white border-light border p-5 shadow-lg flex flex-col gap-4">
      <PlantCardHeader plant={plant} />
      {data ? (
        <>
          <MoistureChart data={data} />
          <PlantCardFooter plant={plant} data={data} />
        </>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
