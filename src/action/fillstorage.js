//Fills Storage
class ActionFillStorage {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (_.sum(creep.carry) > 0) {
            if (creep.room.find(FIND_MY_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_STORAGE;
            }}).length > 0) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'FillStorage';
            //Console.log(creep.name + ': Filling Storage');
        }
        if (creep.memory.target == null) {
            var storage = creep.room.find(FIND_MY_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_STORAGE;
            }})[0];
            creep.memory.target = storage.id;
        }
    }

    //Perform action while possible
    static run(creep) {
        if (_.sum(creep.carry) == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var storage = Game.getObjectById(creep.memory.target);

        if (storage == null) {
            creep.memory.action = null;
            creep.memory.target = null;
        }

        for (var resource in creep.carry) {
            var result = creep.transfer(storage, resource);

            if (result == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
                return;
            }
            if (result == ERR_FULL) {
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionFillStorage;