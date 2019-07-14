var RoleWorker = require('role.worker');
var RoleHarvester = require('role.harvester');
var RoleUpgrader = require('role.upgrader');
var RoleHauler = require('role.hauler');
var RoleReserver = require('role.reserver');
var RolePioneer = require('role.pioneer');
var RoleGuardsman = require('role.guardsman');
var RoleLongHauler = require('role.long.hauler');
var RoleClaimer = require('role.claimer');
var RoleRemoteHarvester = require('role.remote.harvester');
var RoleRanger = require('role.ranger');
var RoleHealer = require('role.healer');

var Roles = {
    'RoleWorker': RoleWorker,
    'RoleHarvester': RoleHarvester,
    'RoleUpgrader': RoleUpgrader,
    'RoleHauler': RoleHauler,
    'RoleReserver': RoleReserver,
    'RolePioneer': RolePioneer,
    'RoleGuardsman': RoleGuardsman,
    'RoleLongHauler': RoleLongHauler,
    'RoleClaimer': RoleClaimer,
    'RoleRemoteHarvester': RoleRemoteHarvester,
    'RoleRanger': RoleRanger,
    'RoleHealer': RoleHealer
};

module.exports = Roles;