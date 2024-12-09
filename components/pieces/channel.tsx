import { MessageCircleMore, Eye, VideoIcon, Calendar, ChevronUp } from "lucide-react";
import React, { forwardRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { YouTubeChannelResource, YoutubeFetchResponse } from "../../app/entities/youtube";
import { formatLargeNumber, timeSinceUpload } from "../../app/services/helperFunctions";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";

import { ChevronDown } from "lucide-react";

interface Props {
  channel: YoutubeFetchResponse<YouTubeChannelResource>;
}

const Channel = forwardRef<HTMLElement, Props>(({ channel }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  const snip = channel.items[0];

  console.log(snip.snippet.description.length);
  console.log(snip.snippet.description);

  return (
    <section className="pt-32 pb-12" ref={ref}>

      <div className="container flex flex-col space-y-4 w-full">

        {/* {snip?.brandingSettings?.image?.bannerExternalUrl && (
          <img
            src={snip.brandingSettings.image.bannerExternalUrl}
            alt="placeholder hero"
            className="max-h-96 w-full rounded-md object-cover"
          />
        )} */}
        
        {" "}



        <div className="">
          {/* <img src={snip.snippet.thumbnails.high.url} alt="placeholder hero" className="max-h-96 w-full rounded-md object-cover" /> */}

          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex flex-row items-center space-x-2">
              <Avatar className="w-64 h-64 rounded-full">
                <AvatarImage src={snip.snippet.thumbnails.medium.url} className="rounded-full" />
                <AvatarFallback><img src="/images/placeholderAvatar.png"></img></AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <h1 className="my-6 text-pretty text-4xl font-bold lg:text-5xl">{snip.snippet.title}</h1>
                <div className="flex flex-row gap-3 mb-10">
                  <Badge variant="outline">
                    {timeSinceUpload(snip.snippet.publishedAt)}
                    <Calendar className="ml-2 size-4" />
                  </Badge>
                  <Badge variant="outline">
                    {formatLargeNumber(snip.statistics.viewCount)}
                    <Eye className="ml-2 size-4" />
                  </Badge>
                  <Badge variant="outline">
                    {formatLargeNumber(snip.statistics.videoCount)}
                    <VideoIcon className="ml-2 size-4" />
                  </Badge>
                  <Badge variant="outline">
                    {formatLargeNumber(snip.statistics.subscriberCount)}
                    <MessageCircleMore className="ml-2 size-4" />
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">
                  {formatLargeNumber(snip.statistics.subscriberCount)} Subscribers
                </p>
              </div>
            </div>
          </div>
        </div>
        <Collapsible>
          <CollapsibleTrigger className="flex items-center text-base font-medium">
            Description
            <Button variant="ghost" size="sm" className="w-9 p-0" onClick={() => setIsOpen(!isOpen)}>
              <div className="p-1 rounded-full transition-colors group-hover:bg-muted">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </Button>
          </CollapsibleTrigger>

          {snip.snippet.description.length > 0 && (
            <CollapsibleContent className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap text-left">
              {snip.snippet.description}
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    </section>
  );
});

Channel.displayName = 'Channel';
export default Channel;
