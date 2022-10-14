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
router.get('/', authorization, (req, res) =>{
  res.render('pages/admin', {admin: true});
});
router.post('/login', function(req, res) {
  pages.authentication(req, res)
});
router.post("/uploadEntry", (req, res) =>{
  var img_data, base64Image, img_name;

  if(req.files){
    img_name = req.files.imgUpload.name;
    img_data = req.files.imgUpload.data;
    base64Image = img_data.toString('base64');
  }

  imagekit.upload({
    file : base64Image,
    fileName : img_name,
  }, function(error, result) {
      if(error) console.log(error);
      else console.log(result);
      uploadToDatabase(req,result.filePath.replace("/",""));
  });
  res.redirect('/');
})
router.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.username = null;
  pages.giveAdmin(req);
  res.redirect("/")
});

function uploadToDatabase(req, filePath){
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
  pages.upload(query);
}
module.exports = router;