function loadCalc() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RAWDATA");
   var rangeData = ss.getDataRange();
  var lastRow = rangeData.getLastRow();
  var searchRange = ss.getRange(2,2, lastRow-1, 14);
  var rangeValues = searchRange.getValues();
  cropCalc(ss, rangeValues, lastRow);
  taxCalc(ss, rangeValues, lastRow);
  updateStatus();
  processRow(ss);
  
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function processRow(ss) {
 //Send discord here!
  //https://discordapp.com/api/webhooks/571846379996184576/GCh04ZrHMfQuuSsFvVmTj1mH_dIHxPGbjFzUAEPizitA3SVm8dHJQmETKwmcK4BLHQWu
  
  //get last row in RAWDATA
  var message = "";

  var channel ="reports";
  var latest = ss.getDataRange().getLastRow();
  var lastRow = ss.getRange(latest,1,1,15).getValues();
  lastRow = lastRow[0];
  var report = {
    type: lastRow[1],
    from: lastRow[2],
    equipment: lastRow[3],
    modifications: lastRow[4],
    crop: lastRow[5],
    quantity: numberWithCommas(lastRow[6]),
    period: numberWithCommas(lastRow[7]),
    revenue: "$"+numberWithCommas(lastRow[8]),
    expenses: "$"+numberWithCommas(lastRow[9]),
    to: lastRow[10],
    amount: "$"+numberWithCommas(Math.floor(lastRow[11])),
    description: numberWithCommas(lastRow[12]),
    auth: numberWithCommas(lastRow[13]),
  };
  var description="";
  var url = "";
  if (report.type == "Money Transfer") {
    url = "https://docs.google.com/spreadsheets/d/1qKu9sxr5YHj-z0GVlnU00ZH4Bebc6RsaG1yLkEnmss4/edit#gid=1961007078";
    description = "[Money Transfer]("+url+") requested. \n \n" + report.from + " to send " + report.amount + " to " + report.to + ". \n \n Reason: " + report.description + "\n\n";
    
  }
  else if(report.type == "Tax Report") {
    url = "https://docs.google.com/spreadsheets/d/1qKu9sxr5YHj-z0GVlnU00ZH4Bebc6RsaG1yLkEnmss4/edit#gid=1215432976";
    description ="A new [Tax Report]("+url+") has been submitted. \n \n" + report.from + " owes the Bank " + report.amount + " in taxes. \n \n"
    
  }
  else if(report.type == "Payment Request") {
    url = "https://docs.google.com/spreadsheets/d/1qKu9sxr5YHj-z0GVlnU00ZH4Bebc6RsaG1yLkEnmss4/edit#gid=1215432976";
    description = "[Payment Request]("+url+") submitted. \n \n" +report.from + " has delivered " + report.quantity + " L of " + report.crop + " to the ILT, and is owed " + report.amount + ".\n \n";
  }
  else if(report.type == "Store Order") {
    channel = "orders";
    url = "https://docs.google.com/spreadsheets/d/1qKu9sxr5YHj-z0GVlnU00ZH4Bebc6RsaG1yLkEnmss4/edit#gid=1180204641";
    description = "[Store Order]("+url+") placed by " + report.from + ". \n \n **Equipment:** "+ report.equipment + "\n\n **Details:** " + report.modifications +"\n \n";
  }
  message  =     {
                   "embeds": [
                      {
                       "description": description ,
                       "url": url,
                       "color": 16763955
                        }
                     ]
                 };
                
  sendDiscord(JSON.stringify(message), channel);
}
function sendDiscord(message, channel) { 
  var storeUrl = 'https://discordapp.com/api/webhooks/571846379996184576/GCh04ZrHMfQuuSsFvVmTj1mH_dIHxPGbjFzUAEPizitA3SVm8dHJQmETKwmcK4BLHQWu';//'https://discordapp.com/api/webhooks/572091381217230848/2ceGgLZtygH64cv6eqy54uK73vh456LWeaBuAVk8TqOq1OMTk3tQQ_McZdf176459TJI';
  var reportUrl ='https://discordapp.com/api/webhooks/572093430361227277/LThUsY6pqnSXru5kXEyeaEWr8ic0NupGpx60uD5M1C44B_B0P7-10T6OmE-3mQou3zV2'; //'https://discordapp.com/api/webhooks/572091855613722672/HMYtjhXAHLg94h_S-WcWmZhBENBn4xuzb2znnTbaf32v_spTZ6XfOLe4m7fzpfZJ_6n0';
  var discordUrl='';
  var params = {
    method: "POST",
    payload: message,
    muteHttpExceptions: true
  };
  if (channel=="orders") { discordUrl=storeUrl; } else { discordUrl = reportUrl;};
  var response = UrlFetchApp.fetch(discordUrl, params);
  
  Logger.log(response.getContentText());
}

