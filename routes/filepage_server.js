module.exports = (app, User, Scalafile) => {
    app.get('/filepage', (req, res) => {
        console.log('filepage')
        res.render('filepage.html');
    })

    app.post('/files-select', (req, res) => { //TODO
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

    
}