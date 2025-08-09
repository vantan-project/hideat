import KeepCard from "./keep-card";
import { Keep } from "@/type/keep";

interface KeepCardGridProps {
  restaurants: Keep[];
  isLoading: boolean;
  selectedItems: number[];
  isSelectionMode: boolean;
  onSelect: (id: number) => void;
}

export default function KeepCardGrid({
  restaurants,
  isLoading,
  selectedItems,
  isSelectionMode,
  onSelect
}: KeepCardGridProps) {

  if (isLoading) return;

  if (restaurants.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">キープしたレストランがありません</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 pb-24">
      {restaurants.map((restaurant) => {
        const id = Number(restaurant.id);
        const isSelected = selectedItems.includes(id);

        return (
          <KeepCard
            key={id}
            restaurant={restaurant}
            isSelected={isSelected}
            isSelectionMode={isSelectionMode}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
} 