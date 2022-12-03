const express = require('express');
const upload = require('express-fileupload');
const app = express();
const router = express.Router();
const pages = require('./pages');
const env = require('dotenv').config();

const ImageKit = require('imagekit');
var imagekit = new ImageKit({
  publicKey : "public_dffK/cgN/Jh0/rnefz5PfGoGRDw=",
  privateKey : process.env.IK_KEY,
  urlEndpoint : "https://ik.imagekit.io/mvrecords/"
});
const showdown = require('showdown');
var converter = new showdown.Converter();

router.use(upload());
router.use(pages.userSession);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authorization = (req, res, next) => {
    if ((req.session.passport && req.session.passport.user)) {
        return next();
    }
    res.redirect("/"); 
  }

router.get('/createEntry', authorization, (req, res) =>{
  res.render("pages/createEntry", {admin: true});
});
router.get('/createEvent', authorization, (req, res) =>{
  res.render("pages/createEvent", {admin: true});
})
router.get('/createProject', authorization, (req, res) =>{
  res.render("pages/createProject", {admin: true});
})
router.get('/manageEntries', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, title, date, content from entries ORDER BY date DESC");
  res.render("pages/manage", {admin: true, mode: "entries", data: data});
})
router.get('/manageEvents', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, event_name, event_date, event_location from events ORDER BY event_date ASC");
  res.render("pages/manage", {admin: true, mode: "events", data: data});
})
router.get('/manageProjects', authorization, async (req, res) =>{
  let data = await pages.query("SELECT id, title, description FROM projects");
  res.render("pages/manage", {admin: true, mode: "projects", data: data});
})
router.get('/', authorization, (req, res) =>{
  res.render('pages/admin', {admin: true});
});

router.post('/login', pages.passport.authenticate('local', {
  successRedirect: '/admin',
  failureRedirect: '/pages/wvcdaboys'
}));
router.get('/logout', function(req, res) {
  req.session.passport = null;
  req.user = null;
  // pages.giveAdmin(req);
  res.redirect("/")
});

router.post("/uploadEntry", async (req, res) =>{
  await uploadImagetoIK(req).then(async result => {
    if(result)
      await uploadEntryToDB(req, result.filePath.replace("/",""), result.fileId)
    else
      await uploadEntryToDB(req, null);
  })
  .then(res.redirect('/'));
})
router.post("/uploadEvent", async (req, res) =>{
  await uploadImagetoIK(req)
  .then(async result => {
    if(result)
      await uploadEventToDB(req, result.filePath.replace("/",""), result.fileId);
    else
      res.send("Error has occured uploading event");
  })
  .then(res.redirect('/'));
})
router.post("/uploadProject", async (req, res) =>{
  await uploadImagetoIK(req)
  .then(async result => {
    if(result)
      await uploadProjectToDB(req, result.filePath.replace("/",""), result.fileId);
    else
      res.send("Error has occured uploading project");
  })
  .then(res.redirect('/'));
})
router.post("/delete", authorization, async (req, res) =>{
  let query = `DELETE FROM ${req.body.db} WHERE id = ${req.body.id} RETURNING *`;
  let row = await pages.query(query);
  console.log(row.rows[0]);
  if(!row.rows[0].fileId)
    return;
  imagekit.deleteFile(row.rows[0].fileId, function(error, result) {
    if(error) console.log(error);
        else console.log(result);
  });
})

router.post("/edit", async (req, res) =>{
  let fields = req.body.rows.replace(/\//g, ", ");
  let query = `SELECT ${fields}, img_id FROM ${req.body.db} WHERE id = '${req.body.id}'`;
  let row = await pages.query(query); 
  let data = row.rows[0];
  switch(req.body.db){
    case 'entries':
      res.render("pages/editEntry", {admin: true, data: data});
      break;
    case 'events':
      res.render("pages/editEvents", {admin: true, data: data});
      break;
    case 'projects':
      res.render("pages/editProjects", {admin: true, data: data});
      break;
  }
});

async function uploadImagetoIK(req){
  var img_data, base64Image, img_name;
  
  if(!req.files)
    return;
  img_name = req.files.imgUpload.name;
  img_data = req.files.imgUpload.data;
  base64Image = img_data.toString('base64');

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
async function uploadEntryToDB(req, filePath, fileId){
  let author;
  if(req.session)
    author = req.session.person;
  let title = req.body.title.replaceAll(`'`, `''`);
  let date = new Date().toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  let content = req.body.content.replaceAll(`'`, `''`);
  let html = converter.makeHtml(content);
  let query = `INSERT INTO entries (author, title, date, content, html, img_id, "fileId") VALUES ('${author}', '${title}', '${date}', '${content}', '${html}', '${filePath}', '${fileId}')`;
  
  console.log(await pages.query(query));
  console.log("Uploaded entry");
};
async function uploadEventToDB(req,filePath, fileId){
  let title = req.body.title.replaceAll(`'`, `''`);
  let date = req.body.date.replaceAll(`'`, `''`);
  let location = req.body.location;
  let query = `INSERT INTO events (event_name, event_date, event_location, img_id, "fileId") VALUES ('${title}', '${date}', '${location}', '${filePath}', '${fileId}')`;
  
  console.log(await pages.query(query));
  console.log("Uploaded event");
};
async function uploadProjectToDB(req,filePath, fileId){
  let title = req.body.title.replaceAll(`'`, `''`);
  let description = req.body.desc.replaceAll(`'`, `''`);
  let query = `INSERT INTO projects (title, description, img_id, "fileId") VALUES ('${title}', '${description}', '${filePath}', '${fileId}')`;
  
  console.log(await pages.query(query));
  console.log("Uploaded project");
};
module.exports = router;