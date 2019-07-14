//Renews creep Time to Live
class ActionRenew {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (creep.room.name == creep.memory.home) {
            //Don't renew if there's no energy available
            if (creep.room.energyAvailable > 300) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Renew';
            //Console.log(creep.name + ': Renewing');
        }
        if (creep.memory.target == null) {
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            creep.memory.target = spawn.id;
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.ticksToLive > 1000) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var spawn = Game.getObjectById(creep.memory.target);

        if (spawn == null) {
            creep.memory.action = null;
            creep.memory.target = null;
        }

        var result = spawn.renewCreep(creep);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
        if (result == ERR_FULL || result == ERR_NOT_ENOUGH_ENERGY) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
    }
}

module.exports = ActionRenew;