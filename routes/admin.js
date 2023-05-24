//Get required packages
const express = require('express');
const upload = require('express-fileupload');
const ImageKit = require('imagekit');
const pages = require('./pages');
const env = require('dotenv').config();
const router = express.Router();
const showdown = require('showdown');

const app = express();
var converter = new showdown.Converter();
var imagekit = new ImageKit({
  publicKey : "public_dffK/cgN/Jh0/rnefz5PfGoGRDw=",
  privateKey : process.env.IK_KEY,
  urlEndpoint : "https://ik.imagekit.io/mvrecords/"
});

router.use(upload());
router.use(pages.userSession);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Allows user to see admin functionality. (How to make this more secure?)
const authorization = (req, res, next) => {
    if ((req.session.passport && req.session.passport.user || process.env.DEV == "true")) {
        return next();
    }
    res.redirect("/invalidPage"); 
  }

//Page to make an entry
router.get('/createEntry', authorization, (req, res) =>{
  res.render("pages/createEntry", {admin: true});
});

//Page to add events
router.get('/createEvent', authorization, (req, res) =>{
  res.render("pages/createEvent", {admin: true});
});

//Page to add projects
router.get('/createProject', authorization, (req, res) =>{
  res.render("pages/createProject", {admin: true});
});

//Managing entries
router.get('/manageEntries', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, title, date, content from entries ORDER BY date DESC");
  res.render("pages/manage", {admin: true, mode: "entries", data: data});
});

//Managing events
router.get('/manageEvents', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, event_name, event_date, event_location from events ORDER BY event_date ASC");
  res.render("pages/manage", {admin: true, mode: "events", data: data});
})

//Managing projects
router.get('/manageProjects', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, title, description FROM projects");
  res.render("pages/manage", {admin: true, mode: "projects", data: data});
})

//Admin page
router.get('/', authorization, (req, res) =>{
  res.render('pages/admin', {admin: true});
});

//Login page (Need to find out how to do wrong password message)
router.post('/login', pages.passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/pages/wvcdaboys'
}));

//Get Logout command
router.get('/logout', function(req, res) {
  req.session.passport = null;
  req.user = null;
  res.redirect("/")
});

//Post entry query command(upload and editing)
router.post("/uploadEntry", async (req, res) =>{
  await uploadImagetoIK(req).then(async result => {
    if(result) 
      await uploadEntryToDB(req, result.filePath.replace("/",""), result.fileId);
    else 
      await uploadEntryToDB(req, null);
  })
  .then(res.redirect('/'));
})

//Post event query command
router.post("/uploadEvent", async (req, res) =>{
  await uploadImagetoIK(req).then(async result => {
    if(result)
      await uploadEventToDB(req, result.filePath.replace("/",""), result.fileId);
    else
      await uploadEventToDB(req, null);
  })
  .then(res.redirect('/'));
})

//Post project query command
router.post("/uploadProject", async (req, res) =>{
  await uploadImagetoIK(req)
  .then(async result => {
    if(result)
      await uploadProjectToDB(req, result.filePath.replace("/",""), result.fileId);
    else
      await uploadProjectToDB(req, null);
  })
  .then(res.redirect('/'));
})

//Post delete query command
router.post("/delete", authorization, async (req, res) =>{
  //Fetch image id from whatever we're deleting
  let query = `DELETE FROM ${req.body.db} WHERE id = ${req.body.id} RETURNING *`;
  let row = await pages.query(query);

  //console.log(row.rows[0]);

  //Do nothing if there is no file id
  if(!row.rows[0].fileId)
    return;

  //Delete the file from imagekit
  deleteImageFromIK(row.rows[0].fileId);
})

