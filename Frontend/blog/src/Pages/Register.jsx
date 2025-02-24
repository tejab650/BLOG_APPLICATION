import "./register.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Utils/AuthContext";

export default function Register() {
  const {login} = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const isAuthenticated = localStorage.getItem("user");
    if(isAuthenticated){
      navigate("/");
    }

  },[navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setIsLoading(true);

    const trimmedEmail = email.trim();
    const data = { name, email: trimmedEmail, password };

    try {
      const response = await axios.post(
        "http://localhost:9091/api/v1/auth/signup",
        data,
        { withCredentials: true }
      );

      if (response.status === 201) {
        // localStorage.setItem('user',true);
        console.log(response.data.user);
        console.log(response.data.token);
        login(response.data.user,response.data.token);
        setIsLoading(false);
        navigate("/");
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setError(error.response.data.error || error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const loginHandle = () => {
    navigate("/login");
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSignup}>
        <label>Username</label>
        <input
          className="registerInput"
          type="text"
          placeholder="Enter your username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isLoading}
        />
        <label>Email</label>
        <input
          className="registerInput"
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <label>Password</label>
        <input
          className="registerInput"
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button className="registerButton" type="submit" disabled={isLoading}>
          {isLoading ? <div className="spinner"></div> : "Register"}
        </button>
      </form>

      {error && <p className="errorMessage" style={{ color: 'red' }}>{error}</p>}

      <button className="registerLoginButton" onClick={loginHandle} disabled={isLoading}>
        Login
      </button>
    </div>
  );
}
