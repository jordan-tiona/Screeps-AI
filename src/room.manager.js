var Roles = require('roles');

class RoomManager {

    static manage(room) {
        this.manageSpawns(room);
        this.flagForRepair(room);
        this.manageTowers(room);
        this.requestHelp(room);
    }

    static manageSpawns(room) {
        var spawns = room.find(FIND_MY_SPAWNS);

        if (spawns.length > 0) {
            var spawn = spawns[0];
            if (!spawn.spawning) {
                if (room.memory.creeps == null) {
                    room.memory.creeps = {};
                }

                //One harvester per container
                var containers = room.find(FIND_STRUCTURES, {filter: function(o) {
                    return o.structureType == STRUCTURE_CONTAINER;
                }});
                if (room.memory.creeps['RoleHarvester'] == null) {
                    room.memory.creeps['RoleHarvester'] = 0;
                }

                if (room.memory.creeps['RoleHarvester'] < containers.length) {
                    Roles['RoleHarvester'].spawnCreep(spawn, room.energyCapacityAvailable);
                }

                if (room.memory.creeps['RoleWorker'] == null) {
                    room.memory.creeps['RoleWorker'] = 0;
                }

                if (room.memory.creeps['RoleUpgrader'] == null) {
                    room.memory.creeps['RoleUpgrader'] = 0;
                }


                if (room.memory.creeps['RoleHauler'] == null) {
                    room.memory.creeps['RoleHauler'] = 0;
                }

                //One upgrader at RCL 2, two at RCL 3 or higher, but only if there are harvesters
                if (room.controller.level == 2 && room.memory.creeps['RoleHarvester'] > 0) {
                    if (room.memory.creeps['RoleUpgrader'] < 1) {
                        Roles['RoleUpgrader'].spawnCreep(spawn, room.energyCapacityAvailable);
                    }
                }
                if (room.controller.level >= 3 && room.memory.creeps['RoleHarvester'] > 0) {
                    if (room.memory.creeps['RoleUpgrader'] < 2) {
                        Roles['RoleUpgrader'].spawnCreep(spawn, room.energyCapacityAvailable);
                    }
                }

                //If we don't have any workers at all, spawn a worker with as much energy as we can
                if (room.memory.creeps['RoleWorker'] == 0) {
                    Roles['RoleWorker'].spawnCreep(spawn, room.energyAvailable);
                }

                //Otherwise spawn 6 workers, minus one for each specialized creep
                if (room.memory.creeps['RoleWorker'] < 5 - room.memory.creeps['RoleUpgrader'] - room.memory.creeps['RoleHauler']) {
                    Roles['RoleWorker'].spawnCreep(spawn, room.energyCapacityAvailable);
                }

                //TODO: Determine if we need a second hauler based on how far containers are from storage
                if (room.find(FIND_MY_STRUCTURES, {filter: function(o) {
                    return o.structureType == STRUCTURE_TOWER;
                }}).length > 0) {
                    if (room.memory.creeps['RoleHauler'] < 1) {
                        Roles['RoleHauler'].spawnCreep(spawn, room.energyCapacityAvailable);
                    }
                }
            }
        }
    }

    static flagForRepair(room) {

        /*
         *  Room.memory.needsRepaired constains a list of structures in need of repair,
         *  when a creep or tower repairs structure to full hp it will be responsible for
         *  removing it from this list.
         */

        if (room.memory.needsRepaired == null) {
            room.memory.needsRepaired = {};
        }

        //Look through list and remove any null entries
        for (var structure in room.memory.needsRepaired) {
            if (!Game.getObjectById(structure)) {
                delete room.memory.needsRepaired[structure];
            }
        }

        //Search room for structures in need of repair
        var structures = room.find(FIND_STRUCTURES, {filter: function(o) {
            return o.structureType != STRUCTURE_WALL && o.structureType != STRUCTURE_RAMPART;
        }});

        for (var structure of structures) {
            if (structure.hits / structure.hitsMax < 0.5) {
                //If it's not already on the list, add it
                if (room.memory.needsRepaired[structure.id] == null) {
                    room.memory.needsRepaired[structure.id] = structure.id;
                }
            }
        }
    }

    static tallyCreeps() {

        //Clear old lists
        for (var room in Memory.rooms) {
            if (Memory.rooms[room].creeps) {
                delete Memory.rooms[room].creeps;
            }
        }

        //Get a census of every creep including its home room and role
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.home == null) {
                //Just skip this creep, something's not right
                continue;
            }

            if (creep.memory.dest == null) {
                creep.memory.dest = creep.memory.home;
            }

