function loadPlugins(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    content = document.getElementById('master-table-plugins');
    content.innerHTML = '<div class="float-right" id="stap-installed-status" style="display:none;">'+
        '<b>SOCAT:</b> <span id="stap-installed-socat" class="badge bg-primary align-text-bottom text-white"></span> &nbsp'+        
        '<b>TCPDUMP:</b> <span id="stap-installed-tcpdump" class="badge bg-primary align-text-bottom text-white"></span> &nbsp'+
    '</div>'+
    '<br>'+

    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'config\')"><b>Master configuration <i class="fas fa-sort-down" id="config-form-icon"></i></b> </h6>'+        
        '<span id="config-form-span">'+
            '<br>'+
            '<p><img src="img/favicon.ico" height="25"><span style="font-size: 15px; color: Grey;">&nbsp; Edit master configuration | </span>'+
            '<span style="font-size: 15px; color: grey;"> ' +
            '<i class="fas fa-info-circle" style="cursor:pointer;" title="Edit Master configuration file" onclick="showMasterFile(\'main\')"></i>  &nbsp <i class="fas fa-clipboard-list" style="cursor:pointer;" onclick="loadControlDataMaster(\'master\')"></i>  &nbsp <i class="fas fa-archive" style="cursor:pointer;" onclick="loadIncidentMaster(\'master\')"></i>' +
            '</span>'+
            '</p> '+
            '<span id="owlhMasterService" style="display:none; font-size: 15px; cursor: default;" class="col-md-2 badge bg-warning align-text-bottom text-white" onclick="DeployServiceMaster()">Install service</span>'+
        '</span>'+
    '</div>'+

    '<div class="my-3 p-3 bg-white rounded shadow-sm" >'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'dispatcher\')"><b> Dispatcher <i class="fas fa-sort-down" id="dispatcher-form-icon"></i></b></h6>'+
        '<span id="dispatcher-form-span">'+
            '<br>'+
        //     '<p><i style="color: Dodgerblue;" class="fas fa-plug fa-lg"></i> <span style="font-size: 15px; color: Grey;">&nbsp; STAP Collector &nbsp; | </span> <i class="fas fa-compress-arrows-alt" id="master-collector-status"></i> | '+
        //     '  <span style="font-size: 15px; color: grey;">                                   ' +
        //     '    <i class="fas fa-play-circle" title="Play collector" onclick="playMasterCollector()"></i>                         ' +
        //     '    <i class="fas fa-stop-circle" title="Stop collector" onclick="stopMasterCollector()"></i>                         ' +
        //     '    <i class="fas fa-info-circle" title="Collector information" onclick="showMasterCollector()"></i>  ' +
        //     '  </span></p> '+

        //     '<p><i style="color: Dodgerblue;" class="fas fa-random"></i> <span style="font-size: 15px; color: Grey;">&nbsp; Dispatcher &nbsp; | </span> <i class="fas fa-angle-double-down" id="dispatcher-status"></i> | '+
        //     '  <span style="font-size: 15px; color: grey;">                                   ' +
        //     '    <i class="fas fa-play-circle" id="dispatcher-button" onclick="changePluginStatus(\'dispatcher\', \'status\', \'disabled\')"></i>                         ' +
        //     '    <i class="fas fa-info-circle" title="Show dispatcher nodes" onclick="showMasterFile(\'dispatcherNodes\')"></i>  ' +
        //     '  </span></p> '+
            // '<table width="100%">'+
            //     '<tr>'+
            //         '<td width="25%"><i style="color: Dodgerblue;" class="fas fa-plug fa-lg"></i> STAP Collector</td>'+
            //         '<td width="25%">Status: <i class="fas fa-compress-arrows-alt" id="master-collector-status"></i></td>'+
            //         '<td width="25%">Start/Stop: <i class="fas fa-play-circle" style="color: grey;"  title="Play collector" onclick="playMasterCollector()"></i> <i class="fas fa-stop-circle" style="color: grey;" title="Stop collector" onclick="stopMasterCollector()"></i></td>'+
            //         '<td width="25%">Information: <i class="fas fa-info-circle" style="color: grey;" title="Collector information" onclick="showMasterCollector()"></i></td>'+
            //     '</tr>'+       
            // '</table>'+
            // '<div id="ports-table1"></div>&nbsp &nbsp &nbsp'+
            '<table width="100%">'+
                '<tr>'+
                    '<td width="25%"><i style="color: Dodgerblue;" class="fas fa-random"></i> Dispatcher</td>'+
                    '<td width="25%">Status: <span id="dispatcher-status" class="badge bg-dark align-text-bottom text-white">N/A</span></td>'+
                    '<td width="25%">Start/Stop: <i style="color: grey;cursor:pointer;" class="fas fa-play-circle" id="dispatcher-button" onclick="changePluginStatus(\'dispatcher\', \'status\', \'disabled\')"></i> </td>'+
                    '<td width="25%">Dispatcher nodes: <i style="color: grey;cursor:pointer;" class="fas fa-info-circle" title="Show dispatcher nodes" onclick="showMasterFile(\'dispatcherNodes\')"></i></td>'+
                '</tr>'+       
            '</table>'+
            // '<div id="ports-table2"></div>&nbsp &nbsp &nbsp'+
        '</div>'+

        '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'stap\')"><b>Software TAP <i class="fas fa-sort-down" id="stap-form-icon"></i></b></h6>'+
            '<span style="display:block" id="stap-form-span"><br>'+
                //socket->Network
                '<p> <i class="fas fa-plug fa-lg"></i> Traffic from socket to network interface '+
                    '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddSTAPModal(\'socket-network\')">Add Socket->Network</button>'+
                '</p>' +
                '<div>'+
                    '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                        '<thead>'+
                            '<th width="20%">Description</th>'+
                            '<th width="20%">Port</th>'+
                            '<th width="20%">Certificate</th>'+
                            '<th width="20%">Interface</th>'+
                            '<th width="20%">Actions</th>'+
                        '</thead>'+
                        '<tbody id="socket-network-table">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br><br>'+
                //socket->PCAP
                '<p> <i class="fas fa-plug fa-lg"></i> Traffic from socket to PCAP'+
                    '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddSTAPModal(\'socket-pcap\')">Add Socket->PCAP</button>'+
                '</p>' +
                '<div>'+
                    '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                        '<thead>'+
                            '<th>Description</th>'+
                            '<th>Port</th>'+
                            '<th>Certificate</th>'+
                            '<th>PCAP path</th>'+
                            '<th>PCAP prefix</th>'+
                            '<th>BPF</th>'+
                            '<th>Actions</th>'+
                        '</thead>'+
                        '<tbody id="socket-pcap-table">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br><br>'+            
            '</span>'+
        '</span>'+
    '</div>';

    // '<div class="my-3 p-3 bg-white rounded shadow-sm" id="flow-form-master">'+
    // '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'flow\')"><b>Flow <i class="fas fa-sort-down" id="flow-form-icon"></i></b></h6>'+
    // '<span style="display:block" id="flow-form-span"><br>'+
    //     '<br>'+
    //         '<table style=" width: 100%;height: 100%;">'+
    //         '<thead>'+
    //         '<tr>                                                         ' +
    //             '<th>Collect from</th>                                                  ' +
    //             '<th>Analysis</th>                                          ' +
    //             '<th>Transport</th>                                ' +
    //             '<th>Info</th>                                ' +
    //         '</tr>                                                        ' +
    //         '</thead>                                                     ' +
    //         '<tbody>                                                      ' +
    //             '<tr>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'network\')" id="collect-network" name="collect-type" value="network" class="custom-control-input">'+
    //                     // '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" data-toggle="modal" data-target="#modal-master" onclick="loadNetworkValues()" style="color:grey;" title="Interface information"></i>'+
    //                     '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" onclick="loadNetworkValues()" style="color:grey;" title="Interface information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'socket-pcap\')" id="collect-socket-pcap" name="collect-type" value="socket-pcap" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-socket-pcap">Socket -> PCAP</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'socket-network\')" id="collect-socket-network" name="collect-type" value="socket-network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-socket-network">Socket -> Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'pcap-network\')" id="collect-pcap-network" name="collect-type" value="pcap-network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-pcap-network">PCAP -> Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
    //                 '</div>'+
    //             '</td>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'analysis\', \'value\', \'network\')" id="analysis-network" name="analysis-type" value="network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="analysis-network">Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Analysis information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'analysis\', \'value\', \'pcap\')" id="analysis-pcap" name="analysis-type" value="pcap" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="analysis-pcap">PCAP</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Analysis information"></i>'+
    //                 '</div>'+
    //             '</td>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowStatus(\'transport\', \'value\', \'wazuh\')" id="transport-wazuh" name="transport-type" value="wazuh" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="transport-wazuh">Wazuh</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Transport information"></i>'+
    //                 '</div>'+                    
    //             '</td>'+
    //             '<td style="word-wrap: break-word;"></td>'+
    //             '</tr>'+
    //         '</tbody>' +
                
    //         '</table>'+
    //     '</span>'+
    // '</div>'+


    // '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
    //     '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'deploy\')"><b>Deploy <i class="fas fa-sort-down" id="deploy-form-icon"></i></b></h6>'+
    //     '<span style="display:block" id="deploy-form-span"><br>'+
    //         '<br>'+
    //         '<p><i style="color: Dodgerblue;" class="fas fa-search"></i> <span style="font-size: 15px; color: Grey;">&nbsp; Moloch &nbsp; | '+
    //         '  <span style="font-size: 15px; color: grey;">                                   ' +
    //         '    <i class="fas fa-play-circle" title="Deploy Moloch" onclick="deployMaster(\'moloch\')"></i>                         ' +
    //         '  </span></p> '+
    //         '<p><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> <span style="font-size: 15px; color: Grey;">&nbsp; OwlH interface &nbsp; | '+
    //         '  <span style="font-size: 15px; color: grey;">                                   ' +
    //         '    <i class="fas fa-play-circle" title="Deploy interface" onclick="deployMaster(\'interface\')"></i>                         ' +
    //         '  </span></p> '+
    //         '<p><i style="color: Dodgerblue;" class="fas fa-traffic-light"></i> <span style="font-size: 15px; color: Grey;">&nbsp; OwlH firewall &nbsp; | '+
    //         '  <span style="font-size: 15px; color: grey;">                                   ' +
    //         '    <i class="fas fa-play-circle" title="Deploy firewall" onclick="deployMaster(\'firewall\')"></i>                         ' +
    //         '</span></p> '+
    //     '</span>'+
    // '</div>';

    // axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector')
    //.then(function (response) {
    //    if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
    //     if (response.data.ack){
    //         document.getElementById('ports-table').innerHTML = "No remote systems yet";
    //     }else if(response.data){
    //         var res = response.data.split("\n");
    //         var html =                         
    //         '<table class="table table-hover" style="table-layout: fixed" width="100%">' +
    //             '<thead>                                                      ' +
    //                 '<th>Proto</th>                                             ' +
    //                 '<th>RECV</th>                                             ' +
    //                 '<th>SEND</th>                                             ' +
    //                 '<th style="width: 25%">LOCAL IP</th>                                             ' +
    //                 '<th style="width: 25%">REMOTE IP</th>                                             ' +
    //                 '<th style="width: 15%">STATUS</th>                                             ' +
    //                 '<th></th>                                             ' +
    //             '</thead>                                                     ' +
    //             '<tbody>                                                     '
    //             for(line in res) {
    //                 if (res[line] != ""){
    //                     var vregex = /([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)/;
    //                     var lineSplited = vregex.exec(res[line]);
    //                     html = html + '<tr><td>' +
    //                     lineSplited[1]+
    //                     '</td><td>     ' +
    //                     lineSplited[2]+
    //                     '</td><td>     ' +
    //                     lineSplited[3]+
    //                     '</td><td>     ' +
    //                     lineSplited[4]+
    //                     '</td><td>     ' +
    //                     lineSplited[5]+
    //                     '</td><td>     ' +
    //                     lineSplited[6]+
    //                     '</td><td>     ' +
    //                     lineSplited[7]+
    //                     '</td></tr>';
    //                 }
    //             }                
    //             html = html + '</tbody>'+
    //         '</table>';
    //         document.getElementById('ports-table1').innerHTML = html;
    //         document.getElementById('ports-table2').innerHTML = html;
    //     }
    // });

    // PingCollector();
    // PingDataflow();
    PingPlugins();
    PingServiceMaster();
}

