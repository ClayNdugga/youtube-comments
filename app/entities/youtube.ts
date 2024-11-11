export interface YoutubeFetchResponse<T> {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
}

////////////////////////////////////////// Search Results //////////////////////////////////////////

export interface SearchResult {
  kind: string;
  etag: string;
  id: {
    kind: string;
    videoId?: string; // Optional as it might not be present in every search result
    channelId?: string; // Optional
    playlistId?: string; // Optional
  };
  snippet: {
    publishedAt: string; // datetime
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<
      string,
      {
        url: string;
        width: number; // unsigned integer
        height: number; // unsigned integer
      }
    >;
    channelTitle: string;
    liveBroadcastContent: string;
  };
}

////////////////////////////////////////// Comment Results //////////////////////////////////////////

export interface CommentThreadResource {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    channelId: string;
    videoId: string;
    topLevelComment: CommentResource; // Reference to CommentResource
    canReply: boolean;
    totalReplyCount: number; // unsigned integer
    isPublic: boolean;
  };
  replies?: {
    comments: CommentResource[]; // Array of CommentResource
  };
}

export interface CommentResource {
  kind: string;
  etag: string;
  id: string;
  snippet: {
    authorDisplayName: string;
    authorProfileImageUrl: string;
    authorChannelUrl: string;
    authorChannelId: {
      value: string;
    };
    channelId: string;
    textDisplay: string;
    textOriginal: string;
    parentId: string;
    canRate: boolean;
    viewerRating: string;
    likeCount: number; // unsigned integer
    moderationStatus: string;
    publishedAt: string; // datetime
    updatedAt: string; // datetime
  };
}

////////////////////////////////////////// Video Results //////////////////////////////////////////

export interface YouTubeVideoResource {
  kind: "youtube#video"; // Literal type for kind
  etag: string;
  id: string; // Video ID

  snippet: {
    publishedAt: string; // DateTime is usually a string in ISO format
    channelId: string;
    title: string;
    description: string;
    thumbnails: Record<
      string,
      {
        url: string;
        width: number;
        height: number;
      }
    >;
    channelTitle: string;
    categoryId: string;
    liveBroadcastContent: string; // Usually "none", "live", or "upcoming"
    defaultLanguage?: string; // Optional as it might not always exist
    defaultAudioLanguage?: string; // Optional as it might not always exist
  };

  contentDetails: {
    duration: string; // ISO 8601 duration string
    dimension: string; // For example, "2d" or "3d"
  };

  statistics: {
    viewCount: string; // These are often strings in YouTube API to prevent overflow issues
    likeCount: string;
    commentCount: string;
  };
}
////////////////////////////////////////// Channel Results //////////////////////////////////////////


export interface YouTubeChannelResource {
  kind: "youtube#channel";
  etag: string;
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string; // You can convert this to Date in processing if needed
    thumbnails: Record<
      string,
      {
        url: string;
        width: number;
        height: number;
      }
    >;
    defaultLanguage?: string;
    localized: {
      title: string;
      description: string;
    };
    country?: string;
  };
  contentDetails?: {
    relatedPlaylists: {
      likes?: string;
      favorites?: string;
      uploads: string;
    };
  };
  statistics?: {
    viewCount: number;
    subscriberCount: number;
    hiddenSubscriberCount: boolean;
    videoCount: number;
  };
  brandingSettings: {
    image?: {
      bannerExternalUrl: string
    }
  }
}
