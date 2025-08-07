import axios from 'axios';

export type HistoryStoreRequest = {
  isGoogle: boolean;
  url: string;
  locationId: string;
};

export type HistoryStoreResponse = {
    id: number;
    success: boolean;
};

export async function historyStore(
  req: HistoryStoreRequest
): Promise<HistoryStoreResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/history`;

  return axios
    .post<HistoryStoreResponse>(apiUrl, req)
    .then((res) => res.data)
    .catch((err) => {
      console.warn(err);
      return {
        id: 0,
        success: false,
      };
    });
}