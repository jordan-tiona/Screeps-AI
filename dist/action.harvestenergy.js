//Harvests energy from available source until storage is full
class ActionHarvestEnergy {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        //Need to have room in cargo
        if (creep.carry.energy == creep.carryCapacity) {
            return false;
        }

        return true;
    }

    //Find targets and set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'HarvestEnergy';
            //Console.log(creep.name + ': Harvesting energy');
        }

        if (creep.memory.target == null) {
            creep.memory.target = this.findAvailableSource(creep);
        }

    }

    //Looks for an available source in the room
    static findAvailableSource(creep) {

        var source = creep.pos.findClosestByPath(FIND_SOURCES, {filter: function(o) {
            return o.energy > 0;
        }});
        if (source) {
            return source.id;
        }

        return null;
    }

    //Perform action while possible
    static run(creep) {

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var source = Game.getObjectById(creep.memory.target);

        if (source == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        var result = creep.harvest(source);
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        if (result == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
    }
}

module.exports = ActionHarvestEnergy;