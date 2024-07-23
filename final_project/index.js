const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization['accessToken']; // Retrieve the token from session

    jwt.verify(token, 'your_jwt_secret', (err, user) => { // Verify the token
      if (!err) {
        req.user = user; // Attach user information to the request object
        next(); // Proceed to the next middleware or route handler
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
