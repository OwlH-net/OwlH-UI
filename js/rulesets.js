function GetAllRulesets() {
    var resultElement = document.getElementById('rulesets-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlAllRules = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset';
    axios({
        method: 'get',
        url: urlAllRules,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        console.log(response.data);
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            resultElement.innerHTML = generateAllRulesetsHTMLOutput(response);
        }
    })
    .catch(function (error) {
        resultElement.innerHTML = '<div style="text-align:center"><h3>No connection</h3></div>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function EditExistingRuleset(name,uuid, desc){
    document.location.href = 'https://' + location.host + '/modify-ruleset.html?name='+name+'&uuid='+uuid+'&desc='+desc;
}

function generateAllRulesetsHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving data for rulesets</h3></div>';
    }  
    var isEmptyRulesets = true;
    var type = "ruleset";
    var ruleset = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>Name</th>                                                ' +
        '<th>Description</th>                                         ' +
        '<th width="20%">Actions</th>                                 ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody >                                                     '
    for (uuid in ruleset) {
        if (ruleset[uuid]["type"] == "source") {
            continue;
        }
        isEmptyRulesets = false;
        html = html + '<tr><td style="word-wrap: break-word;">' ;
            if(ruleset[uuid]["default"] == "true"){
                html = html + ruleset[uuid]["name"] + '&nbsp <span class="badge bg-success align-text-bottom text-white">Default</span>';                 
            }else{
                html = html + ruleset[uuid]["name"] ;
            }
            html = html + '</td><td style="word-wrap: break-word;">' +
            ruleset[uuid]["desc"] +
            '</td><td style="word-wrap: break-word;">' +
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<i class="fas fa-info-circle" title="Details" style="cursor:pointer;" onclick="loadRulesetsDetails(\''+type+'\',\''+ruleset[uuid]['name']+'\',\''+uuid+'\')"></i> &nbsp'+
                    '<i class="fas fa-star" title="Set as default ruleset" style="cursor:pointer;" onclick="setDefault(\''+uuid+'\')"></i> &nbsp'+
                    '<i class="fas fa-sync-alt" style="cursor:pointer;" title="Sync ruleset files" id="sync-ruleset-files" data-toggle="modal" data-target="#modal-ruleset" onclick="syncRulesetModal(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>&nbsp';
                    if(ruleset[uuid]["status"]=="enabled"){
                        html = html + '<i class="fas fa-stopwatch" style="color:green; cursor:pointer;" title="Update schedule" data-toggle="modal" data-target="#modal-ruleset" onclick="modalTimeSchedule(\''+uuid+'\',\''+ruleset[uuid]['name']+'\',\''+ruleset[uuid]["status"]+'\')"></i>&nbsp'+
                        '<i class="far fa-clipboard" style="cursor:pointer;" title="Scheduler LOG" onclick="modalShowLog(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>&nbsp';
                    }else if(ruleset[uuid]["status"]=="disabled"){
                        html = html + '<i class="fas fa-stopwatch" style="color:red; cursor:pointer;" title="Update schedule" data-toggle="modal" data-target="#modal-ruleset" onclick="modalTimeSchedule(\''+uuid+'\',\''+ruleset[uuid]['name']+'\',\''+ruleset[uuid]["status"]+'\')"></i>&nbsp'+
                        '<i class="far fa-clipboard" style="cursor:pointer;" title="Scheduler LOG" onclick="modalShowLog(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>&nbsp';
                    }else{
                        html = html + '<i class="fas fa-stopwatch" style="color:grey; cursor:pointer;" title="Update schedule" data-toggle="modal" data-target="#modal-ruleset" onclick="modalTimeSchedule(\''+uuid+'\',\''+ruleset[uuid]['name']+'\',\''+ruleset[uuid]["status"]+'\')"></i>&nbsp';                        
                    }
                    html = html + '<i class="fas fa-edit" style="color: dodgerblue; cursor:pointer;" title="Edit ruleset" onclick="EditExistingRuleset(\''+ruleset[uuid]["name"]+'\',\''+uuid+'\', \''+ruleset[uuid]["desc"]+'\')"></i>&nbsp'+
                    '<i class="fas fa-trash-alt" style="color: red; cursor:pointer; title="Delete source" data-toggle="modal" data-target="#modal-ruleset" onclick="deleteRulesetModal(\''+ruleset[uuid]["name"]+'\',\''+uuid+'\')"></i>'+
                '</span>'+
            '</td></tr>';
    }
    html = html + '</tbody></table>';

    document.getElementById('search-input-ruesets').innerHTML = '<input class="form-control mx-3" type="text" placeholder="Search by rule description..." aria-label="Search" id="search-ruleset-details">'+
            '<a type="button" class="btn btn-primary" onclick="loadRulesetBySearch()"><i class="fas fa-search" style="color: white;"></i></a>';

    if (isEmptyRulesets) {
        return '<div style="text-align:center"><h3>No Rules available...</h3></div>';
    } else {
        return html;
    }
}

