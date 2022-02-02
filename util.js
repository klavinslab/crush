const fs = require('fs');

function info() {
    if ( fs.existsSync("info.json") ) {
        return JSON.parse(fs.readFileSync('info.json'));
    } else {
        throw "Could not read info.json. Are you in a code directory?"
    }
}

function contents(filename) {
    if ( fs.existsSync(filename) ) {
        return fs.readFileSync(filename, 'utf8');
    } else {
        throw "Could not read '" + filename + "'";
    }
}

module.exports = {
    info,
    contents
};