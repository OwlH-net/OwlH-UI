
function loadNetworkValues(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid;

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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var html = '<div class="modal-dialog" id="network-modal-window">'+
              '<div class="modal-content">'+
    
                '<div class="modal-header">'+
                  '<h4 class="modal-title" id="delete-node-header">Network</h4>'+
                  '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
    
                '<div class="modal-body" id="delete-node-footer-table">';
    
                    if (response.data.ack == "false"){
                        html = html + '<span><h6>Error loading interfaces</h6></span>';
                    } else {
                        html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>              ' +
                        '<tr>                 ' +
                        '<th>Network</th>        ' +
                        '<th>Select</th>     ' +
                        '</tr>                ' +
                        '</thead>             ' +
                        '<tbody >             ' ;
                        for (net in response.data){
                            html = html +
                            '<tr>'+
                                '<td style="word-wrap: break-word;">' +
                                    response.data[net]+
                                '</td><td style="word-wrap: break-word;">' +
                                    '<input type="radio" id="net-value-'+net+'" value="'+net+'" name="net-select">'+
                                '</td>'+
                            '</tr>';
                        }
                        html = html + '</tbody>'+
                        '</table>';
                    }
                html = html + '</div>'+
    
                '<div class="modal-footer" id="delete-node-footer-btn">'+
                  '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
                  if (response.data.ack != "false"){
                      html = html +
                        // '<button class="btn btn-success text-white" id="btn-load-all-new-local">New local</button>'+
                        // '<button class="btn btn-success text-white" id="btn-load-all-vxlan">New VxLAN</button>'+
                        '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-delete-node" onclick="updateNetworkInterface(\''+uuid+'\')">Deploy</button>';
                  }
                html = html + '</div>'+
    
              '</div>'+
            '</div>';
    
            document.getElementById('modal-window').innerHTML = html;
            LoadNetworkValuesSelected(uuid);
    
            $('#btn-load-all-vxlan').click(function(){ $('#network-modal-window').modal("hide"); LoadAllVxLAN(uuid); });
            $('#btn-load-all-new-local').click(function(){ $('#network-modal-window').modal("hide"); LoadAllNewLocal(uuid); });
            $('#modal-window').modal("show");
        }
    })
    .catch(function (error) {
    });
}

