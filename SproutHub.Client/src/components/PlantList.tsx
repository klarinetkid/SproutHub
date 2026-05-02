import { useEffect, useMemo, useState } from "react";
import { getApiPlants } from "../api/generated/api";
import type { VwPlant } from "../api/generated/model";
import { cn } from "../lib/utils";
import PlantCard from "./PlantCard";

export default function PlantList() {
  const [plants, setPlants] = useState<VwPlant[] | null>(null);

  const showFrom = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApiPlants();
      setPlants(data);
    };

    fetchData();
  }, []);

  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1",
        plants && plants.length > 1 ? "lg:grid-cols-2" : "",
      )}
    >
      {plants?.map((p, i) => (
        <PlantCard key={i} plant={p} showFrom={showFrom} />
      ))}
    </div>
  );
}
