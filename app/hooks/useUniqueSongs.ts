import { useQuery } from "@tanstack/react-query";
import APIClient from "../services/api/api-client";
import { useEffect, useState } from "react"


const apiClient = new APIClient("/get-unique-songs");

interface UniqueSongs {
  status: "cached" | "queued";
  songs?: string[];
  jobId?: string;
}

const useUniqueSongs = (channelId: string, search: boolean, videoId?: string) => {
  const [refetchFlag, setRefetchFlag] = useState(false); 

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
