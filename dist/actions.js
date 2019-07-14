var ActionHarvestEnergy = require('action.harvestenergy');
var ActionFillSpawn = require('action.fillspawn');
var ActionUpgradeController = require('action.upgradecontroller');
var ActionBuild = require('action.build');
var ActionFillExtension = require('action.fillextension');
var ActionRenew = require('action.renew');
var ActionPickUp = require('action.pickup');
var ActionContainerMine = require('action.containermine');
var ActionWithdraw = require('action.withdraw');
var ActionRepair = require('action.repair');
var ActionFillTower = require('action.filltower');
var ActionFillStorage = require('action.fillstorage');
var ActionWithdrawStorage = require('action.withdrawstorage');
var ActionTravel = require('action.travel');
var ActionReserve = require('action.reserve');
var ActionReturnHome = require('action.return.home');
var ActionLoot = require('action.loot');
var ActionAttack = require('action.attack');
var ActionClaim = require('action.claim');
var ActionRally = require('action.rally');
var ActionSquadTravel = require('action.squad.travel');
var ActionSquadAttack = require('action.squad.attack');
var ActionSquadHeal = require('action.squad.heal');
var ActionWithdrawMineral = require('action.withdraw.mineral');

var Actions = {
    'HarvestEnergy': ActionHarvestEnergy,
    'FillSpawn': ActionFillSpawn,
    'UpgradeController': ActionUpgradeController,
    'Build': ActionBuild,
    'FillExtension': ActionFillExtension,
    'Renew': ActionRenew,
    'PickUp': ActionPickUp,
    'ContainerMine': ActionContainerMine,
    'Withdraw': ActionWithdraw,
    'Repair': ActionRepair,
    'FillTower': ActionFillTower,
    'FillStorage': ActionFillStorage,
    'WithdrawStorage': ActionWithdrawStorage,
    'Travel': ActionTravel,
    'Reserve': ActionReserve,
    'ReturnHome': ActionReturnHome,
    'Loot': ActionLoot,
    'Attack': ActionAttack,
    'Claim': ActionClaim,
    'Rally': ActionRally,
    'SquadTravel': ActionSquadTravel,
    'SquadAttack': ActionSquadAttack,
    'SquadHeal': ActionSquadHeal,
    'WithdrawMineral': ActionWithdrawMineral
};

module.exports = Actions;