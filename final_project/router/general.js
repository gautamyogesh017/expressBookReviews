const express = require('express');
const books = require('./booksdb.js');
const users = require('./auth_users').users;

const public_users = express.Router();

const validUser = (userName) => !!users.filter(({username}) => username === userName).length;

public_users.post('/register', (req, res) => {
	const {username, password} = req.body;
	if (!username || !password) {
		return res.status(404).json({message: "Username Or Password missing"});
	}
	if (validUser(username)) {
		return res.status(404).json({message: "User already exists"})
	} else {
		users.push({username, password});
		return res.status(200).json({message: "User registered successfully"});
	};

})

public_users.get('/', async (req, res) => {
	const fetchedBooks = await fetchBooks();
	res.send(JSON.stringify(fetchedBooks, null, 4));
})

public_users.get('/isbn/:isbn', async (req, res) => {
	const ISBN = req.params.isbn;
	const fetchedBooks = await fetchBooks();
	res.send(fetchedBooks.filter(book => book.isbn === +ISBN));
})

public_users.get('/author/:author', async (req, res) => {
	const author = req.params.author;
	const fetchedBooks = await fetchBooks();
	res.send(fetchedBooks.filter(book => book.author === author));
})

public_users.get('/title/:title', async (req, res) => {
	const title = req.params.title;
	const fetchedBooks = await fetchBooks();
	res.send(fetchedBooks.filter(book => book.title.toLowerCase() === title.toLowerCase()));
})

public_users.get('/review/:isbn', async (req, res) => {
	const ISBN = req.params.isbn;
	const fetchedBooks = await fetchBooks();
	res.send(fetchedBooks.filter(book => book.isbn === +ISBN)?.[0]?.reviews);
})

async function fetchBooks() {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(books)	
		}, 3000)
	})
}

module.exports.general = public_users;
