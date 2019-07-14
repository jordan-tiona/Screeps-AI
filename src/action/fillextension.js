//Fills Extensions
class ActionFillExtension {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (creep.carry.energy > 0 && creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
            return true;
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'FillExtension';
            //Console.log(creep.name + ': Filling Extension');
        }
        if (creep.memory.target == null) {
            var extensions = _.sortBy(creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}), function(o) {
                return creep.pos.getRangeTo(o);
            });

            for (var extension of extensions) {
                if (extension.energy < extension.energyCapacity) {
                    creep.memory.target = extension.id;
                    return;
                }
            }
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var extension = Game.getObjectById(creep.memory.target);

        if (extension == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var result = creep.transfer(extension, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(extension);
        }
        else {
            if (extension.energyCapacity - extension.energy < creep.carry.energy) {
                //We filled it up
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionFillExtension;