// const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();
client.query("SELECT * FROM events", (err, res) =>{
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
})
app.use(express.json());
app.use(express.static("express"));// default URL for website

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/pages/projects', (req, res) => {
  res.render('pages/projects');
});
app.get('/pages/social', (req, res) => {
  res.render('pages/social');
});
app.get('/pages/forum', (req, res) => {
  res.render('pages/forum');
});
app.get('/pages/about', (req, res) => {
  res.render('pages/about');
});
app.get('/pages/join', (req, res) => {
  res.render('pages/join');
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});