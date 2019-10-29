function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllGroups();
    });
}
loadJSONdata();

function modalAddGroup(){
    var modalWindow = document.getElementById('modal-groups');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title" id="group-header">Add group</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body" id="group-modal-footer-inputtext">'+
                '<p>Insert name:</p>'+
                '<input type="text" class="form-control" id="recipient-name-group" placeholder="Insert here a new name"><br>'+
                '<p>Insert description:</p>'+
                '<input type="text" class="form-control" id="recipient-desc-group" placeholder="Insert here a new description">'+
            '</div>'+

            '<div class="modal-footer" id="group-modal-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="add-group-modal-close">Cancel</button>'+
                '<button type="button" class="btn btn-primary" id="add-group-modal">Add</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#add-group-modal').click(function(){ addGroup(); });
    $('#add-group-modal-close').click(function(){ $('#modal-groups').modal("hide");});
}

function addGroup() {
    $('#modal-groups').modal("hide");
    var groupname = document.getElementById('recipient-name-group').value;
    var groupdesc = document.getElementById('recipient-desc-group').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var groupurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/';
    
    // formAddGroup();//close add group form
    var nodejson = {}
    nodejson["name"] = groupname;
    nodejson["desc"] = groupdesc;
    nodejson["ruleset"] = "";
    nodejson["rulesetID"] = "";
    nodejson["type"] = "Nodes";
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'post',
        url: groupurl,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        GetAllGroups();
        return true;
    })
    .catch(function (error) {
        return false;
    });   
}

function GetAllGroups(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-groups');
    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';
    document.getElementById('group-text').style.display ="none";

    axios({
        method: 'get',
        url: groupurl,
        timeout: 30000
    })
    .then(function (response) {
        console.log(response.data);
        document.getElementById('group-text').style.display ="block";
        if(response.data == null){
            result.innerHTML= '<div style="text-align:center"><h3>No groups created</h3></div>';
        }else if (response.data.ack == "false") {
            result.innerHTML= '<div style="text-align:center"><h3 style="color:red;">Error retrieving groups data</h3></div>';
        }else{
            var html = "";
            html = html + '<div>'+
            '<table class="table table-hover" style="table-layout: fixed" width="100%">' +
                '<thead>' +
                    '<tr>' +
                        '<th width="20%">Name</th>' +
                        '<th>Description</th>' +
                        '<th width="15%">Actions</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>'; 
                    for(x=0; x<response.data.length; x++){
                        var groups = response.data[x];
                        html = html + '<tr bgcolor="powderblue">'+
                            '<td style="word-wrap: break-word;">'+
                                groups['gname']+
                            '</td><td style="word-wrap: break-word;">'+
                                groups['gdesc']+
                            '</td><td style="word-wrap: break-word;">'+
                                '<i class="fas fa-edit" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Edit group" onclick="showEditGroup(\''+groups['guuid']+'\')"></i> &nbsp;'+
                                '<i class="fas fa-plus" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Add nodes to group" onclick="modalSelectNodeGroup(\''+groups['guuid']+'\')"></i>  &nbsp'+
                                '<i class="fas fa-chevron-circle-down" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Show nodes values" id="show-nodes-details-'+groups['guuid']+'" onclick="ShowNodesValue(\''+groups['guuid']+'\')"></i> &nbsp'+
                                '<i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete group" onclick="modalDeleteGroup(\''+groups['gname']+'\',\''+groups['guuid']+'\')"></i>'+
                            '</td>'+
                        '</tr>'+
                        '<tr>'+
                            '<td id="edit-group-row-'+groups['guuid']+'" colspan="3" style="display:none;">'+
                                '<table class="table" style="table-layout: fixed" width="100%">'+
                                    '<tr>'+
                                        '<td width="40%">Name: <input class="form-control" id="edit-group-name-'+groups['guuid']+'"></td>'+
                                        '<td width="50%">Description: <input class="form-control" id="edit-group-desc-'+groups['guuid']+'"></td>'+
                                        '<td width="10%">'+
                                            '<a class="btn btn-secondary float-right text-decoration-none text-white my-2" onclick="hideEditGroup(\''+groups['guuid']+'\')">Cancel</a>'+
                                            '<a class="btn btn-primary float-right text-decoration-none text-white my-2" id="edit-group-save" onclick="EditGroupData(\''+groups['guuid']+'\')">Modify</a>'+
                                        '</td>'+
                                    '</tr>'+
                                '</table>'+
                            '</td>'+
                        '</tr>'+
                        '<tr id="nodes-for-group-'+groups['guuid']+'" style="display:none;">'+
                            '<td colspan="3">'+
                                '<b>Nodes</b>'+
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
                                            '<td>From fodler</td>'+
                                            '<td>/usr/local/owlh/suricata/confs</td>'+
                                        '</tr>'+
                                        '<tr>'+                           
                                            '<td>Ruleset &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select ruleset" onclick="modalLoadRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['grulesetID']+'\')"></i></td>'+
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
                html = html + '</tbody></table></div>';
            result.innerHTML = html;
        }

    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
    // PingGroupNodes();
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
            GetAllGroups();
        })
        .catch(function (error) {
        }); 
}

// function PingGroupNodes(){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/pingGroupNodes';
//     axios({
//         method: 'get',
//         url: nodeurl,
//         timeout: 30000
//         })
//         .then(function (response) {
//             // console.log(response.data); 
//             for(id in response.data){
//                 // console.log(response.data[id]["groupid"]);                
//                 GetNodeValues(response.data[id]["groupid"], response.data[id]["nodesid"]);   
//             }
//         });
// }

// function GetNodeValues(groupid, nodeid){
//     console.log("GROUP ID --> "+groupid);
//     console.log("NODE ID --> "+nodeid);
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getNodeValues/'+nodeid;
//     axios({
//         method: 'get',
//         url: nodeurl,
//         timeout: 30000
//         })
//         .then(function (response) {
//             var values = response.data;
//             var row = document.getElementById('nodes-for-group-'+groupid).innerHTML;
//             for(id in values){
//                 if (id == nodeid){
//                     row = row + '<b>IP: </b><b>'+values[id]["ip"]+'</b><br>'
//                     row = row + '<b>Name: </b><b>'+values[id]["name"]+'</b><br>'
//                     console.log(response.data[id]);
//                 }
//             }

//         });
// }

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
            GetAllGroups();
        })
        .catch(function (error) {
        });  
}

