import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CommentThreadResource } from "@/app/entities/youtube";
import { AvatarImage, Avatar } from "../ui/avatar";

import { ThumbsUp, Reply } from "lucide-react";
import { formatLargeNumber, formatTimestamp } from "@/app/services/helperFunctions";

interface Props {
  comment: CommentThreadResource;
}

const CommentCard = ({ comment }: Props) => {
  const snip = comment?.snippet?.topLevelComment.snippet; //|| { textOriginal: 'Default Text' };

  return (
    <div className="container flex flex-row bg-inherit">
      <div className="h-full p-1 w-full">
        <div className="flex h-full flex-col rounded-lg border px-6 py-1">
          <div className="mt-6 flex gap-4 leading-5">
            {/* Left */}
            <div
              className="lefthalf flex flex-col items-center justify-start"
              style={{ minWidth: "80px", maxWidth: "80px" }}
            >
              <Avatar className="size-9 rounded-full ring-1 ring-input">
                <AvatarImage
                  // src={snip.authorProfileImageUrl || "/images/placeholderAvatar.png"}
                  src={snip.authorProfileImageUrl && snip.authorProfileImageUrl !== "" ? snip.authorProfileImageUrl : "/images/placeholderAvatar.png"}
                  alt={snip.authorDisplayName}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement; // Type assertion
                    target.src = "/images/placeholderAvatar.png"; // Set the fallback image
                  }}
                />
              </Avatar>

              <div className="text-sm mt-2">
                <p className="text-muted-foreground">{formatTimestamp(snip.publishedAt)} </p>
              </div>
            </div>

            {/* Right */}
            <div className="righthalf text-left">
              <p className="font-bold">{snip.authorDisplayName}</p>
              <p className="leading-7 text-foreground/70 whitespace-pre-wrap">{snip.textDisplay}</p>
              <div className="flex flex-row gap-4 text-base items-center">
                <p className="flex items-center gap-1 py-1">
                  <ThumbsUp className="w-4 h-4" /> {formatLargeNumber(snip.likeCount)}
                </p>
                <p className="flex items-center gap-2">
                  <Reply className="w-4 h-4" /> {comment.snippet.totalReplyCount}
                </p>
              </div>

              {/* {fetchedComments?.items.map((commentResource) => (
                    <CommentCard key = {commentResource.id} comment={commentResource} />
                ))} */}

              {comment?.replies?.comments &&
                comment.replies.comments.length > 0 &&
                comment.replies.comments.map((reply) => (
                  <div key={reply.id} className="border-b border-gray-200 pt-3 pb-1 w-full">
                  {/* <div key={reply.id} className="border-b border-gray-200 py-3"> */}
                    <div className="flex gap-4 leading-5">
                      <Avatar className="size-7 rounded-full ring-1 ring-input">
                        <AvatarImage
                          src={
                            reply.snippet.authorProfileImageUrl ||
                            "../../public/plaeholderAvatar.png"
                          }
                          alt={reply.snippet.authorDisplayName}
                        />
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-bold">
                          {reply.snippet.authorDisplayName}
                        </p>
                        <p className="leading-7 text-foreground/70 pb-1">
                          {reply.snippet.textDisplay}
                        </p>
                        <p className="text-xs">
                          Likes: {formatLargeNumber(reply.snippet.likeCount)}
                        </p>
                      </div>
                    </div>
                      

                  </div>
                  
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
