import { ArrowDownRight, MessageCircleMore, ThumbsUp, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YoutubeFetchResponse, YouTubeVideoResource } from "../../app/entities/youtube";
import {formatTimestamp, formatLargeNumber } from "../../app/services/helperFunctions";


interface Props {
    video: YoutubeFetchResponse<YouTubeVideoResource>
}


const Video = ({video}: Props) => {
    const snip = video.items[0]
    
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img
            src={snip.snippet.thumbnails.standard.url}
            // src="https://www.shadcnblocks.com/images/block/placeholder-1.svg"
            alt="placeholder hero"
            className="max-h-96 w-full rounded-md object-cover"
          />
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex flex-row gap-3">
                <Badge variant="outline"> New Release <ArrowDownRight className="ml-2 size-4" /></Badge>
                <Badge variant="outline">{formatTimestamp(snip.contentDetails.duration)}</Badge>
                <Badge variant="outline">{formatLargeNumber(snip.statistics.viewCount)}<Eye className="ml-2 size-4" /></Badge>
                <Badge variant="outline">{formatLargeNumber(snip.statistics.likeCount)}<ThumbsUp className="ml-2 size-4" /></Badge>
                <Badge variant="outline">{formatLargeNumber(snip.statistics.commentCount)}<MessageCircleMore className="ml-2 size-4" /></Badge>                
            </div>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
              {snip.snippet.title}
            </h1>
            <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
              {snip.snippet.description.slice(0,300)}...
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button className="w-full sm:w-auto">Primary Button</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Secondary Button
                <ArrowDownRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Video;
