const { response } = require('express');
const express = require('express');
const session = require('express-session');
const app = express();
const router = express.Router();
const userSession = new session({
  secret: 'secret',
	resave: true,
	saveUninitialized: true
})

const { Client } = require('pg');
const env = require('dotenv').config();
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

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

var getEntries = function(){
  client.query("SELECT * FROM entries", (err, data) =>{
    if (err) return events = null;
    entries = data.rows;
  })
  return entries;
}
var giveAdmin = function(req){
  if(!req.session.loggedin){
    admin = false;
    return admin;
  }
  admin = true;
  return admin;
};

var events = updateEvents();
var projects = getProjects();
var entries = getEntries();
var admin = process.env.DEV_MODE == "true";

router.use(userSession);

router.get('/', (req, res) => {
  res.redirect("/");
});

router.get('/projects', async (req, res) => {
  await updateEvents();
  await getProjects();
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

var authentication = function(req, res){
  let user = req.body.username;
  let pass = req.body.password;

  if(user && pass && validate(user,pass)){
    let query = `SELECT * FROM users WHERE user_id='${user}' AND password='${pass}'`;
    client.query(query, function(err, results, fields){
      if(err) throw err;
      
      if(results.rows.length > 0) {
        req.session.loggedin = true;
        req.session.person = results.rows[0].person;
        res.redirect('/admin');
      }
      else{
        res.send('Incorrect Username and/or Password!');
      }
    });
  }
  else{
    res.send('Please enter Username and Password!');
    res.end();
  }
};

function validate(user, pass){
  if(user.includes(" ") || pass.includes(" ") ||
    user.includes("=") || pass.includes("=") ||
    user.length < 7 || pass.length < 7)
    return false;
  return true;
}

var upload = function(query){
  client.query(query, function(err, results){
    if (err) throw err;
    console.log("1 record inserted");
  })
}
module.exports = {
    router,
    events, 
    updateEvents,
    getEntries, 
    giveAdmin, 
    authentication,
    upload,
    admin, 
    userSession
};