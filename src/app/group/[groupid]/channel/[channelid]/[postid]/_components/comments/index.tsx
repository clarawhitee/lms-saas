"use client"

import { useComments, useReply } from "@/hooks/channels";
import { UserComment } from "./user-comment";

type PostCommentsProps = {
  postid: string;
}

export const PostComments = ({ postid }: PostCommentsProps) => {
  const { data, isLoading, error } = useComments(postid); // assuming useComments now returns loading and error states
  const { onReply, onSetReply, onSetActiveComment, activeComment } = useReply();

  const renderComments = () => {
    if (!data?.comments || data.status !== 200) {
      return <p className="text-themeTextGray">No Comments</p>;
    }

    return data.comments.map((comment) => (
      <UserComment
        key={comment.id}
        id={comment.id}
        onReply={() => onSetReply(comment.id)}
        reply={onReply}
        username={`${comment.user.firstname} ${comment.user.lastname}`}
        image={comment.user.image || ""}
        content={comment.content}
        postid={postid}
        replyCount={comment._count.reply}
        commentid={comment.commentId}  // Consider renaming commentId to avoid confusion
        replied={comment.replied}
        activeComment={activeComment}
        onActiveComment={() => onSetActiveComment(comment.id)}
      />
    ));
  };

  return (
    <div className="mt-5">
      {isLoading ? (
        <p className="text-themeTextGray">Loading comments...</p> // Indicate loading state
      ) : error ? (
        <p className="text-themeTextRed">Error loading comments!</p> // Basic error handling
      ) : (
        renderComments()
      )}
    </div>
  );
}
