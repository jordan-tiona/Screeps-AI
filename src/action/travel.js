//Travel to destination
class ActionTravel {

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
            creep.memory.action = 'Travel';
            //Console.log(creep.name + ': Traveling');
        }
        if (creep.memory.exit == null) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.dest);
            var exit = creep.pos.findClosestByPath(exitDir);
            creep.memory.exit = {};
            creep.memory.exit.roomName = exit.roomName;
            creep.memory.exit.x = exit.x;
            creep.memory.exit.y = exit.y;
        }
    }

    //Perform action while possible
    static run(creep) {

        if (creep.room.name == creep.memory.dest) {
            //Gotta move away from the exit tile
            var dir = creep.pos.getDirectionTo(25, 25);
            creep.move(dir);
            creep.memory.action = null;
            creep.memory.exit = null;
            return;
        }

        //If we're in a different room than our exit, reset it
        if (creep.memory.exit.roomName != creep.room.name) {
            creep.memory.exit = null;
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

        //Move to the exit
        var exit = new RoomPosition(creep.memory.exit.x, creep.memory.exit.y, creep.memory.exit.roomName);
        creep.moveTo(exit);
    }
}

module.exports = ActionTravel;