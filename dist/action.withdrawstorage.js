//Withdraw from container or storage
class ActionWithdrawStorage {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need to have room in cargo
        if (creep.carry.energy < creep.carryCapacity) {
            //Need storage in the room with enough energy stored
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_STORAGE;
            }});
            if (storages.length > 0) {
                if (storages[0].store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                    return true;
                }
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'WithdrawStorage';
            //Console.log(creep.name + ': Withdrawing from Storage');
        }
        if (creep.memory.target == null) {
            var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_STORAGE;
            }});
            if (storages.length > 0) {
                if (storages[0].store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                    creep.memory.target = storages[0].id;
                }
            }
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var storage = Game.getObjectById(creep.memory.target);

        if (storage == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (storage.store[RESOURCE_ENERGY] < creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var result = creep.withdraw(storage, RESOURCE_ENERGY);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(storage);
        }
        if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
        if (result == ERR_FULL) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
    }
}

module.exports = ActionWithdrawStorage;