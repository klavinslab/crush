const AQ = require("./gofish/aquarium");
const Connection = require("./connect.js");
const fs = require('fs');
const util = require("./util");
const ejs = require("ejs");

class Tester {

    constructor() {
        this.results = {};
    }

    async run() {
        let c = new Connection("staging");
        await c.connect();
        let info = util.info();
        if ( info.type == "OperationType" ) {
            this.result = await AQ.get("/test/run/" + info.id);
            this.result = JSON.parse(this.result.data);
        } else {
            throw "Testing libraries directly is not supported";
        }
    }

    report() {
          let path = "/home/crush/templates/test.md"
          ejs.renderFile(
            path,
            { results: this.result },
            { filename: path },
            function(err, str) {
              fs.writeFileSync("results.md", str);
            }
          );

    }

}

module.exports = Tester;