function LoadAllVxLAN(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;

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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var areElements = false;
            for (type in response.data){
                if (response.data[type]["type"] == "networkvxlan"){
                    areElements = true;
                    break;
                }
            }
            var html = '<div class="modal-dialog modal-lg" id="load-all-vxlan-modal" style="width:1000px;">'+
                    '<div class="modal-content">'+
    
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">Network VxLANs</h4>'+
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '</div>'+
    
                        '<div class="modal-body">';
                            if (areElements){
                                html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                '<thead>              ' +
                                '<tr>                 ' +
                                '<th>Name</th>        ' +
                                '<th>Lan IP</th>        ' +
                                '<th>Local IP</th>        ' +
                                '<th>Port IP</th>        ' +
                                '<th>Interface</th>      ' +
                                '<th>Options</th>      ' +
                                '</tr>                ' +
                                '</thead>             ' +
                                '<tbody >             ' ;
                                for (type in response.data){
                                    if (response.data[type]["type"] == "networkvxlan"){
                                        html = html + '<tr>'+
                                            '<td style="word-wrap: break-word;">' +
                                                response.data[type]["name"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                response.data[type]["lanIp"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                response.data[type]["localIp"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                response.data[type]["portIp"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                response.data[type]["baseInterface"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                '<div>'+
                                                    '<a class="btn btn-primary text-white" data-dismiss="modal" onclick="saveSocketToNetworkSelected(\''+uuid+'\', \''+type+'\')">Start</a> &nbsp'+
                                                    '<button type="submit" class="btn btn-danger" id="btn-delete-vxlan" onclick="DeleteDataFlowValueSelected(\''+uuid+'\', \''+type+'\',\''+response.data[type]["type"]+'\')">Delete</button>'+
                                                '</div>'+
                                            '</td>'+
                                        '</tr>';
    
                                        //div for delete
                                        html = html + '<tr style="display: none" id="delete-row-'+type+'">'+
                                        '<td colspan="6" bgcolor="LightSalmon" align="center">'+                  
                                            '<div>'+
                                                '<p>Do you want to delete <b>'+response.data[type]["name"]+'</b> element?</p>'+
                                                '<div>'+
                                                    '<button class="btn btn-secondary confirm-delete-dataflow-close-'+type+'">Close</button> &nbsp '+
                                                    '<button class="btn btn-danger confirm-delete-dataflow-'+type+'">Confirm</button>'+
                                                '</div>'+
                                            '</div>'+
                                        '</td>'+
                                    '</tr>';
                                    }
                                }
                                html = html + '</tbody>'+
                                '</table>';
                            }else{
                                html = html + '<p>There are not VxLAN entries.</p>';
                            }
    
                        html = html + '</div>'+
    
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                            '<button class="btn btn-success" id="btn-create-new-vxlan">New VxLAN</button>'+
                        '</div>'+
    
                    '</div>'+
                '</div>';
    
            document.getElementById('modal-window').innerHTML = html;
            $('#btn-create-new-vxlan').click(function(){ $('#load-all-vxlan-modal').modal("hide"); CreateNewVxLAN(uuid); });
            $('#modal-window').modal("show");
        }
    })
    .catch(function (error) {
    });
}

function CreateNewVxLAN(uuid){
    var html = '<div class="modal-dialog" id="create-new-vxlan">'+
            '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-node-header">New Local</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<form>'+
                    '<div class="form-group row">'+
                        '<label for="ifaceNameVxLAN" class="ml-4 col-form-label align-middle">Interface Name: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="ifaceNameVxLAN" value="vxlan0">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="VxLANid" class="ml-4 col-form-label">VxLAN ID: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="VxLANid" value="0">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="locaIPVxLAN" class="ml-4 col-form-label">Local IP: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="locaIPVxLAN" value="1.1.1.1">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="portVxLAN" class="ml-4 col-form-label">Port: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="portVxLAN" value="4785">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="baseInterfaceVxLAN" class="ml-4 col-form-label">Base Interface: </label>'+
                        '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                            '<tbody id="body-create-vxlan">' +
                            '</tbody>'+
                        '</table>'+
                    '</div>'+
                '</form>'+
            '</div>'+

            '<div class="modal-footer" id="delete-node-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="btn-vxlan-close" >Close</button>'+
                '<button type="button" class="btn btn-primary" id="btn-vxlan-ok">Save</button>'+
            '</div>'+

            '</div>'+
        '</div>'+
    '</div>';
    document.getElementById('modal-window').innerHTML = html;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid)
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var inner = "";
            for (net in response.data){
                inner = inner +
                '<tr>'+
                    '<td style="word-wrap: break-word;">' +
                        '<p class="ml-4">'+response.data[net]+'</p>'+
                    '</td><td style="word-wrap: break-word;">' +
                        '<input type="radio" id="create-network-vxlan-'+net+'" value="'+net+'" name="net-select">'+
                    '</td>'+
                '</tr>';
            }
            document.getElementById('body-create-vxlan').innerHTML = inner;
            document.getElementById('create-network-vxlan-'+net).checked = "true";
    
            $('#btn-vxlan-close').click(function(){ $('#create-new-vxlan-modal').modal("hide"); LoadAllVxLAN(uuid);});
            $('#btn-vxlan-ok').click(function(){ $('#create-new-local-modal').modal("hide"); SaveVxLAN(uuid);});
            $('#modal-window').modal("show");
        }
    });    
}

