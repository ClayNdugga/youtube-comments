import APIClient from "../services/api/api-client";
// import ms from "ms";

import { YouTubeChannelResource, YoutubeFetchResponse } from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = "https://jqu23yr8jg.execute-api.ca-central-1.amazonaws.com/default/youtube-channel";
const apiClient = new APIClient<YouTubeChannelResource>(lambdaURL);

const useYoutubeVideo = (channelId: string) =>
  useQuery<YoutubeFetchResponse<YouTubeChannelResource>, Error>({
    queryKey: ["channel", channelId],
    queryFn: () => apiClient.getAll({ params: { forHandle: channelId } }),
    enabled: !!channelId,
    // staleTIme: ms("1h"),
  });

export default useYoutubeVideo;
