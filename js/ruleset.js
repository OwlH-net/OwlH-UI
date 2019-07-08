function GetAllRuleset() {
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var rule = url.searchParams.get("rule");
    var type = url.searchParams.get("type");
    var resultElement = document.getElementById('ruleset-table');
    var bannerTitle = document.getElementById('banner-title-ruleset');
    var progressBar = document.getElementById('progressBar-ruleset');
    var progressBarDiv = document.getElementById('progressBar-ruleset-div');
    bannerTitle.innerHTML = "Ruleset: " + rule;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/ruleset/rules/' + uuid)
        .then(function (response) {
            resultElement.innerHTML = generateAllRulesHTMLOutput(response, uuid, ipmaster, portmaster, rule, type);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            
        })
        .catch(function (error) {
            resultElement.innerHTML = generateAllRulesHTMLOutput(error);
        });
}

function generateAllRulesHTMLOutput(response, uuid, ipmaster, portmaster, ruleName, type) {
    if (response.data.ack == "false") {
       return '<div style="text-align:center"><h3 style="color:red;">Error retrieving ruleset ' + ruleName + '</h3></div>';
    }
    var isEmptyRuleset = true;
    var rules = response.data;
    var rawLines = new Object();
    var html = "";
    var isSourceType;
    for (rule in rules) {
        if (rules[rule]["sourceType"] == "custom"){
            isSourceType = true;
            continue;
        }
    }
    if(type == "ruleset"){
        html = html + '<button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="addToCustomRuleset()">Add to custom</button><br><br>';
    }if(type == "custom"){
        html = html + '<button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="editRuleset(\''+uuid+'\', \''+ruleName+'\')">Edit ruleset</button><br><br>';
    }       
    html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
            '<tr>                                                         ' +
                '<th align="center" style="width: 5%">Status</th>                           ' +
                '<th style="width: 10%">Sid</th>                              ' +
                '<th>Description</th>                                         ' ;
                if(type != "source"){
                    html = html +'<th>Notes</th>                                               ' ;
                }
                html = html + '<th>IP info</th>                                             ' +
                '<th style="width: 8%">Actions</th>                                             ' ;
                if(type == "ruleset"){
                    html = html + '<th style="width: 8%">Clone</th>                                             ';
                }                    
            html = html + '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                     '
    for (rule in rules) {        
        isEmptyRuleset = false;
        var ruleStatus;
        if (rules[rule]["enabled"] == "Enabled") {
            ruleStatus = "Disable";
            icon = '<i class="fas fa-check-circle" style="color:green;"></i>'
        } else {
            ruleStatus = "Enable";
            icon = '<i class="fas fa-times-circle" style="color:red;"></i>'
        }
        html = html + '<tr><td style="word-wrap: break-word;" id="' + rules[rule]["sid"] + '-rule-status">' +
            icon +
            '</td><td style="word-wrap: break-word;">                                                           ' +
            rules[rule]["sid"] +
            '</td><td style="word-wrap: break-word;">                                                           ' +
            rules[rule]["msg"] ;
            if(type != "source"){
                html = html + '</td><td style="word-wrap: break-word;" id="' + rules[rule]["sid"] + '-note">' +
                rules[rule]["note"]  ;
            }
            html = html +'</td><td style="word-wrap: break-word;">                                                           ' +
            rules[rule]["ip"] +
            '</td><td style="word-wrap: break-word;" align="center">                                                           ' +
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<i class="fas fa-eye low-blue" onclick="loadRulesetDetails(\''+rules[rule]["sid"]+'\', \''+uuid+'\', \''+ipmaster+'\', \''+portmaster+'\')"></i>&nbsp';
                    if(type != "source"){
                        html = html +'<i class="fas fa-exchange-alt low-blue" id="' + rules[rule]["sid"] + '-change-status" onclick="changeRulesetStatus(\''+rules[rule]["sid"]+'\', \''+uuid+'\', \''+ruleStatus+'\')"></i>&nbsp' +
                        '<i class="fas fa-sticky-note low-blue" data-toggle="modal" data-target="#modal-window-ruleset" onclick="modalNotes(\''+rules[rule]["msg"]+'\', \''+rules[rule]["sid"]+'\', \''+uuid+'\')"></i>&nbsp';
                    }
                    html = html +'</span>'+
            '</td>';
            if(type == "ruleset"){
                html = html + '<td style="word-wrap: break-word;" align="center">                                                           ' +
                    '<input class="form-check-input" type="checkbox" id="'+rule+'"></input>'+
                '</td>';
            }
            html = html + '</tr>';
    }
    html = html + '</tbody></table>';
    if (isEmptyRuleset) {
        document.getElementById('progressBar-ruleset').style.display = "none";
        document.getElementById('progressBar-ruleset-div').style.display = "none";
        if (type == "custom"){
            return '<div style="text-align:center"><h3>No rules for ruleset ' + ruleName + ' available...</h3></div>'+
            '<br><button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="editRuleset(\''+uuid+'\', \''+ruleName+'\')">Edit ruleset</button><br><br>';
        }else{
            return '<div style="text-align:center"><h3>No rules for ruleset ' + ruleName + ' available...</h3></div>';    
        }
    } else {
        return html;
    }
}

function editRuleset(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit-ruleset.html?uuid='+uuid+'&file='+nodeName;
}

