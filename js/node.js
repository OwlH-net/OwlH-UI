function addNode() {
    var nname = document.getElementById('nodename').value;
    var nip = document.getElementById('nodeip').value;
    var nport = document.getElementById('nodeport').value;
    formAddNids();//close add nids form
    var nodejson = {}
    nodejson["name"] = nname;
    nodejson["port"] = nport;
    nodejson["ip"] = nip;
    var nodeJSON = JSON.stringify(nodejson);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/';
    axios({
        method: 'post',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
    })
        .then(function (response) {
            GetAllNodes();
            return true;
        })
        .catch(function (error) {
            return false;
        });   
    GetAllNodes();    
    return false;
}

function modifyNodeInformation() {
    var name = document.getElementById('cfgnodename').value;
    var ip = document.getElementById('cfgnodeip').value;
    var port = document.getElementById('cfgnodeport').value;
    var nid = document.getElementById('cfgnodeid').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["port"] = port;
    nodejson["ip"] = ip;
    nodejson["id"] = nid;
    
    var newValues = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: newValues
        })
        .then(function (response) {
            GetAllNodes();
        })
        .catch(function (error) {
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
        });   
        document.getElementById('divconfigform').style.display = "none";
        return false;
}

function cancelNodeModification(){
    document.getElementById('divconfigform').style.display = "none";
}

function loadBPF(nid, name){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
                '<div class="modal-content">'+
    
                 '<div class="modal-header">'+
                        '<h4 class="modal-title" id="bpf-header">BPF</h4>'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '</div>'+
    
                    '<div class="modal-body" id="modal-footer-inputtext">'+
                        '<input type="text" class="form-control" id="recipient-name">'+
                    '</div>'+
    
                    '<div class="modal-footer" id="modal-footer-btn">'+
                        '<!-- Buttons -->'+
                    '</div>'+
    
                '</div>'+
            '</div>';
  var inputBPF = document.getElementById('recipient-name');
  var headerBPF = document.getElementById('bpf-header');
  var footerBPF = document.getElementById("modal-footer-btn");
  headerBPF.innerHTML = "BPF - "+name;
  footerBPF.innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveBPF(\''+nid+'\')" id="btn-save-changes">Save changes</button>';
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/'+nid+'/bpf';
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 3000
  })
    .then(function (response) {
        if('bpf' in response.data){
            inputBPF.value=response.data.bpf;     
        }else{
            inputBPF.value='';
            headerBPF.innerHTML = headerBPF.innerHTML + '<br>Not defined';
        }
    })
    .catch(function (error) {
      windowModalLog.innerHTML = error+"++<br>";
    });   
}



function saveBPF(nid){
  var inputBPF = document.getElementById('recipient-name');
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/'+nid+'/bpf';
  var jsonbpfdata = {}
  jsonbpfdata["nid"] = nid;
  jsonbpfdata["bpf"] = inputBPF.value;
  var bpfjson = JSON.stringify(jsonbpfdata);

  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000,
    data: bpfjson
  })
    .then(function (response) {
      return true;
    })
    .catch(function (error) {
      return false;
    });   
}

function loadRuleset(nid){
  var modalWindow = document.getElementById('modal-window');
  modalWindow.innerHTML = 
  '<div class="modal-dialog modal-lg">'+
    '<div class="modal-content">'+

      '<div class="modal-header">'+
        '<h4 class="modal-title" id="ruleset-manager-header">Rules</h4>'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
      '</div>'+

      '<div class="modal-body" id="ruleset-manager-footer-table">'+ 
      '</div>'+

      '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  var resultElement = document.getElementById('ruleset-manager-footer-table');
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset')
    .then(function (response) {
        if (typeof response.data.error != "undefined"){
            resultElement.innerHTML = '<p>No rules available...</p>';
        }else{
            resultElement.innerHTML = generateAllRulesModal(response, nid);
        }
    })
    .catch(function (error) {
      resultElement.innerHTML = '<p>Error retrieving rules</p>';
    }); 
  
}

function generateAllRulesModal(response, nid) {
    var rules = response.data;
    var isEmpty = true;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th width="30%">Name</th>                                    ' +
                '<th>Description</th>                                         ' +
                '<th width="15%">Options</th>                                 ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (rule in rules) {
        isEmpty = false;
        html = html + '<tr><td style="word-wrap: break-word;" width="30%">                                       ' +
        rules[rule]["name"]                                                     +
        '</td><td style="word-wrap: break-word;">                                                            ' +
        rules[rule]["desc"]                                                     +
        '</td><td style="word-wrap: break-word;" width="15%">                                                ' +
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveRuleSelected(\''+rule+'\', \''+nid+'\')">Select</button>        ' +
        '</td></tr>                                                           '
    }
    html = html + '</tbody></table>';
    
    if (isEmpty){
        return '<p>No rules available...</p>';;
    }else{
        return html;
    }
}


function saveRuleSelected(rule, nid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/set';

    var jsonRuleUID = {}
    jsonRuleUID["nid"] = nid;
    jsonRuleUID["rule_uid"] = rule;
    var uidJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: urlSetRuleset,
        timeout: 30000,
        data: uidJSON
    })
        .then(function (response) {
            getRulesetUID(nid);
            return true;
        })
            .catch(function (error) {
            return false;
        }); 
}

function deleteNodeModal(node, name){
  var modalWindow = document.getElementById('modal-window');
  modalWindow.innerHTML = 
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
    
      '<div class="modal-header">'+
        '<h4 class="modal-title" id="delete-node-header">Node</h4>'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
      '</div>'+

      '<div class="modal-body" id="delete-node-footer-table">'+ 
        '<p>Do you want to delete <b>'+name+'</b> node?</p>'+
      '</div>'+

      '<div class="modal-footer" id="delete-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
        '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-delete-node" onclick="deleteNode(\''+node+'\')">Delete</button>'+
      '</div>'+

    '</div>'+
  '</div>';
}

function syncRulesetModal(node, name){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
      
        '<div class="modal-header">'+
          '<h4 class="modal-title" id="sync-node-header">Node</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
  
        '<div class="modal-body" id="sync-node-footer-table">'+ 
          '<p>Do you want to sync ruleset for <b>'+name+'</b> node?</p>'+
        '</div>'+
  
        '<div class="modal-footer" id="sync-node-footer-btn">'+
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
          '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-sync-node" onclick="sendRulesetToNode(\''+node+'\')">sync</button>'+
        '</div>'+
  
      '</div>'+
    '</div>';
  }

function loadJSONdata(){
  $.getJSON('../conf/ui.conf', function(data) {
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    loadTitleJSONdata();
    loadRuleset();   
  });
}
loadJSONdata();