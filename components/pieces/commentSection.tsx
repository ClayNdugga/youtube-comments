import React, { useEffect, useRef, useState } from "react";
import CommentCard from "./comment";
import { YoutubeFetchResponse, CommentThreadResource } from "../../app/entities/youtube";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBar from "./searchBar";
import useYoutubeComments from "@/app/hooks/useYoutubeComments";
import CommentSkeleton from "./commentSkeleton";
import { Button } from "../ui/button";
import useSpotifyTracks from "@/app/hooks/useSpotifyTracks";
import SongGrid from "./songGrid";
import { Skeleton } from "../ui/skeleton";
import AlbumGridSkeleton from "./albumGridSkeleton";

import InfiniteScroll from "react-infinite-scroll-component";
import PropogateLoader from "react-spinners/PropagateLoader";
import useUniqueSongs from "@/app/hooks/useUniqueSongs";

interface Props {
  // fetchedComments: YoutubeFetchResponse<CommentThreadResource>;
  videoId: string;
  channelId: string

  // setOrder: (order: string) => void;
  // onSearch: (searchTerms: string) => void;
  // onSearch={handleCommentSearch}
}

const CommentSection = ({ videoId, channelId }: Props) => {
  const [searchTerms, setSearchTerms] = useState("");
  const [order, setOrder] = useState("");
  const [songQueries, setSongQueries] = useState<string[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const commentRef = useRef<HTMLDivElement | null>(null);

  const {
    data: dataComment,
    isLoading: isLoadingComment,
    error: errorComment,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useYoutubeComments(videoId, searchTerms, order);
  const commentSkeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const { data: dataSong, isLoading: isLoadingSong, error: errorSong } = useSpotifyTracks(songQueries);
  const { data: SongQ, isLoading: isLoadingUnique, error: errorUnique} = useUniqueSongs(channelId, videoId, search)


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

  function handleOrdering(newOrder) {
    setOrder("relevance");
  }

  const handleCommentSearch = (searchTerms) => {
    setOrder("time");
    console.log(searchTerms);
    setSearchTerms(searchTerms);
  };


  const handleSongSearch = () => {
    setSearch(true)
  };

  useEffect(() => {
    console.log(SongQ)
    if (SongQ && SongQ.songs) {
      setSongQueries(SongQ.songs);  // Update the songs only when SongQ is available
    }
  }, [SongQ]);

  return (
    <>
      <div className="flex flex-row justify-start space-x-4 pt-12" ref={commentRef}>
        {/* <Select value={order} onValueChange={handleOrdering}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Time">Time</SelectItem>
            <SelectItem value="Relevance">Relevance</SelectItem>
          </SelectContent>
        </Select> */}

        <Button variant="outline" className="w-[150px]" onClick={handleOrdering}>
          Top Comments
        </Button>

        <SearchBar className="w-3/4 mb-10" onSearch={handleCommentSearch} placeholder={"Search Comments"} />
        {/* <Button className="w-[150px] bg-green-500 flex items-center space-x-2"> */}
        <Button className="w-[150px] flex items-center space-x-2" onClick={handleSongSearch}>
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png"
            alt="icon"
            className="w-4 h-4"
          />
          <span> </span>Song Search
        </Button>
      </div>
      {errorSong && <p>Error: {errorSong.message}</p>}
      {isLoadingSong && <AlbumGridSkeleton />}
      {/* <AlbumGridSkeleton /> */}
      {dataSong && (
        <div className="flex justify-center items-center">
          <SongGrid dataSong={dataSong} />
        </div>
      )}
      {/* {errorComment && <p>Error: {errorComment.message}</p>}
      {isLoadingComment && commentSkeletons.map((skeleton) => <CommentSkeleton key={skeleton} />)}
      {dataComment && (
        <div >
          {dataComment?.items.map((commentResource) => (
            <CommentCard key={commentResource.id} comment={commentResource} />
          ))}
        </div>
      )} */}
      {errorComment && <p>Error: {errorComment.message}</p>}
      <div className={`flex-grow ${isLoadingComment || dataComment ? "h-screen" : "h-auto"}`}>
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
