module.exports = {

    /*
     * Creates a HTML clickable link to specified object.
     * Used for placing clickable links in console.
     */
    createHtmlLinkToObject: function(thing, addCoords = false) {
        // If thing is a Room object, use special function
        if (thing instanceof Room) {
            return this.createHtmlLinkToRoom(thing.name);
        }

        // If thing is a RoomPosition object, use special function
        if (thing instanceof RoomPosition) {
            return this.createHtmlLinkToRoomPosition(thing);
        }

        if (!thing) {
            return thing;
        }

        if (!thing.pos) {
            return thing.toString();
        }

        var onClick = `angular.element('body').injector().get('RoomViewPendingSelector').set('${thing.id}');`;
        var text = `${ thing.pos.roomName }`;

        if (thing.name) {
            text += `/${ thing.name }`;
        }
        else if (thing.structureType) {
            text += `/${ thing.structureType }`;
        }
        else if (thing instanceof Source) {
            text += `/source`;
        }
        else if (thing instanceof Resource) {
            text += `/resource`;
        }
        else if (thing instanceof Tombstone) {
            text += `/tombstone`;
        }

        if (addCoords) {
            text +=  ` (${ thing.pos.x },${ thing.pos.y })`;
        }

        return `<a href="#!/room/${Game.shard.name}/${thing.pos.roomName}" onClick="${onClick}">[${text}]</a>`;

    },

    /*
     * Creates a HTML clickable link to specified room.
     * Used for placing clickable links in console.
     */
    createHtmlLinkToRoom: function(roomName) {
        if (!roomName) {
            return null;
        }

        return `<a href="#!/room/${Game.shard.name}/${roomName}">[${roomName}]</a>`;
    },

    /*
     * Creates a HTML clickable link to specified room with given position coordinates in text.
     * Used for placing clickable links in console.
     */
    createHtmlLinkToRoomPosition: function(roomPosition) {
        if (!roomPosition) {
            return null;
        }

        return `<a href="#!/room/${Game.shard.name}/${roomPosition.roomName}">[${roomPosition.roomName}/${roomPosition.x},${roomPosition.y}]</a>`;
    },

    printStack: function(summary, stack) {
        var output = '<font color="lightcoral"><details><summary>' + summary + '</summary>' + stack + '</details></font>';
        console.log(output);
    },

    printEmpireSummary: function() {
        var output = '<details><summary>Empire Summary (' + Game.time + ')</summary>';

        output += '<details><summary>Room Tallies</summary>';
        for (var roomName in Memory.rooms) {
            output += '<details><summary>' + this.createHtmlLinkToRoom(roomName) + '</summary><ul>';
            for (var roleName in Memory.rooms[roomName].creeps) {
                if (roleName != 'total') {
                    output += '<li>' + roleName + ': ' + Memory.rooms[roomName].creeps[roleName] + '</li>';
                }
            }

            output += '</ul></details>';
        }

        output += '</details></details>';
        console.log(output);
    },

    printMessages: function() {
        var output = '<details open="true"><summary>Messages';

        if (Memory.messages) {
            output += ' (' + _.size(Memory.messages) + ')';
        }
        else {
            output += ' (0)';
        }

        output += ' Tick: ' + Game.time + '</summary>';

        if (Memory.messages) {
            output += '<ul>';
            for (var tick in Memory.messages) {
                output += '<li>' + tick + ': ' + Memory.messages[tick] + '</li>';
            }
            output += '</ul>';
            delete Memory.messages;
        }

        output += '</details>';
        console.log(output);
    },

    log: function(message) {
        if (Memory.messages == null) {
            Memory.messages = {};
        }

        Memory.messages[Game.time] = message;
    },

    isObstacle: _.zipObject(OBSTACLE_OBJECT_TYPES.map(x => [x, true])),

    isWalkable: function(pos, includeCreeps = false) {
        return !(
            includeCreeps && pos.lookFor(LOOK_CREEPS).length ||
            _.any(pos.lookFor(LOOK_TERRAIN), x => this.isObstacle[x]) ||
            _.any(pos.lookFor(LOOK_STRUCTURES), x => this.isObstacle[x.structureType] || x.structureType === STRUCTURE_RAMPART && !x.isPublic && !x.my)
        );
    }
};