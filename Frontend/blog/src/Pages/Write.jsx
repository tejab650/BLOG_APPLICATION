import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../Utils/AuthContext";
import "./write.css";

export default function Write() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!file){
      alert("Please select the file for the post");
      return;
    }
    if (!title) {
      alert("Title cannot be empty!");
      return;
    }
    if(!desc){
      alert("Descriptioncannot be empty!");
      return;
    }
    if(!category){
      alert("Category cannot be empty!");
      return;
    }

    setIsPublishing(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("category", category);
    if (file) {
      formData.append("image", file);
    }
    console.log(formData);
    try {
      const res = await axios.post(
        "http://localhost:9091/api/v1/post/addPost",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (res.status === 201) {
        navigate("/userposts");
      }
    } catch (err) {
      console.error("Error uploading blog:", err);
      alert(
        "Failed to upload blog. Please select image types 'png', 'jpg', 'jpeg' only"
      );
    } finally {
      setIsPublishing(false);
    }
  };

  return user ? (
    <div className="write">
      {file && (
        <img
          className="writeImg"
          src={URL.createObjectURL(file)}
          alt="Blog preview"
        />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            className="writeInput"
            placeholder="Title"
            type="text"
            autoFocus={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPublishing}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            className="writeInput writeText"
            placeholder="Tell your story..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={isPublishing}
          />
        </div>
        <div className="writeFormGroup">
          <select
            className="writeInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isPublishing}
          >
            <option value="">Select Category</option>
            <option value="Technology">Technology</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Education">Education</option>
          </select>
        </div>
        <button className="writeSubmit" type="submit" disabled={isPublishing}>
          {isPublishing ? <span className="loader"></span> : "Publish"}
        </button>
      </form>
    </div>
  ) : null;
}
