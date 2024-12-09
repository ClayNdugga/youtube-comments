import APIClient from "../services/api/api-client";
// import ms from "ms";
import {
  YouTubeVideoResource,
  YoutubeFetchResponse,
} from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const apiClient = new APIClient("/youtube-video");

const useYoutubeVideo = (videoId: string) =>
  useQuery<YoutubeFetchResponse<YouTubeVideoResource>, Error>({
    queryKey: ["video", videoId],
    queryFn: () =>
      apiClient.getAll({
        params: {
          id: videoId,
        },
      }),
    enabled: !!videoId,
  });

export default useYoutubeVideo;
