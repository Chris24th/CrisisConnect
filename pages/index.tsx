import React, { useState, useEffect } from "react";
import Head from "next/head";
import styles from "./styles.module.css";

interface Comment {
  id: number;
  text: string;
  created_at: string;
}

const IndexPage: React.FC = () => {
  const [menuItems] = useState(["Home", "About", "Contact", "Comments"]); // Example menu items
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data: Comment[]) => setComments(data));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newComment }),
    });
    const data = await response.json();
    setComments([
      ...comments,
      { id: data.id, text: newComment, created_at: new Date().toISOString() },
    ]);
    setNewComment("");
  };

  const handleThumb = async (comment_id: number, value: number) => {
    await fetch("/api/thumbs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment_id, value }),
    });
    // You can optionally fetch and update the comment data with the new thumbs count
  };

  return (
    <div>
      <Head>
        <title>Crisis Connect</title>
      </Head>
      <header className="fixed w-full h-16 bg-white flex z-50 ">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center">
            <img src="/logo2.png" alt="Logo" className="h-12 mr-2" />
            <h1 className="text-xl font-bold logo-font">Crisis Connect</h1>
          </div>
          <nav>
            <ul className="flex">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="ml-4 cursor-pointer"
                  onClick={() => scrollToSection(item.toLowerCase())}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      {/* Sections */}
      <section id="home" className="h-screen bg-gray-100">
        <h2>Home</h2>
      </section>
      <section id="about" className="h-screen bg-gray-200">
        <h2>About</h2>
      </section>
      <section id="contact" className="h-screen bg-gray-300">
        <h2>Contact</h2>
      </section>
      <section id="comments" className="h-screen bg-gray-400">
        <h2>Comments</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a new comment"
          />
          <button type="submit">Submit</button>
        </form>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.text}
              <div>
                <button onClick={() => handleThumb(comment.id, 1)}>👍</button>
                <button onClick={() => handleThumb(comment.id, -1)}>👎</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      {/* Footer */}
      <footer className="h-32 bg-gray-500 flex justify-center items-center">
        <p>Footer content goes here</p>
      </footer>
    </div>
  );
};

export default IndexPage;
