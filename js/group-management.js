function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+location.hostname+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+location.hostname+'/login.html';}

        //login button
        document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllGroups()
    });
}
var payload = "";
loadJSONdata();


function GetAllGroups(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getAllUserGroups';

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Get all groups: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Groups</th>'+
                            '<th style="width: 15%">Actions</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                    for(id in response.data){
                        html = html + '<tr>'+
                            '<td>'+response.data[id]["group"]+'</td>'+
                            '<td>'+
                                '<i class="fas fa-info-circle" title="View user information" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="ShowGroupDetails(\''+id+'\')"></i> &nbsp'+
                                '<i class="fas fa-edit" title="Edit group" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalEditGroup(\''+id+'\', \''+response.data[id]["group"]+'\', \''+response.data[id]["permissions"]+'\')"></i> &nbsp'+
                                '<i class="fas fa-user-friends" title="Add roles to this group" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalAddRoleToGroup(\''+id+'\', \''+response.data[id]["group"]+'\')"></i> &nbsp'+
                                '<i class="fas fa-trash-alt" title="Delete user" style="font-size:18px; color:red; cursor:pointer;" onclick="modalDeleteGroup(\''+id+'\', \''+response.data[id]["group"]+'\')"></i>'+                                
                            '</td>'+
                        '</tr>';
                        // '<tr id="group-info-'+id+'" style="display:none;" bgcolor="LightSteelBlue">'+                                                     
                        //     '<td>'+
                        //         '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                        //             '<tr>'+
                        //                 '<th width="20%">Permissions</th>'+
                        //             '</tr>';
                        //             var groups = response.data[id]["permissions"].split(",");
                        //             for (x in groups){
                        //                 if(group[x] != ""){
                        //                     html = html + '<tr>'+
                        //                         '<td>'+group[x]+'</td>'+
                        //                         // '<td><i class="fas fa-trash-alt" style="color:red;" onclick="DeleteUserRole(\''+id+'\', \''+roles[x]+'\')"></i></td>';
                        //                     '</tr>';
                        //                 }
                        //             }
                        //         html = html + '</table>'+
                        //     '</td>'+
                        //     '<td>'+
                        //         '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                        //             '<tr>'+
                        //                 '<th>Users</th>'+
                        //                 '<th>Actions</th>'+
                        //             '</tr>';
                        //             var users = response.data[id]["users"].split(",");
                        //             for (x in users){
                        //                 if(users[x] != ""){
                        //                     html = html + '<tr>'+
                        //                         '<td>'+users[x]+'</td>'+
                        //                         '<td><i class="fas fa-trash-alt" style="color:red;"></i></td>';
                        //                     '</tr>';
                        //                 }
                        //             }
                        //         html = html + '</table>'+
                        //     '</td>'+
                        //     '<td>'+
                        //         '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                        //             '<tr>'+
                        //                 '<th>Groups</th>'+
                        //                 '<th>Actions</th>'+
                        //             '</tr>';
                        //             var groups = response.data[id]["groups"].split(",");
                        //             for (x in groups){
                        //                 if(groups[x] != ""){
                        //                     html = html + '<tr>'+
                        //                         '<td>'+groups[x]+'</td>'+
                        //                         '<td><i class="fas fa-trash-alt" style="color:red;"></i></td>';
                        //                     '</tr>';
                        //                 }
                        //             }
                        //         html = html + '</table>'+
                        //     '</td>'+
                        // '</tr>';
                    }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('group-list-td').innerHTML = html;
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all groups: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function modalAddGroup(){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Add new group</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
        
        '<div class="modal-body">'+ 
            '<p>Insert user name:</p>'+
            '<input type="text" class="form-control" id="group-name" placeholder="Insert here the new group"><br>'+
            // '<p>Select permissions:</p>'+
            // '<div class="form-check">'+
            //     '<input type="checkbox" class="form-check-input" id="group-check-get" value="get" disabled checked>'+
            //     '<label class="form-check-label" for="group-check-get">GET</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="group-check-put" value="put">'+
            //     '<label class="form-check-label" for="group-check-put">PUT</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="group-check-post" value="post">'+
            //     '<label class="form-check-label" for="group-check-post">POST</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="group-check-delete" value="delete">'+
            //     '<label class="form-check-label" for="group-check-delete">DELETE</label>'+
            // '</div>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="group-user-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#group-user-btn').click(function(){ AddGroup();});
}

function AddGroup(){
    if(document.getElementById('group-name').value.trim() == ""){
        $('#group-name').css('border', '2px solid red');
        $('#group-name').attr("placeholder", "Please, insert group name"); 
    }else{        
        $('#modal-window').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addGroupUsers';
    
        //get all checkbox checked
        var list = [];
        $('input[type=checkbox]:checked').each(function(index){
            list.push($(this).val());
        });
          
        var jsonDelete = {}
        jsonDelete["group"] = document.getElementById('group-name').value;
        jsonDelete["permissions"] = list.toString();
        var userDelete = JSON.stringify(jsonDelete);
    
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: userDelete,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            }
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Add group: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);                    
                }else{
                    GetAllGroups();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add group: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}

