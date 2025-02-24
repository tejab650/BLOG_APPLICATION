import { Link } from "react-router-dom";
import "./post.css";

export default function Post({ post }) {
  return (
    <div className="post">
      {post.post_img_url && <img className="postImg" src={post.post_img_url} alt="Post" />}

      <div className="postInfo">
        <div className="postCats">
          {post.categories?.map((cat, index) => (
            <span key={index} className="postCat">
              <Link className="link" to={`/posts?cat=${cat}`}>
                {cat}
              </Link>
            </span>
          ))}
        </div>
        <span className="postTitle">
          <Link to={`/post/${post._id}`} className="link">
            {post.title}
          </Link>
        </span>
        <hr />
        <span className="postDate">{new Date(post.createdAt).toDateString()}</span>
      </div>
      <p className="postDesc">{post.desc}</p>
    </div>
  );
}
