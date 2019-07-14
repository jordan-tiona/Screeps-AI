var Actions = require('actions');

//Container mining harvester
class RoleHarvester {

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

                /*
                 *If we don't have an action assigned, find one
                 *Populate actions list in order of priority
                 */
                var actionsList = [Actions['ContainerMine']];

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

    //Spawn a new harvester from spawn using up to maxEnergy energy
    static spawnCreep(spawn, maxEnergy) {
        //Harvester is 2 MOVE parts and then the rest is filled with WORK parts, up to 5
        var numWorkParts = parseInt((maxEnergy - 100) / 100);
        if (numWorkParts > 12) {
            numWorkParts = 12;
        }

        var body = [];

        for (var i = 0; i < numWorkParts; i++) {
            body.push(WORK);
        }

        body.push(MOVE, MOVE);

        var creepName = 'Harvester' + Game.time;

        var opts = {
            memory: {
                role: 'RoleHarvester',
                home: spawn.room.name
            }
        };

        if (spawn.spawnCreep(body, creepName, opts) == OK) {
            Utils.log('Spawning new creep: ' + Utils.createHtmlLinkToObject(Game.creeps[creepName]));
        }
    }

}

module.exports = RoleHarvester;