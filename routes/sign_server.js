module.exports = (app, User, Scalafile) => {
    app.post('/signin', (req, res) => {
        console.log('signin request' + req.body.id);
        User.findOne({user_id: req.body.id}, (err, user) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:0});
                return;
            } else if (user) {
                console.log("user.findone success!");
                res.json({success:2}); //->client post /login_success/:id (as a parameter)
                return;
            } else {
                console.log("user unfound");
                res.json({success:1})
                return;
            }
        });
    });

    app.get('/login_success/:id', (req, res) => { //pass id to session
        let id = req.params.id;
        console.log(`login success / id : ${id}`);
        req.session.user_id = id;
        res.redirect('/myprojects');
    });

    
    app.post('/signup', (req, res) => {
        User.find({id: req.body.id}, (err, users) => {
            if (err) {
                console.log("user.findone err");
                console.log(err);
                res.json({success:0});
                return;
            } else if (users.length > 0) {
                console.log("user.find duplicate!");
                res.json({success:1});
                return;
            } else {
                console.log("user unfound -> successful");
                let user = new User();
                user.user_id = req.body.id;
                user.pw = req.body.pw;
                user.projectnames = new Array();
                user.save((err) => {
                    if (err) {
                        res.json({success:0});
                        return;
                    }
                    console.log(`signup success / id: ${user.user_id}`);
                    req.session.user_id = user.user_id;  //successfully signed up -> automatic login
                    res.json({success:2});
                });
            }
        });
    });

    app.get('/isloggedin', (req, res) => { //pass id to session
        var id = req.session.user_id;
        if (id == null) {
            var loginboolean = false;
        } else {
            var loginboolean = true;
        }
        res.json({isloggedin: loginboolean});
    });

    app.get('/log-out', (req, res) => { //pass id to session
        req.session.destroy();
        //res.render('login.html');
    });

    app.get('/home', (req, res) => { //pass id to session
        res.render('login.html');
    });

}