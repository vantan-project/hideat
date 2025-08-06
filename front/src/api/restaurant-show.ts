import axios from "axios";

export type RestaurantShowRequest = {
  isGoogle: boolean;
};

export type RestaurantShowResponse = {
  name: string;
  mapUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  xUrl: string;
  facebookUrl: string;
  lineUrl: string;
  tabelogUrl: string;
  gnaviUrl: string;

  categoryIds: Array<number>;

  imageUrls: Array<string>;
};

export async function restaurantShow(id: number, req: RestaurantShowRequest) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/restaurant/${id}`;

  return axios
    .get<RestaurantShowResponse>(apiUrl, {
      params: req,
    })
    .then((res) => res.data);
}
