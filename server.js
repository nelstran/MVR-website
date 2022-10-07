// const http = require('http');
const express = require('express');
const path = require('path');
const env = require('dotenv').config();
const app = express();
const session = require('express-session');
const port = process.env.PORT || 3000;
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var events;
var projects;
var admin = false;

function updateEvents(){
  client.query("SELECT * FROM events ORDER BY event_date ASC", (err, data) =>{
    if (err) return events = null;
    events = data.rows;
  })
};
function getProjects(){
  client.query("SELECT * FROM projects", (err, data) =>{
    if(err) return events = null;
      projects = data.rows;
  })
}
client.connect()
.then(() => console.log("Connected to Postgresql server!"))
.catch(err => console.error("Unable to connect to Postgresql server!"));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("express"));// default URL for website

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
  res.render('home', {events: events, admin: admin});
});
app.get('/home', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('home', {events: events, admin: admin});
});
app.get('/pages/projects', (req, res) => {
  updateEvents();
  getProjects();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/projects', {events: events, projects: projects, admin: admin});
});
app.get('/pages/social', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/social', {events: events, socials: require("./express/json/socials.json"), admin: admin});
});
app.get('/pages/forum', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/forum', {events: events, admin: admin});
});
app.get('/pages/about', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/about', {events: events, admin: admin});
});
app.get('/pages/donate', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/donate', {events: events, admin: admin});
});
app.get('/pages/join', (req, res) => {
  res.render('pages/join', {events: events, admin: admin});
});
app.get('/pages/contact', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/contact', {events: events, admin: admin});
});

app.get('/pages/wvcdaboys', (req, res) => {
  updateEvents();
  if(req.session.loggedin)
    admin = true;
   
  res.render('pages/wvcdaboys', {events: events, admin: admin});
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		client.query(`SELECT * FROM users WHERE user_id='${username.trim()}' AND password='${password.trim()}'`, function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error)
        throw error;
			// If the account exists
			if (results.rows.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})