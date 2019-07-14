//Attacks hostile creeps and structures
class ActionSquadAttack {

    static isValid(creep) {
        //Must be at destination
        if (creep.room.name == creep.memory.dest) {
            return true;
        }

        return false;
    }

    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'SquadAttack';
        }

        var nearestCreep = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (nearestCreep) {
            creep.memory.target = nearestCreep.id;
        }
        else {
            var nearestStructure = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (o) => {
                return o.structureType != STRUCTURE_CONTROLLER;
            }});
            if (nearestStructure) {
                creep.memory.target = nearestStructure.id;
            }
            else {
                var nearestRampart = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => {
                    return o.structureType == STRUCTURE_RAMPART;
                }});
                if (nearestRampart) {
                    creep.memory.target = nearestRampart.id;
                }
                else {
                    var nearestWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (o) => {
                        return o.structureType == STRUCTURE_WALL;
                    }});
                    if (nearestWall) {
                        creep.memory.target = nearestWall.id;
                    }
                    else {
                        creep.memory.target = null;
                    }
                }
            }
        }
    }

    static run(creep) {
        //If our target is dead then get a new one
        var target = Game.getObjectById(creep.memory.target);
        if (!target) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        /*
         *While working towards our target creep, rampart, or wall, attack any creeps that get close to us:
         *Look for nearby creeps that aren't currently under any ramparts
         */
        var hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, {filter: (o) => {
            return o.pos.lookFor(LOOK_STRUCTURES).filter((o) => {
                o.structureType == STRUCTURE_RAMPART;
            }).length == 0;
        }});

        //If there are targets in range
        if (hostileCreeps.length > 0) {
            //Get the closest creep and the range to that creep
            var closest = creep.pos.findClosestByRange(hostileCreeps);
            var range = creep.pos.getRangeTo(closest);

            //If the creep is next to us or there's more than one creep in range, do a ranged mass attack
            if (range == 1 || hostileCreeps.length > 1) {
                creep.rangedMassAttack();
            }
            //Otherwise just rangedAttack closest creep
            else {
                creep.rangedAttack(closest);
            }

            //If we have ATTACK parts and there's a creep next to us, attack it
            if (range == 1 && creep.getActiveBodyparts(ATTACK) > 0) {
                creep.attack(closest);
            }
        }
        else {
            //No hostile creeps to attack, attack our target instead
            var range = creep.pos.getRangeTo(target);
            if (range > 1) {
                creep.rangedAttack(target);
            }
            else {
                creep.rangedMassAttack();
            }

            if (range == 1 && creep.getActiveBodyparts(ATTACK) > 0) {
                creep.attack(target);
            }
        }

        //Move towards our target, making sure that healer keeps up with us
        var healer = Game.getObjectById(creep.memory.healer);

        //Only move if healer is right next to us and doesn't have fatigue
        if (healer) {
            if (creep.pos.getRangeTo(healer) == 1 && healer.fatigue == 0) {
                creep.moveTo(target, {ignoreCreeps: true});
            }
        }
        else {
            creep.moveTo(target, {ignoreCreeps: true});
        }
    }
}

module.exports = ActionSquadAttack;