import "./login.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../Utils/AuthContext";

export default function Login() {
  const {login} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading,setIsLoading] = useState(false);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    const trimmedEmail = email.trim(); 
    setIsLoading(true);

    console.log("Email:", trimmedEmail);
    console.log("Password:", password);

    const data = { email: trimmedEmail, password };

    try {
      const response = await axios.post(
        "http://localhost:9091/api/v1/auth/login",
        data,
        { withCredentials: true }
      );

      console.log(`Status code: ${response.status}`);
      console.log(`Response message: ${response.data.message}`);

      if (response.status === 200) {
        // localStorage.setItem("isAuthenticated", true);
        console.log(response.data.user);
        console.log(response.data.token);
        login(response.data.user,response.data.token);
        setIsLoading(false);
        navigate("/"); 
      }

      setEmail("");
      setPassword("");
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        console.log(`Error status code: ${error.response.status}`);
        console.log(`Response error: ${error.response.data.error || error.response.data.message}`);
        setError(error.response.data.error || error.response.data.message);
      } else {
        console.log(`Error: ${error.message}`);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const registerHandle = () => {
    navigate("/register");
  };

  return (
    <div className="login">
      <span className="loginTitle">Login</span>
      <form className="loginForm" onSubmit={handleLogin}>
        <label>Email</label>
        <input
          className="loginInput"
          type="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <label>Password</label>
        <input
          className="loginInput"
          type="password"
          placeholder="Enter your password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        <button className="loginButton" type="submit" disabled={isLoading}>{isLoading ? "Loggin in..." : "Login" }</button>
      </form>
      
      {error && <p className="errorMessage" style={{ color: 'red' }}>{error}</p>}

      
      <button className="loginRegisterButton" onClick={registerHandle} disabled={isLoading}>
        Register
      </button>
    </div>
  );
}