function ShowGroupDetails(id){
    var info = document.getElementById('group-info-'+id);
    if(info.style.display == "block"){
        info.style.display = "none"
    }else if(info.style.display == "none"){
        info.style.display = "block"
    }
}


function modalDeleteGroup(id, user){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Delete user</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
        
        '<div class="modal-body" style="word-break: break-all;">'+ 
            '<p>Do you want to delete user <b>'+user+'</b>?</p>'+
          '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-danger" id="delete-user-btn">Delete</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#delete-user-btn').click(function(){ DeleteGroup(id);});
}

function DeleteGroup(id){
    $('#modal-window').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteUserGroup';

    var jsonDelete = {}
    jsonDelete["id"] = id;
    var userDelete = JSON.stringify(jsonDelete);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: userDelete,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                GetAllGroups();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}


function modalEditGroup(id, name, permissions){
    
    var html = '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Edit group '+name+'</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
        
        '<div class="modal-body">'+ 
            '<p>Edit username:</p>'+
            '<input type="text" class="form-control" id="edit-group-name" value='+name+'><br>'+
            // '<p>Edit permissions:</p>'+
            // '<div class="form-check">'+
            //     '<input type="checkbox" class="form-check-input" id="edit-group-check-get" value="get" disabled checked>'+
            //     '<label class="form-check-label" for="group-check-get">GET</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="edit-group-check-put" value="put">'+
            //     '<label class="form-check-label" for="group-check-put">PUT</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="edit-group-check-post" value="post">'+
            //     '<label class="form-check-label" for="group-check-post">POST</label><br>'+
            //     '<input type="checkbox" class="form-check-input" id="edit-group-check-delete" value="delete">'+
            //     '<label class="form-check-label" for="group-check-delete">DELETE</label>'+
            // '</div>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="group-user-btn">Edit</button>'+
        '</div>'+

        '</div>'+
    '</div>';

    document.getElementById('modal-window').innerHTML = html;

    var permissions = permissions.split(",");
    for(x in permissions){
        html = html + '';
        if(permissions[x] == "get"){document.getElementById("edit-group-check-get").checked = true;}
        if(permissions[x] == "put"){document.getElementById("edit-group-check-put").checked = true;}
        if(permissions[x] == "post"){document.getElementById("edit-group-check-post").checked = true;}
        if(permissions[x] == "delete"){document.getElementById("edit-group-check-delete").checked = true;}
    }

    $('#modal-window').modal().show();
    $('#group-user-btn').click(function(){EditGroup(id, document.getElementById("edit-group-name").value); });
}

function EditGroup(id, name){
    $('#modal-window').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/editUserGroup';

    var list = [];
    $('input[type=checkbox]:checked').each(function(index){
        list.push($(this).val());
    });

    var jsonDelete = {}
    jsonDelete["id"] = id;
    jsonDelete["group"] = name;
    jsonDelete["permissions"] = list.toString();
    var userDelete = JSON.stringify(jsonDelete);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: userDelete,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Edit group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> group edited successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
                GetAllGroups();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Edit group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function modalAddRoleToGroup(idUser, name){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getRolesForGroups/'+idUser;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid
        }
    })
    .then(function (response) {
        var html = 
        '<div class="modal-dialog" role="document">'+
            '<div class="modal-content">'+
        
            '<div class="modal-header">'+
                '<h4 class="modal-title">Add role to group '+name+'</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
            
            '<div class="modal-body" style="word-break: break-all;">'+
                '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Role name</th>'+
                            '<th>Select</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                        for(id in response.data){                                    
                            html = html + '<tr>'+
                                '<td style="word-wrap: break-word;">'+response.data[id]["role"]+'</td>'+
                                '<td><input type="checkbox" id="checkbox-user-to-role" uuid="'+id+'" value="'+response.data[id]["role"]+'"></td>'+
                            '</tr>';                                
                        }
                    html = html + '</tbody>'+
                '</table>'+
            '</div>'+
        
            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" id="add-user-to-role-btn">Add</button>'+
            '</div>'+
        
            '</div>'+
        '</div>';
        document.getElementById('modal-window').innerHTML = html;

        $('#modal-window').modal().show();
        $('#add-user-to-role-btn').click(function(){ AddRoleToGroup(idUser)});

    })
    .catch(function (error) {
    })
}

function AddRoleToGroup(id){
    $('#modal-window').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addRoleToGroup'; 

    //get all checkbox checked
    var list = [];
    $("input:checked").each(function () {
        list.push($(this).attr("uuid"));
    });

    var jsonAdd = {}
    jsonAdd["group"] = id;
    jsonAdd["values"] = list.toString();
    var userTo = JSON.stringify(jsonAdd);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: userTo,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Add role to group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Role added to group successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Add role to group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}