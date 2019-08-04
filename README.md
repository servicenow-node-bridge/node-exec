# node-exec
This is the docker container for running the self-hosted nodejs instance

This is the self-hosted NodeJS instance which will run your code that you have written on your Servicenow Instance.

To use this, download the zipball/tarball or clone the repo, cd to the directory snc-node-bridge and run these commands
```
yarn
yarn start
```

This will install `restify` and `vm2`. Restify is used for the minimal REST api and vm2 is used for sandboxing.
This is just the base, now you can run Native or NodeJS code sent to this NodeJS instance. If you want to use any custom modules that are not installed, you have to install them manually.

So if someone would like to use the `faker` package, you would need to cd to `snc-node-bridge` and run `yarn add faker` in the folder and then the sent scripts that are using `faker` will be correctly executed.

If you have any issues or improvements, feel free to open an issue or a pull request.
