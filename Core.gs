var priceList = [500,520,890,1030,1170,675,1125,240,210,170,500,50];
var priceListKeys = ["Wheat","Barley","Oats","Canola","Soybeans","Corn","Sunflowers","Potatoes","Sugarbeet","Sugarcane","Digestate","Straw"];
var taxReport = function (farm,period,newVehicles,soldVehicles,newLivestock,soldAnimals,construction,soldBuildings,landPurchase,soldLand,vehicleRunning,vehicleLeasing,animalUpkeep,propMaintain,propIncome,soldWood,soldBales,soldWool,soldMilk,fuel,seed,fertilizer,saplings,water,harvestIncome,biogasIncome,contractsIncome,wagePayment,other) {
  this.farm = farm;
  this.period = period;
  this.newVehicles = newVehicles;
  this.soldVehicles = soldVehicles;
  this.newLivestock = newLivestock;
  this.soldAnimals = soldAnimals;
  this.construction = construction;
  this.soldBuildings = soldBuildings;
  this.landPurchase = landPurchase;
  this.soldLand = soldLand;
  this.vehicleRunning = vehicleRunning;
  this.vehicleLeasing = vehicleLeasing;
  this.animalUpkeep = animalUpkeep;
  this.propMaintain = propMaintain;
  this.propIncome = propIncome;
  this.soldWood = soldWood;
  this.soldBales = soldBales;
  this.soldWool = soldWool;
  this.soldMilk = soldMilk;
  this.fuel = fuel;
  this.seed = seed;
  this.fertilizer = fertilizer;
  this.saplings = saplings;
  this.water = water;
  this.harvestIncome = harvestIncome;
  this.biogasIncome = biogasIncome;
  this.contractsIncome = contractsIncome;
  this.wagePayment = wagePayment;
  this.other = other;
  this.income = 0;
  this.expenses = 0;
  this.commissionSplit = "";
  this.calculateIncome = function() {
    this.income = this.soldVehicles + this.soldAnimals + this.soldBuildings + this.soldLand + this.propIncome + this.soldWood + this.soldBales + this.soldWool + this.soldMilk + this.harvestIncome + this.biogasIncome + this.contractsIncome;
    if (this.other>0) this.income+=this.other;
  };
  this.calculateExpenses = function() {
    this.expenses = this.newVehicles + this.newLivestock + this.construction + this.landPurchase + this.vehicleRunning +this.vehicleLeasing + this.animalUpkeep + this.propMaintain + this.fuel + this.seed + this.fertilizer + this.saplings +this.water +this.wagePayment;
    if (this.other<0) this.expenses+=this.other;
  };
  this.calculateIncome();
  this.calculateExpenses();
};
var common = function (date,auth,type) {
  this.date = date;
  this.auth = auth;
  this.type = type;
};
var incomeReport = function(crop,farm,quantity) {
  this.crop = crop;
  this.farm = farm;
  this.quantity = quantity;
  this.total = 0;
  
  this.calculateTotal = function() {
    this.total = priceList[priceListKeys.indexOf(this.crop)] * this.quantity / 1000;
  };
  this.calculateTotal();
};
var moneyTransfer = function (from,to,amount,reason) {
  this.from = from;
  this.to = to;
  this.amount = amount;
  this.reason = reason;
};
var storeOrder = function (farm,equipment,modification) {
  this.farm = farm;
  this.equipment = equipment;
  this.modification = modification;
};

var reportRow = function(common,incomeReport,taxReport,moneyTransfer,storeOrder) {
  this.common = common;
  this.incomeReport = incomeReport;
  this.taxReport = taxReport;
  this.moneyTransfer = moneyTransfer;
  this.storeOrder = storeOrder;
  this.status = "NEW";
  
  var changeStatus = function(status) {
   this.status = status; 
  }
}

function copy(sourceRow, destinationRow, content) {
 
}

function loadNew() {
 var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RAWDATA");
 var rangeData = ss.getDataRange();
 var lastRow = rangeData.getLastRow();
 var data = rangeData.getValues();
  var newRow = data[lastRow-1];
  var newReport = new reportRow();
  //set common cols
  newReport.common = loadCommon(newRow.slice(0,3));
  newReport.incomeReport = loadIncomeReport(newRow.slice(3,6));
  newReport.taxReport = loadTaxReport(newRow.slice(6,35));
  newReport.moneyTransfer = new moneyTransfer(newRow[36],newRow[37],newRow[38],newRow[39]);
  newReport.storeOrder = new storeOrder(newRow[40],newRow[41],newRow[42]);
  Logger.log(newReport.taxReport.soldLand);
}
function loadCommon(range) {
  return new common(range[0],range[1],range[2]);
}
    function loadIncomeReport(range) {
   return new incomeReport(range[0],range[1],range[2]);
  }
function loadTaxReport(range) {
return new taxReport(range[0],range[1],range[2],range[3],range[4],range[5],range[6],range[7],range[8],range[9],range[10],range[11],range[12],range[13],range[14],range[15],range[16],range[17],range[18],range[19],range[20],range[21],range[22],range[23],range[24],range[25],range[26],range[27],range[28]); 
}
