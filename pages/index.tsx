import React, { useState, useEffect } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
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

    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleScroll = () => {
    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const offset = window.scrollY;
      setIsScrolled(offset > 0);
    }
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
            ? "bg-purple-900 bg-opacity-90 backdrop-blur"
            : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center px-4 w-full">
          <div className="flex items-center">
            {/* <img src="/logo2.png" alt="Logo" className="h-12" /> */}
            <button onClick={() => scrollToSection("home")}>
              <h1 className="logo-font text-purple-100">Crisis Connect</h1>
            </button>
          </div>
          <nav className="hidden md:flex">
            <ul className="flex">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="px-5 py-2 ml-4 text-purple-100 rounded-full cursor-pointer hover:bg-purple-500"
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
                      className="w-6 h-6 mt-28 fill-current text-purple-700"
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
              className="mt-16 px-6 pt-2 pb-3 space-y-1 sm:px-6 bg-purple-900 bg-opacity-90 backdrop-blur"
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
      <section id="home" className="hero">
        <div className="hero-content mt-12 text-purple-200">
          <h1 className="font-bold">
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
      </section> */}{" "}
      {/* -----------------------CONTENT SECTION----------------------- */}
      {/* -----------------------CONTENT SECTION----------------------- */}
      {/* -----------------------CONTENT SECTION----------------------- */}
      <section id="content" className="h-auto text-indigo-900 bg-purple-200">
        <div className="p-8">
          <h2 className="h3-style mt-10">
            How Social Media Has Transformed Disaster Response The Changing
            Landscape of Information Sharing
          </h2>
          <p className="mt-4 text-justify">
            In the past, when natural disasters or other calamities struck, the
            public had to rely primarily on traditional media sources like
            television, radio, and print to stay informed. This meant that the
            flow of information was largely one-way, with news outlets serving
            as the gatekeepers and disseminators of critical updates and
            emergency instructions.
          </p>
        </div>
        <div className=" flex flex-col md:flex-row">
          <div className="md:w-1/2 p-8">
            <h3 className="h3-style">The Rise of Social Media</h3>
            <p className="mb-4 text-justify">
              However, the advent of social media has revolutionized the way
              information is shared and accessed during times of crisis.
              Platforms like Facebook, Twitter, and Instagram have become
              powerful tools for individuals, social workers, and government
              agencies to quickly disseminate and gather information in
              real-time.
            </p>
            <h3 className="h3-style">Benefits for Families</h3>
            <p className="mb-4 text-justify">
              For families affected by a disaster, social media has become a
              lifeline. They can use these platforms to connect with loved ones,
              share updates on their safety and well-being, and coordinate
              relief efforts. Social media also allows families to access
              critical information, such as evacuation orders, shelter
              locations, and emergency resources, in a more immediate and
              accessible way.
            </p>
          </div>
          <div className="md:w-1/2 p-8">
            <h3 className="h3-style">Empowering Social Workers</h3>
            <p className="mb-4 text-justify">
              Social workers have also leveraged social media to enhance their
              disaster response efforts. They can use these platforms to
              identify and reach out to vulnerable individuals and communities,
              coordinate relief efforts, and share important information about
              available support services. This has been particularly valuable in
              situations where traditional communication channels may be
              disrupted or overwhelmed.
            </p>
            <h3 className="h3-style">Improved Coordination for Governments</h3>
            <p className="mb-4 text-justify">
              For government agencies, social media has become an invaluable
              tool for disseminating information, coordinating emergency
              response, and engaging with the public. By using these platforms,
              officials can quickly share updates, issue alerts, and respond to
              inquiries, ensuring that the public has access to the most
              up-to-date and reliable information during a crisis.
            </p>
            {/* ... */}
          </div>
        </div>
      </section>
      <section className="h-auto p-8 py-24 bg-indigo-100 text-purple-900">
        <h1 className="h3-style">
          Difference from the past where information is only provided by the
          media (TV, radio and print).
        </h1>
        <p className="mt-6 text-justify">
          The primary difference between the past and the present in terms of
          information dissemination during calamities is the shift from
          traditional media sources like television, radio, and print to social
          media platforms. In the past, the flow of information was largely
          one-way, with news outlets serving as the primary gatekeepers and
          disseminators of critical updates and emergency instructions. In
          contrast, social media has revolutionized the way information is
          shared and accessed during disasters. It allows for real-time
          communication, information sharing, and collaboration among
          stakeholders, including authorities, disaster management
          professionals, and at-risk communities. This shift has significantly
          enhanced disaster preparedness, response, and risk reduction efforts
          by enabling faster and more effective communication of critical
          information
        </p>
      </section>
      {/* -----------------------COMMENT SECTION----------------------- */}
      {/* -----------------------COMMENT SECTION----------------------- */}
      {/* -----------------------COMMENT SECTION----------------------- */}
      <section id="comments" className="bg-indigo-200 py-16">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-indigo-900">Comments</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <form
              onSubmit={handleSubmit}
              className="mb-4 flex flex-col sm:flex-row items-center"
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a new comment"
                className="flex-grow my-2 px-4 py-2 mr-2 text-indigo-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-700 hover:bg-indigo-900 text-indigo-100 font-bold py-2 px-4 rounded-lg h-10"
              >
                Submit
              </button>
            </form>
            <ul>
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="bg-indigo-100 rounded-lg p-4 mb-4 flex justify-between items-center"
                >
                  <p className="text-indigo-900">{comment.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* -----------------------FOOTER SECTION----------------------- */}
      {/* -----------------------FOOTER SECTION----------------------- */}
      {/* -----------------------FOOTER SECTION----------------------- */}
      <footer id="contact" className="bg-purple-900 text-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: ryan@crisisconnect.com</p>
            <p>Phone: +6398 7654 3210</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-400 transition duration-300"
              >
                <FaYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm text-purple-400">
              &copy; {new Date().getFullYear()} Crisis Connect. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
