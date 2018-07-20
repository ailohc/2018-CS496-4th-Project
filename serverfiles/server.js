require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const child_process = require('child_process');
const fs = require('fs');
let username;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
http.listen(8080, () => {
  console.log('Server running at 52.231.65.108:8080');
});

let resJson = new Object(); //{success:boolean, output:string}

app.post("/api/run", (req, res) => { //{classname:string, code:string}
  resJson.success = 0;
  resJson.output = null;
  username = "a"; //TODO
  console.log(req.body);
  rmvDirAndContinue(req, res);
});

function rmvDirAndContinue(req, res) {
  let dirPath = `${username}_dir/`;
  fs.stat(dirPath, (err, stats) => {
    if (!(err && err.errno === 34)) {
      child_process.exec(`rm -r ${dirPath}`, (err) => {
        mkdir_save(req, res, dirPath);
      });
    } else {
      mkdir_save(req, res, dirPath);
    }
  });
}

function mkdir_save(req, res, dirPath) {
  child_process.exec(`mkdir ${dirPath}`, (err) => {
    if (err) {
      console.log(err);
      res.json(resJson);
      return;
    }
    fs.writeFile(`${dirPath}${req.body.classname}.txt`, req.body.code, 'utf8', (err) => {
      if (err) {
        console.log(err);
        res.json(resJson);
        return;
      }
      child_process.exec(`mv ${dirPath}${req.body.classname}.txt ${dirPath}${req.body.classname}.scala`);
      compile_scala(req, res, dirPath);
    });
  });
}

function compile_scala(req, res, dirPath) {
  child_process.exec(`scalac -d ${dirPath} ${dirPath}${req.body.classname}.scala`, (err) => {
    if (err) {
      resJson.success = 1;
      resJson.output = err;
      console.log(err);
      res.json(resJson);
      return;
    }
    execute_scala(req, res, dirPath);
  });
}

function execute_scala(req, res, dirPath) {
  setTimeout(function() {
    let child = child_process.exec(`scala -cp ${dirPath} ${req.body.classname}`, (err, stdout, stderr) => {
      if (err) {
        console.log(err);
      }else if (stderr) {
        console.log(stderr);
        resJson.success = 2;
        resJson.output = stderr;
      }else if (stdout) {
        console.log(stdout);
        resJson.success = 3;
        resJson.output = stdout;
        console.log(resJson);
      }
      res.json(resJson);
      return;
    });
    child.addListener('exit', () => {
      clearTimeout(to);
      console.log('child exited!');
    })

    let to = setTimeout(()=> {
      child.kill();
      console.log('child killed');
      res.json(resJson);
      return;
    }, 30000); //TODO
  }, 1000);
}
