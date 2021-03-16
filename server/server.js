const dotenv = require("dotenv");
const express = require("express");

// Importerer routes vi bruker
const authRoute = require('./routes/auth');
const forgotPasswordRoute = require('./routes/forgotPassword');
const verificationRoute = require('./routes/verification');
const courseRoute = require('./routes/courses');
const toolsRoute = require('./routes/tools');

// Gjør at vi kan kalle variabler fra .env
dotenv.config();

const app = express();

// Mellomvare
app.use(express.json());

// Midlertidig header for å tillate tilkoblinger fra localhost:3000, vil sannsynligvis bli endret til studentreisen.no ved senere tidspunkt
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route Mellomvare
// Alle her vil ha følgende prefiks
app.use('/api/v1/auth', authRoute);
app.use('/api/v1', forgotPasswordRoute);
app.use('/api/v1/verify', verificationRoute);
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/tools', toolsRoute);


app.listen(process.env.PORT, () => {
    console.log("Serveren kjører")
});
