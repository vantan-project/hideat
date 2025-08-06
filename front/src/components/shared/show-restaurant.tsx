import { ImageIndexResponse } from "@/api/image-index";
import { Button, Image } from "@heroui/react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import clsx from "clsx";
import { Pin } from "lucide-react";
import { LineIcon } from "./icons/line-icon";
import { InstagramIcon } from "./icons/instagram-icon";
import { TikTokIcon } from "./icons/tiktok-icon";
import { FacebookIcon } from "./icons/facebook-icon";
import { XIcon } from "./icons/x-icon";

type Props = {
  image: ImageIndexResponse[number];
};

export function ShowRestaurant({ image }: Props) {
  const contentPaddingClassName = "px-4";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  return (
    <div className="snap-center h-screen overflow-y-auto py-64 px-[calc((100vw-300px)*0.125)] flex justify-center [&::-webkit-scrollbar]:hidden">
      <div className="w-[300px] h-fit rounded-2xl overflow-hidden shadow-xl">
        <Image className="w-full aspect-square" src={image.url} radius="none" />

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

        <div className={clsx(contentPaddingClassName, "flex flex-col gap-2")}>
          <div
            className={clsx(contentPaddingClassName, "flex justify-between")}
          >
            {image.restaurant.lineUrl && <LineIcon className="w-4 h-4" />}

            {image.restaurant.instagramUrl && (
              <InstagramIcon className="w-4 h-4" />
            )}

            {image.restaurant.tiktokUrl && <TikTokIcon className="w-4 h-4" />}

            {image.restaurant.facebookUrl && (
              <FacebookIcon className="w-4 h-4" />
            )}

            {image.restaurant.xUrl && <XIcon className="w-4 h-4" />}
          </div>
          <Button className="w-full bg-gnavi z-20 text-white">ぐるナビ</Button>
          <Button type="button" className="w-full bg-tabelog text-white">
            食べログ
          </Button>
        </div>

        <div className="bg-primary rounded-t-2xl text-white mt-20">
          <h2 className="text-center py-4 font-bold">その他の画像</h2>
          <div className="p-4 grid grid-cols-2 gap-2">
            {image.restaurant.imageUrls.map((url, index) => (
              <div className="bg-white p-1 rounded-xl" key={index}>
                <Image
                  className="w-full aspect-square rounded-lg"
                  src={url}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
