const connect = require("./connect.js");

function stats() {
    console.log("Testing connection ...");
    connect().then(console.log);
}

module.exports = stats;