import axios from "axios";
import Cookies from "js-cookie";

export type UserStoreRequest = {
  name: string;
  email: string;
  password: string;
};

export type UserStoreResponse = {
  success: boolean;
  messages: Array<string>;
};

export async function userStore(
  req: UserStoreRequest
): Promise<UserStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  const authToken = Cookies.get("authToken");

  return axios
    .post<UserStoreResponse>(apiUrl, req, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);

      return {
        success: false,
        messages: err.response?.data.messages || [],
      };
    });
}
