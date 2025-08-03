import axios from "axios";
import Cookies from "js-cookie";

export type UserDestroyResponse = {
  success: boolean;
  messages: Array<string>;
};

export async function userDestroy(id: number): Promise<UserDestroyResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/${id}`;
  const authToken = Cookies.get("authToken");

  return axios
    .delete<UserDestroyResponse>(apiUrl, {
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
