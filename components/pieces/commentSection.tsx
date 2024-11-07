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

interface Props {
  // fetchedComments: YoutubeFetchResponse<CommentThreadResource>;
  videoId: string;

  // setOrder: (order: string) => void;
  // onSearch: (searchTerms: string) => void;
  // onSearch={handleCommentSearch}
}

const CommentSection = ({ videoId }: Props) => {
  const [searchTerms, setSearchTerms] = useState("");
  const [order, setOrder] = useState("");
  const [songQueries, setSongQueries] = useState<string[]>([]);
  const commentRef = useRef<HTMLDivElement | null>(null);

  const { data: dataComment, isLoading: isLoadingComment, error: errorComment, isFetching } = useYoutubeComments(videoId, searchTerms, order);
  const commentSkeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const { data: dataSong, isLoading: isLoadingSong, error: errorSong } = useSpotifyTracks(songQueries);

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
    // if (newOrder === "relevance") {
    //   setSearchTerms("")
    // }
    setOrder("relevance");
    // setSearchTerms(" ")
  }

  const handleCommentSearch = (searchTerms) => {
    setOrder("time");
    console.log(searchTerms);
    setSearchTerms(searchTerms);
  };

  const handleSongSearch = () => {
    setSongQueries(["komm susser todd", "rei II"]);
  };

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
          <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png" alt="icon" className="w-4 h-4" />
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
                {dataComment?.items.map((commentResource) => (
                  <CommentCard key={commentResource.id} comment={commentResource} />
                ))}
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </>
            )}
      </div>

      \
    </>
  );
};

export default CommentSection;