function showMasterFile(file){
    document.location.href = 'https://' + location.host + '/edit-master.html?file='+file;
}
function loadControlDataMaster(type){
    document.location.href = 'https://' + location.host + '/control-data.html?type='+type;
}
function loadIncidentMaster(type){
    document.location.href = 'https://' + location.host + '/incident-data.html?type='+type;
}

function deployMaster(value){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/deployMaster';
    var jsonDeploy = {}
    jsonDeploy["value"] = value;
    var dataJSON = JSON.stringify(jsonDeploy);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> '+value+' deployed successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+value+' has not been deployed.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
    });
}

function loadNetworkValues(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/interface';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            var html = '<div class="modal-dialog modal-sm">'+
                '<div class="modal-content">'+
            
                    '<div class="modal-header">'+
                        '<h4 class="modal-title" id="delete-node-header">Networks</h4>'+
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
                        '<button type="button" class="btn btn-secondary" data-dismiss="modal" id="btn-close-interface">Close</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-update-interface" onclick="updateMasterNetworkInterface()">Deploy</button>'+
                    '</div>'+
        
                '</div>'+
            '</div>';
            document.getElementById('modal-master').innerHTML = html;
            //load interfaces
            LoadMasterNetworkValuesSelected();   
            //close modal     
            // $('#btn-close-interface').click(function() {
                // $('#modal-master').modal('hide');
            $('#modal-master').modal().hide();
            // });
        }
    })
    .catch(function (error) {
    });
}

