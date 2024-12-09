import axios, { AxiosRequestConfig } from "axios";


class APIClient {
  baseURL: string;

  constructor(endpoint: string) {
    this.baseURL = "https://0tccyg2utb.execute-api.ca-central-1.amazonaws.com"+ endpoint;
  }

  getAll = <T>(config: AxiosRequestConfig): Promise<T> => {
    return axios
      .get<T>(this.baseURL, config)
      .then((res) => res.data);
  };
}

export default APIClient;
