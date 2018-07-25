module.exports = (app, User, Scalafile, Taskfile) => {

  const fs = require('fs');
  const child_process = require('child_process');
  const glob = require('glob');

  app.post('/task-select', (req, res) => {
    Taskfile.findOne({
      $and: [
      {user_id: req.session.user_id},
      {tasknum: req.body.tasknum}
      ]
    }, (err, taskfile) => {
      if (err) {
        console.log(err);
        res.json({success: false});
        return;
      }
      let code = fs.readFileSync(`tasksrc/skeleton_${req.body.tasknum}.txt`, 'utf-8');
      if (taskfile && taskfile.code != null){
        code = taskfile.code;
      }
      res.json({success: true, code: code});
      return;
    });
  });

  app.post('/task-save', (req, res) => {
    Taskfile.findOne({
      $and: [
        {user_id: req.session.user_id},
        {tasknum: req.body.tasknum}
        ]
    }, (err, taskfile) => {
      if (err) {
        console.log(err);
        res.json({success: false});
        return;
      }
      let savingTaskfile;
      if (taskfile) {
        savingTaskfile = taskfile;
      } else {
        savingTaskfile = new Taskfile();
        savingTaskfile.user_id = req.session.user_id;
        savingTaskfile.tasknum = req.body.tasknum;
      }
      savingTaskfile.code = req.body.code;
      savingTaskfile.save((err) => {
        if (err) {
          console.log(err);
          res.json({success: false});
          return;
        }
        res.json({success: true});
        return;
      });
    });
  });

  app.post('/task-run', (req, res) => {
    let passdata = {
      user_id: req.session.user_id,
      classname: getClassName(req.body.tasknum),
      code: req.body.code,
      output: "",
      success: 0
    };
    rmv_dir(passdata)
    .then(mk_dir)
    .then(write_temp)
    .then(src_compile)
    .then(task_run)
    //.then(rmv_dir)
    .then((passdata) => {
      res.json({success: passdata.success, output: passdata.output});
    })
    .catch((where) => {
      console.log(where);
      res.json({success: passdata.success, output: passdata.output});
    })
  });

  app.post('/task-submit', (req, res) => {
    let passdata = {
      user_id: req.session.user_id,
      classname: getClassName(req.body.tasknum),
      checkername: getCheckerName(req.body.tasknum),
      code: req.body.code,
      testpass: 0,
      success: 0
    };
    rmv_dir(passdata)
    .then(mk_dir)
    .then(write_temp)
    .then(cp_checker) 
    .then(compile_all) 
    .then(submit_run)
    //.then(rmv_dir)
    .then((passdata) => {
      res.json({success:passdata.success, testpass:passdata.testpass});
    })
    .catch((where) => {
      res.json({success:passdata.success, testpass:passdata.testpass});
    })
  });

  function cp_checker(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let checkername = passdata.checkername;
      let dirPath = getDirPath(user_id);
      let checkerPath = `tasksrc/${checkername}.scala`
      child_process.exec(`cp ${checkerPath} ${dirPath}`, (err) => {
        if (err) {
          console.log(err);
          reject('cp_checker err');
        } else {
          resolve(passdata);
        }
      })
    });
  }

  function compile_all(passdata) {
    return new Promise((resolve, reject) => {
      let dirPath = getDirPath(passdata.user_id);
      child_process.exec(`find ${dirPath} -name *.scala > ${dirPath}sources_list.txt`, (err) => {
        if (err) {
          console.log(err);
          reject('compile_all find .scala err');
        } else {
          child_process.exec(`scalac -d ${dirPath} -cp ${dirPath} @${dirPath}sources_list.txt`, (err) => {
            if (err) {
              console.log(err);
              reject('compile_all scalac err');
            } else {
              resolve(passdata);
            }
          });
        }
      });
    });
  }

  function submit_run(passdata) {
    return new Promise((resolve, reject) => {
      let dirPath = getDirPath(passdata.user_id);
      let checkername = passdata.checkername;
      let child = child_process.exec(`scala -cp ${dirPath} ${checkername}`, (err) => {
        if (err) {
          console.log(err);
          //reject('class_run child_process.exec err');
        }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data);
        passdata.success = 2;
        passdata.testpass = data.trim();
        resolve(passdata);
      });

      child.stderr.on('data', (data) => {
        console.log(data);
        passdata.success = 1;
      });

      child.addListener('exit', () => {
        clearTimeout(to);
        console.log('child exited!');
        resolve(passdata);
      });

      let to = setTimeout(()=> {
        child.kill();
        console.log('child killed');
        passdata.success = 1;
      }, 30000);
    });
  }

  function getClassName(tasknum) {
    return `Task${tasknum}`
  }

  function getCheckerName(tasknum) {
    return `Checker${tasknum}`
  }

  function task_run(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let  classname = passdata.classname;
      let dirPath = getDirPath(user_id);
      let child = child_process.exec(`scala -cp ${dirPath} ${classname}`, (err) => {
        if (err) {
          console.log(err);
          //reject('class_run child_process.exec err');
        }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data);
        passdata.success = 2;
        passdata.output += data;
      });

      child.stderr.on('data', (data) => {
        console.log(data);
        passdata.success = 1;
        passdata.output += data;
      });

      child.addListener('exit', () => {
        clearTimeout(to);
        console.log('child exited!');
        if (passdata.success != 1) {
          passdata.success = 2;
        }
        resolve(passdata);
      });

      let to = setTimeout(()=> {
        child.kill();
        console.log('child killed');
        passdata.success = 1;
        resolve(passdata);
      }, 30000);
    });
  }

  app.post('/save', (req, res) => {
    console.log('/save request!');
    let passdata = {user_id: req.session.user_id,
                    projectname: req.body.projectname,
                    classname: req.body.classname,
                    code: req.body.code,
                    filelist: new Array()
                    };
    rmv_dir(passdata)
    .then(mk_dir)
    .then(write_temp)
    .then(upload_db_src)
    .then(rmv_dir)
    .then(find_filelist)
    .then((passdata) => {
      console.log('below is filelist:');
      console.log(passdata.filelist);
      res.json({success: true, filelist: passdata.filelist});
    })
    .catch((where) => {
      console.log(where);
      res.json({success:false});
    });
  });

  

  // req{projectname: string, classname: string, code:string}
  // res{success:boolean, output:string, filelist:array[string]}
  app.post('/compile-one', (req, res) => {
    console.log('/compile-one request!');
    let passdata = {user_id: req.session.user_id,
                    projectname: req.body.projectname,
                    classname: req.body.classname,
                    code: req.body.code,
                    output: "",
                    success: 0,
                    filelist: new Array()
                  };
    rmv_dir(passdata)
    .then(mk_dir)
    .then(write_temp)
    .then(upload_db_src)
    .then(src_compile)
    .then(upload_db_class)
    .then(rmv_dir)
    .then(find_filelist)
    .then((passdata) => {
      console.log('below is filelist:')
      console.log(passdata.filelist);
      res.json({success: passdata.success, output: passdata.output, filelist: passdata.filelist});
    })
    .catch((where) => {
      console.log(where);
      res.json({success:false, output: passdata.output});
    });
  });


  app.post('/run', (req, res)=> {
    console.log('/run request!');
    let passdata = {user_id: req.session.user_id,
                    projectname: req.body.projectname,
                    classname: req.body.classname,
                    input: req.body.input,
                    success: 0,
                    output: "",
                    filelist: new Array()
                  };
    rmv_dir(passdata)
    .then(mk_dir)
    .then(donwload_db_classes)
    .then(class_run)
    .then(rmv_dir)
    .then(find_filelist)
    .then((passdata) => {
      console.log('below is filelist:')
      console.log(passdata.filelist);
      res.json({success: passdata.success, output: passdata.output, filelist: passdata.filelist});
    })
    .catch((where) => {
      console.log(where);
      res.json({success: passdata.success});
    });
  });

  app.post('/file-delete', (req, res) => {
    Scalafile.deleteOne({
      $and: [
      {user_id: req.session.user_id},
      {projectname: req.body.projectname},
      {classname: req.body.filename}
      ]
    }, (err) => {
      if (err) {
        console.log(err);
        res.json({success: false});
        return;
      }
      res.json({success: true});
      return;
    });
  });

  
  function find_filelist(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      Scalafile.find({
        $and: [
        {user_id: user_id},
        {projectname: projectname}
        ]
      }, (err, scalafiles) => {
        if (err) {
          console.log("find_filelist user.findone err");
          console.log(err);
          resolve(passdata);
        } else if (scalafiles.length == 0) {
          resolve(passdata);
        } else {
          let files = new Array();
          for (let i=0; i<scalafiles.length; i++) {
              console.log(scalafiles[i].classname);
              files.push(scalafiles[i].classname);
          }
          passdata.filelist = files;
          resolve(passdata);
        }
      });
    });
  }

  function rmv_dir(passdata) {
    return new Promise((resolve, reject) => {
      console.log('rmv_dir');
      let user_id = passdata.user_id;
      let dirPath = getDirPath(user_id);
      fs.stat(dirPath, (err, stats) => {
        if (err) {
          console.log(`${dirPath} not exist`);
          resolve(passdata);
        } else {
          console.log(`${dirPath} exist`);
          child_process.exec(`rm -r ${dirPath}`, (err) => {
            if (err) {
              console.log(err);
              reject();
            }
            resolve(passdata);
          });
        }
      });
    });
  }

  function mk_dir(passdata) {
    return new Promise((resolve, reject) => {
      console.log('mk_dir');
      let user_id = passdata.user_id;
      let dirPath = getDirPath(user_id);
      child_process.exec(`mkdir ${dirPath}`, (err) => {
        if (err) {
          console.log(err);
          reject('mk_dir');
        }
        resolve(passdata);
      })
    })
  }

  function write_temp(passdata) {
    return new Promise((resolve, reject) => {
      console.log('write_temp');
      let user_id = passdata.user_id;
      let classname = passdata.classname;
      let code = passdata.code;
      let dirPath = getDirPath(user_id);
      fs.writeFile(`${dirPath}/${classname}.scala`, code, 'utf-8', (err) => {
        if (err) {
          console.log(err);
          reject('write_temp fs.writefile');
        } else {
          resolve(passdata);
        }
      });
    });
  }

  function upload_db_src(passdata) {
    return new Promise((resolve, reject) => {
      console.log('upload_db_src');
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let classname = passdata.classname;
      let code = passdata.code;
      let dirPath = getDirPath(user_id);
      Scalafile.findOne({
        $and: [
        {user_id: user_id},
        {projectname: projectname},
        {classname: classname}
        ]
      }, (err, scalafile) => {
        let savingScalafile;
        if (err) {
          console.log(err);
          reject('upload_db_src user.findone');
        } else if (scalafile) {
          savingScalafile = scalafile;
          console.log("overwrite db upload file");
        } else {
          console.log("new db upload file");
          savingScalafile = new Scalafile();
          savingScalafile.user_id = user_id;
          savingScalafile.projectname = projectname;
          savingScalafile.classname = classname;
        }
        savingScalafile.code = code;
        savingScalafile.srcfile = fs.readFileSync(`${dirPath}/${classname}.scala`);
        savingScalafile.classfiles = new Array();
        savingScalafile.save((err) => {
        if (err) {
          console.log(err);
          reject('upload_db_src savingScalafile.save');
          } else {
            console.log('upload_db_src success!');
            passdata.scalafile = savingScalafile;
            resolve(passdata);
          }
        }); //savingScalafile.save  
      }); //scalafile.findone
    });
  }

  

  function src_compile(passdata) {
    return new Promise((resolve, reject) => {
      console.log('src_compile');
      let user_id = passdata.user_id;
      let classname = passdata.classname;
      let dirPath = getDirPath(user_id);
      let filePath = `${dirPath}/${classname}.scala`
      let child = child_process.exec(`scalac -d ${dirPath} ${filePath}`, (err) => {
        if (err) {
          console.log('err');
          //reject('src_compile err');
        }
      });

      child.stderr.on('data', (data) => {
        passdata.success = 1;
        passdata.output += data;
        //console.log(data);
      });
    
      child.addListener('exit', () => {
        console.log('exit');
        resolve(passdata);
      });
    });
  }

  function upload_db_class(passdata) {
    return new Promise((resolve, reject) => {
      console.log('upload_db_class');
      if (passdata.compile_err != null) {
        resolve(passdata);
      } else {
        let user_id = passdata.user_id;
        let classname = passdata.classname;
        let scalafile = passdata.scalafile;
        let dirPath = getDirPath(user_id);
        let classfileTitles = glob.sync(`${dirPath}/*.class`, {});
        console.log(classfileTitles);
        for (let i=0; i<classfileTitles.length; i++) {
          let title = classfileTitles[i];
          let data = fs.readFileSync(title);
          console.log(title);
          scalafile.classfiles.push({title: title, data: data});
        }
        scalafile.save((err) => {
          if (err) {
            console.log(err);
            reject('upload_db_class scalafile.save');
          } else {
            if (passdata.success != 1) passdata.success = 2;
            resolve(passdata);
          }
        }); //scalafile.save
      }
    });
  }

  function donwload_db_classes(passdata) {
    return new Promise((resolve, reject) => {
      console.log('download_db_classes');
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let classname = passdata.classname;
      let input = passdata.input;
      let dirPath = getDirPath(user_id);
      Scalafile.find({
        $and: [
        {user_id: user_id},
        {projectname: projectname},
        {classname: classname}
        ]
      }, (err, scalafiles) => {
        if (err) {
          console.log(err);
          reject('download_db_classes scalafile.findone db err');
        } else if (scalafiles.length == 0) {
          reject('download_db_classes unknown project');
        } else {
          for (let i=0; i<scalafiles.length; i++) {
            let classfiles = scalafiles[i].classfiles;
            for (let j=0; j<classfiles.length; j++)  {
              console.log(classfiles[j].title);
              fs.writeFileSync(classfiles[j].title, classfiles[j].data, 'binary');
            }
          }
          resolve(passdata);
        }
      });
    });
  }

  function class_run(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let classname = passdata.classname;
      let input = passdata.input;
      let dirPath = getDirPath(user_id);
      let child = child_process.exec(`scala -cp ${dirPath} ${classname}`, (err) => {
        if (err) {
          console.log(err);
          if (passdata.success != 1) {
            passdata.success = 2;
          }
          reject('class_run child_process.exec err');
        }
      });
      
      child.stdout.on('data', (data) => {
        console.log(data);
        passdata.success = 2;
        passdata.output += data;
      });

      child.stderr.on('data', (data) => {
        console.log(data);
        passdata.success = 1;
        passdata.output += data;
      });

      child.stdin.setEncoding('utf-8');
      child.stdin.write(input);
      child.stdin.end();

      child.addListener('exit', () => {
        clearTimeout(to);
        console.log('child exited!');
        resolve(passdata);
      });

      let to = setTimeout(()=> {
        child.kill();
        console.log('child killed');
        passdata.success = 1;
        resolve(passdata);
      }, 30000);
    });
  }

  
  function getDirPath(user_id) {
    return `usertemp/${user_id}`;
  }
}