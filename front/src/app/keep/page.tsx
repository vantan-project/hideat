"use client";

import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";
import { Plus, MousePointer, Trash2, Home } from "lucide-react";

export default function KeepPage() {
  // サンプルデータ
  const keptRestaurants = [
    { id: 1, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
    { id: 2, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
    { id: 3, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
    { id: 4, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
    { id: 5, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
    { id: 6, name: "abcレストラン", image: "/IMG_20250216_102944.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-gradient-to-b from-red-800 to-red-700 text-white py-6 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">HIDEAT</h1>
          <div className="flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-sm">店舗を追加する</span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-white px-4 py-6">
        <p className="text-sm text-gray-600 mb-6">
          ※キープ一覧に追加したカードは1日で削除されます。
        </p>

        {/* ボタン */}
        <div className="flex gap-3 mb-6">
          <Button
            variant="bordered"
            className="flex-1 border-gray-300 text-gray-700"
            startContent={<MousePointer className="w-4 h-4" />}
          >
            選択削除モード
          </Button>
          <Button
            color="danger"
            className="flex-1"
            startContent={<Trash2 className="w-4 h-4" />}
          >
            一括削除
          </Button>
        </div>

        {/* カードグリッド */}
        <div className="grid grid-cols-2 gap-4 pb-24">
          {keptRestaurants.map((restaurant) => (
            <Card key={restaurant.id} className="w-full">
              <CardBody className="p-0 flex-1 aspect-square overflow-hidden">
                <Image
                  alt={restaurant.name}
                  className="w-full h-full object-cover rounded-t-lg"
                  src={restaurant.image}
                  fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEzMy42MzEgMTAwIDEyMCA4Ni4zNjg5IDEyMCA3MEMxMjAgNTMuNjMxMSAxMzMuNjMxIDQwIDE1MCA0MEMxNjYuMzY5IDQwIDE4MCA1My42MzExIDE4MCA3MEMxODAgODYuMzY4OSAxNjYuMzY5IDEwMCAxNTAgMTAwWiIgZmlsbD0iI0QxRjVGRiIvPgo8cGF0aCBkPSJNMTUwIDEyMEMxMzMuNjMxIDEyMCAxMjAgMTA2LjM2OSAxMjAgOTBDMTIwIDczLjYzMTEgMTMzLjYzMSA2MCAxNTAgNjBDMTY2LjM2OSA2MCAxODAgNzMuNjMxMSAxODAgOTBDMTgwIDEwNi4zNjkgMTY2LjM2OSAxMjAgMTUwIDEyMFoiIGZpbGw9IiNGRkYwRjAiLz4KPHBhdGggZD0iTTE1MCAxNDBDMTMzLjYzMSAxNDAgMTIwIDEyNi4zNjkgMTIwIDExMEMxMjAgOTMuNjMxMSAxMzMuNjMxIDgwIDE1MCA4MEMxNjYuMzY5IDgwIDE4MCA5My42MzExIDE4MCAxMTBDMTgwIDEyNi4zNjkgMTY2LjM2OSAxNDAgMTUwIDE0MFoiIGZpbGw9IiNGRjAwMDAiLz4KPC9zdmc+"
                  radius="none"
                />
              </CardBody>
              <CardFooter className="px-3 py-2 flex justify-center flex-shrink-0">
                <p className="text-sm font-medium text-gray-900 text-center">{restaurant.name}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* ホームボタン */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          isIconOnly
          color="danger"
          size="lg"
          className="rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <Home className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
