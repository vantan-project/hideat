import axios from "axios";

export type KeepStoreRequest = Array<{
  isGoogle: boolean;
  url: string;
  locationId: string;
}>;

export type KeepStoreResponse = {
  id: number;
  success: boolean;
};

export async function keepStore(
  req: KeepStoreRequest
): Promise<KeepStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/keep`;

  return axios
    .post<KeepStoreResponse>(apiUrl, req)
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return {
        id: 0,
        success: false,
      };
    });
}