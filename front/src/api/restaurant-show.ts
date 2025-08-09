import axios from "axios";

export type RestaurantShowRequest = {
  isGoogle: boolean;
};

export type RestaurantShowResponse = {
  name: string;
  mapUrl: string;
  latitude: number;
  longitude: number;
  instagramUrl: string;
  tiktokUrl: string;
  xUrl: string;
  facebookUrl: string;
  lineUrl: string;
  tabelogUrl: string;
  gnaviUrl: string;

  imageUrls: Array<string>;
  categoryIds: Array<number>;
};

export async function restaurantShow(id: string, req: RestaurantShowRequest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/${id}`;

  return axios
    .get<RestaurantShowResponse>(apiUrl, {
      params: req,
    })
    .then((res) => res.data);
}
