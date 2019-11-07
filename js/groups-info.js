function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 
        GetGroupsDetails();
    });
}
loadJSONdata();

function GetGroupsDetails(){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-groups');
    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';

    axios({
        method: 'get',
        url: groupurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            result.innerHTML= '<div style="text-align:center"><h3 style="color:red;">Error retrieving group data</h3></div>';
        }else{
            var html = "";
            html = html + '<div>';
                for(x=0; x<response.data.length; x++){
                    var groups = response.data[x];
                    if(groups['guuid'] == uuid){
                        html = html + '<div>'+
                                    '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="modalSelectNodeGroup(\''+uuid+'\')">Add node</button>'+
                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="backButton()">Back</button>'+
                                    '<b>Nodes</b>'+
                                '</div><br>'+
                                '<table class="table" id="nodes-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed" width="100%">'+
                                    '<thead>'+                           
                                        '<tr>'+                           
                                            '<th>Node name</th>'+
                                            '<th>Node ip</th>'+
                                            '<th width="10%">Actions</th>'+
                                        '</tr>'+
                                    '</thead>';   
                                    for(nid in groups["Nodes"]){
                                        html = html + '<tr>'+                           
                                                '<td>'+groups["Nodes"][nid]["nname"]+'</td>'+
                                                '<td>'+groups["Nodes"][nid]["nip"]+'</td>'+
                                                '<td><i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete node for this group" onclick="modalDeleteNodeForGroup(\''+groups["Nodes"][nid]["dbuuid"]+'\', \''+groups["Nodes"][nid]["nname"]+'\')"></i></td>'+
                                        '</tr>';
                                    }
                                html = html + '</table>';
                                html = html + '<b>Suricata</b>'+
                                '<table class="table" id="suricata-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed"  width="100%">'+                                                         
                                    '<tbody>'+                           
                                        '<tr>'+                           
                                            '<td>Configuration</td>'+
                                            '<td>From folder</td>'+
                                            '<td>/usr/local/owlh/suricata/confs</td>'+
                                        '</tr>'+
                                        '<tr>'+                           
                                            '<td></td>'+
                                            '<td>From master</td>'+
                                            '<td id="group-detail-master-folder">/usr/local/owlh/suricata/confs</td>'+
                                        '</tr>'+
                                        '<tr>'+                           
                                            '<td></td>'+
                                            '<td>From node</td>'+
                                            '<td id="group-detail-node-folder">/usr/local/owlh/suricata/confs</td>'+
                                        '</tr>'+
                                        '<tr>'+                           
                                            '<td>Ruleset &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select ruleset" onclick="modalLoadRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['guuid']+'\')"></i></td>'+
                                            '<td id="ruleset-group-'+groups['guuid']+'">';
                                                if(groups['gruleset'] != ""){
                                                    html = html + groups['gruleset'];
                                                }else{
                                                    html = html + '<p style="color: red;">No ruleset selected...</p>';
                                                }
                                            html = html + '</td>'+
                                            '<td></td>'+
                                        '</tr>'+
                                    '</tbody>'+                           
                                '</table>'; 
                                html = html + '<b>Zeek</b>'+
                                '<table class="table" id="zeek-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed"  width="100%">'+                         
                                    '<tbody>'+                           
                                        '<tr>'+                           
                                            '<td>Master node configuration</td>'+
                                            '<td>Ruleset</td>'+
                                            '<td></td>'+
                                        '</tr>'+
                                    '</tbody>'+    
                                '</table>'; 
                            html = html + '</td>'+
                        '</tr>';
                        // $('#edit-group-row-'+groups['guuid']).hide();
                        // $('#nodes-for-group-'+groups['guuid']).hide();
                    }
                }
            html = html + '</div>';
            result.innerHTML = html;
        }

    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
    // PingGroupNodes();
}

function backButton(){
    window.history.back();
}

function modalLoadRuleset(group){
    document.getElementById('modal-groups').innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Groups rulesets</h4>'+
                '<button type="button" class="close" id="ruleset-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;" id="group-ruleset-values">'+ 
            '</div>'+

            '<div class="modal-footer" id="ruleset-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="ruleset-group-close">Close</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#ruleset-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#ruleset-group-close').click(function(){ $('#modal-groups').modal("hide");});

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset')
        .then(function (response) {
            if (typeof response.data.error != "undefined"){
                document.getElementById('group-ruleset-values').innerHTML = '<p>No rules available...</p>';
            }else{
                var html = '';
                html = html + '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<th>Ruleset</th>'+
                        '<th>Select</th>'+
                    '</thead>'+
                    '<tbody>';
                        for(id in response.data){
                            html = html + '<tr>'+
                                '<td>'+response.data[id]["name"]+'</td>'+
                                '<td><button type="submit" class="btn btn-primary" onclick="selectGroupRuleset(\''+group+'\', \''+response.data[id]["name"]+'\', \''+id+'\')">Select</button></td>'+
                            '<tr>';
                        }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('group-ruleset-values').innerHTML = html;
            }
        })
        .catch(function (error) {
            document.getElementById('group-ruleset-values').innerHTML = '<p>Error retrieving rules</p>';
        }); 
}

