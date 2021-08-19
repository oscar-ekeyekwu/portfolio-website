/**
 * App setup using express
 */
const express = require('express');
const layout = require('express-layout');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
  

require('dotenv').config();

//set up express app
const app = express();
app.use(express.json());


//set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
const middleware = [
  layout(),

  cookieParser(),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  session({
    secret: 'super-secret-key',
    key: 'super-secret-cookie',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
  }),
  flash(),
];

//add middleware to app
app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware);

//initialize routes
app.use('/', require('./routes/routes'));

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

//error handling middleware
app.use((err, req, res, next) => {
  res.status(400).send({ error: err.message });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen for request
app.listen(process.env.PORT, function () {
  console.log(`Listening for Request on PORT: ${process.env.PORT}`);
});
