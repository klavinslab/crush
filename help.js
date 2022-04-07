function help() {

    console.log(`
    You've got serious thrill issues dude... awesome!
    Usage: crush [command]
    Available commands
    test: Tests the connection with the aquarium instance specified in config.json
    stats: Gets all operation types and libraries from the aquarium instance
    stats -mr: Gets top 10 most recent run operation types and libraries from the aquarium instance
    stats -md: Gets top 10 most done run operation types and libraries from the aquarium instance
    push <protocol|library>: Pushes the protocol or library to the aquarium instance
    pull <protocol>: Pulls the protocol from the aquarium instance
    `);

}

module.exports = help;