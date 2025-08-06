"use client";

import {
  imageIndex,
  ImageIndexRequest,
  ImageIndexResponse,
} from "@/api/image-index";
import { RestaurantCardList } from "@/components/features/top/restaurant-card-list";
import { CategorySelect } from "@/components/shared/category-select";
import { Button, Select, SelectItem } from "@heroui/react";
import clsx from "clsx";
import { Shuffle } from "lucide-react";
import { useEffect, useState } from "react";

export default function () {
  const [search, setSearch] = useState<ImageIndexRequest>({
    latitude: 0,
    longitude: 0,
    categoryId: null,
    radius: 1000,
    limit: 20,
  });
  const [images, setImages] = useState<ImageIndexResponse>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setSearch({
        ...search,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
    });
  }, []);

  const indexApi = async () => {
    setIsLoading(true);
    const res = await imageIndex(search).finally(() => setIsLoading(false));
    setImages(res);
  };

  useEffect(() => {
    if (!search.latitude || !search.longitude) return;
    setIsLoading(true);
    indexApi();
  }, [search]);

  const contentPaddingClassName = "px-4";

  const distanceOptions = [
    { key: "1000", label: "1.0km以内" },
    { key: "1500", label: "1.5km以内" },
    { key: "2000", label: "2.0km以内" },
    { key: "2500", label: "2.5km以内" },
    { key: "3000", label: "3.0km以内" },
  ];

  return (
    <div>
      <div
        className={clsx(contentPaddingClassName, "fixed top-28 w-full z-30")}
      >
        <Button
          onPress={() => indexApi()}
          className="w-full bg-primary text-white font-bold"
          startContent={<Shuffle />}
        >
          シャッフル
        </Button>
        <div className="grid grid-cols-[2fr_1fr] gap-2 pt-2">
          <CategorySelect
            selectedCategoryId={search.categoryId}
            setSelectedCategoryId={(ids) => {
              setSearch({ ...search, categoryId: ids });
            }}
          />
          <Select
            label="距離"
            size="sm"
            items={distanceOptions}
            value={search.radius}
            selectedKeys={new Set([String(search.radius)])}
            onSelectionChange={(keys) => {
              const radius = Number(Array.from(keys)[0]);
              setSearch({ ...search, radius });
            }}
          >
            {distanceOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <RestaurantCardList images={images} isLoading={isLoading} />
    </div>
  );
}
