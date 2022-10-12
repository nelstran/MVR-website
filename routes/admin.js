const express = require('express');
const app = express();
const router = express.Router();
const pages = require('./pages');

router.use(pages.userSession);
const authorization = (req, res, next) => {
    if (pages.giveAdmin(req)) {
      next()
    } else {
      res.redirect("/");
    }
  }

router.get('/createEntry', authorization, (req, res) =>{
  res.send("Entry page");
});
router.get('/createEvent', authorization, (req, res) =>{
  res.send("Event page");
})
router.get('/createProject', authorization, (req, res) =>{
  res.send("Project page");
})
router.get('/', authorization, (req, res) =>{
  res.render('pages/admin', {admin: true});
});
router.post('/login', function(req, res) {
  pages.authentication(req, res)
});
router.get('/logout', function(req, res) {
  req.session.loggedin = false;
  req.session.username = null;
  pages.giveAdmin(req);
  res.redirect("/")
});
module.exports = router;