import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Utils/AuthContext";
import './yourblogs.css';

export default function YourBlogs() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:9091/api/v1/post/Userposts/${user.user._id}`);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, navigate]);

  return (
    <div className="yourBlogsContainer">
      <h2>Your Blogs</h2>
      {loading ? (
        <div className="loadingSpinner">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="noPosts">
          <p>You haven't written any posts yet.</p>
          <button onClick={() => navigate("/write")}>Create Your First Post</button>
        </div>
      ) : (
        <div className="blogGrid">
          {posts.map((post) => (
            <div key={post._id} className="post">
              {post.post_img_url && (
                <img src={post.post_img_url} alt={post.title} className="postImage" />
              )}
              <div className="postContent">
                <h3>{post.title}</h3>
                <p>{post.desc.substring(0, 100)}...</p>
                <div className="postFooter">
                  <a href={`/post/${post._id}`} className="readMore">Read More</a>
                  <small>{new Date(post.createdAt).toLocaleString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}