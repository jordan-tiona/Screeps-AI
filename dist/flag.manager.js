var Roles = require('roles');

class FlagManager {

    static manage(flag) {
        //Flag types
        const RESERVE_ROOM = {
            primary: COLOR_PURPLE,
            secondary: COLOR_PURPLE
        };
        const CLAIM_ROOM = {
            primary: COLOR_BLUE,
            secondary: COLOR_CYAN
        };
        const REMOTE_MINE = {
            primary: COLOR_GREY,
            secondary: COLOR_GREY
        };
        const REQUEST_HELP = {
            primary: COLOR_RED,
            secondary: COLOR_RED
        };
        const ATTACK_ROOM = {
            primary: COLOR_ORANGE,
            secondary: COLOR_ORANGE
        };

        //Reserve flags
        if (flag.color == RESERVE_ROOM.primary && flag.secondaryColor == RESERVE_ROOM.secondary) {

            var roomName = flag.pos.roomName;

            //Don't bother if the reserve timer is over 2k
            if (!(Game.rooms[roomName] && Game.rooms[roomName].controller.reservation && Game.rooms[roomName].controller.reservation.ticksToEnd > 2000)) {
                //If flag's room doesn't have memory, it should now
                if (Memory.rooms[roomName] == null) {
                    Memory.rooms[roomName] = {};
                }

                //If flag's nearest claimed room isn't set, set it now
                if (Memory.rooms[roomName].nearestAllied == null) {
                    //Go through flags looking for CLAIM_ROOM flags, find closest path
                    var nearestAllied = null;
                    var shortest = Infinity;

                    for (var flagName in Game.flags) {
                        if (Game.flags[flagName].color == CLAIM_ROOM.primary && Game.flags[flagName].secondaryColor == CLAIM_ROOM.secondary) {
                            var destRoom = Game.flags[flagName].pos.roomName;

                            var distance = Game.map.findRoute(roomName, destRoom).length;
                            if (distance < shortest) {
                                shortest = distance;
                                nearestAllied = destRoom;
                            }
                        }
                    }

                    Memory.rooms[roomName].nearestAllied = nearestAllied;
                }

                var nearestAllied = Memory.rooms[roomName].nearestAllied;

                //Check the creep tally for reserver creeps, spawn one if there isn't one
                if (Memory.rooms[roomName].creeps == null) {
                    Memory.rooms[roomName].creeps = {};
                }
                if (Memory.rooms[roomName].creeps['RoleReserver'] == null) {
                    Memory.rooms[roomName].creeps['RoleReserver'] = 0;
                }

                //Need at least 1300 energy to spawn one of these beasts
                if (Game.rooms[nearestAllied].energyCapacityAvailable >= 1300) {
                    if (Memory.rooms[roomName].creeps['RoleReserver'] == 0) {
                        var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                        if (!spawn.spawning) {
                            Roles['RoleReserver'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                        }
                    }
                }
            }
        }

        //Claim flags
        if (flag.color == CLAIM_ROOM.primary && flag.secondaryColor == CLAIM_ROOM.secondary) {

            var roomName = flag.pos.roomName;

            //Don't bother if we've already claimed this room
            if (!(Game.rooms[roomName] && Game.rooms[roomName].controller.my)) {
                //If flag's room doesn't have memory, it should now
                if (Memory.rooms[roomName] == null) {
                    Memory.rooms[roomName] = {};
                }

                //If flag's nearest claimed room isn't set, set it now
                if (Memory.rooms[roomName].nearestAllied == null) {
                    //Go through flags looking for CLAIM_ROOM flags, find closest path
                    var nearestAllied = null;
                    var shortest = Infinity;

                    for (var flagName in Game.flags) {
                        if (Game.flags[flagName].color == CLAIM_ROOM.primary && Game.flags[flagName].secondaryColor == CLAIM_ROOM.secondary) {
                            //Don't include this room
                            if (roomName != Game.flags[flagName].pos.roomName) {
                                var destRoom = Game.flags[flagName].pos.roomName;

                                var distance = Game.map.findRoute(roomName, destRoom).length;
                                if (distance < shortest) {
                                    shortest = distance;
                                    nearestAllied = destRoom;
                                }
                            }
                        }
                    }

                    Memory.rooms[roomName].nearestAllied = nearestAllied;
                }

                var nearestAllied = Memory.rooms[roomName].nearestAllied;

                //Check the creep tally for reserver creeps, spawn one if there isn't one
                if (Memory.rooms[roomName].creeps == null) {
                    Memory.rooms[roomName].creeps = {};
                }
                if (Memory.rooms[roomName].creeps['RoleClaimer'] == null) {
                    Memory.rooms[roomName].creeps['RoleClaimer'] = 0;
                }

                //Need at least 1300 energy to spawn one of these beasts
                if (Game.rooms[nearestAllied].energyCapacityAvailable >= 1300) {
                    if (Memory.rooms[roomName].creeps['RoleClaimer'] == 0) {
                        var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                        if (!spawn.spawning) {
                            Roles['RoleClaimer'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                        }
                    }
                }
            }
        }

        //Remote mining flags
        if (flag.color == REMOTE_MINE.primary && flag.secondaryColor == REMOTE_MINE.secondary) {
            var roomName = flag.pos.roomName;
            //If flag's room doesn't have memory, it should now
            if (Memory.rooms[roomName] == null) {
                Memory.rooms[roomName] = {};
            }

            //If flag's nearest claimed room isn't set, set it now
            if (Memory.rooms[roomName].nearestAllied == null) {
                //Go through flags looking for CLAIM_ROOM flags, find closest path
                var nearestAllied = null;
                var shortest = Infinity;

                for (var flagName in Game.flags) {
                    if (Game.flags[flagName].color == CLAIM_ROOM.primary && Game.flags[flagName].secondaryColor == CLAIM_ROOM.secondary) {
                        var destRoom = Game.flags[flagName].pos.roomName;

                        var distance = Game.map.findRoute(roomName, destRoom).length;
                        if (distance < shortest) {
                            shortest = distance;
                            nearestAllied = destRoom;
                        }
                    }
                }

                Memory.rooms[roomName].nearestAllied = nearestAllied;
            }

            var nearestAllied = Memory.rooms[roomName].nearestAllied;

            //One remote harvester per container, two pioneers unless there are long haulers
            if (Memory.rooms[roomName].creeps == null) {
                Memory.rooms[roomName].creeps = {};
            }
            if (Memory.rooms[roomName].creeps['RolePioneer'] == null) {
                Memory.rooms[roomName].creeps['RolePioneer'] = 0;
            }
            if (Memory.rooms[roomName].creeps['RoleLongHauler'] == null) {
                Memory.rooms[roomName].creeps['RoleLongHauler'] = 0;
            }
            if (Memory.rooms[roomName].creeps['RoleRemoteHarvester'] == null) {
                Memory.rooms[roomName].creeps['RoleRemoteHarvester'] = 0;
            }

            if (Game.rooms[roomName]) {
                var numContainers = Game.rooms[roomName].find(FIND_STRUCTURES, {filter: function(o) {
                    return o.structureType == STRUCTURE_CONTAINER;
                }}).length;
                if (Memory.rooms[roomName].creeps['RoleRemoteHarvester'] < numContainers) {
                    var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                    if (!spawn.spawning) {
                        Roles['RoleRemoteHarvester'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                    }
                }
            }

            if (Memory.rooms[roomName].creeps['RoleLongHauler'] > 0) {
                if (Memory.rooms[roomName].creeps['RolePioneer'] < 1) {
                    var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                    Roles['RolePioneer'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                }
            }
            else {
                if (Memory.rooms[roomName].creeps['RolePioneer'] < 2) {
                    var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                    Roles['RolePioneer'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                }
            }

            if (Game.rooms[roomName]) {
                var numContainers = Game.rooms[roomName].find(FIND_STRUCTURES, {filter: function(o) {
                    return o.structureType == STRUCTURE_CONTAINER || o.structureType == STRUCTURE_STORAGE;
                }}).length;
                if (Memory.rooms[roomName].creeps['RoleLongHauler'] < numContainers) {
                    var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                    Roles['RoleLongHauler'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                }
            }
        }

        //Request Help
        if (flag.color == REQUEST_HELP.primary && flag.secondaryColor == REQUEST_HELP.secondary) {

            var roomName = flag.pos.roomName;

            //If we have vision of the room and the hostile creep is gone, remove the flag
            if (Game.rooms[roomName] && Game.rooms[roomName].find(FIND_HOSTILE_CREEPS).length == 0) {
                flag.remove();
            }
            else {
                //If flag's room doesn't have memory, it should now
                if (Memory.rooms[roomName] == null) {
                    Memory.rooms[roomName] = {};
                }

                //If flag's nearest claimed room isn't set, set it now
                if (Memory.rooms[roomName].nearestAllied == null) {
                    //Go through flags looking for CLAIM_ROOM flags, find closest path
                    var nearestAllied = null;
                    var shortest = Infinity;

                    for (var flagName in Game.flags) {
                        if (Game.flags[flagName].color == CLAIM_ROOM.primary && Game.flags[flagName].secondaryColor == CLAIM_ROOM.secondary) {
                            var destRoom = Game.flags[flagName].pos.roomName;

                            var distance = Game.map.findRoute(roomName, destRoom).length;
                            if (distance < shortest) {
                                shortest = distance;
                                nearestAllied = destRoom;
                            }
                        }
                    }

                    Memory.rooms[roomName].nearestAllied = nearestAllied;
                }

                var nearestAllied = Memory.rooms[roomName].nearestAllied;

                //Spawn a guardsman
                if (Memory.rooms[roomName].creeps == null) {
                    Memory.rooms[roomName].creeps = {};
                }
                if (Memory.rooms[roomName].creeps['RoleGuardsman'] == null) {
                    Memory.rooms[roomName].creeps['RoleGuardsman'] = 0;
                }

                if (Memory.rooms[roomName].creeps['RoleGuardsman'] < 1) {
                    var spawn = Game.rooms[nearestAllied].find(FIND_MY_SPAWNS)[0];
                    Roles['RoleGuardsman'].spawnCreep(spawn, Game.rooms[nearestAllied].energyCapacityAvailable, roomName);
                }
            }
        }

        //Attack room
        if (flag.color == ATTACK_ROOM.primary && flag.secondaryColor == ATTACK_ROOM.secondary) {
            var roomName = flag.pos.roomName;
            //If flag's room doesn't have memory, it should now
            if (Memory.rooms[roomName] == null) {
                Memory.rooms[roomName] = {};
            }

            //For the staging room we need the closest claimed RCL 5 or greater room
            var stagingRoom = null;
            var shortest = Infinity;

            for (var flagName in Game.flags) {
                if (Game.flags[flagName].color == CLAIM_ROOM.primary && Game.flags[flagName].secondaryColor == CLAIM_ROOM.secondary) {
                    var destRoom = Game.flags[flagName].pos.roomName;

                    if (Game.rooms[destRoom].controller.level >= 6) {
                        var distance = Game.map.findRoute(roomName, destRoom).length;
                        if (distance < shortest) {
                            shortest = distance;
                            stagingRoom = destRoom;
                        }
                    }
                }
            }

            if (stagingRoom) {
                //Spawn a Ranger and a Healer
                if (Memory.rooms[roomName].creeps == null) {
                    Memory.rooms[roomName].creeps = {};
                }
                if (Memory.rooms[roomName].creeps['RoleRanger'] == null) {
                    Memory.rooms[roomName].creeps['RoleRanger'] = 0;
                }
                if (Memory.rooms[roomName].creeps['RoleHealer'] == null) {
                    Memory.rooms[roomName].creeps['RoleHealer'] = 0;
                }

                if (Memory.rooms[roomName].creeps['RoleRanger'] == 0) {
                    var spawn = Game.rooms[stagingRoom].find(FIND_MY_SPAWNS)[0];
                    Roles['RoleRanger'].spawnCreep(spawn, Game.rooms[stagingRoom].energyCapacityAvailable, roomName);
                }
                if (Memory.rooms[roomName].creeps['RoleHealer'] == 0) {
                    var spawn = Game.rooms[stagingRoom].find(FIND_MY_SPAWNS)[0];
                    Roles['RoleHealer'].spawnCreep(spawn, Game.rooms[stagingRoom].energyCapacityAvailable, roomName);
                }
            }
        }
    }

}

module.exports = FlagManager;