function selectGroupRuleset(group, ruleset, rulesetID){
    $('#modal-groups').modal("hide");
    // document.getElementById('ruleset-group-'+group).innerHTML = ruleset;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/changeGroupRuleset';

    var groupjson = {}
    groupjson["uuid"] = group;
    groupjson["ruleset"] = ruleset;
    groupjson["rulesetID"] = rulesetID;
    var grJSON = JSON.stringify(groupjson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: grJSON
        })
        .then(function (response) {
            document.getElementById('ruleset-group-'+group).innerHTML = ruleset;
            // GetGroupsDetails();
        })
        .catch(function (error) {
        }); 
}

function modalSelectNodeGroup(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getAllNodesGroup/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            var modalWindowDelete = document.getElementById('modal-groups');
            var html = '<div class="modal-dialog">'+
                '<div class="modal-content">'+
            
                    '<div class="modal-header" style="word-break: break-all;">'+
                        '<h4 class="modal-title">Add nodes to group</h4>'+
                        '<button type="button" class="close" data-dismiss="modal" id="add-node-to-group-cross">&times;</button>'+
                    '</div>'+
            
                    '<div class="modal-body" style="word-break: break-all;">'+
                        '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                            '<thead>'+
                                '<tr>'+
                                    '<th>Node name</th>'+
                                    '<th>Node IP</th>'+
                                    '<th>Select</th>'+
                                '</tr>'+
                            '</thead>'+
                            '<tbody>';
                                for(node in response.data){                                    
                                    html = html + '<tr>'+
                                        '<td style="word-wrap: break-word;">'+response.data[node]["name"]+'</td>'+
                                        '<td style="word-wrap: break-word;">'+response.data[node]["ip"]+'</td>';
                                        if (response.data[node]["checked"] == "true"){
                                            html = html + '<td><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'" checked disabled></td>';
                                        }else{
                                            html = html + '<td><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'"></td>';
                                        }                                        
                                    '</tr>';                                
                                }
                            html = html + '</tbody>'+
                        '</table>'+
                    '</div>'+
                          
                    '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                        '<button type="button" id="add-node-to-group-close" class="btn btn-secondary">Close</button>'+
                        '<button type="button" id="add-node-to-group-button" class="btn btn-primary">Select</button>'+
                    '</div>'+
            
                '</div>'+
            '</div>';
            modalWindowDelete.innerHTML = html;
            $('#modal-groups').modal("show");
            $('#add-node-to-group-button').click(function(){ addNodesToGroup(uuid); });
            $('#add-node-to-group-cross').click(function(){ $('#modal-groups').modal("hide");});
            $('#add-node-to-group-close').click(function(){ $('#modal-groups').modal("hide");});
        })
        .catch(function (error) {
        });
}

function addNodesToGroup(uuid){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/addGroupNodes';

    var nodes = [];
    $("input:checked").each(function () {
        nodes.push($(this).attr("uuid"));
    });

    var nodejson = {}
    nodejson["uuid"] = uuid;
    nodejson["nodes"] = nodes;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
        })
        .then(function (response) {
            GetGroupsDetails();
        })
        .catch(function (error) {
        });  
}

function deleteNodeForGroup(uuid){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/deleteNodeGroup/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            GetGroupsDetails();
        })
        .catch(function error() {
        });
}

function modalDeleteNodeForGroup(uuid, nname){
    var modalWindowDelete = document.getElementById('modal-groups');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Delete node from group list</h4>'+
                '<button type="button" class="close" id="delete-node-group-cross">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" style="word-break: break-all;">'+ 
                '<p>Do you want to remove node <b>'+nname+'</b> from the list?</p>'+
            '</div>'+
    
            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="delete-node-group-close">Close</button>'+
                '<button type="submit" class="btn btn-danger" id="delete-node-group">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#delete-node-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-node-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-node-group').click(function(){ deleteNodeForGroup(uuid); });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function SyncRulesetToAllGroupNodes(groupID){
    document.getElementById('progressBar-create-div').style.display="block";
    document.getElementById('progressBar-create').style.display="block"; 

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/syncGroups';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = groupID;
    var dataJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 300000,
        data: dataJSON
    })
    .then(function (response) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 

        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Ruleset synchronized succesfully for all group nodes.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Ruleset Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Synchronize for all group nodes: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}