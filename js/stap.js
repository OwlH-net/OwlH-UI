function showAddServerForm() {
    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    if (serverform.style.display == "none") {
        serverform.style.display = "block";
        addserver.innerHTML = "Close Add Server";
    } else {
        serverform.style.display = "none";
        addserver.innerHTML = "Add Server";
    }
}

function addServerToNode() {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    var nodeName = document.getElementById('nodenameform');
    var nodeIP = document.getElementById('nodeipform');
    serverform.style.display = "none";
    addserver.innerHTML = "Add Server";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/';
    var nodejson = {};
    nodejson["nodeName"] = nodeName.value;
    nodejson["nodeIP"] = nodeIP.value;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'post',
        url: urlServer,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: nodeJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllServers();
                return true;
            }
        })
        .catch(function (error) {
            return false;
        });
}

function GetAllServers() {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var node = urlWeb.searchParams.get("node");    
    var tableServer = document.getElementById('servers-table');
    var subtitleBanner = document.getElementById('subtitle-servers-list');
    subtitleBanner.innerHTML = 'Servers for node: '+node;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/'+uuid;
    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            tableServer.innerHTML = generateAllServerHTMLOutput(response);
            return true;
        }
    })
    .catch(function (error) {
        tableServer.innerHTML = generateAllServerHTMLOutput(error);
        return false;
    }); 
}

function generateAllServerHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving data for STAP</h3></div>';
    }  
    var isEmptyStaps = true;
    var servers = response.data;
    var html =  
        '<div class="container" id="servers-details-div" style="display:none;">           ' +                                                                         
        '</div>                         '+  
        '<div id="servers-list">                                                  ' +                                                                          
            '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                    '<tr>                                                         ' +
                        '<th scope="col"></th>                                        ' +
                        '<th scope="col">IP</th>                                      ' +
                        '<th scope="col">Name</th>                                    ' +
                        '<th scope="col">Status</th>                                  ' +
                        '<th scope="col">Actions</th>                                 ' +
                    '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody>                                                      ' ;
                for (server in servers) {
                    isEmptyStaps = false;
                    html = html + 
                    '<tr>                                                                     '+
                        '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
                        '<td style="word-wrap: break-word;" class="align-middle">' + servers[server]['ip'] +'</td>'+
                        '<td style="word-wrap: break-word;" class="align-middle">' + servers[server]['name'] + '</td>';
                    if (servers[server]['status'] == "true"){
                            html = html + '<td style="word-wrap: break-word;" class="align-middle"> <span class="badge badge-pill bg-success align-text-bottom text-white">ON</span>              '+
                            '<td style="word-wrap: break-word;" class="align-middle">                                                                                                             ' +
                            '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
                            '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
                            '       <i class="fas fa-stop-circle low-blue" title="Stop server" id="'+server+'-server-icon-stap" onclick="StopStapServer(\''+server+'\')"></i>  ' +
                            '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                            '  </span>                                                                                                                             ' +
                            '</td>' ;
                        } else if (servers[server]['status'] == "false"){
                            html = html + '<td style="word-wrap: break-word;" class="align-middle"> <span class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span>              ' +
                            '<td style="word-wrap: break-word;" class="align-middle">                                                                                                             ' +
                            '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
                            '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
                            '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>         ' +
                            '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                            '  </span>                                                                                                                             ' +
                            '</td>' ;
                        }else if(servers[server]['status'] == "error"){
                            html = html + 
                            '<td style="word-wrap: break-word;" class="align-middle"> '+
                            '<span class="badge badge-pill bg-warning align-text-bottom text-white">ERROR</span>                                                         ' +
                            '<td style="word-wrap: break-word;" class="align-middle">                                                                                                              ' +
                            '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                  ' +
                            '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                            ' +
                            '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>          ' +
                            '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                            '  </span>                                                                                                                              ' +
                            '</td>' ;
                        } else {
                            html = html + 
                            '<td style="word-wrap: break-word;" class="align-middle"> '+
                            '<span class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                                         ' +
                            '<td style="word-wrap: break-word;" class="align-middle">                                                                                                              ' +
                            '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                  ' +
                            '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                            ' +
                            '       <i class="fas fa-play-circle low-blue" id="'+server+'-server-icon-stap" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>      ' +
                            '       <i class="fas fa-trash-alt low-blue" title="Delete server" data-toggle="modal" data-target="#modal-delete-stap-server" onclick="ModalDeleteStapServer(\''+server+'\',\''+servers[server]['name']+'\')"></i>                     ' +
                            '  </span>                                                                                                                              ' +
                            '</td>' ;
                        }
                    html = html + '</tr>' ;
                }
        html = html + '</tbody></table></div>';
    if (isEmptyStaps){
        return '<div style="text-align:center"><h3>No stap servers available...</h3></div>'; 
    }else{
        return html;
    }
}
  
  function loadServerDetails(server){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/server/'+uuid+"/"+server;
    var serversList = document.getElementById('servers-list');
    var serverForm = document.getElementById('serverform');
    var serverDetails = document.getElementById('servers-details-div');
    var addServerText = document.getElementById('show-add-server');

    addServerText.style.display = "none";
    serversList.style.display = "none";
    serversList.style.display = "none";
    serverForm.style.display = "none";
    serverDetails.style.display = "block";

    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var htmDetails =
            '<div>'+
                '<h3 class="mb-0 low-blue lh-100" style="display: inline-block;">Values for server: '+response.data[server]['name']+'</h3>                '+
                '<button type="button" style="float:right; margin-bottom:30px;" class="btn btn-secondary" onclick="CloseServerDetails()">Close</button>'+
            '</div>'+
            '<table class="table table-hover" id="server-details">                                      ' +    
                '<thead>                                                            '+
                    '<tr>                                                         ' +
                        '<th scope="col">Param</th>                                    ' +
                        '<th scope="col">Value</th>                                  ' +
                        '<th scope="col" colspan="15%">Actions</th>                                 ' +
                    '</tr>                                                        ' +
                '</thead>                                                                           '+
                '</tbody>                                                                   ';
                    for (nameDetail in response.data[server]){                                                                        
                        htmDetails = htmDetails +
                        '<tr>                                                                                                   ' +
                            '<td style="word-wrap: break-word;" id class="align-middle">'+nameDetail+'</td>                                                    ' +
                            '<td style="word-wrap: break-word;" id class="align-middle" >'+response.data[server][nameDetail]+'</td>                            ' +
                            '<td style="word-wrap: break-word;"><i class="fas fa-sticky-note low-blue" title="Edit" data-toggle="modal" data-target="#modal-edit-stap-server" onclick="ModalEditStapServer(\''+server+'\',\''+nameDetail+'\',\''+response.data[server][nameDetail]+'\',\''+response.data[server]['name']+'\')"></i></td>                                  ' +
                        '</tr>                                                                                                  ' ;
                    }
                htmDetails = htmDetails +
                '<tr><td style="word-wrap: break-word;"></td><td style="word-wrap: break-word;"></td><td style="word-wrap: break-word;"></td></tr>'+
                '</tbody>                                                                                                   ' +
            '</table>                                                                                                       ' +
            '<div>                                                                                                          '+
                '<button type="button" style="float:right; margin-bottom:50px;" class="btn btn-secondary" onclick="CloseServerDetails()">Close</button>'+
            '</div>                                                                                                         ';
            serverDetails.innerHTML = htmDetails;
            return true;   
        }
    })
    .catch(function (error) {
        return false;
    }); 
}

