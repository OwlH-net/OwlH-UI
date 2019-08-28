function loadPlugins(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    content = document.getElementById('master-table-plugins');
    content.innerHTML =
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0">Master configuration</h6>'+
        '<br>'+
        '<p><img src="img/favicon.ico" height="25"><span style="font-size: 15px; color: Grey;">&nbsp; Edit master configuration | </span>'+
        '  <span style="font-size: 15px; color: grey;">                                   ' +
        '    <i class="fas fa-info-circle" title="Edit Master configuration file" onclick="showMasterFile(\'main\')"></i>  ' +
        '  </span></p> '+
        '  <span id="owlhMasterService" style="display:none; font-size: 15px; cursor: default;" class="col-md-2 badge bg-warning align-text-bottom text-white" onclick="DeployServiceMaster()">Install service</span>'+
    '</div>'+

    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0">Plugins</h6>'+
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

    '<div class="my-3 p-3 bg-white rounded shadow-sm" id="flow-form-master">'+
    '<h6 class="border-bottom border-gray pb-2 mb-0">Flow</h6>'+
    '<br>'+
        '<table style=" width: 100%;height: 100%;">'+
        '<thead>'+
        '<tr>                                                         ' +
            '<th>Collect from</th>                                                  ' +
            '<th>Analysis</th>                                          ' +
            '<th>Transport</th>                                ' +
            '<th>Info</th>                                ' +
        '</tr>                                                        ' +
        '</thead>                                                     ' +
        '<tbody>                                                      ' +
            '<tr>'+
            '<td style="word-wrap: break-word;">'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'network\')" id="collect-network" name="collect-type" value="network" class="custom-control-input">'+
                    // '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" data-toggle="modal" data-target="#modal-master" onclick="loadNetworkValues()" style="color:grey;" title="Interface information"></i>'+
                    '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" onclick="loadNetworkValues()" style="color:grey;" title="Interface information"></i>'+
                '</div>'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'socket-pcap\')" id="collect-socket-pcap" name="collect-type" value="socket-pcap" class="custom-control-input">'+
                    '<label class="custom-control-label" for="collect-socket-pcap">Socket -> PCAP</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
                '</div>'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'socket-network\')" id="collect-socket-network" name="collect-type" value="socket-network" class="custom-control-input">'+
                    '<label class="custom-control-label" for="collect-socket-network">Socket -> Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
                '</div>'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'collect\', \'value\', \'pcap-network\')" id="collect-pcap-network" name="collect-type" value="pcap-network" class="custom-control-input">'+
                    '<label class="custom-control-label" for="collect-pcap-network">PCAP -> Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Interface information"></i>'+
                '</div>'+
            '</td>'+
            '<td style="word-wrap: break-word;">'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'analysis\', \'value\', \'network\')" id="analysis-network" name="analysis-type" value="network" class="custom-control-input">'+
                    '<label class="custom-control-label" for="analysis-network">Network</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Analysis information"></i>'+
                '</div>'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'analysis\', \'value\', \'pcap\')" id="analysis-pcap" name="analysis-type" value="pcap" class="custom-control-input">'+
                    '<label class="custom-control-label" for="analysis-pcap">PCAP</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Analysis information"></i>'+
                '</div>'+
            '</td>'+
            '<td style="word-wrap: break-word;">'+
                '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowStatus(\'transport\', \'value\', \'wazuh\')" id="transport-wazuh" name="transport-type" value="wazuh" class="custom-control-input">'+
                    '<label class="custom-control-label" for="transport-wazuh">Wazuh</label> <i class="fas fa-info-circle" onclick="showMasterFile(\'main\')" style="color:grey;" title="Transport information"></i>'+
                '</div>'+                    
            '</td>'+
            '<td style="word-wrap: break-word;"></td>'+
            '</tr>'+
        '</tbody>' +
            
        '</table>'+
    '</div>'+


    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0">Deploy</h6>'+
        '<br>'+
        '<p><i style="color: Dodgerblue;" class="fas fa-search"></i> <span style="font-size: 15px; color: Grey;">&nbsp; Moloch &nbsp; | '+
        '  <span style="font-size: 15px; color: grey;">                                   ' +
        '    <i class="fas fa-play-circle" title="Deploy Moloch" onclick="deployMaster(\'moloch\')"></i>                         ' +
        '  </span></p> '+
        '<p><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> <span style="font-size: 15px; color: Grey;">&nbsp; OwlH interface &nbsp; | '+
        '  <span style="font-size: 15px; color: grey;">                                   ' +
        '    <i class="fas fa-play-circle" title="Deploy interface" onclick="deployMaster(\'interface\')"></i>                         ' +
        '  </span></p> '+
        '<p><i style="color: Dodgerblue;" class="fas fa-traffic-light"></i> <span style="font-size: 15px; color: Grey;">&nbsp; OwlH firewall &nbsp; | '+
        '  <span style="font-size: 15px; color: grey;">                                   ' +
        '    <i class="fas fa-play-circle" title="Deploy firewall" onclick="deployMaster(\'firewall\')"></i>                         ' +
        '  </span></p> '+
    '</div>';

    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector')
    .then(function (response) {
        console.log(response);
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
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> '+value+' deployed successfully.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
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
        $('#modal-master').modal('dismiss');
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
            }
        }
    })
    .catch(function (error) {
        // return false;
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