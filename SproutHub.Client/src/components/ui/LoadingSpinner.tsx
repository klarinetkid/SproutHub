import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-20 w-20 stroke-1 animate-spin text-green-700" />
    </div>
  );
}
