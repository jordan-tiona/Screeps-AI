//Attacks a hostile creep
class ActionAttack {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Only valid if there are hostiles in the room
        if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
            return true;
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Attack';
            //Console.log(creep.name + ': Attacking Hostile Creep');
        }

        if (creep.memory.target == null) {
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            var target = _.max(hostiles, function(o) {
                return o.getActiveBodyparts(HEAL);
            });
            if (target) {
                creep.memory.target = target.id;
            }
        }
    }

    //Perform action while possible
    static run(creep) {
        var target = Game.getObjectById(creep.memory.target);

        if (target  == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        //Try to range attack if we have ranged attack part(s)
        if (creep.pos.getRangeTo(target) > 1) {
            if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                creep.rangedAttack(target);
            }

            if (creep.getActiveBodyparts(HEAL) > 0) {
                creep.heal(creep);
            }
        }

        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = ActionAttack;