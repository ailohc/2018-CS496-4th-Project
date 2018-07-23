module.exports = (app, User, Scalafile) => {
    app.get('/filepage', (req, res) => {
        console.log('filepage')
        res.render('filepage.html');
    })

    

    app.post('/files-select', (req, res) => {
        let resJson = new Object();
        resJson.success = false;
        resJson.filename = req.body.filename; 
        Scalafile.findOne({
            $and: [
            {user_id: req.session.user_id},
            {projectname: req.body.projectname},
            {classname: req.body.filename}
            ]
        }, (err, scalafile) => {
            if (err) {
                console.log("scalafile.findone err");
                console.log(err);
                res.json(resJson);
                return;
            } else if (scalafile) {
                console.log("scalafile.findone success!");
                resJson.success = true;
                resJson.code = scalafile.code;
                res.json(resJson);
            } else {
                res.json(resJson);
            }
        });
    });

    
}