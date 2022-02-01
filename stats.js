const AQ = require('./gofish/aquarium.js');
const Connection = require("./connect.js");

class Stats {
    constructor() {
        this.operation_types = [];
    }

    async get_operation_types() {
        let connection = new Connection("staging");
        await connection.connect();
        this.operation_types = await AQ.OperationType.all();
        this.operation_types = this.operation_types.slice(0, 20);
        console.log("Retrieving operation type stats");

        for (let i = 0; i < this.operation_types.length; i++) {
            let response = await AQ.get("/operation_types/"+this.operation_types[i].id+"/stats");
            let stats = JSON.parse(response.data);
            this.operation_types[i].stat_data = stats;
            this.show_progress(i, this.operation_types.length);
        }
    }

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

    display(n) {
        for (let i = 0; i < Math.max(n,this.operation_types.length); i++) {
            let stats = this.operation_types[i].stat_data;
            console.log(`${i + 1}: ${this.operation_types[i].category}/${this.operation_types[i].name}`);
            for (const [key, val] of Object.entries(stats)) {
                console.log("\t" + key + ": " + val);
            }
        }
    }

    display_all() {
        display(this.operation_types.length);
    }

    show_progress(i, n) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write("Progress: " + Math.ceil(100*i/n) + "%");
    }


}

module.exports = Stats;