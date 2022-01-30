const AQ = require('./gofish/aquarium.js');
const connect = require("./connect.js");

async function stats(option) {

    console.log("Retrieving operation type stats");

    await connect();
    let operation_types = await AQ.OperationType.all();
    let stat_map = {}

    for ( let i=0; i<operation_types.length; i++ ) {
        let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
        let stats = JSON.parse(response.data);
        if (option === "") {
            console.log(`${i}: ${operation_types[i].category}/${operation_types[i].name}`);
            for(const [key,val] of Object.entries(stats)) {
                console.log("\t" + key + ": " + val);
            }
        } else {
            console.log(`Processing ${operation_types[i].category}/${operation_types[i].name}`);
            if ((option === "mr" && stats.last_run) || (option === "md" && stats.done)) {
                stat_map[i] = stats;
            }
        }
    }

    if (option !== "") {
        let sorted_stats = Object.keys(stat_map).map(function(key) {
            return [key, stat_map[key]];
        });

        sorted_stats.sort(function (fst, snd) {
            if (option == "mr") {
                return snd[1].last_run.localeCompare(fst[1].last_run);
            } else {
                return snd[1].done - fst[1].done;
            }
        });

        if (option == "mr") {
            console.log("Retrieving top 10 most recent runs");
        } else {
            console.log("Retrieving top 10 most done runs");
        }

        for ( let i=0; i<10; i++ ) {
            let stats = sorted_stats[i];
            let index = stats[0];
            let stat_data = stats[1];
            console.log(`${i + 1}: ${operation_types[index].category}/${operation_types[index].name}`);
            for(const [key,val] of Object.entries(stat_data)) {
                console.log("\t" + key + ": " + val);
            }
        }
    }
}

module.exports = stats;
