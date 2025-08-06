import { Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Check } from "lucide-react";
import { type KeepRestaurant } from "@/api/keep-index";

interface KeepCardProps {
  restaurant: KeepRestaurant;
  isSelected: boolean;
  isSelectionMode: boolean;
  onSelect: (id: number) => void;
}

export default function KeepCard({ 
  restaurant, 
  isSelected, 
  isSelectionMode, 
  onSelect 
}: KeepCardProps) {
  const id = Number(restaurant.id);

  return (
    <Card
      key={id}
      className={`w-full bg-black/50 relative ${isSelectionMode ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(`Card ${id} clicked, isSelectionMode:`, isSelectionMode);
        if (isSelectionMode) {
          onSelect(id);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (isSelectionMode) {
            onSelect(id);
          }
        }
      }}
      role={isSelectionMode ? "button" : undefined}
      tabIndex={isSelectionMode ? 0 : undefined}
      style={{ 
        userSelect: 'none',
        outline: isSelectionMode ? 'none' : undefined
      }}
    >
      <CardBody 
        className="p-0 flex-1 aspect-square overflow-hidden"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log(`CardBody ${id} clicked, isSelectionMode:`, isSelectionMode);
          if (isSelectionMode) {
            onSelect(id);
          }
        }}
      >
        <Image
          alt={restaurant.name}
          className="w-full h-full object-cover rounded-t-lg"
          src={restaurant.image}
          radius="none"
        />
        {isSelectionMode && (
          <div className="absolute inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center rounded-t-lg z-10">
            {isSelected ? (
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
              </div>
            ) : null}
          </div>
        )}
        {/* デバッグ情報 */}
        {isSelectionMode && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-1 rounded">
            {isSelected ? '✓' : '○'}
          </div>
        )}
      </CardBody>
      <CardFooter className="px-3 py-2 flex justify-center flex-shrink-0">
        <p className="text-sm font-medium text-gray-900 text-center">{restaurant.name}</p>
      </CardFooter>
    </Card>
  );
} 