var Actions = require('actions');

//Default multipurpose worker for early controller levels
class RoleWorker {

    static run(creep) {

        //Auto build roads?
        if (creep.room.find(FIND_FLAGS, {filter: function(o) {
            return o.color == COLOR_BROWN;
        }}).length > 0) {
            if (_.filter(creep.pos.lookFor(LOOK_STRUCTURES), function(o) {
                return o.structureType == STRUCTURE_ROAD;
            }).length == 0) {
                var numConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES).length;
                if (numConstructionSites < 4) {
                    creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                }
            }
        }

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
                var actionsList = [Actions['FillSpawn'], Actions['FillExtension'], Actions['Repair'], Actions['Build'], Actions['UpgradeController'], Actions['PickUp'], Actions['Withdraw'], Actions['WithdrawStorage'], Actions['HarvestEnergy']];

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

    //Spawn a new worker from spawn using up to maxEnergy energy
    static spawnCreep(spawn, maxEnergy) {

        //WORK (100), CARRY (50), MOVE (50)
        var segmentCost = 200;
        var numSegments = parseInt(maxEnergy / segmentCost);
        var body = [];

        for (let i = 0; i < numSegments; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numSegments; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numSegments; i++) {
            body.push(MOVE);
        }

        var creepName = 'Worker' + Game.time;

        var opts = {
            memory: {
                role: 'RoleWorker',
                home: spawn.room.name
            }
        };
        if (spawn.spawnCreep(body, creepName, opts) == OK) {
            Utils.log('Spawning new creep: ' + Utils.createHtmlLinkToObject(Game.creeps[creepName]));
        }
    }

}

module.exports = RoleWorker;