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

        var urlData = new URL(window.location.href);
        var editRoleID = urlData.searchParams.get("id");
        var editRoleName = urlData.searchParams.get("role");
        var editRoleDesc = urlData.searchParams.get("desc");
        var editRolePerms = urlData.searchParams.get("permissions");

        if(editRoleID == null && editRoleName == null && editRoleDesc == null && editRolePerms == null){ 
            GetAllPermissions(); 
        }else{
            EditRoleDetails(editRoleID, editRoleName, editRoleDesc, editRolePerms);
        }

        
    });
}
var payload = "";
loadJSONdata();

function EditRoleDetails(editRoleID, editRoleName, editRoleDesc, editRolePerms){
    var allRoles = editRolePerms.split(",");

    GetAllPermissions().then(result => {
        document.getElementById('title-banner').innerHTML = "Edit "+document.getElementById('title-banner').innerHTML;
        document.getElementById('subtitle-banner').innerHTML = "Role "+editRoleName;
        document.getElementById('role-name-input').value = editRoleName;
        document.getElementById('role-desc-input').value = editRoleDesc;
        $("#btn-role").html("Edit role");
        $("#btn-role").attr('onclick','EditCurrentRole(\''+editRoleID+'\')');
        
        $('input[type=checkbox]').each(function(index){
            for(x in allRoles){
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
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
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

    console.log(list); 

    var jsonData = {}
    jsonData["id"] = uuid;
    jsonData["role"] = document.getElementById('role-name-input').value.trim();
    jsonData["desc"] = document.getElementById('role-desc-input').value.trim();
    jsonData["permissions"] = list.toString();
    var dataValues = JSON.stringify(jsonData);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataValues,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {    
        document.getElementById('progressBar-create-div').style.display = "none";
        document.getElementById('progressBar-create').style.display = "none";
        if(response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error editing role!</strong> '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }else{
            document.location.href = 'https://' + location.host + '/role-management.html';
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
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
            'user': payload.user
            
        }
    })
    .then(function (response) {
        document.getElementById('progressBar-create').style.display = "none";
        document.getElementById('progressBar-create-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            //get groups
            var html = "";
            html = html = 
            '<div class="input-group" style="width:100%;">'+
                '<input class="form-control mx-3" type="text" placeholder="Search by permission..." aria-label="Search" id="search-permission-details">'+
                // '<a type="button" class="btn btn-primary mr-2" id="permission-search-value" onkeyup=""><i class="fas fa-search" style="color: white;"></i></a>'+
            '</div>'+
            '<br>'+
            '<div class="input-group col-md-12" inline>'+
                '<div class="input-group-prepend">'+
                    '<span class="input-group-text">New Name</span>'+
                '</div>'+
                '<input type="text" class="form-control" placeholder="New role name" id="role-name-input">'+
            '</div>'+
            '<div class="input-group col-md-12 mt-2" inline>'+
                '<div class="input-group-prepend">'+
                    '<span class="input-group-text">Description</span>'+
                '</div>'+
                '<input type="text" class="form-control" placeholder="New description" id="role-desc-input">'+
            '</div>'+
            '<br>'+
            '<button id="btn-role" type="button" class="btn btn-primary float-right" onclick="addNewRole()">Add role</button>'+
            '<br>';
            var groups = [];
            for(id in response.data){
                if(!groups.includes(response.data[id]["permissionGroup"])){
                    groups.push(response.data[id]["permissionGroup"])
                }
            }            
            
            html = html + '<table id="permissions-table">';

                //list permissions for every group
                for(group in groups){
                    html = html + '<div istitlechecked="false" id="group-titles-'+groups[group]+'">'+
                        '<h3>'+groups[group]+'</h3>';
                        for(id in response.data){
                            if(response.data[id]["permissionGroup"] == groups[group]){
                                html = html + '<h6>'+response.data[id]["groupDesc"]+'</h6>';
                                break;
                            }
                        }
                        html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>' +
                            '<tr isheaderchecked="false" id="thead-'+groups[group]+'">'+
                                '<th style="width: 10%"> <input type="checkbox" id="select-all-'+groups[group]+'" onclick="CheckAll(\''+groups[group]+'\')"> </th>' +
                                '<th style="width: 30%">Permission name</th>' +
                                '<th>Permission description</th>' +
                            '</tr>' +
                        '</thead>' +
                        '<tbody>';
                        for(id in response.data){
                            if(response.data[id]["permissionGroup"] == groups[group]){
                                html = html + '<tr class="permission-row" role="'+id+'" permissionGroup="'+groups[group]+'">'+
                                    '<td style="width: 10%"><input type="checkbox" id="role-permission-'+id+'" role="'+id+'" group="'+groups[group]+'"></td>'+
                                    '<td style="width: 30%">'+id+'</td>'+
                                    '<td>'+response.data[id]["desc"]+'</td>'+
                                '</tr>';
                            }
                        }
                        html = html + '</tbody>'+
                        '</table>'+
                    '</div>';
                }
            html = html + '</table>';
            document.getElementById('role-list-table').innerHTML = html;
        }

        //onclick for search bar
        // $('#permission-search-value').click(function(){ loadNodeBySearch(document.getElementById('search-permission-details').value)});
        $('#search-permission-details').keyup(function(){ loadNodeBySearch(document.getElementById('search-permission-details').value)});
        //listener for search bar
        document.getElementById('search-permission-details').addEventListener('input', evt => {
            if (document.getElementById('search-permission-details').value.trim() == ""){ showAllHiddenPermissions();} 
        });

    })
    .catch(function (error) {
        document.getElementById('progressBar-create').style.display = "block";
        document.getElementById('progressBar-create-div').style.display = "block";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get all roles: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    })
}

function addNewRole(){
    document.getElementById('progressBar-create-div').style.display = "block";
    document.getElementById('progressBar-create').style.display = "block";
    if(document.getElementById('role-name-input').value.trim() == "" || document.getElementById('role-desc-input').value.trim() == "" ){
        document.getElementById('progressBar-create-div').style.display = "none";
        document.getElementById('progressBar-create').style.display = "none";
        if(document.getElementById('role-name-input').value.trim() == ""){
            $('#role-name-input').css('border', '2px solid red');
            $('#role-name-input').attr("placeholder", "Please, insert role name"); 
        }
        if(document.getElementById('role-desc-input').value.trim() == ""){
            $('#role-desc-input').css('border', '2px solid red');
            $('#role-desc-input').attr("placeholder", "Please, insert role name"); 
        }
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
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Can\'t create role without permissions.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        }else{
            var jsonData = {}
            jsonData["desc"] = document.getElementById('role-desc-input').value.trim();
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
                    'user': payload.user
                    
                }
            })
            .then(function (response) {
                console.log(response.data);
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";

                if (response.data.ack=="false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error adding new role: </strong> '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    document.location.href = 'https://' + location.host + '/role-management.html';
                }
            })
            .catch(function (error) {
                document.getElementById('progressBar-create-div').style.display = "none";
                document.getElementById('progressBar-create').style.display = "none";
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
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

function CheckAll(group){  
    if($("#select-all-"+group).prop("checked")){    
        $('input:checkbox:not(checked)').each(function() {
            console.log($(this).attr("group"));
            if ($(this).attr("group") == group){                
                $(this).prop("checked", true);
            }
        });
    }else{
        $('input:checkbox:checked').each(function() {
            console.log($(this).attr("group"));
            if ($(this).attr("group") == group){                
                $(this).prop("checked", false);
            }
        });
    }     
}

//show all table elements hidden after search
function showAllHiddenPermissions(){
    $('.permission-row').each(function(){
        $(this).show();
        $('#thead-'+$(this).attr("permissionGroup")).show();
        $('#group-titles-'+$(this).attr("permissionGroup")).show();
        $('#thead-'+$(this).attr("permissionGroup")).attr("isheaderchecked","false");
        $('#group-titles-'+$(this).attr("permissionGroup")).attr("istitlechecked","false");
    })
}

function loadNodeBySearch(search){
    showAllHiddenPermissions();
    if (search.length == 0){
        // $('#search-permission-details').css('border', '2px solid red');
        // $('#search-permission-details').attr("placeholder", "Insert a valid name for search...");
        $('#search-permission-details').css('border', '2px solid #ced4da');
        $('#search-permission-details').attr("placeholder", "Insert a valid name for search...");
    }else{

        $('.permission-row').each(function(){
            $(this).hide();
            var per = $(this).attr("permissionGroup");

            //hide table thead
            if( $('#thead-'+per).attr('isheaderchecked') == "false" && $('#group-titles-'+per).attr('istitlechecked') == "false"){
                $('#thead-'+per).hide();
                $('#group-titles-'+per).hide();
            }else{
                $('#group-titles-'+per).show();
                $('#thead-'+per).show();
            }   

            //check if <tr> has part of search string
            if ($(this).attr("role").toLowerCase().includes(search.toLowerCase())){    
                $(this).show();
                $('#thead-'+per).attr("isheaderchecked","true");
                $('#group-titles-'+per).attr("istitlechecked","true");
            }
        })
    }
}