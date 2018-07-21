require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}))
http.listen(8080, () => {
  console.log('Server running at 52.231.65.108:8080');
});


app.get('/', (req, res) => {
  req.session.user_id = "a";
  console.log('/');
  res.redirect('/b');
});

app.get('/b', (req, res) => {
  console.log(req.session.user_id);
})