import axios from "axios";
import Cookies from "js-cookie";

export type AuthDestroyResponse = {
  success: boolean;
  messages: Array<string>;
};

export async function authDestroy(): Promise<AuthDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete<AuthDestroyResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
