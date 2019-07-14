//Reserves room controller
class ActionReserve {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Should be in destination room
        if (creep.memory.dest) {
            if (creep.room.name == creep.memory.dest) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Reserve';
            //Console.log(creep.name + ': Reserving Controller');
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.room.controller.sign == null) {
            creep.signController(creep.room.controller, 'Reserved by ' + creep.owner.username);
        }

        if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

module.exports = ActionReserve;