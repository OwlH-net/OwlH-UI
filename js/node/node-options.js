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

function loadPlugins(){
    var urlWeb = new URL(window.location.href);
    var name = urlWeb.searchParams.get("node");
    var uuid = urlWeb.searchParams.get("uuid");
    document.getElementById('node-config-title').innerHTML = name;

    var html =
    //SURICATA & ZEEK
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'network-ids\',\''+uuid+'\')"><b>Network IDS</b> <i class="fas fa-sort-down" id="network-ids-form-icon-'+uuid+'"></i></h6>'+
        '<span id="network-ids-form-'+uuid+'" style="display:block"><br>'+
            //suricata
            '<p><img src="img/suricata.png" alt="" width="30"> &nbsp'+           
                '<span id="suricata-current-status" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> | &nbsp<i class="fas fa-stop-circle" style="color:grey; cursor:pointer;" id="main-suricata-status-btn" onclick="ChangeMainServiceStatus(\''+uuid+'\', \'status\', \'suricata\')"></i>'+
                '<b>&nbsp | <span style="cursor: pointer;" title="Ruleset Management" class="badge bg-primary align-text-bottom text-white" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\', \'main\', \'-\')">Change ruleset</span> &nbsp  Current ruleset: </b><i id="current-ruleset-options"></i>'+

                '</span>' +
                '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddServiceModal(\''+uuid+'\', \'suricata\')">Add Suricata</button>'+
            '</p>' +
                '<div>'+
                    '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                        '<thead>'+
                            '<th width="16%">Description</th>'+
                            '<th width="16%">Status</th>'+
                            '<th width="16%">BPF</th>'+
                            '<th width="16%">Ruleset</th>'+
                            '<th width="16%">Interface</th>'+
                            '<th width="16%">Actions</th>'+
                        '</thead>'+
                        '<tbody id="suricata-table-services">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br><br>'+
            // //zeek
            '<div><img  src="img/bro.png" alt="" width="30"> &nbsp'+
                '<span id="zeek-current-status" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |&nbsp '+
                '<i class="fas fa-stop-circle" style="color:grey; cursor:pointer;" id="main-zeek-status-btn" onclick="ChangeMainServiceStatus(\''+uuid+'\', \'status\', \'zeek\')"></i> &nbsp<b>|</b> &nbsp'+
                '<span id="zeek-mode-standalone" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;">Standalon</span> &nbsp <span id="zeek-mode-cluster" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;">Cluster</span>'+
            '</div>'+
                //Zeek standalone
            '<div id="standalone-zeek-table" style="display:block;">'+
                '<button id="add-zeek-button" class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddServiceModal(\''+uuid+'\', \'zeek\')">Add Zeek</button>'+
                '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                    '<thead id="">'+
                        '<th>Description</th>'+
                        '<th>Status</th>'+
                        '<th>Interface</th>'+
                        '<th>Actions</th>'+
                    '</thead>'+
                    '<tbody id="zeek-table-services">'+
                    '</tbody>'+
                '</table>'+
            '</div>'+
            //zeek cluster
            '<div id="cluster-zeek-table" class="cluster" style="display:block;"><br>'+
                '<button id="sync-zeek-cluster" class="btn btn-success float-right" style="font-size: 15px;" onclick="ModalSyncCluster(\''+uuid+'\')">Sync cluster</button>'+
                '<div>'+
                    '<div><b style="display:inline;">Manager</b></div>'+
                    '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                        '<thead>'+
                            '<th>Host</th>'+
                            '<th>Actions</th>'+
                        '</thead>'+
                        '<tbody id="zeek-table-manager">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br>'+
                '<div style="display:inline;">'+
                    '<div><b style="display:inline;">Logger</b></div>'+
                    '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                        '<thead>'+
                            '<th>Host</th>'+
                            '<th>Actions</th>'+
                        '</thead>'+
                        '<tbody id="zeek-table-logger">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br>'+
                '<div>'+
                    '<div><b style="display:inline;">Proxy</b><button class="btn btn-primary float-right" onclick="ModalAddClusterValue(\''+uuid+'\', \'proxy\')">Add worker</button></div>'+
                    '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                        '<thead>'+
                            '<th>Name</th>'+
                            '<th>Host</th>'+
                            '<th>Actions</th>'+
                        '</thead>'+
                        '<tbody id="zeek-table-proxy">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br>'+
                '<div>'+
                    '<div><b style="display:inline;">Worker</b><button class="btn btn-primary float-right" onclick="ModalAddClusterValue(\''+uuid+'\', \'worker\')">Add proxy</button></div>'+
                    '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                        '<thead>'+
                            '<th>Name</th>'+
                            '<th>Host</th>'+
                            '<th>Interface</th>'+
                            '<th>Actions</th>'+
                        '</thead>'+
                        '<tbody id="zeek-table-worker">'+
                        '</tbody>'+
                    '</table>'+
                '</div><br>'+
            '</div>'+
        '</span>'+
    '</div>'+
    
    //wazuh
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'transport\',\''+uuid+'\')"><b>Transport</b> <i class="fas fa-sort-down" id="transport-form-icon-'+uuid+'"></i></h6>'+
        '<span id="transport-form-'+uuid+'" style="display:block"><br>'+
            '<p><img src="img/wazuh.png" alt="" width="30"> '+
            '<span id="'+uuid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> | ' +
            '<span style="font-size: 15px; color: grey;">                                  ' +
                '<i class="fas fa-stop-circle" style="cursor: pointer;" id="'+uuid+'-wazuh-icon"></i> &nbsp' +
                '<i class="fas fa-sync-alt" style="cursor: pointer;" title="Reload Wazuh information" id="reload-wazuh" onclick="ReloadFilesData(\''+uuid+'\')"></i>' +
                ' <a style="color:black;">|</a> <span style="cursor: pointer;" title="Edit main Wazuh config file" class="badge bg-primary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\',\'none\',\'/var/ossec/etc/ossec.conf\')">Edit main config file</span>'+
                '<button class="btn btn-primary float-right" style="font-size: 15px;" id="show-wazuh-add-file">Add file</button>'+ 
            '</span></p>'+
            '<div>'+
                '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<th width="70%">Path</th>'+
                        '<th width="10%">Status</th>'+
                        '<th width="20%">Actions</th>'+
                    '</thead>'+
                    '<tbody id="wazuh-table">'+
                        '<tr id="wazuh-insert" style="display:none" bgcolor="palegreen">'+
                            '<td colspan="2">'+
                                '<div class="col">'+
                                    'Path: <input class="form-control" id="wazuh-add-line">'+
                                '</div>'+
                            '</td>'+
                            '<td>'+
                                '<div class="col">'+
                                    '<button type="button" class="btn btn-primary float-right" style="font-size: 15px;" onclick="addNewWazuhPath(\''+uuid+'\')">Save</button> &nbsp'+
                                    '<button type="button" class="btn btn-danger float-right" style="font-size: 15px;" id="wazuh-close-button" onclick="hideInputAreaValue(\'wazuh-insert\')">Cancel</button>'+ //onoclick="hideInputAreaValue(\'wazuh-insert\')"
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table>'+
            '</div>'+
        '</span>'+
    '</div>'+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'plugins\',\''+uuid+'\')"><b>Software TAP</b> <i class="fas fa-sort-down" id="plugins-form-icon-'+uuid+'"></i></h6>'+
        '<span id="plugins-form-'+uuid+'" style="display:block"><br>'+
            //socket->Network
            '<p> <i class="fas fa-plug fa-lg"></i> Traffic from socket to network interface '+
                '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddSTAPModal(\''+uuid+'\', \'socket-network\')">Add Socket->Network</button>'+
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
                '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddSTAPModal(\''+uuid+'\', \'socket-pcap\')">Add Socket->PCAP</button>'+
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
            //Network->Socket
            '<p> <i class="fas fa-plug fa-lg"></i> Traffic from network interface to socket'+
                '<button class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddSTAPModal(\''+uuid+'\', \'network-socket\')">Add Network->Socket</button>'+
            '</p>' +
            '<div>'+
                '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<th>Description</th>'+
                        '<th>Port</th>'+
                        '<th>Certificate</th>'+
                        '<th>Interface</th>'+
                        '<th>Collector</th>'+
                        '<th>BPF</th>'+
                        '<th>Actions</th>'+
                    '</thead>'+
                    '<tbody id="network-socket-table">'+
                    '</tbody>'+
                '</table>'+
            '</div><br><br>'+
        '</span>'+
    '</div>'+
    //analyzer
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'analyzer\',\''+uuid+'\')"><b>Analyzer</b> <i class="fas fa-sort-down" id="analyzer-form-icon-'+uuid+'"></i></h6>'+
        '<span id="analyzer-form-'+uuid+'" style="display:block"><br>'+
            '<table width="100%" tyle="table-layout: fixed">'+
                '<tr>'+
                    '<td width="25%"><img src="img/favicon.ico" height="25"> Analyzer</th>'+
                    '<td width="25%">Status: <span class="fas fa-play-circle" id="analyzer-status-'+uuid+'" title="Change analyzer status">[N/A]</span></td>'+
                    '<td width="25%">Start/Stop: <i style="color: grey; padding-left:3px; cursor: pointer;" id="analyzer-status-btn-'+uuid+'" onclick="ChangeAnalyzerStatus(\''+uuid+'\')"></i></td>'+
                    '<td width="25%">Edit: <i class="fas fa-info-circle" style="color: grey; cursor: pointer;" title="Edit analyzer" onclick="editAnalyzer(\''+uuid+'\', \'analyzer\', \''+name+'\')"></i></td>'+
                '</tr>'+
                '<tr>'+
                    '<table class="table table-hover" width="100%" style="table-layout: fixed">'+
                        '<thead>'+
                            '<th width="60%">File</th>'+
                            '<th width="25%">Status</th>'+
                            '<th width="15%">Actions</th>'+
                        '</thead>'+
                        '<tbody id="analyzer-file-content">'+
                        '</tbody>'+
                    '</table>'+
                '</tr>'+

            '</table>'+
        '</span>'+
    '</div>'+
    //knownports
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'knownports\',\''+uuid+'\')"><b>Knownports</b> <i class="fas fa-sort-down" id="knownports-form-icon-'+uuid+'"></i></h6>'+
        '<span id="knownports-form-'+uuid+'" style="display:block"><br>'+
            '<table width="100%" tyle="table-layout: fixed">'+
                '<tr>'+
                    '<td width="25%"><img src="img/favicon.ico" height="25"> Knownports</th>'+
                    '<td width="25%">Status: <i id="ports-status-'+uuid+'"">[N/A]</i></td>'+
                    '<td width="25%">Start/Stop: <i style="color: grey; padding-left:3px; cursor: pointer;" id="ports-status-btn-'+uuid+'" onclick="ChangeStatus(\''+uuid+'\')"></i></td>'+
                    '<td width="25%">Mode: <i style="cursor: default; color: grey; cursor: pointer;" title="port mode" id="ports-mode-'+uuid+'" onclick="ChangeMode(\''+uuid+'\')">[mode error]</i></td>'+
                    '<td width="25%">Ports: <i style="cursor: default; color: grey; cursor: pointer;" title="Show ports" id="show-ports-plugin" onclick="showPorts(\''+uuid+'\')">[Ports]</i></td>'+
                '</tr>'+
            '</table>'+
        '</span>'+
    '</div>';
    // //traffic flow
    // '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
    //     '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'flow\',\''+uuid+'\')"><b>Traffic flow</b> <i class="fas fa-sort-down" id="flow-form-icon-'+uuid+'"></i></h6>'+
    //     '<span id="flow-form-'+uuid+'" style="display:block"><br>'+
    //         '<table style="width:100%" style="table-layout: fixed">'+
    //         '<thead>'+
    //         '<tr>                                                         ' +
    //             '<th width="25%">Collect from</th>                                                  ' +
    //             '<th width="25%">Analysis</th>                                          ' +
    //             '<th width="25%">Transport</th>                                ' +
    //             '<th width="25%">Info</th>                                ' +
    //         '</tr>                                                        ' +
    //         '</thead>                                                     ' +
    //         '<tbody>                                                      ' +
    //             '<tr>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'network\', \''+uuid+'\')" id="collect-network" name="network" value="network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" onclick="loadNetworkValues(\''+uuid+'\')" style="color:grey;" title="Collector information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'socket-pcap\', \''+uuid+'\')" id="collect-socket-pcap" name="network" value="socket-pcap" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-socket-pcap">Socket -> PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'socket-network\', \''+uuid+'\')" id="collect-socket-network" name="network" value="socket-network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-socket-network">Socket -> Network</label> <i class="fas fa-info-circle" onclick="SocketToNetworkList(\''+uuid+'\')" style="color:grey;" title="Socket to Network information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'pcap-network\', \''+uuid+'\')" id="collect-pcap-network" name="network" value="pcap-network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="collect-pcap-network">PCAP -> Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;"title="Collector information"></i>'+
    //                 '</div>'+
    //             '</td>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'network\', \''+uuid+'\')" id="analysis-network" name="analysis" value="network" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="analysis-network">Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;"title="Collector information"></i>'+
    //                 '</div>'+
    //                 '<div class="custom-control custom-radio">'+
    //                 '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'pcap\', \''+uuid+'\')" id="analysis-pcap" name="analysis" value="pcap" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="analysis-pcap">PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
    //                 '</div>'+
    //             '</td>'+
    //             '<td style="word-wrap: break-word;">'+
    //                 '<div class="custom-control custom-radio">'+
    //                     '<input type="radio" onclick="changeDataflowValues(\'transport\', \'value\', \'wazuh\', \''+uuid+'\')" id="transport-wazuh" name="transport" value="wazuh" class="custom-control-input">'+
    //                     '<label class="custom-control-label" for="transport-wazuh">Wazuh</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
    //                 '</div>'+
    //             '</td>'+
    //             '<td style="word-wrap: break-word;"></td>'+
    //             '</tr>'+
    //         '</tbody>' +

    //         '</table>'+
    //     '</span>'+
    // '</div>'+
    // //deploy
    // '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
    //     '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'deploy\',\''+uuid+'\')"><b>Deploy</b> <i class="fas fa-sort-down" id="deploy-form-icon-'+uuid+'"></i></h6>'+
    //     '<span id="deploy-form-'+uuid+'" style="display:block"><br>'+
    //         '<span style="font-size: 15px; color: Dodgerblue;">'+
    //             '<p id="deploy-node-suricata"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Suricata &nbsp; | '+
    //             '    <i class="fas fa-play-circle" title="Deploy Suricata" id="suricata-deploy-button" onclick="deployNode(\'suricata\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
    //             '<p id="deploy-node-zeek"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Zeek &nbsp; | '+
    //             '    <i class="fas fa-play-circle" title="Deploy Zeek" onclick="deployNode(\'zeek\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
    //             '<p id="deploy-node-moloch"><i style="color: Dodgerblue;" class="fas fa-search"></i> &nbsp; Moloch &nbsp; | '+
    //             '    <i class="fas fa-play-circle" title="Deploy Moloch" onclick="deployNode(\'moloch\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
    //             '<p id="deploy-node-interface"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; OwlH interface &nbsp; | '+
    //             '    <i class="fas fa-play-circle" title="Deploy OwlH interface" onclick="deployNode(\'interface\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
    //             '<p id="deploy-node-firewall"><i style="color: Dodgerblue;" class="fas fa-traffic-light"></i> &nbsp; OwlH firewall &nbsp; | '+
    //             '    <i class="fas fa-play-circle" title="Deploy OwlH firewall" onclick="deployNode(\'firewall\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
    //         '</span>'+
    //     '</span>' +
    // '</div>';
    document.getElementById('master-table-plugins').innerHTML = html;

    PingWazuh(uuid);
    PingWazuhFiles(uuid);
    PingAnalyzer(uuid);
    // PingPorts(uuid);
    GetMainconfData(uuid);
    // PingDataflow(uuid);
    PingPluginsNode(uuid);
    PingCluster(uuid);
    getCurrentRulesetName(uuid);

    $('#show-collector-info').click(function(){ showCollector(uuid);});
    $('#show-ports-plugin').click(function(){ showPorts(uuid);});
    // $('#reload-analyzer').click(function(){ ReloadFilesData(uuid);});
    // $('#reload-wazuh').click(function(){ ReloadFilesData(uuid);});
    $('#show-wazuh-add-file').click(function(){ $('#wazuh-insert').show(); });
}

