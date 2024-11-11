import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api/api-client";
import axios from "axios";

const lambdaURL = "https://wik336b492.execute-api.ca-central-1.amazonaws.com/default/get-unqiue-songs"; // Add your Lambda URL here
const apiClient = new APIClient<UniqueSongs>(lambdaURL);

interface UniqueSongs {
  status: "cached" | "queued";
  songs?: string[];
  jobId?: string;
}

const useUniqueSongs = (channelId:string, videoId: string, search: boolean) => {
  const queryClient = useQueryClient();

  // Primary query to check if unique songs are already cached or if a job is queuing
  const { data, isLoading, error } = useQuery<UniqueSongs, Error>({
    queryKey: ["unique songs", channelId, videoId],
    queryFn: () =>
      apiClient.getAll({
        params: { channelId: channelId, videoId: videoId },
      }),
    enabled: !!videoId && search,
    staleTime: 1000 * 60 * 1, // Cache response for 1 minute if available
  });

  // Polling query for job completion if a job is queued
  useQuery<UniqueSongs, Error>({
    queryKey: ["unique songs", "polling", data?.jobId],
    queryFn: async () => {
      const response = await axios.get(`${lambdaURL}/job-status`, {
        params: { jobId: data?.jobId },
      });
      return response.data;
    },
    enabled: data?.status === "queued" && !!data?.jobId, // Start polling only if job is queued
    refetchInterval: 3000, // Poll every 3 seconds; adjust as needed
    onSuccess: (newData: UniqueSongs) => {
      if (newData.status === "cached") {
        queryClient.setQueryData(["unique songs", videoId], newData); // Update with final song list
      }
    },
  });

  return { data, error, isLoading };
};

export default useUniqueSongs;
