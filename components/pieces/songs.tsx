import React, { useState } from "react";
import SongGrid from "./songGrid";
import useSpotifyTracks from "@/app/hooks/useSpotifyTracks";

const Songs = () => {

    const [q, setq] = useState("");
    const { data, isLoading, error } = useSpotifyTracks(q, "4");

  
  return (
    <>  

        
        <SongGrid />

    </>
  );
};

export default Songs;
