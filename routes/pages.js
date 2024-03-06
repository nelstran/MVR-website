//Get required packages
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const { Client } = require('pg');
const env = require('dotenv').config();
const moment = require('moment');

//const app = express();
const router = express.Router();

//Experimenting with user session, have no idea what I'm doing
const userSession = new session({
  secret: 'secret key',
	resave: true,
	saveUninitialized: true
})

//Database client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
var conn = false;

//Function to get events from database
async function getEvents(){
  try{
    return await query("SELECT * FROM events ORDER BY event_date ASC");
  }
  catch (err){
    console.error(err);
  }
};

//Function to get past eventss from database
async function getPastEvents(){
  try{
    return await query("SELECT * FROM projects");
  }
  catch (err){
    console.error(err);
  }
};

//Function to get entries from database
async function getEntries(){
  try{
    return await query("SELECT * FROM entries ORDER BY CAST(date as date) DESC");
  }
  catch (err){
    console.error(err);
  }
}

//Function to get new data on each page navigation
var getInfo = async function(req, arr){
  let pageInfo = [];
  //Iterate through each property to fetch
  for await(data of arr){
    let fetch;
    switch(data){
      case 'admin':
        pageInfo[data] = giveAdmin(req);
      break;
      case 'events':
        fetch = await getEvents();
        pageInfo[data] = fetch ? fetch.rows : null;
      break;
      case 'projects':
        fetch = await getPastEvents();
        pageInfo[data] = fetch ? fetch.rows : null;
      break;
      case 'entries':
        fetch = await getEntries();
        pageInfo[data] = fetch ? fetch.rows : null;
      break;
      case 'socials':
        pageInfo[data] = require("../express/json/socials.json");
      break;
    }
  };
  pageInfo['moment'] = moment
  return pageInfo;
};

// Function to execute queries to database
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

//Function to execute prepared statements
var prepare = async function(query, vars){
  if(!conn)
    return null;
    
  let res = null;
  console.log(query);
  console.log(vars);
  await client.query(query, vars)
  .then(results => res=results)
  .catch(err => {
    console.log(err);
  })
  return res;
}
//Allows user to see admin functionality. (How to make this more secure?)
var giveAdmin = function(req){
  if((req.session.passport && req.session.passport.user || process.env.DEV == "true")){
      return true;
  }
  return false;
};

//Set session
router.use(userSession);
router.use(passport.initialize());
router.use(passport.session());

//No idea what this does
passport.serializeUser( (userObj, done) => {done(null, userObj)});
passport.deserializeUser((userObj, done) => {done (null, userObj)});
passport.use(new LocalStrategy(function verify(username, password, cb) {
  //Prepare statement and execute
  client.query('SELECT * FROM users WHERE user_id= $1', [username], function(err, results) {
    if (err)
      return cb(err);

    if (results.rows.length == 0)
      return cb(null, false, {
        message: 'Incorrect username or password.'
      }); 

    let row = results.rows[0];
    
    //Verify password if account exists
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

router.get('/', (req, res) => {
  res.redirect("/");
});

//Past events page (used to be projects)
router.get('/past-events', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events", "projects"]);
  res.render('pages/projects', pageInfo);
});

//Social page
router.get('/social', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events", "socials"]);
  res.render('pages/social', pageInfo);
});

//Forum (Doom) page
router.get('/forum', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/forum', pageInfo);
});


//About page
router.get('/about', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/about', pageInfo);
});

//Joke donation page
router.get('/donate', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/donate', pageInfo);
});

//Joke join page
router.get('/join', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/join', pageInfo);
});

//Joke contact page
router.get('/contact', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/contact', pageInfo);
});

//Login page
router.get('/wvcdaboys', async (req, res) => {
  let pageInfo = await getInfo(req, ["admin", "events"]);
  res.render('pages/wvcdaboys', pageInfo);
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

module.exports = {
    router,
    getInfo,
    query,
    prepare,
    userSession,
    passport
};