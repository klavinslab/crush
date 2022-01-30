const AQ = require("./gofish/aquarium.js")
const fs = require('fs');

function test() {

  console.log("Testing connection ...");

  let config = JSON.parse(fs.readFileSync('config.json'));
  AQ.config.aquarium_url = config.aquarium_url;
  AQ.login(config.username, config.password)
    .then(console.log);

}

module.exports = test;