function loadRulesetBySearch(){
    var search = document.getElementById('search-ruleset-details').value;
    if(search.length >= 3){
        document.location.href = 'https://' + location.host + '/ruleset-search.html?&search='+search;
    }else{
        $('#search-ruleset-details').val("");
        $('#search-ruleset-details').css('border', '2px solid red');
        $('#search-ruleset-details').attr("placeholder", "To make a search, please insert 3 or more characters");
    }
}

function modalShowLog(uuid, name){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var modalWindow = document.getElementById('modal-ruleset');
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/scheduler/log/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                var ruleset = response.data;
                html = 
                '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+
                
                        '<div class="modal-header" style="word-break: break-all;">'+
                            '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Log for ruleset '+name+'</h4>'+
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '</div>'+
                
                        '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+
                            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                            '<thead>                                                      ' +
                                '<tr>                                                         ' +
                                '<th>Time</th>                                                ' +
                                '<th>Log</th>                                         ' +
                                '</tr>                                                        ' +
                            '</thead>                                                     ' +
                            '<tbody>                                                     ';
                            for (uuid in ruleset) {
                                for (param in ruleset[uuid]) {
                                    html = html + '<tr><td style="word-wrap: break-word;">' +
                                    new Date(param * 1000) +
                                    '</td><td style="word-wrap: break-word;">  ' +
                                    ruleset[uuid][param] +
                                    '</td></tr>';
                                }
                            }
                        '</div>'+        
                    '</div>'+
                '</div>';
                modalWindow.innerHTML = html;
                $('#modal-ruleset').modal("show");
            }
        })
        .catch(function (error) {
        });
}

