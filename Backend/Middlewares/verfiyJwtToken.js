import jwt from "jsonwebtoken";

export const authenticateToken = async (req, res, next) => {
  //console.log("Inside the auth middleware function");
  //console.log(req.signedCookies);
  const token = req.signedCookies["token"];
  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  }
  jwt.verify(token, process.env.SECRET_STR, (err, data) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired." });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid Token." });
      } else {
        return res.status(401).json({ message: err.message });
      }
    }
    req.user = data;
    next();
  });
};