function SaveVxLAN(uuid){
    if (document.getElementById('ifaceNameVxLAN').value == "" || document.getElementById('VxLANid').value == "" || document.getElementById('locaIPVxLAN').value == "" || document.getElementById('portVxLAN').value == "" || /\s/g.test(document.getElementById('ifaceNameVxLAN').value)){
        if (document.getElementById('ifaceNameVxLAN').value == "" || /\s/g.test(document.getElementById('ifaceNameVxLAN').value)){
            if (document.getElementById('ifaceNameVxLAN').value == ""){
                document.getElementById('ifaceNameVxLAN').placeholder = "Please insert a valid name";
                document.getElementById('ifaceNameVxLAN').required = "true";
            }else{                
                document.getElementById('ifaceNameVxLAN').value = "";
                document.getElementById('ifaceNameVxLAN').placeholder = "Please insert a valid name without spaces";
                document.getElementById('ifaceNameVxLAN').required = "true";
            }
        }
        if (document.getElementById('VxLANid').value == ""){
            document.getElementById('VxLANid').placeholder = "Please insert LAN ID";
            document.getElementById('VxLANid').required = "true";
        }
        if (document.getElementById('locaIPVxLAN').value == ""){
            document.getElementById('locaIPVxLAN').placeholder = "Please insert Local IP";
            document.getElementById('locaIPVxLAN').required = "true";
        }
        if (document.getElementById('portVxLAN').value == ""){
            document.getElementById('portVxLAN').placeholder = "Please insert port";
            document.getElementById('portVxLAN').required = "true";
        }
    }else{

        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveVxLAN';

        var valueSelected = "";
        $('input:radio:checked').each(function() {
            idRadio = $(this).prop("id");
            if (idRadio == "create-network-vxlan-"+$(this).prop("value")){
                valueSelected = $(this).prop("value");
            }
        });

        var jsonValues = {}
        jsonValues["uuid"] = uuid;
        jsonValues["interface"] = document.getElementById('ifaceNameVxLAN').value.trim();
        jsonValues["lanIp"] = document.getElementById('VxLANid').value.trim();
        jsonValues["localIp"] = document.getElementById('locaIPVxLAN').value.trim();
        jsonValues["portIp"] = document.getElementById('portVxLAN').value.trim();
        jsonValues["type"] = "networkvxlan";
        jsonValues["baseInterface"] = valueSelected;
        var dataJSON = JSON.stringify(jsonValues);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack=="false"){
                document.getElementById('ifaceNameVxLAN').value = "";
                document.getElementById('ifaceNameVxLAN').placeholder = "Name used. Use other name.";
                document.getElementById('ifaceNameVxLAN').required = "true";
            }else{
                LoadAllVxLAN(uuid);
            }
        }
        })
        .catch(function (error) {
        });
    }
}

