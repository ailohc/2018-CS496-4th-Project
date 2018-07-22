module.exports = (app, User, Project) => {
    app.get('/myprojects', (req, res) => {
        console.log('myprojects!'+req.session.user_id);
        res.render('projectpage.html');
    });

    app.get('/projects', (req, res) => {
        User.findOne({user_id: req.session.user_id}, (err, user) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:false, projects:null});
                return;
            } else if (user) {
                console.log("user.findone success!");
                console.log(user.projectnames[0]);
                res.json({success:true, projects:user.projectnames})
                return;
            } else {
                console.log("user unfound");
                res.json({success:false, projects:null})
                return;
            }
        });
    });

    app.post('/projects-make', (req, res) => { 
        User.findOne({user_id: req.session.user_id}, (err, user) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:false});
                return;
            } else if (user) {
                console.log("user.findone success!");
                Project.find({projectname:req.body.projectname}, (err, projects) => {
                    if (err) {
                        console.log(err);
                        res.json({success:false});
                        return;
                    }
                    if (projects.length > 0) {
                        res.json({success:false});
                        return;
                    }
                    make_project(req, res, user);
                });
            }
        });
    });

    function make_project(req, res, user) {
        //1.make new project
        let project = new Project();
        project.user_id = user.user_id;
        project.projectname = req.body.projectname;
        project.files = new Array();
        project.save((err) => {
            if (err) {
                console.log(err);
                res.json({success:false});
                return;
            }
            //2.update user.projectnames & user.projets
            user.projectnames.push(req.body.projectname);
            user.save((err) => {
                if (err) {
                    console.log(err);
                    res.json({success:false});
                    return;
                }
                console.log('project create success!')
                res.json({success:true, projectname:user.projectnames});
                return;
            }); //user.save
        }); //project.save
    }

    

    app.get('/project-get', (req, res) => {
        let resJson = new Object();
        resJson.success = false;
        resJson.username = req.session.user_id;
        resJson.projectname = req.session.curProjectname;
        Project.findOne({
            $and: [
            {user_id: req.session.user_id},
            {projectname: req.session.curProjectname}
            ]
        }, (err, project) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json(resJson);
                return;
            } else if (project) {
                console.log("project.findone success!");
                let storedFiles = project.files;
                let filenames = new Array();
                for (let i=0; i<storedFiles.length; i++) {
                    filenames.push(storedField[i]);
                }
                resJson.success = true;
                resJson.files = filenames;
                res.json(resJson);
                return;
            } else {
                res.json(resJson);
                return;
            }
        });
    });

    app.post('/files-select', (req, res) => {
        Project.findOne({
            $and: [
            {user_id: req.session.user_id},
            {projectname: req.body.projectname}
            ]
        }, (err, project) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:false, filename:req.body.filename});
                return;
            } else if (project) {
                console.log("project.findone success!");
                let storedFiles = project.files;
                for (let i=0; i<storedFiles.length; i++) {
                    if (storedFiles[i].filename == req.body.filename) {
                        res.json({success:true, filename:req.body.filename, code:storedFiles[i].code});
                        return;
                    }
                }
            }
            res.json({success:false, filename:req.body.filename});
            return;
        });
    });

    app.post('/projects-select', (req, res) => {
        console.log(req.body.projectname);
        req.session.curProjectname = req.body.projectname;
        res.end();
    });


    function copyArray(array) {
        retArray = new Array();
        for (let i=0; i<array.length; i++) {
            retArray.push(array[i]);
        }
        return retArray;
    }
}