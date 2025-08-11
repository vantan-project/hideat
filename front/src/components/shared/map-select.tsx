import { Button, Input, useDisclosure } from "@heroui/react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { useRef, useState } from "react";
import { SignUpFormProps } from "../features/sign-up/sign-up-form";

export function MapSelect({
  formData,
  setFormData,
  inputClassNames,
}: SignUpFormProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [center, setCenter] = useState({
    lat: 35.6895,
    lng: 139.6917,
  });
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  }>();

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
    language: "ja",
  });

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          setCenter(newPosition);
          setPosition(newPosition);

          setFormData({
            ...formData,
            restaurant: {
              ...formData.restaurant,
              placeId: place.place_id || "",
            },
          });
        } else {
          // geometry/location がない場合のエラーハンドリング
          console.warn("Selected place has no geometry/location.");
        }
      }
    }
  };

  return (
    <>
      <Input
        label="Map"
        type="text"
        onClick={onOpen}
        value={
          formData.restaurant.placeId
            ? `https://www.google.com/maps/place/?q=place_id:${formData.restaurant.placeId}`
            : ""
        }
        isReadOnly
        readOnly
        classNames={inputClassNames}
        size="sm"
        isRequired
      />
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/[0.5]"
            onClick={onOpenChange}
          />
          <div className="w-4/5 rounded-2xl overflow-hidden relative">
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={{
                  width: "100%",
                  height: "500px",
                }}
                center={center}
                zoom={16}
                options={{
                  controlSize: 24,
                }}
                onClick={(e: google.maps.MapMouseEvent) => {
                  if (e.latLng) {
                    console.log(e);
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    const newPosition = { lat, lng };
                    setPosition(newPosition);
                    onPlacesChanged();

                    setFormData({
                      ...formData,
                      restaurant: {
                        ...formData.restaurant,

                        // @ts-ignore
                        placeId: e.placeId || "",
                      },
                    });
                  }
                }}
              >
                <StandaloneSearchBox
                  onLoad={(ref) => (searchBoxRef.current = ref)}
                  onPlacesChanged={onPlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="場所を検索..."
                    style={{
                      backgroundColor: "white",
                      boxSizing: "border-box",
                      border: "1px solid transparent",
                      width: "240px",
                      height: "32px",
                      padding: "0 12px",
                      borderRadius: "3px",
                      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                      fontSize: "14px",
                      outline: "none",
                      textOverflow: "ellipses",
                      position: "absolute",
                      left: "50%",
                      marginLeft: "-120px",
                      top: "10px",
                    }}
                  />
                </StandaloneSearchBox>
                {position && <Marker position={position} />}
                <Button
                  className="absolute right-4 bottom-4 bg-primary text-white py-2 px-6"
                  onPress={() => {
                    onOpenChange();
                  }}
                >
                  ここにする
                </Button>
              </GoogleMap>
            )}
          </div>
        </div>
      )}
    </>
  );
}
