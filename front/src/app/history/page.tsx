"use client";

import { historyIndex, HistoryIndexResponse } from "@/api/history-index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Pin } from "lucide-react";
import { Pagination } from "@heroui/react";

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

        const historyIds = Cookies.get("history");
        if (historyIds) {
          const parsedHistory = JSON.parse(historyIds);
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
    const indexApi = async () => {
      const res = await historyIndex({ ids: historyIds });
      if (res) setHistories(res);
    };

    indexApi();
  }, [historyIds]);

  const start = (currentPage - 1) * 30;
  const end = start + 30;
  const total = Math.ceil(histories.length / 30) || 1;

  return (
    <>
      <div className="p-6 pb-36">
        <h2 className="pb-2 font-bold">閲覧履歴</h2>
        <div className="flex flex-col gap-2">
          {histories.slice(start, end).map((history) => (
            <div
              key={history.id}
              className="bg-white p-2 flex gap-2 items-center"
            >
              <Pin
                className={history.isKeeped ? "text-primary" : "text-black"}
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
