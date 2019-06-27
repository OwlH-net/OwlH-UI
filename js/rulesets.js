function GetAllRulesets() {
    var resultElement = document.getElementById('rulesets-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlAllRules = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset';
    axios({
        method: 'get',
        url: urlAllRules,
        timeout: 30000
    })
        .then(function (response) {
            resultElement.innerHTML = generateAllRulesetsHTMLOutput(response);
        })
        .catch(function (error) {
            resultElement.innerHTML = '<div style="text-align:center"><h3>No connection</h3></div>';
        });
    }
    
function generateAllRulesetsHTMLOutput(response) {
    var isEmptyRulesets = true;
    var type = "ruleset";
    var ruleset = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>Name</th>                                                ' +
        '<th>Description</th>                                         ' +
        '<th>Actions</th>                                             ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody >                                                     '
    for (uuid in ruleset) {
        if (ruleset[uuid]["type"] == "source") {
            continue;
        }
        isEmptyRulesets = false;
        html = html + '<tr><td>' +
            ruleset[uuid]["name"] +
            '</td><td>                                                            ' +
            ruleset[uuid]["desc"] +
            '</td><td>                                                            ' +
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<i class="fas fa-info-circle" title="Details" onclick="loadRulesetsDetails(\''+type+'\',\''+ruleset[uuid]['name']+'\',\''+uuid+'\')"></i> &nbsp'+
                    '<i class="fas fa-sync-alt" title="Sync ruleset files" data-toggle="modal" data-target="#modal-ruleset" onclick="syncRulesetModal(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>&nbsp'+
                    '<i class="fas fa-stopwatch" title="Update schedule" data-toggle="modal" data-target="#modal-ruleset" onclick="modalTimeSchedule(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>&nbsp'+
                    '| <i class="fas fa-trash-alt" style="color: red;" title="Delete source" data-toggle="modal" data-target="#modal-ruleset" onclick="deleteRulesetModal(\''+ruleset[uuid]["name"]+'\',\''+uuid+'\')"></i>'+
                '</span>'+
            '</td></tr>'
    }
    html = html + '</tbody></table>';

    if (isEmptyRulesets) {
        return '<div style="text-align:center"><h3>No Rules available...</h3></div>';
    } else {
        return html;
    }
}

function modalTimeSchedule(uuid, name){
    var today = new Date();
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">'+name+' time schedule</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
                //status
                '<div>'+
                    '<div class="radio">'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="status-enable" name="update-status" value="enabled" class="custom-control-input" checked>'+
                            '<label class="custom-control-label" for="status-enable">Enabled</label>'+
                        '</div>'+
                        '<div class="custom-control custom-radio custom-control-inline">'+
                            '<input type="radio" id="status-disable" name="update-status" value="disabled" class="custom-control-input">'+
                            '<label class="custom-control-label" for="status-disable">Disabled</label>'+
                        '</div>'+
                    '</div>'+

                    // '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="stopTimeSchedule(\''+uuid+'\')">Stop Timer</button>'+
                    // '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                    // '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="timeSchedule(\''+uuid+'\')">Run</button>'+
                '</div>'+
                '<br>'+
                
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
                '<div class="form-group col-md-4">'+
                    '<span>'+
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
                        '</select>&nbsp'+
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
                        '</select>&nbsp'+
                        '<select class="form-control" name="Year" id="schedule-date-year">'+
                            '<option value="'+(today.getFullYear())+'">'+(today.getFullYear())+'</a>'+
                            '<option value="'+(today.getFullYear()+1)+'">'+(today.getFullYear()+1)+'</a>'+
                            '<option value="'+(today.getFullYear()+2)+'">'+(today.getFullYear()+2)+'</a>'+
                        '</select>'+
                    '</span>'+    
                '</div>'+
                '<br>'+

                //Select time
                '<p>Start time:</p>'+
                '<div class="form-group col-md-4">'+
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
                    '<div class="custom-control custom-radio custom-control-inline">'+
                        '<input type="radio" id="schedule-min" name="update-schedule" value="minute" class="custom-control-input">'+
                        '<label class="custom-control-label" for="schedule-min">1 min</label>'+
                    '</div>'+
                '</div>'+
                '<br>'+

                //button
                '<div>'+
                    '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="timeSchedule(\''+uuid+'\')">Define task</button>'+
                '</div>'+
            '</div>'+  
        '</div>'+
    '</div>';
}

// function stopTimeSchedule(uuid){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/stopTimeSchedule';
//     var jsonbpfdata = {}
//     jsonbpfdata["time"] = document.getElementById('time-schedule-modal-rulesets').value;
//     jsonbpfdata["uuid"] = uuid;
//     var bpfjson = JSON.stringify(jsonbpfdata);
//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         data: bpfjson
//     })
//         .then(function (response) {
//             GetAllRulesets();
//         })
//         .catch(function (error) {
//         });
// }

function timeSchedule(uuid){
    // var date = document.getElementById('date-schedule-modal-rulesets').value;
    // var time = document.getElementById('time-schedule-modal-rulesets').value;

    // //regexp
    // var regeTime = /(([01][0-9]|[012][0-3]):([0-5][0-9]))/;
    // var regeDay = /(([0][1-9])|([12])([0-9])|([3][01]))(\/)(([0][1-9])|([1][012]))(\/)(\d{4})/;
    // var timeRegexp = regeTime.exec(time);
    // var dateRegexp = regeDay.exec(date);
    // if (dateRegexp == null && timeRegexp == null) {
    //     var alert = document.getElementById('floating-alert');
    //     alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
    //         '<strong>ERROR!</strong> Date format and time format are not correct.'+
    //         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
    //             '<span aria-hidden="true">&times;</span>'+
    //         '</button>'+
    //     '</div>';
    // }else if (dateRegexp == null) {
    //     var alert = document.getElementById('floating-alert');
    //     alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
    //         '<strong>ERROR!</strong> Date format is not correct.'+
    //         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
    //             '<span aria-hidden="true">&times;</span>'+
    //         '</button>'+
    //     '</div>';
    // }else if (timeRegexp == null) {
    //     var alert = document.getElementById('floating-alert');
    //     alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
    //         '<strong>ERROR!</strong> Time format is not correct.'+
    //         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
    //             '<span aria-hidden="true">&times;</span>'+
    //         '</button>'+
    //     '</div>';
    // }

    // // console.log(timeRegexp+" -- "+dateRegexp);

    // var today = new Date();
    // // var userDate = Date.parse(date+time);
    // var userDate = new Date(dateRegexp[5], dateRegexp[3], dateRegexp[1], timeRegexp[2], timeRegexp[3]); // // 1 Jan 2011, 00:00:00
    // console.log(today+"  --  "+userDate);
    // if(today>userDate){
    //     console.log("DATE IS OLDER");
    // }



    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var valuesSelectedModal = {};
    $('input:radio:checked').each(function() {
        if ($(this).prop("value") == "enabled" || $(this).prop("value")=="disabled") {
            valuesSelectedModal["status"] = $(this).prop("value");
        }
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
                valuesSelectedModal["period"] = "1567641600000‬";
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
    valuesSelectedModal["type"] = "ruleset";
    if (valuesSelectedModal["status"] == "enabled"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/scheduler/add';
    }else{
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/scheduler/stop';
    }

    var schedulejson = JSON.stringify(valuesSelectedModal);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: schedulejson
    })
        .then(function (response) {
            GetAllRulesets();
        })
        .catch(function (error) {
        });
}

function loadRulesetsDetails(type,name,uuid){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/ruleset-details.html?type='+type+'&sourceName='+name+'&uuid='+uuid;
}

function syncRulesetModal(uuid, name){
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
                '<p>Do you want to synchronize <b>'+name+'</b> ruleset?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="modal-ruleset-sync-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="syncRuleset(\''+uuid+'\')">Sync</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
}

function deleteRulesetModal(name, uuid){
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="delete-ruleset-footer-table">'+ 
                '<p>Do you want to delete <b>'+name+'</b> ruleset?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-delete-ruleset" onclick="deleteRuleset(\''+name+'\',\''+uuid+'\')">Delete</button>'+
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
        data: bpfjson
    })
        .then(function (response) {
            GetAllRulesets();
        })
        .catch(function (error) {
        });
}

