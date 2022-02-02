const AQ = require("./gofish/aquarium.js")
const Connection = require("./connect.js");
const util = require("./util.js")

class Pusher {

  async push() {
    let c = new Connection("staging");
    await c.connect();
    let info = util.info();
    if ( info.type == "Library" ) {
        this.push_code(info, "source", util.contents("source.rb"));
    } else if ( info.type == "OperationType" ) {
        await this.push_code(info, "protocol", util.contents("protocol.rb"));
        await this.push_code(info, "precondition", util.contents("precondition.rb"));
        await this.push_code(info, "test", util.contents("test.rb"));
        await this.push_code(info, "documentation", util.contents("documentation.md"));
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