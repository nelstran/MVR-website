// const http = require('http');
const express = require('express');
const path = require('path');
const env = require('dotenv').config();
const app = express();
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
  getProjects();
  res.render('pages/projects', {events: events, projects: projects});
});
app.get('/pages/social', (req, res) => {
  updateEvents();
  res.render('pages/social', {events: events, socials: require("./express/json/socials.json")});
});
app.get('/pages/forum', (req, res) => {
  updateEvents();
  res.render('pages/forum', {events: events});
});
app.get('/pages/about', (req, res) => {
  updateEvents();
  res.render('pages/about', {events: events});
});
app.get('/pages/donate', (req, res) => {
  res.render('pages/donate', {events: events});
});
app.get('/pages/join', (req, res) => {
  res.render('pages/join', {events: events});
});
app.get('/pages/contact', (req, res) => {
  res.render('pages/contact', {events: events});
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});