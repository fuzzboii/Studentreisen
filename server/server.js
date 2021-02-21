const dotenv = require("dotenv");
const express = require("express");

// Import Routes
const authRoute = require('./routes/auth');

// We can after this call environment variables in .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Route Middlewares
// Everything in authRoute will now have the following prefix
app.use('/api/user', authRoute);


app.listen(process.env.PORT, () => {
    console.log("Server is running")
});
