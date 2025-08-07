import { ImageIndexResponse } from "@/api/image-index";
import { FacebookIcon } from "@/components/shared/icons/facebook-icon";
import { InstagramIcon } from "@/components/shared/icons/instagram-icon";
import { LineIcon } from "@/components/shared/icons/line-icon";
import { TikTokIcon } from "@/components/shared/icons/tiktok-icon";
import { XIcon } from "@/components/shared/icons/x-icon";
import {
  Button,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import clsx from "clsx";
import { Pin } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  image?: ImageIndexResponse[number] | null;
  isLoading?: boolean;
};

export function RestaurantCard({ image = null, isLoading = false }: Props) {
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const contentPaddingClassName = "px-4";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <div className="snap-center h-screen overflow-y-auto py-64 px-[calc((100vw-300px)*0.125)] flex justify-center [&::-webkit-scrollbar]:hidden">
        <div className="w-[300px] h-fit rounded-2xl overflow-hidden shadow-lg shadow-black">
          {isLoading && (
            <>
              <Skeleton className="w-full aspect-square" />
              <div className={contentPaddingClassName}>
                <Skeleton className="h-[32px] my-4" />
                <Skeleton className="h-[48px]" />
              </div>
              <div className="py-4">
                <Skeleton className="h-[200px]" />
              </div>
            </>
          )}

          {image && (
            <>
              <div className="w-full aspect-square overflow-hidden bg-gray flex items-center">
                <Image
                  alt="Restaurant Image"
                  width={300}
                  height={300}
                  className="object-cover"
                  src={image.url}
                />
              </div>

              <div className={contentPaddingClassName}>
                <p className="text-lg font-bold text-center pt-2 h-20">
                  {image.restaurant.name}
                </p>

                <Button
                  className="w-full bg-primary text-white font-bold py-6"
                  startContent={<Pin />}
                >
                  キープに追加
                </Button>
              </div>

              {isLoaded && (
                <div className="py-4">
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: "200px",
                    }}
                    center={{
                      lat: image.restaurant.latitude,
                      lng: image.restaurant.longitude,
                    }}
                    zoom={15}
                    options={{
                      controlSize: 24,
                    }}
                  >
                    <Marker
                      position={{
                        lat: image.restaurant.latitude,
                        lng: image.restaurant.longitude,
                      }}
                    />
                  </GoogleMap>
                </div>
              )}

              <div
                className={clsx(contentPaddingClassName, "flex flex-col gap-2")}
              >
                <div
                  className={clsx(
                    contentPaddingClassName,
                    "flex justify-between"
                  )}
                >
                  {image.restaurant.lineUrl && <LineIcon className="w-4 h-4" />}

                  {image.restaurant.instagramUrl && (
                    <InstagramIcon className="w-4 h-4" />
                  )}

                  {image.restaurant.tiktokUrl && (
                    <TikTokIcon className="w-4 h-4" />
                  )}

                  {image.restaurant.facebookUrl && (
                    <FacebookIcon className="w-4 h-4" />
                  )}

                  {image.restaurant.xUrl && <XIcon className="w-4 h-4" />}
                </div>
                <Button className="w-full bg-gnavi z-20 text-white">
                  ぐるナビ
                </Button>
                <Button type="button" className="w-full bg-tabelog text-white">
                  食べログ
                </Button>
              </div>

              <div className="bg-primary rounded-t-2xl text-white mt-20">
                <h2 className="text-center py-4 font-bold">その他の画像</h2>
                <div className="p-4 grid grid-cols-2 gap-2">
                  {image.restaurant.imageUrls.map((url, index) => (
                    <div
                      onClick={() => {
                        setSelectedImageUrl(url);
                        onOpen();
                      }}
                      className="bg-white p-1 rounded-xl"
                      key={index}
                    >
                      <div className="w-full aspect-square overflow-hidden bg-gray flex items-center rounded-lg">
                        <Image
                          alt={`Restaurant Image ${index + 1}`}
                          width={300}
                          height={300}
                          className="object-cover"
                          src={url}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {isOpen && Boolean(selectedImageUrl) && (
        <div
          className="bg-black/50 fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            onOpenChange();
            setSelectedImageUrl(null);
          }}
        >
          <Image
            alt="Selected Restaurant Image"
            width={1200}
            height={1200}
            className="w-[calc(100%-42px)] h-auto rounded-2xl"
            src={selectedImageUrl || ""}
          />
        </div>
      )}
    </>
  );
}
