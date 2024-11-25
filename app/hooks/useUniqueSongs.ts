import { useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/api/api-client";
import axios from "axios";
import { useEffect, useState } from "react"


const lambdaURL = "https://wik336b492.execute-api.ca-central-1.amazonaws.com/default/get-unqiue-songs"; // Add your Lambda URL here
const apiClient = new APIClient<UniqueSongs>(lambdaURL);

interface UniqueSongs {
  status: "cached" | "queued";
  songs?: string[];
  jobId?: string;
}

const useUniqueSongs = (channelId: string, search: boolean, videoId?: string) => {
  const queryClient = useQueryClient();
  const [refetchFlag, setRefetchFlag] = useState(false); 

  // Primary query to check if unique songs are already cached or if a job is queuing
  const { data, isLoading, error, refetch } = useQuery<UniqueSongs, Error>({
    queryKey: ["unique songs", channelId, videoId],
    queryFn: () =>
      apiClient.getAll({
        params: { channelId: channelId,
          ...(videoId && { videoId: videoId }),
          },
      }),
    enabled:  !!channelId && search , 
    refetchInterval: refetchFlag ? 4000 : false, 
    refetchOnWindowFocus: false,

  });

  useEffect(() => {
    if (data?.status === "queued") {
      setRefetchFlag(true);
    } else if (data?.status === "cached") {
      setRefetchFlag(false); 
    }
  }, [data?.status]); 

  return { data, error, isLoading, refetch };
};


export default useUniqueSongs;
