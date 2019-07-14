//Fills Towers
class ActionFillTower {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (creep.carry.energy > 0) {
            var towers = creep.room.find(FIND_MY_STRUCTURES, {filter: function(o){
                return o.structureType == STRUCTURE_TOWER && o.energy < o.energyCapacity;
            }});
            if (towers.length > 0) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'FillTower';
            //Console.log(creep.name + ': Filling Tower');
        }
        if (creep.memory.target == null) {
            var towers = _.sortBy(creep.room.find(FIND_MY_STRUCTURES,
                {filter: function(o) {
                    return o.structureType == STRUCTURE_TOWER;
                }}),
            function(o) {
                return creep.pos.getRangeTo(o);
            });

            for (var tower of towers) {
                if (tower.energy < tower.energyCapacity) {
                    creep.memory.target = tower.id;
                    return;
                }
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

        var tower = Game.getObjectById(creep.memory.target);

        if (tower == null) {
            creep.memory.action = null;
            creep.memory.target = null;
        }

        var result = creep.transfer(tower, RESOURCE_ENERGY);

        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(tower);
        }
        else {
            if (tower.energyCapacity - tower.energy < creep.carry.energy) {
                //We filled it up
                creep.memory.action = null;
                creep.memory.target = null;
            }
        }
    }
}

module.exports = ActionFillTower;