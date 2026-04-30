import { Sprout } from "lucide-react";
import PlantList from "./components/PlantList";
//bg-white border-black/20 border shadow-lg
function App() {
  return (
    <div className="flex items-start justify-center  h-screen w-screen bg-linear-to-b from-green-100 to-white">
      <div className="rounded-2xl mt-10  px-10 py-4 ">
        <div className="mb-6 flex items-center gap-2">
          <Sprout className="w-10 h-10 text-green-700" />
          <span className="font-bold text-4xl">SproutHub</span>
        </div>
        <PlantList />
      </div>
    </div>
  );
}

export default App;
