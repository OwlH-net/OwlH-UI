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

        var urlData = new URL(window.location.href);
        var editRoleID = urlData.searchParams.get("id");
        var editRoleName = urlData.searchParams.get("role");
        var editRolePerms = urlData.searchParams.get("permissions");

        if(editRoleID == null){ 
            GetAllPermissions(); 
        }else{
            EditRoleDetails(editRoleID, editRoleName, editRolePerms);
        }

        
    });
}
var payload = "";
loadJSONdata();

function EditRoleDetails(editRoleID, editRoleName, editRolePerms){
    var allRoles = editRolePerms.split(",");

    GetAllPermissions().then(result => {
        document.getElementById('title-banner').innerHTML = "Edit "+document.getElementById('title-banner').innerHTML;
        document.getElementById('subtitle-banner').innerHTML = "Role "+editRoleName;
        document.getElementById('role-name-input').value = editRoleName;
        $("#btn-role").html("Edit role");
        $("#btn-role").attr('onclick','EditCurrentRole(\''+editRoleID+'\')');
        
        $('input[type=checkbox]').each(function(index){
            for(x in allRoles){
                console.log(allRoles[x] == $(this).attr('role'));
                if($(this).attr('role') == allRoles[x]){
                    $(this).prop('checked', true);
                }
            }
        });

    }).catch(error => {
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error role details Error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function EditCurrentRole(uuid){    
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/editRole';

    //get all checkbox checked
    var list = [];
    $('input[type=checkbox]:checked').each(function(index){
        list.push($(this).attr('role'));
    });
        
    var jsonData = {}
    jsonData["id"] = uuid;
    jsonData["role"] = document.getElementById('role-name-input').value.trim();
    jsonData["permissions"] = list.toString();
    var dataValues = JSON.stringify(jsonData);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataValues,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
    .then(function (response) {    
        document.getElementById('progressBar-create-div').style.display = "none";
        document.getElementById('progressBar-create').style.display = "none";
        document.location.href = 'https://' + location.hostname + '/role-management.html';
    })
    .catch(function (error) {
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error editing role!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    })
}

async function GetAllPermissions(){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getPermissions';

    await axios({
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
        console.log(response.data);
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            //get groups
            var html = "";
            html = html = '<br>'+
                '<div>'+
                    '<button id="btn-role" type="button" class="btn btn-primary" style="float: right;" onclick="addNewRole()">Add role</button>'+
                    '<input type="text" class="form-control" id="role-name-input" placeholder="Insert here the new role name"><br>'+
                '</div>'+
                '<br>';
            var groups = [];
            for(id in response.data){
                if(!groups.includes(response.data[id]["permissionGroup"])){
                    groups.push(response.data[id]["permissionGroup"])
                }
            }            
            
            //list permissions for every group
            for(group in groups){
                html = html + '<div>'+
                '<h3>'+groups[group]+'</h3>';
                for(id in response.data){
                    if(response.data[id]["permissionGroup"] == groups[group]){
                        html = html + '<h6>'+response.data[id]["groupDesc"]+'</h6>';
                        break;
                    }
                }
                html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>' +
                    '<tr>'+
                        '<th style="width: 10%"></th>' +
                        '<th style="width: 30%">Permission name</th>' +
                        '<th>Permission description</th>' +
                    '</tr>' +
                '</thead>' +
                '<tbody>';
                for(id in response.data){
                    if(response.data[id]["permissionGroup"] == groups[group]){
                        html = html + '<tr>'+
                            '<td><input type="checkbox" role="'+id+'"></td>'+
                            '<td>'+id+'</td>'+
                            '<td>'+response.data[id]["desc"]+'</td>'+
                        '</tr>';
                    }
                }
                html = html + '</tbody>'+
                '</table></div>';
            }
            document.getElementById('role-list-table').innerHTML = html;
        }
        return true;
    })
    .catch(function (error) {
        document.getElementById('progressBar-create').style.display = "block";
        document.getElementById('progressBar-create-div').style.display = "block";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all roles: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    })
//     .finally(() => {
//         return data;
//     });
}

function addNewRole(){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    if(document.getElementById('role-name-input').value.trim() == ""){
        document.getElementById('progressBar-create-div').style.display = "none";
        document.getElementById('progressBar-create').style.display = "none";
        $('#role-name-input').css('border', '2px solid red');
        $('#role-name-input').attr("placeholder", "Please, insert role name"); 
    }else{  
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/addNewRole';

        //get all checked checkboxes
        var roles = [];
        $('input[type=checkbox]:checked').each(function(index){
            roles.push($(this).attr('role'));
        });

        //check for empty roles
        if(roles == ""){
            document.getElementById('progressBar-create-div').style.display = "none";
            document.getElementById('progressBar-create').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Can\'t create role without permissions.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }else{
            var jsonData = {}
            jsonData["role"] = document.getElementById('role-name-input').value.trim();
            jsonData["permissions"] = roles.toString();
            var newData = JSON.stringify(jsonData);
    
            axios({
                method: 'put',
                url: nodeurl,
                timeout: 30000,
                data: newData,
                headers:{
                    'token': document.cookie,
                    'user': payload.user,
                    'uuid': payload.uuid,
                }
            })
            .then(function (response) {
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";

                document.location.href = 'https://' + location.hostname + '/role-management.html';
            })
            .catch(function (error) {
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding new role: </strong> '+error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            });
        }
    }
}