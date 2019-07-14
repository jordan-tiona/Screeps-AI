//Follows attacker around healing him and self
class ActionSquadHeal {

    static isValid(creep) {
        //Must be at destination
        if (creep.room.name == creep.memory.dest) {
            return true;
        }

        return false;
    }

    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'SquadHeal';
        }
    }

    static run(creep) {
        //If attacker is injured, heal him first
        var attacker = Game.getObjectById(creep.memory.attacker);

        //If attacker is dead, just heal ourself
        if (!attacker) {
            creep.heal(creep);
            return;
        }

        if (attacker.hits < attacker.hitsMax) {
            if (creep.pos.getRangeTo(attacker) > 1) {
                creep.rangedHeal(attacker);
            }
            else {
                creep.heal(attacker);
            }
        }
        else {
            creep.heal(creep);
        }

        //Move to attacker
        if (creep.pos.getRangeTo(attacker) > 1) {
            creep.moveTo(attacker);
        }
        else {
            creep.move(creep.pos.getDirectionTo(attacker));
        }
    }
}

module.exports = ActionSquadHeal;