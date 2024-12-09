import * as React from "react";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Track } from "@/app/entities/spotify";
import { useState } from "react";

interface Props {
  dataSong: Track[];
  page: number;
}

export function SongCarousel({ dataSong, page }: Props) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleMouseEnter = (previewUrl: string | null) => {
    if (previewUrl) {
      const audio = new Audio(previewUrl);
      audio.play();
      setAudio(audio);
    }
  };

  const handleMouseLeave = () => {
    if (audio) {
      audio.pause();
      setAudio(null);
    }
  };

  return (
    <div className="flex justify-center items-center">
      {/* <Carousel
        opts={{
          align: "start",
          loop: true,
          slidesToScroll: 3,


        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {dataSong.map((track, index) => (
            <CarouselItem key={index} className="basis-1/3">
              <a
                key={index}
                href={track.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => handleMouseEnter(track.preview_url)}
                onMouseLeave={handleMouseLeave}
                className="relative aspect-square overflow-hidden rounded-xl block"
              >
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl">
                  <img
                    src={track.album.images[0].url}
                    alt={`${track.name} album cover`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-sm font-semibold text-white">{track.name}</h3>
                    <p className="text-xs text-white/80">{track.artists[0].name}</p>
                  </div>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
    </div>
  );
}
