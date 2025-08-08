import axios from 'axios';

export type KeepIndexRequest = {
    ids: Array<number>;
};

export type KeepIndexResponse = Array<{
    id: number;
    name: string;
    isGoogle: boolean;
    url: string;
    locationId: string;
    latitude: number;
    longitude: number;
}>;

export async function keepIndex(
  req: KeepIndexRequest
): Promise<KeepIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/keep`;

  return axios
    .get<KeepIndexResponse>(apiUrl, { params: req })
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return [];
    });
}