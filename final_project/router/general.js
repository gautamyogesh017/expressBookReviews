const express = require("express");
const public_users = express.Router();
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  console.log("Register Request - Body:", req.body);

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      console.log("User successfully registered:", username);
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      console.log("User already exists:", username);
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  console.log("Invalid registration request:", req.body);
  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", async (req, res) => {
  console.log("Fetch Books All Books");

  const fetchedBooks = await fetchBooks();
  res.send(JSON.stringify(fetchedBooks, null, 4));
});

public_users.get("/isbn/:isbn", async (req, res) => {
  const ISBN = req.params.isbn;
  console.log("Fetch Books by ISBN Request - ISBN:", ISBN);

  const fetchedBooks = await fetchBooks();
  res.status(200).send(fetchedBooks.find((book) => book.isbn === ISBN));
});

public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  console.log("Fetch Books by Author Request - Author:", author);

  const fetchedBooks = await fetchBooks();
  res.status(200).send(fetchedBooks.find((book) => book.author === author));
});

public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  console.log("Fetch Books by Title Request - Title:", title);

  const fetchedBooks = await fetchBooks();
  res.send(
    fetchedBooks.filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
    )
  );
});

public_users.get("/review/:isbn", async (req, res) => {
  const ISBN = req.params.isbn;
  console.log("Fetch Reviews by ISBN Request - ISBN:", ISBN);

  const fetchedBooks = await fetchBooks();
  const reviews =
    fetchedBooks.find((book) => book.isbn === ISBN)?.reviews ?? {};
  res.json(reviews);
});

async function fetchBooks() {
  console.log("Fetching Books");

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Object.values(books));
    }, 3000);
  });
}

module.exports.general = public_users;
