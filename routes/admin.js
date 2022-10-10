const express = require('express');
const app = express();
const router = express.Router();

const authorization = (req, res, next) => {
    // todo verify authorization
    if (true) {
      next() // LINE 17
    } else {
      res.redirect("/pages/social");
    }
  }

router.get('/create',authorization, (req, res) =>{
    
    res.send("hello");
})
module.exports = router;