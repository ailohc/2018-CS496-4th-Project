module.exports = (app, User, Scalafile) => {

  const fs = require('fs');
  const child_process = require('child_process');

  app.post('/save', (req, res) => {
    console.log('/save request!' + req.body.classname);
    let passdata = {user_id: req.session.user_id,
                      projectname: req.body.projectname,
                      classname: req.body.classname,
                      code: req.body.code};
    rmv_dir(passdata)
    .then(mk_dir)
    .then(save_src)
    //.then(rmv_dir)
    .then(find_filelist)
    .then((filelist) => {
      console.log('below is filelist:')
      console.log(filelist);
      res.json({success: true, filelist: filelist});
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
                    code: req.body.code};
    rmv_dir(passdata)
    .then(mk_dir)
    .then(save_src)
    .then(rmv_dir)
    .then(download_srcfile)
    //.then(compile_singlefile)
    //.then(rmv_dir)
    .then((filelist) => {
      console.log('below is filelist:')
      console.log(filelist);
      res.json({success: true, filelist: filelist});
    })
    .catch((where) => {
      console.log(where);
      res.json({success:false});
    });
  });

  //TODO
  /*
  app.post('/compile-all', (req, res) => {
    console.log('/compile-all request!');
    let passdata = {user_id: req.session.user_id,
                    projectname: req.body.projectname,
                    classname: req.body.classname,
                    code: req.body.code};
    rmv_dir(passdata)
    .then(mk_dir)
    .then((passdata) => {
      return new Promise((resolve, reject) => {
        for ()
      })
    })
  }) */

  function download_srcfile(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let classname = passdata.classname;
      let dirPath = getDirPath(user_id);
      Scalafile.findOne({
        $and: [
        {user_id: user_id},
        {projectname: projectname},
        {classname: classname}
        ]
      }, (err, scalafile) => {
        if (err) {
          console.log(err);
          reject('download_srcfile scalafile.findone');
        } else if (scalafile) {
          let filePath = `${dirPath}/${classname}.scala`
          fs.writeFile(filePath, scalafile.srcfile, 'binary', (err) => {
            if (err) {
              console.log(err);
              reject('download_srcfile fs.writefile');
            } else {
              passdata.scalafile = scalafile;
              resolve(passdata);
            }
          });
        } else {
          reject('download_srcfile srcfile not found');
        }
      });
    });
  }

  function compile_singlefile(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let classname = passdata.classname;
      let scalafile = passdata.scalafile;
      let dirPath = getDirPath(user_id);
      let filePath = `${dirPath}/${classname}.scala`
      child_process.exec(`scalac -cp ${dirPath} ${filePath}`, (err) => {
        if (err) {
          console.log(err);
          reject('compile_singlefile child_process.exec scalac');
        } else {
          scalafile.classfile = fs.readfile(filePath, (err) => {
            if (err) {
              console.log(err);
              reject('compile_singlefile fs.readfile to upload to db');
            } else {
              scalafile.save((err) => {
                if (err) {
                  console.log(err);
                  reject('compile_singlefile scalafile.save');
                } else {
                  resolve(passdata);
                }
              }); //scalafile.save
            }
          }); //fs.readfile : updload classfile to db
        }
      }); //child_process.exec scalac
    });
  }

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
          resolve(new Array());
        } else if (scalafiles.length == 0) {
          resolve(new Array());
        } else {
          let files = new Array();
          for (let i=0; i<scalafiles.length; i++) {
              console.log(scalafiles[i].classname);
              files.push(scalafiles[i].classname);
          }
          resolve(files);
        }
      });
    });
  }

  function rmv_dir(passdata) {
    return new Promise((resolve, reject) => {
      console.log('rmv_dir');
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let dirPath = getDirPath(user_id, projectname);
      fs.stat(dirPath, (err, stats) => {
        if (err) {
          console.log('not exist')
          resolve(passdata);
        } else {
          console.log('exist')
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
      let projectname = passdata.projectname;
      let dirPath = getDirPath(user_id, projectname);
      child_process.exec(`mkdir ${dirPath}`, (err) => {
        if (err) {
          console.log(err);
          reject('mk_dir');
        }
        resolve(passdata);
      })
    })
  }

  function save_src(passdata) {
    return new Promise((resolve, reject) => {
      console.log('save_src');
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let classname = passdata.classname;
      let code = passdata.code;
      let dirPath = getDirPath(user_id, projectname);
      fs.writeFile(`${dirPath}/${classname}.scala`, code, 'utf-8', (err) => {
        if (err) {
          console.log(err);
          reject('save_src_fs.writefile');
        } else {
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
              reject('save_src user.findone');
            } else if (scalafile) {
              savingScalafile = scalafile;
              console.log("overwrite file");
            } else {
              console.log("new file");
              savingScalafile = new Scalafile();
              savingScalafile.user_id = user_id;
              savingScalafile.projectname = projectname;
              savingScalafile.classname = classname;
            }
            savingScalafile.srcfile = fs.readFile(`${dirPath}/${classname}.scala`, (err) => {
              if (err) {
                console.log(err);
                reject('save_src fs.readfile');
              } else {
                savingScalafile.classfile = null;
                savingScalafile.save((err) => {
                if (err) {
                  console.log(err);
                  reject('save_src savingScalafile.save');
                  } else {
                    console.log('save_src success!');
                    resolve(passdata);
                  }
                }); //savingScalafile.save
              }
            }); //fs.readfile
          }); //scalafile.findone
        }
      }); //fs.writefile
    }); //return new promise
  }

  function getDirPath(user_id) {
    return `usertemp/${user_id}`;
  }

  function compile_one(passdata) {
    return new Promise((resolve, reject) => {
      let user_id = passdata.user_id;
      let projectname = passdata.projectname;
      let classname = passdata.classname;
      let dirPath = getDirPath(user_id);
      Scalafile.findOne({
        $and: [
        {user_id: user_id},
        {projectname: projectname},
        {classname: classname}
        ]
      }, (err, scalafile) => {
        if (err) {
          console.log(err);
          reject('compile_one scalafile.findone');
        } else if (scalafile) {
          let filePath = `${dirPath}/${classname}.scala`
          fs.writeFile(filePath, scalafile.srcfile, 'binary', (err) => {
            if (err) {
              console.log(err);
              reject('compile_one fs.writefile');
            } else {
              child_process.exec(`scalac -cp ${dirPath} ${filePath}`, (err) => {
                if (err) {
                  console.log(err);
                  reject('compile_one child_process.exec scalac');
                } else {
                  scalafile.classfile = fs.readfile(filePath, (err) => {
                    if (err) {
                      console.log(err);
                      reject('compile_one fs.readfile to upload to db');
                    } else {
                      scalafile.save((err) => {
                        if (err) {
                          console.log(err);
                          reject('compile_one scalafile.save');
                        } else {
                          resolve(passdata);
                        }
                      }); //scalafile.save
                    }
                  }); //fs.readfile : updload classfile to db
                }
              }); //child_process.exec scalac
            }
          }); //fs.writefile : download srcfile from db
        } else {
          reject('compile_one srcfile not saved'); //unlikely to happen
        }
      });  //scalafile.findone
    }); //return new promise
  }
  
}
