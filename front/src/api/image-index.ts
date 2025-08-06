import axios from "axios";

export type ImageIndexRequest = {
  latitude: number;
  longitude: number;
  categoryId: number | null;
  radius: number;
  limit: number;
};

export type ImageIndexResponse = Array<{
  url: string;
  isGoogle: boolean;
  restaurant: {
    id: string | number;
    name: string;
    mapUrl: string;

    latitude: number;
    longitude: number;

    instagramUrl: string | null;
    tiktokUrl: string | null;
    xUrl: string | null;
    facebookUrl: string | null;
    lineUrl: string | null;
    tabelogUrl: string | null;
    gnaviUrl: string | null;

    imageUrls: Array<string>
  };
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
