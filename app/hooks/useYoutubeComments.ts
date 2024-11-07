import APIClient from "../services/api/api-client";
// import ms from "ms";
import { CommentThreadResource, YoutubeFetchResponse } from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = "https://wicoe2utvi.execute-api.ca-central-1.amazonaws.com/default/youtube-test-axios";
const apiClient = new APIClient<YoutubeFetchResponse<CommentThreadResource>>(lambdaURL);


const useComments = (videoId: string, searchTerms: string, order: string) =>
  useQuery<YoutubeFetchResponse<CommentThreadResource>, Error>({
    queryKey:  ["comments", videoId, order != "relevance" ? searchTerms: "" , order],
    queryFn: () => {
      const params: Record<string, any> = {
        videoId: videoId,
        maxResults: 100,
        textFormat: "plainText",
        order: order
      };

      if (order !== "relevance") {
        params.searchTerms = searchTerms;
      }

      return apiClient.getAll({ params });
    },
    enabled: !!videoId && (order === "relevance" || (order === "time" && !!searchTerms)) && (order != 'Order By')
  });

export default useComments;
