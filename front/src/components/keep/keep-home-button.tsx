import { Button } from "@heroui/react";
import { Home } from "lucide-react";

export default function KeepHomeButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        isIconOnly
        color="danger"
        size="lg"
        className="rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
      >
        <Home className="w-6 h-6" />
      </Button>
    </div>
  );
} 