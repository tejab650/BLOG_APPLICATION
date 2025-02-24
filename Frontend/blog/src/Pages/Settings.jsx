import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import AuthContext from "../Utils/AuthContext";
import "./settings.css";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState("default-profile.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNameUpdated, setIsNameUpdated] = useState(false);
  const [isImageUpdated, setIsImageUpdated] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setName(user?.user?.name || "");
      setEmail(user?.user?.email || "");
      setProfilePic(user?.user?.img_url || "default-profile.jpg");
    }
  }, [user, navigate]);

  function triggerFileUpload() {
    document.getElementById("imageUpload").click();
  }

  function previewImage(event) {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePic(e.target.result);
        setIsImageUpdated(true);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);
    setIsNameUpdated(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isImageUpdated && !isNameUpdated) {
      alert("No changes detected!");
      return;
    }

    setIsUpdating(true);
    const formData = new FormData();
    formData.append("email", email);
    if (isNameUpdated && name.trim() !== "") {
      formData.append("name", name);
    } else {
      formData.append("name", user?.user?.name || "");
    }
    if (isImageUpdated && selectedFile) formData.append("img", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:9091/api/v1/auth/update-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Updated User Data:", response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      alert("There was an error updating your profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsTitleUpdate">Update Your Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img src={profilePic} alt="User Profile" />
            <label htmlFor="fileInput">
              <i
                className="settingsPPIcon far fa-user-circle"
                onClick={triggerFileUpload}
              ></i>
            </label>
            <input
              id="imageUpload"
              type="file"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={previewImage}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
            disabled={isUpdating}
          />
          <label>Email</label>
          <input type="email" name="email" value={email} disabled />
          <button className="settingsSubmitButton" type="submit" disabled={isUpdating}>
            {isUpdating ? <span className="loader"></span> : "Update"}
          </button>
        </form>
      </div>
      {/* <Sidebar /> */}
    </div>
  );
}
