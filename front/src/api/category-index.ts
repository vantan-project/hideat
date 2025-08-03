import axios from "axios";

export type CategoryIndexResponse = Array<{
  id: number;
  name: string;
}>;

export async function categoryIndex(): Promise<CategoryIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/category`;

  return axios.get<CategoryIndexResponse>(apiUrl).then((res) => res.data);
}
