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
        GetAllGroups()
    });
}
var payload = "";
loadJSONdata();


function GetAllGroups(){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getAllUserGroups';

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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Get all groups: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
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
                                '<i class="fas fa-user-friends" title="Add roles to this group" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalAddRoleToGroup(\''+id+'\', \''+response.data[id]["group"]+'\')"></i> &nbsp';
                                if(response.data[id]["deleteable"] != "false"){
                                    html = html + '<i class="fas fa-trash-alt" title="Delete user" style="font-size:18px; color:red; cursor:pointer;" onclick="modalDeleteGroup(\''+id+'\', \''+response.data[id]["group"]+'\')"></i>';
                                }
                                html = html + '</td>'+
                        '</tr>'+
                        '<tr id="group-info-'+id+'" style="display:none;" bgcolor="LightSteelBlue">'+                                                     
                            '<td>'+
                                '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                                    '<tr>'+
                                        '<th>Users</th>'+
                                        '<th>Actions</th>'+
                                    '</tr>';
                                    var users = response.data[id]["users"].split(",");
                                    for (x in users){
                                        if(users[x] != ""){
                                            html = html + '<tr>'+
                                                '<td>'+users[x]+'</td>';
                                                if(response.data[id]["deleteable"] != "false"){
                                                    html = html + '<td><i class="fas fa-trash-alt" style="color:red;cursor:pointer;" onclick="DeleteGroupUser(\''+id+'\', \''+users[x]+'\')"></i></td>';
                                                }
                                                html = html + '</tr>';
                                        }
                                    }
                                html = html + '</table>'+
                            '</td>'+
                            '<td>'+
                                '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                                    '<tr>'+
                                        '<th>Roles</th>'+
                                        '<th>Actions</th>'+
                                    '</tr>';
                                    var roles = response.data[id]["roles"].split(",");
                                    for (x in roles){
                                        if(roles[x] != ""){
                                            html = html + '<tr>'+
                                                '<td>'+roles[x]+'</td>';
                                                if(response.data[id]["deleteable"] != "false"){
                                                    html = html + '<td><i class="fas fa-trash-alt" style="color:red;cursor:pointer;" onclick="DeleteGroupRole(\''+id+'\', \''+roles[x]+'\')"></i></td>';
                                                }
                                                html = html + '</tr>';
                                        }
                                    }
                                html = html + '</table>'+
                            '</td>'+
                        '</tr>';
                    }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('group-list-td').innerHTML = html;
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all groups: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            '<p>Insert group name:</p>'+
            '<input type="text" class="form-control" id="group-name" placeholder="Insert here the new group"><br>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="group-group-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#group-group-btn').click(function(){ AddGroup();});
}

function AddGroup(){
    if(document.getElementById('group-name').value.trim() == ""){
        $('#group-name').css('border', '2px solid red');
        $('#group-name').attr("placeholder", "Please, insert group name"); 
    }else{  
        document.getElementById('progressBar-options').style.display = "block";
        document.getElementById('progressBar-options-div').style.display = "block";      
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
                'user': payload.user
                
            }
        })
        .then(function (response) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Add group: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);                    
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong>Group added successfully!'+
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
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add group: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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

function modalDeleteGroup(id, group){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Delete group</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
        
        '<div class="modal-body" style="word-break: break-all;">'+ 
            '<p>Do you want to delete group <b>'+group+'</b>?</p>'+
          '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-danger" id="delete-group-btn">Delete</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#delete-group-btn').click(function(){ DeleteGroup(id);});
}

function DeleteGroup(id){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
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
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong>Group deleted successfully!'+
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
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
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Edit group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> group edited successfully!'+
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Edit group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            'user': payload.user
            
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
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
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
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Add role to group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Role added to group successfully.'+
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Add role to group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function DeleteGroupUser(id, user){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteGroupUser';

    var jsonDelete = {}
    jsonDelete["id"] = id;
    jsonDelete["user"] = user;
    var userDelete = JSON.stringify(jsonDelete);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: userDelete,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete group user: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong>Group user deleted successfully!'+
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete group user: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function DeleteGroupRole(id, role){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteGroupRole';

    var jsonDelete = {}
    jsonDelete["id"] = id;
    jsonDelete["role"] = role;
    var userDelete = JSON.stringify(jsonDelete);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: userDelete,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete group role: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong>Group role deleted successfully!'+
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete group role: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}
