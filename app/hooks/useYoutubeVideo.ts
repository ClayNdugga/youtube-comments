import APIClient from "../services/api/api-client";
// import ms from "ms";
import {
  YouTubeVideoResource,
  YoutubeFetchResponse,
} from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL =
  "https://7kf31zkiy6.execute-api.ca-central-1.amazonaws.com/default/youtube-video";
const apiClient = new APIClient<YouTubeVideoResource>(lambdaURL);

const useVideo = (videoId: string) =>
  useQuery<YoutubeFetchResponse<YouTubeVideoResource>, Error>({
    queryKey: ["video", videoId],
    queryFn: () =>
      apiClient.getAll({
        params: {
          id: "iL7sNPGKksc",
        //   https://www.youtube.com/watch?v=iL7sNPGKksc
        },
      }),
    // staleTIme: ms("1h"),
  });

export default useVideo;
