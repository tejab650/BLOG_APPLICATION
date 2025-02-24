import React, { useContext, useEffect, useState } from "react";
import "./contact.css";
import AuthContext from "../Utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(""); // Tracks submission status
  const [timeLeft, setTimeLeft] = useState(localStorage.getItem("contactFormTimeLeft") || null); // Tracks remaining time for re-enabling submit button
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.user.roles.includes("ADMIN")) {
      navigate("*");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft <= 1) {
            clearInterval(timerInterval);
            localStorage.removeItem("contactFormTimeLeft");
            return null;
          }
          const newTimeLeft = prevTimeLeft - 1;
          localStorage.setItem("contactFormTimeLeft", newTimeLeft);
          return newTimeLeft;
        });
      }, 1000);
      return () => clearInterval(timerInterval);
    }
  }, [timeLeft]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    if (user.user.name !== formData.name) {
      alert("Please enter the same name as the one you are currently logged in with.");
      return;
    }
    if (user.user.email !== formData.email) {
      alert("Please enter the same email as the one you are currently logged in with.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9091/api/v1/comment/addContact",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);

      setSubmissionStatus("success");
      setTimeLeft(5 * 60 * 60); // 5 hours in seconds
      localStorage.setItem("contactFormTimeLeft", 5 * 60 * 60);

      // Reset form data after submission
      setFormData({ name: "", email: "", message: "" });

      // Remove the success message after 5 seconds
      setTimeout(() => {
        setSubmissionStatus("");
      }, 5000);
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error submitting the form:", error);

      // Remove the error message after 5 seconds
      setTimeout(() => {
        setSubmissionStatus("");
      }, 5000);
    }
  };

  // Convert remaining time to HH:MM:SS format
  const formatTime = (seconds) => {
    if (seconds === null) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contactForm">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={timeLeft > 0}>
          {timeLeft > 0
            ? `Submit (Time Remaining: ${formatTime(timeLeft)})`
            : "Send Message"}
        </button>
      </form>
      {submissionStatus === "success" && (
        <div className="submissionStatus success">Form submitted successfully!</div>
      )}
      {submissionStatus === "error" && (
        <div className="submissionStatus error">There was an error submitting the form. Please try again.</div>
      )}
    </div>
  );
}
