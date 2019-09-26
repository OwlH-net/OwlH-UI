function loadPlugins(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    content = document.getElementById('master-table-plugins');
    content.innerHTML =
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'config\')"><b>Master configuration <i class="fas fa-sort-down" id="config-form-icon"></i></b> </h6>'+        
        '<span id="config-form-span">'+
            '<br>'+
            '<p><img src="img/favicon.ico" height="25"><span style="font-size: 15px; color: Grey;">&nbsp; Edit master configuration | </span>'+
            '<span style="font-size: 15px; color: grey;"> ' +
            '<i class="fas fa-info-circle" title="Edit Master configuration file" onclick="showMasterFile(\'main\')"></i>  ' +
            '</span>'+
            '</p> '+
            '<span id="owlhMasterService" style="display:none; font-size: 15px; cursor: default;" class="col-md-2 badge bg-warning align-text-bottom text-white" onclick="DeployServiceMaster()">Install service</span>'+
        '</span>'+
    '</div>'+

    '<div class="my-3 p-3 bg-white rounded shadow-sm" >'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'plugins\')"><b> Plugins <i class="fas fa-sort-down" id="plugins-form-icon"></i></b></h6>'+
        '<span id="plugins-form-span">'+
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
            '<table width="100%">'+
                '<tr>'+
                    '<td width="25%"><i style="color: Dodgerblue;" class="fas fa-plug fa-lg"></i> STAP Collector</td>'+
                    '<td width="25%">Status: <i class="fas fa-compress-arrows-alt" id="master-collector-status"></i></td>'+
                    '<td width="25%">Start/Stop: <i class="fas fa-play-circle" style="color: grey;"  title="Play collector" onclick="playMasterCollector()"></i> <i class="fas fa-stop-circle" style="color: grey;" title="Stop collector" onclick="stopMasterCollector()"></i></td>'+
                    '<td width="25%">Information: <i class="fas fa-info-circle" style="color: grey;" title="Collector information" onclick="showMasterCollector()"></i></td>'+
                '</tr>'+       
            '</table>'+
            '<div id="ports-table1"></div>&nbsp &nbsp &nbsp'+
            '<table width="100%">'+
                '<tr>'+
                    '<td width="25%"><i style="color: Dodgerblue;" class="fas fa-random"></i> Dispatcher</td>'+
                    '<td width="25%">Status: <i style="color: grey;" class="fas fa-angle-double-down" id="dispatcher-status"></i></td>'+
                    '<td width="25%">Start/Stop: <i style="color: grey;" class="fas fa-play-circle" id="dispatcher-button" onclick="changePluginStatus(\'dispatcher\', \'status\', \'disabled\')"></i> </td>'+
                    '<td width="25%">Dispatcher nodes: <i style="color: grey;" class="fas fa-info-circle" title="Show dispatcher nodes" onclick="showMasterFile(\'dispatcherNodes\')"></i></td>'+
                '</tr>'+       
            '</table>'+
            '<div id="ports-table2"></div>&nbsp &nbsp &nbsp'+
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
                            '<th width="20%">Name</th>'+
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
                            '<th>Name</th>'+
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

    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector')
    .then(function (response) {
        if (response.data.ack){
            document.getElementById('ports-table').innerHTML = "No remote systems yet";
        }else if(response.data){
            var res = response.data.split("\n");
            var html =                         
            '<table class="table table-hover" style="table-layout: fixed" width="100%">' +
                '<thead>                                                      ' +
                    '<th>Proto</th>                                             ' +
                    '<th>RECV</th>                                             ' +
                    '<th>SEND</th>                                             ' +
                    '<th style="width: 25%">LOCAL IP</th>                                             ' +
                    '<th style="width: 25%">REMOTE IP</th>                                             ' +
                    '<th style="width: 15%">STATUS</th>                                             ' +
                    '<th></th>                                             ' +
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
                        '</td></tr>';
                    }
                }                
                html = html + '</tbody>'+
            '</table>';
            document.getElementById('ports-table1').innerHTML = html;
            document.getElementById('ports-table2').innerHTML = html;
        }
    });

    PingCollector();
    PingDataflow();
    PingPlugins();
    PingServiceMaster();
}

