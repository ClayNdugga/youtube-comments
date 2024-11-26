import APIClient from "../services/api/api-client";
// import ms from "ms";
import { CommentThreadResource, YoutubeFetchResponse } from "../entities/youtube";
import { useInfiniteQuery } from "@tanstack/react-query";

const lambdaURL = "https://wicoe2utvi.execute-api.ca-central-1.amazonaws.com/default/youtube-test-axios";
const apiClient = new APIClient<YoutubeFetchResponse<CommentThreadResource>>(lambdaURL);

const useComments = (searchTerms: string, order: string, videoId?: string, channelId?: string) =>
  useInfiniteQuery<YoutubeFetchResponse<CommentThreadResource>, Error>({
    queryKey: ["comments", videoId, order !== "relevance" ? searchTerms : "", order],
    queryFn: ({ pageParam = "" }) => {
      const params: Record<string, any> = {
        maxResults: 100,
        textFormat: "plainText",
        order: order,
        pageToken: pageParam,
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
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined, // Return nextPageToken if it exists
  });

export default useComments;

// const useComments = (videoId: string, searchTerms: string, order: string) =>
//   useQuery<YoutubeFetchResponse<CommentThreadResource>, Error>({
//     queryKey:  ["comments", videoId, order != "relevance" ? searchTerms: "" , order],
//     queryFn: () => {
//       const params: Record<string, any> = {
//         videoId: videoId,
//         maxResults: 100,
//         textFormat: "plainText",
//         order: order
//       };

//       if (order !== "relevance") {
//         params.searchTerms = searchTerms;
//       }

//       return apiClient.getAll({ params });
//     },
//     enabled: !!videoId && (order === "relevance" || (order === "time" && !!searchTerms)) && (order != 'Order By')
//   });

// export default useComments;
