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
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="modal-ruleset-sync-ruleset-header">Time schedule</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="modal-ruleset-sync-ruleset-footer-table">'+ 
                '<p>Insert time:</p>'+
                '<input type="text" class="form-control" placeholder="Time" id="time-schedule-modal-rulesets">'+
            '</div>'+
    
            '<div class="modal-footer" id="modal-ruleset-sync-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-modal-ruleset-sync-ruleset" onclick="timeSchedule(\''++'\')">Run</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
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
    console.log(uuid);

}

function cloneRuleset(name, path){
    var modalWindow = document.getElementById('modal-ruleset');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="ruleset-manager-header">Clone ruleset: '+name+'</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body" id="ruleset-manager-footer-table1">'+ 
                '<h7 class="modal-title">New ruleset name</h7>'+
                '<input class="form-control" id="input-clone-ruleset-name" type="text" placeholder="...">'+
            '</div>'+
            '<div class="modal-body" id="ruleset-manager-footer-table2">'+ 
                '<h7 class="modal-title">New ruleset file name</h7>'+
                '<input class="form-control" id="input-clone-ruleset-file" type="text" placeholder="...">'+
            '</div>'+
            '<div class="modal-body" id="ruleset-manager-footer-table3">'+ 
                '<h7 class="modal-title">New ruleset description</h7>'+
                '<input class="form-control" id="input-clone-ruleset-desc" type="text" placeholder="...">'+
            '</div>'+

            '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveClonedRuleset(\''+name+'\' , \''+path+'\')">Clone ruleset</button>'+
            '</div>'+
      '</div>'+
    '</div>';
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