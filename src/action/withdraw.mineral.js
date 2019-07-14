//Withdraw minerals from container
class ActionWithdrawMineral {

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
                    //Container needs to have minerals to withdraw
                    if (container.store[RESOURCE_ENERGY] < _.sum(container.store)) {
                        return true;
                    }
                }
            }
            //Or tombstones
            var tombstones = creep.room.find(FIND_TOMBSTONES, {filter: function(o) {
                return o.store[RESOURCE_ENERGY] < _.sum(o.store);
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
            creep.memory.action = 'WithdrawMineral';
            //Console.log(creep.name + ': Withdrawing Energy');
        }
        if (creep.memory.target == null) {
            creep.memory.target = this.findAvailableContainer(creep);
        }
    }

    //Looks for an available container in the room
    static findAvailableContainer(creep) {

        var tombstone = creep.pos.findClosestByRange(FIND_TOMBSTONES, {filter: function(o) {
            return o.store[RESOURCE_ENERGY] < _.sum(o.store);
        }});

        if (tombstone) {
            return tombstone.id;
        }

        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(o) {
            return o.structureType == STRUCTURE_CONTAINER && o.store[RESOURCE_ENERGY] < _.sum(o.store);
        }});
        return container.id;
    }

    //Perform action while possible
    static run(creep) {
        if (_.sum(creep.carry) == creep.carryCapacity) {
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

        if (container.store[RESOURCE_ENERGY] == _.sum(container.store)) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        for (var resource in container.store) {
            if (resource != RESOURCE_ENERGY) {
                var result = creep.withdraw(container, resource);

                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                else {
                    if (creep.carryCapacity - _.sum(creep.carry) > container.store[resource]) {
                        creep.memory.action = null;
                        creep.memory.target = null;
                    }
                }

                return;
            }
        }
    }
}

module.exports = ActionWithdrawMineral;