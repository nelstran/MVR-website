const express = require('express');
// const session = require('express-session');
const app = express();
const adminRouter = require('./routes/admin');
const pages = require('./routes/pages');
const port = process.env.PORT || 3000;

const path = require('path');

var events = pages.updateEvents();
var entries = pages.getEntries();
var admin = false;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("express"));// default URL for website
app.use('/admin', adminRouter);
app.use('/pages', pages.router);
app.use(pages.userSession);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

//Default page
app.get('/', (req, res) => {
  res.redirect("/home");
});
app.get('/home', async (req, res) => {
  events = await pages.updateEvents();
  admin = pages.giveAdmin(req);
  entries = await pages.getEntries();
   
  res.render('home', {events: events, admin: admin, entries: entries});
});

//Page not found
app.get('*', function(req, res) {
  //Error page has not been made yet
  res.redirect('/');
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

// Handling Error
process.on("unhandledRejection", err => {
  console.log(`An error occurred: ${err.message}`)
  server.close(() => process.exit(1))
})