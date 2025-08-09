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

    instagramUrl: string;
    tiktokUrl: string;
    xUrl: string;
    facebookUrl: string;
    lineUrl: string;
    tabelogUrl: string;
    gnaviUrl: string;

    imageFiles: Array<File>;

    categoryIds: Array<number>;
  };
};

export type AuthSignUpResponse =
  | {
      success: true;
      messages: Array<string>;
      authToken: string;
      restaurantId: number;
    }
  | {
      success: false;
      messages: Array<string>;
    };

export async function authSignUp(
  req: AuthSignUpRequest
): Promise<AuthSignUpResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;

  return axios
    .post<AuthSignUpResponse>(apiUrl, req, {
      headers: {
        "Content-Type": "multipart/form-data",
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
