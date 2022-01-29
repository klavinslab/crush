function help() {

    console.log(`
    You've got serious thrill issues dude... awesome!

    Usage: crush [command] 

    Available commands

    test: Tests the connection with the aquarium instance specified in config.json
    get: Gets all operation types and libraries from the aquarium instance
    push <protocol|library>: Pushes the protocol or library to the aquarium instance

    `);

}

module.exports = help;
