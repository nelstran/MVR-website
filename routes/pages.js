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
var conn = false;

var getEvents = async function(){
  try{
    return await query("SELECT * FROM events ORDER BY event_date ASC");
  }
  catch (err){
    console.error(err);
  }
};
var getProjects = async function(){
  try{
    return await query("SELECT * FROM projects");
  }
  catch (err){
    console.error(err);
  }
};
var getEntries = async function(){
  try{
    return await query("SELECT * FROM entries ORDER BY date DESC");
  }
  catch (err){
    console.error(err);
  }
}
var giveAdmin = function(req){
  if((req.session.passport && req.session.passport.user)){
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
  let pageInfo = {
    events: events ? events.rows : null,
    projects: projects ? projects.rows : null,
    admin: admin
  };
  pageInfo.p = false;
  pageInfo.ad
  res.render('pages/projects', pageInfo);
});

router.get('/social', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    socials: require("../express/json/socials.json"),
    admin: admin
  };
  res.render('pages/social', pageInfo);
});

router.get('/forum', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  };
  res.render('pages/forum', pageInfo);
});

router.get('/about', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  };
  res.render('pages/about', pageInfo);
});

router.get('/donate', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  };
  res.render('pages/donate', pageInfo);
});

router.get('/join', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  };
  res.render('pages/join', pageInfo);
});

router.get('/contact', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  }; 
  res.render('pages/contact', pageInfo);
});

router.get('/wvcdaboys', async (req, res) => {
  let events = await getEvents();
  giveAdmin(req);
  let pageInfo = {
    events: events ? events.rows : null,
    admin: admin
  };
  res.render('pages/wvcdaboys', pageInfo);
});

//Error page
router.get('*', function(req, res) {
  res.redirect('/');
});

client.connect()
.then(() => {
  console.log("Connected to Postgresql server!");
  conn = true;
})
.catch(err => {
  console.error("Unable to connect to Postgresql server!");
  conn = false;
});

var query = async function(query){
  if(!conn)
    return null;
  let res = null;
  await client.query(query)
  .then(results => res=results)
  .catch(err => {
    console.log(err);
  })
  return res;
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