function loadRulesetDetails(sid, uuid, ipmaster, portmaster){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/rules/showRuleDetails.php?sid='+sid+'&uuid='+uuid+'&ipmaster='+ipmaster+'&portmaster='+portmaster;
}

function addToCustomRuleset(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var customRulesetsURL = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/custom';
    var allRulesSelected = [];
    
    $('input:checkbox:checked').each(function() {
        var ruleSelected = $(this).prop("id");
        allRulesSelected.push(ruleSelected);
    });

    if (allRulesSelected == ""){
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Error!</strong> There are no rules selected.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
    }else{
        axios({
            method: 'get',
            url: customRulesetsURL,
            timeout: 30000
        })
        .then(function (response) {
            var customRulesets = response.data;
            var customRulesetModal = document.getElementById('modal-window-ruleset');
            var html =
             '<div class="modal-dialog modal-lg">'+ 
                '<div class="modal-content">'+
            
                    '<div class="modal-header">'+
                        '<h4 class="modal-title">Select ruleset</h4>'+
                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>'+
    
                    '<div class="modal-body">  '+
                        '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                            '<thead>                                                      ' +
                                '<tr>                                                         ' +
                                '<th>Name</th>                                                  ' +
                                '<th style="width: 20%">Actions</th>                                ' +
                                '</tr>                                                        ' +
                            '</thead>                                                     ' +
                                '<tbody>                                                      ' ;
                                    for (source in customRulesets) {
                                        html = html + '<tr><td style="word-wrap: break-word;">'+
                                            customRulesets[source]['name']+
                                        '</td><td style="word-wrap: break-word;">'+
                                            '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="addrulesToCustomRuleset(\''+allRulesSelected+'\',\''+source+'\')">Add</button>' +
                                        '</td></tr>';
                                    }
                                html = html + '</tbody></table>'+
                        '</table>'+
                    '</div>'+
    
                    '<div class="modal-footer" id="ruleset-note-footer-btn">'+
                        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+                    
                    '</div>'+
    
                '</div>'+
            '</div>';
    
            customRulesetModal.innerHTML = html;
            
            $('#modal-window-ruleset').modal('show');
        })
        .catch(function (error) {
            $('#modal-window-ruleset').modal('hide');
        });
    }
}

function addrulesToCustomRuleset(rules, sourceUUID){
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/addRulesToCustom';

    var jsondata = {}
    jsondata["orig"] = uuid;
    jsondata["dest"] = sourceUUID;
    jsondata["sids"] = rules
    var bpfjson = JSON.stringify(jsondata);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: bpfjson
    })
        .then(function (response) {
            $('#modal-window-ruleset').modal('hide')   
            GetAllRuleset();         
        })
        .catch(function (error) {
            $('#modal-window-ruleset').modal('hide')
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                '<strong>Error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
        });
}

function changeRulesetStatus(sid, uuid, action) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/action';

    var jsonbpfdata = {}
    jsonbpfdata["sid"] = sid;
    jsonbpfdata["uuid"] = uuid;
    jsonbpfdata["action"] = action;
    var bpfjson = JSON.stringify(jsonbpfdata);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: bpfjson
    })
        .then(function (response) {
            if (action == "Disable") {
                document.getElementById(sid + '-rule-status').innerHTML = '<i class="fas fa-times-circle" style="color:red;"></i>';
                document.getElementById(sid + '-change-status').onclick = function () { changeRulesetStatus(sid, uuid, "Enable"); };
            } else {
                document.getElementById(sid + '-rule-status').innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i>';
                document.getElementById(sid + '-change-status').onclick = function () { changeRulesetStatus(sid, uuid, "Disable"); };
            }
            return true
        })
        .catch(function (error) {
            return false;
        });
}

function modalNotes(msg, sid, uuid){
    var modalWindow = document.getElementById('modal-window-ruleset');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title" id="ruleset-note-header-title">Rule '+sid+'</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        
        '<div class="modal-body" id="ruleset-note-footer">'+ 
            '<h7 class="modal-title">Notes for: '+msg+'</h7>'+
            '<textarea class="form-control" rows="3" id="ruleset-notes"></textarea>'+
        '</div>'+

        '<div class="modal-footer" id="ruleset-note-footer-btn">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="rulesetNotes(\''+sid+'\',\''+uuid+'\')">Save changes</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    getRuleNote("ruleset-notes", uuid, sid);
}

function getRuleNote(elementID, uuid, sid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getnote/' + uuid + '/' + sid;
    var loadNote = document.getElementById(elementID);
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (typeof (response.data) === 'object') {
                loadNote.value = '';
            } else {
                loadNote.value = response.data;
            }
            return true;
        })
        .catch(function (error) {
            return false;
        });
}


function rulesetNotes(sid, uuid) {
    var textAreaNote = document.getElementById('ruleset-notes').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/note';
    var jsonNoteData = {}
    jsonNoteData["sid"] = sid;
    jsonNoteData["uuid"] = uuid;
    jsonNoteData["note"] = textAreaNote;
    var bpfjson = JSON.stringify(jsonNoteData);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: bpfjson
    })
        .then(function (response) {
            document.getElementById(sid + '-note').innerHTML = '<p>' + textAreaNote + '</p>';
            return true
        })
        .catch(function (error) {
            return false;
        });
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllRuleset();
    });
}
loadJSONdata();