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
        GetAllUsers()
    });
}
var payload = "";
loadJSONdata();

function GetAllUsers(){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getAllUsers';

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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Get all user: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Username</th>'+
                            '<th style="width: 15%">Actions</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                    for(id in response.data){
                        html = html + '<tr>'+
                            '<td>'+response.data[id]["user"]+'</td>'+
                            '<td>'+
                                '<i class="fas fa-info-circle" title="View user information" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="ShowUserDetails(\''+id+'\')"></i> &nbsp'+
                                '<i class="fas fa-key" title="Change user password" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalChangePassword(\''+id+'\', \''+response.data[id]["user"]+'\')"></i> &nbsp'+
                                '<i class="fas fa-user-friends" title="Add roles to this user" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalAddUserToRole(\''+id+'\', \''+response.data[id]["user"]+'\')"></i> &nbsp'+
                                '<i class="fas fa-object-ungroup" title="Add this user to groups" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="modalAddUserToGroup(\''+id+'\', \''+response.data[id]["user"]+'\')"></i> &nbsp';
                                if(response.data[id]["deleteable"] != "false"){
                                    html = html + '<i class="fas fa-trash-alt" title="Delete user" style="font-size:18px; color:red; cursor:pointer;" onclick="modalDeleteUser(\''+id+'\', \''+response.data[id]["user"]+'\')"></i>';
                                }
                            html = html + '</td>'+
                        '</tr>'+
                        //user information
                        '<tr id="user-info-'+id+'" style="display:none;" bgcolor="LightSteelBlue">'+                                  
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
                                                '<td>'+roles[x]+'</td>'+
                                                '<td><i class="fas fa-trash-alt" style="color:red;cursor:pointer;" onclick="DeleteUserRole(\''+id+'\', \''+roles[x]+'\')"></i></td>';
                                            '</tr>';
                                        }
                                    }
                                    html = html + '</table>'+
                                '</td>'+
                                '<td>'+
                                    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                                        '<tr>'+
                                            '<th>Groups</th>'+
                                            '<th>Actions</th>'+
                                        '</tr>';
                                        var groups = response.data[id]["groups"].split(",");
                                        for (x in groups){
                                            if(groups[x] != ""){
                                                html = html + '<tr>'+
                                                    '<td>'+groups[x]+'</td>'+
                                                    '<td><i class="fas fa-trash-alt" style="color:red; cursor:pointer;" onclick="DeleteUserGroup(\''+id+'\', \''+groups[x]+'\')"></i></td>';
                                                '</tr>';
                                            }
                                        }
                                        html = html + '</table>'+
                                '</td>'+
                        '</tr>';
                    }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('users-list-td').innerHTML = html;
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all user: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function RoleManagement(){
    // document.location.href = 'https://' + location.hostname + '/role-management.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
    document.location.href = 'https://' + location.hostname + '/role-management.html';
}
function GroupManagement(){
    document.location.href = 'https://' + location.hostname + '/group-management.html';
}

function ShowUserDetails(id){
    var info = document.getElementById('user-info-'+id);
    if(info.style.display == "block"){
        info.style.display = "none"
    }else if(info.style.display == "none"){
        info.style.display = "block"
    }
}

