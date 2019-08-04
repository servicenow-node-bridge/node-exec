var restify = require('restify');

function processNativeScript(req, res, next) {
    let status = "success";
    let result = runScriptInVM(req.body.script, true);
    if (result.error === true) {
        status = "error";
    }
    let myObj = {
        message: status,
        result: result.result
    };
    //res.send(JSON.stringify(myObj));
    res.send(myObj);
    next();
}

function processNodeScript(req, res, next) {
    let status = "success";
    let result = runScriptInVM(req.body.script, false);
    if (result.error === true) {
        status = "error";
    }
    let myObj = {
        message: "success",
        result: result.result
    };
    //res.send(JSON.stringify(myObj));
    res.send(myObj);
    next();
}



var server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.post('/process/native', processNativeScript);
server.post('/process/node', processNodeScript);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});


function runScriptInVM(scriptPayload, native) {
    let vm = null;
    const {
        VM,
        NodeVM,
        VMScript
    } = require('vm2');
    if (native === true) {
        vm = new VM();
    } else {
        let options = {
            require: {
                external: true
            }
        };
        vm = new NodeVM(options);
    }
    //    const script = new VMScript(scriptPayload);
    const script = scriptPayload;
    let result = null;
    let error = false;

    try {
        result = vm.run(script, 'vm.js');
    } catch (e) {
        error = true;
        console.log(e);
        result = e;
    }

    return {
        error: error,
        result: result
    };
}
