//Get required packages
const express = require('express');
const adminRouter = require('./routes/admin');
const pages = require('./routes/pages');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

//Initial setup
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

//Home page
app.get('/home', async (req, res) => {
  let pageInfo = await pages.getInfo(req, ["events", "admin", "entries"]);
  res.render('home', pageInfo);
});

//Page not found
app.get('*', async function(req, res) {
  let pageInfo = await pages.getInfo(req, ["events", "admin", "entries"]);
  res.render('pages/404', pageInfo);
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});