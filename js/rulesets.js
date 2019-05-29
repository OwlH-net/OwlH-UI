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
                    '<a href="ruleset-details.html?type=ruleset&sourceName='+ruleset[uuid]['name']+'&uuid='+uuid+'"><i class="fas fa-info-circle" title="Details"></i></a> &nbsp'+
                    '<i class="fas fa-sync-alt" title="Sync ruleset files" data-toggle="modal" data-target="#modal-ruleset" onclick="syncRulesetModal(\''+uuid+'\',\''+ruleset[uuid]['name']+'\')"></i>'+
                    ' | <i class="fas fa-trash-alt" style="color: red;" title="Delete source" data-toggle="modal" data-target="#modal-ruleset" onclick="deleteRulesetModal(\''+ruleset[uuid]["name"]+'\',\''+uuid+'\')"></i>'+
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