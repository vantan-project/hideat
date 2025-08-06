import { Plus } from "lucide-react";

export default function KeepHeader() {
  return (
    <div className="bg-gradient-to-b from-red-800 to-red-700 text-white py-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">HIDEAT</h1>
        <div className="flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          <span className="text-sm">店舗を追加する</span>
        </div>
      </div>
    </div>
  );
} 