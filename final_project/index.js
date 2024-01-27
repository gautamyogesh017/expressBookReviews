const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: process.env.SESSION_SECRET || "access",
    resave: true,
    saveUninitialized: true,
  })
);
app.use("/customer/auth/*", function authenticateUser(req, res, next) {
  console.log("Auth Middleware - Session Data:", req.session);

  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    console.log("Auth Middleware - Token:", token);

    // Token verification
    jwt.verify(token, process.env.JWT_SECRET || "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        console.error("Error verifying token:", err);
        return res.status(403).json({ message: "User is not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
