// components/Comments.tsx
import { useEffect, useState } from "react";

interface Comment {
  id: number;
  text: string;
  thumbs_up: number;
  thumbs_down: number;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, []);

  return (
    <div>
      <h2>Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <div>
              <span>Thumbs Up: {comment.thumbs_up}</span>
              <span>Thumbs Down: {comment.thumbs_down}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
