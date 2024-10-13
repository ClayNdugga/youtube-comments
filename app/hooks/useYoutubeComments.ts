import APIClient from "../services/api/api-client";
// import ms from "ms";
import {
  CommentThreadResource,
  YoutubeFetchResponse,
} from "../entities/youtube";
import { useQuery } from "@tanstack/react-query";

const lambdaURL =
  "https://wicoe2utvi.execute-api.ca-central-1.amazonaws.com/default/youtube-test-axios";
const apiClient = new APIClient<CommentThreadResource>(lambdaURL);

const useComments = (videoId: string, searchTerms: string) =>
  useQuery<YoutubeFetchResponse<CommentThreadResource>, Error>({
    queryKey: ["comments", videoId, searchTerms],
    queryFn: () =>
      apiClient.getAll({
        params: {
          videoId: "8xrRzn6OIqU",
          searchTerms: "pump",
          // videoId: videoId,
          // searchTerms: searchTerms,
          maxResults: 10,
          textFormat: "plainText",
        },
      }),
    // staleTIme: ms("1h"),
  });

export default useComments;