function LoadAllNewLocal(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;

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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var areElements = false;
            for (type in response.data){
                if (response.data[type]["type"] == "networknewlocal"){
                    areElements = true;
                    break;
                }
            }
            var html = '<div class="modal-dialog modal-lg" id="load-all-new-local-modal">'+
                    '<div class="modal-content">'+
    
                        '<div class="modal-header">'+
                            '<h4 class="modal-title">Network new locals</h4>'+
                            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                        '</div>'+
    
                        '<div class="modal-body">';
                            if (areElements){
                                html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                '<thead>              ' +
                                '<tr>                 ' +
                                '<th>Name</th>        ' +
                                '<th>MTU</th>        ' +
                                '<th style="width:25%">Select</th>      ' +
                                '</tr>                ' +
                                '</thead>             ' +
                                '<tbody >             ' ;
                                for (type in response.data){
                                    if (response.data[type]["type"] == "networknewlocal"){
                                        html = html + '<tr>'+
                                            '<td style="word-wrap: break-word;">' +
                                                response.data[type]["name"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                response.data[type]["mtu"]+
                                            '</td><td style="word-wrap: break-word;">' +
                                                '<div>'+
                                                    '<a class="btn btn-primary text-white" data-dismiss="modal" onclick="saveSocketToNetworkSelected(\''+uuid+'\', \''+type+'\')">Start</a> &nbsp'+
                                                    '<button class="btn btn-danger" id="btn-del-new-local" onclick="DeleteDataFlowValueSelected(\''+uuid+'\', \''+type+'\',\''+response.data[type]["type"]+'\')">Delete</button>'+
                                                '</div>'+
                                            '</td>'+
                                        '</tr>';
    
                                        //div for delete
                                        html = html + '<tr style="display: none" id="delete-row-'+type+'">'+
                                            '<td colspan="3" bgcolor="LightSalmon" align="center">'+                  
                                                '<div>'+
                                                    '<p>Do you want to delete <b>'+response.data[type]["name"]+'</b> element?</p>'+
                                                    '<div>'+
                                                        '<button class="btn btn-secondary confirm-delete-dataflow-close-'+type+'">Close</button> &nbsp '+
                                                        '<button class="btn btn-danger confirm-delete-dataflow-'+type+'">Confirm</button>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</td>'+
                                        '</tr>';
                                    }
                                }
                                html = html + '</tbody>'+
                                '</table>';
                            }else{
                                html = html + '<p>There are not New Local entries.</p>';
                            }
    
                        html = html + '</div>'+
    
                        '<div class="modal-footer">'+
                            '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                            '<button class="btn btn-success" id="btn-create-new-local">New local</button>'+
                        '</div>'+
    
                    '</div>'+
                '</div>';
    
            document.getElementById('modal-window').innerHTML = html;
            
            $('#btn-create-new-local').click(function(){ $('#load-all-new-local-modal').modal("hide"); CreateNewLocal(uuid); });
            $('#modal-window').modal("show");
        }
    })
    .catch(function (error) {
    });
}

function CreateNewLocal(uuid){
    var html = '<div class="modal-dialog modal-sm" id="create-new-local-modal">'+
            '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title" id="delete-node-header">New Local</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<form>'+
                    '<div class="form-group row">'+
                        '<label for="InterfaceNameNewLocal" class="ml-4 col-form-label align-middle">Interface Name: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="InterfaceNameNewLocal" value="owlh">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="mtuNewLocal" class="ml-4 col-form-label">MTU: </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="mtuNewLocal" value="65535">'+
                    '</div>'+
                '</form>'+
            '</div>'+

                '<div class="modal-footer" id="delete-node-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" id="btn-new-local-close">Close</button>'+
                    '<button type="button" class="btn btn-primary" id="btn-save-new-local">Save</button>'+
                '</div>'+

            '</div>'+
        '</div>';
    document.getElementById('modal-window').innerHTML = html;
    $('#btn-new-local-close').click(function(){ $('#create-new-local-modal').modal("hide"); LoadAllNewLocal(uuid);});
    $('#btn-save-new-local').click(function(){ $('#create-new-local-modal').modal("hide"); SaveNewLocal(uuid);});
    $('#modal-window').modal("show");
}

function SaveNewLocal(uuid){
    if (document.getElementById('mtuNewLocal').value == "" || document.getElementById('InterfaceNameNewLocal').value == "" || /\s/g.test(document.getElementById('InterfaceNameNewLocal').value)){
        if (document.getElementById('InterfaceNameNewLocal').value == "" || /\s/g.test(document.getElementById('InterfaceNameNewLocal').value)){
            if (document.getElementById('InterfaceNameNewLocal').value == ""){
                document.getElementById('InterfaceNameNewLocal').placeholder = "Please insert a name    ";
                document.getElementById('InterfaceNameNewLocal').required = "true";
            }else{
                document.getElementById('InterfaceNameNewLocal').value = "";
                document.getElementById('InterfaceNameNewLocal').placeholder = "Please insert a name without spaces";
                document.getElementById('InterfaceNameNewLocal').required = "true";
            }
        }
        if (document.getElementById('mtuNewLocal').value == ""){
            document.getElementById('mtuNewLocal').placeholder = "Please insert a MTU";
            document.getElementById('mtuNewLocal').required = "true";
        }
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveNewLocal';

        var jsonValues = {}
        jsonValues["uuid"] = uuid;
        jsonValues["name"] = document.getElementById('InterfaceNameNewLocal').value.trim();
        jsonValues["mtu"] = document.getElementById('mtuNewLocal').value.trim();
        var dataJSON = JSON.stringify(jsonValues);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack=="false"){
                document.getElementById('InterfaceNameNewLocal').value = "";
                document.getElementById('InterfaceNameNewLocal').placeholder = "Name used. Use other name.";
                document.getElementById('InterfaceNameNewLocal').required = "true";
            }else{
                LoadAllNewLocal(uuid);
            }
        }
        })
        .catch(function (error) {
        });
    }

}