function loadNetworkStapValues(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/interface';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            $('#modal-master').modal().hide();
            PrivilegesMessage();              
        }else{
            var html = '<div class="modal-dialog modal-sm">'+
                '<div class="modal-content">'+
            
                    '<div class="modal-header">'+
                        '<h4 class="modal-title" id="delete-node-header">STAP Networks</h4>'+
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
                                            '<input type="radio" id="stap-value-'+net+'" value="'+net+'" name="net-select">'+
                                        '</td>'+
                                    '</tr>';
                                }
                                html = html + '</tbody>'+
                                '</table>';
                        }
                    html = html + '</div>'+
        
                    '<div class="modal-footer" id="delete-node-footer-btn">'+
                        '<button type="button" class="btn btn-secondary" data-dismiss="modal" id="btn-close-interface">Close</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-update-interface" onclick="updateMasterStapInterface(\''+uuid+'\')">Deploy</button>'+
                    '</div>'+
        
                '</div>'+
            '</div>';
            document.getElementById('modal-master').innerHTML = html;        
            $('#modal-master').modal().hide();
        }
    })
    .catch(function (error) {
    });
}

function updateMasterStapInterface(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/updateMasterStapInterface';
    var valueSelected = "";
    $('input:radio:checked').each(function() {
        idRadio = $(this).prop("id");
        if (idRadio == "stap-value-"+$(this).prop("value")){
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
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            $('#modal-master').modal('hide');
            PrivilegesMessage();              
        }else{
            $('#modal-master').modal('hide');
            PingPlugins();
        }
    })
    .catch(function (error) {
    });
}

function updateMasterNetworkInterface(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/updateMasterNetworkInterface';
    var valueSelected = "";
    $('input:radio:checked').each(function() {
        idRadio = $(this).prop("id");
        if (idRadio == "net-value-"+$(this).prop("value")){
            valueSelected = $(this).prop("value");
        }
    });
    var jsonDeploy = {}
    jsonDeploy["value"] = valueSelected;
    jsonDeploy["param"] = "value";
    jsonDeploy["uuid"] = "interface";
    var dataJSON = JSON.stringify(jsonDeploy);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}   
        if(response.data.permissions == "none"){
            $('#modal-master').modal('hide');
            PrivilegesMessage();              
        }else{
            $('#modal-master').modal('hide');
        }     
    })
    .catch(function (error) {
    });
}

function DeployServiceMaster(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/deployservice';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            if (response.data.ack == "true"){
                document.getElementById('owlhMasterService').style.display = "none";
            }else {
                document.getElementById('owlhMasterService').style.display = "block";
            }
        }
    })
    .catch(function (error) {
    });
}

function PingServiceMaster(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/pingservice';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';} 
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            if (response.data.ack == "true"){
                document.getElementById('owlhMasterService').style.display = "none";
            }else {
                document.getElementById('owlhMasterService').style.display = "block";
            }
        }       
    })
    .catch(function (error) {
    });
}

function LoadMasterNetworkValuesSelected(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/loadMasterNetworkValuesSelected';

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{
            document.getElementById('net-value-'+response.data["interface"]["value"]).checked = "true"
        }
    })
    .catch(function (error) {
    });
}

function PingDataflow(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/pingFlow';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    }).then(function (response) {
        var flows = response.data;
        for (flow in flows){
            document.getElementById(flow+'-'+flows[flow]["value"]).checked = "true";
        }
    }).catch(function (error) {
        // return false;
    });
}

