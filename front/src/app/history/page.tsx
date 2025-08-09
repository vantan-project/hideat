"use client";

import { historyIndex, HistoryIndexResponse } from "@/api/history-index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Pin } from "lucide-react";
import { Pagination } from "@heroui/react";
import clsx from "clsx";

export default function () {
  const [isLoading, setIsLoading] = useState(true);
  const [historyIds, setHistoryIds] = useState<Array<number>>([]);
  const [histories, setHistories] = useState<HistoryIndexResponse>([]);

  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    if (historyIds.length === 0) return;
    const indexApi = async () => {
      try {
        const res = await historyIndex({ ids: historyIds });
        if (res) setHistories(res);
      } catch (err) {
        console.error("History index fetch error:", err);
      }
    };

    indexApi();
  }, [historyIds]);

  const start = (currentPage - 1) * 20;
  const end = start + 20;
  const total = Math.ceil(histories.length / 20) || 1;

  if (isLoading) return;

  return (
    <>
      <div className="p-6 pb-36">
        <h2 className="pb-2 pl-2 font-bold">閲覧履歴</h2>
        <div className="flex flex-col gap-2">
          {histories.slice(start, end).map((history) => (
            <div
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
        </div>
      </div>

      <Pagination
        className="fixed bottom-20 left-1/2 -translate-x-1/2"
        classNames={{
          item: "bg-white",
        }}
        page={1}
        total={total}
        onChange={(page) => setCurrentPage(page)}
        size="lg"
      />
    </>
  );
}