function hideInputAreaValue(key){
    document.getElementById(key).style.display = "none";
}

function addNewWazuhPath(uuid){      
    if (document.getElementById("wazuh-add-line").value == ""){
        $("#wazuh-add-line").prop('required',true);
        $("#wazuh-add-line").prop('placeholder',"Please, insert a valid path");
    }else{
        $("#wazuh-insert").hide();
        var html = ""
        document.getElementById("wazuh-count-table-value").value++;
        var count = document.getElementById("wazuh-count-table-value").value;
        var contentInput = document.getElementById("wazuh-add-line").value;
        html = html + '<tr>'+
            '<td id="'+count+'-wazuh-files">'+contentInput+'</td>'+
            '<td><span class="badge badge-pill bg-success align-text-bottom text-white">ON</span></td>'+
            '<td style="color:grey;">'+
                '<i class="fas fa-play-circle" style="cursor: pointer;"></i> &nbsp'+
                '<i class="fas fa-trash-alt" style="color:red;cursor: pointer;" onclick="ModalDeleteWazuhFile(\''+uuid+'\', \''+contentInput+'\', \''+count+'\')"></i>'+
            '</td>'+
        '<tr>';
        document.getElementById('wazuh-table').innerHTML = document.getElementById('wazuh-table').innerHTML + html;  

        addWazuhFile(uuid);
    }
}

function ChangeZeekMode(uuid, mode){
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/zeek/changeZeekMode';

    var jsonService = {}
    jsonService["uuid"] = uuid;
    jsonService["mode"] = mode;
    var dataJSON = JSON.stringify(jsonService);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change Zeek mode error: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            loadPlugins();
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change Zeek mode error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
    });
}

function ChangeMainServiceStatus(uuid, param, service){
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var currentStatus = document.getElementById(service+'-current-status').innerHTML;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/mainconfStatus';

    var jsonService = {}
    jsonService["uuid"] = uuid;
    jsonService["service"] = service;
    jsonService["param"] = param;
    if (currentStatus == "Enabled"){
        jsonService["status"] = "disabled";
    }else if (currentStatus == "Disabled"){
        jsonService["status"] = "enabled";
    }
    var dataJSON = JSON.stringify(jsonService);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            loadPlugins();
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change main service status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function getCurrentRulesetName(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        axios.get('https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/name/' + response.data, {
        })
        .then(function (response2) {
            if(response2.data.ack){                
                document.getElementById('current-ruleset-options').innerHTML = "No ruleset selected...";
                document.getElementById('current-ruleset-options').style.color = "red";
                document.getElementById('current-ruleset').innerHTML = "No ruleset selected...";
                document.getElementById('current-ruleset').style.color = "red";
            }else{
                document.getElementById('current-ruleset-options').innerHTML = response2.data;
                // document.getElementById('current-ruleset').innerHTML = response2.data;
                axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/PingPluginsNode/'+uuid)
                .then(function (response) {
                    for (line in response.data){
                        if (response.data[line]["type"] == "suricata"){
                            document.getElementById('suricata-ruleset-'+line).innerHTML = response2.data;                            
                            document.getElementById('suricata-ruleset-edit-'+line).value = response2.data;                            

                        }
                    }
                })
                .catch(function (error) {
                });
            }
        })
        .catch(function (error) {
        });
    })
    .catch(function (error) {

    });
}

