//Fills Room Spawn
class ActionFillSpawn {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need energy to transfer and spawn must not be full
        var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (spawn) {
            if (creep.carry.energy > 0 && spawn.energy < spawn.energyCapacity) {
                return true;
            }
        }
        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'FillSpawn';
            //Console.log(creep.name + ': Filling Spawn');
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        var result = creep.transfer(spawn, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn);
        }
        else {
            if (spawn.energyCapacity - spawn.energy < creep.carry.energy) {
                //We filled it up
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionFillSpawn;