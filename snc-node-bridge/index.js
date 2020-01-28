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
    
    res.send(myObj);
    next();
}

function processNodeScript(req, res, next) {
    let status = "success";
    let result = runScriptInVM(req.body.script, false, req.body.log_sys_id, req.body.data);
    if (result.error === true) {
        status = "error";
    }
    let myObj = {
        message: "success",
        result: result.result
    };

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


function runScriptInVM(scriptPayload, native, logID, data) {
    let vm = null;
    const {
        VM,
        NodeVM,
        VMScript
    } = require('vm2');
    if (native === true) {
        vm = new VM();
    } else {
        const _getLogID = () => logID;
        const _getData = () => data;
        let options = {
            sandbox: {
                _getLogID,
                _getData
            },
            require: {
                external: true,
                builtin: ['fs', 'path', 'util'],
                root: './',
            }
        };
        vm = new NodeVM(options);
    }
    
    const script = scriptPayload;
    let result;
    let error = false;

    try {
        result = vm.run(script, 'vm.js');
    } catch (e) {
        error = true;
        result = {message: e.toString(), stack: e.stack};
    }

    return {
        error: error,
        result: result
    };
}
