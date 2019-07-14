//Loot from neutral containers or storage
class ActionLoot {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need to have room in cargo
        if (creep.carry.energy < creep.carryCapacity) {
            //Should be non-empty storage or containers with Screeps as owner
            var targets = creep.room.find(FIND_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_STORAGE && o.store[RESOURCE_ENERGY] > 0 && o.owner.username == 'Screeps';
            }});

            if (targets.length > 0) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Loot';
            //Console.log(creep.name + ': Looting Room');
        }
        if (creep.memory.target == null) {
            creep.memory.target = this.findAvailableContainer(creep);
        }
    }

    //Looks for an available container in the room
    static findAvailableContainer(creep) {

        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(o) {
            return o.structureType == STRUCTURE_STORAGE && o.store[RESOURCE_ENERGY] > 0 && o.owner.username == 'Screeps';
        }});

        return target.id;
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var target = Game.getObjectById(creep.memory.target);

        if (target == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (target.store[RESOURCE_ENERGY] < creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var result = creep.withdraw(target, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        else if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
        else {
            if (creep.energyCapacity - creep.energy < target.store[RESOURCE_ENERGY]) {
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionLoot;