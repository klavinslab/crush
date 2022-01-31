const AQ = require("./gofish/aquarium.js")
const fs = require('fs');

class Connection {

    constructor(instance_name) {
        this.instance_name = instance_name;
    }

    connect() {
        this.config = JSON.parse(fs.readFileSync('config.json'));
        if ( !this.config.instances[this.instance_name]) {
            throw "Instance name '" + this.instance_name + "' not found in config.json";
        }
        this.config = this.config.instances[this.instance_name];
        AQ.config.aquarium_url = this.config.url
        return AQ.login(this.config.username, this.config.password);
    }

}

module.exports = Connection;