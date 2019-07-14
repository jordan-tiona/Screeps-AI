var Actions = require('actions');

//Travels to a remote room, then attacks any hostile creeps
class RoleGuardsman {

    static run(creep) {

        //If creep is in the process of being spawned don't do anything
        if (creep.spawning) {
            return;
        }

        try {
            //CPU profiling
            var cpu = Game.cpu.getUsed();
            var actionRun = 'ActionNone';
            if (creep.memory.action == null) {
                //If we don't have an action assigned, find one

                //Populate actions list in order of priority
                var actionsList = [Actions['Travel'], Actions['Attack']];

                for (var action of actionsList) {
                    if (action.isValid(creep)) {
                        action.setupAction(creep);

                        //CPU Profiling
                        actionRun = creep.memory.action;

                        action.run(creep);
                        return;
                    }
                }
            }
            else {
                //Action already assigned, do it

                //CPU Profiling
                actionRun = creep.memory.action;

                Actions[creep.memory.action].run(creep);
            }

            //CPU Profiling
            if (Memory.stats.cpu[actionRun] == null) {
                Memory.stats.cpu[actionRun] = 0;
            }
            Memory.stats.cpu[actionRun] += Game.cpu.getUsed() - cpu;
        }
        catch (e) {
            Utils.printStack(Utils.createHtmlLinkToObject(creep) + ' had a boo boo', e.stack);
        }
    }

    //Spawn a new guardsman from spawn using up to maxEnergy energy
    static spawnCreep(spawn, maxEnergy, destRoom) {
        //One HEAL, one MOVE, and one RANGED_ATTACK, rest split evenly between MOVE and ATTACK
        maxEnergy = Math.min(maxEnergy, 1300);
        var numSegments = parseInt((maxEnergy - 500) / 130);
        var body = [];

        for (var i = 0; i < numSegments; i++) {
            body.push(ATTACK);
        }
        for (var i = 0; i < numSegments; i++) {
            body.push(MOVE);
        }

        body.push(MOVE, MOVE, RANGED_ATTACK, HEAL);

        var creepName = 'Guardsman' + Game.time;

        var opts = {
            memory: {
                role: 'RoleGuardsman',
                home: spawn.room.name,
                dest: destRoom
            }
        };
        if (spawn.spawnCreep(body, creepName, opts) == OK) {
            Utils.log('Spawning new creep: ' + Utils.createHtmlLinkToObject(Game.creeps[creepName]));
        }
    }

}

module.exports = RoleGuardsman;