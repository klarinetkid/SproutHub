import { useEffect, useMemo, useState } from "react";
import { getApiPlants } from "../api/generated/api";
import type { TblPlant } from "../api/generated/model";
import PlantCard from "./PlantCard";

export default function PlantList() {
  const [plants, setPlants] = useState<TblPlant[] | null>(null);

  const showFrom = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getApiPlants();
      console.log(data);
      setPlants(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {plants?.map((p) => (
        <PlantCard key={p.id} plant={p} showFrom={showFrom} />
      ))}

      {/* {plants?.map((p) => (
        <PlantCard key={p.id} plant={p} showFrom={showFrom} />
      ))} */}
    </div>
  );
}
