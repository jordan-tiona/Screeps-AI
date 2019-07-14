//Travel to destination
class ActionSquadTravel {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (creep.memory.dest) {
            if (creep.room.name != creep.memory.dest) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'SquadTravel';
            //Console.log(creep.name + ': Traveling with squad');
        }

        //If we're the attacker then we call the shots
        if (creep.memory.role == 'RoleRanger') {
            if (creep.memory.exit == null) {
                var exitDir = Game.map.findExit(creep.room, creep.memory.dest);
                var exit = creep.pos.findClosestByPath(exitDir);
                creep.memory.exit = {};
                creep.memory.exit.roomName = exit.roomName;
                creep.memory.exit.x = exit.x;
                creep.memory.exit.y = exit.y;
            }
        }
    }

    //Perform action while possible
    static run(creep) {

        //If we're the attacker then we call the shots
        if (creep.memory.role == 'RoleRanger') {
            if (creep.room.name == creep.memory.dest) {
                //Gotta move away from the exit tile
                var dir = creep.pos.getDirectionTo(25, 25);
                creep.move(dir);
                creep.memory.action = null;
                creep.memory.exit = null;
                return;
            }

            //If we're in a different room than our exit, reset it
            if (creep.memory.exit){
                if (creep.memory.exit.roomName != creep.room.name) {
                    creep.memory.exit = null;
                }
            }

            //If we don't have an exit, get one
            if (creep.memory.exit == null) {
                var exitDir = Game.map.findExit(creep.room, creep.memory.dest);
                var exit = creep.pos.findClosestByPath(exitDir);
                creep.memory.exit = {};
                creep.memory.exit.roomName = exit.roomName;
                creep.memory.exit.x = exit.x;
                creep.memory.exit.y = exit.y;
            }

            var healer = Game.getObjectById(creep.memory.healer);
            if (healer) {
                if (creep.room.name != healer.room.name) {
                    //Wait for him off an exit tile
                    if (this.onExit(creep.pos)) {
                        var dir = creep.pos.getDirectionTo(25, 25);
                        creep.move(dir);
                    }
                    return;
                }
                var range = creep.pos.getRangeTo(healer);
                if (range > 1 || healer.fatigue != 0) {
                    //Wait for him
                    return;
                }

            }
            //Move to the exit
            var exit = new RoomPosition(creep.memory.exit.x, creep.memory.exit.y, creep.memory.exit.roomName);
            creep.moveTo(exit);
        }
        else {
            //Gotta move away from the exit tile
            if (creep.room.name == creep.memory.dest) {
                //Gotta move away from the exit tile
                var dir = creep.pos.getDirectionTo(25, 25);
                creep.move(dir);
                creep.memory.action = null;
                creep.memory.exit = null;
                return;
            }

            //Follow the attacker
            var attacker = Game.getObjectById(creep.memory.attacker);
            if (attacker) {
                if (creep.room.name != attacker.room.name) {
                    creep.moveTo(attacker);
                    return;
                }
                if (creep.pos.getRangeTo(attacker) > 1) {
                    creep.moveTo(attacker);
                }
                else {
                    creep.move(creep.pos.getDirectionTo(attacker));
                }
            }
        }
    }

    static onExit(pos) {
        var x = pos.x;
        var y = pos.y;
        if (x == 0 || x == 49 || y == 0 || y == 49) {
            return true;
        }
        else {
            return false;
        }
    }
}

module.exports = ActionSquadTravel;