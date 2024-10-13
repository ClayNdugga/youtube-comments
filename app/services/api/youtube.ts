import axios from "axios";

export const fetchYoutubeComments = async (
  videoId: string,
  searchTerms: string
) => {
  try {
    const response = await axios.get(
      "https://wicoe2utvi.execute-api.ca-central-1.amazonaws.com/default/youtube-test-axios",
      {
        params: {
          videoId: videoId,
          searchTerms: searchTerms,
          maxResults: 10,
          // textFormat: "plainText",
        },
      }
    );
    return response.data; // Make sure to return the data
  } catch (error) {
    console.error("Error fetching YouTube comments:", error);
    throw error; // Rethrow the error so it can be caught upstream
  }
};

// export const fetchYoutubeComments = async (videoId: string, searchTerms: string) => {
//   return await axios
//     .get(
//       "https://awslambdafunctionthatcallsyoutbeapiurl",
//       {
//         params: {
//           videoId: videoId,
//           searchTerms: searchTerms,
//           maxResults: 10,
//           textFormat: "plainText",
//         },
//       }
//     )
//     .then((response) => {
//       response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };
