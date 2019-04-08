function GetAllRules() {
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
            resultElement.innerHTML = generateAllRulesHTMLOutput(response);
        })
        .catch(function (error) {
            resultElement.innerHTML = generateAllRulesHTMLOutput(error);
        });
}

function generateAllRulesHTMLOutput(response) {
    var isEmptyRulesets = true;
    var rules = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th>Name</th>                                                ' +
        '<th>Path</th>                                                ' +
        '<th>Description</th>                                         ' +
        '<th>Actions</th>                                             ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody >                                                     '
    for (rule in rules) {
        isEmptyRulesets = false;
        html = html + '<tr><td>' +
            rules[rule]["name"] +
            '</td><td>                                                            ' +
            rules[rule]["path"] +
            '</td><td>                                                            ' +
            rules[rule]["desc"] +
            '</td><td>                                                            ' +
            '<a class="btn btn-primary" href="ruleset.html?uuid=' + rule + '&rule=' + rules[rule]["name"] + '">Details</a> ' +
            '<button type="submit" class="btn btn-secondary" data-toggle="modal" data-target="#modal-ruleset-clone" onclick="cloneRuleset(\'' + rules[rule]["name"] + '\', \'' + rules[rule]["path"] + '\')">Clone</button>       ' +
            '<button type="submit" class="btn btn-danger" data-toggle="modal" data-target="#modal-ruleset-delete" onclick="deleteRulesetModal(\'' + rules[rule]["name"] + '\', \'' + rules[rule]["path"] + '\',\'' + rule + '\')">Delete</button>        ' +
            '</td></tr>'
    }
    html = html + '  </tbody></table>';

    if (isEmptyRulesets) {
        return '<div style="text-align:center"><h3>No Rules available...</h3></div>';
    } else {
        return html;
    }
}


function deleteRulesetModal(name, path, uuid){
    var modalWindow = document.getElementById('modal-ruleset-delete');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-ruleset-header">Ruleset</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="delete-ruleset-footer-table">'+ 
                '<p>Do you want to delete <b>'+name+'</b> ruleset?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-delete-ruleset" onclick="deleteRuleset(\''+name+'\',\''+path+'\',\''+uuid+'\')">Delete</button>'+
            '</div>'+
  
        '</div>'+
    '</div>';
}

function cloneRuleset(name, path){
    var modalWindow = document.getElementById('modal-ruleset-clone');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="ruleset-manager-header">Rules</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body" id="ruleset-manager-footer-table">'+ 
                '<h7 class="modal-title">Introduzca el nombre del nuevo ruleset</h7>'+
                '<input class="form-control" id="input-clone-ruleset" type="text" placeholder="...">'+
            '</div>'+

            '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveClonedRuleset(\''+name+'\' , \''+path+'\')">Save changes</button>'+
            '</div>'+
      '</div>'+
    '</div>';
}

function deleteRuleset(name, path, uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/deleteRuleset';
    var jsonbpfdata = {}
    jsonbpfdata["name"] = name;
    jsonbpfdata["path"] = path;
    jsonbpfdata["uuid"] = uuid;
    var bpfjson = JSON.stringify(jsonbpfdata);
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: bpfjson
    })
        .then(function (response) {
            GetAllRules();
        })
        .catch(function (error) {
        });
}

function saveClonedRuleset(name, path){
    var newName = document.getElementById('input-clone-ruleset').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/clone';

    var jsonbpfdata = {}
    jsonbpfdata["cloned"] = name;
    jsonbpfdata["new"] = newName;
    jsonbpfdata["path"] = path;
    var bpfjson = JSON.stringify(jsonbpfdata);

    if (newName != "") {
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: bpfjson
        })
            .then(function (response) {
                GetAllRules();
            })
            .catch(function (error) {
            });
    } else {
        alert("You must enter a new ruleset name");
    }
    
}

function loadJSONdata(){
  $.getJSON('../conf/ui.conf', function(data) {
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    loadTitleJSONdata();
    GetAllRules();   
  });
}
loadJSONdata();