//Post edit command
router.post("/edit", async (req, res) =>{
  let fields = req.body.rows.replace(/\//g, ", ");
  let query = `SELECT id, ${fields}, img_id FROM ${req.body.db} WHERE id = '${req.body.id}'`;
  let row = await pages.query(query); 
  let data = row.rows[0];
  switch(req.body.db){
    case 'entries':
      res.render("pages/editEntry", {admin: true, data: data});
      break;
    case 'events':
      res.render("pages/editEvent", {admin: true, data: data});
      break;
    case 'projects':
      res.render("pages/editProject", {admin: true, data: data});
      break;
  }
});

//Function to upload image to imagekit
async function uploadImagetoIK(req){
  var img_data, base64Image, img_name;
  
  //If no file has been added, do nothign
  if(!req.files)
    return;

  img_name = req.files.imgUpload.name;
  img_data = req.files.imgUpload.data;
  base64Image = img_data.toString('base64');

  //Return a promise when uploading is finished
  return new Promise((resolve, reject) =>{
    imagekit.upload({
      file : base64Image,
      fileName : img_name,
    }, function(error, result) {
        if(error) reject(error);
        else resolve(result);
    });
  })
}

//Function to delete images from imagekit
async function deleteImageFromIK(file_id){
  //Return a promise when uploading is finished
  return new Promise((resolve, reject) =>{
    imagekit.deleteFile(file_id, function(error, result) {
      if(error) reject(error);
      else resolve(result);
    })
  });
};

//Function to upload entries to the database, updates them if editing
async function uploadEntryToDB(req, filePath, fileId){
  //Prepare values
  let author = req.session.person ? req.session.person : "undefined";
  let title = req.body.title.replace(/'/g, `''`);
  let date = new Date().toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  let content = req.body.content.replace(/'/g, `''`);
  let html = converter.makeHtml(content);
  //Since I'm an idiot to have an insert/update in one command, we have to accommodate for both
  let updQuery = 'UPDATE entries SET author = $1, title = $2, date = $3, content = $4, html = $5';
  let insQuery = 'INSERT INTO entries (author, title, date, content, html, img_id, "fileId") VALUES ($1, $2, $3, $4, $5, $6, $7)';
  let vars = [author, title, date, content, html];
  let preparedQuery;

  //If id exists, edit current post
  if(req.body.id) {
    let query = `SELECT "fileId" FROM entries WHERE id = '${req.body.id}'`;
    let res = await pages.query(query);
    let imgQuery = '';
    let idQuery = ' WHERE id = $';
    let imgId;

    //Get current image of post if exists
    if(res.rows.length > 0)
      imgId = res.rows[0].fileId;

    //Update image if desired, filepath existing means change image, imgSrc means remove
    if(filePath || req.body.imgSrc == ""){
      imgQuery = ', img_id = $6, "fileId" = $7 ';
      idQuery += '8';
      vars.push(filePath);
      vars.push(fileId);
      if(imgId)
        await deleteImageFromIK(imgId);
    }
    else{
      idQuery += '6';
    }

    preparedQuery = updQuery + imgQuery + idQuery;
    vars.push(req.body.id);
  }
  else {
    vars.push(filePath);
    vars.push(fileId);
    preparedQuery = insQuery;
  }
  console.log(await pages.prepare(preparedQuery, vars));
};

//Function to upload event to the database, updates them if editing
async function uploadEventToDB(req,filePath, fileId){
  //Prepare values
  let title = req.body.title.replace(/'/g, `''`);
  let date = req.body.date.replace(/'/g, `''`);
  let location = req.body.location;
  //Since I'm an idiot to have an insert/update in one command, we have to accommodate for both
  let updQuery = 'UPDATE events SET event_name = $1, event_date = $2, event_location = $3';
  let insQuery = 'INSERT INTO events (event_name, event_date, event_location, img_id, "fileId") VALUES ($1, $2, $3, $4, $5)';
  let vars = [title, date, location];
  let preparedQuery;

  //If id exists, edit current event
  if(req.body.id){
    let query = `SELECT "fileId" FROM events WHERE id = '${req.body.id}'`;
    let res = await pages.query(query);
    let imgQuery = '';
    let idQuery = ' WHERE id = $';
    let imgId = res.rows[0].fileId;
    
    //Update image if desired
    if(filePath){
      imgQuery = ', img_id = $4, "fileId" = $5 ';
      idQuery += '6';
      vars.push(filePath);
      vars.push(fileId);
      if(imgId)
        await deleteImageFromIK(imgId);
    }
    else{
      idQuery += '4';
    }
    preparedQuery = updQuery + imgQuery + idQuery;
    vars.push(req.body.id);
  }
  else{
    vars.push(filePath);
    vars.push(fileId);
    preparedQuery = insQuery;
  }
  console.log(await pages.prepare(preparedQuery, vars));
};

async function uploadProjectToDB(req,filePath, fileId){
  //Prepare values
  let title = req.body.title.replace(/'/g, `''`);
  let description = req.body.desc.replace(/'/g, `''`);
  //Since I'm an idiot to have an insert/update in one command, we have to accommodate for both
  let updQuery = 'UPDATE projects SET title = $1, description = $2';
  let insQuery = 'INSERT INTO projects (title, description, img_id, "fileId") VALUES ($1, $2, $3, $4)';
  let vars = [title, description];
  let preparedQuery;

  //If id exists, edit current project
  if(req.body.id){
    let query = `SELECT "fileId" FROM projects WHERE id = '${req.body.id}'`;
    let res = await pages.query(query);
    let imgQuery = '';
    let idQuery = ' WHERE id = $';
    let imgId = res.rows[0].fileId;
    
    //Update image if desired
    if(filePath){
      imgQuery = ', img_id = $3, "fileId" = $4 ';
      idQuery += '5';
      vars.push(filePath);
      vars.push(fileId);
      if(imgId)
        await deleteImageFromIK(imgId);
    }
    else{
      idQuery += '3';
    }
    preparedQuery = updQuery + imgQuery + idQuery;
    vars.push(req.body.id);
  }
  else{
    vars.push(filePath);
    vars.push(fileId);
    preparedQuery = insQuery;
  }
  console.log(await pages.prepare(preparedQuery, vars));
};
module.exports = router;