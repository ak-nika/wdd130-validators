import { Loader2 } from "lucide-react";

const Loader = ({ text }: { text?: string }) => {
  return (
    <div className="relative flex-center">
      <Loader2 className="animate-spin" />
      <span className="font-semibold">Loading {text}...</span>
    </div>
  );
};

export default Loader;
