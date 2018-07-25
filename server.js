require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const session = require('express-session');
//for mongodb
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User;
let Scalafile;

const userSchema = new Schema({
  user_id: String,
  pw: String,
  projectnames: [String],
  shared: [{username:String, projectname:String, filename:String}]
});
User = mongoose.model('User', userSchema);

const scalafileSchema = new Schema({
  user_id: String,
  projectname: String,
  classname: String,
  code: String,
  srcfile: Buffer,
  classfiles: [{title: String, data: Buffer}]
});
Scalafile = mongoose.model('Scalafile', scalafileSchema);

const taskfileSchema = new Schema({
  user_id: String,
  tasknum: String,
  code: String
});
Taskfile = mongoose.model('Taskfile', taskfileSchema);

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

require('./routes/sign_server.js')(app, User, Scalafile);
require('./routes/projectpage_server.js')(app, User, Scalafile);
require('./routes/filepage_server.js')(app, User, Scalafile);
require('./routes/code_manager_server2.js')(app, User, Scalafile, Taskfile);

http.listen(8080, () => {
  console.log('Server running at 52.231.65.108:8080');
});


