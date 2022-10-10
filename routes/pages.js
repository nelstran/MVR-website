const express = require('express');
const app = express();
const router = express.Router();

const { Client } = require('pg');
const env = require('dotenv').config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

var events;
var projects;
var admin = false;

router.get('/', (req, res) => {
  res.redirect("/");
});

router.get('/projects', (req, res) => {
  updateEvents();
  getProjects();
  giveAdmin(req);
   
  res.render('pages/projects', {events: events, projects: projects, admin: admin});
});

router.get('/social', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/social', {events: events, socials: require("../express/json/socials.json"), admin: admin});
});

router.get('/forum', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/forum', {events: events, admin: admin});
});

router.get('/about', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/about', {events: events, admin: admin});
});

router.get('/donate', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/donate', {events: events, admin: admin});
});

router.get('/join', (req, res) => {
  updateEvents();
  giveAdmin(req);

  res.render('pages/join', {events: events, admin: admin});
});

router.get('/contact', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/contact', {events: events, admin: admin});
});

router.get('/wvcdaboys', (req, res) => {
  updateEvents();
  giveAdmin(req);
   
  res.render('pages/wvcdaboys', {events: events, admin: admin});
});
//Error page
router.get('*', function(req, res) {
  res.redirect('/');
});
client.connect()
.then(() => console.log("Connected to Postgresql server!"))
.catch(err => console.error("Unable to connect to Postgresql server!"));

var updateEvents = function(){
  client.query("SELECT * FROM events ORDER BY event_date ASC", (err, data) =>{
    if (err) return events = null;
    events = data.rows;
  })
  return events;
};
var getProjects = function(){
  client.query("SELECT * FROM projects", (err, data) =>{
    if(err) return events = null;
      projects = data.rows;
  })
  return projects;
};
var giveAdmin = function(req){
  if(!req.session.loggedin)
    return false;
  admin = true;
  return true;
};
module.exports = {
    router, events, updateEvents, giveAdmin, admin
};