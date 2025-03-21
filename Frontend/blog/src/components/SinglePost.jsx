import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./singlepost.css";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Fetch the post
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:9091/api/v1/post/${id}`);
        console.log("Fetched post:", res.data.post);
        setPost(res.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    // Retrieve current logged-in user ID
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed User:", parsedUser);

        if (parsedUser.user && parsedUser.user._id) {
          setCurrentUserId(parsedUser.user._id);
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    fetchPost();
  }, [id]);

  if (!post) {
    return <p>Loading...</p>;
  }

  console.log("Current User ID:", currentUserId);
  console.log("Post Author ID:", post.author_Id);

  // Handle Edit
  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  // Handle Delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:9091/api/v1/post/${id}`,{withCredentials:true});
      alert("Post deleted successfully!");
      navigate("/userposts");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("Failed to delete post. Try again.");
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.post_img_url && (
          <img
            className="singlePostImg"
            src={post.post_img_url}
            alt={post.title}
          />
        )}

        <h1 className="singlePostTitle">
          {post.title}
          {/* Show Edit & Delete only if the logged-in user is the author */}
          {post.author_Id?._id === currentUserId && (
            <div className="singlePostEdit">
              <i className="singlePostIcon far fa-edit" onClick={handleEdit}></i>
              <i className="singlePostIcon far fa-trash-alt" onClick={handleDelete}></i>
            </div>
          )}
        </h1>

        <div className="singlePostInfo">
          {post.author_Id && (
            <span className="singlePostAuthor">
              <img
                className="authorImg"
                src={post.author_Id.img_url || "https://via.placeholder.com/50"}
                alt={post.author_Id.name}
                onClick={() => navigate(`/author/${post.author_Id._id}`)}
                style={{
                  cursor: "pointer",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                }}
              />
              <b>{post.author_Id.name || "Unknown"}</b>
            </span>
          )}
          <span>
            CreatedAt: {post.createdAt ? new Date(post.createdAt).toDateString() : "Unknown Date"}
          </span>
        </div>
        <p className="singlePostDesc">{post.desc}</p>
      </div>
    </div>
  );
}
