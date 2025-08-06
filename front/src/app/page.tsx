"use client";

import {
  imageIndex,
  ImageIndexRequest,
  ImageIndexResponse,
} from "@/api/image-index";
import { CategorySelect } from "@/components/shared/category-select";
import { ShowRestaurant } from "@/components/shared/show-restaurant";
import { Button, image, Select, SelectItem } from "@heroui/react";
import clsx from "clsx";
import { Pin, Shuffle } from "lucide-react";
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
    const res = await imageIndex(search);
    setImages(res);
  };

  useEffect(() => {
    if (!search.latitude || !search.longitude) return;
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

  if (!images.length) return;

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
      <div className="snap-x snap-mandatory flex [&>*]:flex-shrink-0 overflow-x-auto px-[calc((100vw-300px)*0.375)]">
        {images.map((image, index) => (
          <ShowRestaurant
            key={image.restaurant.id + String(index)}
            image={image}
          />
        ))}
      </div>
    </div>
  );
}
