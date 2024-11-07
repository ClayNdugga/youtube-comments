"use client";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./commentSection";
import Video from "./video";
import SearchBar from "./searchBar";
import VideoSkeleton from "./videoSkeleton";

import useYoutubeVideo from "@/app/hooks/useYoutubeVideo";

import { parseYouTubeVideoId } from "@/app/services/helperFunctions";
import Background from "./background";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

const Hero = () => {
  const [videoId, setVideoId] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const videoRef = useRef<HTMLDivElement | null>(null);

  const { data: dataVideo, isLoading: isLoadingVideo, error: errorVideo } = useYoutubeVideo(videoId);

  const handleVideoSearch = (urlORsearch) => {
    const parsedId = parseYouTubeVideoId(urlORsearch);
    setVideoId(parsedId);
    setSearchTerms("");
  };

  // Scroll to the video when dataVideo changes
  useEffect(() => {
    if (isLoadingVideo || dataVideo) {
      if (videoRef.current) {
        // Scroll to the component's position plus some extra space
        window.scrollTo({
          top: videoRef.current.offsetTop, // Adjust this value for extra space
          behavior: "smooth",
        });
      }
    }
  }, [isLoadingVideo]); // Only runs when dataVideo changes

  return (
    <>
      <div className="flex flex-col">
        <Background />
        <main className="flex-grow flex flex-col justify-start items-center text-center w-full pt-[5vh]">
          <div className="z-10 flex flex-col items-center gap-6 text-center">
            <img src="https://www.shadcnblocks.com/images/block/block-1.svg" alt="logo" className="h-16" />
            <Badge variant="outline">UI Blocks</Badge>

            <div>
              <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">Search for YouTube Comments</h1>
              <p className="text-muted-foreground lg:text-xl">Enter a video URL or channel name to begin</p>
              <ul>
                <li>https://www.youtube.com/watch?v=yfWVQ25UmEQ</li>
                <li>https://www.youtube.com/watch?v=34jW2MBME0Q&t=740s</li>
              </ul>
            </div>

            <SearchBar className="py-5 w-3/4" onSearch={handleVideoSearch} placeholder={"Search"} />
          </div>

          {errorVideo && <p>Error: {errorVideo.message}</p>}
      

          <div className={`flex-grow ${isLoadingVideo || dataVideo ? "h-screen" : "h-auto"}`} ref={videoRef}>
            {isLoadingVideo ? (
              <VideoSkeleton />
            ) : (
              dataVideo && 
              <>
                <Video video={dataVideo} />
                <CommentSection videoId={videoId} />
              </>

            )}
          </div>

          {/* {isLoadingVideo && (
            <div className="h-screen" ref={videoRef}>
              <VideoSkeleton ref={videoRef} />
            </div>
          )}
          {dataVideo && (
            <div classname="h-screen" >
              <Video video={dataVideo} />
            </div>
          )} */}


        </main>
      </div>
    </>
  );
};

export default Hero;

/* <div className="max-w-2xl w-full mx-auto px-4">
    <h1 className="text-7xl font-bold mb-4">Search for YouTube Comments</h1>
    <p className="mb-6 text-gray-600">Enter a YouTube video URL to find comments</p>
    <li>Search all comment sections on channel</li>
    <li>https://www.youtube.com/watch?v=yfWVQ25UmEQ</li>
    <li>https://www.youtube.com/watch?v=34jW2MBME0Q&t=740s</li>

    <SearchBar className="py-10" onSearch={handleVideoSearch} placeholder={"Search"}/>
    
  </div> */

// "use client";
// import { useRef, useState } from "react";
// import CommentSection from "./commentSection";
// import Video from "./video";
// import SearchBar from "./searchBar";
// import VideoSkeleton from "./videoSkeleton";
// import Background from './background';
// import Technolodgies from './technoledgies';
// import { Badge } from '@/components/ui/badge';
// import { ExternalLink } from 'lucide-react';

// import useYoutubeComments from "../../app/hooks/useYoutubeComments";
// import useYoutubeVideo from "@/app/hooks/useYoutubeVideo";

// import { parseYouTubeVideoId } from "@/app/services/helperFunctions";

// import tempComments from "../../app/entities/tempComments";
// import tempVideo from "../../app/entities/tempVideo";
// import CommentSkeleton from "./commentSkeleton";

// const Hero = () => {
//   const [videoId, setVideoId] = useState("");
//     const [searchTerms, setSearchTerms] = useState("");
//     const { data: dataVideo, isLoading: isLoadingVideo, error:errorVideo } = useYoutubeVideo(videoId);
//     const { data: dataComment, isLoading: isLoadingComment, error: errorComment } = useYoutubeComments(videoId, searchTerms);
//     const commentSkeletons = [1,2,3,4,5,6,7,8,9]

//     const handleVideoSearch = (urlORsearch) => {
//       const parsedId = parseYouTubeVideoId(urlORsearch);
//       setVideoId(parsedId); // Update videoId state with the parsed video ID
//     };

//     const handleCommentSearch = (searchTerms) => {
//       console.log(searchTerms)
//       setSearchTerms(searchTerms);
//     };

//   return (
//     <section className="overflow-hidden py-32 z-10">
//       <Background />
//       <div className="container mx-auto">

//         <div className="mx-auto flex max-w-5xl flex-col">
//           <div className="z-10 flex flex-col items-center gap-6 text-center">

//             <img
//               src="https://www.shadcnblocks.com/images/block/block-1.svg"
//               alt="logo"
//               className="h-16"
//             />
//             <Badge variant="outline">UI Blocks</Badge>

//             <div>
//               <h1 className="mb-6 text-pretty text-2xl font-bold lg:text-5xl">
//                 Search for Youtube Comments
//               </h1>
//               <p className="text-muted-foreground lg:text-xl">
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
//                 doloremque mollitia fugiat omnis! Porro facilis quo animi
//                 consequatur. Explicabo.
//               </p>
//             </div>

//             {/* <div className="mt-4 flex justify-center gap-2">
//               <Button>Get Started</Button>
//               <Button variant="outline">
//                 Learn more <ExternalLink className="ml-2 h-4" />
//               </Button>
//             </div> */}

//             <SearchBar className="py-5 w-1/2" onSearch={handleVideoSearch} />

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
