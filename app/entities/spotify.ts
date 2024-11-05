export interface SpotifyResponse<T> {
  href: string;
  limit: number;
  next: string | null; // next can be null if there are no more pages
  offset: number;
  previous: string | null; // previous can be null if there's no previous page
  total: number;
  items: T[];
}

export interface Track {
  album: Album;
  artists: Artist[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  href: string;
  id: string;
  external_urls: {
    spotify: string;
  };
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string | null; // preview_url can be null if not available
  track_number: number;
  type: "track"; // fixed type
  uri: string;
}

interface Album {
  album_type: string; // e.g., "compilation"
  artists: Artist[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string; // format: "YYYY-MM"
  release_date_precision: "year" | "month" | "day"; // specify possible values
  total_tracks: number;
  type: "album"; // fixed type
  uri: string;
}
interface Artist {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: "artist"; // fixed type
  uri: string;
}

interface Image {
  url: string;
  height: number;
  width: number;
}