function DeleteUserRole(userID, role){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteUserRole';

    var jsonDelete = {}
    jsonDelete["id"] = userID;
    jsonDelete["role"] = role;
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete user role: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                GetAllUsers();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete user role: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function DeleteUserGroup(userID, group){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteUserGroup';

    var jsonDelete = {}
    jsonDelete["id"] = userID;
    jsonDelete["group"] = group;
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete user group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                GetAllUsers();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete user group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function DeleteUser(id){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    $('#modal-users').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteUser';

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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete user: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                GetAllUsers();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all user: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function modalAddUserToGroup(idUser, name){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getGroupsForUser/'+idUser;
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
        var html = 
        '<div class="modal-dialog" role="document">'+
            '<div class="modal-content">'+
        
            '<div class="modal-header">'+
                '<h4 class="modal-title">Add user '+name+' to groups</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
            
            '<div class="modal-body" style="word-break: break-all;">'+
                '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<tr>'+
                            '<th>Group name</th>'+
                            '<th>Select</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                        for(id in response.data){                                    
                            html = html + '<tr>'+
                                '<td style="word-wrap: break-word;">'+response.data[id]["group"]+'</td>'+
                                '<td><input type="checkbox" id="checkbox-user-to-groups" uuid="'+id+'" value="'+response.data[id]["group"]+'"></td>'+
                            '</tr>';                                
                        }
                    html = html + '</tbody>'+
                '</table>'+
            '</div>'+
        
            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" id="add-user-to-group-btn">Add</button>'+
            '</div>'+
        
            '</div>'+
        '</div>';
        document.getElementById('modal-users').innerHTML = html;

        $('#modal-users').modal().show();
        $('#add-user-to-group-btn').click(function(){ addUsersTo(idUser, "group")});
    })
    .catch(function (error) {
    })
}

function modalAddUserToRole(idUser, name){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getRolesForUser/'+idUser;
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
                '<h4 class="modal-title">Add user '+name+' to roles</h4>'+
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
        document.getElementById('modal-users').innerHTML = html;

        $('#modal-users').modal().show();
        $('#add-user-to-role-btn').click(function(){ addUsersTo(idUser, "role")});

    })
    .catch(function (error) {
    })
}

function addUsersTo(id, type){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    $('#modal-users').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addUsersTo'; 

    //get all checkbox checked
    var list = [];
    $("input:checked").each(function () {
        list.push($(this).attr("uuid"));
    });

    var jsonAdd = {}
    jsonAdd["user"] = id;
    jsonAdd["type"] = type
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
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
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Group added successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
                GetAllUsers();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
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

function modalAddUser(){
    var modalWindow = document.getElementById('modal-users');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Add new user</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
        
        '<div class="modal-body">'+ 
            '<p>Insert user name:</p>'+
            '<input type="text" class="form-control" id="user-name" placeholder="Insert here the new user name"><br>'+
            '<p>Insert user password:</p>'+
            '<input type="text" class="form-control" id="user-pass" placeholder="Insert here the new user password"><br>'+
            '<p>Insert user password again:</p>'+
            '<input type="text" class="form-control" id="user-pass-again" placeholder="Insert here the new user password"><br>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="add-user-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-users').modal().show();
    $('#add-user-btn').click(function(){ AddUser();});
}

function modalAddGroup(){
    var modalWindow = document.getElementById('modal-users');
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
            '<p>Select permissions:</p>'+
            '<div class="form-check">'+
                '<input type="checkbox" class="form-check-input" id="group-check-get" value="get" disabled checked>'+
                '<label class="form-check-label" for="group-check-get">GET</label><br>'+
                '<input type="checkbox" class="form-check-input" id="group-check-put" value="put">'+
                '<label class="form-check-label" for="group-check-put">PUT</label><br>'+
                '<input type="checkbox" class="form-check-input" id="group-check-post" value="post">'+
                '<label class="form-check-label" for="group-check-post">POST</label><br>'+
                '<input type="checkbox" class="form-check-input" id="group-check-delete" value="delete">'+
                '<label class="form-check-label" for="group-check-delete">DELETE</label>'+
            '</div>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="group-user-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-users').modal().show();
    $('#group-user-btn').click(function(){ AddGroup();});
}

function modalChangePassword(id, name){
    var modalWindow = document.getElementById('modal-users');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title">Change '+name+' password</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
            
            '<div class="modal-body">'+ 
                '<p>Insert new password:</p>'+
                '<input type="text" class="form-control" id="user-change-password" placeholder="new password..."><br>'+
                '<p>Verify new password:</p>'+
                '<input type="text" class="form-control" id="user-verify-password" placeholder="Verify password..."><br>'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" id="user-password-btn">Modify</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-users').modal().show();
    $('#user-password-btn').click(function(){ ChangePassword(id);});
}

function modalDeleteUser(id, user){
    var modalWindow = document.getElementById('modal-users');
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
    $('#modal-users').modal().show();
    $('#delete-user-btn').click(function(){ DeleteUser(id);});
}

function AddUser(){
    //check for whitespaces
    if(document.getElementById('user-name').value.trim() == "" || document.getElementById('user-pass').value.trim() == "" ||  document.getElementById('user-pass-again').value.trim() == ""){
        if(document.getElementById('user-name').value.trim() == ""){
            $('#user-name').css('border', '2px solid red');
            $('#user-name').attr("placeholder", "Please, insert a user name"); 
        }else{
            $('#user-name').css('border', '2px solid #ced4da');
        }
        if(document.getElementById('user-pass').value.trim() == ""){
            $('#user-pass').css('border', '2px solid red');
            $('#user-pass').attr("placeholder", "Please, insert a password"); 
        }else{
            $('#user-pass').css('border', '2px solid #ced4da');
        }
        if(document.getElementById('user-pass-again').value.trim() == ""){
            $('#user-pass-again').css('border', '2px solid red');
            $('#user-pass-again').attr("placeholder", "Please, insert a password"); 
        }else{
            $('#user-pass-again').css('border', '2px solid #ced4da');
        }
    }else if(document.getElementById('user-pass').value.trim() != document.getElementById('user-pass-again').value.trim()){
        $('#user-pass-again').val('');
        $('#user-pass-again').css('border', '2px solid red');
        $('#user-pass-again').attr("placeholder", "Passwords are not equals"); 
    }else{
        document.getElementById('progressBar-options').style.display = "block";
        document.getElementById('progressBar-options-div').style.display = "block";
        $('#modal-users').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addUser';

        var jsonDeployService = {}
        jsonDeployService["user"] = document.getElementById('user-name').value.trim();
        jsonDeployService["pass"] = document.getElementById('user-pass').value.trim();
        jsonDeployService["permission"] = "get"
        var dataJSON = JSON.stringify(jsonDeployService);
    
        axios({
            method: 'post',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
            data: dataJSON
        })
        .then(function (response) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Add user: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> User added succcessfully!'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                    GetAllUsers();
                }
            }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add user: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}

function ChangePassword(id){
    //check for whitespaces
    if(document.getElementById('user-change-password').value.trim() == "" || document.getElementById('user-verify-password').value.trim() == ""){
        if(document.getElementById('user-change-password').value.trim() == ""){
            $('#user-change-password').css('border', '2px solid red');
            $('#user-change-password').attr("placeholder", "Please, insert new password"); 
        }else{
            $('#user-change-password').css('border', '2px solid #ced4da');
        }
        if(document.getElementById('user-verify-password').value.trim() == ""){
            $('#user-verify-password').css('border', '2px solid red');
            $('#user-verify-password').attr("placeholder", "Please, verify new password"); 
        }else{
            $('#user-verify-password').css('border', '2px solid #ced4da');
        }
    }else if(document.getElementById('user-change-password').value.trim() != document.getElementById('user-verify-password').value.trim()){
        $('#user-verify-password').val('');
        $('#user-verify-password').css('border', '2px solid red');
        $('#user-verify-password').attr("placeholder", "Passwords are not equals"); 
    }else{
        document.getElementById('progressBar-options').style.display = "block";
        document.getElementById('progressBar-options-div').style.display = "block";
        $('#modal-users').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/changePassword';

        var jsonDeployService = {}
        jsonDeployService["user"] = id;
        jsonDeployService["pass"] = document.getElementById('user-verify-password').value.trim();
        var dataJSON = JSON.stringify(jsonDeployService);
    
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
            data: dataJSON
        })
        .then(function (response) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Change password: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Password changed succcessfully!'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                    GetAllUsers();
                }
            }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change password: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}