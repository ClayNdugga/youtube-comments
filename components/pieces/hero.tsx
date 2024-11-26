"use client";
import { useEffect, useRef, useState } from "react";
import CommentSection from "./commentSection";
import Video from "./video";
import SearchBar from "./searchBar";
import VideoSkeleton from "./videoSkeleton";

import useYoutubeVideo from "@/app/hooks/useYoutubeVideo";

import { parseSearch } from "@/app/services/helperFunctions";
import Background from "./background";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import useYoutubeChannel from "@/app/hooks/useYoutubeChannel";
import Channel from "./channel";
import { useTheme } from "next-themes";

const Hero = () => {
  const [videoId, setVideoId] = useState("");
  const [channelId, setChannelId] = useState("");
  const [searchTerms, setSearchTerms] = useState("");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [currentContent, setCurrentContent] = useState("");

  const { data: dataVideo, isLoading: isLoadingVideo, error: errorVideo } = useYoutubeVideo(videoId);
  const { data: dataChannel, isLoading: isLoadingChannel, error: errorChannel } = useYoutubeChannel(channelId, true);

  const { theme, setTheme } = useTheme();

  const handleVideoSearch = (urlOrSearch: string) => {
    const [parsedId, isVideo] = parseSearch(urlOrSearch);

    if (isVideo) {
      setVideoId(parsedId);
      setCurrentContent("video");
    } else {
      setCurrentContent("channel");
      setChannelId(parsedId);
    }

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
          {/* <div className="z-10 flex flex-col items-center gap-6 text-center">
            <img src="https://www.shadcnblocks.com/images/block/block-1.svg" alt="logo" className="h-16" />
            <Badge variant="outline">UI Blocks</Badge>

            <div>
              <h1 className="mb-6 text-pretty text-4xl font-bold sm:text-5xl lg:text-6xl">Search for <span className="text-gradient">YouTube Comments</span></h1>
              <p className="text-muted-foreground lg:text-xl">Enter a video URL or channel name to begin</p>
              <ul>
                <li>Video URL</li>
                <li>Channel URL</li>
                <li>@channel_name</li>
                <li> _ </li>
                <li>https://www.youtube.com/watch?v=XMqrkaiNHSc</li>
                <li>https://www.youtube.com/watch?v=34jW2MBME0Q&t=740s</li>
                <li>https://www.youtube.com/watch?v=r_nBlutWzp4&ab_channel=TheTrenTwins</li>
                <li>https://www.youtube.com/watch?v=FFGtU_o86_U</li>
              </ul>
            </div>
            <SearchBar className="py-5 w-3/4" onSearch={handleVideoSearch} placeholder={"Search"} />
          </div> */}

          <div className="z-10 flex flex-col items-center gap-10 text-center">
            {/* Logo Section */}
            {/* <img src="https://www.shadcnblocks.com/images/block/block-1.svg" alt="Logo" className="h-16 mb-4" /> */}

            {/* Badge Section */}
            <Badge variant="outline" className="text-sm">
              Search Tool
            </Badge>

            {/* Heading and Description */}
            <div className="max-w-3xl space-y-4">
              <h1 className="mb-6 text-pretty text-5xl font-bold sm:text-6xl lg:text-7xl">
                Discover Insights from <span className="text-gradient">YouTube Comments</span>
              </h1>

              <p className="text-muted-foreground text-lg sm:text-xl">
                Search for keywords in YouTube comments. Enter a video or channel URL to begin
              </p>
              <ul>
                  <li>https://www.youtube.com/watch?v=4HaA9rIAsm0</li>
                  <li>https://www.youtube.com/watch?v=WTJB8zQW1Uo</li>
                  <li>https://www.youtube.com/watch?v=LCPXgoIt5nE</li>
                  <li>https://www.youtube.com/watch?v=e0kQIcqrJ8o</li>
                  <li>https://www.youtube.com/watch?v=nYcVZSznW2o</li>
                  <li>https://www.youtube.com/watch?v=R6mzaePnkN0</li>
                  <li>https://www.youtube.com/watch?v=9HYtGZ9QgNY</li>
                  <li>https://www.youtube.com/watch?v=__D5M_8cEQQ</li>
                  <li>https://www.youtube.com/watch?v=e7bmG5eaJaY</li>
                  <li>https://www.youtube.com/watch?v=QprSqzajhT0</li>
                  <li>https://www.youtube.com/watch?v=XMqrkaiNHSc</li>
                  <li>https://www.youtube.com/watch?v=TTp9NVY0mgM</li>
                  <li>https://www.youtube.com/watch?v=Pf7VYfjP5QE</li>
                  <li>https://www.youtube.com/watch?v=UVQKTsbYDcY</li>
                  <li>https://www.youtube.com/watch?v=rdzQhZ6qCWs</li>
                  <li>https://www.youtube.com/watch?v=ZTJ5uqSk9GA</li>
                  <li>https://www.youtube.com/watch?v=dAndaKjaA6Y</li>
                  <li>https://www.youtube.com/watch?v=N023C6KgHcg</li>
                  <li>https://www.youtube.com/watch?v=6xmSP3IaLb8</li>
                  <li>https://www.youtube.com/watch?v=AAMvAwCUtRA</li>
                  <li>https://www.youtube.com/watch?v=GkBQzvkMPvU</li>
                  <li>https://www.youtube.com/watch?v=lIaSY7N6oDs</li>
                  <li>https://www.youtube.com/watch?v=VU__tKZ3Ed4</li>
                  <li>https://www.youtube.com/watch?v=DHv3FAKxKKM</li>
                  <li>https://www.youtube.com/watch?v=R-FBzJ3fU4w</li>
                  <li>https://www.youtube.com/watch?v=kktVqyYTM7Q</li>
                  <li>https://www.youtube.com/watch?v=s0df_8wmNGg</li>
                  <li>https://www.youtube.com/watch?v=mxATJPvTMfI</li>
                  <li>https://www.youtube.com/watch?v=2hpb6nNXAXY</li>
                  <li>https://www.youtube.com/watch?v=A4Wb-FQDfzY</li>
                  <li>https://www.youtube.com/watch?v=MqgJ_LtCYrA</li>
                  <li>https://www.youtube.com/watch?v=5Fdn5LcH7jc</li>
                  <li>https://www.youtube.com/watch?v=L-e_LjZ6-6g</li>
                  <li>https://www.youtube.com/watch?v=WkouqL3Rp-Y</li>
                  <li>https://www.youtube.com/watch?v=5fbQestfUqg</li>
                  <li>https://www.youtube.com/watch?v=QebMlaehWCU</li>
                  <li>https://www.youtube.com/watch?v=4JVFs4WfbHk</li>
                  <li>https://www.youtube.com/watch?v=n2eNiNuiXfQ</li>
                  <li>https://www.youtube.com/watch?v=IfiuSs1SKMk</li>
                  <li>https://www.youtube.com/watch?v=y5iuNgXT7dE</li>
                  <li>https://www.youtube.com/watch?v=2VgtsdYccTw</li>
                  <li>https://www.youtube.com/watch?v=P6ihDewy3JE</li>
                  <li>https://www.youtube.com/watch?v=-qItbMzRuv8</li>
                  <li>https://www.youtube.com/watch?v=UnNbM-edTVM</li>
                  <li>https://www.youtube.com/watch?v=ST501zIKlJQ</li>
                  <li>https://www.youtube.com/watch?v=kyKiZJ_FCnA</li>
                  <li>https://www.youtube.com/watch?v=lFT-GlEn5Jo</li>
                  <li>https://www.youtube.com/watch?v=bmXWoBlxLek</li>
                  <li>https://www.youtube.com/watch?v=UHqqQG5FN4s</li>
                  <li>https://www.youtube.com/watch?v=-rcB3_z0dN8</li>
              </ul>
            </div>

            {/* Feature Highlights */}
            {/* <div className="flex flex-col items-center space-y-6 sm:space-y-0 sm:space-x-8 sm:flex-row">
              <div className="max-w-xs text-center">
                <h3 className="text-xl font-semibold text-primary">Search by Video</h3>
                <p className="text-sm text-muted-foreground">
                  Enter a YouTube video URL to analyze its comments and find meaningful mentions or insights.
                </p>
              </div>
              <div className="max-w-xs text-center">
                <h3 className="text-xl font-semibold text-primary">Channel-Wide Search</h3>
                <p className="text-sm text-muted-foreground">
                  Explore all comments on a channel by providing a Channel URL or handle (e.g., @channel_name).
                </p>
              </div>
              <div className="max-w-xs text-center">
                <div className="flex flex-row items-center gap-2">
                  <img
                    src={
                      theme === "light"
                        ? "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png"
                        : "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
                    }
                    alt="icon"
                    className="w-4 h-4"
                  />
                  <h3 className="text-xl font-semibold text-primary">Spotify Integration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically match songs found in comments with Spotify and create a playlist in one click!
                </p>
              </div>
            </div> */}

            {/* Examples and Search Section */}
            <div className="flex flex-col w-full max-w-4xl items-center">
              {/* <div className="text-left w-full max-w-md bg-white p-4 shadow-md rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Example Inputs:</h2>
                <ul className="list-disc pl-6 text-gray-600 text-sm space-y-1">
                  <li>
                    <code>Video URL:</code>{" "}
                    <span className="text-blue-500">https://www.youtube.com/watch?v=XMqrkaiNHSc</span>
                  </li>

                  <li>
                    <code>Channel URL:</code>{" "}
                    <span className="text-blue-500">https://www.youtube.com/channel/UC1234567</span>
                  </li>
                  <li>
                    <code>Handle:</code> <span className="text-blue-500">@example_channel</span>
                  </li>
                </ul>
              </div> */}
              <SearchBar
                className="mt-6 py-4 w-4/5 mx-auto"
                onSearch={handleVideoSearch}
                placeholder={"video or channel URL"}
              />
            </div>
          </div>

          {errorVideo && <p>Error: {errorVideo.message}</p>}

          <div
            className={`flex-grow ${
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
                  <Video video={dataVideo} />
                  <CommentSection channelId={dataVideo.items[0].snippet.channelId} videoId={videoId} />
                </>
              )
            )}
          </div>

          <div
            className={`flex-grow ${
              (isLoadingChannel || dataChannel) && currentContent === "channel" ? "h-screen" : "h-auto"
            }`}
            ref={contentRef}
          >
            {isLoadingChannel ? (
              <VideoSkeleton />
            ) : (
              dataChannel &&
              currentContent === "channel" && (
                <>
                  <Channel channel={dataChannel} />
                  <CommentSection channelId={dataChannel.items[0].id} />
                </>
              )
            )}
          </div>

          {/* {isLoadingVideo && (
            <div className="h-screen" ref={contentRef}>
              <VideoSkeleton ref={contentRef} />
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
