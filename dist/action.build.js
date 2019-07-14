//Builds an in-progress construction site
class ActionBuild {

    //Check if this action is one that can be performed right now
    static isValid(creep) {
        //Need energy to build
        if (creep.carry.energy > 0) {
            //Need an available construction site
            var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if (sites.length > 0) {
                return true;
            }
        }
        return false;
    }

    //Find targets and set creep memory
    static setupAction(creep) {
        if (creep.memory.action == null) {
            creep.memory.action = 'Build';
            //Console.log(creep.name + ': Building');
        }
        if (creep.memory.target == null) {
            var site = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            creep.memory.target = site.id;
        }
    }

    //Perform action while possible
    static run(creep) {
        if (creep.carry.energy == 0) {
            creep.memory.action = null;
            creep.memory.target = null;
        }
        var site = Game.getObjectById(creep.memory.target);

        if (site == null) {
            creep.memory.action = null;
            creep.memory.target = null;
        }

        if (creep.build(site) == ERR_NOT_IN_RANGE) {
            creep.moveTo(site);
        }
    }
}

module.exports = ActionBuild;