            var roomName = creep.memory.dest;
            var role = creep.memory.role;

            if (Memory.rooms[roomName] == null) {
                Memory.rooms[roomName] = {
                    creeps: {}
                };
            }

            if (Memory.rooms[roomName].creeps == null) {
                Memory.rooms[roomName].creeps = {};
            }

            if (Memory.rooms[roomName].creeps[role] == null) {
                Memory.rooms[roomName].creeps[role] = 0;
            }

            if (Memory.rooms[roomName].creeps.total == null) {
                Memory.rooms[roomName].creeps.total = 0;
            }

            Memory.rooms[roomName].creeps[role]++;
            Memory.rooms[roomName].creeps.total++;

            //Check if this creep needs healed
            if (creep.hits < creep.hitsMax) {
                if (creep.room.memory.creeps == null) {
                    creep.room.memory.creeps = {};
                }
                if (creep.room.memory.creeps.needsHealing == null) {
                    creep.room.memory.creeps.needsHealing = [];
                }

                creep.room.memory.creeps.needsHealing.push(creep.id);
            }
        }
    }

    static manageTowers(room) {
        const WALL_MAX_HITS = 500000;

        var towers = room.find(FIND_MY_STRUCTURES, {filter: function(o) {
            return o.structureType == STRUCTURE_TOWER;
        }});

        if (towers.length == 0) {
            return;
        }

        var hostileCreeps = room.find(FIND_HOSTILE_CREEPS);

        if (hostileCreeps.length > 0) {
            for (var tower of towers) {
                var target = tower.pos.findClosestByRange(hostileCreeps);
                tower.attack(target);
            }
        }
        else {
            //Any ramparts need built up?

            //Don't drain our economy building up ramparts, only do this once every fourth tick
            if (Game.time % 4 == 0) {
                var ramparts = room.find(FIND_STRUCTURES, {filter: (o) => {
                    return o.structureType == STRUCTURE_RAMPART;
                }});
                if (ramparts.length > 0) {
                    var rampart = _.min(ramparts, function(o) {
                        return o.hits;
                    });

                    for (var tower of towers) {
                        //Keep tower half full for emergencies
                        if (tower.energy > tower.energyCapacity / 2) {
                            tower.repair(rampart);
                        }
                    }
                }
            }

            //Any walls need repaired?
            if (Game.time % 2 == 1) {
                var walls = room.find(FIND_STRUCTURES, {filter: (o) => {
                    return o.structureType == STRUCTURE_WALL && o.hits < WALL_MAX_HITS;
                }});

                if (walls.length > 0) {
                    var wall = _.min(walls, (o) => {
                        return o.hits;
                    });
                    for (var tower of towers) {
                        //Keep tower half full for emergencies
                        if (tower.energy > tower.energyCapacity / 2) {
                            tower.repair(wall);
                        }
                    }
                }
            }

            //Any repairs needed?
            if (room.memory.needsRepaired != null && _.size(room.memory.needsRepaired) > 0) {
                var structures = _.map(room.memory.needsRepaired, function(o) {
                    return Game.getObjectById(o);
                });

                for (var tower of towers) {
                    //Keep tower half full for emergencies
                    if (tower.energy > tower.energyCapacity / 2) {
                        var target = tower.pos.findClosestByRange(structures);
                        tower.repair(target);
                    }
                }
            }

            //Any creeps need healed?
            if (room.memory.creeps.needsHealing != null && room.memory.creeps.needsHealing.length > 0) {
                var target = Game.getObjectById(room.memory.creeps.needsHealing[0]);

                for (var tower of towers) {
                    //Keep tower half full for emergencies
                    if (tower.energy > tower.energyCapacity / 2) {
                        tower.heal(target);
                    }
                }
            }
        }

    }

    static requestHelp(room) {

        //If there are hostiles in this room and it's not claimed or an owned room, place a REQUEST_HELP flag

        if (room.find(FIND_HOSTILE_CREEPS).length > 0) {
            var flags = room.find(FIND_FLAGS, {filter: function(o) {
                return o.color == COLOR_RED && o.secondaryColor == COLOR_RED;
            }});
            if (flags.length == 0) {
                if (!room.controller.owner && !room.controller.owner) {
                    var pos = new RoomPosition(25, 25, room.name);
                    pos.createFlag(null, COLOR_RED, COLOR_RED);
                    Utils.log('<font color="orangered">Hostile creeps spotted in ' + Utils.createHtmlLinkToObject(room) + '</font>');
                }
            }
        }

    }
}

module.exports = RoomManager;