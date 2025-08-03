import axios from "axios";

export type AuthLoginRequest = {
  email: string;
  password: string;
};

export type AuthLoginResponse = {
  success: boolean;
  messages: Array<string>;
  authToken: string;
};

export async function authLogin(
  req: AuthLoginRequest
): Promise<AuthLoginResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  return axios
    .post<AuthLoginResponse>(apiUrl, req)
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return {
        success: false,
        messages: err.response?.data.messages || [],
        authToken: "",
      };
    });
}
