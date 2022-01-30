const AQ = require('./gofish/aquarium.js');
const connect = require("./connect.js");

async function stats() {
    let operation_types = await get_operation_types();

    for (let i = 0; i < operation_types.length; i++) {
        let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
        let stats = JSON.parse(response.data);
        console.log(`${i}: ${operation_types[i].category}/${operation_types[i].name}`);
        for (const [key, val] of Object.entries(stats)) {
            console.log("\t" + key + ": " + val);
        }
    }
}

async function most_recent() {
    let operation_types = await get_operation_types();
    let stat_map = {};

    for (let i = 0; i < operation_types.length; i++) {
        let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
        let stats = JSON.parse(response.data);
        console.log(`Processing ${operation_types[i].category}/${operation_types[i].name}`);
        if (stats.last_run) {
            stat_map[i] = stats;
        }
    }

    let sorted_stats = Object.keys(stat_map).map(function(key) {
        return [key, stat_map[key]];
    });

    sorted_stats.sort(function (fst, snd) {
        return snd[1].last_run.localeCompare(fst[1].last_run);
    });

    console.log("Retrieving top 10 most recent runs");

    print_top_10(operation_types, sorted_stats);
}

async function most_done() {
    let operation_types = await get_operation_types();
    let stat_map = {};

    for (let i = 0; i < operation_types.length; i++) {
        let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
        let stats = JSON.parse(response.data);
        console.log(`Processing ${operation_types[i].category}/${operation_types[i].name}`);
        if (stats.done) {
            stat_map[i] = stats;
        }
    }

    let sorted_stats = Object.keys(stat_map).map(function(key) {
        return [key, stat_map[key]];
    });

    sorted_stats.sort(function (fst, snd) {
        return snd[1].done - fst[1].done;
    });

    console.log("Retrieving top 10 most done runs");

    print_top_10(operation_types, sorted_stats);
}

function print_top_10(operation_types, sorted_stats) {
    for (let i = 0; i < 10; i++) {
        let stats = sorted_stats[i];
        let index = stats[0];
        let stat_data = stats[1];
        console.log(`${i + 1}: ${operation_types[index].category}/${operation_types[index].name}`);
        for(const [key,val] of Object.entries(stat_data)) {
            console.log("\t" + key + ": " + val);
        }
    }
}

async function get_operation_types () {
    console.log("Retrieving operation type stats");
    await connect();
    let operation_types = await AQ.OperationType.all();
    return operation_types;
}

module.exports = {stats, most_done, most_recent};
