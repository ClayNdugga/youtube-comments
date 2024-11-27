import APIClient from "../services/api/api-client";
// import ms from "ms";
import {
  YouTubeVideoResource,
  YoutubeFetchResponse,
} from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = "https://0tccyg2utb.execute-api.ca-central-1.amazonaws.com/youtube-video";
const apiClient = new APIClient(lambdaURL);
// const apiClient = new APIClient<YouTubeVideoResource>(lambdaURL);

const useYoutubeVideo = (videoId: string) =>
  useQuery<YoutubeFetchResponse<YouTubeVideoResource>, Error>({
    queryKey: ["video", videoId],
    queryFn: () =>
      apiClient.getAll({
        params: {
          id: videoId,
        },
      }),
    enabled: !!videoId, //only run if videoId is not empty
    // staleTIme: ms("1h"),
  });

export default useYoutubeVideo;
