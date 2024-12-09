"use client";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./commentSection";
import Video from "./video";
import SearchBar from "./searchBar";
import VideoSkeleton from "./videoSkeleton";

import useYoutubeVideo from "@/app/hooks/useYoutubeVideo";

import { parseSearch } from "@/app/services/helperFunctions";
import { Badge } from "../ui/badge";
import useYoutubeChannel from "@/app/hooks/useYoutubeChannel";
import Channel from "./channel";
import { useTheme } from "next-themes";


import { sendGAEvent } from '@next/third-parties/google'


const Hero = () => {
  const [videoId, setVideoId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [, setSearchTerms] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentContent, setCurrentContent] = useState("");

  const { data: dataVideo, isLoading: isLoadingVideo, error: errorVideo } = useYoutubeVideo(videoId);
  const { data: dataChannel, isLoading: isLoadingChannel, error: errorChannel } = useYoutubeChannel(channelId, true);

  const { theme } = useTheme();

  const handleVideoSearch = (urlOrSearch: string) => {
    const [parsedId, isVideo] = parseSearch(urlOrSearch);

    if (isVideo) {
      setVideoId(parsedId);
      setCurrentContent("video");
    } else {
      setCurrentContent("channel");
      setChannelId(parsedId);
    }

    sendGAEvent('event', 'searchTerms', { value: parsedId })
    setSearchTerms("");
  };

  // Scroll to the video when dataVideo changes
  useEffect(() => {
    if (isLoadingVideo || dataVideo || isLoadingChannel || dataChannel) {
      if (contentRef.current) {
        // Scroll to the component's position plus some extra space
        window.scrollTo({
          top: contentRef.current.offsetTop, // Adjust this value for extra space
          behavior: "smooth",
        });
      }
    }
  }, [isLoadingVideo, isLoadingChannel]); // Only runs when dataVideo changes

  return (
    <>
      <div className="flex flex-col">
        {/* <Background /> */}

        <main className="flex-grow flex flex-col justify-start items-center text-center w-full pt-[5vh]">
         
          {/* <Starfield /> */}

          <div className="z-10 flex flex-col items-center gap-10 text-center">
            <Badge variant="outline" className="text-sm">
              Search Tool
            </Badge>

            <div className="max-w-3xl space-y-4">
              <h1 className="mb-6 text-pretty text-5xl font-bold sm:text-6xl lg:text-7xl">
                Discover Insights from <span className="text-gradient">YouTube Comments</span>
              </h1>

              <div className="flex flex-col items-center align-middle">
                <p className="text-muted-foreground text-lg sm:text-xl">
                  Search for keywords in YouTube comments. Enter a video or channel URL to begin.
                </p>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-muted-foreground text-lg sm:text-xl">
                    Use
                  </p>
                  <img
                        src={
                          theme === "light"
                            ? "/images/spotifyBlack.png"
                            : "/images/spotifyWhite.png"
                        }
                        alt="icon"
                        className="w-4 h-4"
                      />
                  <p className="text-muted-foreground text-lg sm:text-xl">
                    Spotify Integration to search the comments for songs.
                  </p>
                </div>
              </div>

              

            </div>


        

            {/* Examples and Search Section */}
            <div className="flex flex-col w-full max-w-4xl items-center">
            
              <SearchBar
                className="mt-6 py-4 w-4/5 mx-auto"
                onSearch={handleVideoSearch}
                placeholder={"video or channel URL"}
              />
            </div>
          </div>

          {errorVideo && <p>Error: {errorVideo.message}</p>}
          {errorChannel && <p>Error: {errorChannel.message}</p>}


          <div
            className={`flex-grow px-4 sm:px-6 lg:px-8 w-full mx-auto overflow-x-hidden${
            // className={`flex-grow ${
              (isLoadingVideo || dataVideo) && currentContent === "video" ? "h-screen" : "h-auto"
            }`}
            ref={contentRef}
          >
            {isLoadingVideo ? (
              <VideoSkeleton />
            ) : (
              dataVideo &&
              dataVideo.items.length > 0 &&
              currentContent === "video" && (
                <>
                  <Video video={dataVideo} searchFn={handleVideoSearch}/>
                  <CommentSection channelId={dataVideo.items[0].snippet.channelId} videoId={videoId} />
                </>
              )
            )}
          </div>

          <div
            className={`flex-grow max-w-full ${
              (isLoadingChannel || dataChannel) && currentContent === "channel" ? "h-screen" : "h-auto"
            }`}
            ref={contentRef}
          >
            {isLoadingChannel ? (
              <VideoSkeleton />
            ) : (
              dataChannel &&
              currentContent === "channel" && (
                <div className="flex flex-col max-w-full items-center px-10">
                  <Channel channel={dataChannel} />
                  <CommentSection channelId={dataChannel.items[0].id} />
                </div>
              )
            )}
          </div>

        </main>
      </div>
    </>
  );
};

export default Hero;




// under section
// <div className="z-10 flex flex-col items-center gap-6 text-center">
//           <img src="https://www.shadcnblocks.com/images/block/block-1.svg" alt="logo" className="h-16" />
//           <Badge variant="outline">UI Blocks</Badge>

//           <div>
//             <h1 className="mb-6 text-pretty text-4xl font-bold sm:text-5xl lg:text-6xl">Search for <span className="text-gradient">YouTube Comments</span></h1>
//             <p className="text-muted-foreground lg:text-xl">Enter a video URL or channel name to begin</p>
//             <ul>
//               <li>Video URL</li>
//               <li>Channel URL</li>
//               <li>@channel_name</li>
//               <li> _ </li>
//               <li>https://www.youtube.com/watch?v=XMqrkaiNHSc</li>
//               <li>https://www.youtube.com/watch?v=34jW2MBME0Q&t=740s</li>
//               <li>https://www.youtube.com/watch?v=r_nBlutWzp4&ab_channel=TheTrenTwins</li>
//               <li>https://www.youtube.com/watch?v=FFGtU_o86_U</li>
//             </ul>
//           </div>
//           <SearchBar className="py-5 w-3/4" onSearch={handleVideoSearch} placeholder={"Search"} />
//         </div> 



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

// import {  } rom "@/app/services/helperFunctions";

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
//       const parsedId = (ORsearch);
//       setVideoId(parsedId); // Update videoId state with the parsed video ID
//     };

//     const handleCommentSearch = (searchTerms) => {
//       console.log(searchTerms)
//       setSearchTerms(searchTerms);
//     };



// {/* <ul>
//                   <li>https://www.youtube.com/watch?v=4HaA9rIAsm0</li>
//                   <li>https://www.youtube.com/watch?v=WTJB8zQW1Uo</li>
//                   <li>https://www.youtube.com/watch?v=LCPXgoIt5nE</li>
//                   <li>https://www.youtube.com/watch?v=e0kQIcqrJ8o</li>
//                   <li>https://www.youtube.com/watch?v=nYcVZSznW2o</li>
//                   <li>https://www.youtube.com/watch?v=R6mzaePnkN0</li>
//                   <li>https://www.youtube.com/watch?v=9HYtGZ9QgNY</li>
//                   <li>https://www.youtube.com/watch?v=__D5M_8cEQQ</li>
//                   <li>https://www.youtube.com/watch?v=e7bmG5eaJaY</li>
//                   <li>https://www.youtube.com/watch?v=QprSqzajhT0</li>
//                   <li>https://www.youtube.com/watch?v=XMqrkaiNHSc</li>
//                   <li>https://www.youtube.com/watch?v=TTp9NVY0mgM</li>
//                   <li>https://www.youtube.com/watch?v=Pf7VYfjP5QE</li>
//                   <li>https://www.youtube.com/watch?v=UVQKTsbYDcY</li>
//                   <li>https://www.youtube.com/watch?v=rdzQhZ6qCWs</li>
//                   <li>https://www.youtube.com/watch?v=ZTJ5uqSk9GA</li>
//                   <li>https://www.youtube.com/watch?v=dAndaKjaA6Y</li>
//                   <li>https://www.youtube.com/watch?v=N023C6KgHcg</li>
//                   <li>https://www.youtube.com/watch?v=6xmSP3IaLb8</li>
//                   <li>https://www.youtube.com/watch?v=AAMvAwCUtRA</li>
//                   <li>https://www.youtube.com/watch?v=GkBQzvkMPvU</li>
//                   <li>https://www.youtube.com/watch?v=lIaSY7N6oDs</li>
//                   <li>https://www.youtube.com/watch?v=VU__tKZ3Ed4</li>
//                   <li>https://www.youtube.com/watch?v=DHv3FAKxKKM</li>
//                   <li>https://www.youtube.com/watch?v=R-FBzJ3fU4w</li>
//                   <li>https://www.youtube.com/watch?v=kktVqyYTM7Q</li>
//                   <li>https://www.youtube.com/watch?v=s0df_8wmNGg</li>
//                   <li>https://www.youtube.com/watch?v=mxATJPvTMfI</li>
//                   <li>https://www.youtube.com/watch?v=2hpb6nNXAXY</li>
//                   <li>https://www.youtube.com/watch?v=A4Wb-FQDfzY</li>
//                   <li>https://www.youtube.com/watch?v=MqgJ_LtCYrA</li>
//                   <li>https://www.youtube.com/watch?v=5Fdn5LcH7jc</li>
//                   <li>https://www.youtube.com/watch?v=L-e_LjZ6-6g</li>
//                   <li>https://www.youtube.com/watch?v=WkouqL3Rp-Y</li>
//                   <li>https://www.youtube.com/watch?v=5fbQestfUqg</li>
//                   <li>https://www.youtube.com/watch?v=QebMlaehWCU</li>
//                   <li>https://www.youtube.com/watch?v=4JVFs4WfbHk</li>
//                   <li>https://www.youtube.com/watch?v=n2eNiNuiXfQ</li>
//                   <li>https://www.youtube.com/watch?v=IfiuSs1SKMk</li>
//                   <li>https://www.youtube.com/watch?v=y5iuNgXT7dE</li>
//                   <li>https://www.youtube.com/watch?v=2VgtsdYccTw</li>
//                   <li>https://www.youtube.com/watch?v=P6ihDewy3JE</li>
//                   <li>https://www.youtube.com/watch?v=-qItbMzRuv8</li>
//                   <li>https://www.youtube.com/watch?v=UnNbM-edTVM</li>
//                   <li>https://www.youtube.com/watch?v=ST501zIKlJQ</li>
//                   <li>https://www.youtube.com/watch?v=kyKiZJ_FCnA</li>
//                   <li>https://www.youtube.com/watch?v=lFT-GlEn5Jo</li>
//                   <li>https://www.youtube.com/watch?v=bmXWoBlxLek</li>
//                   <li>https://www.youtube.com/watch?v=UHqqQG5FN4s</li>
//                   <li>https://www.youtube.com/watch?v=-rcB3_z0dN8</li>
//               </ul> */}

//               {/* ATTEMPTING LEG DAY (WE HIT ARMS?) */}
//               {/* MASS BUILDING ARM DAY */}

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
