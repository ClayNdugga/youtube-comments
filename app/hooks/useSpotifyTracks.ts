import APIClient from "../services/api/api-client";
import { SpotifyResponse, Track } from "../entities/spotify";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = "https://rrnmze6u8k.execute-api.ca-central-1.amazonaws.com/default/spotify-tracks";
const apiClient = new APIClient<SpotifyResponse<Track>>(lambdaURL);




const useSpotifyTracks = (q: string, limit: string) =>
  useQuery<SpotifyResponse<Track>, Error>({
    queryKey: ["tracks", q, limit],
    queryFn: () =>
      apiClient.getAll({
        params: { q: q, limit: limit },
      }),
    enabled: !!q && !!limit,
  });




export default useSpotifyTracks;