function GetMainconfData(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/getMainconfData/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        for (service in response.data){
            if(service == "suricata"){
                if(response.data[service]["status"] == "disabled"){
                    document.getElementById('suricata-current-status').className = 'badge badge-pill bg-danger align-text-bottom text-white';
                    document.getElementById('suricata-current-status').innerHTML = 'Disabled';
                    document.getElementById('main-suricata-status-btn').className = 'fas fa-play-circle';
                }else if(response.data[service]["status"] == "enabled"){
                    document.getElementById('suricata-current-status').className = 'badge badge-pill bg-success align-text-bottom text-white';
                    document.getElementById('main-suricata-status-btn').className = 'fas fa-stop-circle';
                    document.getElementById('suricata-current-status').innerHTML = 'Enabled';
                }
            }else if(service == "zeek"){
                if(response.data[service]["status"] == "disabled"){
                    document.getElementById('main-zeek-status-btn').className = 'fas fa-play-circle';
                    document.getElementById('zeek-current-status').className = 'badge badge-pill bg-danger align-text-bottom text-white';
                    document.getElementById('zeek-current-status').innerHTML = 'Disabled';
                }else if(response.data[service]["status"] == "enabled"){
                    document.getElementById('main-zeek-status-btn').className = 'fas fa-stop-circle';
                    document.getElementById('zeek-current-status').className = 'badge badge-pill bg-success align-text-bottom text-white';
                    document.getElementById('zeek-current-status').innerHTML = 'Enabled';
                }
                if(response.data[service]["mode"] == "standalone"){
                    document.getElementById('zeek-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white standalone';
                    document.getElementById('zeek-mode-standalone').disabled = true; 
                    document.getElementById('zeek-mode-cluster').onclick = function(){ChangeZeekMode(uuid, "cluster");}; 
                    document.getElementById('standalone-zeek-table').style.display = "block"; 
                    document.getElementById('cluster-zeek-table').style.display = "none"; 
                }else if(response.data[service]["mode"] == "cluster"){
                    document.getElementById('zeek-mode-cluster').className = 'badge bg-secondary align-text-bottom text-white cluster';
                    document.getElementById('zeek-mode-cluster').disabled = true; 
                    document.getElementById('zeek-mode-standalone').onclick = function(){ChangeZeekMode(uuid, "standalone");}; 
                    document.getElementById('standalone-zeek-table').style.display = "none";
                    document.getElementById('cluster-zeek-table').style.display = "block";
                }
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get main conf data'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function ModalAddClusterValue(uuid, type){
    var html = '<div class="modal-dialog">'+
      '<div class="modal-content">'+
  
        '<div class="modal-header">'+
          '<h4 class="modal-title">Add '+type+'</h4>'+
          '<button type="button" class="close" id="add-cluster-modal-cross">&times;</button>'+
        '</div>'+
  
        '<div class="modal-body">'+
          '<p>Insert the host:</p>'+
          '<input type="text" class="form-control" id="new-cluster-host" value="" required><br>';
          if (type == "worker"){
            html = html + '<p>Insert the interface:</p>'+
              '<input type="text" class="form-control" id="new-cluster-interface" value="" required>';
          }else{
            html = html + '<div id="new-cluster-interface"></div>';
          }
          html = html + '</div>'+
  
        '<div class="modal-footer" id="sync-node-footer-btn">'+
          '<button type="button" class="btn btn-secondary" id="add-cluster-modal-close">Cancel</button>'+
          '<button type="button" class="btn btn-primary" id="add-cluster-modal">Add</button>'+
        '</div>'+
  
      '</div>'+
    '</div>';
    
    document.getElementById('modal-window').innerHTML = html;
    $('#modal-window').modal("show");
    $('#add-cluster-modal').click(function(){ AddClusterValue(uuid, type, document.getElementById('new-cluster-host').value, document.getElementById('new-cluster-interface').value); });
    $('#add-cluster-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#add-cluster-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function ModalSyncCluster(uuid){
    var html = '<div class="modal-dialog">'+
    '<div class="modal-content">'+

      '<div class="modal-header">'+
        '<h4 class="modal-title">Synchronize Zeek cluster</h4>'+
        '<button type="button" class="close" id="sync-cluster-modal-cross">&times;</button>'+
      '</div>'+

      '<div class="modal-body">'+
        '<p>Do you want to synchronize Zeek cluster?</p>'+
      '</div>'+

      '<div class="modal-footer" id="sync-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" id="sync-cluster-modal-close">Cancel</button>'+
        '<button type="button" class="btn btn-primary" id="sync-cluster-modal">Sync</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  
  document.getElementById('modal-window').innerHTML = html;
  $('#modal-window').modal("show");
  $('#sync-cluster-modal').click(function(){ SyncCluster(uuid); });
  $('#sync-cluster-modal-close').click(function(){ $('#modal-window').modal("hide");});
  $('#sync-cluster-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function SyncCluster(uuid){
    $('#modal-window').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/zeek/syncCluster';

    var jsonCluster = {}
    jsonCluster["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonCluster);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Delete cluster value: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Cluster Synchronize successfully.'+
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
            '<strong>Error!</strong> Delete cluster value: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function AddClusterValue(uuid, type, host, interface){
    if (host == "" || (type == "worker" && interface == "")){
        document.getElementById('new-cluster-host').placeholder = "Please, insert a valid host";
        document.getElementById('new-cluster-host').required = "true";
        if (type == "worker"){
            document.getElementById('new-cluster-interface').placeholder = "Please, insert a valid interface";
            document.getElementById('new-cluster-interface').required = "true";
        }
    }else{
        $('#modal-window').modal("hide");
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/addClusterValue';
    
        var jsonCluster = {}
        jsonCluster["uuid"] = uuid;
        jsonCluster["type"] = type;
        jsonCluster["host"] = host;
        if(type=="worker"){ jsonCluster["interface"] = interface;}
        var dataJSON = JSON.stringify(jsonCluster);
        axios({
            method: 'post',
            url: nodeurl,
            timeout: 30000,
            data: dataJSON
        })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Add cluster value: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                loadPlugins();
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Add cluster value: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}

function PingCluster(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingCluster/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Ping Zeek cluster: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            for(elem in response.data){
                if(elem == "logger"){
                    var content = '<tr><td>'+response.data[elem]["host"]+'</td>'+
                    '<td><i class="fas fa-edit" style="color:grey; cursor:pointer" onclick="ModalEditClusterValue(\''+uuid+'\', \''+elem+'\', \'logger\')"></i></td>'+
                    '</tr>';
                    document.getElementById('zeek-table-logger').innerHTML = content;
                }else if(elem == "manager"){
                    var content = '<tr><td>'+response.data[elem]["host"]+'</td><td><i class="fas fa-edit" style="color:grey; cursor:pointer" onclick="ModalEditClusterValue(\''+uuid+'\', \''+elem+'\', \'manager\')"></i></td></tr>';                   
                    document.getElementById('zeek-table-manager').innerHTML = content;
                }else if(elem.includes("proxy")){
                    document.getElementById('zeek-table-proxy').innerHTML =  document.getElementById('zeek-table-proxy').innerHTML + 
                    '<tr><td>'+elem+'</td><td>'+response.data[elem]["host"]+'</td>'+
                    '<td><i class="fas fa-edit" style="color:grey; cursor:pointer" onclick="ModalEditClusterValue(\''+uuid+'\', \''+elem+'\', \'proxy\')"></i> &nbsp <i class="fas fa-trash-alt" style="color:red; cursor:pointer" onclick="ModalDeleteClusterValue(\''+uuid+'\', \''+elem+'\')"></i></td>'+
                    '</tr>';
                }else if(elem.includes("worker")){
                    document.getElementById('zeek-table-worker').innerHTML = document.getElementById('zeek-table-worker').innerHTML + 
                        '<tr><td>'+elem+'</td><td>'+response.data[elem]["host"]+'</td><td>'+response.data[elem]["interface"]+'</td>'+
                        '<td><i class="fas fa-edit" style="color:grey; cursor:pointer;" onclick="ModalEditClusterValue(\''+uuid+'\', \''+elem+'\', \'worker\')"></i> &nbsp <i class="fas fa-trash-alt" style="color:red; cursor:pointer" onclick="ModalDeleteClusterValue(\''+uuid+'\', \''+elem+'\')"></i></td>'+
                    '</tr>';
                }            
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Ping Zeek cluster: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });  
}

function ModalDeleteClusterValue(uuid, type){
    var html = '<div class="modal-dialog">'+
        '<div class="modal-content">'+
            '<div class="modal-header">'+
                '<h4 class="modal-title">Delete cluster element</h4>'+
                '<button type="button" class="close" id="delete-cluster-modal-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body">'+
                '<p>Do you want to delete <b>'+type+'</b> Zeek element?</p>'+
            '</div>'+

            '<div class="modal-footer" id="sync-node-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="delete-cluster-modal-close">Cancel</button>'+
                '<button type="button" class="btn btn-danger" id="delete-cluster-modal">Delete</button>'+
            '</div>'+
        '</div>'+
    '</div>';
  
    document.getElementById('modal-window').innerHTML = html;
    $('#modal-window').modal("show");
    $('#delete-cluster-modal').click(function(){ DeleteClusterValue(uuid, type); });
    $('#delete-cluster-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#delete-cluster-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function ModalEditClusterValue(uuid, type, cluster){
    var html = '<div class="modal-dialog">'+
        '<div class="modal-content">'+

        '<div class="modal-header">'+
            '<h4 class="modal-title">Edit '+type+'</h4>'+
            '<button type="button" class="close" id="edit-cluster-modal-cross">&times;</button>'+
        '</div>'+

        '<div class="modal-body">'+
            '<p>Insert the host:</p>'+
            '<input type="text" class="form-control" id="edit-cluster-host" value="" required><br>';
            if (type.includes("worker")){
            html = html + '<p>Insert the interface:</p>'+
                '<input type="text" class="form-control" id="edit-cluster-interface" value="" required>';
            }else{
            html = html + '<div id="edit-cluster-interface"></div>';
            }
            html = html + '</div>'+

        '<div class="modal-footer" id="sync-node-footer-btn">'+
            '<button type="button" class="btn btn-secondary" id="edit-cluster-modal-close">Cancel</button>'+
            '<button type="button" class="btn btn-primary" id="edit-cluster-modal">Edit</button>'+
        '</div>'+

        '</div>'+
    '</div>';
  
    document.getElementById('modal-window').innerHTML = html;
    $('#modal-window').modal("show");
    $('#edit-cluster-modal').click(function(){ EditClusterValue(uuid, type, document.getElementById('edit-cluster-host').value, document.getElementById('edit-cluster-interface').value, cluster); });
    $('#edit-cluster-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#edit-cluster-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function EditClusterValue(uuid, type, host, interface, cluster){
    $('#modal-window').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/zeek/editClusterValue';

    var jsonCluster = {}
    jsonCluster["uuid"] = uuid;
    jsonCluster["cluster"] = cluster;
    jsonCluster["type"] = type;
    jsonCluster["host"] = host;
    jsonCluster["interface"] = interface;
    var dataJSON = JSON.stringify(jsonCluster);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Edit cluster value: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Edit cluster value: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function DeleteClusterValue(uuid, type){
    $('#modal-window').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/zeek/deleteClusterValue';

    var jsonCluster = {}
    jsonCluster["uuid"] = uuid;
    jsonCluster["type"] = type;
    var dataJSON = JSON.stringify(jsonCluster);
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Delete cluster value: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete cluster value: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function PingDataflow(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('collect-'+response.data["collect"]["value"]).checked = "true";
        document.getElementById('analysis-'+response.data["analysis"]["value"]).checked = "true";
        document.getElementById('transport-'+response.data["transport"]["value"]).checked = "true";
    })
    .catch(function (error) {
    });
}

function loadFilesURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/files.html?uuid='+uuid+'&node='+nodeName;
}

function loadEditURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+nodeName+'&node='+nodeName;
}

function editAnalyzer(uuid, file, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
}

function ChangeAnalyzerStatus(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer';

    if(document.getElementById('analyzer-status-'+uuid).innerHTML == "ON"){
        var status ="Disabled";
    }else if(document.getElementById('analyzer-status-'+uuid).innerHTML == "OFF"){
        var status ="Enabled";
    }

    var jsonAnalyzer = {}
    jsonAnalyzer["uuid"] = uuid;
    jsonAnalyzer["status"] = status;
    var dataJSON = JSON.stringify(jsonAnalyzer);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change analyzer status: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong>  Change analyzer status: '+response.data.error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function showActions(action,uuid){
    var addnids = document.getElementById(action+'-form-'+uuid);
    var icon = document.getElementById(action+'-form-icon-'+uuid);
    if (addnids.style.display == "none") {
        addnids.style.display = "block";
        icon.classList.add("fa-sort-up");
        icon.classList.remove("fa-sort-down");
    } else {
        addnids.style.display = "none";
        icon.classList.add("fa-sort-down");
        icon.classList.remove("fa-sort-up");
    }
}

function deployNode(value,uuid,nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/deployNode';
    var jsonDeploy = {}
    jsonDeploy["value"] = value;
    jsonDeploy["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeploy);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Deploy node: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Deploy node: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

//Stop suricata system
function StopSuricata(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopSuricata/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop Suricata: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Suricata: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });

}

function AddServiceModal(uuid, type){
  var modalWindow = document.getElementById('modal-window');
  modalWindow.innerHTML =
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+

      '<div class="modal-header">'+
        '<h4 class="modal-title">Add '+type+' service</h4>'+
        '<button type="button" class="close" id="add-service-modal-cross">&times;</button>'+
      '</div>'+

      '<div class="modal-body">'+
        '<p>Insert a description for the new '+type+' service:</p>'+
        '<input type="text" class="form-control" id="new-service-name" value="" required>'+
      '</div>'+

      '<div class="modal-footer" id="sync-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" id="add-service-modal-close">Cancel</button>'+
        '<button type="button" class="btn btn-primary" id="add-service-modal">Add</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  $('#modal-window').modal("show");
  $('#add-service-modal').click(function(){ AddPluginService(uuid, document.getElementById('new-service-name').value, type); });
  $('#add-service-modal-close').click(function(){ $('#modal-window').modal("hide");});
  $('#add-service-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function AddSTAPModal(uuid, type){
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
            '<input type="text" class="form-control" id="soft-tap-name" value="" required><br>'+
        '<p>Define listening port:</p>'+
            '<input type="text" class="form-control" id="soft-tap-port" value="50010" required><br>'+
        '<p>Insert certificate:</p>'+
            '<input type="text" class="form-control" id="soft-tap-cert" value="/usr/local/owlh/src/owlhnode/conf/certs/ca.pem" required><br>';
        // if (type == "socket-network"){                  
        // }else 
        if (type == "socket-pcap"){
            html = html + '<p>Insert PCAP path:</p>'+
                '<input type="text" class="form-control" id="soft-tap-pcap-path" value="/usr/local/owlh/pcaps" required><br>'+
            '<p>Insert PCAP prefix:</p>'+
                '<input type="text" class="form-control" id="soft-tap-pcap-prefix" value="remote-" required><br>'+
            '<p>Insert BPF:</p>'+
                '<input type="text" class="form-control" id="soft-tap-bpf" value="" required><br>';
        }else if (type == "network-socket"){
            html = html + '<p>Select collector:</p>'+
                '<input type="text" class="form-control" id="soft-tap-collector" value="192.168.1.100" required><br>'+
            '<p>Insert BPF:</p>'+
                '<input type="text" class="form-control" id="soft-tap-bpf-socket" value="" required><br>';
        }
        html = html + '<p>Forward traffic to interface:</p>'+
        '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
            '<tbody id="socket-network-modal-table">' +
            '</tbody>'+
        '</table>';   
        axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid)
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

  

  //   $('#add-stap-modal').click(function(){ $('#modal-window').modal("hide"); saveSoftwareTAP(uuid, type); });
  document.getElementById('modal-window').innerHTML = html;
  
  $('#modal-window').modal("show");
  $('#add-stap-modal').click(function(){ saveSoftwareTAP(uuid, type); });
  $('#add-stap-modal-close').click(function(){ $('#modal-window').modal("hide");});
  $('#add-stap-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function saveSoftwareTAP(uuid, type){  ///\s/g.test(document.getElementById('soft-tap-name').value)
    if( (type == "socket-network" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "")) ||  
    (type == "socket-pcap" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-pcap-path').value == "" || document.getElementById('soft-tap-pcap-prefix').value == "" || document.getElementById('soft-tap-bpf').value == "" )) ||  
    (type == "network-socket" && (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-bpf-socket').value == "" || document.getElementById('soft-tap-collector').value == ""))){
        if(type == "socket-network"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "") {
                if (document.getElementById('soft-tap-name').value == "" ){
                    document.getElementById('soft-tap-name').placeholder = "Please insert a valid name";
                    document.getElementById('soft-tap-name').required = "true";
                    // $("#soft-tap-name").prop('required',true);
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
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-pcap-path').value == "" || document.getElementById('soft-tap-pcap-prefix').value == "" || document.getElementById('soft-tap-bpf').value == "" ){                
                if (document.getElementById('soft-tap-port').value == ""){
                    document.getElementById('soft-tap-port').placeholder = "Please insert a port";
                    document.getElementById('soft-tap-port').required = "true";
                }
                if (document.getElementById('soft-tap-name').value == ""){                
                    document.getElementById('soft-tap-name').placeholder = "Please insert a name";
                    document.getElementById('soft-tap-name').required = "true";
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    document.getElementById('soft-tap-cert').placeholder = "Please insert a certificate";
                    document.getElementById('soft-tap-cert').required = "true";
                }
                if (document.getElementById('soft-tap-pcap-path').value == ""){
                    document.getElementById('soft-tap-pcap-path').placeholder = "Please insert a pcap path";
                    document.getElementById('soft-tap-pcap-path').required = "true";
                }
                if (document.getElementById('soft-tap-pcap-prefix').value == ""){
                    document.getElementById('soft-tap-pcap-prefix').placeholder = "Please insert a pcap prefix";
                    document.getElementById('soft-tap-pcap-prefix').required = "true";            
                }
                if (document.getElementById('soft-tap-bpf').value == ""){
                    document.getElementById('soft-tap-bpf').placeholder = "Please insert a BPF path:";
                    document.getElementById('soft-tap-bpf').required = "true";
                }
                
            }
        }else if(type == "network-socket"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-bpf-socket').value == "" || document.getElementById('soft-tap-collector').value == ""){
                if (document.getElementById('soft-tap-name').value == ""){                
                    document.getElementById('soft-tap-name').placeholder = "Please insert a name";
                    document.getElementById('soft-tap-name').required = "true";
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
                    document.getElementById('soft-tap-collector').placeholder = "Please insert a collector IP";
                    document.getElementById('soft-tap-collector').required = "true";
                }if (document.getElementById('soft-tap-bpf-socket').value == ""){
                    document.getElementById('soft-tap-bpf-socket').placeholder = "Please insert a BPF path";
                    document.getElementById('soft-tap-bpf-socket').required = "true";
                }
            }
        }
    }else{     
        $('#modal-window').modal("hide");
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/add';

        var valueSelected = "";
        $('input:radio:checked').each(function() {            
            if($(this).attr('class') == 'socket-network-radio-stap'){
                valueSelected = $(this).prop("value");
            }                        
        });

        var jsonSave = {}
        jsonSave["uuid"] = uuid;
        jsonSave["name"] = document.getElementById('soft-tap-name').value;
        jsonSave["type"] = type;
        jsonSave["cert"] = document.getElementById('soft-tap-cert').value;
        jsonSave["port"] = document.getElementById('soft-tap-port').value;
        jsonSave["interface"] = valueSelected;
        if (type == "socket-pcap"){ jsonSave["pcap-path"] = document.getElementById('soft-tap-pcap-path').value; jsonSave["pcap-prefix"] = document.getElementById('soft-tap-pcap-prefix').value; jsonSave["bpf"] = document.getElementById('soft-tap-bpf').value;}
        if (type == "network-socket"){ jsonSave["collector"] = document.getElementById('soft-tap-collector').value; jsonSave["bpf"] = document.getElementById('soft-tap-bpf-socket').value;}
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
                    '<strong>Success!</strong> Save STAP: '+type+' service added successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding service: Save STAP: </strong>'+response.data.error+''+
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
                '<strong>Error adding service: Save STAP: </strong>'+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}

function AddPluginService(uuid, name, type){
    if (name == ""){        
        document.getElementById('new-service-name').placeholder = "Please, inserta a description";
        document.getElementById('new-service-name').required = "true";
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/add';
        var newSuriData = {}
        newSuriData["uuid"] = uuid;
        newSuriData["name"] = name;
        newSuriData["type"] = type;
        var dataMap = JSON.stringify(newSuriData);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: dataMap
        })
        .then(function (response) {            
            $('#modal-window').modal("hide");
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Add plugin service: '+type+' service added successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Add plugin service: '+response.data.error+''+
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
                '<strong>Error!</strong> Add plugin service: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    }
}

// function GetSuricataServices(uuid){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/get/'+uuid;
//     axios({
//         method: 'get',
//         url: nodeurl,
//         timeout: 30000
//     })
//     .then(function (response) {
//         console.log(response.data);
//     })
//     .catch(function (error) {
//     });
// }

function syncRulesetModal(node, name){
  var modalWindow = document.getElementById('modal-window');
  modalWindow.innerHTML =
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+

      '<div class="modal-header">'+
        '<h4 class="modal-title" id="sync-node-header">Node</h4>'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
      '</div>'+

      '<div class="modal-body" id="sync-node-footer-table">'+
        '<p>Do you want to sync ruleset for <b>'+name+'</b> node?</p>'+
      '</div>'+

      '<div class="modal-footer" id="sync-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-sync-node">sync</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  $('#modal-window').modal("show");
  $('#btn-sync-node').click(function(){ $('#modal-window').modal("hide"); sendRulesetToNode(node); });
}

function loadBPF(uuid, bpf, service, name, type){
    var modalWindow = document.getElementById('modal-window');
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
                '<button type="submit" class="btn btn-primary" id="load-bpf-save">Save</button>'+
            '</div>'+

        '</div>'+
    '</div>';

    $('#modal-window').modal("show");
    $('#load-bpf-cross').click(function(){ $('#modal-window').modal("hide"); });
    $('#load-bpf-close').click(function(){ $('#modal-window').modal("hide"); });
    $('#load-bpf-save').click(function(){ $('#modal-window').modal("hide"); saveBPF(uuid, document.getElementById('recipient-name').value, service, type); });
}

function saveBPF(uuid, value, service, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/bpf';

    if (type == "suricata"){
        document.getElementById('suricata-bpf-'+service).value = value;
        document.getElementById('suricata-bpf-default-'+service).innerHTML = value;
    }else if (type == "socket-pcap"){
        document.getElementById('socket-pcap-bpf-'+service).value =value;
        document.getElementById('socket-pcap-bpf-default-'+service).innerHTML = value;
    }else if (type == "network-socket"){
        document.getElementById('network-socket-bpf-'+service).value = value;
        document.getElementById('network-socket-bpf-default-'+service).innerHTML = value;
    }

    var jsonbpfdata = {}
    jsonbpfdata["uuid"] = uuid;
    jsonbpfdata["value"] = value;
    jsonbpfdata["service"] = service;
    var bpfjson = JSON.stringify(jsonbpfdata);

    axios({
      method: 'put',
      url: nodeurl,
      timeout: 30000,
      data: bpfjson
    })
      .then(function (response) {
        if (response.data.error == "false"){
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Save BPF: '+response.data.error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            // loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Save BPF: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function loadRuleset(uuid, source, service){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML =
    '<div class="modal-dialog modal-lg">'+
      '<div class="modal-content">'+

        '<div class="modal-header">'+
          '<h4 class="modal-title" id="ruleset-manager-header">Rules</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+

        '<div class="modal-body" id="ruleset-manager-footer-table">'+
        '</div>'+

        '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
        '</div>'+

      '</div>'+
    '</div>';
    var resultElement = document.getElementById('ruleset-manager-footer-table');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset')
      .then(function (response) {
          if (typeof response.data.error != "undefined"){
              resultElement.innerHTML = '<p>No rules available...</p>';
          }else{
              resultElement.innerHTML = generateAllRulesModal(response, uuid, source, service);
          }
    })
    .catch(function (error) {
        resultElement.innerHTML = '<p>Error retrieving rules</p>';
    });

  }

  function deployZeekModal(uuid){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML =
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+

        '<div class="modal-header">'+
          '<h4 class="modal-title" id="delete-node-header">Node</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+

        '<div class="modal-body" id="delete-node-footer-table">'+
          '<p>Do you want to Deploy Zeek policy?</p>'+
        '</div>'+

        '<div class="modal-footer" id="delete-node-footer-btn">'+
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
          '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-delete-node" onclick="deployZeek(\''+uuid+'\')">Deploy</button>'+
        '</div>'+

      '</div>'+
    '</div>';
}

function deployZeek(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/deploy/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Error deploying Zeek: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }
    })
    .catch(function (error) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Error deploying Zeek: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }
    });
}

function generateAllRulesModal(response, nid, source, service) {
    var rules = response.data;
    var isEmpty = true;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th width="30%">Name</th>                                    ' +
                '<th>Description</th>                                         ' +
                '<th width="15%">Options</th>                                 ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     '
    for (rule in rules) {
        isEmpty = false;
        html = html + '<tr><td style="word-wrap: break-word;" width="30%">                                       ' +
        rules[rule]["name"]                                                     +
        '</td><td style="word-wrap: break-word;">                                                            ' +
        rules[rule]["desc"]                                                     +
        '</td><td style="word-wrap: break-word;" width="15%">                                                ' +
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveRuleSelected(\''+rule+'\', \''+nid+'\', \''+source+'\', \''+rules[rule]["name"]+'\', \''+service+'\' )">Select</button>        ' +
        '</td></tr>                                                           '
    }
    html = html + '</tbody></table>';

    if (isEmpty){
        return '<p>No rules available...</p>';;
    }else{
        return html;
    }
}


function saveRuleSelected(rule, nid, source, name, service){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/set';

    var jsonRuleUID = {}
    jsonRuleUID["nid"] = nid;
    jsonRuleUID["rule_uid"] = rule;
    var uidJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: urlSetRuleset,
        timeout: 30000,
        data: uidJSON
    })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Save Ruleset: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }
            if (source == "main"){
                loadPlugins();
            }else if (source == "service"){
                console.log('suricata-ruleset-edit-'+service);
                document.getElementById('suricata-ruleset-edit-'+service).value = name;
            }
        })
        .catch(function (error) {
            console.log(error);
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save Ruleset: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
}

function loadStapURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/stap.html?uuid='+uuid+'&node='+nodeName;
}

function playCollector(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/play/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('stap-collector-' + uuid).className = "badge bg-success align-text-bottom text-white";
        document.getElementById('stap-collector-' + uuid).innerHTML = "ON";
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function stopCollector(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/stop/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('stap-collector-' + uuid).className = "badge bg-danger align-text-bottom text-white";
        document.getElementById('stap-collector-' + uuid).innerHTML = "OFF";
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function showCollector(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/show/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        showModalCollector(response);

    })
    .catch(function (error) {
        return false;
    });
}

function showModalCollector(response){
    var res = response.data.split("\n");
    var html = '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+

                        '<div class="modal-header">'+
                            '<h4 class="modal-title" id="modal-collector-header">STAP Collector status</h4>'+
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
                                            html = html + '<tr><td style="word-wrap: break-word;" >' +
                                            lineSplited[1]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[2]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[3]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[4]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[5]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[6]+
                                            '</td><td style="word-wrap: break-word;" >     ' +
                                            lineSplited[7]+
                                            '</td></tr>'
                                        }
                                    }
                                }
                        html = html + '</tbody>'+
                        '</table>'+
                        '</div>'+

                    '</div>'+
                '</div>';
    document.getElementById('modal-window').innerHTML = html;
    $('#modal-window').modal("show");
}

function PingCollector(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var collectorStatus = document.getElementById('collector-status-'+uuid);
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/show/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data != ""){
            document.getElementById('stap-collector-' + uuid).className = "badge bg-success align-text-bottom text-white";
            document.getElementById('stap-collector-' + uuid).innerHTML = "ON";
        }else{
            document.getElementById('stap-collector-' + uuid).className = "badge bg-danger align-text-bottom text-white";
            document.getElementById('stap-collector-' + uuid).innerHTML = "OFF";
        }
    })
    .catch(function (error) {
        return false;
    });
}

function PingPorts(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/PingPorts/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            for(line in response.data){
                console.log(response.data);
                if (response.data[line]["status"] == "Enabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "ON";
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-stop-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-success align-text-bottom text-white";
                }else if (response.data[line]["status"] == "Disabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "OFF";
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-play-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-danger align-text-bottom text-white";
                }
                document.getElementById('ports-mode-'+uuid).innerHTML = response.data[line]["mode"];
            }
            return true;
        })
        .catch(function (error) {
            
            return false;            
        });
    return false;
}

function ChangeStatus(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/status';

    if(document.getElementById('ports-status-'+uuid).innerHTML == "ON"){
        var status ="Disabled";
    }else{
        var status ="Enabled";
    }

    var jsonPorts = {}
    jsonPorts["uuid"] = uuid;
    jsonPorts["status"] = status;
    var dataJSON = JSON.stringify(jsonPorts);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change status: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Change status: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function ChangeMode(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/mode';

    if(document.getElementById('ports-mode-'+uuid).innerHTML == "Learning"){
        var mode ="Production";
    }else{
        var mode ="Learning";
    }

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = uuid;
    jsonRuleUID["mode"] = mode;
    var dataJSON = JSON.stringify(jsonRuleUID);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change mode: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Change mode: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function showPorts(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ports/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        showModalPorts(response, uuid);
    })
    .catch(function (error) {
        return false;
    });
}

