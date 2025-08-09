import axios from 'axios';

export type HistoryIndexRequest = {
  ids: Array<number>;
};

export type HistoryIndexResponse = Array<{
  id: number;
  name: string;
  isGoogle: boolean;
  isKeeped: boolean;
  url: string;
  locationId: string;
}>;

export async function historyIndex(
  req: HistoryIndexRequest
): Promise<HistoryIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/history`;

  return axios
    .get<HistoryIndexResponse>(apiUrl, { params: req })
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return [];
    });
}