import axios from "axios";
import Cookies from "js-cookie";

export type KeepRestaurant = {
  id: number;
  name: string;
  image: string;
  created_at: string;
};

export type KeepIndexResponse =
  | {
      success: true;
      data: KeepRestaurant[];
    }
  | {
      success: false;
      message?: string;
    };

// デモデータ
const demoKeepData: KeepRestaurant[] = [
  {
    id: 1,
    name: "abcレストラン",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T10:30:00Z"
  },
  {
    id: 2,
    name: "xyzカフェ",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T11:15:00Z"
  },
  {
    id: 3,
    name: "123ダイナー",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T12:00:00Z"
  },
  {
    id: 4,
    name: "456レストラン",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T13:45:00Z"
  },
  {
    id: 5,
    name: "789カフェ",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T14:20:00Z"
  },
  {
    id: 6,
    name: "デモレストラン",
    image: "https://placehold.jp/150x150.png",
    created_at: "2025-02-16T15:10:00Z"
  }
];

export async function keepIndex(): Promise<KeepIndexResponse> {
  // デモ用のkeep Cookieを作成
  const keepCookie = Cookies.get("keep");
  
  // keep Cookieが存在しない場合は作成
  if (!keepCookie) {
    Cookies.set("keep", "demo_user_123", { expires: 7 }); // 7日間有効
  }

  // デモデータを返す（実際のAPIの代わり）
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: demoKeepData
      });
    }, 500); // 0.5秒の遅延でローディング状態を確認
  });
} 