// Initialize Environment Variable
require('dotenv').config();
const
    fs = require('fs'),
    moment = require('moment'),
    { SET_JSON, LOG_TO_CONSOLE, CLEAR_LOGS, LOG_DIR } = process.env,

    /**
     * Converts string to bolean if value is true 
     * @param {string} arg
     */
    string_to_boolean = (arg) => arg.toLocaleLowerCase() == 'true',

    Set_Json = string_to_boolean(SET_JSON),
    Clear_Logs = string_to_boolean(CLEAR_LOGS),
    Log_To_Console = string_to_boolean(LOG_TO_CONSOLE),

    /**
    * Checks if the file or directory exists
    * @param {string} file_dir -> Path for file or directory 
    * @param {function} callback -> sends result as calback function
    */
    file_dir_exists = (file_dir, callback) => fs.stat(process.cwd() + file_dir, (err) => err ? callback({ result: false }) : callback({ result: true })),

    /**
     * Creates directory
     * @param {string} dirpath -> Path to directory
     * @param {function} callback -> sends result as object using callback function
     */
    mkdir = (dirpath, callback) => fs.mkdir(process.cwd() + dirpath, { recursive: true }, (error) => !error ? callback({ result: true, message: 'Directory created successfully' }) : callback({ result: false, message: 'Error occured', error })),

    /**
     * Creates .json File and write message as well
     * @param {string} file_name -> File Name
     * @param {string} file_with_dir -> Path to file with directory
     * @param {string} message -> message to append
     * @param {function} callback -> sends result as object using callback function
     */
    create_json_File = (file_name, file_with_dir, message, callback) => {
        let Json_log = { Logs: [] };
        Json_log.Logs.push({ Log_Type: file_name, Date: moment(), Message: message });
        fs.writeFile(process.cwd() + file_with_dir, JSON.stringify(Json_log), "utf8", (error) => !error ? callback({ result: true, message: 'File Created successfully' }) : callback({ result: false, message: 'Error occured', error }))
    },

    /**
     * Appends data to .json file
     * @param {string} file_name -> File Name
     * @param {string} file_with_dir -> Path to file with directory
     * @param {string} message -> message to append
     * @param {function} callback -> sends result as object using callback function
     */
    append_to_json_file = (file_name, file_with_dir, message, callback) => {
        fs.readFile(process.cwd() + file_with_dir, "utf8", (err, data) => {
            if (err) console_error(err);
            else {
                if (data.length != 0) {
                    data = JSON.parse(data);
                    data.Logs.push({ Log_Type: file_name, Date: moment(), Message: message });
                    fs.writeFile(process.cwd() + file_with_dir, JSON.stringify(data), "utf8", (error) => !error ? callback({ result: true, message: 'Data append successfully' }) : callback({ result: false, message: 'Error occured', error }));
                } else create_json_File(file_name, file_with_dir, message, callback);
            }
        })
    },

    /**
     * Clears out the .json file
     * @param {string} file_with_dir -> Path to file with directory
     * @param {function} callback -> sends result as object using callback function
     */
    clear_json_data = (file_with_dir, callback) => fs.truncate(process.cwd() + file_with_dir, 0, () => callback({ result: true, message: `Data removed successfully from ${file_with_dir.split('\\')[2]} file.` })),

    /**
    * Creates .log File and append message as well
    * @param {string} file_name -> File Name
    * @param {string} file_with_dir -> Path to file with directory
    * @param {string} message -> message to append
    * @param {function} callback -> sends result as object using callback function
    */
    create_log_File = (file_name, file_with_dir, message, callback) => fs.writeFile(process.cwd() + file_with_dir, `${file_name} LOG : ${moment()} ${message} \n`, (error) => !error ? callback({ result: true, message: 'File Created successfully' }) : callback({ result: false, message: 'Error occured', error })),

    /**
     * Appends data to .log file
     * @param {string} file_name -> ँषिभ ल्बफभ
     * @param {string} file_with_dir -> Path to file with directory
     * @param {string} message -> message to append
     * @param {function} callback -> sends result as object using callback function
     */
    append_to_log_file = (file_name, file_with_dir, message, callback) => fs.appendFile(process.cwd() + file_with_dir, `${file_name} LOG : ${moment()} ${message} \n`, (error) => !error ? callback({ result: true, message: 'Data append successfully' }) : callback({ result: false, message: 'Error occured', error })),

    /**
     * Clears out the .log file
     * @param {string} file_with_dir -> Path to file with directory
     * @param {function} callback -> sends result as object using callback function
     */
    clear_log_data = (file_with_dir, callback) => fs.truncate(process.cwd() + file_with_dir, 0, () => callback({ result: true, message: `Data removed successfully from ${file_with_dir.split('\\')[2]} file.` })),

    /**
     * Logs out error
     * @param {object} response 
     */
    console_error = (response) => {
        console.log(response.error);
        console.error(response.error);
    },

    /**
     * Appends to .log file
     * @param {string} file_name 
     * @param {string} file 
     * @param {string} error 
     */
    append_log = (file_name, file, message) => append_to_log_file(file_name, file, message, (response) => { if (!response.result) console_error(response) }),

    /**
     * Appends to .json file
     * @param {string} file_name 
     * @param {string} file 
     * @param {string} error 
     */
    append_json = (file_name, file, message) => append_to_json_file(file_name, file, message, (response) => { if (!response.result) console_error(response) }),

    /**
     * Returns File Name
     * @param {string} file 
     */
    file_extension = () => Set_Json ? '.json' : '.log';

