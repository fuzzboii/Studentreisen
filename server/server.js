const dotenv = require("dotenv");
const express = require("express");

// Import Routes
const authRoute = require('./routes/auth');

// We can after this call environment variables in .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Temporary header to allow localhost:3000 as an origin, likely will be changed to "https://studentmarka.no:80" or similar
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route Middlewares
// Everything in authRoute will now have the following prefix
app.use('/api/user', authRoute);


app.listen(process.env.PORT, () => {
    console.log("Server is running")
});
