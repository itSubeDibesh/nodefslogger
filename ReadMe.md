# nodefslogger
Node fs logger is a lightwaight logger which helps you to keep your logs in a seperate file.

## Dependencies
 - dotenv

 ## Setup
 - Run `npm i nodefslogger`. 
 - Create a `.env` file on root directory.  
 - Add the following details and tweek as per your need aslo found [here](.env.example)
``````
    # Server Loging Configuration Starts
    LOG_DIR = LOGS
    CLEAR_LOGS = false
    SET_JSON = true
    LOG_TO_CONSOLE = true
    # Server Loging Configuration Ends
``````

- `LOG_DIR` will create a directory name assigned on your root directory and all the logs will be stored inside that directory.
- `CLEAR_LOGS` will clear up your logs everytime you restart your server.
- `SET_JSON` will store data in `json` file instead `log` file.
- `LOG_TO_CONSOLE` will print out the logged message on console as well.

## How to use?
At first create a seperate file with js extension and add up following lines in that file.
```
const
    Logger_Core = require('nodefslogger'),
    Debug = () => new Logger_Core('Debug'),
    Error = () => new Logger_Core('Error'),
    Access = () => new Logger_Core('Access'),
    Query = () => new Logger_Core('Query');
module.exports = { Debug, Error, Access, Query }
```
Here we are creating different logger instance to log different categories.
___nodefslogger___ will export a logger module which can be stored on a constant. After storing the module we need to create a new instance of module by passing the name of the file we want to keep our logs in.

Here `Debug, Error, Access and Query` are the different categories of logs so every category has its owne instance and then exported from file so that we can require this logger file to keep our logs.

Now when we need to keep our error log we will require Error from the file. After that we will ask the Error to log datas using `.log()` and pass our log message inside the parenthesis as below.

`````
const { Error } = require('./Logger/Log');

Error.log("Made First Log")
Error.log("Another Log here")
`````

This will append the logged data on `Error.log` or `Error.json` as per your environment variable.

## Warning 
Dont use `nodemon` while your `.env` file has  `SET_JSON = true` as nodemon monitors any changes in json file as well your server would restart time and again the `json` file is updated.