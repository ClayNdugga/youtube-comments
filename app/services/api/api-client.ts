import axios, { AxiosRequestConfig } from "axios";

import { YoutubeFetchResponse } from "../../entities/youtube";

class APIClient<T> {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  getAll = (config: AxiosRequestConfig) => {
    return axios
      .get<T>(this.baseURL, config)
      .then((res) => res.data);
  };
}

export default APIClient;
