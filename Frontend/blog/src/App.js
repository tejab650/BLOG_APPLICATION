import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./components/TopBar";
import Home from "./Pages/Home";
import Single from "./Pages/Single";
import Write from "./Pages/Write";
import Settings from "./Pages/Settings";
import Login from "./Pages/Login";
import Register from "./Pages/Register"; 
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import  { AuthProvider } from "./Utils/AuthContext";
import EditPost from "./components/EditPost";
import AuthorProfile from "./Pages/AuthorProfile";
import YourBlogs from "./Pages/YourBlogs";
import AdminDashboard from "./Pages/Admin";
import PageNotFound from "./Pages/PageNotFound";

function App() {

  
  return (
    <AuthProvider>
      <Router>
        <Topbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:id" element={<Single />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          <Route path="/write" element={<Write />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="author/:id" element={<AuthorProfile />} />
          <Route path="/userposts" element={<YourBlogs />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