/**
 * Logger Core Class - @version 0.0.1
 * 
 * Made with ❤️ by Dibesh Raj Subedi
 * 
 * Creates a logs and saves on file
 */
module.exports = class Logger_Core {
    /**
     * Log data to file
     * @param {string} file_name 
     */
    constructor(file_name) {
        // Initializing Environment Variable
        this.file_name = file_name;
        this.dir = `\\${LOG_DIR}\\${this.file_name.toUpperCase()}\\`;
        this.file = this.dir + this.file_name + file_extension();
        // Clears Out Logs if set true
        if (Clear_Logs) this.clear();
    }
    /**
     * Clears out the log file data if true is send as param
     * @param {boolean} clear -> default false 
     */
    clear(show = false) {
        if (!Set_Json)
            clear_log_data(this.file, (response) => { if (show) if (response.result) console.log(response.message); });
        else
            clear_json_data(this.file, (response) => { if (show) if (response.result) console.log(response.message); });
    }

    /**
     * Logs error to file
     */
    log() {
        let info = [...arguments];
        info.forEach((messag) => {
            // Check if Set Json true
            file_dir_exists(this.file, (response) => {
                if (!Set_Json) {
                    // File Dir exists append error
                    if (response.result) append_log(this.file_name.toUpperCase(), this.file, messag); else {
                        // Create dir, file and append error
                        mkdir(this.dir, (resp) => {
                            if (resp.result) {
                                // Create file and append error
                                create_log_File(this.file_name.toUpperCase(), this.file, messag, (res) => {
                                    if (!res.result) console_error(res);
                                });
                            } else console_error(resp);
                        });
                    }
                } else {
                    // File Dir exists append error
                    if (response.result) append_json(this.file_name.toUpperCase(), this.file, messag);
                    else {
                        // Create dir, file and append error
                        mkdir(this.dir, (resp) => {
                            if (resp.result) {
                                // Create file and append error
                                create_json_File(this.file_name.toUpperCase(), this.file, messag, (res) => {
                                    if (!res.result) console_error(res);
                                });
                            } else console_error(resp);
                        });
                    }
                }

                // Checks If log to console is true
                if (Log_To_Console)
                    console.log(`${this.file_name.toUpperCase()} LOG : ${moment()} ${messag}`);
            });
        });
    }

    /**
     * Returns json Object from file if it exists
     * @param {function} callback 
     */
    get_json(callback) {
        if (!Set_Json) return callback({ result: !1, response: 'SET_JSON is not enabled on Environment!' });
        else {
            fs.readFile(process.cwd() + this.file, 'utf8', (err, data) => {
                if (err) console.error(err);
                else {
                    if (data.length != 0)
                        return callback({ result: !0, response: data })
                }
            });
        }
    }

}