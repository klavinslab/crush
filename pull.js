const AQ = require('./gofish/aquarium.js');
const Connection = require("./connect.js");
var fs = require('fs');

class Puller {

    constructor(instance_name) {
        this.instance_name = instance_name;
        this.op_types = [];
        this.libs = [];
        this.connection = new Connection(this.instance_name);
    }

    // Pull all libraries and operation_types from the instance. Also
    // create all directories to organize everything. Can take a long time.
    async pull() {

        this.mkdir(this.instance_name);
        await this.connection.connect();

        this.op_types = await AQ.OperationType.where({deployed: true});
        this.libs = await AQ.Library.all();
        let objects = this.libs.concat(this.op_types);

        for ( let i=0; i<objects.length; i++ ) {
            this.fix_name(objects[i]);
            this.make_category_directory(objects[i]);
            await this.save_object_code(objects[i]);
            this.save_object_info(objects[i]);
            this.show_progress(i,objects.length, objects[i].name);
        }

        console.log("\ndone!");

    }

    // Makes a directory for the object's catagory. For example, 
    // if the instance is "stagin" and the category is "Cloning", 
    // then the following directory is set up:
    //   staging/
    //     Cloning/
    //       lib/
    //       op/
    // Operations in this category will be put in op/ and libraries
    // in lib/
    make_category_directory(object) {
        let path = this.instance_name + "/" + object.category + "/"; 
        this.mkdir(path);
        this.mkdir(path + "lib/");
        this.mkdir(path + "op/");
    }

    // A convenience wrapper around the fs method by the same name that
    // checks to see if the directory already exists.
    mkdir(path) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        } 
    }

    // Remove any forward slashes in the name of the object, which would confuse
    // thei filesystem.
    //     - object should be an operation_type or library
    fix_name(object) {
        if ( !object.name ) {
            console.log("oops");
            console.log(typeof object);
        }
        object.name = object.name.replace(/\//g, '-');
    }

    // Returns the path to the directory for the operation_type. For example, 
    // if the instance is called "staging", if the op_type has category "Cloning",
    //  and name "Run PCR" then this method would return staging/Cloning/op/Run \PCR/
    op_type_path(op_type) {
        return this.instance_name + "/" + op_type.category + "/op/" + op_type.name + "/";
    }

    // Similar to op_type_path but for libraries. 
    lib_path(lib) {
        return this.instance_name + "/" + lib.category + "/lib/" + lib.name + "/";
    }    

    // Retrieves and saves all source code for the given object
    async save_object_code(object) {

        if ( object.model.model == "OperationType" ) {
            await this.save_op_type_code(object);
        } else if ( object.model.model == "Library" ) {
            await this.save_library_code(object);            
        }

    }

    // Retrives and saves the source code for the given operation_type including
    // the protocol, precondition, documentation, and test files.
    async save_op_type_code(op_type) {

        let protocol = await this.get_code(op_type, "protocol"),
            precondition = await this.get_code(op_type, "precondition"),
            docs = await this.get_code(op_type, "documentation"),
            test = await this.get_code(op_type, "test");

        let path = this.op_type_path(op_type);
        this.mkdir(path);

        fs.writeFileSync(path+"protocol.rb", protocol.content);
        fs.writeFileSync(path+"precondition.rb", precondition.content);
        fs.writeFileSync(path+"documentation.md", docs.content);
        fs.writeFileSync(path+"test.rb", test.content);

    }

    // Retrieves and saves the library source code.
    async save_library_code(lib) {

        let source = await this.get_code(lib, "source");
        let path = this.lib_path(lib);
        this.mkdir(path);
        fs.writeFileSync(path+"source.rb", source.content);

    }    

    // Saves a json file describing the object, and in particular noting
    // the object's id, which can be used to find it in an Aquarium instance
    // or to resave it's code.
    save_object_info(object) {
        let info = {
            id: object.id,
            name: object.name,
            category: object.category,
            type: object.model.model
        }
        let path = object.model.model == "OperationType" 
                                       ? this.op_type_path(object) 
                                       : this.lib_path(object);
        fs.writeFileSync(
            path + "info.json", 
            JSON.stringify(info)
        );
    }

    // Get code for a protocol or library from Aquarium instance.
    //    - object is either an OperationType or a Library
    //    - type is a string that Aquarium uses in a jnaky way to distinguish 
    //      code types and is either "source",  "protocol", "precondition", "test",
    //      or "documentation"
    async get_code(object, type) { 

        let codes = await AQ.Code.where({
            parent_class: object.model.model,
            parent_id: object.id,
            name: type
        });

        if ( codes.length > 0 ) {

            let latest = 0;
            for ( var i=0; i<codes.length; i++ ) {
                if ( codes[i].id > latest ) {
                    latest = i;
                }
            }

            return codes[latest];

        } else {

            return { content: "# Your code here" };

        }

    }

    // Show progress for a loop. TODO: Put this in a utils module
    //    - i is the iteration through the loop
    //    - n is the total number of iterations in the loop
    //    - msg is a message to display
    show_progress(i,n, msg) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(Math.floor(100*i/n) + "%: " + msg);    
    }

}

module.exports = Puller;