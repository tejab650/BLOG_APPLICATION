import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "./admindashboard.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostCount, setSelectedPostCount] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
      return;
    }
    const isAuthenticated = localStorage.getItem("user");
    const parsedData = JSON.parse(isAuthenticated);
    console.log("Inside the admin page : ", parsedData.user.roles[0]);
    if (isAuthenticated) {
      if (parsedData.user.roles.includes("ADMIN")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Pagination states
  const [userPage, setUserPage] = useState(0);
  const [postPage, setPostPage] = useState(0);
  const [contactPage, setContactPage] = useState(0);
  const usersPerPage = 5;
  const postsPerPage = 5;
  const contactsPerPage = 5;

  useEffect(() => {
    fetchUsers();
    fetchPosts();
    fectchContacts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9091/api/v1/admin/users",
        { withCredentials: true }
      );
      setUsers(response.data.Users);
    } catch (error) {
      console.error("Error fetching users", error.message);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9091/api/v1/admin/posts",
        { withCredentials: true }
      );
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const fectchContacts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9091/api/v1/comment/allContacts",
        { withCredentials: true }
      );
      setContacts(response.data.contacts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:9091/api/v1/admin/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts(posts.filter((post) => post._id !== postId));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:9091/api/v1/admin/user/${userId}`,
        { withCredentials: true }
      );
      setSelectedUser(response.data.user);
      setUserPosts(response.data.posts || []);
      setSelectedPostCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching user details", error);
      setUserPosts([]);
    }
  };
  const fetchPostDetails = async (postId) => {
    const id =postId;
    try {
      const response = await axios.get(
        `http://localhost:9091/api/v1/post/${id}`,
        { withCredentials: true }
      );
      setSelectedPost(response.data.post);
    } catch (error) {
      console.error("Error fetching post details", error);
    }
  };

  // Handle pagination
  const handleUserPageClick = ({ selected }) => setUserPage(selected);
  const handlePostPageClick = ({ selected }) => setPostPage(selected);
  const handleContactPageClick = ({ selected }) => setContactPage(selected);

  // Paginated data
  const displayedUsers = users.slice(
    userPage * usersPerPage,
    (userPage + 1) * usersPerPage
  );
  const displayedPosts = posts.slice(
    postPage * postsPerPage,
    (postPage + 1) * postsPerPage
  );
  const displayedContacts = contacts.slice(
    contactPage * contactsPerPage,
    (contactPage + 1) * contactsPerPage
  );

  // Disable/enable previous and next buttons
  const isUserPreviousDisabled = userPage === 0;
  const isUserNextDisabled =
    userPage >= Math.ceil(users.length / usersPerPage) - 1;
  const isPostPreviousDisabled = postPage === 0;
  const isPostNextDisabled =
    postPage >= Math.ceil(posts.length / postsPerPage) - 1;
  const isContactPreviousDisabled = contactPage === 0;
  const isContactNextDisabled =
    contactPage >= Math.ceil(contacts.length / contactsPerPage) - 1;

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {selectedUser ? (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={() => setSelectedUser(null)}
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
          <h2>{selectedUser.name}'s Profile</h2>
          <img
            src={selectedUser.img_url}
            alt="User"
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          />
          <p>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <p>
            <strong>Total Posts:</strong> {selectedPostCount}
          </p>
          <h3>User's Posts</h3>
          {userPosts.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  style={{
                    backgroundColor: "#fff",
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={post.post_img_url}
                    alt="Post"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                  />
                  <h4>{post.title}</h4>
                  <p>
                    {expandedPost === post._id
                      ? post.content
                      : `${post.desc.substring(0, 100)}...`}
                  </p>
                  <button
                    onClick={() =>
                      setExpandedPost(
                        expandedPost === post._id ? null : post._id
                      )
                    }
                    style={{
                      backgroundColor: "#007BFF",
                      color: "white",
                      border: "none",
                      padding: "8px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    {expandedPost === post._id ? "Show Less" : "Read More"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No posts available for this user.</p>
          )}
        </div>
      ) : selectedPost ? (
  <div className="post-details-container">
    <button onClick={() => setSelectedPost(null)} className="post-back-button">
      Back to Dashboard
    </button>
    <h2 className="post-title">{selectedPost.title}</h2>
    <img src={selectedPost.post_img_url} alt="Post" className="post-img" />
    <p className="post-meta">
      <strong>Author:</strong> {selectedPost.author_Id?.name || "Unknown"}
    </p>
    <p className="post-content">{selectedPost.desc}</p>
  </div>
) : (
        <div>
          <h1>Admin Dashboard</h1>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>Users & Post Counts</h2>
              <table border="1" width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Posts</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => fetchUserDetails(user._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <img
                          src={user.image}
                          alt="Profile"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.postsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(users.length / usersPerPage)}
                onPageChange={handleUserPageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={isUserPreviousDisabled ? "disabled" : ""}
                nextClassName={isUserNextDisabled ? "disabled" : ""}
                disabledClassName={"disabled"}
              />
            </div>

            {/* Posts Table */}
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>All Blog Posts</h2>
              <table border="1" width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPosts.map((post) => (
                    <tr key={post._id}>
                      <td
                        style={{
                          cursor: "pointer",
                          color: "black",
                          //textDecoration: "underline",
                        }}
                        onClick={() => fetchPostDetails(post._id)}
                      >
                        {post.title}
                      </td>
                      <td>{post.author_Id?.name || "Unknown"}</td>
                      <td>
                        <button
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => deletePost(post._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(posts.length / postsPerPage)}
                onPageChange={handlePostPageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={isPostPreviousDisabled ? "disabled" : ""}
                nextClassName={isPostNextDisabled ? "disabled" : ""}
                disabledClassName={"disabled"}
              />
            </div>

            {/* Contact Table */}
            <div
              style={{
                flex: "1",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>CONTACT MESSAGE'S</h2>
              <table border="1" width="100%" cellPadding="10">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>EMAIL</th>
                    <th>MESSAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedContacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>
                        <p>{contact.message}</p>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                pageCount={Math.ceil(contacts.length / contactsPerPage)}
                onPageChange={handleContactPageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                previousClassName={isContactPreviousDisabled ? "disabled" : ""}
                nextClassName={isContactNextDisabled ? "disabled" : ""}
                disabledClassName={"disabled"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