function modalTimeSchedule(uuid, name, status){
    var today = new Date();
    var modalWindow = document.getElementById('modal-ruleset');    
    var html =
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
            
                    '<div class="modal-header" style="word-break: break-all;">'+
                        '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">'+name+' time schedule</h4>'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '</div>';
    
            if(status=="enabled"){
                html = html + '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
                    // '<div>'+
                        // '<div class="radio">'+
                        '<p>Do you want to stop the scheduler for <b>'+name+'</b> ruleset?</p>'+
                            // '<div class="custom-control custom-radio custom-control-inline">'+
                            //     '<input type="radio" id="status-disable" name="update-status" value="disabled" class="custom-control-input" checked>'+
                            //     '<label class="custom-control-label" for="status-disable">Disable scheduler</label>'+
                            // '</div>'+
                        // '</div>'+
                    '</div>'+
                    '<br>'+
                    
                    //submit button
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+    
                        '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="timeSchedule(\''+uuid+'\',\''+status+'\')">Stop task</button>'+
                    '</div>'+
                '</div>';
            }else{                
                html = html + '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
                        
                    //select update type
                    '<p>Update type:</p>'+
                    '<div class="radio">'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="schedule-overwrite" name="update-type" value="overwrite" class="custom-control-input" checked>'+
                            '<label class="custom-control-label" for="schedule-overwrite">Overwrite ruleset</label>'+
                        '</div>'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="schedule-add-lines" name="update-type" value="add-lines" class="custom-control-input">'+
                            '<label class="custom-control-label" for="schedule-add-lines">Add new rules</label>'+
                        '</div>'+
                    '</div>'+
                    '<br>'+

                    //Select date
                    '<p>Start date:</p>'+
                    '<div class="input-group">'+
                        '<select class="form-control" name="Month" id="schedule-date-month">'+
                            '<option value="01">January</a>'+
                            '<option value="02">February</a>'+
                            '<option value="03">March</a>'+
                            '<option value="04">April</a>'+
                            '<option value="05">May</a>'+
                            '<option value="06">June</a>'+
                            '<option value="07">July</a>'+
                            '<option value="08">August</a>'+
                            '<option value="09">September</a>'+
                            '<option value="10">October</a>'+
                            '<option value="11">November</a>'+
                            '<option value="12">December</a>'+
                        '</select>'+
                        '<select class="form-control" name="Day" id="schedule-date-day">'+
                            '<option value="01">1</a>'+
                            '<option value="02">2</a>'+
                            '<option value="03">3</a>'+
                            '<option value="04">4</a>'+
                            '<option value="05">5</a>'+
                            '<option value="06">6</a>'+
                            '<option value="07">7</a>'+
                            '<option value="08">8</a>'+
                            '<option value="09">9</a>'+
                            '<option value="10">10</a>'+
                            '<option value="11">11</a>'+
                            '<option value="12">12</a>'+
                            '<option value="13">13</a>'+
                            '<option value="14">14</a>'+
                            '<option value="15">15</a>'+
                            '<option value="16">16</a>'+
                            '<option value="17">17</a>'+
                            '<option value="18">18</a>'+
                            '<option value="19">19</a>'+
                            '<option value="20">20</a>'+
                            '<option value="21">21</a>'+
                            '<option value="22">22</a>'+
                            '<option value="23">23</a>'+
                            '<option value="24">24</a>'+
                            '<option value="25">25</a>'+
                            '<option value="26">26</a>'+
                            '<option value="27">27</a>'+
                            '<option value="28">28</a>'+
                            '<option value="29">29</a>'+
                            '<option value="30">30</a>'+
                            '<option value="31">31</a>'+
                        '</select>'+
                        '<select class="form-control" name="Year" id="schedule-date-year">'+
                            '<option value="'+(today.getFullYear())+'">'+(today.getFullYear())+'</a>'+
                            '<option value="'+(today.getFullYear()+1)+'">'+(today.getFullYear()+1)+'</a>'+
                            '<option value="'+(today.getFullYear()+2)+'">'+(today.getFullYear()+2)+'</a>'+
                        '</select>'+
                    '</div>'+
                    '<br>'+

                    //Select time
                    '<p>Start time:</p>'+
                    '<div class="input-group">'+
                        '<select class="form-control" name="Hour" id="schedule-time-hour">'+
                            '<option value="00">00</a>'+
                            '<option value="01">01</a>'+
                            '<option value="02">02</a>'+
                            '<option value="03">03</a>'+
                            '<option value="04">04</a>'+
                            '<option value="05">05</a>'+
                            '<option value="06">06</a>'+
                            '<option value="07">07</a>'+
                            '<option value="08">08</a>'+
                            '<option value="09">09</a>'+
                            '<option value="10">10</a>'+
                            '<option value="11">11</a>'+
                            '<option value="12">12</a>'+
                            '<option value="13">13</a>'+
                            '<option value="14">14</a>'+
                            '<option value="15">15</a>'+
                            '<option value="16">16</a>'+
                            '<option value="17">17</a>'+
                            '<option value="18">18</a>'+
                            '<option value="19">19</a>'+
                            '<option value="20">20</a>'+
                            '<option value="21">21</a>'+
                            '<option value="22">22</a>'+
                            '<option value="23">23</a>'+
                        '</select>&nbsp'+
                        '<select class="form-control" name="Minute" id="schedule-time-minute">'+
                            '<option value="00">00</a>'+                        
                            '<option value="05">05</a>'+
                            '<option value="10">10</a>'+
                            '<option value="15">15</a>'+
                            '<option value="20">20</a>'+
                            '<option value="25">25</a>'+
                            '<option value="30">30</a>'+
                            '<option value="35">35</a>'+
                            '<option value="40">40</a>'+
                            '<option value="45">45</a>'+
                            '<option value="50">50</a>'+
                            '<option value="55">55</a>'+
                        '</select>'+
                    '</div>'+
                    '<br>'+
                    //Select when
                    '<p>Select update schedule:</p>'+
                    '<div class="radio">'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="schedule-daily" name="update-schedule" value="daily" class="custom-control-input" checked>'+
                            '<label class="custom-control-label" for="schedule-daily">Daily</label>'+
                        '</div>'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="schedule-weekly" name="update-schedule" value="weekly" class="custom-control-input">'+
                            '<label class="custom-control-label" for="schedule-weekly">Weekly</label>'+
                        '</div>'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="schedule-monthly" name="update-schedule" value="monthly" class="custom-control-input">'+
                            '<label class="custom-control-label" for="schedule-monthly">Monthly</label>'+
                        '</div>'+
                    '</div>'+
                    '<br>'+

                    //button
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="timeSchedule(\''+uuid+'\',\''+status+'\')">Define task</button>'+
                    '</div>'+
                '</div>'+  
            '</div>'+
        '</div>';        
    }
    modalWindow.innerHTML = html;

    var day;
    var month;
    var hour;
    var minutes = today.getMinutes();
    var minuteSelected = 00;

    if (today.getHours() < 10){
        hour = '0'+today.getHours();
    }else{
        hour = today.getHours();
    }

    if (today.getDate() < 10){
        day = '0'+today.getDate();
    }else{
        day = today.getDate();
    }

    if ((today.getMonth()+1) < 10){
        month = '0'+(today.getMonth()+1);
    }else{
        month = (today.getMonth()+1);
    }

    if (minutes>=0 && minutes<=5){
        minuteSelected = '05';
    }else if (minutes>5 && minutes<=10){
        minuteSelected = '10';
    }else if (minutes>10 && minutes<=15){
        minuteSelected = '15';
    }else if (minutes>15 && minutes<=20){
        minuteSelected = '20';
    }else if (minutes>20 && minutes<=25){
        minuteSelected = '25';
    }else if (minutes>25 && minutes<=30){
        minuteSelected = '30';
    }else if (minutes>30 && minutes<=35){
        minuteSelected = '35';
    }else if (minutes>35 && minutes<=40){
        minuteSelected = '40';
    }else if (minutes>40 && minutes<=45){
        minuteSelected = '45';
    }else if (minutes>45 && minutes<=50){
        minuteSelected = '50';
    }else if (minutes>50 && minutes<=55){
        minuteSelected = '55';
    }else if (minutes>55){
        hour = today.getHours()+1;
        minuteSelected = '00';
    }
    document.getElementById('schedule-time-hour').value = hour;
    document.getElementById('schedule-time-minute').value = minuteSelected;
    document.getElementById('schedule-date-day').value = day;
    document.getElementById('schedule-date-month').value = month;

    $('#modal-ruleset').modal("show");
}