function PingPlugins(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/pingPlugins';
    var tableSocketNetwork = "";
    var tableSocketPcap = "";
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {           
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}  
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{            
            
            //check dispatcher
            if (response.data["dispatcher"]["status"] == "enabled"){
                document.getElementById('dispatcher-status').value = "disabled";                        
                document.getElementById('dispatcher-status').style.color = "green";
                document.getElementById('dispatcher-status').className = "badge bg-success align-text-bottom text-white";
                document.getElementById('dispatcher-status').innerHTML = "ON";
                document.getElementById('dispatcher-button').title = "Stop dispatcher";
                document.getElementById('dispatcher-button').className = "fas fa-stop-circle";
            }else if (response.data["dispatcher"]["status"] == "disabled"){
                document.getElementById('dispatcher-status').value = "enabled";
                document.getElementById('dispatcher-status').style.color = "red";
                document.getElementById('dispatcher-status').className = "badge bg-danger align-text-bottom text-white";
                document.getElementById('dispatcher-status').innerHTML = "OFF";
                document.getElementById('dispatcher-button').title = "Play dispatcher";
                document.getElementById('dispatcher-button').className = "fas fa-play-circle";
            }

            for (line in response.data){                
                if (response.data[line]["connections"] != "" || response.data[line]["connections"] != null){
                    var conns = response.data[line]["connections"].split("\n");
                    const result = conns.filter(con => con != "");                
                }else{
                    const result = [];
                }
                
                if (response.data[line]["type"] == "socket-network"){                
                    tableSocketNetwork = tableSocketNetwork + '<tr>';

                        if(response.data[line]["connectionsCount"] > 0){
                            tableSocketNetwork = tableSocketNetwork + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+' <span class="badge badge-pill bg-'+response.data[line]["connectionsColor"]+' align-text-bottom text-white">'+response.data[line]["connectionsCount"]+'</span><br>';
                        }else{
                            tableSocketNetwork = tableSocketNetwork + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'<br>';
                        }

                            if (response.data[line]["pid"] == "none"){
                                tableSocketNetwork = tableSocketNetwork + '<span class="badge bg-danger align-text-bottom text-white">OFF</span>';
                                if(response.data[line]["running"]=="true"){
                                    tableSocketNetwork = tableSocketNetwork + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                }else{
                                    tableSocketNetwork = tableSocketNetwork + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                }
                            }else{
                                tableSocketNetwork = tableSocketNetwork + '<span class="badge bg-success align-text-bottom text-white">ON</span>';
                                if(response.data[line]["running"]=="true"){
                                    tableSocketNetwork = tableSocketNetwork + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                }else{
                                    tableSocketNetwork = tableSocketNetwork + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                }
                            }                    
                        tableSocketNetwork = tableSocketNetwork + '</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                        '<td style="word-wrap: break-word;" id="socket-network-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                        '<td style="word-wrap: break-word;">';
                            if (response.data[line]["pid"] == "none"){
                                tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-play" style="color: grey; cursor:pointer;" onclick="DeployStapServiceMaster(\''+line+'\', \''+response.data[line]["collector"]+'\', \''+response.data[line]["port"]+'\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["type"]+'\')"></i> &nbsp';
                            }else if (response.data[line]["pid"] != "none"){
                                tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-stop" style="color: grey; cursor:pointer;" onclick="StopStapServiceMaster(\''+line+'\', \'socket-network\')"></i> &nbsp';
                            }                        
    
                            tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor:pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+                        
                            '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+line+'\', \'socket-network\', \''+response.data[line]["name"]+'\')" style="color: red; cursor:pointer;"></i>'+
                        '</td>'+
                    '</tr>'+
                    '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="4">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Description: <input class="form-control" id="socket-network-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                                '</div>'+
                                '<div class="col">'+
                                    'Port: <input class="form-control" id="socket-network-port-'+line+'" value="'+response.data[line]["port"]+'">'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Certificate: <input class="form-control" id="socket-network-cert-'+line+'" value="'+response.data[line]["cert"]+'">'+
                                '</div>'+
                                '<div class="col">'+
                                    'Interface: <i class="fas fa-edit" style="cursor: pointer; color: Dodgerblue;" title="Socket to network '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+response.data[line]["name"]+'\', \''+line+'\')"></i><input class="form-control" id="socket-network-interface-'+line+'" value="'+response.data[line]["interface"]+'" disabled>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td style="word-wrap: break-word;" >'+
                            '<div class="form-row text-center">'+
                                '<div class="col">'+
                                    '<button class="btn btn-seconday" id="modify-stap-cancel-socket-network-'+line+'" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                                '</div>'+
                            '</div>'+
                            '<br>'+
                            '<div class="form-row text-center">'+
                                '<div class="col">'+
                                    '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\'socket-network\', \''+line+'\')">Save</button>'+    
                                '</div>'+
                            '</div>'+
                        '</td>'+
                    '</tr>';
                    if(response.data[line]["connectionsCount"] > 0){
                        tableSocketNetwork = tableSocketNetwork +'<tr>'+
                            '<td colspan="5">'+ 
                                '<table class="table table-hover" style="table-layout: fixed"tyle="table-layout: fixed" width="100%">'+
                                    '<thead>'+
                                        '<th width="7%">Proto</th>'+
                                        '<th width="7%">Recv-Q</th>'+
                                        '<th width="7%">Send-Q</th>'+
                                        '<th width="">Local Addr</th>'+
                                        '<th width="">Foreign Addr</th>'+
                                        '<th width="">State</th>'+
                                        '<th width="">PID/name</th>'+
                                    '</thead>'+
                                    '<tbody>';                                
                                        result.forEach(function (item, index) {
                                            tableSocketNetwork = tableSocketNetwork + '<tr>';
    
                                            var splittedData = item.split(' ');
                                            var dataFiltered = splittedData.filter(word => word != '');
                                            dataFiltered.forEach(function (value, pos) {
                                                tableSocketNetwork = tableSocketNetwork + '<td style="word-wrap: break-word;">'+value+'</td>';
                                            })                                            
                                            tableSocketNetwork = tableSocketNetwork + '</tr>';
                                        });
                                        tableSocketNetwork = tableSocketNetwork +'</tbody>'+
                                '</table>'+
                            '</td>'+
                        '</tr>';
                    }
    
                }else if (response.data[line]["type"] == "socket-pcap"){                
                    tableSocketPcap = tableSocketPcap + '<tr>';

                        if(response.data[line]["connectionsCount"] > 0){
                            tableSocketPcap = tableSocketPcap + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+' <span class="badge badge-pill bg-'+response.data[line]["connectionsColor"]+' align-text-bottom text-white">'+response.data[line]["connectionsCount"]+'</span><br>';
                        }else{
                            tableSocketPcap = tableSocketPcap + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'<br>';
                        }

                        if (response.data[line]["pid"] == "none"){
                            tableSocketPcap = tableSocketPcap + '<span class="badge bg-danger align-text-bottom text-white">OFF</span>';
                            if(response.data[line]["running"]=="true"){
                                tableSocketPcap = tableSocketPcap + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                            }else{
                                tableSocketPcap = tableSocketPcap + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                            }
                        }else{
                            tableSocketPcap = tableSocketPcap + '<span class="badge bg-success align-text-bottom text-white">ON</span>';
                            if(response.data[line]["running"]=="true"){
                                tableSocketPcap = tableSocketPcap + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                            }else{
                                tableSocketPcap = tableSocketPcap + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                            }
                        }
                        tableSocketPcap = tableSocketPcap + '</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["pcap-path"]+'</td>'+
                        '<td style="word-wrap: break-word;">'+response.data[line]["pcap-prefix"]+'</td>'+
                        '<td style="word-wrap: break-word;" id="socket-pcap-bpf-default-'+line+'">'+response.data[line]["bpf"]+'</td>'+
                        '<td style="word-wrap: break-word;">';
                            if (response.data[line]["pid"] == "none"){
                                tableSocketPcap = tableSocketPcap + '<i class="fas fa-play" style="color: grey; cursor:pointer;" onclick="DeployStapServiceMaster(\''+line+'\', \''+response.data[line]["collector"]+'\', \''+response.data[line]["port"]+'\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["type"]+'\')"></i> &nbsp';
                            }else if (response.data[line]["pid"] != "none"){
                                tableSocketPcap = tableSocketPcap + '<i class="fas fa-stop" style="color: grey; cursor:pointer;" onclick="StopStapServiceMaster( \''+line+'\', \'socket-pcap\')"></i> &nbsp';
                            }
                            tableSocketPcap = tableSocketPcap + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor:pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                            '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+line+'\', \'socket-pcap\', \''+response.data[line]["name"]+'\')" style="color: red; cursor:pointer;"></i>'+
                        '</td>'+
                    '</tr>'+
                    '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                        '<td style="word-wrap: break-word;" colspan="6">'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Description: <input class="form-control" id="socket-pcap-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                                '</div>'+
                                '<div class="col">'+
                                    'Port: <input class="form-control" id="socket-pcap-port-'+line+'" value="'+response.data[line]["port"]+'">'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'PCAP-Path: <input class="form-control" id="socket-pcap-pcap-path-'+line+'" value="'+response.data[line]["pcap-path"]+'">'+
                                '</div>'+
                                '<div class="col">'+
                                    'PCAP-Prefix: <input class="form-control" id="socket-pcap-pcap-prefix-'+line+'" value="'+response.data[line]["pcap-prefix"]+'">'+
                                '</div>'+
                            '</div>'+
                            '<div class="form-row">'+
                                '<div class="col">'+
                                    'Certificate: <input class="form-control" id="socket-pcap-cert-'+line+'" value="'+response.data[line]["cert"]+'">'+
                                '</div>'+
                                '<div class="col">'+
                                    'BPF: <i class="fas fa-edit" style="cursor: pointer; color: Dodgerblue;" onclick="loadBPF(\''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\', \''+response.data[line]["type"]+'\')"></i> <input class="form-control" id="socket-pcap-bpf-'+line+'" value="'+response.data[line]["bpf"]+'" disabled>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td style="word-wrap: break-word;" >'+
                            '<div class="form-row text-center">'+
                                '<div class="col">'+
                                    '<button class="btn btn-seconday" id="modify-stap-cancel-socket-pcap-'+line+'" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                                '</div>'+
                            '</div>'+
                            '<br>'+
                            '<div class="form-row text-center">'+
                                '<div class="col">'+
                                    '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\'socket-pcap\', \''+line+'\')">Save</button>'+    
                                '</div>'+
                            '</div>'+
                        '</td>'+
                    '</tr>';
                    if(response.data[line]["connectionsCount"] > 0){
                        tableSocketPcap = tableSocketPcap + '<tr>'+
                            '<td colspan="7">'+ 
                                '<table class="table table-hover" style="table-layout: fixed"tyle="table-layout: fixed" width="100%">'+
                                    '<thead>'+
                                        '<th width="7%">Proto</th>'+
                                        '<th width="7%">Recv-Q</th>'+
                                        '<th width="7%">Send-Q</th>'+
                                        '<th width="">Local Addr</th>'+
                                        '<th width="">Foreign Addr</th>'+
                                        '<th width="">State</th>'+
                                        '<th width="">PID/name</th>'+
                                    '</thead>'+
                                    '<tbody>';                                
                                        result.forEach(function (item, index) {
                                            tableSocketPcap = tableSocketPcap + '<tr>';
    
                                            var splittedData = item.split(' ');
                                            var dataFiltered = splittedData.filter(word => word != '');
                                            dataFiltered.forEach(function (value, pos) {
                                                tableSocketPcap = tableSocketPcap + '<td style="word-wrap: break-word;">'+value+'</td>';
                                            })                                            
                                            tableSocketPcap = tableSocketPcap + '</tr>';
                                        });
                                        tableSocketPcap = tableSocketPcap +'</tbody>'+
                                '</table>'+
                            '</td>'+
                        '</tr>';
                    }
                }
                
                document.getElementById('socket-network-table').innerHTML = tableSocketNetwork;
                document.getElementById('socket-pcap-table').innerHTML = tableSocketPcap;

                if(response.data["installed"]["checkSocat"] == "false" || response.data["installed"]["checkTcpdump"] == "false"){
                    document.getElementById('stap-installed-status').style.display = "block";
                    if(response.data["installed"]["checkSocat"] == "true"){
                        document.getElementById("stap-installed-socat").innerHTML = "Installed";
                        document.getElementById("stap-installed-socat").className = '"badge badge-pill bg-success align-text-bottom text-white';
                    }else{
                        document.getElementById("stap-installed-socat").innerHTML = "Not installed";
                        document.getElementById("stap-installed-socat").className = '"badge badge-pill bg-danger align-text-bottom text-white';
                    }
                    if(response.data["installed"]["checkTcpdump"] == "true"){
                        document.getElementById("stap-installed-tcpdump").innerHTML = "Installed";
                        document.getElementById("stap-installed-tcpdump").className = '"badge badge-pill bg-success align-text-bottom text-white';
                    }else{
                        document.getElementById("stap-installed-tcpdump").innerHTML = "Not installed";
                        document.getElementById("stap-installed-tcpdump").className = '"badge badge-pill bg-danger align-text-bottom text-white';
                    }    
                }else{
                    document.getElementById("stap-installed-status").style.display = "none";
                }
            }
        } 
    })
    .catch(function (error) {
    });
}

