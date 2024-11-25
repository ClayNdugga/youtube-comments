import axios, { AxiosRequestConfig } from "axios";


class APIClient<T> {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  getAll = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axios
      .get<T>(this.baseURL, config)
      .then((res) => res.data);
  };
}

export default APIClient;
