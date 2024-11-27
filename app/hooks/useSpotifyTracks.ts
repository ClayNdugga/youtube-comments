import APIClient from "../services/api/api-client";
import { SpotifyResponse, Track } from "../entities/spotify";
import { useQuery } from "@tanstack/react-query";

const lambdaURL = " ";
// const apiClient = new APIClient<SpotifyResponse<Track>>(lambdaURL);
const apiClient = new APIClient(lambdaURL);




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






// const useSpotifyTracks = (q: string, limit: string) =>
//   useQuery<SpotifyResponse<Track>, Error>({
//     queryKey: ["tracks", q, limit],
//     queryFn: () =>
//       apiClient.getAll({
//         params: { q: q, limit: limit },
//       }),
//     enabled: !!q && !!limit,
//   });




export default useSpotifyTracks;