function showModifyStap(service){
    $('#edit-row-'+service).show();
}

function hideEditStap(line){
    document.getElementById('edit-row-'+line).style.display = "none";
}

function saveStapChanges(type, uuid){    
    $('#edit-row-'+uuid).hide();
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/modifyStapValues';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["type"] = type;
    if (type == "socket-network"){
        jsonDeployService["name"] = document.getElementById('socket-network-name-'+uuid).value.trim();
        jsonDeployService["port"] = document.getElementById('socket-network-port-'+uuid).value.trim();
        jsonDeployService["cert"] = document.getElementById('socket-network-cert-'+uuid).value.trim();
    }else if (type == "socket-pcap"){        
        jsonDeployService["name"] = document.getElementById('socket-pcap-name-'+uuid).value.trim();
        jsonDeployService["port"] = document.getElementById('socket-pcap-port-'+uuid).value.trim();
        jsonDeployService["cert"] = document.getElementById('socket-pcap-cert-'+uuid).value.trim();
        jsonDeployService["pcap-path"] = document.getElementById('socket-pcap-pcap-path-'+uuid).value.trim();
        jsonDeployService["pcap-prefix"] = document.getElementById('socket-pcap-pcap-prefix-'+uuid).value.trim();
    }
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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

function loadBPF(bpf, uuid, name){
    var modalWindow = document.getElementById('modal-master');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
                '<div class="modal-content" >'+

                    '<div class="modal-header" style="word-break: break-all;">'+
                        '<h4 class="modal-title" id="bpf-header">'+name+' BPF</h4>'+
                        '<button type="button" class="close" id="load-bpf-cross">&times;</button>'+
                    '</div>'+

                    '<div class="modal-body" id="modal-footer-inputtext">'+
                        '<input type="text" class="form-control" id="recipient-name" value="'+bpf+'">'+
                    '</div>'+

                    '<div class="modal-footer" id="modal-footer-btn">'+
                        '<button type="button" class="btn btn-secondary" id="load-bpf-close">Close</button>'+
                        '<button type="button" class="btn btn-primary" id="load-bpf-save">Save</button>'+
                    '</div>'+

                '</div>'+
            '</div>';

    $('#modal-master').modal("show");
    $('#load-bpf-cross').click(function(){ $('#modal-master').modal("hide"); });
    $('#load-bpf-close').click(function(){ $('#modal-master').modal("hide"); });
    $('#load-bpf-save').click(function(){ $('#modal-master').modal("hide"); saveBPF(uuid, document.getElementById('recipient-name').value); });
}

function saveBPF(uuid, value){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/setbpf';

    var jsonbpfdata = {}
    jsonbpfdata["uuid"] = uuid;
    jsonbpfdata["param"] = "bpf";
    jsonbpfdata["value"] = value;
    var bpfjson = JSON.stringify(jsonbpfdata);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: bpfjson
    })
     .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{            
            document.getElementById('socket-pcap-bpf-'+uuid).value = value;
            document.getElementById('socket-pcap-bpf-default-'+uuid).innerHTML = value;
            //   loadPlugins();
        }
      })
      .catch(function (error) {
      });
}

