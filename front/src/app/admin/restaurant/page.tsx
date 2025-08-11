"use client";

import { restaurantShow, RestaurantShowResponse } from "@/api/restaurant-show";
import { CategorySelect } from "@/components/shared/category-select";
import { FacebookIcon } from "@/components/shared/icons/facebook-icon";
import { InstagramIcon } from "@/components/shared/icons/instagram-icon";
import { LineIcon } from "@/components/shared/icons/line-icon";
import { TikTokIcon } from "@/components/shared/icons/tiktok-icon";
import { XIcon } from "@/components/shared/icons/x-icon";
import { useGlobalContext } from "@/hooks/use-global-context";
import { Input } from "@heroui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function () {
  const { restaurantId } = useGlobalContext();
  const [imageFiles, setImageFiles] = useState<Array<File>>([]);
  const [restaurant, setRestaurant] = useState<RestaurantShowResponse>({
    name: "",
    mapUrl: "",
    latitude: 0,
    longitude: 0,
    instagramUrl: "",
    tiktokUrl: "",
    xUrl: "",
    facebookUrl: "",
    lineUrl: "",
    tabelogUrl: "",
    gnaviUrl: "",
    imageUrls: [],
    categoryIds: [],
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    language: "ja",
  });

  const snsFieldClassNames = "flex gap-2";
  const snsIconClassName = "h-[1lh] w-auto";

  useEffect(() => {
    if (!restaurantId) return;
    const showApi = async () => {
      const res = await restaurantShow(String(restaurantId), {
        isGoogle: false,
      });
      setRestaurant(res);
    };

    showApi();
  }, [restaurantId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">店舗情報</h1>

      <form className="flex flex-col gap-8">
        <Input
          type="text"
          label="店舗名"
          value={restaurant.name}
          onChange={(e) =>
            setRestaurant({ ...restaurant, name: e.target.value })
          }
        />

        <div>
          <h2 className="pb-2 font-bold">画像</h2>
          <div className="flex gap-6 overflow-x-auto [&>*]:w-52 [&>*]:flex-shrink-0">
            <div>
              <input
                id="upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFiles([file, ...imageFiles]);
                }}
              />
              <label
                htmlFor="upload"
                className="w-full aspect-square border border-black border-dashed bg-white rounded-xl flex justify-center items-center"
              >
                <ImagePlus className="w-12 h-12" />
              </label>
            </div>
            {restaurant.imageUrls.map((url, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden flex items-center bg-gray rounded-xl"
              >
                <Image
                  width={100}
                  height={100}
                  alt={`imageFile ${index}`}
                  src={url}
                  className="w-full object-cover"
                />
              </div>
            ))}
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="aspect-square overflow-hidden flex items-center bg-gray rounded-xl"
              >
                <Image
                  width={100}
                  height={100}
                  alt={`imageFile ${index}`}
                  src={URL.createObjectURL(file)}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="pb-2 font-bold">各種SNS</h2>
          <div className="grid grid-cols-3 gap-6">
            <Input
              label={
                <div className={snsFieldClassNames}>
                  <LineIcon className={snsIconClassName} />
                  <p>LINE URL</p>
                </div>
              }
              type="text"
              value={restaurant.lineUrl}
              onChange={(e) =>
                setRestaurant({ ...restaurant, lineUrl: e.target.value })
              }
              labelPlacement="outside"
            />

            <Input
              label={
                <div className={snsFieldClassNames}>
                  <InstagramIcon className={snsIconClassName} />
                  <p>Instagram URL</p>
                </div>
              }
              type="text"
              value={restaurant.instagramUrl}
              onChange={(e) =>
                setRestaurant({ ...restaurant, instagramUrl: e.target.value })
              }
              labelPlacement="outside"
            />

            <Input
              label={
                <div className={snsFieldClassNames}>
                  <TikTokIcon className={snsIconClassName} />
                  <p>TikTok URL</p>
                </div>
              }
              type="text"
              value={restaurant.tiktokUrl}
              onChange={(e) =>
                setRestaurant({ ...restaurant, tiktokUrl: e.target.value })
              }
              labelPlacement="outside"
            />

            <Input
              label={
                <div className={snsFieldClassNames}>
                  <XIcon className={snsIconClassName} />
                  <p>X URL</p>
                </div>
              }
              type="text"
              value={restaurant.xUrl}
              onChange={(e) =>
                setRestaurant({ ...restaurant, xUrl: e.target.value })
              }
              labelPlacement="outside"
            />

            <Input
              label={
                <div className={snsFieldClassNames}>
                  <FacebookIcon className={snsIconClassName} />
                  <p>Facebook URL</p>
                </div>
              }
              type="text"
              value={restaurant.facebookUrl}
              onChange={(e) =>
                setRestaurant({
                  ...restaurant,
                  facebookUrl: e.target.value,
                })
              }
              labelPlacement="outside"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Input
            label="ぐるナビ"
            type="text"
            value={restaurant.gnaviUrl}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                gnaviUrl: e.target.value,
              })
            }
            size="sm"
          />
          <Input
            label="食べログ"
            type="text"
            value={restaurant.tabelogUrl}
            onChange={(e) =>
              setRestaurant({
                ...restaurant,
                tabelogUrl: e.target.value,
              })
            }
            size="sm"
          />
        </div>

        <div>
          <h2 className="pb-2 font-bold">カテゴリー</h2>
          <CategorySelect
            selectedCategoryIds={restaurant.categoryIds}
            setSelectedCategoryIds={(ids) =>
              setRestaurant({ ...restaurant, categoryIds: ids })
            }
            isMulti
            label=""
            size="md"
          />
        </div>

        <div>
          <h2 className="pb-2 font-bold">マップ</h2>
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "500px",
              }}
              center={{
                lat: Number(restaurant.latitude),
                lng: Number(restaurant.longitude),
              }}
              zoom={16}
              options={{
                controlSize: 24,
              }}
              onClick={(e: google.maps.MapMouseEvent) => {
                if (e.latLng) {
                  console.log(e);
                  const lat = e.latLng.lat();
                  const lng = e.latLng.lng();
                  setRestaurant({
                    ...restaurant,
                    latitude: Number(lat),
                    longitude: Number(lng),
                  });
                }
              }}
            >
              <Marker
                position={{
                  lat: Number(restaurant.latitude),
                  lng: Number(restaurant.longitude),
                }}
              />
            </GoogleMap>
          )}
        </div>
      </form>
    </div>
  );
}
