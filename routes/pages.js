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

var getEvents = async function(){
  try{
    return await client.query("SELECT * FROM events ORDER BY event_date ASC");
  }
  catch (err){
    console.error(err);
  }
};
var getProjects = async function(){
  try{
    return await client.query("SELECT * FROM projects");
  }
  catch (err){
    console.error(err);
  }
};

var getEntries = async function(){
  try{
    return await client.query("SELECT * FROM entries ORDER BY date DESC");
  }
  catch (err){
    console.error(err);
  }
}
var giveAdmin = function(req){
  if(!req.session.loggedin){
    admin = false;
    return admin;
  }
  admin = true;
  return admin;
};
var admin = process.env.DEV_MODE == "true";

router.use(userSession);

router.get('/', (req, res) => {
  res.redirect("/");
});

router.get('/projects', async (req, res) => {
  let events = await getEvents();
  let projects = await getProjects();
  giveAdmin(req);
   
  res.render('pages/projects', {events: events.rows, projects: projects.rows, admin: admin});
});

router.get('/social', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/social', {events: events.rows, socials: require("../express/json/socials.json"), admin: admin});
});

router.get('/forum', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/forum', {events: events.rows, admin: admin});
});

router.get('/about', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/about', {events: events.rows, admin: admin});
});

router.get('/donate', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/donate', {events: events.rows, admin: admin});
});

router.get('/join', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);

  res.render('pages/join', {events: events.rows, admin: admin});
});

router.get('/contact', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/contact', {events: events.rows, admin: admin});
});

router.get('/wvcdaboys', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
   
  res.render('pages/wvcdaboys', {events: events.rows, admin: admin});
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
    getEvents,
    getEntries, 
    giveAdmin, 
    authentication,
    upload,
    admin, 
    userSession
};