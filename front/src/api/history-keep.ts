import axios from "axios";

export function historyKeep(id: number) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/history/keep/${id}`;

  axios.patch(apiUrl);
}
