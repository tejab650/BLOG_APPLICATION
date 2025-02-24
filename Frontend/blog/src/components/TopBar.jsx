import { Link, useNavigate } from "react-router-dom";
import { useContext, useState} from "react";
import "./topbar.css";
import AuthContext from "../Utils/AuthContext";

export default function Topbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const userRole = user?.user?.roles?.[0];
  const img_url = user?.user?.img_url || "default-profile.jpg";

  const categories = [
    "Education",
    "Lifestyle",
    "Travel",
    "Technology",
    "Health",
  ];

  const handleCategorySelect = (selectedCategory) => {
    console.log("Selected Category:", selectedCategory);
    navigate(`/posts?category=${selectedCategory}`);
    window.location.reload();
  };

  return (
    <div className="top">
      <div className="topLeft">
        <i className="topIcon fab fa-facebook-square"></i>
        <i className="topIcon fab fa-instagram-square"></i>
        <i className="topIcon fab fa-pinterest-square"></i>
        <i className="topIcon fab fa-twitter-square"></i>
      </div>

      <div className="topCenter">
        <ul className="topList">
          <li className="topListItem">
            <Link
              className="link"
              to="/"
              onClick={() => navigate("/", { replace: true })}
            >
              HOME
            </Link>
          </li>
          {!user && (
            <li className="topListItem">
              <Link className="link" to="/about">
                ABOUT
              </Link>
            </li>
          )}
          {userRole !== "ADMIN" && (
            <li className="topListItem">
              <Link className="link" to="/contact">CONTACT</Link>
            </li>
          )}
          <li className="topListItem">
            <Link className="link" to="/write">
              UPLOAD
            </Link>
          </li>
          {user && (
            <li className="topListItem">
              <Link className="link" to="/userposts">
                YOUR BLOGS
              </Link>
            </li>
          )}
          {userRole === "ADMIN" && (
            <li className="topListItem">
              <Link className="link" to="/admin">
                ADMIN DASHBOARD
              </Link>
            </li>
          )}
          {user && (
            <li
              className="topListItem"
              onClick={logout}
              style={{ cursor: "pointer" }}
            >
              LOGOUT
            </li>
          )}
        </ul>
      </div>

      <div className="topRight">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {showDropdown && (
            <ul className="search-dropdown">
              {categories
                .filter((category) =>
                  category.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((category) => (
                  <li
                    key={category}
                    className="dropdown-item"
                    onClick={() => handleCategorySelect(category)}
                    style={{ cursor: "pointer" }}
                  >
                    {category}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {user ? (
          <Link className="link" to="/settings">
            <img className="topImg" src={img_url} alt="User Profile" />
          </Link>
        ) : (
          <ul className="topList">
            <li className="topListItem">
              <Link className="link" to="/login">
                LOGIN
              </Link>
            </li>
            <li className="topListItem">
              <Link className="link" to="/register">
                REGISTER
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
