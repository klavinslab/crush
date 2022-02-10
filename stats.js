const AQ = require('./gofish/aquarium.js');
const Connection = require("./connect.js");

class Stats {
    // Creates a new Stats object with empty operation types (for now).
    constructor() {
        this.operation_types = [];
    }

    // Gets all the operation types and stats from the data base and stores them.
    async get_operation_types() {
        let connection = new Connection("staging");
        await connection.connect();
        this.operation_types = await AQ.OperationType.all();
        console.log("Retrieving operation type stats");

        for (let i = 0; i < this.operation_types.length; i++) {
            let response = await AQ.get("/operation_types/"+this.operation_types[i].id+"/stats");
            let stats = JSON.parse(response.data);
            this.operation_types[i].stat_data = stats;
            this.show_progress(i, this.operation_types.length);
        }
    }

    // Sorts the operation types where the most recently run operation type is first
    // and the least recently run operation type is last.
    sort_by_most_recent() {
        this.operation_types.sort(function (fst, snd) {
            if (!fst.stat_data.last_run) {
                return 1;
            } else if (!snd.stat_data.last_run) {
                return -1;
            } else {
                return snd.stat_data.last_run.localeCompare(fst.stat_data.last_run);
            }
        });
    }

    // Sorts the operation types where the operation type that has been done the most
    // amount of times is first and the operation type that has been done the least
    // amount of times is last.
    sort_by_most_done() {
        this.operation_types.sort(function (fst, snd) {
            if (!fst.stat_data.done) {
                return 1;
            } else if (!snd.stat_data.done) {
                return -1;
            } else {
                return snd.stat_data.done - fst.stat_data.done;
            }
        });
    }

    // Prints the top n operation types and stats to the console.
    display(n) {
        // Prints empty line before displaying to separate from progress line.
        console.log();
        for (let i = 0; i < Math.min(n,this.operation_types.length); i++) {
            let stats = this.operation_types[i].stat_data;
            console.log(`${i + 1}: ${this.operation_types[i].category}/${this.operation_types[i].name}`);
            for (const [key, val] of Object.entries(stats)) {
                console.log("\t" + key + ": " + val);
            }
        }
    }

    // Prints all the operation types and stats to the console.
    display_all() {
        this.display(this.operation_types.length);
    }

    // Prints the progess of loading the operation types as a percentage to the console.
    show_progress(i, n) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("Progress: " + Math.ceil(100*i/n) + "%");
    }

}

module.exports = Stats;