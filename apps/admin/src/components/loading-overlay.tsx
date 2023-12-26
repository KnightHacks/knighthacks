import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
