import { ArrowDownRight, MessageCircleMore, ThumbsUp, Eye, Timer, Calendar, ChevronUp } from "lucide-react";
import React, { forwardRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YoutubeFetchResponse, YouTubeVideoResource } from "../../app/entities/youtube";
import { formatTimestamp, formatLargeNumber, timeSinceUpload } from "../../app/services/helperFunctions";
import SearchBar from "./searchBar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";

import { ChevronDown } from "lucide-react";
import useYoutubeChannel from "@/app/hooks/useYoutubeChannel";

interface Props {
  video: YoutubeFetchResponse<YouTubeVideoResource>;
}

const Video = forwardRef<HTMLElement, Props>(({ video }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const snip = video.items[0];

  const { data: dataChannel, isLoading: isLoadingChannel, error: errorChannel } = useYoutubeChannel(snip.snippet.channelId, false);



  return (
    <section className="pt-32 pb-12" ref={ref}>
      <div className="container flex flex-col space-y-4">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img src={snip.snippet.thumbnails.high ? snip.snippet.thumbnails.high.url : snip.snippet.thumbnails.default.url} alt="placeholder hero" className="max-h-96 w-full rounded-md object-cover" />

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-5xl">{snip.snippet.title}</h1>

            <div className="flex flex-row gap-3 mb-10">
              <Badge variant="outline">
                {timeSinceUpload(snip.snippet.publishedAt)}
                <Calendar className="ml-2 size-4" />
              </Badge>
              <Badge variant="outline">
                {formatTimestamp(snip.contentDetails.duration)}
                <Timer className="ml-2 size-4" />
              </Badge>
              <Badge variant="outline">
                {formatLargeNumber(snip.statistics.viewCount)}
                <Eye className="ml-2 size-4" />
              </Badge>
              <Badge variant="outline">
                {formatLargeNumber(snip.statistics.likeCount)}
                <ThumbsUp className="ml-2 size-4" />
              </Badge>
              <Badge variant="outline">
                {formatLargeNumber(snip.statistics.commentCount)}
                <MessageCircleMore className="ml-2 size-4" />
              </Badge>
            </div>

            <div className="flex flex-row items-center space-x-2">
              <Avatar className="w-12 h-12 rounded-full">
                {dataChannel && <AvatarImage src={dataChannel.items[0].snippet.thumbnails.medium.url} className="rounded-full"/>}
                {isLoadingChannel && <AvatarImage src="/images/placeholderAvatar.png" className="rounded-full"/>}
              </Avatar>
              <div className="flex flex-col items-start">
                <p className="font-semibold	 text-md">{snip.snippet.channelTitle}</p>
                {dataChannel && <p className="text-muted-foreground text-sm">{formatLargeNumber(dataChannel.items[0].statistics.subscriberCount)} Subscribers</p>}
              </div>
            </div>
          </div>
        </div>

        {snip.snippet.description && <Collapsible>
          <CollapsibleTrigger className="flex items-center text-base font-medium">
            Description
            <Button variant="ghost" size="sm" className="w-9 p-0" onClick={() => setIsOpen(!isOpen)}>
              <div className="p-1 rounded-full transition-colors group-hover:bg-muted">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap text-left">
            {snip.snippet.description}
          </CollapsibleContent>
        </Collapsible>}
        
      </div>
    </section>
  );
});

export default Video;
