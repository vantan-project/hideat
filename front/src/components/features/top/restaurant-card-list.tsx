import { ImageIndexResponse } from "@/api/image-index";
import { RestaurantCard } from "./restaurant-card";
import { useEffect, useRef } from "react";

type Props = {
  images: ImageIndexResponse;
  isLoading?: boolean;
};

export function RestaurantCardList({ images, isLoading = false }: Props) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, [isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="snap-x snap-mandatory flex [&>*]:flex-shrink-0 overflow-x-auto px-[calc((100vw-300px)*0.375)]"
    >
      {isLoading ? (
        <>
          {Array.from({ length: 20 }).map((_, index) => (
            <RestaurantCard key={index} isLoading={true} />
          ))}
        </>
      ) : (
        <>
          {images.map((image, index) => (
            <RestaurantCard
              key={image.restaurant.id + String(index)}
              image={image}
            />
          ))}
        </>
      )}
    </div>
  );
}
