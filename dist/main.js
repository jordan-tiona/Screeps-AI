var Roles = require('roles');
var RoomManager = require('room.manager');
var FlagManager = require('flag.manager');

global.Utils = require('utils');

module.exports.loop = function () {

    //Set up stats
    if (Memory.stats == null) {
        Memory.stats = {};
    }

    if (Memory.stats.cpu == null) {
        Memory.stats.cpu = {};
    }

    //Tally creeps
    RoomManager.tallyCreeps();

    //Run flag manager on each flag
    for (var flagName in Game.flags) {
        FlagManager.manage(Game.flags[flagName]);
    }

    //Run room manager on each room
    for (var roomName in Game.rooms) {
        RoomManager.manage(Game.rooms[roomName]);
    }

    //For each creep, run its assigned role from the roles list
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        Roles[creep.memory.role].run(creep);
    }

    //Collect average CPU
    Memory.stats.cpuTotal += Game.cpu.getUsed();

    if (Game.time % 100 == 0) {
        var message = '<details><summary>Average CPU used: ' + (Memory.stats.cpuTotal /100.0).toFixed(1) + '</summary>';
        for (var role in Memory.stats.cpu) {
            message += 'Average ' + role + ' CPU used: ' + (Memory.stats.cpu[role] / 100.0).toFixed(1) + '\n';
            Memory.stats.cpu[role] = 0;
        }

        message += '</details>';
        Memory.stats.cpuTotal = 0;

        Utils.log('<font color="palegreen">' + message + '</font>');
        Utils.printMessages();
    }

    //Clean creep memory
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
};