function showModalPorts(response, uuid){
    var html = '<div class="modal-dialog modal-lg">'+
        '<div class="modal-content">'+

            '<div class="modal-header">'+
                '<h4 class="modal-title">PORTS</h4>'+
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';

            if (response.data.ack=="false"){
                html = html + '<div class="modal-body">  '+
                    '<h5 class="modal-title" style="color:red;">Error retrieving ports...</h5>'+
                '</div>';
            }else{
                html = html + '<div class="modal-body">'+
                    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>                                                      ' +
                            '<tr>                                                         ' +
                                '<th width="30%">Portproto</th>                                    ' +
                                '<th>First</th>                                         ' +
                                '<th>Last</th>                                 ' +
                                '<th width="10%">Select</th>                                 ' +
                            '</tr>                                                        ' +
                        '</thead>                                                     ' +
                        '<tbody>                                                     '+
                            '<div class="modal-footer" id="ruleset-note-footer-btn">'+
                                '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                                '<button type="button" class="btn btn-dark" data-dismiss="modal" onclick="deleteAllPorts(\''+uuid+'\')">Delete all</button>' +
                                '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deletePorts(\''+uuid+'\')">Delete</button>' +
                            '</div>';
                            for(line in response.data){
                                var first = new Date(response.data[line]["first"]*1000);
                                var last = new Date(response.data[line]["last"]*1000);

                                html = html + '<tr><td style="word-wrap: break-word;">                            ' +
                                response.data[line]["portprot"]+'<br>'                    +
                                '</td><td style="word-wrap: break-word;" >'+
                                first+
                                '</td><td style="word-wrap: break-word;" >'+
                                last+
                                '</td><td  style="word-wrap: break-word;" align="center">'+
                                '<input class="form-check-input" type="checkbox" id="'+line+'"></input>'+
                                '</td></tr>'
                            }
                    html = html +'</tbody>'+
                    '</table>'+
                '</div>'+

                '<div class="modal-footer" id="ruleset-note-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                    '<button type="button" class="btn btn-dark" data-dismiss="modal" onclick="deleteAllPorts(\''+uuid+'\')">Delete all</button>' +
                    '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deletePorts(\''+uuid+'\')">Delete</button>' +
                '</div>';
            }

        html = html + '</div>'+
    '</div>';
    document.getElementById('modal-window').innerHTML = html;
    $('#modal-window').modal("show");
}

function deletePorts(uuid){
    var arrayLinesSelected = new Object();
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/ports/delete/'+uuid;
    $('input:checkbox:checked').each(function() {
        var CHuuid = $(this).prop("id");
        arrayLinesSelected[CHuuid] = CHuuid;
    });
    var nodeJSON = JSON.stringify(arrayLinesSelected);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: nodeJSON
        }).then(function (response) {

        }).catch(function (error) {

        });

}

function deleteAllPorts(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/ports/deleteAll/'+uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    }).then(function (response) {

    }).catch(function (error) {

    });

}

function sendRulesetToNode(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/set';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = uuid;
    jsonRuleUID["type"] = "node";
    var dataJSON = JSON.stringify(jsonRuleUID);
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
                '<strong>Success!</strong> Suricata ruleset deployment complete.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Ruleset Error!</strong> Deploy ruleset: '+response.data.error+''+
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
                '<strong>Error!</strong> Deploy ruleset: '+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

//Run suricata system
function RunSuricata(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/RunSuricata/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        //httpsAgent: agent,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Run suricata: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            setTimeout(function (){
                loadPlugins();
            }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Run suricata'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);        
    });

}

//Stop suricata system
function StopSuricata(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopSuricata/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop Suricata: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Suricata: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);   
        });

}

function PingSuricata(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/suricata/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (!response.data.path && !response.data.bin) {
                document.getElementById(uuid + '-suricata').className = "badge bg-dark align-text-bottom text-white";
                document.getElementById(uuid + '-suricata').innerHTML = "N/A";
                document.getElementById(uuid + '-suricata-icon').className = "fas fa-play-circle";
                document.getElementById(uuid + '-suricata-icon').onclick = function () { RunSuricata(uuid); };
                document.getElementById(uuid + '-suricata-icon').title = "Run Suricata";
            } else if (response.data.path || response.data.bin) {
                if (response.data.running) {
                    document.getElementById(uuid + '-suricata').className = "badge bg-success align-text-bottom text-white";
                    document.getElementById(uuid + '-suricata').innerHTML = "ON";
                    document.getElementById(uuid + '-suricata-icon').className = "fas fa-stop-circle";
                    document.getElementById(uuid + '-suricata-icon').onclick = function () { StopSuricata(uuid); };
                    document.getElementById(uuid + '-suricata-icon').title = "Stop Suricata";
                } else {
                    document.getElementById(uuid + '-suricata').className = "badge bg-danger align-text-bottom text-white";
                    document.getElementById(uuid + '-suricata').innerHTML = "OFF";
                    document.getElementById(uuid + '-suricata-icon').className = "fas fa-play-circle";
                    document.getElementById(uuid + '-suricata-icon').onclick = function () { RunSuricata(uuid); };
                    document.getElementById(uuid + '-suricata-icon').title = "Run Suricata";
                }
            }
            return true;
        })
        .catch(function (error) {
            document.getElementById(uuid + '-suricata').className = "badge bg-dark align-text-bottom text-white";
            document.getElementById(uuid + '-suricata').innerHTML = "N/A";
            return false;
        });
    return false;
}


//Run Zeek system
function RunZeek(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/RunZeek/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Run Zeek: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            setTimeout(function (){
                loadPlugins();
            }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Run Zeek: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
    });

}

//Stop Zeek system
function StopZeek(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopZeek/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Zeek: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            setTimeout(function (){
                loadPlugins();
            }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop Zeek: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
        
    });

}

function PingZeek(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/zeek/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (!response.data.path && !response.data.bin) {
                document.getElementById(uuid + '-zeek').className = "badge bg-dark align-text-bottom text-white";
                document.getElementById(uuid + '-zeek').innerHTML = "N/A";
                document.getElementById(uuid + '-zeek-icon').className = "fas fa-play-circle";
                document.getElementById(uuid + '-zeek-icon').onclick = function () { RunZeek(uuid); };
                document.getElementById(uuid + '-zeek-icon').title = "Run zeek";
            } else if (response.data.path || response.data.bin) {
                if (response.data.running) {
                    document.getElementById(uuid + '-zeek').className = "badge bg-success align-text-bottom text-white";
                    document.getElementById(uuid + '-zeek').innerHTML = "ON";
                    document.getElementById(uuid + '-zeek-icon').className = "fas fa-stop-circle";
                    document.getElementById(uuid + '-zeek-icon').onclick = function () { StopZeek(uuid); };
                    document.getElementById(uuid + '-zeek-icon').title = "Stop Zeek";
                } else {
                    document.getElementById(uuid + '-zeek').className = "badge bg-danger align-text-bottom text-white";
                    document.getElementById(uuid + '-zeek').innerHTML = "OFF";
                    document.getElementById(uuid + '-zeek-icon').className = "fas fa-play-circle";
                    document.getElementById(uuid + '-zeek-icon').onclick = function () { RunZeek(uuid); };
                    document.getElementById(uuid + '-zeek-icon').title = "Run Zeek";
                }
            }
            return true;
        })
        .catch(function (error) {
            document.getElementById(uuid + '-zeek').className = "badge bg-dark align-text-bottom text-white";
            document.getElementById(uuid + '-zeek').innerHTML = "N/A";

            return false;
        });
    return false;
}

//Run Zeek system
function RunWazuh(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/RunWazuh/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Run Wazuh: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Run Wazuh: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });

    loadPlugins();
}

