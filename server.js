require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const child_process = require('child_process');
const fs = require('fs');
const session = require('express-session');
//for mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User;
let Project;

const projectSchema = new Schema({
  user_id: String,
  projectname: String,
  files: [{
    filename: String,
    code: String
  }]
})
Project = mongoose.model('Project', projectSchema);

const userSchema = new Schema({
  user_id: String,
  pw: String,
  projectnames: [String]
});
User = mongoose.model('User', userSchema);

const db = mongoose.connection;
db.on('error',console.error);
db.once('open', () => {
  console.log('Connected to MongoDB server');
});
mongoose.connect('mongodb://localhost/');

app.use(express.static('view'));
app.set('views', `${__dirname}/view`);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.render('login.html');
});

require('./routes/run_server.js')(app, User, Project);
require('./routes/home_server.js')(app, User);
require('./routes/coding_server.js')(app, User, Project);

http.listen(8080, () => {
  console.log('Server running at 52.231.65.108:8080');
});


