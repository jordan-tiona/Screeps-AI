var Actions = require('actions');

//Upgrades room controller
class RoleUpgrader {

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
                var actionsList = [Actions['UpgradeController'], Actions['PickUp'], Actions['Withdraw'], Actions['WithdrawStorage']];

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
        var numSegments = parseInt(maxEnergy / 300);
        var body = [];

        for (var i = 0; i < numSegments; i++) {
            body.push(WORK);
        }
        for (var i = 0; i < numSegments; i++) {
            body.push(CARRY, CARRY);
        }
        for (var i = 0; i < numSegments; i++) {
            body.push(MOVE, MOVE);
        }

        var creepName = 'Upgrader' + Game.time;

        var opts = {
            memory: {
                role: 'RoleUpgrader',
                home: spawn.room.name
            }
        };

        if (spawn.spawnCreep(body, creepName, opts) == OK) {
            Utils.log('Spawning new creep: ' + Utils.createHtmlLinkToObject(Game.creeps[creepName]));
        }
    }

}

module.exports = RoleUpgrader;