function selectNewLocal(uuid, nodeUUID){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveNewLocal';

    var jsonValues = {}
    jsonValues["uuid"] = uuid;
    jsonValues["nodeUUID"] = nodeUUID;
    var dataJSON = JSON.stringify(jsonValues);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }
    })
    .catch(function (error) {
    });
}

function LoadNetworkValuesSelected(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValuesSelected/'+uuid;

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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            document.getElementById('net-value-'+response.data[uuid]["interface"]).checked = "true";
            document.getElementById('vxlan-value-'+response.data[uuid]["interface"]).checked = "true";
        }
    })
    .catch(function (error) {
    });
}

function updateNetworkInterface(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/updateNetworkInterface';
    var valueSelected = "";
    $('input:radio:checked').each(function() {
        idRadio = $(this).prop("id");
        if (idRadio == "net-value-"+$(this).prop("value")){
            valueSelected = $(this).prop("value");
        }
    });
    var jsonDeploy = {}
    jsonDeploy["value"] = valueSelected;
    jsonDeploy["param"] = "interface";
    jsonDeploy["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeploy);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }
    })
    .catch(function (error) {
    });
}

//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----SOCKET TO NETWORK--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function SocketToNetworkList(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;

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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var html = "";
            var areElements = false;
            for (type in response.data){
                if (response.data[type]["type"] == "sockettonetwork"){
                    areElements = true;
                    break;
                }
            }
            html = html + '<div class="modal-dialog modal-lg" id="socket-to-network-list">'+
                '<div class="modal-content">'+
    
                    '<div class="modal-header">'+
                        '<h4 class="modal-title">Socket -> Network</h4>'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '</div>'+
    
                    '<div class="modal-body">';
                    if (areElements){
                        html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>              ' +
                        '<tr>                 ' +
                        '<th>File name</th>        ' +
                        '<th>Interface</th>        ' +
                        '<th>Port</th>        ' +
                        '<th>Cert</th>        ' +
                        '<th style="width:25%">Select</th>      ' +
                        '</tr>                ' +
                        '</thead>             ' +
                        '<tbody >             ' ;
                        for (type in response.data){
                            if (response.data[type]["type"] == "sockettonetwork"){
                                html = html + '<tr>'+
                                    '<td style="word-wrap: break-word;">' +
                                        response.data[type]["name"]+
                                    '</td><td style="word-wrap: break-word;">' +
                                        response.data[type]["interface"]+
                                    '</td><td style="word-wrap: break-word;">' +
                                        response.data[type]["port"]+
                                    '</td><td style="word-wrap: break-word;">' +
                                        response.data[type]["cert"]+
                                    '</td><td style="word-wrap: break-word;">' +
                                        '<div>'+
                                            // '<a class="btn btn-primary text-white" data-dismiss="modal" onclick="saveSocketToNetworkSelected(\''+uuid+'\', \''+type+'\')">Start</a> &nbsp'+
                                            '<a class="btn btn-primary text-white" onclick="saveSocketToNetworkSelected(\''+uuid+'\', \''+type+'\')">Start</a> &nbsp'+
                                            '<button class="btn btn-danger" onclick="DeleteDataFlowValueSelected(\''+uuid+'\', \''+type+'\', \''+response.data[type]["type"]+'\')">Delete</button>'+
                                        '</div>'+
                                    '</td>'+
                                '</tr>';
    
                                //div for delete
                                html = html + '<tr style="display: none" id="delete-row-'+type+'">'+
                                    '<td colspan="5" bgcolor="LightSalmon" align="center">'+                  
                                        '<div>'+
                                            '<p>Do you want to delete <b>'+response.data[type]["name"]+'</b> element?</p>'+
                                            '<div>'+
                                                '<button class="btn btn-secondary confirm-delete-dataflow-close-'+type+'">Close</button> &nbsp '+
                                                '<button class="btn btn-danger confirm-delete-dataflow-'+type+'">Confirm</button>'+
                                            '</div>'+
                                        '</div>'+
                                    '</td>'+
                                '</tr>';
                            }
                        }
                        html = html + '</tbody>'+
                        '</table>';
                    }else{
                        html = html + '<p>There are not Socket to Network entries.</p>';
                    }
                    html = html + '</div>'+
    
                    '<div class="modal-footer">'+
                        '<button class="btn btn-secondary" type="button" id="btn-close-socket-network">Close</button>'+
                        '<button type="button" class="btn btn-success" id="btn-create-socket-network">Create</button>'+
                    '</div>'+
    
                '</div>'+
            '</div>';
                    
            document.getElementById('modal-window').innerHTML = html;
            $('#btn-close-socket-network').click(function(){ $('#modal-window').modal("hide");});
            $('#btn-create-socket-network').click(function(){ $('#socket-to-network-list').modal("hide"); createSocketToNetwork(uuid);});
            $('#modal-window').modal("show");
        }
    })
    .catch(function (error) {
    });
}

