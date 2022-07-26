// const http = require('http');
const express = require('express');
const path = require('path');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { Client } = require('pg');
const { CLIENT_RENEG_WINDOW } = require('tls');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var events;
var updateEvents = function(){
  client.query("SELECT * FROM events", (err, data) =>{
    if (err) throw err;
    events = data.rows;
  })
};

client.connect();

app.use(express.json());
app.use(express.static("express"));// default URL for website

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req, res) => {
  updateEvents();
  res.render('home', {events: events});
});
app.get('/home', (req, res) => {
  updateEvents();
  res.render('home', {events: events});
});
app.get('/pages/projects', (req, res) => {
  updateEvents();
  res.render('pages/projects', {events: events});
});
app.get('/pages/social', (req, res) => {
  updateEvents();
  res.render('pages/social', {events: events});
});
app.get('/pages/forum', (req, res) => {
  updateEvents();
  res.render('pages/forum', {events: events});
});
app.get('/pages/about', (req, res) => {
  updateEvents();
  res.render('pages/about', {events: events});
});
app.get('/pages/join', (req, res) => {
  res.render('pages/join', {events: events});
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});