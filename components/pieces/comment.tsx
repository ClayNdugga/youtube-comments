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

interface Props {
  comment: CommentThreadResource;
}

const CommentCard = ({ comment }: Props) => {
  const snip = comment?.snippet?.topLevelComment?.snippet; //|| { textOriginal: 'Default Text' };

  return (
    
    <div className="container flex flex-row">
    <div className="h-full p-1 w-full">
      <div className="flex h-full flex-col rounded-lg border px-6 py-1">
        <div className="mt-6 flex gap-4 leading-5">

          {/* Left */}
          <div className="lefthalf flex flex-col items-center justify-start w-1/6">
            <Avatar className="size-9 rounded-full ring-1 ring-input">
              <AvatarImage
                src={snip.authorProfileImageUrl}
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
            <p className="text-muted-foreground">  Likes: {snip.likeCount}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  

    // <Card>
    //   <CardHeader>
    //     <CardTitle>{snip?.authorDisplayName}</CardTitle>
    //     <CardDescription>{snip?.publishedAt}</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    //     <p>{snip?.textOriginal}</p>
    //   </CardContent>
    //   <CardFooter>
    //     <p>{snip?.likeCount}</p>
    //   </CardFooter>
    // </Card>
  );
};

export default CommentCard;
