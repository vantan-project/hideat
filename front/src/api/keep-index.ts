import axios from 'axios';

export type KeepIndexRequest = {
    ids: Array<number>;
};

export type KeepIndexResponse = Array<{
    id: number;
    isGoogle: boolean;
    url: string;
    locationId: string;
}>;

export async function keepIndex(
  req: KeepIndexRequest
): Promise<KeepIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/keep/index`;

  return axios
    .get<KeepIndexResponse>(apiUrl, { params: req })
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return [];
    });
}