function saveClonedRuleset(name, path){
    var newName = document.getElementById('input-clone-ruleset-name').value;
    var newFile = document.getElementById('input-clone-ruleset-file').value;
    var newDesc = document.getElementById('input-clone-ruleset-desc').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/clone';

    var jsonbpfdata = {}
    jsonbpfdata["cloned"] = name;
    jsonbpfdata["newName"] = newName;
    jsonbpfdata["newFile"] = newFile;
    jsonbpfdata["newDesc"] = newDesc;
    jsonbpfdata["path"] = path;
    var bpfjson = JSON.stringify(jsonbpfdata);

    if (newName != "" || newFile != "" || newDesc != "") {
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: bpfjson
        })
            .then(function (response) {
                GetAllRulesets();
            })
            .catch(function (error) {
            });
    } else {
        alert("You must complete all the fields for clone a ruleset");
    }
    
}

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
        data: dataJSON
    })
        .then(function (response) {
            if (response.data.ack == "true"){
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Ruleset synchronization complete.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
            }else{
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> The ruleset could not be synchronized.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
            }

        })
        .catch(function (error) {
        });
}

function loadJSONdata(){
  $.getJSON('../conf/ui.conf', function(data) {
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    GetAllRulesets();   
    loadTitleJSONdata();
  });
}
loadJSONdata();