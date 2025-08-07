import axios from "axios";
import Cookies from "js-cookie";

export type UserIndexResponse = Array<{
  id: number;
  name: string;
  email: string;
}>;

export async function userIndex(): Promise<UserIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user`;
  const authToken = Cookies.get("authToken");

  return axios
    .get<UserIndexResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((res) => res.data);
}
