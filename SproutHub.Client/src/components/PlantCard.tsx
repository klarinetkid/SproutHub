import { max, parseISO } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { getApiReadings } from "../api/generated/api";
import { type MoistureReadingDto, type TblPlant } from "../api/generated/model";
import MoistureChart from "./MoistureChart";
import PlantCardFooter from "./PlantCardFooter";
import PlantCardHeader from "./PlantCardHeader";

interface PlantCardProps {
  plant: TblPlant;
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

  const lastUpdate = useMemo(() => {
    if (!data?.length) return undefined;

    const maxDate = max(data.map((d) => parseISO(d.date)));

    return data.find((d) => parseISO(d.date).getTime() === maxDate.getTime());
  }, [data]);

  return (
    <div className="rounded-2xl  border-light border p-5 shadow-lg flex flex-col gap-4">
      <PlantCardHeader plant={plant} lastUpdate={lastUpdate} />

      {data && (
        <>
          <MoistureChart data={data} />
          <PlantCardFooter plant={plant} data={data} />
        </>
      )}
    </div>
  );
}