function timeSchedule(uuid, status){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var valuesSelectedModal = {};

    if (status == "enabled"){
        valuesSelectedModal["uuid"] = uuid;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/scheduler/stop';
    }else{        
        $('input:radio:checked').each(function() {
            if ($(this).prop("value") == "overwrite" || $(this).prop("value")=="add-lines") {
                valuesSelectedModal["update"] = $(this).prop("value");
            }
            switch($(this).prop("value")) {
                case "daily":
                    valuesSelectedModal["period"] = "86400";
                    break;
                case "weekly":
                    valuesSelectedModal["period"] = "604800";
                    break;
                case "monthly":
                    valuesSelectedModal["period"] = "2592000";
                    break;
                default:
                    valuesSelectedModal["period"] = "60";
                    break;
            }
        });
        valuesSelectedModal["day"] = document.getElementById('schedule-date-day').value;
        valuesSelectedModal["month"] = document.getElementById('schedule-date-month').value;
        valuesSelectedModal["year"] = document.getElementById('schedule-date-year').value;
        valuesSelectedModal["hour"] = document.getElementById('schedule-time-hour').value;
        valuesSelectedModal["minute"] = document.getElementById('schedule-time-minute').value;
        valuesSelectedModal["uuid"] = uuid;
        valuesSelectedModal["status"] = "enabled";
        valuesSelectedModal["type"] = "ruleset";
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/scheduler/add';
    }
    var schedulejson = JSON.stringify(valuesSelectedModal);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: schedulejson
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';} 
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllRulesets();
            }           
        })
        .catch(function (error) {
        });
}

function loadRulesetsDetails(type,name,uuid){
    document.location.href = 'https://' + location.host + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
}

function syncRulesetModal(uuid, name){
    var html = "";
    html = html + '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table" style="word-break: break-all;">'+ 
                '<p>Do you want to synchronize <b>'+name+'</b> ruleset?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="modal-ruleset-sync-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="syncRuleset(\''+uuid+'\')">Sync</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
    document.getElementById('modal-ruleset').innerHTML = html;
    $('#modal-ruleset').modal("show");
}

function deleteRulesetModal(name, uuid){
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="delete-ruleset-footer-table" style="word-break: break-all;">'+ 
                '<p>Do you want to delete <b>'+name+'</b> ruleset?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-delete-ruleset" onclick="deleteRuleset(\''+name+'\',\''+uuid+'\')">Delete</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
    $('#modal-ruleset').modal("show");
}

function modalSynchronizeAllRulesets(){
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="delete-ruleset-footer-table">'+ 
                '<p>Do you want to Synchronize all the rulesets?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-sync-ruleset" onclick="synchronizeAllRulesets()">Synchronize</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
}

