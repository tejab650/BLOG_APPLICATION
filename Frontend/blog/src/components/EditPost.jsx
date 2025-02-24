import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./editpost.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: "", desc: "", post_img_url: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
      return;
    }
  }, [navigate]);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:9091/api/v1/post/${id}`);
        setPost(res.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      await axios.put(`http://localhost:9091/api/v1/post/${id}`, post);
      navigate(`/post/${id}`); // Redirect to the updated post
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="editPost">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="desc"
            value={post.desc}
            onChange={handleChange}
            required
          />
        </div>

        <div className="buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Post"}
          </button>
          <button type="button" onClick={() => navigate(`/post/${id}`)} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