function cropCalc(ss, rangeValues, lastRow)
{
    var formulaString="";
  for ( j = 0 ; j < lastRow - 1; j++){
    if(rangeValues[j][0] === "Money Transfer" && rangeValues[j][10]>0) { ss.getRange(j+2,12).setNumberFormat("\"$\"#,###");};
      if(rangeValues[j][0] === "Payment Request" && rangeValues[j][10] == "") {
        formulaString = "=VLOOKUP(\"" + rangeValues[j][4].toString() + "\", \'OF Prices\'!A2:B11, 2, FALSE) * " + ss.getRange(j+2,7).getA1Notation() + "/1000";
        ss.getRange(j+2,12).setValue(formulaString);
        ss.getRange(j+2,12).setNumberFormat("\"$\"#,###");
        ss.getRange(j+2,7).setNumberFormat("#,###");
      }; 
    };
}

function taxCalc(ss, rangeValues, lastRow) {
  var formulaString="";
  for ( j = 0 ; j < lastRow - 1; j++){
      if(rangeValues[j][0] === "Tax Report" && rangeValues[j][10] == "") {
        formulaString = "=SUM(" + ss.getRange(j+2,9,1,2).getA1Notation() + ") * 0.1";
        ss.getRange(j+2,12).setValue(formulaString);
        ss.getRange(j+2,12).setNumberFormat("\"$\"#,###");
        ss.getRange(j+2,9).setNumberFormat("\"$\"#,###");
        ss.getRange(j+2,10).setNumberFormat("\"$\"#,###");
      }; 
    };
}
  

function updateStatus() {
  //Payment Requests
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Payment Requests");
  var rangeData = ss.getDataRange();
  var lastRow = rangeData.getLastRow();
  var searchRange = ss.getRange(2,1,lastRow-1,15);
  var rangeValues = searchRange.getValues();
  for ( j = 0 ; j < lastRow - 1; j++) {
      if(rangeValues[j][0] != "" && (rangeValues[j][14] == "" || rangeValues[j][0] == "#NA")) ss.getRange(j+2,15).setValue("NEW");
    };
  //Money Transfers
  ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Money Transfers");
  rangeData = ss.getDataRange();
  lastRow = rangeData.getLastRow();
  searchRange = ss.getRange(2,1,lastRow-1,15);
  rangeValues = searchRange.getValues();
  for ( j = 0 ; j < lastRow - 1; j++) {
      if(rangeValues[j][0] != "" && (rangeValues[j][14] == "" || rangeValues[j][0] == "#NA")) ss.getRange(j+2,15).setValue("NEW");
    };
  //Tax Reports
  ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Tax Reports");
  rangeData = ss.getDataRange();
  lastRow = rangeData.getLastRow();
  searchRange = ss.getRange(2,1,lastRow-1,15);
  rangeValues = searchRange.getValues();
  for ( j = 0 ; j < lastRow - 1; j++) {
      if(rangeValues[j][0] != "" && (rangeValues[j][14] == "" || rangeValues[j][0] == "#NA")) ss.getRange(j+2,15).setValue("NEW");
    };
}
