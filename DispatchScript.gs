var ss = SpreadsheetApp.getActiveSpreadsheet();
 var cache = CacheService.getUserCache();
function removeCache() {
  cache.remove("TBUser");
  cache.remove("TBPwd");
  Browser.msgBox("Successfully logged out of Trucksbook");
}

function onInstall(e) {
 onOpen(e); 
}

function onOpen(e) {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Dispatcher')
      .addItem('Dispatch by Cargo', 'dispatchByCargo')
      .addItem('Dispatch by City', 'dispatchByCity')
      .addItem('Logout', 'removeCache')
      .addToUi();
  getEmployees();
}
function Dispatch(company,user,game,cargo,city_from,country_from,company_from,city_to,country_to,company_to) {
 this.user = user;
 this.company = company;
 this.game = game;
 this.cargo = cargo;
 this.country_from = country_from;
 this.country_to = country_to;
 this.city_from = city_from;
 this.city_to = city_to;
 this.company_from = company_from;
 this.company_to = company_to;
 this.cookie = "";
  
  this.dispatch = function () {
      this.cookie=logIn();
    if (this.cookie =="") return null;
  var url = "https://trucksbook.eu/components/app/dispatch/add_delivery.php?deliveries_id=1";
  var payload =
      {
        "company" : this.company,
        "user" : this.user,
        "game" : this.game,
        "cargo" : this.cargo,
        "city_from" : this.city_from,
        "company_from" : this.company_from,
        "city_to" : this.city_to,
        "company_to" : this.company_to,
        "country_from" : this.country_from,
        "country_to" : this.country_to
      };
  
  var options =
      {
        "method"  : "POST",
        "payload" : payload,   
        "followRedirects" : true,
        "Connection" : "keep-alive",
        "muteHttpExceptions": true,
        "headers": {
            "Cookie": "PHPSESSID="+this.cookie
         }
      };
    var result = HTTPRequestHandler(url,payload,options);
    if (result) Browser.msgBox("Dispatch sent!");

}
}
function dispatchByCargo() {
  if (ss.getSheetByName("Search by Cargo").getRange("B12").getValue() != "Error in Dispatch.") {
   dispatchPre("Search by Cargo");
  }
  else
  {
   Browser.msgBox("This dispatch is not valid"); 
  }
}
function dispatchByCity() {
  if (ss.getSheetByName("Search by City").getRange("B12").getValue() != "Error in Dispatch.") {
   dispatchPre("Search by City");
  }
  else
  {
   Browser.msgBox("This dispatch is not valid"); 
  }
}
function dispatchPre(sheetName) {
  var data = ss.getSheetByName(sheetName).getRange("F3:F12").getValues();
 var newDispatch = new Dispatch(data[0][0],data[1][0],data[2][0],data[3][0],data[4][0],data[5][0],data[6][0],data[7][0],data[8][0],data[9][0]);
 newDispatch.dispatch();
}


function getCookie(input) {
  var name = "PHPSESSID=";
  var decodedCookie = decodeURIComponent(input);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function logIn() {
  var name,pwd;
  if (cache.get("TBUser")) {
   name = cache.get("TBUser");
   pwd = cache.get("TBPwd");
  }
  else
  {
  name = Browser.inputBox('TB Login', 'Email', Browser.Buttons.OK_CANCEL);
  pwd = Browser.inputBox('TB Login', 'Password', Browser.Buttons.OK_CANCEL);
  cache.put("TBUser",name,604800);
  cache.put("TBPwd", pwd, 604800);
  }
  var testresponse = UrlFetchApp.fetch("https://trucksbook.eu/");
  var cookie = getCookie(testresponse.getAllHeaders()['Set-Cookie']);
  Logger.log("New Cookie generated: "+cookie);
  var url = "https://trucksbook.eu/components/notlogged/login.php";
  var payload =
      {
        "email" : name,
        "pass" : pwd
      };
  
  var options =
      {
        "method"  : "POST",
        "payload" : payload,   
        "Referer" : "https://trucksbook.eu/",
        "Connection" : "keep-alive",
        "headers" : {
          "Cookie" : "PHPSESSID="+cookie   
        }
      };
  if (HTTPRequestHandler(url,payload,options)) 
  {
    var testresponse = HTTPRequestHandler("https://trucksbook.eu/",null,{"headers" : {"Cookie" : "PHPSESSID="+cookie}});
   var document = testresponse.getContentText();
    if (document.indexOf("Dispatch")>-1) {
    return cookie; 
    }
    else
    {
      Browser.msgBox("You do not have dispatch permissions.");
      return "";
    }
  }
}

function HTTPRequestHandler(url,payload,options) {
  Logger.log(url);
  Logger.log(payload);
  Logger.log(payload);
  var result = UrlFetchApp.fetch(url, options);
  if (result.getResponseCode() != 200) return false;
   return result;
}

function getEmployees() {
  var testresponse = UrlFetchApp.fetch(" https://trucksbook.eu/components/app/company/employee_list.php?id=41297 ");
  Logger.log(testresponse.getContentText());
}
