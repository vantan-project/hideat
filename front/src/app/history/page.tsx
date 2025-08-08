"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight, MapPin, History } from "lucide-react";
import Cookies from "js-cookie";
import { historyIndex } from "@/api/history-index";

interface HistoryItem {
  id: number;
  name: string;
  isPinned: boolean;
  isGoogle?: boolean;
  url?: string;
  locationId?: string;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  // データ取得
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const historyIdsCookie = Cookies.get("history-ids");
        if (!historyIdsCookie) {
          setHistoryItems([]);
          setIsLoading(false);
          return;
        }

        const historyIds: number[] = JSON.parse(historyIdsCookie);
        
        if (historyIds.length === 0) {
          setHistoryItems([]);
          setIsLoading(false);
          return;
        }

        // APIから履歴データを取得
        const historyData = await historyIndex({ ids: historyIds });
        
        // keepクッキーからピン留め状態を取得
        const keepCookie = Cookies.get("keep");
        const keptItems = keepCookie ? JSON.parse(keepCookie) : [];
        const keptIds = keptItems.map((item: any) => item.id);

        // 履歴データをHistoryItem形式に変換
        const formattedHistoryItems: HistoryItem[] = historyData.map((item) => ({
          id: item.id,
          name: item.name,
          isPinned: keptIds.includes(item.id),
          isGoogle: item.isGoogle,
          url: item.url,
          locationId: item.locationId,
        }));
        
        setHistoryItems(formattedHistoryItems);
      } catch (err) {
        setError("データの取得中にエラーが発生しました");
        console.error("History data fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  const togglePin = (id: number) => {
    const targetItem = historyItems.find(item => item.id === id);
    if (!targetItem) return;

    const currentKeep = Cookies.get("keep");
    const keptItems = currentKeep ? JSON.parse(currentKeep) : [];

    if (targetItem.isPinned) {
      // ピン留め解除
      const updatedKeptItems = keptItems.filter((item: any) => item.id !== id);
      Cookies.set("keep", JSON.stringify(updatedKeptItems));
    } else {
      // ピン留め追加
      const keepData = {
        id: targetItem.id,
        name: targetItem.name,
        isGoogle: targetItem.isGoogle,
        url: targetItem.url,
        locationId: targetItem.locationId,
      };
      const updatedKeptItems = [...keptItems, keepData];
      Cookies.set("keep", JSON.stringify(updatedKeptItems));
    }

    // ローカル状態を更新
    setHistoryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isPinned: !item.isPinned } : item
      )
    );
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historyItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(historyItems.length / itemsPerPage);



  useEffect(() => {
    document.body.style.backgroundColor = "var(--color-gray)";
  }, []);

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="pt-10 min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">閲覧履歴</h1>
        </div>
        
        {historyItems.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-sm">
              {getCurrentPageItems().map((item) => (
                <div
                  key={item.id}
                  className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
                >
                  <button
                    onClick={() => togglePin(item.id)}
                    className="mr-3 flex-shrink-0"
                  >
                    <MapPin
                      className={`w-5 h-5 ${
                        item.isPinned ? "text-red-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                  <span className="text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  isDisabled={currentPage === 1}
                  className="text-gray-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    isIconOnly
                    size="sm"
                    onPress={() => setCurrentPage(page)}
                    className={`w-8 h-8 ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "bg-white text-gray-600 border border-gray-300"
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  isDisabled={currentPage === totalPages}
                  className="text-gray-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                閲覧履歴がありません
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                レストランを閲覧すると、ここに履歴が表示されます
              </p>
              <Button
                className="bg-primary text-white"
                onPress={() => window.location.href = '/'}
              >
                レストランを探す
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
