const AQ = require('./gofish/aquarium.js');
const Connection = require("./connect.js");

class Stats {
    constructor() {
        this.operation_types = this.get_operation_types();
    }

    async get_operation_types() {
        let connection = new Connection("staging");
        await connection.connect();
        let operation_types = await AQ.OperationType.all();
        console.log("Retrieving operation type stats");

        for (let i = 0; i < operation_types.length; i++) {
            let response = await AQ.get("/operation_types/"+operation_types[i].id+"/stats");
            let stats = JSON.parse(response.data);
            operation_types[i].stat_data = stats;
            this.show_progress(i, operation_types.length);
        }

        return operation_types;
    }

    async sort_by_most_recent() {
        let operation_types = await this.operation_types;
        operation_types.sort(function (fst, snd) {
            if (!fst.stat_data.last_run) {
                return 1;
            } else if (!snd.stat_data.last_run) {
                return -1;
            } else {
                return snd.stat_data.last_run.localeCompare(fst.stat_data.last_run);
            }
        });

        console.log("\nRetrieving most recent runs");
    }

    async sort_by_most_done() {
        let operation_types = await this.operation_types;
        operation_types.sort(function (fst, snd) {
            if (!fst.stat_data.done) {
                return 1;
            } else if (!snd.stat_data.done) {
                return -1;
            } else {
                return snd.stat_data.done - fst.stat_data.done;
            }
        });

        console.log("\nRetrieving most done runs");
    }

    async display(operation_list) {
        let operations = await operation_list;
        for (let i = 0; i < operations.length; i++) {
            let stats = operations[i].stat_data;
            console.log(`${i + 1}: ${operations[i].category}/${operations[i].name}`);
            for (const [key, val] of Object.entries(stats)) {
                console.log("\t" + key + ": " + val);
            }
        }
    }

    show_progress(i, n) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("Progress: " + Math.ceil(100*i/n) + "%");
    }

    async all() {
        return await this.operation_types;
    }

    async top(n) {
        let operation_types = await this.operation_types;
        return operation_types.slice(0, n);
    }
}

module.exports = Stats;