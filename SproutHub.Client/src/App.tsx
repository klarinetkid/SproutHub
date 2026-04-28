import PlantList from "./components/PlantList";

function App() {
  return (
    <div className="flex items-start justify-center bg-gray-100 h-screen w-screen">
      <div className="w-5xl rounded-lg mt-10 bg-white px-8 py-6 border-black/20 border">
        <h1 className="font-bold mb-4">SproutHub</h1>
        <PlantList />
      </div>
    </div>
  );
}

export default App;
