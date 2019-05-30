function GetAllRuleset() {
    var url = new URL(window.location.href);
    var uuid = url.searchParams.get("uuid");
    var rule = url.searchParams.get("rule");
    var resultElement = document.getElementById('ruleset-table');
    var bannerTitle = document.getElementById('banner-title-ruleset');
    var progressBar = document.getElementById('progressBar-ruleset');
    var progressBarDiv = document.getElementById('progressBar-ruleset-div');
    bannerTitle.innerHTML = "Ruleset: " + rule;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/ruleset/rules/' + uuid)
        .then(function (response) {
            resultElement.innerHTML = generateAllRulesHTMLOutput(response, uuid, ipmaster, portmaster, rule);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
        })
        .catch(function (error) {
            resultElement.innerHTML = generateAllRulesHTMLOutput(error);
        });
}

function generateAllRulesHTMLOutput(response, uuid, ipmaster, portmaster, rule) {
    var isEmptyRuleset = true;
    var rules = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
        '<th style="width: 10%">Status</th>                           ' +
        '<th style="width: 10%">Sid</th>                              ' +
        '<th>Description</th>                                         ' +
        '<th>Notes</th>                                               ' +
        '<th>IP info</th>                                             ' +
        '<th>Actions</th>                                             ' +
        '</tr>                                                        ' +
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
        html = html + '<tr><td id="' + rules[rule]["sid"] + '-rule-status">' +
            icon +
            '</td><td>                                                           ' +
            rules[rule]["sid"] +
            '</td><td>                                                           ' +
            rules[rule]["msg"] +
            '</td><td id="' + rules[rule]["sid"] + '-note">' +
            rules[rule]["note"] +
            '</td><td>                                                           ' +
            rules[rule]["ip"] +
            '</td><td>                                                           ' +
            '<i class="fas fa-eye low-blue" onclick="loadRulesetDetails(\''+rules[rule]["sid"]+'\', \''+uuid+'\', \''+ipmaster+'\', \''+portmaster+'\')"></i>' +
            '</td></tr>'
    }
    html = html + '</tbody></table>';
    if (isEmptyRuleset) {
        return '<div style="text-align:center"><h3>No rules for ruleset ' + rule + ' available...</h3></div>';
    } else {
        return html;
    }
}

function loadRulesetDetails(sid, uuid, ipmaster, portmaster){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/rules/showRuleDetails.php?sid='+sid+'&uuid='+uuid+'&ipmaster='+ipmaster+'&portmaster='+portmaster;
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
    var modalWindow = document.getElementById('modal-ruleset-note');
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
    var jsonbpfdata = {}
    jsonbpfdata["sid"] = sid;
    jsonbpfdata["uuid"] = uuid;
    jsonbpfdata["note"] = textAreaNote;
    var bpfjson = JSON.stringify(jsonbpfdata);
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
    console.log("Loading JSON");
    $.getJSON('../conf/ui.conf', function (data) {
        console.log("getJSON");
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllRuleset();
    });
}
loadJSONdata();