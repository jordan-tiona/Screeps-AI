//Waits at spawn getting renewed until squad is assembled
class ActionRally {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {
        //Should be in home room
        if (creep.memory.home) {
            if (creep.room.name == creep.memory.home) {
                //Wait until rest of the squad members have spawned
                var squad = this.roleCall(creep);
                if (squad.attacker && squad.healer) {
                    if (creep.memory.role == 'RoleRanger') {
                        console.log(1);
                        creep.memory.attacker = null;
                        creep.memory.healer = squad.healer.id;
                    }
                    else {
                        creep.memory.healer = null;
                        creep.memory.attacker = squad.attacker.id;
                    }
                    return false;
                }
                else {
                    return true;
                }
            }
        }

        return false;
    }

    //Returns true if there is one attacker and one healer in room, false otherwise
    static roleCall(creep) {
        var attacker = _.first(creep.room.find(FIND_MY_CREEPS, {filter: (o) => {
            return o.memory.role == 'RoleRanger';
        }}));

        var healer = _.first(creep.room.find(FIND_MY_CREEPS, {filter: (o) => {
            return o.memory.role == 'RoleHealer';
        }}));

        return {
            attacker: attacker,
            healer: healer
        };
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'Rally';
            //Console.log(creep.name + ': Rallying at spawn');
        }
    }

    //Perform action while possible
    static run(creep) {
        //If squad members have spawned we can move on
        var squad = this.roleCall(creep);

        if (squad.attacker && squad.healer) {
            if (creep.memory.role == 'RoleRanger') {
                console.log(1);
                creep.memory.attacker = null;
                creep.memory.healer = squad.healer.id;
            }
            else {
                creep.memory.healer = null;
                creep.memory.attacker = squad.attacker.id;
            }
            creep.memory.action = null;
            creep.memory.target = null;
        }
    }
}

module.exports = ActionRally;