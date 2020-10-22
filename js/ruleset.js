function GetAllRuleset() {
    var url = new URL(window.location.href);
    var fileuuid = url.searchParams.get("file");
    var rulesetuuid = url.searchParams.get("ruleset");
    var rule = url.searchParams.get("rule");
    var type = url.searchParams.get("type");
    var resultElement = document.getElementById('ruleset-table');
    var bannerTitle = document.getElementById('banner-title-ruleset');
    var progressBar = document.getElementById('progressBar-ruleset');
    var progressBarDiv = document.getElementById('progressBar-ruleset-div');
    bannerTitle.innerHTML = "Ruleset: " + rule;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/ruleset/rules/' + fileuuid,{headers:{'token': document.cookie,'user': payload.user}})
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();              
        }else{   
            resultElement.innerHTML = generateAllRulesHTMLOutput(response, fileuuid, ipmaster, portmaster, rule, type, rulesetuuid);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
        }
        
    })
    .catch(function (error) {
        resultElement.innerHTML = generateAllRulesHTMLOutput(error);
    });
}

function generateAllRulesHTMLOutput(response, fileuuid, ipmaster, portmaster, ruleName, type, rulesetuuid) {
    if (response.data.ack == "false") {
       return '<div style="text-align:center"><h3 style="color:red;">Error retrieving ruleset ' + ruleName + '</h3></div>';
    }
    var isEmptyRuleset = true;
    var rules = response.data;
    var html = "";
    var isCustomSourceType;
    for (rule in rules) {
        if (rules[rule]["sourceType"] == "custom"){
            isCustomSourceType = true;
            continue;
        }else{
            isCustomSourceType = false;
            continue;
        }
    }
    if(type == "ruleset" && !isCustomSourceType){
        html = html + '<button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="getToCustomRuleset(\''+rulesetuuid+'\')">Add to custom</button><br><br>';
    }else if(type == "custom"){
        html = html + '<button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="editRuleset(\''+fileuuid+'\', \''+ruleName+'\')">Edit ruleset</button>'+
            // '<button class="btn btn-success mx-1" id="refresh-custom-ruleset" style="float: right; display: none;" onclick="GetAllRuleset()">Refresh</button>'+
            '<br><br>';
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
                if(type == "ruleset" && !isCustomSourceType){
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
            '</td><td style="word-wrap: break-word;" align="left">                                                           ' +
                '<span style="font-size: 20px; color: Dodgerblue;">'+
                    '<i class="fas fa-eye low-blue" style="cursor:pointer;" onclick="loadRulesetDetails(\''+rules[rule]["sid"]+'\', \''+fileuuid+'\')"></i>&nbsp';
                    if(type != "source"){
                        html = html +'<i class="fas fa-exchange-alt low-blue" style="cursor:pointer;" id="' + rules[rule]["sid"] + '-change-status" onclick="changeRulesetStatus(\''+rules[rule]["sid"]+'\', \''+fileuuid+'\', \''+ruleStatus+'\')"></i>&nbsp' +
                        '<i class="fas fa-sticky-note low-blue" style="cursor:pointer;" data-toggle="modal" data-target="#modal-window-ruleset" onclick="modalNotes(\''+rules[rule]["msg"]+'\', \''+rules[rule]["sid"]+'\', \''+fileuuid+'\')"></i>&nbsp';
                    }
                    html = html +'</span>'+
            '</td>';
            if(type == "ruleset" && !isCustomSourceType){
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
            '<br><button class="btn btn-primary" id="edit-custom-ruleset" style="float: right;" onclick="editRuleset(\''+fileuuid+'\', \''+ruleName+'\')">Edit ruleset</button><br><br>';
        }else{
            return '<div style="text-align:center"><h3>No rules for ruleset ' + ruleName + ' available...</h3></div>';    
        }
    } else {
        return html;
    }
}

function editRuleset(fileuuid, nodeName){
    // document.getElementById('refresh-custom-ruleset').style.display = "block";
    document.location.href = 'https://' + location.host + '/edit-ruleset.html?fileuuid='+fileuuid+'&file='+nodeName;
}

function loadRulesetDetails(sid, fileuuid){
    document.location.href = 'https://' + location.host + '/show-rule-details.html?sid='+sid+'&fileuuid='+fileuuid;
}

function getToCustomRuleset(rulesetuuid){
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
        $('html,body').scrollTop(0);
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Error!</strong> There are no rules selected.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    }else{
        axios({
            method: 'get',
            url: customRulesetsURL,
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
                                            '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="addrulesToCustomRuleset(\''+allRulesSelected+'\',\''+source+'\',\''+rulesetuuid+'\')">Add</button>' +
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
            }
        })
        .catch(function (error) {
            $('#modal-window-ruleset').modal('hide');
        });
    }
}

function addrulesToCustomRuleset(rules, sourcefileuuid,ruleset){
    var url = new URL(window.location.href);
    var fileuuid = url.searchParams.get("file");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/addRulesToCustom';

    var jsondata = {}
    jsondata["orig"] = fileuuid;
    jsondata["dest"] = sourcefileuuid;
    jsondata["ruleset"] = ruleset;
    jsondata["sids"] = rules
    var bpfjson = JSON.stringify(jsondata);
    axios({
        method: 'put',
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
            if(response.data.permissions == "none"){
                $('#modal-window-ruleset').modal('hide')   
                PrivilegesMessage();              
            }else{   
                $('#modal-window-ruleset').modal('hide')   
                GetAllRuleset();         
            }
        })
        .catch(function (error) {
            $('#modal-window-ruleset').modal('hide')
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

function changeRulesetStatus(sid, fileuuid, action) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/action';

    var jsonbpfdata = {}
    jsonbpfdata["sid"] = sid;
    jsonbpfdata["uuid"] = fileuuid;
    jsonbpfdata["action"] = action;
    var bpfjson = JSON.stringify(jsonbpfdata);

    axios({
        method: 'put',
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
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (action == "Disable") {
                    document.getElementById(sid + '-rule-status').innerHTML = '<i class="fas fa-times-circle" style="color:red;"></i>';
                    document.getElementById(sid + '-change-status').onclick = function () { changeRulesetStatus(sid, fileuuid, "Enable"); };
                } else {
                    document.getElementById(sid + '-rule-status').innerHTML = '<i class="fas fa-check-circle" style="color:green;"></i>';
                    document.getElementById(sid + '-change-status').onclick = function () { changeRulesetStatus(sid, fileuuid, "Disable"); };
                }
            }
            return true
        })
        .catch(function (error) {
            return false;
        });
}

function modalNotes(msg, sid, fileuuid){
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
            '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="rulesetNotes(\''+sid+'\',\''+fileuuid+'\')">Save changes</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    getRuleNote("ruleset-notes", fileuuid, sid);
}

function getRuleNote(elementID, fileuuid, sid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/getnote/' + fileuuid + '/' + sid;
    var loadNote = document.getElementById(elementID);
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
                if (typeof (response.data) === 'object') {
                    loadNote.value = '';
                } else {
                    loadNote.value = response.data;
                }
                return true;
            }
        })
        .catch(function (error) {
            return false;
        });
}


function rulesetNotes(sid, fileuuid) {
    var textAreaNote = document.getElementById('ruleset-notes').value.trim();
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/note';
    var jsonNoteData = {}
    jsonNoteData["sid"] = sid;
    jsonNoteData["uuid"] = fileuuid;
    jsonNoteData["note"] = textAreaNote;
    var bpfjson = JSON.stringify(jsonNoteData);
    axios({
        method: 'put',
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
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                document.getElementById(sid + '-note').innerHTML = '<p>' + textAreaNote + '</p>';
                return true
            }
        })
        .catch(function (error) {
            return false;
        });
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
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
        loadTitleJSONdata();
        GetAllRuleset();
    });
}
var payload = "";
loadJSONdata();