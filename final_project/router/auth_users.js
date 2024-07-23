const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { // returns boolean
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => { // returns boolean
    const user = users.find(user => user.username === username);
    return user && user.password === password;
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Authenticate user
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });

    // Save token in session
    req.session.authorization = { accessToken };

    res.status(200).json({ message: "Login successful", accessToken });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query; // Get review from query parameters

    // Ensure user is authenticated
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    // Ensure the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Get the username from the session
    const username = jwt.verify(req.session.authorization.accessToken, "access").username;

    // Add or update the review
    books[isbn].reviews[username] = review;

    res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
