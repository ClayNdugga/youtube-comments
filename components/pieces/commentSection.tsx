import React from 'react'
import CommentCard from "./comment"
import {YoutubeFetchResponse, CommentThreadResource} from "../../app/entities/youtube"


interface Props {
    fetchedComments: YoutubeFetchResponse<CommentThreadResource>
}

const CommentSection = ({fetchedComments}: Props) => {
  return (
    <>
        {fetchedComments && (
            <div>
                {fetchedComments?.items.map((commentResource) => (
                    <CommentCard key = {commentResource.id} comment={commentResource} />
                ))}
            </div>
        )}
    </>
  )
}

export default CommentSection