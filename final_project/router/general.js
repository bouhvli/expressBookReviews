const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const booksList = await new Promise((resolve, reject) => {
      resolve(books);
    });
    res.status(200).json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the book list", error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;
  try {
    const response = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;
  try {
    const booksByAuthor = await new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const bookList = [];
      keys.forEach(key => {
        if (books[key].author === author) {
          bookList.push(books[key]);
        }
      });
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found for the specified author");
      }
    });
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;
  try {
    const booksByTitle = await new Promise((resolve, reject) => {
      const keys = Object.keys(books);
      const bookList = [];
      keys.forEach(key => {
        if (books[key].title === title) {
          bookList.push(books[key]);
        }
      });
      if (bookList.length > 0) {
        resolve(bookList);
      } else {
        reject("No books found for the specified title");
      }
    });
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
