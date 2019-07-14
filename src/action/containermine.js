//Mines from energy source and drops it into container below
class ActionContainerMine {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {
        return true;
    }

    //Find targets and set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'ContainerMine';
            //Console.log(creep.name + ': Container Mining');
        }

        if (creep.memory.target == null) {
            creep.memory.target = this.claimContainer(creep);
        }

    }

    /*
     *Looks for an unclaimed container and claims it, and sets target energy source
     *to the closest source to that container
     */
    static claimContainer(creep) {

        //If we haven't already claimed a container, get a list of all harvester creeps in room
        if (creep.memory.container == null) {
            var harvesters = creep.room.find(FIND_MY_CREEPS, {filter: function(o) {
                return o.memory.role == 'RoleHarvester' || o.memory.role == 'RoleRemoteHarvester';
            }});

            //And a list of all containers in the room
            var containers = creep.room.find(FIND_STRUCTURES, {filter: function(o) {
                return o.structureType == STRUCTURE_CONTAINER;
            }});

            //If there aren't any containers then something's wrong
            if (containers.length == 0) {
                return null;
            }

            //If there are other harvesters, find an unclaimed container
            if (harvesters.length > 0) {
                for (var container of containers) {
                    var claimed = false;

                    //Check if any of the other harvesters have claimed this container
                    for (var harvester of harvesters) {
                        if (harvester.memory.container != null) {
                            if (harvester.memory.container == container.id) {
                                claimed = true;
                            }
                        }
                    }

                    if (!claimed) {
                        //Unclaimed container, it's ours!
                        creep.memory.container = container.id;
                        break;
                    }
                }
            }
        }

        //Should have a claimed container by now, if not then something went wrong
        if (creep.memory.container != null) {
            //Return id of source closest to container
            var container = Game.getObjectById(creep.memory.container);
            var source = _.first(container.pos.findInRange(FIND_SOURCES, 1));

            if (source) {
                return source.id;
            }
            var mineral = _.first(container.pos.findInRange(FIND_MINERALS, 1));

            if (mineral) {
                return mineral.id;
            }

            return null;
        }

        console.log('Big oops');
        //If we got here then big oops
        return null;
    }

    //Perform action while possible
    static run(creep) {
        //If we're not on top of our claimed container, move to it
        var container = Game.getObjectById(creep.memory.container);

        if (container == null) {
            creep.memory.action = null;
            creep.memory.target = null;
            return;
        }

        if (!creep.pos.isEqualTo(container.pos)) {
            creep.moveTo(container.pos);
        }
        else {
            //If container is full, just chill
            if (_.sum(container.store) == container.storeCapacity) {
                return;
            }

            //Harvest from target source
            var source = Game.getObjectById(creep.memory.target);

            if (source == null) {
                creep.memory.action = null;
                creep.memory.target = null;
            }

            if (source.cooldown && source.cooldown > 0) {
                return;
            }
            creep.harvest(source);
        }
    }
}

module.exports = ActionContainerMine;