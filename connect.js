const AQ = require("./gofish/aquarium.js")
const fs = require('fs');

function connect() {

    let config = JSON.parse(fs.readFileSync('config.json'));
    AQ.config.aquarium_url = config.aquarium_url;
    return AQ.login(config.username, config.password);

}

module.exports = connect;