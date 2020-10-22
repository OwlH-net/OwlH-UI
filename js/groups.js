function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
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
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 
        GetAllGroups();
    });
}
var payload = "";
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
    var nameInput = document.getElementById('recipient-name-group').value.trim();
    var descInput = document.getElementById('recipient-desc-group').value.trim();
    if(nameInput == "" || descInput == ""){
        if(nameInput == ""){
            $("#recipient-name-group").css('border', '2px solid red');
        }else{
            $("#recipient-name-group").css('border', '');
        }
        if(descInput == ""){
            $("#recipient-desc-group").css('border', '2px solid red');
        }else{
            $("#recipient-desc-group").css('border', '');
        }
    }else{
        $('#modal-groups').modal("hide");
        var groupname = document.getElementById('recipient-name-group').value.trim();
        var groupdesc = document.getElementById('recipient-desc-group').value.trim();
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var groupurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/';
        
        // formAddGroup();//close add group form
        var nodejson = {}
        nodejson["name"] = groupname;
        nodejson["desc"] = groupdesc;
        nodejson["type"] = "Nodes";
        nodejson["ruleset"] = "";
        nodejson["rulesetID"] = "";
        nodejson["mastersuricata"] = "";
        nodejson["nodesuricata"] = "";
        nodejson["masterzeek"] = "";
        nodejson["nodezeek"] = "";
        nodejson["interface"] = "";
        nodejson["BPFfile"] = "";
        nodejson["BPFrule"] = "";
        nodejson["configFile"] = "";
        nodejson["commandLine"] = "";
        var nodeJSON = JSON.stringify(nodejson);
    
        axios({
            method: 'post',
            url: groupurl,
            timeout: 30000,
            headers:{'token': document.cookie,'user': payload.user},
            data: nodeJSON
        })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Add group Error: </strong> Add group error: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Group added succesfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                    GetAllGroups();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Add group Error: </strong> Add group error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });   
    }
}

function GetAllGroups(){
    document.getElementById('progressBar-create-div').style.display="block";
    document.getElementById('progressBar-create').style.display="block"; 
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-groups');
    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';
    document.getElementById('group-text').style.display ="none";
    axios({
        method: 'get',
        url: groupurl,
        timeout: 60000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
   .then(function (response) {
        if(!response.data){
            document.getElementById('progressBar-create-div').style.display="none";
            document.getElementById('progressBar-create').style.display="none"; 
            result.innerHTML= '<div style="text-align:center"><h3>No groups created</h3></div>';
        }else if(response.data.token == "none"){
           document.cookie=""; document.location.href='login.html';
        }else if(response.data.permissions == "none"){
           PrivilegesMessage();              
           document.getElementById('progressBar-create-div').style.display="none";
           document.getElementById('progressBar-create').style.display="none"; 
        }else{
            document.getElementById('progressBar-create-div').style.display="none";
            document.getElementById('progressBar-create').style.display="none"; 
            
            document.getElementById('group-text').style.display ="block";            
            if (response.data.ack == "false") {
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
                            html = html + '<tr>'+
                                '<td style="word-wrap: break-word;">'+
                                    groups['gname']+
                                '</td><td style="word-wrap: break-word;">'+
                                    groups['gdesc']+
                                '</td><td style="word-wrap: break-word;">'+
                                    '<i class="fas fa-edit" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Edit group" onclick="showEditGroup(\''+groups['guuid']+'\')"></i> &nbsp;'+
                                    // '<i class="fas fa-plus" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Add nodes to group" onclick="modalSelectNodeGroup(\''+groups['guuid']+'\')"></i>  &nbsp'+
                                    '<i class="fas fa-eye" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Show nodes values" id="show-nodes-details-'+groups['guuid']+'" onclick="ShowNodesValue(\''+groups['guuid']+'\', \''+groups['gname']+'\')"></i> &nbsp'+
                                    '<i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete group" onclick="modalDeleteGroup(\''+groups['gname']+'\',\''+groups['guuid']+'\')"></i>'+
                                '</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td id="edit-group-row-'+groups['guuid']+'" colspan="3" style="display:none;">'+
                                    '<table class="table" style="table-layout: fixed" width="100%">'+
                                        '<tr>'+
                                            '<td width="40%">Name: <input class="form-control" id="edit-group-name-'+groups['guuid']+'" value="'+groups['gname']+'"></td>'+
                                            '<td width="50%">Description: <input class="form-control" id="edit-group-desc-'+groups['guuid']+'" value="'+groups['gdesc']+'"></td>'+
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
                    html = html + '</tbody></table></div>';
                result.innerHTML = html;
            }
        }

    })
    .catch(function (error) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>GetAllGroups Error: </strong>'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);

        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
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
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
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
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Load ruleset Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);

            document.getElementById('group-ruleset-values').innerHTML = '<p>Error retrieving rules</p>';
        }); 
}

