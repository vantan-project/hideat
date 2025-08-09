"use client";

import { historyIndex, HistoryIndexResponse } from "@/api/history-index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Pin } from "lucide-react";
import { Pagination, Skeleton } from "@heroui/react";
import {
  RestaurantCard,
  RestaurantCardProps,
} from "@/components/features/top/restaurant-card";
import {
  restaurantShow,
  RestaurantShowRequest,
  RestaurantShowResponse,
} from "@/api/restaurant-show";

export default function () {
  const [isLoading, setIsLoading] = useState(true);
  const [historyIds, setHistoryIds] = useState<Array<number>>([]);
  const [histories, setHistories] = useState<HistoryIndexResponse>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] =
    useState<RestaurantCardProps | null>(null);

  useEffect(() => {
    document.documentElement.style.backgroundColor = "var(--color-gray)";
  }, []);

  useEffect(() => {
    const fetchHistoryData = () => {
      try {
        setIsLoading(true);

        const historyCookies = Cookies.get("history");
        if (historyCookies) {
          const parsedHistory = JSON.parse(historyCookies);
          setHistoryIds(parsedHistory);
        }
      } catch (err) {
        console.error("History data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const start = (currentPage - 1) * 20;
  const end = start + 20;
  const total = Math.ceil(historyIds.length / 20) || 1;

  useEffect(() => {
    if (historyIds.length === 0) return;
    setIsLoading(true);
    const indexApi = async () => {
      try {
        const res = await historyIndex({ ids: historyIds.slice(start, end) });
        if (res) setHistories(res);
      } catch (err) {
        console.error("History index fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    indexApi();
  }, [historyIds, start, end]);

  const handleClick = async (history: HistoryIndexResponse[number]) => {
    const res = await restaurantShow(String(history.locationId), {
      isGoogle: history.isGoogle,
    });
    if (res) {
      setSelectedImage({
        image: {
          url: history.url,
          isGoogle: history.isGoogle,
          restaurant: {
            id: history.locationId,
            name: res.name,
            mapUrl: res.mapUrl,
            latitude: res.latitude,
            longitude: res.longitude,
            instagramUrl: res.instagramUrl,
            tiktokUrl: res.tiktokUrl,
            xUrl: res.xUrl,
            facebookUrl: res.facebookUrl,
            lineUrl: res.lineUrl,
            tabelogUrl: res.tabelogUrl,
            gnaviUrl: res.gnaviUrl,
            imageUrls: res.imageUrls,
          },
        },
      });
    }
  };

  return (
    <>
      <div className="p-6 pb-36">
        <h2 className="pb-2 pl-2 font-bold">閲覧履歴</h2>
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <>
              {Array.from({ length: 15 }).map((_, index) => (
                <Skeleton key={index} className="h-[36px]" />
              ))}
            </>
          ) : (
            <>
              {histories.map((history) => (
                <div
                  onClick={() => {
                    handleClick(history);
                  }}
                  key={history.id}
                  className="bg-white p-2 flex gap-2 items-center"
                >
                  <Pin
                    className={`flex-shrink-0 ${
                      history.isKeeped ? "text-primary" : "text-black"
                    }`}
                  />
                  <p className="flex flex-wrap">{history.name}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <Pagination
        className="fixed bottom-20 left-1/2 -translate-x-1/2"
        classNames={{
          item: "bg-white shadow-xl",
        }}
        page={1}
        total={total}
        onChange={(page) => setCurrentPage(page)}
        size="lg"
      />

      {selectedImage && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/[0.5]"
            onClick={() => setSelectedImage(null)}
          />
          <div className="absolute">
            <RestaurantCard {...selectedImage} />
          </div>
        </div>
      )}
    </>
  );
}
