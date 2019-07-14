//Pick up dropped energy
class ActionPickUp {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need to have room in cargo
        if (creep.carry.energy < creep.carryCapacity) {
            //Must be dropped energy somewhere
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES, {filter: function(o) {
                return o.resourceType == RESOURCE_ENERGY;
            }});
            if (dropped.length > 0) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'PickUp';
            //Console.log(creep.name + ': Picking up Energy');
        }
        if (creep.memory.target == null) {
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            creep.memory.target = dropped.id;
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var dropped = Game.getObjectById(creep.memory.target);

        if (dropped == null) {
            creep.memory.action = null;
            creep.memory.target = null;
        }

        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped);
        }
    }
}

module.exports = ActionPickUp;