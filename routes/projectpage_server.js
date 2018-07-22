module.exports = (app, User, Scalafile) => {
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
        let resJson = new Object();
        resJson.success = false;
        User.findOne({user_id: req.session.user_id}, (err, user) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json(resJson);
                return;
            } else if (user) {
                console.log("user.findone success!");
                user.projectnames.push(req.body.projectname);
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        res.json(resJson);
                        return;
                    }
                    resJson.success = true;
                    resJson.projectname = user.projectnames;
                    res.json(resJson);
                    return;
                });
            } else {
                res.json(resJson);
                return;
            }
        });
    });
    

    app.get('/project-get', (req, res) => { 
        let resJson = new Object();
        resJson.success = false;
        resJson.username = req.session.user_id;
        resJson.projectname = req.session.curProjectname;
        Scalafile.find({
            $and: [
            {user_id: req.session.user_id},
            {projectname: req.session.curProjectname}
            ]
        }, (err, scalafiles) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json(resJson);
                return;
            } else if (scalafiles.length == 0) {
                resJson.files = new Array();
                res.json(resJson);
                return;
            } else {
                let files = new Array();
                for (let i=0; i<scalafiles.length; i++) {
                    files.push(scalafiles[i].classname);
                }
                resJson.files = files;
                res.json(resJson);
                return;
            }
        });
    });

    app.post('/projects-select', (req, res) => {
        console.log(req.body.projectname);
        req.session.curProjectname = req.body.projectname;
        res.end();
    });
}