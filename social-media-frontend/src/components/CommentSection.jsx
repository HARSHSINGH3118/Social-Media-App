import { useEffect, useState } from "react";
import api from "@/services/api";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await api.post(`/api/posts/${postId}/comments`, {
        content: newComment.trim(),
      });
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowComments((prev) => !prev)}
        className="text-blue-600 font-medium"
      >
        {showComments ? "Hide Comments" : "View Comments"}
      </button>

      {showComments && (
        <div className="mt-2">
          {/* Comment Input + Post Button */}
          <form
            onSubmit={handleCommentSubmit}
            className="mb-3 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border px-3 py-2 text-sm rounded-md placeholder-gray-600 text-black"
            />
            <button
              type="submit"
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <span className="font-semibold text-neutral-400">
                    @{comment.user?.username || "Unknown"}
                  </span>
                  <span className="text-gray-600">: {comment.content}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