//Stop Wazuh system
function StopWazuh(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopWazuh/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Wazuh: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            setTimeout(function (){
                loadPlugins();
            }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop Wazuh: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function addWazuhFile(uuid){
    var totalCount = document.getElementById('wazuh-count-table-value').value
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/addWazuhFile';
    
    var array = []
    for (x = 1; x <= totalCount; x++) {
        array.push(document.getElementById(x+'-wazuh-files').innerHTML);
    }

    var jsonWazuhFilePath = {}
    jsonWazuhFilePath["uuid"] = uuid;
    jsonWazuhFilePath["paths"] = array;
    var dataJSON = JSON.stringify(jsonWazuhFilePath);
    
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

function ModalDeleteWazuhFile(uuid, name, count){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML =
    '<div class="modal-dialog modal-md">'+
      '<div class="modal-content">'+

        '<div class="modal-header" style="word-break: break-all;">'+
          '<h4 class="modal-title">Delete Wazuh path</h4>'+
          '<button type="button" class="close" id="delete-wazuh-cross">&times;</button>'+
        '</div>'+

        '<div class="modal-body" style="word-break: break-all;">'+
            '<p>Do you want to delete this Wazuh path: <b>'+name+'</b></p>'+
        '</div>'+

        '<div class="modal-footer" id="ruleset-manager-footer-btn">'+
          '<button type="button" class="btn btn-secondary" id="delete-wazuh-close">Close</button>'+
          '<button type="button" class="btn btn-danger" id="delete-wazuh-ok">Delete</button>'+
        '</div>'+

      '</div>'+
    '</div>';
    $('#modal-window').modal("show");
    $('#delete-wazuh-ok').click(function(){ $('#modal-window').modal("hide"); DeleteWazuhFile(uuid, count); });
    $('#delete-wazuh-cross').click(function(){ $('#modal-window').modal("hide");});
    $('#delete-wazuh-close').click(function(){ $('#modal-window').modal("hide");});
}

function DeleteWazuhFile(uuid, count){
    var path = document.getElementById(count+'-wazuh-files').innerHTML;
    var totalCount = document.getElementById('wazuh-count-table-value').value
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/deleteWazuhFile';
    
    var array = []
    for (x = 1; x <= totalCount; x++) {
        if (x != count){
            array.push(document.getElementById(x+'-wazuh-files').innerHTML);
        }
    }

    var jsonWazuhFilePath = {}
    jsonWazuhFilePath["uuid"] = uuid;
    jsonWazuhFilePath["paths"] = array;
    var dataJSON = JSON.stringify(jsonWazuhFilePath);
    
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

function PingWazuhFiles(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/pingWazuhFiles/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong>Get Wazuh files: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            var html = "";
            var count = 1;
            var sufixSize = "";
            for (pos in response.data){
                html = html + '<tr>'+
                    '<td style="word-wrap: break-word;" id="'+count+'-wazuh-files">'+response.data[pos]["path"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="wazuh-file-column-'+count+'">';
                    if(response.data[pos]["size"] < 0){
                        html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-danger align-text-bottom text-white">&nbsp</span>';
                    }else{
                        if(response.data[pos]["size"]<1024){html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[pos]["size"].toFixed(2)+' Bytes</span>';}
                        if(response.data[pos]["size"]>=1024 && response.data[pos]["size"]<1048576){html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[pos]["size"]/1024).toFixed(2)+' kB</span>';}
                        if(response.data[pos]["size"]>=1048576 && response.data[pos]["size"]<1073741824){html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[pos]["size"]/1048576).toFixed(2)+' MB</span>';}
                        if(response.data[pos]["size"]>=1073741824){html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[pos]["size"]/1073741824).toFixed(2)+' GB</span>';}
                    }
                    html = html + '</td>'+
                    '<td style="color:grey; word-wrap: break-word;">';
                        if(response.data[pos]["size"] >=0){
                            html = html + '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'10\', \''+response.data[pos]["path"]+'\')">10</span> &nbsp'+
                            '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'50\', \''+response.data[pos]["path"]+'\')">50</span> &nbsp'+
                            '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'100\', \''+response.data[pos]["path"]+'\')">100</span> &nbsp';
                        }
                        html = html + '<i class="fas fa-trash-alt" style="color:red;cursor: pointer;" onclick="ModalDeleteWazuhFile(\''+uuid+'\', \''+response.data[pos]["path"]+'\', \''+count+'\')"></i>'+
                    '</td>'+
                '<tr>';
                count++;
            }
            document.getElementById('wazuh-count-table-value').value = count-1;
            document.getElementById('wazuh-table').innerHTML = document.getElementById('wazuh-table').innerHTML + html;
               
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong>Get Wazuh files: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function LoadPageLastLines(uuid, line, path) {
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/load-content.html?uuid='+uuid+'&line='+line+'&path='+path;
}

function PingWazuh(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (!response.data.path && !response.data.bin) {
                document.getElementById(uuid + '-wazuh').className = "badge bg-dark align-text-bottom text-white";
                document.getElementById(uuid + '-wazuh').innerHTML = "N/A";
                document.getElementById(uuid + '-wazuh-icon').className = "fas fa-play-circle";
                document.getElementById(uuid + '-wazuh-icon').onclick = function () { RunWazuh(uuid); };
                document.getElementById(uuid + '-wazuh-icon').title = "Run Wazuh";
            } else if (response.data.path || response.data.bin) {
                if (response.data.running) {
                    document.getElementById(uuid + '-wazuh').className = "badge bg-success align-text-bottom text-white";
                    document.getElementById(uuid + '-wazuh').innerHTML = "ON";
                    document.getElementById(uuid + '-wazuh-icon').className = "fas fa-stop-circle";
                    document.getElementById(uuid + '-wazuh-icon').onclick = function () { StopWazuh(uuid); };
                    document.getElementById(uuid + '-wazuh-icon').title = "Stop Wazuh";
                } else {
                    document.getElementById(uuid + '-wazuh').className = "badge bg-danger align-text-bottom text-white";
                    document.getElementById(uuid + '-wazuh').innerHTML = "OFF";
                    document.getElementById(uuid + '-wazuh-icon').className = "fas fa-play-circle";
                    document.getElementById(uuid + '-wazuh-icon').onclick = function () { RunWazuh(uuid); };
                    document.getElementById(uuid + '-wazuh-icon').title = "Run Wazuh";
                }
            }
            return true;
        })
        .catch(function (error) {
            document.getElementById(uuid + '-wazuh').className = "badge bg-dark align-text-bottom text-white";
            document.getElementById(uuid + '-wazuh').innerHTML = "N/A";
            return false;
        });
    return false;
}

//Run stap system
function RunStap(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/RunStap/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Run STAP: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            // setTimeout(function (){
                loadPlugins();
            // }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Run STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

//Stop stap system
function StopStap(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/StopStap/' + uuid;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop STAP: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            // setTimeout(function (){
                loadPlugins();
            // }, 1500);
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function PingStap(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/stap/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (!response.data.stapStatus) {
                document.getElementById(uuid + '-stap').className = "badge bg-danger align-text-bottom text-white";
                document.getElementById(uuid + '-stap').innerHTML = "OFF";
                document.getElementById(uuid + '-stap-icon').className = "fas fa-play-circle";
                document.getElementById(uuid + '-stap-icon').onclick = function () { RunStap(uuid); };
                document.getElementById(uuid + '-stap-icon').title = "Run stap";
            } else {
                document.getElementById(uuid + '-stap').className = "badge bg-success align-text-bottom text-white";
                document.getElementById(uuid + '-stap').innerHTML = "ON";
                document.getElementById(uuid + '-stap-icon').className = "fas fa-stop-circle";
                document.getElementById(uuid + '-stap-icon').onclick = function () { StopStap(uuid); };
                document.getElementById(uuid + '-stap-icon').title = "Stop stap";
            }
        })
        .catch(function (error) {
            document.getElementById(uuid + '-stap').className = "badge bg-dark align-text-bottom text-white";
            document.DetElementById(uuid + '-stap').innerHTML = "N/A";
            return false;
        });
    return false;
}

function PingPluginsNode(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/PingPluginsNode/' + uuid;
    var tableSuricata = "";
    var tableZeek = "";
    var tableSocketNetwork = "";
    var tableSocketPcap = "";
    var tableNetworkSocket = "";
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        for(line in response.data){
            if (line == "knownports"){
                if (response.data[line]["status"] == "Enabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "ON";
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-stop-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-success align-text-bottom text-white";
                }else if (response.data[line]["status"] == "Disabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "OFF";
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-play-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-danger align-text-bottom text-white";
                }
                document.getElementById('ports-mode-'+uuid).innerHTML = response.data[line]["mode"];
            }else if (response.data[line]["type"] == "suricata"){
                tableSuricata = tableSuricata + '<tr>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="status-suricata-'+line+'">';
                        if(response.data[line]["status"]=="enabled"){
                            tableSuricata = tableSuricata + '<span class="badge bg-success align-text-bottom text-white">ON</span>';
                        }else if (response.data[line]["status"]=="disabled"){
                            tableSuricata = tableSuricata + '<span class="badge bg-danger align-text-bottom text-white">OFF</span>';
                        }
                        tableSuricata = tableSuricata + '</td>'+
                    '<td style="word-wrap: break-word;" id="suricata-bpf-default-'+line+'">'+response.data[line]["bpf"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="suricata-ruleset-'+line+'"></td>';
                    tableSuricata = tableSuricata + '<td style="word-wrap: break-word;" id="suricata-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if(response.data[line]["status"]=="enabled"){
                            tableSuricata = tableSuricata + '<i class="fas fa-stop-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'disabled\', \''+response.data[line]["interface"]+'\' ,\''+response.data[line]["bpf"]+'\', \'suricata\')"></i> &nbsp';
                        }else if (response.data[line]["status"]=="disabled"){
                            tableSuricata = tableSuricata + '<i class="fas fa-play-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'enabled\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["bpf"]+'\',  \'suricata\')"></i> &nbsp';
                        }
                        tableSuricata = tableSuricata + '<i class="fas fa-sync-alt" style="color: grey; cursor: pointer;" onclick="syncRulesetModal(\''+uuid+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                        // '<span style="cursor: default;" title="Ruleset Management" class="badge bg-secondary align-text-bottom text-white" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\')">Ruleset</span> &nbsp'+
                        // '<i title="BPF" style="cursor: default;" onclick="loadBPF(\''+uuid+'\', \''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\')">BPF</i> &nbsp'+
                        // '<i class="fas fa-file" style="color:grey;" title="Suricata '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')"></i> &nbsp'+
                        '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'suricata\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>'+
                    '</td>'+
                '</tr>'+
                '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                    '<td style="word-wrap: break-word;" colspan="5">'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Description: <input class="form-control" id="suricata-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                // 'BPF: <i class="fas fa-edit" id="suricata-bpf-icon-'+line+'" style="cursor: default; color: Dodgerblue;" title="Suricata '+response.data[line]["name"]+' BPF"></i>'+
                                'BPF: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Suricata '+response.data[line]["name"]+' BPF" onclick="loadBPF(\''+uuid+'\', \''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\' , \''+response.data[line]["type"]+'\')"></i>'+
                                '<input class="form-control" id="suricata-bpf-'+line+'" value="'+response.data[line]["bpf"]+'" disabled>'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Ruleset: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Suricata '+response.data[line]["name"]+' BPF" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\', \'service\', \''+line+'\')"></i>'+
                                '<input class="form-control" id="suricata-ruleset-edit-'+line+'" value="" disabled>'+
                            '</div>'+
                            '<div class="col">'+
                                'Interface: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Suricata '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')"></i>'+
                                '<input class="form-control" id="suricata-interface-'+line+'" value="'+response.data[line]["interface"]+'" disabled>'+
                            '</div>'+
                        '</div>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;" >'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-seconday" id="modify-stap-cancel-suricata-'+line+'" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                            '</div>'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\''+uuid+'\', \'suricata\', \''+line+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
            }else if (response.data[line]["type"] == "zeek"){                
                tableZeek = tableZeek + '<tr>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="status-zeek-'+line+'">';
                        if(response.data[line]["status"]=="enabled"){
                            tableZeek = tableZeek + '<span class="badge bg-success align-text-bottom text-white">ON</span>';
                        }else if (response.data[line]["status"]=="disabled"){
                            tableZeek = tableZeek + '<span class="badge bg-danger align-text-bottom text-white">OFF</span>';
                        }
                        tableZeek = tableZeek + '</td>'+
                    '<td style="word-wrap: break-word;" id="zeek-interface-default">'+response.data[line]["interface"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if(response.data[line]["status"]=="enabled"){
                            tableZeek = tableZeek + '<i class="fas fa-stop-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'disabled\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["bpf"]+'\',  \'zeek\')"></i> &nbsp';
                        }else if (response.data[line]["status"]=="disabled"){
                            tableZeek = tableZeek + '<i class="fas fa-play-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'enabled\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["bpf"]+'\',  \'zeek\')"></i> &nbsp';
                        }
                        tableZeek = tableZeek + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" style="color: red; cursor: pointer;" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'zeek\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                    '</td>'+
                '</tr>'+
                '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                    '<td style="word-wrap: break-word;" colspan="4">'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Description: <input class="form-control" id="zeek-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                            '</div>'+
                            '<div class="col">'+
                                'Interface: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')" name="network" value="network"></i>  &nbsp'+
                                '<input class="form-control" type="text" id="zeek-interface-config" value="" disabled>'+
                            '</div>'+
                            '<div class="col">'+
                                '<div class="form-row text-center">'+
                                    '<div class="col">'+
                                        '<button class="btn btn-seconday" id="modify-stap-cancel-socket-pcap-'+line+'" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                                    '</div>'+
                                    '<div class="col">'+
                                        '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\''+uuid+'\', \'zeek\', \''+line+'\')">Save</button>'+    
                                    '</div>'+
                                '</div>'+
                                '<br>'+
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
                
            }else if (response.data[line]["type"] == "socket-network"){                
                tableSocketNetwork = tableSocketNetwork + '<tr>'+
                    '<td style="word-wrap: break-word;">';
                        if (response.data[line]["pid"] == "none"){
                            tableSocketNetwork = tableSocketNetwork + '<span class="badge bg-danger align-text-bottom text-white">OFF</span> '+ response.data[line]["name"]+'</td>';
                        }else{
                            tableSocketNetwork = tableSocketNetwork + '<span class="badge bg-success align-text-bottom text-white">ON</span> '+ response.data[line]["name"]+'</td>';
                        }
                    tableSocketNetwork = tableSocketNetwork + '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="socket-network-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if (response.data[line]["pid"] == "none"){
                            tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-play" style="color: grey; cursor: pointer;" onclick="deployStapService(\''+uuid+'\', \''+line+'\', \'none\',\''+response.data[line]["port"]+'\', \''+response.data[line]["interface"]+'\',\'socket-network\')"></i> &nbsp';
                        }else if (response.data[line]["pid"] != "none"){
                            tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-stop" style="color: grey; cursor: pointer;" onclick="stopStapService(\''+uuid+'\', \''+line+'\', \'socket-network\')"></i> &nbsp';
                        }                        
                        tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'socket-network\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>'+
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
                                'Interface: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Socket to network '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')"></i><input class="form-control" id="socket-network-interface-'+line+'" value="'+response.data[line]["interface"]+'" disabled>'+
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
                                '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\''+uuid+'\', \'socket-network\', \''+line+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
            }else if (response.data[line]["type"] == "socket-pcap"){
                tableSocketPcap = tableSocketPcap + '<tr>'+
                    '<td style="word-wrap: break-word;">';
                    if (response.data[line]["pid"] == "none"){
                        tableSocketPcap = tableSocketPcap + '<span class="badge bg-danger align-text-bottom text-white">OFF</span> '+ response.data[line]["name"]+'</td>';
                    }else{
                        tableSocketPcap = tableSocketPcap + '<span class="badge bg-success align-text-bottom text-white">ON</span> '+ response.data[line]["name"]+'</td>';
                    }
                    tableSocketPcap = tableSocketPcap + '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["pcap-path"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["pcap-prefix"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="socket-pcap-bpf-default-'+line+'">'+response.data[line]["bpf"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if (response.data[line]["pid"] == "none"){
                            tableSocketPcap = tableSocketPcap + '<i class="fas fa-play" style="color: grey;cursor: pointer; " onclick="deployStapService(\''+uuid+'\', \''+line+'\', \'none\',\''+response.data[line]["port"]+'\', \'none\',\'socket-pcap\')"></i> &nbsp';
                        }else if (response.data[line]["pid"] != "none"){
                            tableSocketPcap = tableSocketPcap + '<i class="fas fa-stop" style="color: grey; cursor: pointer;" onclick="stopStapService(\''+uuid+'\', \''+line+'\', \'socket-pcap\')"></i> &nbsp';
                        }
                        tableSocketPcap = tableSocketPcap + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'socket-pcap\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>'+
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
                                'BPF: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" onclick="loadBPF(\''+uuid+'\', \''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\', \''+response.data[line]["type"]+'\')"></i> <input class="form-control" id="socket-pcap-bpf-'+line+'" value="'+response.data[line]["bpf"]+'" disabled>'+
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
                                '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\''+uuid+'\', \'socket-pcap\', \''+line+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
            }else if (response.data[line]["type"] == "network-socket"){
                tableNetworkSocket = tableNetworkSocket + '<tr>'+
                    '<td style="word-wrap: break-word;">';
                    if (response.data[line]["pid"] == "none"){
                        tableNetworkSocket = tableNetworkSocket + '<span class="badge bg-danger align-text-bottom text-white">OFF</span> '+ response.data[line]["name"]+'</td>';
                    }else{
                        tableNetworkSocket = tableNetworkSocket + '<span class="badge bg-success align-text-bottom text-white">ON</span> '+ response.data[line]["name"]+'</td>';
                    }
                    tableNetworkSocket = tableNetworkSocket + '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="network-socket-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                    '<td style="word-wrap: break-word;">'+response.data[line]["collector"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="network-socket-bpf-default-'+line+'">'+response.data[line]["bpf"]+'</td>'+
                    '<td style="word-wrap: break-word;">';
                        if (response.data[line]["pid"] == "none"){
                            tableNetworkSocket = tableNetworkSocket + '<i class="fas fa-play" style="color: grey; cursor: pointer;" onclick="deployStapService(\''+uuid+'\', \''+line+'\', \''+response.data[line]["collector"]+'\',\''+response.data[line]["port"]+'\', \''+response.data[line]["interface"]+'\',\'network-socket\')"></i> &nbsp';
                        }else if (response.data[line]["pid"] != "none"){
                            tableNetworkSocket = tableNetworkSocket + '<i class="fas fa-stop" style="color: grey; cursor: pointer;" onclick="stopStapService(\''+uuid+'\', \''+line+'\', \'network-socket\')"></i> &nbsp';
                        }
                        tableNetworkSocket = tableNetworkSocket + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'network-socket\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>'+
                    '</td>'+
                '</tr>'+
                '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                    '<td style="word-wrap: break-word;" colspan="6">'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Description: <input class="form-control" id="network-socket-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                'Port: <input class="form-control" id="network-socket-port-'+line+'" value="'+response.data[line]["port"]+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+                            
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Collector: <input class="form-control" id="network-socket-collector-'+line+'" value="'+response.data[line]["collector"]+'">'+
                            '</div>'+
                            '<div class="col">'+
                                'Certificate: <input class="form-control" id="network-socket-cert-'+line+'" value="'+response.data[line]["cert"]+'">'+
                            '</div>'+
                        '</div>'+
                        '<div class="form-row">'+
                            '<div class="col">'+
                                'Interface: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Socket to network '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')"></i> <input class="form-control" id="network-socket-interface-'+line+'" value="'+response.data[line]["interface"]+'" disabled>'+
                            '</div>'+
                            '<div class="col">'+
                                'BPF: <i class="fas fa-edit" title="BPF" style="cursor: default; color: Dodgerblue; cursor: pointer;" onclick="loadBPF(\''+uuid+'\', \''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\', \''+response.data[line]["type"]+'\')"></i> <input class="form-control" id="network-socket-bpf-'+line+'" value="'+response.data[line]["bpf"]+'" disabled>'+
                            '</div>'+
                        '</div>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;" >'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-seconday" id="modify-stap-cancel-network-socket-'+line+'" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                            '</div>'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-row text-center">'+
                            '<div class="col">'+
                                '<button class="btn btn-primary" id="modify-stap-change-'+line+'" onclick="saveStapChanges(\''+uuid+'\', \'network-socket\', \''+line+'\')">Save</button>'+    
                            '</div>'+
                        '</div>'+
                    '</td>'+
                '</tr>';
            }
            
            // if(($(".cluster")[0]) == undefined){ document.getElementById('zeek-table-services').innerHTML = tableZeek;}
            document.getElementById('zeek-table-services').innerHTML = tableZeek;
            document.getElementById('socket-network-table').innerHTML = tableSocketNetwork;
            document.getElementById('socket-pcap-table').innerHTML = tableSocketPcap;
            document.getElementById('network-socket-table').innerHTML = tableNetworkSocket;
            document.getElementById('suricata-table-services').innerHTML = tableSuricata;
            // onclick="loadBPF(\''+uuid+'\', \''+response.data[line]["bpf"]+'\', \''+line+'\', \''+response.data[line]["name"]+'\' , \''+response.data[line]["type"]+'\')"
            // if (response.data[line]["type"] == "suricata"){
            //     console.log('suricata-bpf-icon-'+line);
            //     var x = document.getElementById('suricata-bpf-icon-'+line).onclick = loadBPF(uuid, document.getElementById('suricata-bpf-'+line).value, line, response.data[line]["name"], response.data[line]["type"]);
            //     var x = document.getElementById('suricata-bpf-'+line).value
            //     console.log(x);
            //     // $('#suricata-bpf-icon-'+line).click(function(){ console.log("here"); loadBPF(uuid, document.getElementById('suricata-bpf-'+line).value, line, response.data[line]["name"], response.data[line]["type"]); });
            //     // $('#suricata-bpf-icon-'+line).click(function(){ console.log("here"); });
            // }            
        }

        axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValuesSelected/'+uuid)
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Load interfaces: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                if (document.getElementById('zeek-interface') != null){
                    for (net in response.data){                                                        
                        document.getElementById('zeek-interface').value = response.data[net]["interface"];                            
                    }
                }
            }
        })
        .catch(function (error){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Load interfaces: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
    
    })
    .catch(function (error) {
        console.log(error)
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Ping Plugins: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function hideEditStap(line){
    document.getElementById('edit-row-'+line).style.display = "none";
}

function showModifyStap(service){
    $('#edit-row-'+service).show();
}

function saveStapChanges(uuid, type, service){    
    $('#edit-row-'+service).hide();
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/modifyStapValues';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["service"] = service;
    jsonDeployService["type"] = type;
    if (type == "socket-network"){
        jsonDeployService["name"] = document.getElementById('socket-network-name-'+service).value;
        jsonDeployService["port"] = document.getElementById('socket-network-port-'+service).value;
        jsonDeployService["cert"] = document.getElementById('socket-network-cert-'+service).value;
        jsonDeployService["interface"] = document.getElementById('socket-network-interface-'+service).value;
    }else if (type == "suricata"){
        jsonDeployService["name"] = document.getElementById('suricata-name-'+service).value;      
    }else if (type == "zeek"){
        jsonDeployService["name"] = document.getElementById('zeek-name-'+service).value;      
    }else if (type == "socket-pcap"){        
        jsonDeployService["name"] = document.getElementById('socket-pcap-name-'+service).value;
        jsonDeployService["port"] = document.getElementById('socket-pcap-port-'+service).value;
        jsonDeployService["cert"] = document.getElementById('socket-pcap-cert-'+service).value;
        jsonDeployService["pcap-path"] = document.getElementById('socket-pcap-pcap-path-'+service).value;
        jsonDeployService["pcap-prefix"] = document.getElementById('socket-pcap-pcap-prefix-'+service).value;
        jsonDeployService["bpf"] = document.getElementById('socket-pcap-bpf-'+service).value;
    }else if (type == "network-socket"){
        jsonDeployService["name"] = document.getElementById('network-socket-name-'+service).value;
        jsonDeployService["port"] = document.getElementById('network-socket-port-'+service).value;
        jsonDeployService["cert"] = document.getElementById('network-socket-cert-'+service).value;
        jsonDeployService["collector"] = document.getElementById('network-socket-collector-'+service).value;
        jsonDeployService["interface"] = document.getElementById('network-socket-interface-'+service).value;
        jsonDeployService["bpf"] = document.getElementById('network-socket-bpf-'+service).value;
    }    
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save STAP Changes: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
            
            loadPlugins();
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Save STAP Changes: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function ModalDeleteService(uuid, service, type, name){
    var modalWindow = document.getElementById('modal-window');
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
    $('#modal-window').modal("show");
    $('#delete-service-ok').click(function(){ $('#modal-window').modal("hide"); deleteService(uuid, service); });
    $('#delete-service-cross').click(function(){ $('#modal-window').modal("hide");});
    $('#delete-service-close').click(function(){ $('#modal-window').modal("hide");});
}

function deployStapService(uuid, service, collector,port,interface, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/deployStapService';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["service"] = service;
    jsonDeployService["type"] = type;
    if (type == "network-socket"){
        jsonDeployService["collector"] = collector;
        jsonDeployService["port"] = port;
        jsonDeployService["interface"] = interface;
    }
    console.log(jsonDeployService);
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Deploy STAP: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Deploy STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function stopStapService(uuid, service, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/stopStapService';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["service"] = service;
    jsonDeployService["type"] = type;
    var dataJSON = JSON.stringify(jsonDeployService);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop STAP: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function deleteService(uuid, service){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/deleteService';

    var jsonDeleteService = {}
    jsonDeleteService["uuid"] = uuid;
    jsonDeleteService["service"] = service;
    var dataJSON = JSON.stringify(jsonDeleteService);

    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Delete service: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            loadPlugins();
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete service: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function ChangeServiceStatus(uuid, service, param, status, interface, bpf, type){
    if (type == "suricata" && (interface == "" || bpf == "")){
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Please, assign an interface and a BPF for deploy a suricata service.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    }else{
        //desplegar load bar
        var progressBar = document.getElementById('progressBar-options');
        var progressBarDiv = document.getElementById('progressBar-options-div');
        progressBar.style.display = "block";
        progressBarDiv.style.display = "block";
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/ChangeServiceStatus';

        var jsonChangeService = {}
        jsonChangeService["uuid"] = uuid;
        jsonChangeService["status"] = status;
        jsonChangeService["param"] = param;
        jsonChangeService["service"] = service;
        jsonChangeService["type"] = type;
        jsonChangeService["interface"] = interface;
        var dataJSON = JSON.stringify(jsonChangeService);

        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            data: dataJSON
        })
        .then(function (response) {
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change Service Status: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                loadPlugins();
            }
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change Service Status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
        });
    }
}

function PingAnalyzer(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/PingAnalyzer/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data["status"] == "Enabled"){
            document.getElementById('analyzer-status-'+uuid).innerHTML = "ON";
            document.getElementById('analyzer-status-btn-'+uuid).className = "fas fa-stop-circle";
            document.getElementById('analyzer-status-'+uuid).className = "badge bg-success align-text-bottom text-white";
        }else{
            document.getElementById('analyzer-status-'+uuid).innerHTML = "OFF";
            document.getElementById('analyzer-status-btn-'+uuid).className = "fas fa-play-circle";
            document.getElementById('analyzer-status-'+uuid).className = "badge bg-danger align-text-bottom text-white";
        }
        var html = '<td>'+response.data["path"]+'</td>'+
            '<td id="analyzer-file-path">';
                if(response.data["size"] < 0){
                    html = html +'<span class="badge badge-pill bg-danger align-text-bottom text-white">&nbsp</span>';
                }else{
                    if(response.data["size"]<1024){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+response.data["size"].toFixed(2)+' Bytes</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data["size"]>=1024 && response.data["size"]<1048576){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data["size"]/1024).toFixed(2)+' kB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data["size"]>=1048576 && response.data["size"]<1073741824){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data["size"]/1048576).toFixed(2)+' MB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data["size"]>=1073741824){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data["size"]/1073741824).toFixed(2)+' GB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                }
                html = html +'</td>'+
            '<td>'+
                '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'10\', \''+response.data["path"]+'\')">10</span> &nbsp'+
                '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'50\', \''+response.data["path"]+'\')">50</span> &nbsp'+
                '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'100\', \''+response.data["path"]+'\')">100</span> &nbsp';
            '</td>';
        document.getElementById('analyzer-file-content').innerHTML = html;

        // $('#reload-analyzer').click(function(){ ReloadFilesData(uuid);});
    })
    .catch(function (error) {

    });
}

function ReloadFilesData(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    document.getElementById('analyzer-file-size').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/reloadFilesData/'+uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        var wazuhCount = document.getElementById('wazuh-count-table-value').value;
        for (file in response.data){
            console.log(response.data);
            if (file == "analyzer"){
                var html = ""
                if(response.data[file]["size"] < 0){
                    html = html +'<span class="badge badge-pill bg-danger align-text-bottom text-white">&nbsp</span>';
                }else{
                    if(response.data[file]["size"]<1024){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[file]["size"].toFixed(2)+' Bytes</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data[file]["size"]>=1024 && response.data[file]["size"]<1048576){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1024).toFixed(2)+' kB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data[file]["size"]>=1048576 && response.data[file]["size"]<1073741824){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1048576).toFixed(2)+' MB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                    if(response.data[file]["size"]>=1073741824){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1073741824).toFixed(2)+' GB</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
                }
                document.getElementById('analyzer-file-path').innerHTML = html;
                document.getElementById('analyzer-file-size').value = response.data[file]["size"];
            }else if (file == "wazuh"){
                for (value in response.data[file]){
                    console.log("Value: "+response.data[file][value]);
                    console.log("Path: "+value);

                    for (x = 1; x <= wazuhCount; x++){
                        var htmlWazuh = "";
                        if (value == document.getElementById(x+'-wazuh-files').innerHTML){
                            if(response.data[file][value] < 0){
                                htmlWazuh = htmlWazuh +'<span class="badge badge-pill bg-danger align-text-bottom text-white">&nbsp</span>';
                            }else{
                                if(response.data[file][value]<1024){htmlWazuh = htmlWazuh +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[file][value].toFixed(2)+' Bytes</span>';}
                                if(response.data[file][value]>=1024 && response.data[file][value]<1048576){htmlWazuh = htmlWazuh +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file][value]/1024).toFixed(2)+' kB</span>';}
                                if(response.data[file][value]>=1048576 && response.data[file][value]<1073741824){htmlWazuh = htmlWazuh +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file][value]/1048576).toFixed(2)+' MB</span>';}
                                if(response.data[file][value]>=1073741824){htmlWazuh = htmlWazuh +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file][value]/1073741824).toFixed(2)+' GB</span>';}
                            }
                            document.getElementById('wazuh-file-column-'+x).innerHTML = htmlWazuh; 
                        }
                    }
                }






            }
        }
        $('#reload-analyzer').click(function(){ ReloadFilesData(uuid);});
        $('#reload-wazuh').click(function(){ ReloadFilesData(uuid);});
    })
    .catch(function (error) {
    });
    
    
    
    
    
    // //wazuh
    // //analyzer
    // if (fileSize > response.data["size"]) {
    //     document.getElementById('analyzer-comparative').className = "fas fa-greater-than";
    // }else if (fileSize < response.data["size"]) {
    //     document.getElementById('analyzer-comparative').className = "fas fa-less-than";
    // }else if (fileSize == response.data["size"]) {
    //     document.getElementById('analyzer-comparative').className = "fas fa-equals";
    // }
    // fileSize = response.data["size"];
    // console.log("After: "+fileSize);
}


