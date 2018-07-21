module.exports = (app, User, Project) => {
    let username;
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
            execute_scala_stdin_at_once(req, res, dirPath);
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
                res.json(resJson);
            }else if (stdout) {
                console.log(stdout);
                resJson.success = 3;
                resJson.output = stdout;
                console.log(resJson);
                res.json(resJson);
            }

            return;
            });

            child.addListener('exit', () => {
            clearTimeout(to);
            console.log('child exited!');
            });

            let to = setTimeout(()=> {
            child.kill();
            console.log('child killed');
            res.json(resJson);
            return;
            }, 30000); //TODO
        }, 1000);
    }


    function execute_scala_stdin_at_once(req, res, dirPath) {
        setTimeout(function() {
            resJson.output = "";
            let child = child_process.exec(`scala -cp ${dirPath} ${req.body.classname}`, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            });

            child.stdout.on('data', (data) => {
            console.log('stdout!');
            console.log(data);
            resJson.success = 3;
            resJson.output += data;
            });

            child.stderr.on('data', (data) => {
            console.log('stderr!');
            console.log(data);
            resJson.success = 2;
            resJson.output = data;
            res.json(resJson);
            });

            child.stdin.setEncoding('utf-8');
            child.stdin.write(req.body.input);
            child.stdin.end();

            child.addListener('exit', () => {
            clearTimeout(to);
            console.log('child exited!');
            res.json(resJson);
            });

            let to = setTimeout(()=> {
            child.kill();
            console.log('child killed');
            res.json(resJson);
            return;
            }, 30000); //TODO
        }, 1000);
    }
}