function ModalDeleteService(uuid, type, name){
    var modalWindow = document.getElementById('modal-master');
    modalWindow.innerHTML =
    '<div class="modal-dialog modal-md">'+
      '<div class="modal-content">'+

        '<div class="modal-header" style="word-break: break-all;">'+
          '<h4 class="modal-title">Delete '+type+' service</h4>'+
          '<button type="button" class="close" id="delete-service-cross">&times;</button>'+
        '</div>'+

        '<div class="modal-body" style="word-break: break-all;">'+
            '<p>Do you want to delete a '+type+' service with name <b>'+name+'</b></p>'+
        '</div>'+

        '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
          '<button type="button" class="btn btn-secondary" id="delete-service-close">Close</button>'+
          '<button type="button" class="btn btn-danger" id="delete-service-ok">Delete</button>'+
        '</div>'+

      '</div>'+
    '</div>';
    $('#modal-master').modal("show");
    $('#delete-service-ok').click(function(){ $('#modal-master').modal("hide"); deleteServiceMaster(uuid); });
    $('#delete-service-cross').click(function(){ $('#modal-master').modal("hide");});
    $('#delete-service-close').click(function(){ $('#modal-master').modal("hide");});
}

function deleteServiceMaster(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deleteService';

    var jsonDeleteService = {}
    jsonDeleteService["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeleteService);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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

function changePluginStatus(uuid,param,value){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/changePluginStatus';
    var newStatus = {}
    if (uuid == "dispatcher"){
        if(document.getElementById(uuid+'-status').value == null || 
            document.getElementById(uuid+'-status').value == undefined || document.getElementById(uuid+'-status').value == "N/A"){
            newStatus["value"] = "disabled";
        }else{
            newStatus["value"] = document.getElementById(uuid+'-status').value;
        }
    }
    newStatus["param"] = param
    newStatus["uuid"] = uuid;
    var dataJSON = JSON.stringify(newStatus);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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
        // return false;
    });
}

function changeDataflowStatus(uuid,param,value){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/changeDataflowStatus';
    
    var newStatus = {}
    newStatus["value"] = value;
    newStatus["param"] = param;
    newStatus["uuid"] = uuid;
    var dataJSON = JSON.stringify(newStatus);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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
        // return false;
    });
}


function PingCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var collectorMasterStatus = document.getElementById('master-collector-status');
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{            
            if (response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Master STAP Collector is not available.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else if (response.data != ""){
                collectorMasterStatus.style.color="green";
            }else{
                collectorMasterStatus.style.color="red";
            }
        }
    })
    .catch(function (error) {
        return false;
    });
}

function playMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/playMasterCollector';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Can\'t start Master STAP Collector.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
    });
}

function stopMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/stopMasterCollector';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Can\'t stop Master STAP Collector.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                return true;
            }
        }
    })
    .catch(function (error) {
        return false;
    });
}

function showMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Can\'t retrieve data from Master STAP Collector.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                showMasterModalCollector(response);
                return true;
            }
        }
    })
    .catch(function (error) {
        return false;
    });
}

