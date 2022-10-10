const express = require('express');
const session = require('express-session');
const app = express();
const adminRouter = require('./routes/admin');
const pages = require('./routes/pages');
const port = process.env.PORT || 3000;

const path = require('path');

var events;
var admin = false;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("express"));// default URL for website
app.use('/admin', adminRouter);
app.use('/pages', pages.router);
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//Default page
app.get('/', (req, res) => {
  res.redirect("/home");
});
app.get('/home', (req, res) => {
  events = pages.updateEvents();
  admin = pages.giveAdmin(req);
   
  res.render('home', {events: events, admin: admin});
});

//Page not found
app.get('*', function(req, res) {
  //Error page has not been made yet
  res.redirect('/');
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