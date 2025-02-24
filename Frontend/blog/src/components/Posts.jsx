import { useState, useEffect } from "react";
import axios from "axios";
import Post from "./Post";
import "./posts.css";
import { useLocation } from "react-router-dom";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res;
        if (category) {
          console.log("The selected category is:", category);
          res = await axios.get(
            `http://localhost:9091/api/v1/post/allPosts?category=${category}`
          );
        } else {
          res = await axios.get("http://localhost:9091/api/v1/post/allPosts");
        }
        console.log("Fetched Posts:", res.data);
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, [category]); // Run whenever category changes

  return (
    <div className="posts">
      {posts.length > 0 ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}