function showMasterModalCollector(response){ 
    var res = response.data.split("\n");
    var html = '<div class="modal-dialog modal-lg">'+
        '<div class="modal-content">'+
    
            '<div class="modal-header">'+
                '<h4 class="modal-title" id="modal-collector-header">Master STAP Collector status</h4>'+
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>'+
    
            '<div class="modal-body">'
                    if (response.data == ""){
                        html = html + '<p>There are no ports</p>';
                    }else{
                        html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>                                                      ' +
                            '<tr>                                                         ' +
                                '<th>Proto</th>                                             ' +
                                '<th>RECV</th>                                             ' +
                                '<th>SEND</th>                                             ' +
                                '<th style="width: 25%">LOCAL IP</th>                                             ' +
                                '<th style="width: 25%">REMOTE IP</th>                                             ' +
                                '<th style="width: 15%">STATUS</th>                                             ' +
                                '<th></th>                                             ' +
                            '</tr>                                                        ' +
                        '</thead>                                                     ' +
                        '<tbody>                                                     ' 
                        for(line in res) {
                            if (res[line] != ""){
                                var vregex = /([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)/;
                                var lineSplited = vregex.exec(res[line]);
                                html = html + '<tr><td>' +
                                lineSplited[1]+
                                '</td><td>     ' +
                                lineSplited[2]+
                                '</td><td>     ' +
                                lineSplited[3]+
                                '</td><td>     ' +
                                lineSplited[4]+
                                '</td><td>     ' +
                                lineSplited[5]+
                                '</td><td>     ' +
                                lineSplited[6]+
                                '</td><td>     ' +
                                lineSplited[7]+
                                '</td></tr>'
                            }
                        }
                    }
            html = html +
            '</div>'+
    
        '</div>'+
    '</div>';
    document.getElementById('modal-master').innerHTML = html;
    $('#modal-master').modal().hide();
}

function AddSTAPModal(type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var html =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Add '+type+' service</h4>'+
            '<button type="button" class="close" id="add-stap-modal-cross">&times;</button>'+
        '</div>'+

        '<div class="modal-body">'+
            '<p>Insert Description:</p>'+
                '<input type="text" class="form-control" id="soft-tap-name-master"><br>'+
            '<p>Insert port:</p>'+
                '<input type="text" class="form-control" id="soft-tap-port-master" value="50010"><br>'+
            '<p>Insert certificate:</p>'+
                '<input type="text" class="form-control" id="soft-tap-cert-master" value="/usr/local/owlh/src/owlhmaster/conf/certs/ca.pem"><br>';
            // if (type == "socket-network"){                  
            // }else 
            if (type == "socket-pcap"){
                html = html + '<p>Insert PCAP path:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-pcap-path-master" value="/usr/local/owlh/pcaps"><br>'+
                '<p>Insert PCAP prefix:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-pcap-prefix-master" value="remote-"><br>'+
                '<p>Insert BPF:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-bpf-master"><br>';
            }else if (type == "network-socket"){
                html = html + '<p>Select collector:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-collector-master" value="192.168.1.100"><br>'+
                '<p>Insert BPF:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-bpf-socket-master"><br>';
            }
            if (type != "socket-pcap"){
                html = html + '<p>Select an interface:</p>'+
                '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                    '<tbody id="socket-network-modal-table-master">' +
                    '</tbody>'+
                '</table>';   
                axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/master/interface', {headers:{'token': document.cookie,'user': payload.user}})
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
                                        inner = inner + '<input class="socket-network-radio-stap" type="radio" id="create-socket-network-'+net+'" value="'+net+'" name="net-select" checked>';                        
                                        isChecked = true;
                                    }else{
                                        inner = inner + '<input class="socket-network-radio-stap" type="radio" id="create-socket-network-'+net+'" value="'+net+'" name="net-select">';                        
                                    }
                                inner = inner + '</td>'+
                            '</tr>';
                        }
                        document.getElementById('socket-network-modal-table-master').innerHTML = inner;
                    }
                });   
            }
        html = html + '</div>'+
        '<div class="modal-footer" id="sync-node-footer-btn">'+
            '<button type="button" class="btn btn-secondary" id="add-stap-modal-close">Cancel</button>'+
            '<button type="button" class="btn btn-primary" id="add-stap-modal">Add</button>'+
        '</div>'+

        '</div>'+
    '</div>';

    document.getElementById('modal-master').innerHTML = html;
    
    $('#modal-master').modal("show");
    $('#add-stap-modal').click(function(){ saveSoftwareTAP(type); });
    $('#add-stap-modal-close').click(function(){ $('#modal-master').modal("hide");});
    $('#add-stap-modal-cross').click(function(){ $('#modal-master').modal("hide");});
}

