const AQ = require('./gofish/aquarium.js');
const connect = require("./connect.js");

async function stats() {

    console.log("Retrieving operation type stats");

    await connect();
    let operation_types = await AQ.OperationType.all();
    
    for ( let i=0; i<operation_types.length; i++ ) {
        let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
        let stats = JSON.parse(response.data);
        console.log(`${i}: ${operation_types[i].category}/${operation_types[i].name}`);
        for(const [key,val] of Object.entries(stats)) {
            console.log("\t" + key + ": " + val);
        }
    }

}

module.exports = stats;
