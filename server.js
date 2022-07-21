// const http = require('http');
const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static("express"));// default URL for website

// app.use('/', function(req,res){
//   res.sendFile(path.join(__dirname+'/express/index.html'));
//   //__dirname : It will resolve to your project folder.
// });
// const server = http.createServer(app);
// const port = process.env.PORT || 3000;
// server.listen(port);
// console.debug('Server listening on port ' + port);

// const express = require('express');
// const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/pages/projects', (req, res) => {
  res.render('pages/projects');
});
app.get('/pages/social', (req, res) => {
  res.render('pages/social');
});
app.get('/pages/forum', (req, res) => {
  res.render('pages/forum');
});
app.get('/pages/about', (req, res) => {
  res.render('pages/about');
});
app.get('/pages/join', (req, res) => {
  res.render('pages/join');
});
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});