import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./authorProfile.css";

export default function AuthorProfile() {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {

        const authorRes = await axios.get(`http://localhost:9091/api/v1/auth/${id}`);
        console.log("Author Data:", authorRes.data.author);
        setAuthor(authorRes.data.author || null);

        const response = await axios.get(`http://localhost:9091/api/v1/post/Userposts/${id}`);
        console.log("Author's Posts:", response.data.posts);
        setPosts(response.data.posts || []);
      } catch (err) {
        console.error("Error fetching author data:", err);
        setAuthor(null);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  if (loading) return <p className="loading">Loading author details...</p>;

  return (
    <div className="authorProfile">
      <div className="authorInfo">
        <img src={author?.img_url} alt={author?.name} className="profileImage" />
        <div>
          <h2>{author?.name}</h2>
          <p className="email">{author?.email}</p>
        </div>
      </div>

      <h3>Posts by {author?.name}</h3>
      <div className="postsContainer">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="postCard">
              <img src={post.post_img_url} alt={post.title} className="postImage" />
              <div className="postContent">
                <h4>{post.title}</h4>
                <p>{post.desc.substring(0, 100)}...</p>
                <a href={`/post/${post._id}`} className="readMore">Read More</a>
              </div>
            </div>
          ))
        ) : (
          <p className="noPosts">No posts available.</p>
        )}
      </div>
    </div>
  );
}
