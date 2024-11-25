import APIClient from "../services/api/api-client";
// import ms from "ms";

import { YouTubeChannelResource, YoutubeFetchResponse } from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = "https://jqu23yr8jg.execute-api.ca-central-1.amazonaws.com/default/youtube-channel";
const apiClient = new APIClient<YouTubeChannelResource>(lambdaURL);

const useYoutubeChannel = (identifier: string, isForHandle: boolean) =>
  useQuery<YoutubeFetchResponse<YouTubeChannelResource>, Error>({
    queryKey: ["channel", identifier],
    queryFn: () => {
      const params = isForHandle
        ? { forHandle: identifier }             
        : { id: identifier };        
      return apiClient.getAll({ params });     
    },
    enabled: !!identifier,
    // staleTIme: ms("1h"),
  });

export default useYoutubeChannel;
