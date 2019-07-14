//Return to home room
class ActionReturnHome {

    //Checks if this action is one that can be performed right now
    static isValid(creep) {

        if (creep.memory.home) {
            if (creep.room.name != creep.memory.home) {
                return true;
            }
        }

        return false;
    }

    //Set creep memory
    static setupAction(creep) {

        if (creep.memory.action == null) {
            creep.memory.action = 'ReturnHome';
            //Console.log(creep.name + ': Returning Home  ');
        }
        if (creep.memory.exit == null) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.home);
            var exit = creep.pos.findClosestByPath(exitDir);
            creep.memory.exit = {};
            creep.memory.exit.roomName = exit.roomName;
            creep.memory.exit.x = exit.x;
            creep.memory.exit.y = exit.y;
        }
    }

    //Perform action while possible
    static run(creep) {

        if (creep.room.name == creep.memory.home) {
            //Gotta move away from the exit tile
            var dir = creep.pos.getDirectionTo(25, 25);
            creep.move(dir);
            creep.memory.action = null;
            creep.memory.exit = null;
            return;
        }

        //If exit is in another room, get a new one
        if (creep.memory.exit.roomName != creep.room.name) {
            creep.memory.exit = null;
        }

        //If we don't have an exit, get one
        if (creep.memory.exit == null) {
            var exitDir = Game.map.findExit(creep.room, creep.memory.home);
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

module.exports = ActionReturnHome;