function saveSoftwareTAP(type){ 
    $('#soft-tap-name-master').css('border', '2px solid red');
    $('#soft-tap-name-master').attr("placeholder", "Please, insert a valid name"); 
    if(type == "socket-network" && (document.getElementById('soft-tap-name-master').value == "" || document.getElementById('soft-tap-port-master').value == "" || document.getElementById('soft-tap-cert-master').value == "") ||  
        type == "socket-pcap" && (document.getElementById('soft-tap-name-master').value == "" || document.getElementById('soft-tap-port-master').value == "" || document.getElementById('soft-tap-cert-master').value == "" || document.getElementById('soft-tap-pcap-path-master').value == "" || document.getElementById('soft-tap-pcap-prefix-master').value == "" || document.getElementById('soft-tap-bpf-master').value == ""))
    {
        if(type == "socket-network"){
            if (document.getElementById('soft-tap-name-master').value == ""){
                $('#soft-tap-name-master').css('border', '2px solid red');
                $('#soft-tap-name-master').attr("placeholder", "Please, insert a valid name"); 
            }else{
                $('#soft-tap-name-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-port-master').value == ""){
                $('#soft-tap-port-master').css('border', '2px solid red');
                $('#soft-tap-port-master').attr("placeholder", "Please, insert a valid port"); 
            }else{
                $('#soft-tap-port-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-cert-master').value == ""){
                $('#soft-tap-cert-master').css('border', '2px solid red');
                $('#soft-tap-cert-master').attr("placeholder", "Please, insert a valid certificate"); 
            }else{
                $('#soft-tap-cert-master').css('border', '2px solid #ced4da');
            }
        }else if(type == "socket-pcap"){
            if (document.getElementById('soft-tap-port-master').value == ""){
                $('#soft-tap-port-master').css('border', '2px solid red');
                $('#soft-tap-port-master').attr("placeholder", "Please, insert a valid port"); 
            }else{
                $('#soft-tap-port-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-name-master').value == ""){   
                $('#soft-tap-name-master').css('border', '2px solid red');
                $('#soft-tap-name-master').attr("placeholder", "Please, insert a valid name");              
            }else{
                $('#soft-tap-name-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-cert-master').value == ""){
                $('#soft-tap-cert-master').css('border', '2px solid red');
                $('#soft-tap-cert-master').attr("placeholder", "Please, insert a valid certificate");   
            }else{
                $('#soft-tap-cert-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-pcap-path-master').value == ""){
                $('#soft-tap-pcap-path-master').css('border', '2px solid red');
                $('#soft-tap-pcap-path-master').attr("placeholder", "Please, insert a valid pcap path");   
            }else{
                $('#soft-tap-pcap-path-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-pcap-prefix-master').value == ""){
                $('#soft-tap-pcap-prefix-master').css('border', '2px solid red');
                $('#soft-tap-pcap-prefix-master').attr("placeholder", "Please, insert a valid pcap prefix");            
            }else{
                $('#soft-tap-pcap-prefix-master').css('border', '2px solid #ced4da');
            }
            if (document.getElementById('soft-tap-bpf-master').value == ""){
                $('#soft-tap-bpf-master').css('border', '2px solid red');
                $('#soft-tap-bpf-master').attr("placeholder", "Please, insert a valid bpf");   
            }else{
                $('#soft-tap-bpf-master').css('border', '2px solid #ced4da');
            }
        }
    }else{           
        $('#modal-master').modal("hide");
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/add';

        var valueSelected = "";
        $('input:radio:checked').each(function() {            
            if($(this).attr('class') == 'socket-network-radio-stap'){
                valueSelected = $(this).prop("value");
            }                        
        });

        var jsonSave = {}
        jsonSave["name"] = document.getElementById('soft-tap-name-master').value.trim();
        jsonSave["type"] = type;
        jsonSave["cert"] = document.getElementById('soft-tap-cert-master').value.trim();
        jsonSave["port"] = document.getElementById('soft-tap-port-master').value.trim();
        jsonSave["interface"] = valueSelected;
        if (type == "socket-pcap"){ jsonSave["pcap-path"] = document.getElementById('soft-tap-pcap-path-master').value.trim(); jsonSave["pcap-prefix"] = document.getElementById('soft-tap-pcap-prefix-master').value.trim(); jsonSave["bpf"] = document.getElementById('soft-tap-bpf-master').value.trim();}
        var dataJSON = JSON.stringify(jsonSave);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{'token': document.cookie,'user': payload.user},
            data: dataJSON
        })
       .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "true") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> '+type+' service added successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error adding service: </strong>'+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
                loadPlugins();
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error adding service: </strong>'+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function DeployStapServiceMaster(uuid, collector,port,interface, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deployStapServiceMaster';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["type"] = type;
    jsonDeployService["collector"] = collector;
    jsonDeployService["port"] = port;
    jsonDeployService["interface"] = interface;

    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Deploy STAP: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                loadPlugins();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Deploy STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function StopStapServiceMaster(uuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/stopStapServiceMaster';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["type"] = type;
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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

function showActions(action){
    var spanContent = document.getElementById(action+'-form-span');
    var icon = document.getElementById(action+'-form-icon');
    if (spanContent.style.display == "none") {
        spanContent.style.display = "block";
        icon.classList.add("fa-sort-up");
        icon.classList.remove("fa-sort-down");
    } else {
        spanContent.style.display = "none";
        icon.classList.add("fa-sort-down");
        icon.classList.remove("fa-sort-up");
    }
}


function loadNetworkValuesService(name, service){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/interface';

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}  
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            var html = '<div class="modal-dialog" id="network-modal-master">'+
              '<div class="modal-content">'+
    
                '<div class="modal-header" style="word-break: break-all;">'+
                  '<h4 class="modal-title" id="delete-node-header">'+name+' interface</h4>'+
                  '<button type="button" class="close" id="btn-select-interface-cross">&times;</button>'+
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
                                    '<input class="suricata-interface" type="radio" id="net-value-'+net+'" value="'+net+'" name="net-select">'+
                                '</td>'+
                            '</tr>';
                        }
                        html = html + '</tbody>'+
                        '</table>';
                    }
                html = html + '</div>'+
    
                '<div class="modal-footer" id="delete-node-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" id="btn-select-interface-close">Close</button>';
                        if (response.data.ack != "false"){
                                html = html + '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-delete-node" onclick="SaveStapInterface(\''+service+'\')">Save</button>';
                        }
                    html = html + '</div>'+
                '</div>'+
    
              '</div>'+
            '</div>';
            document.getElementById('modal-master').innerHTML = html;
    
            $('#modal-master').modal("show");
            $('#btn-select-interface-cross').click(function(){ $('#modal-master').modal("hide"); });
            $('#btn-select-interface-close').click(function(){ $('#modal-master').modal("hide"); });        
        }      
    })
    .catch(function (error) {
    });
}

function SaveStapInterface(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/saveStapInterface';
    var valueSelected = "";
    $('input:radio:checked').each(function() {
        idRadio = $(this).prop("id");
        if (idRadio == "net-value-"+$(this).prop("value")){
            valueSelected = $(this).prop("value");
        }
    });
    //suricata-interface

    var jsonUpdateIface = {}
    jsonUpdateIface["value"] = valueSelected;
    jsonUpdateIface["uuid"] = uuid;
    jsonUpdateIface["param"] = "interface";
    var dataJSON = JSON.stringify(jsonUpdateIface);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: dataJSON
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            // loadPlugins();
            document.getElementById('socket-network-interface-default-'+uuid).innerHTML = valueSelected;
            document.getElementById('socket-network-interface-'+uuid).value = valueSelected;
        }
    })
    .catch(function (error) {
    });
}

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
        loadPlugins();        
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();