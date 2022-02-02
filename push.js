const AQ = require("./gofish/aquarium.js")
const fs = require('fs');
const Connection = require("./connect.js");

class Pusher {

  async push() {
    let c = new Connection("staging");
    await c.connect();
    let info = this.load_info();
    if ( info.type == "Library" ) {
        this.push_code(info, "source", this.contents("source.rb"));
    } else if ( info.type == "OperationType" ) {
        await this.push_code(info, "protocol", this.contents("protocol.rb"));
        await this.push_code(info, "precondition", this.contents("precondition.rb"));
        await this.push_code(info, "test", this.contents("test.rb"));
        await this.push_code(info, "documentation", this.contents("documentation.md"));
    }
  }

  load_info() {
    if ( fs.existsSync("info.json") ) {
        return JSON.parse(fs.readFileSync('info.json'));
    } else {
        throw "Could not read info.json. Are you in a code directory?"
    }
  }

  contents(filename) {
    if ( fs.existsSync(filename) ) {
        return fs.readFileSync(filename, 'utf8');
    } else {
        throw "Could not read '" + filename + "' when pushing."
    }
  }

  push_code(info, name, content) {
    let controller = "";
    if ( info.type === "OperationType") {
        controller = "operation_types";
    } else {
        controller = "libraries";
    }      
    return AQ.post("/" + controller + "/code", {
            id: info.id,
            name: name,
            content: content
          });
  }

}

module.exports = Pusher;