import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarItem">
        <span className="sidebarTitle">ABOUT ME</span>
        <img
          src="https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt="About me"
        />
        <p>
          Passionate about sharing knowledge and insights on various topics.
          Stay updated with the latest in technology, health, education,
          travel, and lifestyle.
        </p>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">CATEGORIES</span>
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link className="link" to="/posts?category=Technology">
              Technology
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="/posts?category=Health">
              Health
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="/posts?category=Education">
              Education
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="/posts?category=Travel">
              Travel
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link className="link" to="/posts?category=Lifestyle">
              Lifestyle
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">FOLLOW US</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fab fa-facebook-square"></i>
          <i className="sidebarIcon fab fa-instagram-square"></i>
          <i className="sidebarIcon fab fa-pinterest-square"></i>
          <i className="sidebarIcon fab fa-twitter-square"></i>
        </div>
      </div>
    </div>
  );
}
