var Actions = require('actions');

//General purpose hauler
class RoleHauler {

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
                var actionsList = [Actions['FillSpawn'], Actions['FillExtension'], Actions['FillTower'], Actions['FillStorage'], Actions['PickUp'], Actions['WithdrawStorage'], Actions['Withdraw'], Actions['WithdrawMineral']];

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

    //Spawn a new hauler from spawn using up to maxEnergy energy
    static spawnCreep(spawn, maxEnergy) {
        //Hauler is equal parts carry and move
        maxEnergy = Math.min(maxEnergy, 1200);
        var numSegments = parseInt(maxEnergy / 100);
        var body = [];

        for (var i = 0; i < numSegments; i++) {
            body.push(CARRY);
        }
        for (var i = 0; i < numSegments; i++) {
            body.push(MOVE);
        }

        var creepName = 'Hauler' + Game.time;

        var opts = {
            memory: {
                role: 'RoleHauler',
                home: spawn.room.name
            }
        };

        if (spawn.spawnCreep(body, creepName, opts) == OK) {
            Utils.log('Spawning new creep: ' + Utils.createHtmlLinkToObject(Game.creeps[creepName]));
        }
    }

}

module.exports = RoleHauler;