//Claims room controller
class ActionClaim {

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
            creep.memory.action = 'Claim';
            //Console.log(creep.name + ': Claiming Controller');
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.room.controller.sign == null) {
            creep.signController(creep.room.controller, 'Claimed by ' + creep.owner.username);
        }

        var result = creep.claimController(creep.room.controller);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
        else {
            console.log(result);
        }
    }
}

module.exports = ActionClaim;