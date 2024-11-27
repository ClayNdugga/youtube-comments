import React, { useEffect, useRef, useState } from "react";
import CommentCard from "./comment";

import SearchBar from "./searchBar";
import useYoutubeComments from "@/app/hooks/useYoutubeComments";
import CommentSkeleton from "./commentSkeleton";
import { Button } from "../ui/button";
import useSpotifyTracks from "@/app/hooks/useSpotifyTracks";
import SongGrid from "./songGrid";
import AlbumGridSkeleton from "./albumGridSkeleton";

import InfiniteScroll from "react-infinite-scroll-component";
import PropogateLoader from "react-spinners/PropagateLoader";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import useUniqueSongs from "@/app/hooks/useUniqueSongs";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";

interface Props {
  // fetchedComments: YoutubeFetchResponse<CommentThreadResource>;
  videoId?: string;
  channelId: string;

  // setOrder: (order: string) => void;
  // onSearch: (searchTerms: string) => void;
  // onSearch={handleCommentSearch}
}

const CommentSection = ({ videoId, channelId }: Props) => {
  const [searchTerms, setSearchTerms] = useState("");
  const [search, setSearch] = useState<boolean>(false);
  const [order, setOrder] = useState("");
  
  const [queuedJob, setQueuedJob] = useState<boolean>(false);
  const [songQueries, setSongQueries] = useState<string[]>([]);

  const commentRef = useRef<HTMLDivElement | null>(null);

  const [page, setPage] = useState(0);
  const [songsPerPage] = useState(4);
  const [totalPages, setTotalPages] = useState(0);

  const { theme } = useTheme();

  const {
    data: dataComment,
    isLoading: isLoadingComment,
    error: errorComment,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useYoutubeComments(searchTerms, order, videoId, channelId);
  const commentSkeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const {
    data: dataSong,
    isLoading: isLoadingSong,
    error: errorSong,
  } = useSpotifyTracks(songQueries, page, songsPerPage);
  const { data: SongQ } = useUniqueSongs(channelId, search, videoId);

  useEffect(() => {
    if (isLoadingComment) {
      if (commentRef.current) {
        // Scroll to the component's position plus some extra space
        window.scrollTo({
          top: commentRef.current.offsetTop, // Adjust this value for extra space
          behavior: "smooth",
        });
      }
    }
  }, [isLoadingComment]);

  function handleOrdering() {
    setOrder("relevance");
  }

  const handleCommentSearch = (searchTerms: string) => {
    setOrder("time");
    console.log(searchTerms);
    setSearchTerms(searchTerms);
  };

  const handleSongSearch = () => {
    setSearch(true);
  };

  useEffect(() => {
    console.log(SongQ);
    setTotalPages(SongQ?.songs ? Math.ceil(SongQ.songs.length / songsPerPage) : 0);
    console.log(`totalPages: ${totalPages}`)
    if (SongQ && SongQ.songs) {
      setSongQueries(SongQ.songs); 
    }
    if (SongQ && SongQ.status === "queued") {
      setQueuedJob(true); 
    }
  }, [SongQ]);

  const handleNext = () => {
    if (page + 1 <= totalPages) {
      setPage(page + 1);
      console.log(`page: ${page}`)
    }
  };
  const handlePrev = () => {
    if (page - 1 >= 0) {
      setPage(page - 1);
      console.log(`page: ${page}`)
    }
  };

  return (
    <>

      <div className="flex flex-row justify-center space-x-4 pt-12" ref={commentRef}>
        {!!videoId && <Button variant="outline" className="w-[150px]" onClick={handleOrdering}>
          Top Comments
        </Button>}

        <SearchBar className="w-3/4 mb-10" onSearch={handleCommentSearch} placeholder={"Search Comments"} />
        {/* <Button className="w-[150px] bg-green-500 flex items-center space-x-2"> */}
        {(videoId && <Button className="w-[150px] flex items-center space-x-2 bg-foreground" onClick={handleSongSearch}>
          <img
            src={ theme === "dark" ? "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png" : "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"}
            alt="icon"
            className="w-4 h-4"
          />
          <span> </span>Song Search
        </Button>)}
      </div>

      {errorSong && <p>Error: {errorSong.message}</p>}
      {queuedJob && !(isLoadingSong || dataSong) && <div className="flex justify-center items-center">
          <ClimbingBoxLoader color={theme === "dark"? "white": "black"}className="py-12" size={10} />
          <p className="text-base font-medium">Job in queue...</p>
        </div>}

      <div className="flex flex-row items-center justify-center">
        {(dataSong || isLoadingSong) && (
          <div className="min-w-20">
            {page != 0 && <Button variant="outline" onClick={handlePrev} size="icon">
              <ChevronLeft />
            </Button>}
          </div>
        )}
        
        {isLoadingSong && <AlbumGridSkeleton />}
        {/* <AlbumGridSkeleton /> */}
        {dataSong && (
          <div className="flex justify-center items-center">
            <SongGrid dataSong={dataSong} />
          </div>
        )}
 
        {(dataSong || isLoadingSong) && (
          <div className="min-w-20">
            {page != (totalPages-1) && <Button variant="outline" onClick={handleNext} size="icon">
              <ChevronRight />
            </Button>}
          </div>
        )}
      </div>

      {errorComment && <p>Error: {errorComment.message}</p>}
      <div className={`flex-grow ${isLoadingComment || dataComment ? "h-screen" : "h-auto"} `}>
        {isLoadingComment
          ? commentSkeletons.map((skeleton) => <CommentSkeleton key={skeleton} />)
          : dataComment && (
              <>
                <InfiniteScroll
                  dataLength={dataComment.pages.flatMap((page) => page.items).length} // Total length of items loaded so far
                  next={() => {
                    if (!isFetchingNextPage) {
                      fetchNextPage({ cancelRefetch: false });
                    }
                  }} // Function to fetch next page
                  hasMore={!!hasNextPage} // Check if there's more data to load
                  loader={<></>}
                  scrollThreshold={1.0} // Fetch more when 90% scrolled
                >
                  {dataComment.pages.flatMap((page) =>
                    page.items.map((commentResource) => (
                      <CommentCard key={commentResource.id} comment={commentResource} />
                    ))
                  )}
                </InfiniteScroll>
                {isFetchingNextPage && <PropogateLoader className="py-12" size={10} />}
                <div className="min-h-60" />
              </>
            )}
      </div>
    </>
  );
};

export default CommentSection;