function showMasterFile(file){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit-master.html?file='+file;
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
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> '+value+' deployed successfully.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+value+' has not been deployed.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
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
        timeout: 30000
    })
    .then(function (response) {
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
        timeout: 30000
    })
    .then(function (response) {
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
        data: dataJSON
    })
    .then(function (response) {
        $('#modal-master').modal('hide');
        PingPlugins();
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
        data: dataJSON
    })
    .then(function (response) {        
        $('#modal-master').modal('hide');
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
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "true"){
            document.getElementById('owlhMasterService').style.display = "none";
        }else {
            document.getElementById('owlhMasterService').style.display = "block";
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
        timeout: 30000
    })
    .then(function (response) {
        console.log(response.data.ack);
        if (response.data.ack == "true"){
            document.getElementById('owlhMasterService').style.display = "none";
        }else {
            document.getElementById('owlhMasterService').style.display = "block";
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
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('net-value-'+response.data["interface"]["value"]).checked = "true"
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
        timeout: 30000
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
        timeout: 30000
    })
    .then(function (response) {        
        var plugins = response.data;
        for (plugin in plugins){
            
            if (plugin == "dispatcher"){
                if (plugins[plugin]["status"] == "enabled"){
                    document.getElementById(plugin+'-status').style.color = "green";
                    document.getElementById(plugin+'-status').value = "disabled";
                    document.getElementById(plugin+'-button').className = "fas fa-stop-circle";
                    document.getElementById(plugin+'-button').title = "Stop "+plugin;
                }else if (plugins[plugin]["status"] == "disabled"){
                    document.getElementById(plugin+'-status').style.color = "red";
                    document.getElementById(plugin+'-button').className = "fas fa-play-circle";
                    document.getElementById(plugin+'-status').value = "enabled";
                    document.getElementById(plugin+'-button').title = "Play "+plugin;
                }
            }else if (plugins[plugin]["type"] == "socket-network"){                
            tableSocketNetwork = tableSocketNetwork + '<tr>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["name"]+'-'+response.data[plugin]["pid"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["port"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["cert"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["interface"]+'</td>'+
                    '<td style="word-wrap: break-word;">';                
                        if (response.data[plugin]["pid"] == "none"){
                            tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-play" style="color: grey;" onclick="DeployStapServiceMaster(\''+plugin+'\',\'socket-network\')"></i> &nbsp';
                        }else if (response.data[plugin]["pid"] != "none"){
                            tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-stop" style="color: grey;" onclick="StopStapServiceMaster(\''+plugin+'\', \'socket-network\')"></i> &nbsp';
                        }                        
                        tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-file" style="color:grey;" title="Socket to network '+response.data[plugin]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkStapValues(\''+plugin+'\')"></i> &nbsp'+
                        '<i class="fas fa-edit" id="modify-stap-'+plugin+'" style="color:grey;" onclick="showModifyStap(\''+plugin+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+plugin+'\', \'socket-network\', \''+response.data[plugin]["name"]+'\')" style="color: red;"></i>'+
                    '</td>'+
                '</tr>'+
                '<tr width="100%" id="edit-row-'+plugin+'" style="display:none;" bgcolor="peachpuff">'+
                    '<td style="word-wrap: break-word;" colspan="4">'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Name: <input class="form-control" id="socket-network-name-'+plugin+'" value="'+response.data[plugin]["name"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                'Port: <input class="form-control" id="socket-network-port-'+plugin+'" value="'+response.data[plugin]["port"]+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Certificate: <input class="form-control" id="socket-network-cert-'+plugin+'" value="'+response.data[plugin]["cert"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                            '</div>'+
                        '</div>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;" >'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-seconday" id="modify-stap-cancel-socket-network-'+plugin+'" onclick="hideEditStap(\''+plugin+'\')">Cancel</button>'+
                            '</div>'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-primary" id="modify-stap-change-'+plugin+'" onclick="saveStapChanges( \'socket-network\', \''+plugin+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
            
            }else if (plugins[plugin]["type"] == "socket-pcap"){                
                tableSocketPcap = tableSocketPcap + '<tr>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["name"]+'-'+response.data[plugin]["pid"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["port"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["cert"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["pcap-path"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["pcap-prefix"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[plugin]["bpf"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if (response.data[plugin]["pid"] == "none"){
                            tableSocketPcap = tableSocketPcap + '<i class="fas fa-play" style="color: grey;" onclick="DeployStapServiceMaster( \''+plugin+'\',\'socket-pcap\')"></i> &nbsp';
                        }else if (response.data[plugin]["pid"] != "none"){
                            tableSocketPcap = tableSocketPcap + '<i class="fas fa-stop" style="color: grey;" onclick="StopStapServiceMaster( \''+plugin+'\', \'socket-pcap\')"></i> &nbsp';
                        }                        
                        tableSocketPcap = tableSocketPcap + '<i title="BPF" style="cursor: default;" onclick="loadBPF( \''+response.data[plugin]["bpf"]+'\', \''+plugin+'\', \''+response.data[plugin]["name"]+'\')">BPF</i> &nbsp'+                        
                        '<i class="fas fa-edit" id="modify-stap-'+plugin+'" style="color:grey;" onclick="showModifyStap(\''+plugin+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+plugin+'\', \'socket-pcap\', \''+response.data[plugin]["name"]+'\')" style="color: red;"></i>'+
                    '</td>'+
                '</tr>'+                
                '<tr width="100%" id="edit-row-'+plugin+'" style="display:none;" bgcolor="peachpuff">'+
                    '<td style="word-wrap: break-word;" colspan="6">'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Name: <input class="form-control" id="socket-pcap-name-'+plugin+'" value="'+response.data[plugin]["name"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                'Port: <input class="form-control" id="socket-pcap-port-'+plugin+'" value="'+response.data[plugin]["port"]+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'PCAP-Path: <input class="form-control" id="socket-pcap-pcap-path-'+plugin+'" value="'+response.data[plugin]["pcap-path"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                'PCAP-Prefix: <input class="form-control" id="socket-pcap-pcap-prefix-'+plugin+'" value="'+response.data[plugin]["pcap-prefix"]+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Certificate: <input class="form-control" id="socket-pcap-cert-'+plugin+'" value="'+response.data[plugin]["cert"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                            '</div>'+
                        '</div>'+
                    '</td>'+                    
                    '<td style="word-wrap: break-word;" >'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-seconday" id="modify-stap-cancel-socket-pcap-'+plugin+'" onclick="hideEditStap(\''+plugin+'\')">Cancel</button>'+
                            '</div>'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-primary" id="modify-stap-change-'+plugin+'" onclick="saveStapChanges(\'socket-pcap\', \''+plugin+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';   
            }
            
            document.getElementById('socket-network-table').innerHTML = tableSocketNetwork;
            document.getElementById('socket-pcap-table').innerHTML = tableSocketPcap;
        }
    })
    .catch(function (error) {
        // return false;
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
        jsonDeployService["name"] = document.getElementById('socket-network-name-'+uuid).value;
        jsonDeployService["port"] = document.getElementById('socket-network-port-'+uuid).value;
        jsonDeployService["cert"] = document.getElementById('socket-network-cert-'+uuid).value;
    }else if (type == "socket-pcap"){        
        jsonDeployService["name"] = document.getElementById('socket-pcap-name-'+uuid).value;
        jsonDeployService["port"] = document.getElementById('socket-pcap-port-'+uuid).value;
        jsonDeployService["cert"] = document.getElementById('socket-pcap-cert-'+uuid).value;
        jsonDeployService["pcap-path"] = document.getElementById('socket-pcap-pcap-path-'+uuid).value;
        jsonDeployService["pcap-prefix"] = document.getElementById('socket-pcap-pcap-prefix-'+uuid).value;
    }
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
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
      data: bpfjson
    })
      .then(function (response) {
          loadPlugins();
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
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
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
        newStatus["value"] = document.getElementById(uuid+'-status').value;
    }
    newStatus["param"] = param
    newStatus["uuid"] = uuid;
    var dataJSON = JSON.stringify(newStatus);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
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
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
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
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Master STAP Collector is not available.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else if (response.data != ""){
            collectorMasterStatus.style.color="green";
        }else{
            collectorMasterStatus.style.color="red";
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
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t start Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
        }
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function stopMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/stopMasterCollector';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t stop Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            return true;
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
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t retrieve data from Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            showMasterModalCollector(response);
            return true;
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
    // $('#modal-master').modal('show');
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
            '<p>Insert name:</p>'+
                '<input type="text" class="form-control" id="soft-tap-name"><br>'+
            '<p>Insert port:</p>'+
                '<input type="text" class="form-control" id="soft-tap-port" value="50010"><br>'+
            '<p>Insert certificate:</p>'+
                '<input type="text" class="form-control" id="soft-tap-cert" value="/usr/local/owlh/src/owlhnode/conf/certs/ca.pem"><br>';
            // if (type == "socket-network"){                  
            // }else 
            if (type == "socket-pcap"){
                html = html + '<p>Insert PCAP path:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-pcap-path" value="/usr/local/owlh/pcaps"><br>'+
                '<p>Insert PCAP prefix:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-pcap-prefix" value="remote-"><br>'+
                '<p>Insert BPF:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-bpf"><br>';
            }else if (type == "network-socket"){
                html = html + '<p>Select collector:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-collector" value="192.168.1.100"><br>'+
                '<p>Insert BPF:</p>'+
                    '<input type="text" class="form-control" id="soft-tap-bpf-socket"><br>';
            }
            html = html + '<p>Select an interface:</p>'+
            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<tbody id="socket-network-modal-table">' +
                '</tbody>'+
            '</table>';   
            axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/master/interface')
            .then(function (response) {
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
                document.getElementById('socket-network-modal-table').innerHTML = inner;
            });   
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
    if( type == "socket-network" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "") ||  
    type == "socket-pcap" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value) || document.getElementById('soft-tap-pcap-path').value == "" || document.getElementById('soft-tap-pcap-prefix').value == "" || document.getElementById('soft-tap-bpf').value == "" ) ||  
    type == "network-socket" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value) || document.getElementById('soft-tap-bpf-socket').value == "" || document.getElementById('soft-tap-collector').value == "")){
        if(type == "socket-network"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "") {
                if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){
                    if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){                
                        document.getElementById('soft-tap-name').placeholder = "Please insert a name";
                        document.getElementById('soft-tap-name').required = "true";
                    }
                }
                if (document.getElementById('soft-tap-port').value == ""){
                    document.getElementById('soft-tap-port').placeholder = "Please insert a port";
                    document.getElementById('soft-tap-port').required = "true";
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    document.getElementById('soft-tap-cert').placeholder = "Please insert a certificate";
                    document.getElementById('soft-tap-cert').required = "true";
                }
            }
        }else if(type == "socket-pcap"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value) || document.getElementById('soft-tap-pcap-path').value == "" || document.getElementById('soft-tap-pcap-prefix').value == "" || document.getElementById('soft-tap-bpf').value == "" ){
                if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){
                    if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){                
                        document.getElementById('soft-tap-name').placeholder = "Please insert a name";
                        document.getElementById('soft-tap-name').required = "true";
                    }
                }
                if (document.getElementById('soft-tap-port').value == ""){
                    document.getElementById('soft-tap-port').placeholder = "Please insert a port";
                    document.getElementById('soft-tap-port').required = "true";
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    document.getElementById('soft-tap-cert').placeholder = "Please insert a certificate";
                    document.getElementById('soft-tap-cert').required = "true";
                }
                if (document.getElementById('soft-tap-pcap-path').value == ""){
                    document.getElementById('soft-tap-pcap-path').placeholder = "Please insert a pcap path:";
                    document.getElementById('soft-tap-pcap-path').required = "true";
                }
                if (document.getElementById('soft-tap-pcap-prefix').value == ""){
                    document.getElementById('soft-tap-pcap-prefix').placeholder = "Please insert a pcap prefix:";
                    document.getElementById('soft-tap-pcap-prefix').required = "true";            
                }
                if (document.getElementById('soft-tap-bpf').value == ""){
                    document.getElementById('soft-tap-bpf').placeholder = "Please insert a BPF path:";
                    document.getElementById('soft-tap-bpf').required = "true";
                }
                
            }
        }else if(type == "network-socket"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value) || document.getElementById('soft-tap-bpf-socket').value == "" || document.getElementById('soft-tap-collector').value == ""){
                if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){
                    if (document.getElementById('soft-tap-name').value == "" || /\s/g.test(document.getElementById('soft-tap-name').value)){                
                        document.getElementById('soft-tap-name').placeholder = "Please insert a name";
                        document.getElementById('soft-tap-name').required = "true";
                    }
                }
                if (document.getElementById('soft-tap-port').value == ""){
                    document.getElementById('soft-tap-port').placeholder = "Please insert a port";
                    document.getElementById('soft-tap-port').required = "true";
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    document.getElementById('soft-tap-cert').placeholder = "Please insert a certificate";
                    document.getElementById('soft-tap-cert').required = "true";
                }
                if (document.getElementById('soft-tap-collector').value == ""){
                    document.getElementById('soft-tap-collector').placeholder = "Please insert a collector IP:";
                    document.getElementById('soft-tap-collector').required = "true";
                }else if (document.getElementById('soft-tap-bpf-socket').value == ""){
                    document.getElementById('soft-tap-bpf-socket').placeholder = "Please insert a BPF path:";
                    document.getElementById('soft-tap-bpf-socket').required = "true";
                }
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
        jsonSave["name"] = document.getElementById('soft-tap-name').value;
        jsonSave["type"] = type;
        jsonSave["cert"] = document.getElementById('soft-tap-cert').value;
        jsonSave["port"] = document.getElementById('soft-tap-port').value;
        jsonSave["interface"] = valueSelected;
        if (type == "socket-pcap"){ jsonSave["pcap-path"] = document.getElementById('soft-tap-pcap-path').value; jsonSave["pcap-prefix"] = document.getElementById('soft-tap-pcap-prefix').value; jsonSave["bpf"] = document.getElementById('soft-tap-bpf').value;}
        var dataJSON = JSON.stringify(jsonSave);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: dataJSON
        })
        .then(function (response) {
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> '+type+' service added successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding service: </strong>'+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }
            loadPlugins();
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error adding service: </strong>'+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
    $('#modal-master').modal("hide");
}

function DeployStapServiceMaster(uuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/deployStapServiceMaster';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["type"] = type;

    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
    })
    .catch(function (error) {
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
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
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

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadPlugins();        
        loadTitleJSONdata();
    });
  }
  loadJSONdata();