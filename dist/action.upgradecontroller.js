//Upgrades room controller
class ActionUpgradeController {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Don't run all the way to the controller if you don't have a full cargo
        if (creep.room.controller.my) {
            if (creep.carry.energy ==  creep.carryCapacity) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'UpgradeController';
            //Console.log(creep.name + ': Upgrading Controller');
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }

        if (creep.room.controller.sign == null) {
            if (creep.signController(creep.room.controller, 'Property of ' + creep.owner.username) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
}

module.exports = ActionUpgradeController;