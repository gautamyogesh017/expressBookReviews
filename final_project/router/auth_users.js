const express = require("express");
const jwt = require("jsonwebtoken");

let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let validuser = users.filter((user) => {
    return user.username === username;
  });
  if (validuser.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", {
      expiresIn: 60 * 60,
    });

    req.session.authorization = {
      accessToken: token,
      username: username,
    };

    console.log("Login Route - Session Data Set:", req.session);

    return res.status(200).json({ message: "Logged in successfully", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn.toString();
  const review = req.body.review;
  const username = req.session.authorization.username;
  console.log("Received Review Request:", { isbn, review, username });
  console.log("body parameters are:", req.body);
  console.log("Books Database:", books);
  console.log("Received ISBN:", isbn);

  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (book) {
    // Update the reviews for the found book
    book.reviews[username] = review;
    console.log("reviewww :", review);
    return res
      .status(200)
      .json({ message: "Review successfully posted", review });
  } else {
    return res.status(404).send({ message: `ISBN ${isbn} not found` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn.toString();
  const username = req.session.authorization.username;

  console.log("Received Delete Review Request:", { isbn, username });
  console.log("Books Database:", books);
  console.log("Received ISBN:", isbn);
  console.log("Book Details:", books[isbn]);

  const book = Object.values(books).find((book) => book.isbn === isbn);

  if (book) {
    // Check if the user has a review for this book
    if (book.reviews[username]) {
      // Delete the review for the found book
      delete book.reviews[username];
      return res.status(200).send("Review successfully deleted");
    } else {
      return res
        .status(404)
        .send({ message: `User's review not found for ISBN ${isbn}` });
    }
  } else {
    return res.status(404).send({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