function selectGroupRuleset(group, ruleset, rulesetID){
    $('#modal-groups').modal("hide");
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
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
        })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Group ruleset Error: </strong>'+error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    document.getElementById('ruleset-group-'+group).innerHTML = ruleset;
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Group ruleset Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }); 
}

function modalSelectNodeGroup(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getAllNodesGroup/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Select group node Error: </strong>'+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    var modalWindowView = document.getElementById('modal-groups');
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
    
                    modalWindowView.innerHTML = html;
                    $('#modal-groups').modal("show");
                    $('#add-node-to-group-button').click(function(){ addNodesToGroup(uuid); });
                    $('#add-node-to-group-cross').click(function(){ $('#modal-groups').modal("hide");});
                    $('#add-node-to-group-close').click(function(){ $('#modal-groups').modal("hide");});
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Select group node Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        headers:{'token': document.cookie,'user': payload.user},
        data: nodeJSON
        })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Add nodes to group Error: </strong>'+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    GetAllGroups();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Add nodes to group Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
    $('#edit-group-row-'+uuid).show();
}

function hideEditGroup(uuid){
    $('#edit-group-row-'+uuid).hide();
}

function EditGroupData(uuid){    
    var name = document.getElementById('edit-group-name-'+uuid).value.trim();
    var desc = document.getElementById('edit-group-desc-'+uuid).value.trim();    

    if(name == ""  || desc == ""){
        if(name == ""){
            $("#edit-group-name-"+uuid).css('border', '2px solid red');
            $("#edit-group-name-"+uuid).attr("placeholder", "Insert a valid name...");
        }else{
            $("#edit-group-name-"+uuid).css('border', '');
        }
        if(desc == ""){
            $("#edit-group-desc-"+uuid).css('border', '2px solid red');
            $("#edit-group-desc-"+uuid).attr("placeholder", "Insert a valid description");
        }else{
            $("#edit-group-desc-"+uuid).css('border', '');
        }
    }else{
        hideEditGroup(uuid);
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
            headers:{'token': document.cookie,'user': payload.user},
            data: nodeJSON
            })
           .then(function (response) {
                if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
                if(response.data.permissions == "none"){
                    PrivilegesMessage();              
                }else{
                    if(response.data.ack == "false"){
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Edit group Error: </strong>'+response.data.error+'.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                    }else{
                        GetAllGroups();
                    }
                }
            })
            .catch(function (error) {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Edit group Error: </strong>'+error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            });   
    }
}

function deleteGroup(groupID){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/DeleteGroup/' + groupID;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
    })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Delete group Error: </strong>'+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    GetAllGroups();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Delete group Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function deleteNodeForGroup(uuid){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/deleteNodeGroup/' + uuid;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Delete node for group Error: </strong>'+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    GetAllGroups();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Delete node for group Error: </strong>'+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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

function ShowNodesValue (uuid, gname){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + location.host + '/groups-info.html?uuid='+uuid+'&gname='+gname;
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
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            document.getElementById('progressBar-create-div').style.display="none";
            document.getElementById('progressBar-create').style.display="none"; 
            PrivilegesMessage();              
        }else{
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
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Ruleset Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Synchronize for all group nodes: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}