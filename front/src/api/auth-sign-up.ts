import axios from "axios";

export type AuthSignUpRequest = {
  user: {
    name: string;
    email: string;
    password: string;
  };
  restaurant: {
    name: string;
    placeId: string;

    instagramUrl: string | null;
    tiktokUrl: string | null;
    xUrl: string | null;
    facebookUrl: string | null;
    lineUrl: string | null;
    tabelogUrl: string | null;
    gnaviUrl: string | null;

    categoryIds: Array<number>;
  };
};

export type AuthSignUpResponse = {
  success: boolean;
  messages: Array<string>;
  authToken: string;
};

export async function authSignUp(
  req: AuthSignUpRequest
): Promise<AuthSignUpResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;

  return axios
    .post<AuthSignUpResponse>(apiUrl, req)
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
