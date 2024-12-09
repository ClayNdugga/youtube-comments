import APIClient from "../services/api/api-client";
// import ms from "ms";
import { CommentThreadResource, YoutubeFetchResponse } from "../entities/youtube";
import { useInfiniteQuery } from "@tanstack/react-query";

const apiClient = new APIClient("/youtube-test-axios");

const useComments = (searchTerms: string, order: string, videoId?: string, channelId?: string) =>
  useInfiniteQuery<YoutubeFetchResponse<CommentThreadResource>, Error>({
    queryKey: ["comments", videoId, order !== "relevance" ? searchTerms : "", order],
    queryFn: ({ pageParam = "" }) => {
      const params: Record<string, string | undefined> = {
        maxResults: "100",
        textFormat: "plainText",
        order: order,
        pageToken: pageParam as string,
      };

      if (order !== "relevance") {
        params.searchTerms = searchTerms;
      }

      if (videoId) {
        params.videoId = videoId;
      } else {
        params.allThreadsRelatedToChannelId = channelId;
      }

      return apiClient.getAll({ params });
    },
    enabled: (!!channelId || !!videoId) && (order === "relevance" || (order === "time" && !!searchTerms)),
    initialPageParam: ",",
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined, 
  });

export default useComments;

