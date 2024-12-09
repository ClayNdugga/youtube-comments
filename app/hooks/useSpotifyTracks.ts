import APIClient from "../services/api/api-client";
import { SpotifyResponse, Track } from "../entities/spotify";
import { useQuery } from "@tanstack/react-query";


const apiClient = new APIClient("/spotify-tracks");

const useSpotifyTracks = (queries: string[], page: number, tracks_per_page = 4) => {
  return useQuery<Track[], Error>({
    queryKey: ["multipleTracks", queries, page],
    queryFn: async () => {
      const start = page * tracks_per_page;
      const end = (page + 1) * tracks_per_page;
      const results = await Promise.all(
        queries.slice(start, end).map((q) =>
          apiClient.getAll<SpotifyResponse<Track>>({
            params: { q: q, limit: 1 },
          })
        )
      );
      return results.flatMap((result) => result.items);
    },
    enabled: queries.length > 0,
    refetchOnWindowFocus: false,
  });
};


export default useSpotifyTracks;
