//Repair structures flagged for repair
class ActionRepair {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need energy in cargo
        if (creep.carry.energy > 0) {
            //Need structure to repair
            if (_.size(creep.room.memory.needsRepaired) > 0) {
                return true;
            }
        }

        return false;
    }

    //Find targets and set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Repair';
            //Console.log(creep.name + ': Repairing');
        }

        if (creep.memory.target == null) {
            //Find closest structure that needs repaired
            var structures = _.map(creep.room.memory.needsRepaired, function(o) {
                return Game.getObjectById(o);
            });
            var target = creep.pos.findClosestByRange(structures);
            if (target) {
                creep.memory.target = target.id;
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

        var structure = Game.getObjectById(creep.memory.target);
        if (structure == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (structure.hits == structure.hitsMax) {
            //Finished repairing, make sure we remove it from the list
            delete creep.room.memory.needsRepaired[structure.id];
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(structure);
        }
    }
}

module.exports = ActionRepair;