var numFields = 4;
function onOpen(e) {
 var ss = SpreadsheetApp.getUi()
 .createMenu("Plant")
 .addItem("Field 4", "plantWrapper1")
 .addItem("Field 8", "plantWrapper2")
 .addItem("Field 9", "plantWrapper3")
 .addItem("Field 26", "plantWrapper4")
 .addToUi();
}

function plantWrapper1() {plant("Field "+4);}
function plantWrapper2() {plant("Field "+8);}     
function plantWrapper3() {plant("Field "+9);}
function plantWrapper4() {plant("Field "+26);}
                                
function plant(id) {
  Logger.log(id);
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fields");
  var rangeData = ss.getRange("A3:A6");
  var rangeValues = rangeData.getValues();
  for (j=0; j< numFields; j++) {
    if(rangeValues[j] == id) {
      var date = new Date();
      ss.getRange("J"+(j+3)).setValue((date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes());
    }
  }
}

function fieldQuery() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fields");
  var rangeData = ss.getRange("A3:L6");
  var rangeValues = rangeData.getValues();
  var time;
  var diff;
  var now = new Date();
  for (j=0;j< numFields; j++) {
   time = new Date(rangeValues[j][10]);
    diff=time.getTime() - now.getTime();
    if (diff>0) {
     diff = convertMS(diff);
      Logger.log(diff);
      if(diff.day==0 && diff.hour == 0 && diff.minute<=45 && diff.minute>=20) notifyHarvest(diff,rangeValues[j][0],rangeValues[j][5]);
    }
  }
}

function notifyHarvest(time, field, crop) {
  var description = "The " + crop + " on " + field + " is " + time.minute + " minutes away from harvest!";
   var message  =     {
                   "embeds": [
                      {
                       "description": description
                        }
                     ]
                 };
                
  sendDiscord(JSON.stringify(message));
  
}
function sendDiscord(message) { 
  var discordUrl='https://discordapp.com/api/webhooks/572145063748960287/32sYnGLUFpUkiSf2FjD1OvpJPiVY32h8Ul1gLDptv6vG9hRwqNFETq9P5Jq-HhQ-Kqj-';
  var params = {
    method: "POST",
    payload: message,
    muteHttpExceptions: true
  };
  var response = UrlFetchApp.fetch(discordUrl, params);
  
  Logger.log(response.getContentText());
}

function convertMS( milliseconds ) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds
    };
}
