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
const authorization = (req, res, next) => {
    if (pages.giveAdmin(req)) {
      next()
    } else {
      res.redirect("/");
    }
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
  let data = await pages.query("SELECT title, date, content from entries ORDER BY date DESC");
  res.render("pages/manage", {admin: true, mode: "entries", data: data});
})
router.get('/manageEvents', authorization, async (req, res) =>{
  let data = await pages.query("SELECT event_name, event_date, event_location from events ORDER BY event_date ASC");
  res.render("pages/manage", {admin: true, mode: "events", data: data});
})
router.get('/manageProjects', authorization, async (req, res) =>{
  let data = await pages.query("SELECT title, description FROM projects");
  res.render("pages/manage", {admin: true, mode: "projects", data: data});
})
router.get('/', authorization, (req, res) =>{
  res.render('pages/admin', {admin: true});
});
router.post('/login', (req, res) => {
  pages.authentication(req, res)
});
router.post("/uploadEntry", async (req, res) =>{
  await uploadImagetoIK(req).then(result => {
    if(result)
      uploadEntryToDB(req, result.filePath.replace("/",""))
    else
      uploadEntryToDB(req, null);
  })
  .then(res.redirect('/'));
  
})
router.post("/uploadEvent", async (req, res) =>{
  await uploadImagetoIK(req)
  .then(result => {
    if(result)
      uploadEventToDB(req, result.filePath.replace("/",""));
    else
      res.send("Error has occured uploading event");
  })
  .then(res.redirect('/'));
  
})
router.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.username = null;
  pages.giveAdmin(req);
  res.redirect("/")
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
function uploadEntryToDB(req, filePath){
  let author;
  if(req.session)
    author = req.session.person;
  let title = req.body.title;
  let date = new Date().toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  let content = req.body.content;
  let html = converter.makeHtml(content);
  let query = `INSERT INTO entries (author, title, date, content, html, img_id) VALUES ('${author}', '${title}', '${date}', '${content}', '${html}', '${filePath}')`;
  pages.query(query);
  console.log("Uploaded entry");
};
function uploadEventToDB(req,filePath){
  let title = req.body.title;
  let date = req.body.date;
  let location = req.body.location;
  let query = `INSERT INTO events (event_name, event_date, event_location, event_image_id) VALUES ('${title}', '${date}', '${location}', '${filePath}')`;
  pages.query(query);
  console.log("Uploaded event");

};
module.exports = router;