import React, { useState, useEffect } from "react";
import Head from "next/head";

interface Comment {
  id: number;
  text: string;
  created_at: string;
}

const IndexPage: React.FC = () => {
  const [menuItems] = useState(["Home", "Content", "Comments", "Contact"]); // Example menu items
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data: Comment[]) => setComments(data));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const offset = window.scrollY;
    setIsScrolled(offset > 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
        <title className="">Crisis Connect</title>
      </Head>
      <header
        className={`fixed w-full h-16 flex z-50 transition-colors duration-300 ${
          isScrolled
            ? "bg-purple-900 bg-opacity-70 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-4 w-full">
          <div className="flex items-center">
            {/* <img src="/logo2.png" alt="Logo" className="h-12" /> */}
            <h1 className="text-xl font-bold logo-font text-purple-300">
              Crisis Connect
            </h1>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="px-5 py-2 ml-4 text-purple-200 rounded-full cursor-pointer hover:bg-purple-500"
                  onClick={() => scrollToSection(item.toLowerCase())}
                >
                  {item}
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:hidden">
            <button
              className="flex items-center rounded text-gray-500 hover:text-gray-800"
              onClick={toggleMenu}
            >
              <div className="md:hidden">
                <button
                  className="flex items-center rounded text-gray-500 hover:text-gray-800"
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? (
                    <svg
                      className="w-6 h-6 mt-28 fill-current text-purple-300"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6 fill-current text-purple-300"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden rounded-md">
            <div
              className="mt-16 px-6 pt-2 pb-3 space-y-1 sm:px-6 bg-purple-900 bg-opacity-70 backdrop-blur"
              onClick={toggleMenu}
            >
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 rounded-2xl text-purple-200 text-base font-medium text-gray-700 hover:bg-purple-400"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
      {/* Sections */}
      <section className="hero">
        {/* <div className="hero-image">
          <img src="/hero-bg.png" alt="Hero Image" />
        </div> */}
        <div className="hero-content mt-12 text-purple-200">
          <h1>
            Social Media <br /> and Calamities
          </h1>
          <ul>
            <li>How social media has helped families,</li>
            <li>social workers, and the government in </li>
            <li>discerning information during calamities.</li>
            <button
              onClick={() => scrollToSection("content")}
              className="mt-8 mb-10 bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              Learn More
            </button>
          </ul>
        </div>
      </section>

      {/* <section id="home" className="h-screen bg-gray-100">
        <img src="/hero-bg.png" alt="Logo" className="w-full" />
      </section> */}
      <section id="content" className="h-screen bg-gray-200">
        <h2>Contents here</h2>
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
              {/* <div>
                <button onClick={() => handleThumb(comment.id, 1)}>👍</button>
              </div> */}
            </li>
          ))}
        </ul>
      </section>
      {/* Footer */}
      <footer
        id="contact"
        className="h-32 bg-purple-700 flex justify-center items-center"
      >
        <p>Footer content goes here</p>
      </footer>
    </div>
  );
};

export default IndexPage;
