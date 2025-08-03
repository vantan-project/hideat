import axios from "axios";

export type ImageIndexRequest = {
  latitude: number;
  longitude: number;
  categoryId: number | null;
  radius: number;
  limit: number;
};

export type ImageIndexResponse = Array<{
  restaurantId: string | number;
  url: string;
  isGoogle: boolean;
}>;

export async function imageIndex(
  req: ImageIndexRequest
): Promise<ImageIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/image`;

  return axios
    .get<ImageIndexResponse>(apiUrl, {
      params: req,
    })
    .then((res) => res.data);
}