function CloseServerDetails(){
    var serversList = document.getElementById('servers-list');
    var serverDetails = document.getElementById('servers-details-div');
    var addServerText = document.getElementById('show-add-server');

    addServerText.style.display = "block";
    serversList.style.display = "block";
    serverDetails.style.display = "none";
}

function ModalEditStapServer(server, param, value, serverName){
    var modalWindowEdit = document.getElementById('modal-edit-stap-server');
    modalWindowEdit.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="edit-ruleset-header">Server: '+serverName+'</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body" id="edit-ruleset-footer-table">'+ 
                '<p>Enter the new value for <b>'+param+'</b></p>'+
                '<input class="form-control" id="input-edit-stap-server" type="text" value="'+value+'">'+
            '</div>'+
    
            '<div class="modal-footer" id="edit-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="EditStapServer(\''+server+'\',\''+param+'\')">Save</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
}

function ModalDeleteStapServer(server,name){
    var modalWindowDelete = document.getElementById('modal-delete-stap-server');
    modalWindowDelete.innerHTML = 
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title">STAP server</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+
    
            '<div class="modal-body">'+ 
                '<p>Do you want to delete <b>'+name+'</b>?</p>'+
            '</div>'+
    
            '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                '<button type="submit" class="btn btn-danger" data-dismiss="modal" onclick="DeleteStapServer(\''+server+'\')">Delete</button>'+
            '</div>'+
    
        '</div>'+
    '</div>';
}

function EditStapServer(server, param){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var newValue = document.getElementById('input-edit-stap-server').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/EditStapServer/';
    var nodejson = {};
    nodejson["server"] = server;
    nodejson["param"] = param;
    nodejson["value"] = newValue;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        data: nodeJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                //GetAllServers();
                loadServerDetails(server);
            }
        })
        .catch(function error() {
        });
}

function RunStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/RunStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllServers();
            }
        })
        .catch(function error() {
        });
}

//Stop stap system
function StopStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/StopStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllServers();
            }
        })
        .catch(function error() {
        });
}

//Stop stap system
function DeleteStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/DeleteStapServer/' + uuid + '/' + server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllServers();
            }
        })
        .catch(function error() {
        });
}

function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
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
        GetAllServers();
    });
}
var payload = "";
loadJSONdata();