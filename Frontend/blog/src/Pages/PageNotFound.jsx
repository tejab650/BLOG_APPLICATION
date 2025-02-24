import { Link } from "react-router-dom";
import './pagenotfound.css';

export default function PageNotFound() {
  return (
    <div className="notfound-container">
    <h1 className="notfound-heading">404</h1>
    <p className="notfound-subtext">Oops! Page Not Found</p>
    <p className="notfound-description">
      The page you’re looking for doesn’t exist or has been moved.
    </p>
    <Link to="/" className="notfound-button">
      Back to Home
    </Link>
  </div>
  );
}
