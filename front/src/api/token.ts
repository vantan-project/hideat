import axios from "axios";
import Cookies from "js-cookie";

export type TokenResponse =
  | {
      success: true;
      restaurantId: number;
    }
  | {
      success: false;
    };

export async function token(): Promise<TokenResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/token`;
  const authToken = Cookies.get("authToken");

  return await axios
    .get<TokenResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch(() => ({ success: false }));
}