function createSocketToNetwork(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    // var modalWindow = document.getElementById('modal-window');
    // modalWindow.innerHTML =
    var html = '<div class="modal-dialog" id="create-socket-to-network-modal">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
            '<h4 class="modal-title">Socket to Network</h4>'+
            '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<form>'+
                    '<div class="form-group row">'+
                        '<label for="socketName" class="ml-4 col-form-label align-middle"><b>Socket to Network name: </b></label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="socketName" value="owlh">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="listenPort" class="ml-4 col-form-label align-middle"><b>Listen port:</b> </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="listenPort" value="50010">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="certificate" class="ml-4 col-form-label"><b>Cert:</b> </label>'+
                        '<input type="text" class="ml-4 mr-4 form-control" id="certificate" value="/usr/local/owlh/src/owlhnode/conf/certs/ca.pem">'+
                    '</div>'+
                    '<br>'+
                    '<div class="form-group row">'+
                        '<label for="interface" class="ml-4 col-form-label"><b>Interface: </b></label>'+
                        '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                            '<tbody id="body-create-socket-network">' +
                            '</tbody>'+
                        '</table>'+
                    '</div>'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="btn-create-socket-network-close">Close</button>'+
                '<button type="button" class="btn btn-primary" id="btn-create-socket-network-form">Save</button>'+
            '</div>'+

        '</div>'+
    '</div>';

    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid)
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var isChecked = false;
            var inner = "";
            for (net in response.data){
                inner = inner + '<tr>'+
                    '<td style="word-wrap: break-word;">' +
                        '<p class="ml-4">'+response.data[net]+'</p>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;">';
                        if (!isChecked){
                            inner = inner + '<input class="socket-network-radio" type="radio" id="create-socket-network-'+net+'" value="'+net+'" name="net-select" checked>';                        
                            isChecked = true;
                        }else{
                            inner = inner + '<input class="socket-network-radio" type="radio" id="create-socket-network-'+net+'" value="'+net+'" name="net-select">';                        
                        }
                    inner = inner + '</td>'+
                '</tr>';
            }
            document.getElementById('body-create-socket-network').innerHTML = inner;
        }
    });
    document.getElementById('modal-window').innerHTML = html;

    $('#btn-create-socket-network-form').click(function(){ $('#create-socket-to-network-modal').modal("hide"); saveSocketToNetwork(uuid);});
    $('#btn-create-socket-network-close').click(function(){ $('#create-socket-to-network-modal').modal("hide"); SocketToNetworkList(uuid);});
    $('#modal-window').modal("show");

}

