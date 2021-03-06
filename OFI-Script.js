// ==UserScript==
// @name         Trucksbook Dispatch Enhanced UI
// @namespace    http://2endhunger.com
// @version      0.2.1
// @description  Truck You Hunger!
// @author       SierraOne
// @match        https://trucksbook.eu/dispatch/2
// @grant        none
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// ==/UserScript==

/** This is the Pre-Washington Patch. Expect TB update and push.**/
var dict = [];
dict["42p_print"] = "42 Print";
dict.aport_abq = "ABQ Cargo Center";
dict.aport_an124 = "ABQ Cargo Center (Airplane)";
dict.aport_pcc = "Portland Cargo Central";
dict.aport_phx = "Phoenix Freight";
dict.avs_met_scr = "Avalanche Steel (Scrapyard)";
dict.avs_met_sml = "Avalanche Steel (Factory)";
dict.bit_rd_grg = "Bitumen (Large Depot)";
dict.bit_rd_svc = "Bitumen (Small Depot)";
dict.bit_rd_wrk = "Bitumen (Roadworks)";
dict.bn_farm = "Bushnell Farms";
dict.cha_el_mkt = "Charged (Store)";
dict.cha_el_whs = "Charged (Warehouse)";
dict.chm_che_plnt = "Chemso";
dict.chm_che_str = "Chemso (Storage)";
dict.cm_min_plnt = "Coastline Mining (Depot)";
dict.cm_min_qry = "Coastline Mining (Quarry)";
dict.cm_min_str = "Coastline Mining (Storage)";
dict.dc_car_dlr = "Drake Cars (Dealer)";
dict.dg_wd_hrv = "Deepgrove (Timber Site)";
dict.dg_wd_saw = "Deepgrove (Sawmill 1)";
dict.dg_wd_saw1 = "Deepgrove (Sawmill 2)";
dict.du_farm = "Darchelle Uzau";
dict.dw_air_pln = "Darwing";
dict.ed_mkt = "Eddy's";
dict.ftf_food_pln = "Fish Tail Foods";
dict.gal_oil_gst = "Gallon Oil (Gas Station)";
dict.gal_oil_ref = "Gallon Oil (Refinery)";
dict.gal_oil_str = "Gallon Oil (Storage)";
dict.gm_chs_plnt = "Global Mills (Dairy)";
dict.gm_food_plnt = "Global Mills (Food)";
dict.hds_met_shp = "Haddock Shipyard";
dict.hf_wd_pln = "Heartwood Furniture";
dict.hms_con_svc = "HMS Machinery";
dict.hs_mkt = "Home Store (Store)";
dict.hs_whs = "Home Store (Warehouse)";
dict.mcs_con_sit = "Mud Creek Slide";
dict.oak_port = "Oakland Shippers";
dict.oh_con_hom = "Olthon Homes";
dict.pnp_wd_pln = "Page & Price Paper";
dict.pns_con_grg = "Plaster & Sons (Garage)";
dict.pns_con_sit = "Plaster & Sons (Construction Site 1)";
dict.pns_con_sit1 = "Plaster & Sons (Construction Site 2)";
dict.pns_con_sit2 = "Plaster & Sons (Construction Site 3)";
dict.pns_con_sit3 = "Plaster & Sons (Construction Site 4)";
dict.pns_con_whs = "Plaster & Sons (Warehouse)";
dict.port_sea = "Port of Seattle";
dict.port_tac = "Port of Tacoma";
dict.re_train = "Rail Export";
dict.sc_frm = "Sunshine Crops (Farm)";
dict.sc_frm_grg = "Sunshine Crops (Garage)";
dict.sf_port = "Port of San Francisco";
dict.sg_whs = "Sell Goods";
dict.sh_shp_mar = "Sea Horizon (Marina)";
dict.sh_shp_plnt = "Sea Horizon (Factory)";
dict.st_met_whs = "Steeler (Depot)";
dict.st_met_wrk = "Steeler (Factory)";
dict.tid_mkt = "Tidbit";
dict.vm_car_dlr = "Voltison Motors (Dealer)";
dict.vm_car_pln = "Voltison Motors (Factory)";
dict.vm_car_whs = "Voltison Motors (Warehouse)";
dict.wal_food_mkt = "Wallbert (Food Market)";
dict.wal_food_whs = "Wallbert (Food Warehouse)";
dict.wal_mkt = "Wallbert (Store)";
dict.wal_whs = "Wallbert (Warehouse)";

var counter=0;

var countries = [];
countries.ca = "California";
countries.nv = "Nevada (Nevada)";
countries.nm = "New Mexico (New Mexico)";
countries.or = "Oregon (Oregon)";
countries.az = "Arizona (Arizona)";
countries.wa = "Washington (Washington)";

var revertBtn, submitBtn;
var realUser;
waitForKeyElements (".show-url", addOnClick);

function addOnClick (jNode) {
   jNode[0].onclick = waitForKeyElements (".form-company",companyLoaded);
}
function companyLoaded() {
    counter++;
    if (counter==2) {
        counter=0;
        var country = document.getElementById("country_from");
        var country_to = document.getElementById("country_to");
        var nameLabel = document.getElementById("myModalLabel");
        var enableBtn = document.createElement("button");
        enableBtn.className = "btn btn-primary";
        enableBtn.innerHTML = "Enable All DLCs";
        enableBtn.style="margin-left:10px;background-color:red;";
        enableBtn.onclick=activateDLCs;
        nameLabel.parentNode.insertBefore(enableBtn, nameLabel.nextSibling);
        function activateDLCs() {
        while (country.firstChild) {
    country.removeChild(country.firstChild);
    country_to.removeChild(country_to.firstChild);
            enableBtn.style.display="none";
}
    addCountries(country);
    addCountries(country_to);
    var userElement = document.getElementById("user");
    submitBtn = document.getElementById("submit_btn");
    submitBtn.disabled = true;
    revertBtn = document.createElement("button");
        revertBtn.innerHTML = "Switch User Profile";
        revertBtn.className = "btn btn-primary";
        revertBtn.style = "margin-left:5px;background-color:red;";
        revertBtn.id = "revert_button";
        revertBtn.type = "button";
        revertBtn.onclick = revertUserID;
        submitBtn.parentNode.insertBefore(revertBtn, submitBtn.nextSibling);
    realUser = userElement.value;
    userElement.value = "127872";
    }
 var from = document.getElementById("city_from");
 var to = document.getElementById("city_to");
 from.onchange = waitForKeyElements("#company_from > option", fromCompany);
 to.onchange = waitForKeyElements("#company_to > option", toCompany);
}
}
function revertUserID() {
    document.getElementById("user").value = realUser;
    revertBtn.disabled=true;
    submitBtn.disabled=false;
}
function fromCompany() {
 var from = document.getElementById("company_from");
 var options = from.children;
   for (var j=1;j<options.length;j++) {
    options[j].innerHTML = dict[options[j].value];
   }
}

function toCompany() {
 var to = document.getElementById("company_to");
 var options = to.children;
   for (var j=1;j<options.length;j++) {
    options[j].innerHTML = dict[options[j].value];
   }
}

function addCountries(countryList) {
  var emptyNode = optionMaker(0,"Select State");
    var stateNode;
    countryList.appendChild(emptyNode);
    Object.keys(countries).forEach(function(key,index) {
    stateNode = optionMaker(key,countries[key]);
      countryList.appendChild(stateNode);
});
}


function optionMaker(data,text) {
    var option = document.createElement("option");
    option.value = data;
    option.innerHTML = text;
    return option;
}