function modalDeleteGroup(name, groupID){
    var modalWindowDelete = document.getElementById('modal-groups');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Groups</h4>'+
                '<button type="button" class="close" id="delete-group-cross">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" style="word-break: break-all;">'+ 
                '<p>Do you want to delete group <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="delete-group-close">Close</button>'+
                '<button type="submit" class="btn btn-danger" id="delete-group-button">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#delete-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-group-button').click(function(){ deleteGroup(groupID); });
}

function showEditGroup(uuid){
    // document.getElementById('edit-group-row-'+uuid).style.display = "block";
    $('#edit-group-row-'+uuid).show();
}

function hideEditGroup(uuid){
    // document.getElementById('edit-group-row-'+uuid).style.display = "none";
    $('#edit-group-row-'+uuid).hide();
}

function EditGroupData(uuid){
    hideEditGroup(uuid);
    var name = document.getElementById('edit-group-name-'+uuid).value;
    var desc = document.getElementById('edit-group-desc-'+uuid).value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/editGroup';
    var nodejson = {}
    nodejson["name"] = name;
    nodejson["uuid"] = uuid;
    nodejson["desc"] = desc;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
        })
        .then(function (response) {
            GetAllGroups();
        })
        .catch(function (error) {
        });   
}

function deleteGroup(groupID){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/DeleteGroup/' + groupID;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            GetAllGroups();
        })
        .catch(function error() {
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
            GetAllGroups();
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

function ShowNodesValue (uuid){
    var detailsButton = document.getElementById('show-nodes-details-'+uuid);
    var content = document.getElementById('nodes-for-group-'+uuid);

    if (content.style.display == "none") {
        detailsButton.className = "fas fa-chevron-circle-up";
        $('#nodes-for-group-'+uuid).show();
    } else {
        detailsButton.className = "fas fa-chevron-circle-down";
        $('#nodes-for-group-'+uuid).hide();
    }
}

function SyncRulesetToAllGroupNodes(nid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/syncGroups';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = nid;
    var dataJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
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