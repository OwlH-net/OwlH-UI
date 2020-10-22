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
        GetAllRoles()
    });
}
var payload = "";
loadJSONdata();

function GetAllRoles(){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getAllRoles';

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
        console.log(response.data);
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
                    '<strong>Error!</strong> Get all roles: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
                    '<thead>'+
                        '<tr>'+
                            '<th width="20%">Role</th>'+
                            '<th>Description</th>'+
                            '<th style="width: 15%">Actions</th>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                    for(id in response.data){
                        html = html + '<tr>'+
                            '<td>'+response.data[id]["role"]+'</td>'+
                            '<td>'+response.data[id]["desc"]+'</td>'+
                            '<td>'+
                                '<i class="fas fa-info-circle" title="View user information" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="ShowRoleDetails(\''+id+'\', \''+response.data[id]["role"]+'\')"></i> &nbsp'+
                                '<i class="fas fa-edit" title="Edit roles permissions" style="font-size:18px; color:dodgerblue; cursor:pointer;" onclick="EditRole(\''+id+'\', \''+response.data[id]["role"]+'\', \''+response.data[id]["desc"]+'\', \''+response.data[id]["permissions"]+'\')"></i> &nbsp';
                                if(response.data[id]["deleteable"] != "false"){
                                    html = html + '<i class="fas fa-trash-alt" title="Delete user" style="font-size:18px; color:red; cursor:pointer;" onclick="modalDeleteRole(\''+id+'\', \''+response.data[id]["role"]+'\')"></i>';
                                }
                                html = html + '</td>'+
                        '</tr>';
                    }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('role-list-td').innerHTML = html;
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "block";
        document.getElementById('progressBar-options-div').style.display = "block";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all roles: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function EditRole(id, role, desc, permissions){
    document.location.href = 'https://' + location.host + '/role-list.html?id='+id+'&role='+role+'&permissions='+permissions+'&desc='+desc;
}

function RoleDetails(){
    document.location.href = 'https://' + location.host + '/role-list.html';
}

function ShowRoleDetails(id, role){
    document.location.href = 'https://' + location.host + '/role-details.html?id='+id+'&role='+role;
}

function modalAddRole(){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog" role="document">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Add new role</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
        
        '<div class="modal-body">'+ 
            '<p>Insert user name:</p>'+
            '<input type="text" class="form-control" id="role-name" placeholder="Insert here the new role"><br>'+
            '<p>Select permissions:</p>'+
            '<div class="form-check">'+
                '<input type="checkbox" class="form-check-input" id="role-check-get" value="get" disabled checked>'+
                '<label class="form-check-label" for="role-check-get">GET</label><br>'+
                '<input type="checkbox" class="form-check-input" id="role-check-put" value="put">'+
                '<label class="form-check-label" for="role-check-put">PUT</label><br>'+
                '<input type="checkbox" class="form-check-input" id="role-check-post" value="post">'+
                '<label class="form-check-label" for="role-check-post">POST</label><br>'+
                '<input type="checkbox" class="form-check-input" id="role-check-delete" value="delete">'+
                '<label class="form-check-label" for="role-check-delete">DELETE</label>'+
            '</div>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="role-user-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-window').modal().show();
    $('#role-user-btn').click(function(){ AddRole();});
}

function AddRole(){
    if(document.getElementById('role-name').value.trim() == ""){
        $('#role-name').css('border', '2px solid red');
        $('#role-name').attr("placeholder", "Please, insert role name"); 
    }else{  
        document.getElementById('progressBar-options').style.display = "block";
        document.getElementById('progressBar-options-div').style.display = "block";      
        $('#modal-window').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addRole';
    
        //get all checkbox checked
        var list = [];
        $('input[type=checkbox]:checked').each(function(index){
            list.push($(this).val());
        });
          
        var jsonDelete = {}
        jsonDelete["role"] = document.getElementById('role-name').value.trim();
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
                        '<strong>Error!</strong> Add Role: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);                    
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Role added successfully!'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                    GetAllRoles();
                }
            }
        })
        .catch(function (error) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add Role: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function modalDeleteRole(id, user){
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
    $('#delete-user-btn').click(function(){ DeleteRole(id);});
}

function DeleteRole(id){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    $('#modal-window').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteRole';

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
                    '<strong>Error!</strong> Delete role: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Role deleted successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                GetAllRoles();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete role: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}


// function modalEditRole(id, name, permissions){    
//     var html = '<div class="modal-dialog" role="document">'+
//         '<div class="modal-content">'+

//         '<div class="modal-header">'+
//             '<h4 class="modal-title">Edit Role '+name+'</h4>'+
//             '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
//             '</div>'+
        
//         '<div class="modal-body">'+ 
//             '<p>Edit username:</p>'+
//             '<input type="text" class="form-control" id="edit-role-name" value='+name+'><br>'+
//             '<p>Edit permissions:</p>'+
//             '<div class="form-check">'+
//                 '<input type="checkbox" class="form-check-input" id="edit-role-check-get" value="get" disabled checked>'+
//                 '<label class="form-check-label" for="role-check-get">GET</label><br>'+
//                 '<input type="checkbox" class="form-check-input" id="edit-role-check-put" value="put">'+
//                 '<label class="form-check-label" for="role-check-put">PUT</label><br>'+
//                 '<input type="checkbox" class="form-check-input" id="edit-role-check-post" value="post">'+
//                 '<label class="form-check-label" for="role-check-post">POST</label><br>'+
//                 '<input type="checkbox" class="form-check-input" id="edit-role-check-delete" value="delete">'+
//                 '<label class="form-check-label" for="role-check-delete">DELETE</label>'+
//             '</div>'+
//         '</div>'+

//         '<div class="modal-footer">'+
//             '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
//             '<button type="submit" class="btn btn-primary" id="role-user-btn">Edit</button>'+
//         '</div>'+

//         '</div>'+
//     '</div>';

//     document.getElementById('modal-window').innerHTML = html;

//     var permissions = permissions.split(",");
//     for(x in permissions){
//         html = html + '';
//         if(permissions[x] == "get"){document.getElementById("edit-role-check-get").checked = true;}
//         if(permissions[x] == "put"){document.getElementById("edit-role-check-put").checked = true;}
//         if(permissions[x] == "post"){document.getElementById("edit-role-check-post").checked = true;}
//         if(permissions[x] == "delete"){document.getElementById("edit-role-check-delete").checked = true;}
//     }

//     $('#modal-window').modal().show();
//     $('#role-user-btn').click(function(){EditRole(id, document.getElementById("edit-role-name").value); });
// }

// function EditRole(id, name){
//     document.getElementById('progressBar-options').style.display = "block";
//     document.getElementById('progressBar-options-div').style.display = "block";
//     $('#modal-window').modal('hide');
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/editRole';

//     var list = [];
//     $('input[type=checkbox]:checked').each(function(index){
//         list.push($(this).val());
//     });

//     var jsonDelete = {}
//     jsonDelete["id"] = id;
//     jsonDelete["role"] = name;
//     jsonDelete["permissions"] = list.toString();
//     var userDelete = JSON.stringify(jsonDelete);

//     axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         data: userDelete,
//         headers:{
//             'token': document.cookie,
//             'user': payload.user
//             
//         }
//     })
//     .then(function (response) {
//         document.getElementById('progressBar-options').style.display = "none";
//         document.getElementById('progressBar-options-div').style.display = "none";
//         if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         if(response.data.permissions == "none"){
//             PrivilegesMessage();              
//         }else{   
//             if (response.data.ack == "false") {
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                 alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//                     '<strong>Error!</strong> Edit role: '+response.data.error+'.'+
//                     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                         '<span aria-hidden="true">&times;</span>'+
//                     '</button>'+
//                 '</div>';
//                 setTimeout(function() {$(".alert").alert('close')}, 30000);
//             }else{
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                 alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
//                     '<strong>Success!</strong> Role edited successfully!'+
//                     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                         '<span aria-hidden="true">&times;</span>'+
//                     '</button>'+
//                 '</div>';
//                 setTimeout(function() {$(".alert").alert('close')}, 30000);
//                 GetAllRoles();
//             }
//         }
//     })
//     .catch(function (error) {
//         document.getElementById('progressBar-options').style.display = "none";
//         document.getElementById('progressBar-options-div').style.display = "none";
//         $('html,body').scrollTop(0);
//         var alert = document.getElementById('floating-alert');
//         alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//             '<strong>Error!</strong> Edit role: '+error+'.'+
//             '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                 '<span aria-hidden="true">&times;</span>'+
//             '</button>'+
//         '</div>';
//         setTimeout(function() {$(".alert").alert('close')}, 30000);
//     });
// }

function DeleteRoleUser(id, user){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteRoleUser';

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
                    '<strong>Error!</strong> Delete role user: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Role user deleted successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                GetAllRoles();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete role user: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function DeleteRoleGroup(id, group){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteRoleGroup';

    var jsonDelete = {}
    jsonDelete["id"] = id;
    jsonDelete["group"] = group;
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
                    '<strong>Error!</strong> Delete role group: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Role group deleted successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                GetAllRoles();
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete role group: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}