function loadNetworkValuesService(uuid, name, service, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        var html = '<div class="modal-dialog" id="network-modal-window">'+
          '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
              '<h4 class="modal-title" id="delete-node-header">'+name+' interface</h4>'+
              '<button type="button" class="close" id="btn-select-interface-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" id="delete-node-footer-table">';

                if (response.data.ack == "false"){
                    html = html + '<span><h6>Error loading interfaces</h6></span>';
                } else {
                    html = html + '<table class="table table-hover" style="table-layout: fixed"tyle="table-layout: fixed" style="width:1px">' +
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
                        if(type == "zeek"){
                            html = html + '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-delete-node" onclick="updateNetworkInterface(\''+uuid+'\', \''+type+'\', \''+service+'\')">Save</button>';
                        }else {
                            html = html + '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-delete-node" onclick="saveSuricataInterface(\''+uuid+'\', \''+name+'\', \''+service+'\', \''+type+'\')">Save</button>';
                        }                        
                    }
                html = html + '</div>'+
            '</div>'+

          '</div>'+
        '</div>';

        document.getElementById('modal-window').innerHTML = html;
        // LoadNetworkValuesSelected(uuid);

        $('#modal-window').modal("show");
        $('#btn-select-interface-cross').click(function(){ $('#modal-window').modal("hide"); });
        $('#btn-select-interface-close').click(function(){ $('#modal-window').modal("hide"); });        
    })
    .catch(function (error) {
    });
}