// function cloneRuleset(name, path){
//     var modalWindow = document.getElementById('modal-ruleset');
//     modalWindow.innerHTML = 
//     '<div class="modal-dialog">'+
//         '<div class="modal-content">'+
//             '<div class="modal-header">'+
//                 '<h4 class="modal-title" id="ruleset-manager-header">Clone ruleset: '+name+'</h4>'+
//                 '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
//             '</div>'+

//             '<div class="modal-body" id="ruleset-manager-footer-table1">'+ 
//                 '<h7 class="modal-title">New ruleset name</h7>'+
//                 '<input class="form-control" id="input-clone-ruleset-name" type="text" placeholder="...">'+
//             '</div>'+
//             '<div class="modal-body" id="ruleset-manager-footer-table2">'+ 
//                 '<h7 class="modal-title">New ruleset file name</h7>'+
//                 '<input class="form-control" id="input-clone-ruleset-file" type="text" placeholder="...">'+
//             '</div>'+
//             '<div class="modal-body" id="ruleset-manager-footer-table3">'+ 
//                 '<h7 class="modal-title">New ruleset description</h7>'+
//                 '<input class="form-control" id="input-clone-ruleset-desc" type="text" placeholder="...">'+
//             '</div>'+

//             '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
//                 '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
//                 '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveClonedRuleset(\''+name+'\' , \''+path+'\')">Clone ruleset</button>'+
//             '</div>'+
//       '</div>'+
//     '</div>';
// }

function synchronizeAllRulesets() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/syncAllRulesets';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "true"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> All rulesets had been synchronized successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    var alert = document.getElementById('floating-alert');
                    $('html,body').scrollTop(0);
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
            }
        })
        .catch(function (error) {
            var alert = document.getElementById('floating-alert');
            $('html,body').scrollTop(0);
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function deleteRuleset(name, uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/deleteRuleset';
    var jsonbpfdata = {}
    jsonbpfdata["name"] = name;
    jsonbpfdata["uuid"] = uuid;
    var bpfjson = JSON.stringify(jsonbpfdata);
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: bpfjson
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if (response.data.ack == "false"){
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                GetAllRulesets();
            }
        })
        .catch(function (error) {
            var alert = document.getElementById('floating-alert');
            $('html,body').scrollTop(0);
            alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                '<strong>Error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function setDefault(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/setDefaultRuleset/'+uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user            
        },
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if (response.data.ack == "false"){
                var alert = document.getElementById('floating-alert');
                $('html,body').scrollTop(0);
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Set default ruleset error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                GetAllRulesets();
            }
        })
        .catch(function (error) {
            var alert = document.getElementById('floating-alert');
            $('html,body').scrollTop(0);
            alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                '<strong>Set default ruleset error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

// function saveClonedRuleset(name, path){
//     var newName = document.getElementById('input-clone-ruleset-name').value;
//     var newFile = document.getElementById('input-clone-ruleset-file').value;
//     var newDesc = document.getElementById('input-clone-ruleset-desc').value;
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/clone';

//     var jsonbpfdata = {}
//     jsonbpfdata["cloned"] = name;
//     jsonbpfdata["newName"] = newName;
//     jsonbpfdata["newFile"] = newFile;
//     jsonbpfdata["newDesc"] = newDesc;
//     jsonbpfdata["path"] = path;
//     var bpfjson = JSON.stringify(jsonbpfdata);

//     if (newName != "" || newFile != "" || newDesc != "") {
//         axios({
//             method: 'put',
//             url: nodeurl,
//             timeout: 30000,
        // headers:{
        //     'token': document.cookie,
        //     'user': payload.user
        //     
        // },
//             data: bpfjson
//         })
//             .then(function (response) {
    // if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//                 GetAllRulesets();
//             })
//             .catch(function (error) {
//             });
//     } else {
//         alert("You must complete all the fields for clone a ruleset");
//     }
    
// }

function syncRuleset(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/synchronize';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: dataJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "true"){
                    var alert = document.getElementById('floating-alert');
                    $('html,body').scrollTop(0);
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Ruleset synchronization complete.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    var alert = document.getElementById('floating-alert');
                    $('html,body').scrollTop(0);
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error Sync Ruleset: </strong> '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
            }

        })
        .catch(function (error) {
        });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function loadJSONdata(){
    var searchError = localStorage.getItem("searchError");
    if(searchError == "error"){
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Search error: No data found.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    }
    localStorage.setItem("searchError", "none");
  $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}
        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
               
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        GetAllRulesets();   
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();