const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const app = express();
const router = express.Router();

const userSession = new session({
  secret: 'secret key',
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
var admin = false;

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
  if(req.session.passport){
    if(req.session.passport.user)
      return admin = true;
  }
  return admin = false;
};
passport.use(new LocalStrategy(function verify(username, password, cb) {
  client.query(`SELECT * FROM users WHERE user_id='${username}'`, function(err, results) {
    if (err)
      return cb(err);
    if (results.rows.length == 0)
      return cb(null, false, {
        message: 'Incorrect username or password.'
      }); 
    let row = results.rows[0];
    
    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (row.hashed != hashedPassword.toString('base64')) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      let user = {id: row.id, person: row.person};
      return cb(null, user);
    });
  });
}));

router.use(userSession);
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser( (userObj, done) => {done(null, userObj)});
passport.deserializeUser((userObj, done) => {done (null, userObj)});

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

var query = async function(query){
  try{
    return await client.query(query);
  }
  catch (err){
    return err;
  }
}
module.exports = {
    router,
    getEvents,
    getEntries, 
    giveAdmin,
    query,
    admin, 
    userSession,
    passport
};