function saveSocketToNetwork(uuid){  
    if (document.getElementById('socketName').value == "" || document.getElementById('listenPort').value == "" || document.getElementById('certificate').value == "" || /\s/g.test(document.getElementById('socketName').value)){
        if (document.getElementById('socketName').value == "" || /\s/g.test(document.getElementById('socketName').value)){
            if (document.getElementById('socketName').value == ""){                
                document.getElementById('socketName').placeholder = "Please insert a name";
                document.getElementById('socketName').required = "true";
            }else{
                document.getElementById('socketName').value = "";
                document.getElementById('socketName').placeholder = "Please insert a name without spaces";
                document.getElementById('socketName').required = "true";
            }
        }
        if (document.getElementById('listenPort').value == ""){
            document.getElementById('listenPort').placeholder = "Please insert port";
            document.getElementById('listenPort').required = "true";
        }
        if (document.getElementById('certificate').value == ""){
            document.getElementById('certificate').placeholder = "Please insert certificate";
            document.getElementById('certificate').required = "true";
        }
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveSocketToNetwork';

        var valueSelected = "";
        $('input:radio:checked').each(function() {            
            if($(this).attr('class') == 'socket-network-radio'){
                valueSelected = $(this).prop("value");
            }                        
        });

        var jsonSave = {}
        jsonSave["name"] = document.getElementById('socketName').value.trim();
        jsonSave["cert"] = document.getElementById('certificate').value.trim();
        jsonSave["interface"] = valueSelected;
        jsonSave["port"] = document.getElementById('listenPort').value.trim();
        jsonSave["uuid"] = uuid;
        var dataJSON = JSON.stringify(jsonSave);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if(response.data.ack=="false"){
                document.getElementById('socketName').value = "";
                document.getElementById('socketName').placeholder = "Name used. Use other name.";
                document.getElementById('socketName').required = "true";
            }else{
                SocketToNetworkList(uuid);
            }
        }
        })
        .catch(function (error) {
        });
    }
}

function saveSocketToNetworkSelected(uuid, nodeUUID){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveSocketToNetworkSelected';

    var jsonSelected = {}
    jsonSelected["uuid"] = uuid;
    jsonSelected["uuidNode"] = nodeUUID;
    var dataJSON = JSON.stringify(jsonSelected);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }
    })
    .catch(function (error) {
    });
    
}

function DeleteDataFlowValueSelected(uuid, nodeUUID, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/deleteDataFlowValueSelected';

    document.getElementById('delete-row-'+nodeUUID).style.display="table-row";
    // document.getElementById('delete-div-'+nodeUUID).style.display="block";
    $(".confirm-delete-dataflow-close-"+nodeUUID).bind("click", function(){
        document.getElementById('delete-row-'+nodeUUID).style.display="none";
    });

    $(".confirm-delete-dataflow-"+nodeUUID).bind("click", function(){
        var jsonSelected = {}
        jsonSelected["uuid"] = uuid;
        jsonSelected["uuidNode"] = nodeUUID;
        var dataJSON = JSON.stringify(jsonSelected);
        axios({
            method: 'delete',
            url: nodeurl,
            timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (type == "sockettonetwork"){
                SocketToNetworkList(uuid);
            }else if(type == "networknewlocal"){
                LoadAllNewLocal(uuid);
            }else if(type == "networkvxlan"){
                LoadAllVxLAN(uuid);
            }
        }
        })
        .catch(function (error) {
        });
    });
}

function changeDataflowValues(FlowUUID, param, value, uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/changeDataflowValues';
    var jsonDeploy = {}
    jsonDeploy["FlowUUID"] = FlowUUID;
    jsonDeploy["value"] = value;
    jsonDeploy["param"] = param;
    jsonDeploy["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeploy);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            loadPlugins();
        }
    })
    .catch(function (error) {
    });
}