import { Card, CardBody, CardFooter } from "@heroui/react";
import { Check } from "lucide-react";

import Image from "next/image";
import { Keep } from "@/type/keep";

interface KeepCardProps {
    restaurant: Keep;
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
            className={`w-full relative ${isSelectionMode ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
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
            <div
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`CardBody ${id} clicked, isSelectionMode:`, isSelectionMode);
                    if (isSelectionMode) {
                        onSelect(id);
                    }
                }}
            >
                <div className="aspect-square overflow-hidden">
                    <Image
                        alt={String(restaurant.id)}
                        className="w-full h-full object-cover"
                        src={restaurant.url}
                        width={100}
                        height={100}
                    />
                </div>
                {isSelectionMode && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                        {isSelected ? (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                                <Check className="w-8 h-8 text-white" strokeWidth={3} />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
            <CardFooter className="px-3 py-2 flex justify-center flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 text-center">{restaurant.name}</p>
            </CardFooter>
        </Card>
    );
}