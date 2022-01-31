const Connection = require("./connect.js");

function test() {
    console.log("Testing connection ...");
    let c = new Connection("staging");
    c.connect().then(console.log);
}

module.exports = test;