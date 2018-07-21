module.exports = (app, User, Project) => {
    app.get('/mypage', (req, res) => {
        console.log('mypage!'+req.session.user_id);
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
                    user.projectnames.push(req.body.projectname); //TODO: will this work..?
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
        });
    })

    app.post('/files', (req, res) => {
        Project.findOne({
            $and: [
            {user_id: req.session.user_id},
            {projectname: req.body.projectname}
            ]
        }, (err, project) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:false});
                return;
            } else if (project) {
                console.log("project.findone success!");
                let storedFiles = project.files;
                let filenames = new Array();
                for (let i=0; i<storedFiles.length; i++) {
                    filenames.push(storedField[i]);
                }
                res.json({success:true, files:filenames});
                return;
            } else {
                res.json({success:false});
                return;
            }
        });
    });

    app.post('/files-select', (req, res) => {

    });

    function copyArray(array) {
        retArray = new Array();
        for (let i=0; i<array.length; i++) {
            retArray.push(array[i]);
        }
        return retArray;
    }
}