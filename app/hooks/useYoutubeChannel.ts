import APIClient from "../services/api/api-client";
// import ms from "ms";

import { YouTubeChannelResource, YoutubeFetchResponse } from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const apiClient = new APIClient("/youtube-channel");

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
  });

export default useYoutubeChannel;
