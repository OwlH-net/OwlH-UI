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

    // formAddGroup();
    axios({
        method: 'get',
        url: groupurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('group-text').style.display ="block";
        result.innerHTML = generateAllGroupsHTMLOutput(response);
        // $('#add-group-modal').click(function(){ addGroup(); });
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>'+
        '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
        checkStatus();
    });
}

function generateAllGroupsHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving groups data</h3></div>';
    }
    var isEmpty = true;
    var groups = response.data;
    var html = '<table class="table table-hover" style="table-layout: fixed" width="100%">' +
        '<thead>                                                      ' +
        '<tr>                                                         ' +
            '<th width="20%">Name</th>                           ' +
            '<th>Description</th>                              ' +
            '<th width="10%">Actions</th>                      ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      '; 
    for (group in groups) {
        isEmpty = false;
        html = html + '<tr>'+
            '<td style="word-wrap: break-word;">'+
            groups[group]['name']+
            '</td><td style="word-wrap: break-word;">'+
            groups[group]['desc']+
            '</td><td style="word-wrap: break-word;">'+
                '<i class="fas fa-edit" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Edit group" onclick="showEditGroup(\''+group+'\')"></i> &nbsp;'+
                '<i class="fas fa-plus" style="cursor: pointer; color: Dodgerblue; font-size: 20px" title="Add nodes to group" onclick="modalSelectNodeGroup(\''+group+'\')"></i>  &nbsp'+
                '<i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete group" onclick="modalDeleteGroup(\''+groups[group]['name']+'\',\''+group+'\')"></i>'+
            '</td>'+
        '</tr>'+
        '<tr id="edit-group-row-'+group+'" style="display: none;">'+
            '<td>Name: <input class="form-control" id="edit-group-name-'+group+'"></td>'+
            '<td>Description: <input class="form-control" id="edit-group-desc-'+group+'"></td>'+
            '<td>'+
                '<a class="btn btn-secondary float-right text-decoration-none text-white" onclick="hideEditGroup(\''+group+'\')">Cancel</a>'+
                '<a class="btn btn-primary float-right text-decoration-none text-white" id="edit-group-save" onclick="EditGroupData(\''+group+'\')">Modify</a>'+
            '</td>'+
        '</tr>';
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<h3 style="text-align:center">No groups created</h3>';
    }else{
        return html;
    }
}

function modalSelectNodeGroup(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getAllNodesGroup';
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
                                        '<td style="word-wrap: break-word;">'+response.data[node]["ip"]+'</td>'+
                                        '<td><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'"></td>'+
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
                '<button type="submit" class="btn btn-danger" id="delete-group-button" onclick="deleteGroup(\''+groupID+'\')">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#id="delete-group-cross"').click(function(){ $('#modal-groups').modal("hide");});
    $('#id="delete-group-close"').click(function(){ $('#modal-groups').modal("hide");});
    $('#id="delete-group-button"').click(function(){ deleteGroup(groupID); });
}

function showEditGroup(uuid){
    document.getElementById('edit-group-row-'+uuid).style.display = "block";
}

function hideEditGroup(uuid){
    document.getElementById('edit-group-row-'+uuid).style.display = "none";
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
    $('#modal-groups').modal("show");
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

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

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