function updateNetworkInterface(uuid, type, service){
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

    // document.getElementById('zeek-interface-'+service).value = value;
    document.getElementById('zeek-interface-config').value = valueSelected;
    document.getElementById('zeek-interface-default').innerHTML = valueSelected;


    var jsonDeploy = {}
    jsonDeploy["value"] = valueSelected;
    jsonDeploy["uuid"] = uuid;
    jsonDeploy["service"] = service;
    var dataJSON = JSON.stringify(jsonDeploy);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        // loadPlugins();
    })
    .catch(function (error) {
    });
}

function saveSuricataInterface(uuid, name, service, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/saveSuricataInterface';

    var valueSelected = "";
    $('input:radio:checked').each(function() {
        if($(this).attr('class') == 'suricata-interface'){
            valueSelected = $(this).prop("value");
        }
    });

    if (type == "suricata"){
        document.getElementById('suricata-interface-'+service).value = valueSelected;
        document.getElementById('suricata-interface-default-'+service).innerHTML = valueSelected;
    }else if (type == "socket-network"){
        document.getElementById('socket-network-interface-'+service).value = valueSelected;
        document.getElementById('socket-network-interface-default-'+service).innerHTML = valueSelected;
    }else if (type == "network-socket"){
        document.getElementById('network-socket-interface-'+service).value = valueSelected;
        document.getElementById('network-socket-interface-default-'+service).innerHTML = valueSelected;
    }


    var jsonSuricataInterface = {}
    jsonSuricataInterface["uuid"] = uuid;
    jsonSuricataInterface["service"] = service;
    jsonSuricataInterface["interface"] = valueSelected;
    jsonSuricataInterface["param"] = "interface";
    var dataJSON = JSON.stringify(jsonSuricataInterface);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        // loadPlugins();
    })
    .catch(function (error) {
    });
}