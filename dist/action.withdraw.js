//Withdraw from container or storage
class ActionWithdraw {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need to have room in cargo
        if (creep.carry.energy < creep.carryCapacity) {
            //Need containers in the room with enough energy stored
            var containers = creep.room.find(FIND_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_CONTAINER;
            }});
            if (containers.length > 0) {
                for (var container of containers) {
                    //Container needs at least one full load of energy available
                    if (container.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                        return true;
                    }
                }
            }
            //Or tombstones
            var tombstones = creep.room.find(FIND_TOMBSTONES, {filter: function(o) {
                return o.store[RESOURCE_ENERGY] > 0;
            }});
            if (tombstones.length > 0) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Withdraw';
            //Console.log(creep.name + ': Withdrawing Energy');
        }
        if (creep.memory.target == null) {
            creep.memory.target = this.findAvailableContainer(creep);
        }
    }

    //Looks for an available container in the room, prioritizing higher energy source
    static findAvailableContainer(creep) {

        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: function(o) {
            return o.store[RESOURCE_ENERGY] > 0;
        }});

        if (tombstone) {
            return tombstone.id;
        }

        var containers = creep.room.find(FIND_STRUCTURES, {filter: function(o) {
            return o.structureType == STRUCTURE_CONTAINER;
        }});
        var container = _.max(containers, function(o) {
            return o.store[RESOURCE_ENERGY];
        });
        return container.id;
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var container = Game.getObjectById(creep.memory.target);

        if (container == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (container.store[RESOURCE_ENERGY] == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var result = creep.withdraw(container, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
        }
        else {
            if (creep.carryCapacity - creep.carry.energy > container.store[RESOURCE_ENERGY]) {
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionWithdraw;