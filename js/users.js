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
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
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
                        '<th style="width: 10%">Actions</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody>';
                for(id in response.data){
                    html = html + '<tr>'+
                        '<td>'+response.data[id]["user"]+'</td>'+
                        '<td><i class="fas fa-trash-alt" style="color:red; cursor:pointer;" onclick="modalDeleteUser(\''+id+'\', \''+response.data[id]["user"]+'\')"></i></td>'+
                    '</tr>';
                }
                html = html + '</tbody>';
                document.getElementById('users-list-td').innerHTML = html;
        }
    })
    .catch(function (error) {
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

function DeleteUser(id){
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
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
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
    })
    .catch(function (error) {
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

function AddRole(){
    $('#modal-users').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addRole';

    var jsonDelete = {}
    jsonDelete["role"] = document.getElementById('role-name').value;
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
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add Role: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Role added successfully.'+
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
            '<strong>Error!</strong> Add Role: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function AddGroup(){
    $('#modal-users').modal('hide');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addGroupUsers';

    var jsonDelete = {}
    jsonDelete["group"] = document.getElementById('group-name').value;
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

function modalAddRole(){
    var modalWindow = document.getElementById('modal-users');
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
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
            '<button type="submit" class="btn btn-primary" id="role-user-btn">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';
    $('#modal-users').modal().show();
    $('#role-user-btn').click(function(){ AddRole();});
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
        $('#modal-users').modal('hide');
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addUser';

        var jsonDeployService = {}
        jsonDeployService["user"] = document.getElementById('user-name').value.trim();
        jsonDeployService["pass"] = document.getElementById('user-pass').value.trim();
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
            if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
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
        })
        .catch(function (error) {
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