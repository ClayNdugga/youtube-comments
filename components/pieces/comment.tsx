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

interface Props {
  comment: CommentThreadResource;
}

const CommentCard = ({ comment }: Props) => {
  const snip = comment?.snippet?.topLevelComment.snippet; //|| { textOriginal: 'Default Text' };

  return (
    <div className="container flex flex-row">
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
                  src={
                    snip.authorProfileImageUrl ||
                    "../../public/plaeholderAvatar.png"
                  }
                  alt={snip.authorDisplayName}
                />
              </Avatar>
              <div className="text-sm mt-2">
                <p className="text-muted-foreground">{snip.publishedAt} </p>
              </div>
            </div>

            {/* Right */}
            <div className="righthalf text-left">
              <p className="font-bold">{snip.authorDisplayName}</p>
              <q className="leading-7 text-foreground/70">{snip.textDisplay}</q>
              <div className="flex flex-row gap-4">
                <p className="text-muted-foreground flex flex-row">
                  <ThumbsUp className="ml-2 size-4" /> {snip.likeCount}
                </p>
                <p className="text-muted-foreground flex flex-row">
                  <Reply className="ml-2 size-4" />{" "}
                  {comment.snippet.totalReplyCount}
                </p>
              </div>

              {/* {fetchedComments?.items.map((commentResource) => (
                    <CommentCard key = {commentResource.id} comment={commentResource} />
                ))} */}

              {comment?.replies?.comments &&
                comment.replies.comments.length > 0 &&
                comment.replies.comments.map((reply) => (
                  <div key={reply.id} className="border-b border-gray-200 py-2">
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
                        <q className="leading-7 text-foreground/70">
                          {reply.snippet.textDisplay}
                        </q>
                        <p className="text-muted-foreground">
                          Likes: {reply.snippet.likeCount}
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
