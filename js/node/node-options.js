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

function loadPlugins(){
    var urlWeb = new URL(window.location.href);
    var name = urlWeb.searchParams.get("node");
    var uuid = urlWeb.searchParams.get("uuid");
    var currenttab = urlWeb.searchParams.get("nodetab");

    document.getElementById('node-config-title').innerHTML = name;

    //SURICATA & ZEEK
            //suricata
            var htmlsuricata = ""+
            '<p><img src="img/suricata.png" alt="" width="30"> &nbsp'+
                '<span id="suricata-current-status" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> &nbsp '+
                    '<i class="fas fa-stop-circle" style="color:grey; cursor:pointer;" id="main-suricata-status-btn" onclick="ChangeMainServiceStatus(\''+uuid+'\', \'status\', \'suricata\')"></i> &nbsp|&nbsp '+
                '<span class="badge bg-success align-text-bottom text-white" id="managed-expert-span" style="cursor:pointer;" onclick="changeSuricataTable(\''+uuid+'\')"></span> &nbsp '+
                // '| <span style="cursor: pointer;" title="Ruleset Management" class="badge bg-primary align-text-bottom text-white" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\', \'main\', \'-\')">Change ruleset</span> &nbsp '+
                // '<b> Current ruleset: </b><i id="current-ruleset-options"></i>'+

                '<button class="btn btn-primary float-right" style="font-size: 15px; display:block;" id="add-suricata-button" onclick="AddServiceModal(\''+uuid+'\', \'suricata\')">Add Suricata</button>'+
            '</p>' +
            '<div id="table-suricata" style="display:block;">'+
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
            '</div>'+
            '<div id="table-suricata-command" style="display:none;">'+
                '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                    '<thead>'+
                        '<th width="10%">PID '+

                        '</th>'+
                        '<th >Command</th>'+
                        '<th width="20%">Actions &nbsp '+
                            '<span style="cursor: pointer;" title="Start Suricata using main.conf" class="badge bg-primary align-text-bottom text-white" onclick="StartSuricataMainConf(\''+uuid+'\')">Start</span> &nbsp '+
                            '<span style="cursor: pointer;" title="Stop Suricata using main.conf" class="badge bg-danger align-text-bottom text-white" onclick="StopSuricataMainConf(\''+uuid+'\')">Stop</span> &nbsp '+
                        '</th>'+
                    '</thead>'+
                    '<tbody id="suricata-table-services-command">'+
                    '</tbody>'+
                '</table>'+
            '</div>';

            //zeek
            var htmlzeek = 
            // '<div id="zeek-managed-mode">'+
                '<div id="zeek-cluster-banner" class="p-3 my-3 border rounded border-warning rounded-sm" style="display: none;">'+
                    '<div class="w-100">'+
                        '<h4 class="mb-0 w-100" style="text-align: center;" id="zeek-banner-main-title">This node belongs to a cluster and is not the manager</h4>'+
                        '<h5 id="zeek-manager-node" class="mb-0 w-100" style="text-align: center;"></h>'+
                    '</div>'+
                '</div>'+
                '<br>';
                
            // '</div>';

            htmlzeek = htmlzeek + 
            '<div id="zeek-standalone-mode">'+

                            '<div><img src="img/zeek.png" alt="" width="30"> &nbsp'+
                                '<span id="zeek-current-status" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> &nbsp '+
                                '<i class="fas fa-stop-circle" style="color:grey; cursor:pointer;" id="main-zeek-status-btn" onclick="ChangeMainServiceStatus(\''+uuid+'\', \'status\', \'zeek\')"></i> &nbsp Enable or Disable OwlH node management of Zeek service when node start/exit'+
                                // '<span id="btn-zeek-node-status" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeZeekStatusTable(\'zeek-status-tab\')">Current status</span> &nbsp '+
                                // '<span id="btn-zeek-node-configuration" class="badge bg-secondary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeZeekStatusTable(\'zeek-configuration-tab\')">Change Zeek configuration</span>'+
                            '</div></br>';

                            // ZEEK STATUS - GLOBAL
                            htmlzeek = htmlzeek + ""+
                            '<div id="zeek-status-tab" style="display:block;">'+
                                '<span id="zeek-configuration" class="badge badge-pill bg-dark align-text-bottom text-white">&nbsp Action: &nbsp '+
                                    '<span style="cursor: pointer;" title="Stop Zeek using main.conf" class="badge bg-danger align-text-bottom text-white" onclick="LaunchZeekMainConf(\''+uuid+'\', \'stop\')">Stop</span> &nbsp '+
                                    '<span style="cursor: pointer;" title="Start Zeek using main.conf" class="badge bg-primary align-text-bottom text-white" onclick="LaunchZeekMainConf(\''+uuid+'\', \'start\')">Start</span> &nbsp '+
                                    '<span style="cursor: pointer;" title="Deploy Zeek using main.conf" class="badge bg-primary align-text-bottom text-white" onclick="LaunchZeekMainConf(\''+uuid+'\', \'deploy\')">Deploy</span> &nbsp '+
                                    '<span style="cursor: pointer;" title="Status Zeek using main.conf" class="badge bg-success align-text-bottom text-white" onclick="PingZeek(\''+uuid+'\')">Refresh Status</span> &nbsp'+
                                    '<span style="cursor: pointer;" title="Diag Zeek using main.conf" class="badge bg-success align-text-bottom text-white" onclick="ZeekDiag(\''+uuid+'\')">Diagnostics</span> &nbsp'+
                                    // ' Save Zeek Data? &nbsp &nbsp &nbsp &nbsp<input class="form-check-input my-0" type="checkbox" id="save-zeek-values">'+
                                '</span>'+
                                '&nbsp <span class="badge badge-pill bg-dark align-text-bottom text-white">View Configuration file: &nbsp '+
                                    '<span id="zeek-node-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'node.cfg\', \''+name+'\', \'disabled\')">Node.cfg</span> &nbsp '+
                                    '<span id="zeek-network-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'networks.cfg\', \''+name+'\', \'disabled\')">Network.cfg</span> &nbsp '+
                                    '<span id="zeek-ctl-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'zeekctl.cfg\', \''+name+'\', \'disabled\')">Zeekctl.cfg</span> &nbsp '+
                                '</span> '+

                                '<div id="status-zeek-table" style="display:block;">'+
                                    '</br><b>Current status</b> &nbsp '+

                                    '<table class="table" id="tb-zeek-current-status" style="table-layout: fixed"  width="100%">'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td width="20%" class="align-middle">Zeek Mode</td>'+
                                                '<td id="zeek-current-mode"></td>'+
                                                // '<td style="color: red;">extra info</td>'+
                                            '</tr>'+
                                            // '<tr>'+
                                            //     '<td width="20%" class="align-middle">Node Role</td>'+
                                            //     '<td id="zeek-role"></td>'+
                                            //     '<td style="color: red;">extra info</td>'+
                                            // '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                                '<div id="status-zeek-detail-table" style="display:block;">'+
                                    '</br><b>Status Detail</b>'+
                                    '<table class="table" id="tb-zeek-current-status" style="table-layout: fixed"  width="100%">'+
                                        '<thead id="">'+
                                            '<th>Name (host)</th>'+
                                            '<th>Status</th>'+
                                            '<th>Type</th>'+
                                            // '<th>Interface</th>'+
                                            '<th>PID</th>'+
                                            '<th>Started</th>'+
                                            // '<th>Extra</th>'+
                                        '</thead>'+
                                        '<tbody id="zeek-status-details">'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+
                            '</div>';

                            // ZEEK CONFIGURATION - GLOBAL
                            htmlzeek = htmlzeek +
                            '<div id="zeek-configuration-tab" style="display:none;">'+
                                '<span id="zeek-configure" class="badge badge-pill bg-dark align-text-bottom text-white">Edit Configuration &nbsp '+
                                    '<span id="zeek-mode-standalone" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeZeekConfigTable(\'standalone-zeek-table\')">Standalone</span> &nbsp '+
                                    '<span id="zeek-mode-cluster" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeZeekConfigTable(\'cluster-zeek-table\')">Cluster</span> &nbsp '+
                                    '<span id="zeek-mode-expert" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeZeekConfigTable(\'expert-zeek-table\')">Expert</span>'+
                                '</span> '+
                                '<span class="badge badge-pill bg-dark align-text-bottom text-white">View Configuration file: &nbsp '+
                                    '<span id="zeek-node-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'node.cfg\', \''+name+'\', \'disabled\')">Node.cfg</span> &nbsp '+
                                    '<span id="zeek-network-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'networks.cfg\', \''+name+'\', \'disabled\')">Network.cfg</span> &nbsp '+
                                    '<span id="zeek-ctl-cfg" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="editFile(\''+uuid+'\', \'zeekctl.cfg\', \''+name+'\', \'disabled\')">Zeekctl.cfg</span> &nbsp '+
                                '</span> ';

                                //zeek expert
                                htmlzeek = htmlzeek +
                                '<div id="expert-zeek-table" style="display:none;">'+
                                    '</br><b>Expert mode</b> <button id="sync-zeek-expert-button" class="btn btn-primary float-right" style="font-size: 15px;" onclick="SyncZeekValues(\''+uuid+'\')">Sync</button>'+
                                    '<table class="table" id="zeek-expert-values" style="table-layout: fixed"  width="100%">'+
                                        '<tbody>';
                                            htmlzeek = htmlzeek +
                                            //node.cfg
                                            '<tr>'+
                                                '<td width="20%" class="align-middle">Node.cfg file &nbsp '+
                                                    '<i class="fas fa-edit" onclick="showEditValues(\'node-edit-row\')" style="color:Dodgerblue; cursor: pointer;" title="Edit Master node.cfg path"></i> &nbsp'+
                                                    '<i class="fas fa-eye" style="color:Dodgerblue; cursor: pointer;" title="Edit Master node.cfg file" onclick="showMasterFile(\'nodeConfig\')"></i> '+
                                                '</td>'+
                                                '<td>node.cfg path</td>'+
                                                '<td style="color: red;" id="zeek-expert-values-node">No Zeek node.cfg...</td>'+
                                            '</tr>'+
                                            '<tr id="node-edit-row" style="display:none;" bgcolor="#f6ddcc">'+
                                                '<td colspan="2"><input class="form-control" id="expert-zeek-path-node-edit"></input></td>'+
                                                '<td class="align-middle">'+
                                                    '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="saveZeekValues(\''+uuid+'\', \'nodeConfig\')">Save</button>'+
                                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditValues(\'node-edit-row\')">Close</button>'+
                                                '</td>'+
                                            '</tr>'+
                                            //networks.cfg
                                            '<tr>'+
                                                '<td width="20%" class="align-middle">Networks.cfg file &nbsp '+
                                                    '<i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Upload networks.cfg file" onclick="showEditValues(\'networks-edit-row\')"></i> &nbsp'+
                                                    '<i class="fas fa-eye" style="color:Dodgerblue; cursor: pointer;" title="Edit Master networks.cfg file" onclick="showMasterFile(\'networksConfig\')"></i> '+
                                                '</td>'+
                                                '<td>network.cfg path</td>'+
                                                '<td id="zeek-expert-values-networks" style="color: red;" >No Zeek networks.cfg...</td>'+
                                            '</tr>'+
                                            '<tr id="networks-edit-row" style="display:none;" bgcolor="#f6ddcc">'+
                                                '<td colspan="2"><input class="form-control" id="expert-zeek-path-networks-edit"></input></td>'+
                                                '<td class="align-middle">'+
                                                    '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="saveZeekValues(\''+uuid+'\', \'networksConfig\')">Save</button>'+
                                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditValues(\'networks-edit-row\')">Close</button>'+
                                                '</td>'+
                                            '</tr>'+
                                            //policies
                                            '<tr>'+
                                                '<td width="20%" class="align-middle" rowspan="2">Policies &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Zeek paths" onclick="showEditValues(\'zeek-edit-policies-row\')"></i> </td>'+
                                                '<td>Master path</td>'+
                                                '<td style="color: red;" id="zeek-expert-values-policies-master">No Zeek master path...</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td>Node path</td>'+
                                                '<td style="color: red;" id="zeek-expert-values-policies-node">No Zeek node path...</td>'+
                                            '</tr>'+
                                            '<tr id="zeek-edit-policies-row" style="display:none;" bgcolor="#f6ddcc">'+
                                                '<td colspan="2">'+
                                                    'Master: <input class="form-control" id="expert-zeek-path-policies-master">'+
                                                    'Node: <input class="form-control" id="expert-zeek-path-policies-node">'+
                                                '</td>'+
                                                '<td width="10%">'+
                                                    '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="saveZeekValues(\''+uuid+'\', \'policies\')">Save</button>'+
                                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditValues(\'zeek-edit-policies-row\')">Close</button> &nbsp '+
                                            '</td>'+
                                            '</tr>'+
                                            //variables
                                            '<tr>'+
                                                '<td width="20%" class="align-middle" rowspan="2">Variables &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Zeek variables" onclick="showEditValues(\'zeek-edit-variables-row\')"></i> </td>'+
                                                '<td>Variable 1</td>'+
                                                '<td id="zeek-expert-values-var-1" style="color: red;">No Zeek variable 1...</td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td>Variable 2</td>'+
                                                '<td id="zeek-expert-values-var-2" style="color: red;">No Zeek variable 2...</td>'+
                                            '</tr>'+
                                            '<tr id="zeek-edit-variables-row" style="display:none;" bgcolor="#f6ddcc">'+
                                                '<td colspan="2">'+
                                                    'Variable 1: <input class="form-control" id="expert-zeek-path-var-1">'+
                                                    'Variable 2: <input class="form-control" id="expert-zeek-path-var-2">'+
                                                '</td>'+
                                                '<td width="10%">'+
                                                    '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="saveZeekValues(\''+uuid+'\', \'variables\')">Save</button>'+
                                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditValues(\'zeek-edit-variables-row\')">Close</button> &nbsp '+
                                            '</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                    //Zeek cluster
                                    '<table id="cluster-elements" class="table" style="table-layout: fixed" width="100%">'+
                                    '</table>'+
                                '</div>';

                                //Zeek standalone
                                htmlzeek = htmlzeek +
                                '<div id="standalone-zeek-table">'+
                                    // '<button id="add-zeek-button" class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddServiceModal(\''+uuid+'\', \'zeek\')">Add Zeek</button>'+
                                    '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                                    '<thead id="">'+
                                        '<th>Description</th>'+
                                        '<th>Interface</th>'+
                                        '<th>Actions</th>'+
                                    '</thead>'+
                                    '<tbody id="zeek-table-services">'+
                                    '</tbody>'+
                                    '</table>'+
                                '</div>';

                                //zeek cluster
                                htmlzeek = htmlzeek +
                                '<div id="cluster-zeek-table" class="cluster"><br>'+
                                    '<button id="sync-zeek-cluster" class="btn btn-primary float-right" style="font-size: 15px;" onclick="ModalSyncCluster(\''+uuid+'\')">Sync cluster</button>'+
                                    '<div>'+
                                        '<div>'+
                                            '<b style="display:inline;">Manager</b>'+
                                        '</div>'+
                                        '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                                            '<thead>'+
                                                '<th>Host</th>'+
                                                '<th>Actions</th>'+
                                            '</thead>'+
                                            '<tbody id="zeek-table-manager">'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</div></br>'+
                                    '<div>'+
                                        '<div>'+
                                            '<b style="display:inline;">Logger</b>'+
                                        '</div>'+
                                        '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                                            '<thead>'+
                                                '<th>Host</th>'+
                                                '<th>Actions</th>'+
                                            '</thead>'+
                                            '<tbody id="zeek-table-logger">'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</div></br>'+
                                    '<div>'+
                                        '<div><b style="display:inline;">Proxy</b><button class="btn btn-primary float-right" onclick="ModalAddClusterValue(\''+uuid+'\', \'proxy\')">Add proxy</button>'+
                                        '</div>'+
                                        '<table class="table table-hover" style="table-layout: fixed;" width="100%">'+
                                            '<thead>'+
                                                '<th>Name</th>'+
                                                '<th>Host</th>'+
                                                '<th>Actions</th>'+
                                            '</thead>'+
                                            '<tbody id="zeek-table-proxy">'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</div></br>'+
                                    '<div>'+
                                        '<div><b style="display:inline;">Worker</b><button class="btn btn-primary float-right" onclick="ModalAddClusterValue(\''+uuid+'\', \'worker\')">Add worker</button>'+
                                        '</div>'+
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
                            '</div>'+
                            '<div id="zeek-diag-body" style="display:block;"></div>'+
            '</div>';

    //wazuh
    var htmlwazuh = ""+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'transport\',\''+uuid+'\')"><b>Transport</b> <i class="fas fa-sort-down" id="transport-form-icon-'+uuid+'"></i></h6>'+
        '<span id="transport-form-'+uuid+'" style="display:block"><br>'+
            '<p><img src="img/wazuh.png" alt="" width="30"> '+
            '<span id="'+uuid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> | ' +
            '<span style="font-size: 15px; color: grey;">                                  ' +
                '<i class="fas fa-stop-circle" style="cursor: pointer;" id="'+uuid+'-wazuh-icon"></i> &nbsp' +
                '<i class="fas fa-sync-alt" style="cursor: pointer;" title="Reload Wazuh information" id="reload-wazuh" onclick="ReloadFilesData(\''+uuid+'\')"></i>' +
                ' <a style="color:black;">|</a> <span style="cursor: pointer;" title="Edit main Wazuh config file" class="badge bg-primary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\',\'none\',\'/var/ossec/etc/ossec.conf\')">Edit ossec.conf file</span>'+
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
                                    '<button type="button" class="btn btn-primary float-right mr-1" style="font-size: 15px;" onclick="addNewWazuhPath(\''+uuid+'\')">Save</button> &nbsp'+
                                    '<button type="button" class="btn btn-danger float-right mr-1" style="font-size: 15px;" id="wazuh-close-button" onclick="hideInputAreaValue(\'wazuh-insert\')">Cancel</button>'+ //onoclick="hideInputAreaValue(\'wazuh-insert\')"
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                    '</tbody>'+
                '</table>'+
            '</div>'+
        '</span>'+
    '</div>';
    //STAP - traffic management
    var htmlstap = ""+
    '<div class="float-right" id="stap-installed-status" style="display:none;">'+
        '<b>SOCAT:</b> <span id="stap-installed-socat" class="badge bg-primary align-text-bottom text-white"></span> &nbsp'+
        '<b>TCPREPLAY:</b> <span id="stap-installed-tcpreplay" class="badge bg-primary align-text-bottom text-white"></span> &nbsp'+
        '<b>TCPDUMP:</b> <span id="stap-installed-tcpdump" class="badge bg-primary align-text-bottom text-white"></span> &nbsp'+
    '</div>'+
    '<br>'+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'plugins\',\''+uuid+'\')"><b>Traffic Management</b> <i class="fas fa-sort-down" id="plugins-form-icon-'+uuid+'"></i></h6>'+
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
    '</div>';
    //analyzer
    var htmlanalyzer = ""+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'analyzer\',\''+uuid+'\')"><b>Analyzer</b> <i class="fas fa-sort-down" id="analyzer-form-icon-'+uuid+'"></i></h6>'+
        '<span id="analyzer-form-'+uuid+'" style="display:block"><br>'+
            '<table width="100%" tyle="table-layout: fixed">'+
                '<tr>'+
                    '<td width="25%"><img src="img/favicon.ico" height="25"> Analyzer</th>'+
                    '<td width="25%">Status: <span id="analyzer-status-'+uuid+'" title="Change analyzer status"></span></td>'+
                    '<td width="25%">Start/Stop: <i style="color: grey; padding-left:3px; cursor: pointer;" id="analyzer-status-btn-'+uuid+'" onclick="ChangeAnalyzerStatus(\''+uuid+'\')"></i></td>'+
                    '<td width="25%"><button class="btn btn-primary float-right" title="Edit analyzer" onclick="editFile(\''+uuid+'\', \'analyzer\', \''+name+'\', \'enabled\')">Edit Analyzer</button></td>'+
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
    '</div>';
    // //knownports
    // '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
    //     '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'knownports\',\''+uuid+'\')"><b>Knownports</b> <i class="fas fa-sort-down" id="knownports-form-icon-'+uuid+'"></i></h6>'+
    //     '<span id="knownports-form-'+uuid+'" style="display:block"><br>'+
    //         '<table width="100%" tyle="table-layout: fixed">'+
    //             '<tr>'+
    //                 '<td width="25%"><img src="img/favicon.ico" height="25"> Knownports</th>'+
    //                 '<td width="25%">Status: <i id="ports-status-'+uuid+'"">[N/A]</i></td>'+
    //                 '<td width="25%">Start/Stop: <i style="color: grey; padding-left:3px; cursor: pointer;" id="ports-status-btn-'+uuid+'" onclick="ChangeStatus(\''+uuid+'\')"></i></td>'+
    //                 '<td width="25%">Mode: <i style="cursor: default; color: grey; cursor: pointer;" title="port mode" id="ports-mode-'+uuid+'" onclick="ChangeMode(\''+uuid+'\')">[mode error]</i></td>'+
    //                 '<td width="25%">Ports: <i style="cursor: default; color: grey; cursor: pointer;" title="Show ports" id="show-ports-plugin" onclick="showPorts(\''+uuid+'\')">[Ports]</i></td>'+
    //             '</tr>'+
    //         '</table>'+
    //     '</span>'+
    // '</div>';
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
    document.getElementById('pills-suricata').innerHTML = htmlsuricata;
    document.getElementById('pills-zeek').innerHTML = htmlzeek;
    document.getElementById('pills-stap').innerHTML = htmlstap;
    document.getElementById('pills-wazuh').innerHTML = htmlwazuh;
    document.getElementById('pills-analyzer').innerHTML = htmlanalyzer;

    PingWazuh(uuid);
    PingWazuhFiles(uuid);
    PingAnalyzer(uuid);
    // PingPorts(uuid);
    GetMainconfData(uuid);
    // PingDataflow(uuid);
    PingPluginsNode(uuid);
    PingPluginsMaster();
    PingCluster(uuid);
    getCurrentRulesetName(uuid);
    PingZeek(uuid);

    $('#show-collector-info').click(function(){ showCollector(uuid);});
    $('#show-ports-plugin').click(function(){ showPorts(uuid);});
    $('#show-wazuh-add-file').click(function(){ $('#wazuh-insert').show(); });

    if (currenttab == "zeek"){ 
        $('#pills-zeek-tab').click();
    }
    if (currenttab == "suricata"){ 
        $('#pills-suricata-tab').click();
    }
    if (currenttab == "wazuh"){ 
        $('#pills-wazuh-tab').click();
    }
    if (currenttab == "stap"){ 
        $('#pills-stap-tab').click();
    }
    if (currenttab == "analyzer"){ 
        $('#pills-analyzer-tab').click();
    }

}
function GetCommandsLog(uuid,service, name){
    document.location.href = 'https://' + location.host + '/service-commands.html?node='+uuid+'&service='+service+'&name='+name;
}
function showMasterFile(param){
    document.location.href = 'https://' + location.host + '/edit-master.html?file='+param;
}

function hideEditValues(id){
    $('#'+id).hide();
}
function showEditValues(id){
    $('#'+id).show();
}

function SyncZeekValues(uuid){
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/zeek/syncZeekValues';

    var jsonService = {}
    jsonService["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonService);
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
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Sync Zeek values error: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> All Zeek Files synchronized successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Sync Zeek values error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
    });
}

function changeSuricataTable(uuid){
    var suricata = document.getElementById('table-suricata');
    var command = document.getElementById('table-suricata-command');
    var suricataButton = document.getElementById('add-suricata-button');
    if(suricata.style.display == "block"){
        suricataButton.style.display = "none";
        suricata.style.display = "none";
        command.style.display = "block";
    }else{
        suricataButton.style.display = "block";
        suricata.style.display = "block";
        command.style.display = "none";
    }

    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/plugin/changeSuricataTable';

    var suricataStatus = document.getElementById('table-suricata');
    var jsonService = {}
    jsonService["uuid"] = uuid;
    if (suricataStatus.style.display == "none"){
        jsonService["status"] = "expert";
    }else if (suricataStatus.style.display == "block"){
        jsonService["status"] = "none";
    }
    var dataJSON = JSON.stringify(jsonService);
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
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change plugin status error: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                loadPlugins();
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change plugin status error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
    });

}

function hideInputAreaValue(key){
    document.getElementById(key).style.display = "none";
}

function addNewWazuhPath(uuid){
    if (document.getElementById("wazuh-add-line").value == ""){
        $('#wazuh-add-line').css('border', '2px solid red');
        $('#wazuh-add-line').attr("placeholder", "Please, insert a valid path");
    }else{
        $("#wazuh-insert").hide();
        var html = ""
        document.getElementById("wazuh-count-table-value").value++;
        var count = document.getElementById("wazuh-count-table-value").value;
        var contentInput = document.getElementById("wazuh-add-line").value.trim();
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

function PingPluginsMaster(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/pingPlugins';

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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> PingPluginsMaster error: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                for(id in response.data){
                    if(id=="zeek"){
                        //table text
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-node").innerHTML = response.data[id]["nodeConfig"]; $("#zeek-expert-values-node").css('color', '');}
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-networks").innerHTML = response.data[id]["networksConfig"]; $("#zeek-expert-values-networks").css('color', '');}
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-policies-master").innerHTML = response.data[id]["policiesMaster"]; $("#zeek-expert-values-policies-master").css('color', '');}
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-policies-node").innerHTML = response.data[id]["policiesNode"]; $("#zeek-expert-values-policies-node").css('color', '');}
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-var-1").innerHTML = response.data[id]["variables1"]; $("#zeek-expert-values-var-1").css('color', '');}
                        if(response.data[id]["nodeConfig"] != ""){document.getElementById("zeek-expert-values-var-2").innerHTML = response.data[id]["variables2"]; $("#zeek-expert-values-var-2").css('color', '');}
                        //edit fields
                        document.getElementById("expert-zeek-path-node-edit").value = response.data[id]["nodeConfig"].trim();
                        document.getElementById("expert-zeek-path-networks-edit").value = response.data[id]["networksConfig"].trim();
                        document.getElementById("expert-zeek-path-policies-master").value = response.data[id]["policiesMaster"].trim();
                        document.getElementById("expert-zeek-path-policies-node").value = response.data[id]["policiesNode"].trim();
                        document.getElementById("expert-zeek-path-var-1").value = response.data[id]["variables1"].trim();
                        document.getElementById("expert-zeek-path-var-2").value = response.data[id]["variables2"].trim();
                    }
                }
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> PingPluginsMaster error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change Zeek mode error: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                loadPlugins();
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change Zeek mode error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                loadPlugins();
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change main service status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function getCurrentRulesetName(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/' + uuid;
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
            axios.get('https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/name/' + response.data, {
                headers:{
                    'token': document.cookie,
                    'user': payload.user
                    
                }
            })
            .then(function (response2) {
                if(response2.data == ""){
                    document.getElementById('current-ruleset-options').innerHTML = "No ruleset selected...";
                    document.getElementById('current-ruleset-options').style.color = "red";
                    // document.getElementById('current-ruleset').innerHTML = "No ruleset selected...";
                    // document.getElementById('current-ruleset').style.color = "red";
                }else{
                    document.getElementById('current-ruleset-options').innerHTML = response2.data;
                    axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/PingPluginsNode/'+uuid, {
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
                            // for (line in response.data){
                            //     if (response.data[line]["type"] == "suricata"){
                            //         // document.getElementById('suricata-ruleset-'+line).innerHTML = response2.data;
                            //         // document.getElementById('suricata-ruleset-edit-'+line).value = response2.data;

                            //     }
                            // }
                        }
                    })
                    .catch(function (error) {
                    });
                }
            })
            .catch(function (error) {
            });
        }
    })
    .catch(function (error) {

    });
}

async function GetMainconfData(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    var count = 0;
    await axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/PingPluginsNode/'+uuid, {
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
            for (line in response.data){
                if(response.data[line]["command"]){count++;}
            }
            document.getElementById('expert-number-services').value = count;
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>GetMainconfData Error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/getMainconfData/'+uuid;
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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            for (service in response.data){
                if(service == "suricata"){
                    document.getElementById('managed-expert-span').innerHTML = 'To expert ('+count+')';
                    document.getElementById('table-suricata').style.display = 'block';
                    document.getElementById('table-suricata-command').style.display = 'none';
                    if(response.data[service]["status"] == "disabled"){
                        document.getElementById('suricata-current-status').className = 'badge badge-pill bg-danger align-text-bottom text-white';
                        document.getElementById('suricata-current-status').innerHTML = 'Disabled';
                        document.getElementById('main-suricata-status-btn').className = 'fas fa-play-circle';
                    }else if(response.data[service]["status"] == "enabled"){
                        document.getElementById('suricata-current-status').className = 'badge badge-pill bg-success align-text-bottom text-white';
                        document.getElementById('main-suricata-status-btn').className = 'fas fa-stop-circle';
                        document.getElementById('suricata-current-status').innerHTML = 'Enabled';
                    }else if(response.data[service]["status"] == "expert"){
                        document.getElementById('suricata-current-status').className = 'badge badge-pill bg-warning align-text-bottom text-white';
                        document.getElementById('table-suricata').style.display = 'none';
                        document.getElementById('add-suricata-button').style.display = 'none';
                        document.getElementById('table-suricata-command').style.display = 'block';
                        document.getElementById('suricata-current-status').innerHTML = 'Expert';
                        document.getElementById('managed-expert-span').innerHTML = 'To managed';
                        document.getElementById('main-suricata-status-btn').style.display = 'none';
                    }else{
                        document.getElementById('suricata-current-status').className = 'badge badge-pill bg-dark align-text-bottom text-white';
                        document.getElementById('suricata-current-status').innerHTML = 'N/A';
                        document.getElementById('main-suricata-status-btn').className = 'fas fa-play-circle';
                    }
                }else if(service == "zeek"){
                    if(response.data[service]["status"] == "disabled"){
                        document.getElementById('main-zeek-status-btn').className = 'fas fa-play-circle';
                        document.getElementById('zeek-current-status').className = 'badge badge-pill bg-danger align-text-bottom text-white';
                        document.getElementById('zeek-current-status').innerHTML = 'Management disabled';
                    }else if(response.data[service]["status"] == "enabled"){
                        document.getElementById('main-zeek-status-btn').className = 'fas fa-stop-circle';
                        document.getElementById('zeek-current-status').className = 'badge badge-pill bg-success align-text-bottom text-white';
                        document.getElementById('zeek-current-status').innerHTML = 'Management enabled';
                    }
                    if(response.data[service]["mode"] == "standalone"){
                        // document.getElementById('zeek-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white standalone';
                        document.getElementById('zeek-mode-standalone').disabled = true;
                        // document.getElementById('zeek-mode-cluster').onclick = function(){ChangeZeekMode(uuid, "cluster");};
                        // document.getElementById('standalone-zeek-table').style.display = "block";
                        // document.getElementById('cluster-zeek-table').style.display = "none";
                    }else if(response.data[service]["mode"] == "cluster"){
                        // document.getElementById('zeek-mode-cluster').className = 'badge bg-secondary align-text-bottom text-white cluster';
                        document.getElementById('zeek-mode-cluster').disabled = true;
                        // document.getElementById('zeek-mode-standalone').onclick = function(){ChangeZeekMode(uuid, "standalone");};
                        // document.getElementById('standalone-zeek-table').style.display = "none";
                        // document.getElementById('cluster-zeek-table').style.display = "block";
                    }
                }
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Get main conf data: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            '<input type="text" class="form-control" id="new-cluster-host" value=""><br>';
            if (type == "worker"){
                html = html + '<p>Insert the interface:</p>'+
                    '<input type="text" class="form-control" id="new-cluster-interface" value="">';
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
    if(type == "proxy"){
        $('#add-cluster-modal').click(function(){ AddClusterValue(uuid, type, document.getElementById('new-cluster-host').value.trim(), ""); });
    }else if(type == "worker"){
        $('#add-cluster-modal').click(function(){ AddClusterValue(uuid, type, document.getElementById('new-cluster-host').value.trim(), document.getElementById('new-cluster-interface').value.trim()); });
    }     
    $('#add-cluster-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#add-cluster-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function ChangeZeekConfigTable(tab){
    if (tab == "standalone-zeek-table"){
        document.getElementById('standalone-zeek-table').style.display = 'block';
        document.getElementById('cluster-zeek-table').style.display = 'none';
        document.getElementById('expert-zeek-table').style.display = 'none';

        document.getElementById('zeek-mode-standalone').className = 'badge bg-primary align-text-bottom text-white';
        document.getElementById('zeek-mode-cluster').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('zeek-mode-expert').className = 'badge bg-secondary align-text-bottom text-white';
    } else if (tab == "cluster-zeek-table") {
        document.getElementById('standalone-zeek-table').style.display = 'none';
        document.getElementById('cluster-zeek-table').style.display = 'block';
        document.getElementById('expert-zeek-table').style.display = 'none';

        document.getElementById('zeek-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('zeek-mode-cluster').className = 'badge bg-primary align-text-bottom text-white';
        document.getElementById('zeek-mode-expert').className = 'badge bg-secondary align-text-bottom text-white';
    } else if (tab == "expert-zeek-table") {
        document.getElementById('standalone-zeek-table').style.display = 'none';
        document.getElementById('cluster-zeek-table').style.display = 'none';
        document.getElementById('expert-zeek-table').style.display = 'block';

        document.getElementById('zeek-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('zeek-mode-cluster').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('zeek-mode-expert').className = 'badge bg-primary align-text-bottom text-white';
    }
}

function ChangeZeekStatusTable(tab){
    if (tab == "zeek-status-tab"){
        document.getElementById('zeek-status-tab').style.display = 'block';
        document.getElementById('zeek-configuration-tab').style.display = 'none';


        document.getElementById('btn-zeek-node-status').className = 'badge bg-primary align-text-bottom text-white';
        // document.getElementById('btn-zeek-node-configuration').className = 'badge bg-secondary align-text-bottom text-white';
    } else if (tab == "zeek-configuration-tab") {
        document.getElementById('zeek-status-tab').style.display = 'none';
        document.getElementById('zeek-configuration-tab').style.display = 'block';

        document.getElementById('btn-zeek-node-status').className = 'badge bg-secondary align-text-bottom text-white';
        // document.getElementById('btn-zeek-node-configuration').className = 'badge bg-primary align-text-bottom text-white';
    }
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

function saveZeekValues(uuid, param){
    if(param == "nodeConfig" && document.getElementById('expert-zeek-path-node-edit').value=="" || param == "networksConfig" && document.getElementById('expert-zeek-path-networks-edit').value=="" || param == "policies" && document.getElementById('expert-zeek-path-policies-master').value=="" ||
        param == "policies" && document.getElementById('expert-zeek-path-policies-node').value=="" || param == "variables" && document.getElementById('expert-zeek-path-var-1').value=="" || param == "variables" && document.getElementById('expert-zeek-path-var-2').value==""){
            if (param == "nodeConfig" && document.getElementById('expert-zeek-path-node-edit').value == ""){
                $('#expert-zeek-path-node-edit').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-node-edit').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-node-edit').css('border', '2px solid #ced4da');
            }
            if (param == "networksConfig" && document.getElementById('expert-zeek-path-networks-edit').value == ""){
                $('#expert-zeek-path-networks-edit').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-networks-edit').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-networks-edit').css('border', '2px solid #ced4da');
            }
            if (param == "policies" && document.getElementById('expert-zeek-path-policies-master').value == ""){
                $('#expert-zeek-path-policies-master').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-policies-master').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-policies-master').css('border', '2px solid #ced4da');
            }
            if (param == "policies" && document.getElementById('expert-zeek-path-policies-node').value == ""){
                $('#expert-zeek-path-policies-node').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-policies-node').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-policies-node').css('border', '2px solid #ced4da');
            }
            if (param == "variables" && document.getElementById('expert-zeek-path-var-1').value == ""){
                $('#expert-zeek-path-var-1').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-var-1').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-var-1').css('border', '2px solid #ced4da');
            }
            if (param == "variables" && document.getElementById('expert-zeek-path-var-2').value == ""){
                $('#expert-zeek-path-var-2').attr("placeholder", "Please, insert value");
                $('#expert-zeek-path-var-2').css('border', '2px solid red');
            }else{
                $('#expert-zeek-path-var-2').css('border', '2px solid #ced4da');
            }
    }else{
        //clean input fields
        $('#expert-zeek-path-node-edit').css('border', '2px solid #ced4da');        $('#expert-zeek-path-node-edit').attr("placeholder", "");           hideEditValues('node-edit-row');
        $('#expert-zeek-path-network-edit').css('border', '2px solid #ced4da');     $('#expert-zeek-path-network-edit').attr("placeholder", "");        hideEditValues('networks-edit-row');
        $('#expert-zeek-path-policies-master').css('border', '2px solid #ced4da');  $('#expert-zeek-path-policies-master').attr("placeholder", "");     hideEditValues('zeek-edit-policies-row');
        $('#expert-zeek-path-policies-node').css('border', '2px solid #ced4da');    $('#expert-zeek-path-policies-node').attr("placeholder", "");       hideEditValues('zeek-edit-policies-row');
        $('#expert-zeek-path-var-2').css('border', '2px solid #ced4da');            $('#expert-zeek-path-var-1').attr("placeholder", "");               hideEditValues('zeek-edit-variables-row');
        $('#expert-zeek-path-var-1').css('border', '2px solid #ced4da');            $('#expert-zeek-path-var-2').attr("placeholder", "");               hideEditValues('zeek-edit-variables-row');

        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/zeek/saveZeekValues';

        var jsonCluster = {}
        jsonCluster["uuid"] = uuid;
        jsonCluster["param"] = param;
        if(param == "nodeConfig"){
            jsonCluster["nodeConfig"] = document.getElementById('expert-zeek-path-node-edit').value;
        }else if(param == "networksConfig"){
            jsonCluster["networksConfig"] = document.getElementById('expert-zeek-path-networks-edit').value;
        }else if(param == "policies"){
            jsonCluster["policiesMaster"] = document.getElementById('expert-zeek-path-policies-master').value;
            jsonCluster["policiesNode"] = document.getElementById('expert-zeek-path-policies-node').value;
        }else if(param == "variables"){
            jsonCluster["variables1"] = document.getElementById('expert-zeek-path-var-1').value;
            jsonCluster["variables2"] = document.getElementById('expert-zeek-path-var-2').value;
        }
        var dataJSON = JSON.stringify(jsonCluster);
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
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Save Zeek value: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Zeek Value saves successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);

                    PingPluginsMaster();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save Zeek value: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete cluster value: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Cluster Synchronize successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Delete cluster value: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function AddClusterValue(uuid, type, host, interface){
    if (((type == "proxy")&&(host == ""))||(((type == "worker")&&(host == "" || interface == "")))){
        if ((type == "proxy")&&(host == "")){
            $('#new-cluster-host').attr("placeholder", "Please, insert a valid host");
            $('#new-cluster-host').css('border', '2px solid red');
        }else{
            $('#new-cluster-host').css('border', '2px solid #ced4da');
        }
        if ((type == "worker")&&(host == "" || interface == "")){
            if(host == ""){
                $('#new-cluster-host').attr("placeholder", "Please, insert a valid host");
                $('#new-cluster-host').css('border', '2px solid red');
            }else{
                $('#new-cluster-host').css('border', '2px solid #ced4da');
            }
            if(interface == ""){
                $('#new-cluster-interface').attr("placeholder", "Please, insert a valid interface");
                $('#new-cluster-interface').css('border', '2px solid red');
            }else{
                $('#new-cluster-interface').css('border', '2px solid #ced4da');
            }
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
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Add cluster value: '+response.data.error+'.'+
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
                '<strong>Error!</strong> Add cluster value: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Ping Zeek cluster: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Ping Zeek cluster: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            '<input type="text" class="form-control" id="edit-cluster-host" value=""><br>';
            if (type.includes("worker")){
            html = html + '<p>Insert the interface:</p>'+
                '<input type="text" class="form-control" id="edit-cluster-interface" value="">';
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
    if (host == "" ||  interface == ""){
        $('#edit-cluster-host').css('border', '2px solid red');
        if ((type.includes("proxy"))&&(host == "")){
            $('#edit-cluster-host').attr("placeholder", "Please, insert a valid host");
            $('#edit-cluster-host').css('border', '2px solid red');
        }else{
            $('#edit-cluster-host').css('border', '2px solid #ced4da');
        }
        if ((type.includes("worker"))&&(host == "" || interface == "")){
            if(host == ""){
                $('#edit-cluster-host').attr("placeholder", "Please, insert a valid host");
                $('#edit-cluster-host').css('border', '2px solid red');
            }else{
                $('#edit-cluster-host').css('border', '2px solid #ced4da');
            }
            if(interface == ""){
                $('#edit-cluster-interface').attr("placeholder", "Please, insert a valid interface");
                $('#edit-cluster-interface').css('border', '2px solid red');
            }else{
                $('#edit-cluster-interface').css('border', '2px solid #ced4da');
            }
        }
    }else{
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
                if (response.data.ack == "false") {
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Edit cluster value: '+response.data.error+'.'+
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
                '<strong>Error!</strong> Edit cluster value: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete cluster value: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Delete cluster value: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function PingDataflow(uuid){
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
            document.getElementById('collect-'+response.data["collect"]["value"]).checked = "true";
            document.getElementById('analysis-'+response.data["analysis"]["value"]).checked = "true";
            document.getElementById('transport-'+response.data["transport"]["value"]).checked = "true";
        }
    })
    .catch(function (error) {
    });
}

function loadFilesURL(uuid, nodeName){
    document.location.href = 'https://' + location.host + '/files.html?uuid='+uuid+'&node='+nodeName;
}
function loadEditURL(uuid, nodeName){
    document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+nodeName+'&node='+nodeName;
}
function editFile(uuid, file, nodeName, status){
    document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
}
function editFileBack(uuid, file, nodeName, status, tab){
    document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName+'&tab='+tab;
}
// function editFile(uuid, file, nodeName, status){
//     document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName+'&status='+status;
// }

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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change analyzer status: '+response.data.error+'.'+
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
            '<strong>Error!</strong>  Change analyzer status: '+response.data.error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Deploy node: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Deploy node: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function LaunchZeekMainConf(uuid, param) {
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/LaunchZeekMainConf';

    
    var jsonValues = {}
    jsonValues["uuid"] = uuid;
    jsonValues["param"] = param;
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
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                if(response.data != null){
                    if (response.data.ack == "false") {
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error!</strong> Launch Zeek main conf: '+response.data.error+'.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                    }else{
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-success alert-dismissible fade show">'+
                            '<strong>Success!</strong> Zeek main conf changed successfully!'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);

                        //reload Zeek Status
                        PingZeek(uuid);
                    }
                }
            }
        })
        .catch(function error(error) {
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Launch Zeek main conf: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

//Stop suricata using kill -9
function StartSuricataMainConf(uuid) {
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StartSuricataMain';
    var jsonValues = {}
    jsonValues["uuid"] = uuid;
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
                        '<strong>Error!</strong> Start Suricata main conf: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);   
                }else{
                    location.reload(); 
                }
            }
        })
        .catch(function error(error) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Start Suricata main conf: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

//Stop suricata using main.conf
function StopSuricataMainConf(uuid) {
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopSuricataMain';
    var jsonValues = {}
    jsonValues["uuid"] = uuid;
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
                    '<strong>Error!</strong> Stop Suricata main conf: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    location.reload(); 
                }
            }
        })
        .catch(function error(error) {
            document.getElementById('progressBar-options').style.display = "none";
            document.getElementById('progressBar-options-div').style.display = "none";
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Suricata main conf: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

//Stop suricata using kill -9
function KillSuricataMainConf(uuid, pid) {
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/KillSuricataMain';
    var jsonValues = {}
    jsonValues["uuid"] = uuid;
    jsonValues["pid"] = pid;
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
                    '<strong>Error!</strong> Kill Suricata main conf: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                location.reload(); 
            }
        }
    })
    .catch(function error(error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Kill Suricata main conf: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

//Stop suricata using kill -9
function ReloadSuricataMainConf(uuid, pid) {
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/ReloadSuricataMain';
    var jsonValues = {}
    jsonValues["uuid"] = uuid;
    jsonValues["pid"] = pid;
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
                    '<strong>Error!</strong> Reload Suricata main conf response: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                location.reload(); 
            }
        }
    })
    .catch(function error(error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Reload Suricata main conf: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}


//Stop suricata system
function StopSuricata(uuid) {
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/StopSuricata/' + uuid;
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
                    '<strong>Error!</strong> Stop Suricata: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
    })
    .catch(function error(error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop Suricata: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        '<input type="text" class="form-control" id="new-service-name" value="">'+
      '</div>'+

      '<div class="modal-footer" id="sync-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" id="add-service-modal-close">Cancel</button>'+
        '<button type="button" class="btn btn-primary" id="add-service-modal">Add</button>'+
      '</div>'+

    '</div>'+
  '</div>';
  $('#modal-window').modal("show");
  $('#add-service-modal').click(function(){ AddPluginService(uuid, document.getElementById('new-service-name').value.trim(), type); });
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
            '<input type="text" class="form-control" id="soft-tap-name" value=""><br>'+
        '<p>Define listening port:</p>'+
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
                '<input type="text" class="form-control" id="soft-tap-bpf" value=""><br>';
        }else if (type == "network-socket"){
            html = html + '<p>Select collector:</p>'+
                '<input type="text" class="form-control" id="soft-tap-collector" value="192.168.1.100"><br>'+
            '<p>Insert BPF:</p>'+
                '<input type="text" class="form-control" id="soft-tap-bpf-socket" value=""><br>';
        }
        if (type != "socket-pcap"){
            html = html + '<p>Forward traffic to interface:</p>'+
            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<tbody id="socket-network-modal-table">' +
                '</tbody>'+
            '</table>';
            axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid, {
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
                    var isChecked = false;
                    var inner = "";
                    var count = 0;
                    for (net in response.data){
                        count++;
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

                    if(count == 0){
                        var content = '&nbsp <i style="cursor:pointer; color:orange" class="fas fa-exclamation-triangle fa-lg" onclick="GetCommandsLog(\''+uuid+'\', \'interface\', \'interface\')"></i>'+
                            '&nbsp <span style="cursor:pointer; color:orange" class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \'interface\', \'interface\')">View Log</span>';
                        document.getElementById('socket-network-modal-table').innerHTML = content;
                    }else{
                        document.getElementById('socket-network-modal-table').innerHTML = inner;
                    }
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
                    $('#soft-tap-name').css('border', '2px solid red');
                    $('#soft-tap-name').attr("placeholder", "Please, insert a valid name");
                }else{
                    $('#soft-tap-name').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-port').value == ""){
                    $('#soft-tap-port').css('border', '2px solid red');
                    $('#soft-tap-port').attr("placeholder", "Please, insert a valid port");
                }else{
                    $('#soft-tap-port').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    $('#soft-tap-cert').css('border', '2px solid red');
                    $('#soft-tap-cert').attr("placeholder", "Please, insert a valid certificate");
                }else{
                    $('#soft-tap-cert').css('border', '2px solid #ced4da');
                }
            }
        }else if(type == "socket-pcap"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-pcap-path').value == "" || document.getElementById('soft-tap-pcap-prefix').value == "" || document.getElementById('soft-tap-bpf').value == "" ){
                if (document.getElementById('soft-tap-port').value == ""){
                    $('#soft-tap-port').css('border', '2px solid red');
                    $('#soft-tap-port').attr("placeholder", "Please, insert a valid port");
                }else{
                    $('#soft-tap-port').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-name').value == ""){
                    $('#soft-tap-name').css('border', '2px solid red');
                    $('#soft-tap-name').attr("placeholder", "Please, insert a valid name");
                }else{
                    $('#soft-tap-name').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    $('#soft-tap-cert').css('border', '2px solid red');
                    $('#soft-tap-cert').attr("placeholder", "Please, insert a valid certificate");
                }else{
                    $('#soft-tap-cert').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-pcap-path').value == ""){
                    $('#soft-tap-pcap-path').css('border', '2px solid red');
                    $('#soft-tap-pcap-path').attr("placeholder", "Please, insert a valid pcap path");
                }else{
                    $('#soft-tap-pcap-path').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-pcap-prefix').value == ""){
                    $('#soft-tap-pcap-prefix').css('border', '2px solid red');
                    $('#soft-tap-pcap-prefix').attr("placeholder", "Please, insert a valid pcap prefix");
                }else{
                    $('#soft-tap-pcap-prefix').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-bpf').value == ""){
                    $('#soft-tap-bpf').css('border', '2px solid red');
                    $('#soft-tap-bpf').attr("placeholder", "Please, insert a valid bpf");
                }else{
                    $('#soft-tap-bpf').css('border', '2px solid #ced4da');
                }

            }
        }else if(type == "network-socket"){
            if (document.getElementById('soft-tap-name').value == "" || document.getElementById('soft-tap-port').value == "" || document.getElementById('soft-tap-cert').value == "" || document.getElementById('soft-tap-bpf-socket').value == "" || document.getElementById('soft-tap-collector').value == ""){
                if (document.getElementById('soft-tap-name').value == ""){
                    $('#soft-tap-name').css('border', '2px solid red');
                    $('#soft-tap-name').attr("placeholder", "Please, insert a valid name");
                }else{
                    $('#soft-tap-name').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-port').value == ""){
                    $('#soft-tap-port').css('border', '2px solid red');
                    $('#soft-tap-port').attr("placeholder", "Please, insert a valid port");
                }else{
                    $('#soft-tap-port').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-cert').value == ""){
                    $('#soft-tap-cert').css('border', '2px solid red');
                    $('#soft-tap-cert').attr("placeholder", "Please, insert a valid certificate");
                }else{
                    $('#soft-tap-cert').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-collector').value == ""){
                    $('#soft-tap-collector').css('border', '2px solid red');
                    $('#soft-tap-collector').attr("placeholder", "Please, insert a valid collector IP");
                }else{
                    $('#soft-tap-collector').css('border', '2px solid #ced4da');
                }
                if (document.getElementById('soft-tap-bpf-socket').value == ""){
                    $('#soft-tap-bpf-socket').css('border', '2px solid red');
                    $('#soft-tap-bpf-socket').attr("placeholder", "Please, insert a valid BPF path");
                }else{
                    $('#soft-tap-bpf-socket').css('border', '2px solid #ced4da');
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
        jsonSave["name"] = document.getElementById('soft-tap-name').value.trim();
        jsonSave["type"] = type;
        jsonSave["cert"] = document.getElementById('soft-tap-cert').value.trim();
        jsonSave["port"] = document.getElementById('soft-tap-port').value.trim();
        jsonSave["interface"] = valueSelected;
        if (type == "socket-pcap"){ jsonSave["pcap-path"] = document.getElementById('soft-tap-pcap-path').value.trim(); jsonSave["pcap-prefix"] = document.getElementById('soft-tap-pcap-prefix').value.trim(); jsonSave["bpf"] = document.getElementById('soft-tap-bpf').value.trim();}
        if (type == "network-socket"){ jsonSave["collector"] = document.getElementById('soft-tap-collector').value.trim(); jsonSave["bpf"] = document.getElementById('soft-tap-bpf-socket').value.trim();}
        var dataJSON = JSON.stringify(jsonSave);
        axios({
            method: 'post',
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
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Save STAP: '+type+' service added successfully!'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding service: Save STAP: </strong>'+response.data.error+''+
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
                '<strong>Error adding service: Save STAP: </strong>'+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function AddPluginService(uuid, name, type){
    if (name == ""){
        $('#new-service-name').css('border', '2px solid red');
        $('#new-service-name').attr("placeholder", "Please, insert a description");
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
            method: 'post',
            url: nodeurl,
            timeout: 30000,
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataMap
        })
        .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            $('#modal-window').modal("hide");
            PrivilegesMessage();
        }else{
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
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Add plugin service: '+response.data.error+''+
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
                '<strong>Error!</strong> Add plugin service: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function GetSuricataServices(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/get/'+uuid;
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
    })
    .catch(function (error) {
    });
}

function syncRulesetModal(node, serviceUuid, name){
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
  $('#btn-sync-node').click(function(){ $('#modal-window').modal("hide"); sendRulesetToNode(node, serviceUuid); });
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
      data: bpfjson
    })
      .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            if (response.data.error == "false"){
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save BPF: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                // loadPlugins();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Save BPF: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset', {
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
            if (typeof response.data.error != "undefined"){
                resultElement.innerHTML = '<p>No rules available...</p>';
            }else{
                resultElement.innerHTML = generateAllRulesModal(response, uuid, source, service);
            }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Error deploying Zeek: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Error deploying Zeek: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        '</td><td style="word-wrap: break-word;" width="15%">';
        if(source == "suricata"){
            html = html + '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveSurictaRulesetSelected(\''+rule+'\', \''+nid+'\', \''+source+'\', \''+rules[rule]["name"]+'\', \''+service+'\' )">Select</button>';
        }else{
            html = html + '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveRulesetSelected(\''+rule+'\', \''+nid+'\', \''+source+'\', \''+rules[rule]["name"]+'\', \''+service+'\' )">Select</button>';
        }
        '</td></tr>                                                           '
    }
    html = html + '</tbody></table>';

    if (isEmpty){
        return '<p>No rules available...</p>';;
    }else{
        return html;
    }
}


function saveSurictaRulesetSelected(rule, nid, source, name, service){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;      
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/setRuleset';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = nid;
    jsonRuleUID["rulesetID"] = rule;
    jsonRuleUID["rulesetName"] = name;
    jsonRuleUID["service"] = service;

    // jsonRuleUID["source"] = source;
    var uidJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: urlSetRuleset,
        timeout: 30000,
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: uidJSON
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
                    '<strong>Error!</strong> Save suricata Ruleset: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                // if (source == "main"){
                //     loadPlugins();
                // }else if (source == "suricata"){
                    document.getElementById('suricata-ruleset-'+service).innerHTML = name;
                    document.getElementById('suricata-ruleset-edit-'+service).value = name;
                    document.getElementById('suricata-ruleset-edit-id-'+service).value = rule;
                // }

            }
        }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save suricata Ruleset: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function saveRulesetSelected(rule, nid, source, name, service){
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: uidJSON
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
                    '<strong>Error!</strong> Save Ruleset: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
            // if (source == "main"){
                loadPlugins();
            // }else if (source == "suricata"){
            //     document.getElementById('suricata-ruleset-edit-'+service).value = name;
            // }
        }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Save Ruleset: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function loadStapURL(uuid, nodeName){
    document.location.href = 'https://' + location.host + '/stap.html?uuid='+uuid+'&node='+nodeName;
}

function playCollector(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/play/' + uuid;
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
            document.getElementById('stap-collector-' + uuid).className = "badge bg-success align-text-bottom text-white";
            document.getElementById('stap-collector-' + uuid).innerHTML = "ON";
            return true;
        }
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
            document.getElementById('stap-collector-' + uuid).className = "badge bg-danger align-text-bottom text-white";
            document.getElementById('stap-collector-' + uuid).innerHTML = "OFF";
            return true;
        }
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
            showModalCollector(response);
        }

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
            if (response.data != ""){
                document.getElementById('stap-collector-' + uuid).className = "badge bg-success align-text-bottom text-white";
                document.getElementById('stap-collector-' + uuid).innerHTML = "ON";
            }else{
                document.getElementById('stap-collector-' + uuid).className = "badge bg-danger align-text-bottom text-white";
                document.getElementById('stap-collector-' + uuid).innerHTML = "OFF";
            }
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
            for(line in response.data){
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
        }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change status: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Change status: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change mode: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Change mode: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function showPorts(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ports/' + uuid;
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
            showModalPorts(response, uuid);
        }
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
        data: nodeJSON
        }).then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }

        }).catch(function (error) {

        });

}

function deleteAllPorts(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/ports/deleteAll/'+uuid;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            }
    }).then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }

    }).catch(function (error) {

    });

}

function sendRulesetToNode(uuid, service){
    document.getElementById('progressBar-options').style.display = "block";
    document.getElementById('progressBar-options-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/set';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = uuid;
    jsonRuleUID["service"] = service;    
    jsonRuleUID["ruleset"] = document.getElementById('suricata-ruleset-edit-id-'+service).value;    
    jsonRuleUID["type"] = "node";
    var dataJSON = JSON.stringify(jsonRuleUID);
    
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
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Suricata ruleset deployment complete.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                PingPluginsNode(uuid)
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Ruleset Error!</strong> Deploy ruleset: '+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options').style.display = "none";
        document.getElementById('progressBar-options-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Deploy ruleset: '+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Run suricata: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Run suricata'+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop Suricata: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Stop Suricata: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });

}

function PingSuricata(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/suricata/' + uuid;
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
        }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Run Zeek: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop Zeek: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop Zeek: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);

    });

}

function PingZeek(uuid) {
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/zeek/' + uuid;
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
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            document.getElementById("zeek-status-details").innerHTML = '';
            document.getElementById("zeek-current-mode").innerHTML = response.data["mode"];
            // document.getElementById("zeek-role").innerHTML = response.data["role"];

            var html = '';
            for(node in response.data.nodes){
                html = html + '<tr>'+
                    '<td>'+response.data.nodes[node]["name"]+'&nbsp('+response.data.nodes[node]["host"]+')'+'</td>'+
                    '<td>'+response.data.nodes[node]["status"]+'</td>'+
                    '<td>'+response.data.nodes[node]["type"]+'</td>'+
                    // '<td>'+response.data.nodes[node]["interface"]+'</td>'+
                    '<td>'+response.data.nodes[node]["pid"]+'</td>'+
                    '<td>'+response.data.nodes[node]["started"]+'</td>'+
                    // '<td style="color: red;">extra info</td>'+
                '</tr>';
            }
            document.getElementById("zeek-status-details").innerHTML = html;

            //check banner status
            if (response.data.mode == "" || response.data.manageruuid == "" ){
                if (response.data.mode == ""){
                    $('#zeek-standalone-mode').hide();
                    $('#zeek-cluster-banner').show();
                    document.getElementById('zeek-banner-main-title').innerHTML = "Zeek is not available";
                }else{
                    $('#zeek-standalone-mode').hide();
                    $('#zeek-cluster-banner').show();
                    document.getElementById('zeek-manager-node').innerHTML = '<div>Node cluster manager: '+ipmaster+' (<b>Not an OwlH Node</b>)</div>';
                }
            }else if(response.data.mode == "standalone" || (response.data.mode == "cluster" && response.data.manager == true)){
                $('#zeek-cluster-banner').hide();
                $('#zeek-standalone-mode').show();
            }else{
                $('#zeek-cluster-banner').show();
                $('#zeek-standalone-mode').hide();
                for (node in response.data.nodes){
                    if (response.data.nodes[node]["type"] == "manager"){
                        document.getElementById('zeek-manager-node').innerHTML = '<div onclick="LoadManagerZeek(\''+response.data.manageruuid+'\', \''+response.data.managername+'\')">Node cluster manager: '+response.data.managername+' (<b style="cursor:pointer;"><u>'+response.data.managerip+'</u></b>)</div>';
                    }
                }
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Ping Zeek: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function ZeekDiag(uuid) {
    document.getElementById("zeek-diag-body").innerHTML = "";
    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/zeek/' + uuid+'/diag';
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
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            var jsonViewer = new JSONViewer();
            document.querySelector("#zeek-diag-body").appendChild(jsonViewer.getContainer());
            var obj = JSON.parse(response.data["result"])
            // jsonViewer.showJSON(json, maxLvl, colAt);
            // maxLvl: Process only to max level, where 0..n, -1 unlimited
            // colAt: Collapse at level, where 0..n, -1 unlimited

            jsonViewer.showJSON(obj, -1, -1);
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Zeek Diagnostics: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}


function LoadManagerZeek(uuid, name){
    document.location.href = 'https://' + location.host + '/node-options.html?uuid='+uuid+'&node='+name+'&nodetab=zeek';
}

//Run Zeek system
function RunWazuh(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/RunWazuh/' + uuid;
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Run Wazuh: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Run Wazuh: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop Wazuh: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                setTimeout(function (){
                    loadPlugins();
                }, 1500);
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop Wazuh: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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

function PingWazuhFiles(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/pingWazuhFiles/' + uuid;
    axios({
        method: 'get',
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong>Wazuh connect: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
            var isError = false;
            for(obj in response.data){
                if (response.data[obj].ack == "false") {
                    // $('html,body').scrollTop(0);
                    // var alert = document.getElementById('floating-alert');
                    // alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    //     '<strong>Error!</strong>Get Wazuh files: '+response.data[obj].error+'.'+
                    //     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    //         '<span aria-hidden="true">&times;</span>'+
                    //     '</button>'+
                    // '</div>';
                    // setTimeout(function() {$(".alert").alert('close')}, 30000);
                    isError = true;
                }
            }

            //if there are no error retrieving Wazuh files, show all files in the list
            if(!isError){
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
                            if(response.data[pos]["size"]<1024){html = html +'<span id="wazuh-file-status-'+count+'" class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[pos]["size"]+' Bytes</span>';}
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
            }else{
                document.getElementById('wazuh-table').innerHTML = "No files available";
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong>Get Wazuh files: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function LoadPageLastLines(uuid, line, path) {
    document.location.href = 'https://' + location.host + '/load-content.html?uuid='+uuid+'&line='+line+'&path='+path;
}

function PingWazuh(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/wazuh/' + uuid;
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
            }
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Run STAP: '+response.data.error+'.'+
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
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Run STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop STAP: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                // setTimeout(function (){
                    loadPlugins();
                // }, 1500);
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Stop STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function PingStap(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/stap/stap/' + uuid;
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
    var tableSuricataCommand = "";
    var tableZeek = "";
    var tableSocketNetwork = "";
    var tableSocketPcap = "";
    var tableNetworkSocket = "";
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
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Ping Plugins: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+    
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{                
                for(line in response.data){   

                    
                    // if(response.data[line]["type"] == "socket-network" || response.data[line]["type"] == "socket-pcap" || response.data[line]["type"] == "network-socket"){
                    //     var conns = response.data[line]["connections"].split("\n");
                    //     result = conns.filter(con => con != "");
                    // }
                    
                    // if (line == "knownports"){
                    //     if (response.data[line]["status"] == "Enabled"){
                    //         document.getElementById('ports-status-'+uuid).innerHTML = "ON";
                    //         document.getElementById('ports-status-btn-'+uuid).className = "fas fa-stop-circle";
                    //         document.getElementById('ports-status-'+uuid).className = "badge bg-success align-text-bottom text-white";
                    //     }else if (response.data[line]["status"] == "Disabled"){
                    //         document.getElementById('ports-status-'+uuid).innerHTML = "OFF";
                    //         document.getElementById('ports-status-btn-'+uuid).className = "fas fa-play-circle";
                    //         document.getElementById('ports-status-'+uuid).className = "badge bg-danger align-text-bottom text-white";
                    //     }
                    //     document.getElementById('ports-mode-'+uuid).innerHTML = response.data[line]["mode"];
                    // }else if (response.data[line]["type"] == "suricata"){
    
                    //put if socat, tcpdump and tcpreplay are installed
                    if(response.data["installed"]["checkSocat"] == "false" || response.data["installed"]["checkTcpreplay"] == "false" || response.data["installed"]["checkTcpdump"] == "false"){
                        document.getElementById('stap-installed-status').style.display = "block";
                        if(response.data["installed"]["checkSocat"] == "true"){
                            document.getElementById("stap-installed-socat").innerHTML = "Installed";
                            document.getElementById("stap-installed-socat").className = '"badge badge-pill bg-success align-text-bottom text-white';
                        }else{
                            document.getElementById("stap-installed-socat").innerHTML = "Not installed";
                            document.getElementById("stap-installed-socat").className = '"badge badge-pill bg-danger align-text-bottom text-white';
                        }
                        if(response.data["installed"]["checkTcpreplay"] == "true"){
                            document.getElementById("stap-installed-tcpreplay").innerHTML = "Installed";
                            document.getElementById("stap-installed-tcpreplay").className = '"badge badge-pill bg-success align-text-bottom text-white';
                        }else{
                            document.getElementById("stap-installed-tcpreplay").innerHTML = "Not installed";
                            document.getElementById("stap-installed-tcpreplay").className = '"badge badge-pill bg-danger align-text-bottom text-white';
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
    
                    //put suricata parameters
                    if (response.data[line]["type"] == "suricata"){   
                        if (response.data[line]["command"]){
                            tableSuricataCommand = tableSuricataCommand + '<tr>'+
                                '<td>'+response.data[line]["pid"]+'</td>'+
                                '<td>'+response.data[line]["command"]+'</td>'+
                                '<td>'+
                                    '<span style="cursor: pointer;" title="Kill Suricata" class="badge bg-primary align-text-bottom text-white" onclick="KillSuricataMainConf(\''+uuid+'\',\''+response.data[line]["pid"]+'\')">Kill</span> &nbsp '+
                                    '<span style="cursor: pointer;" title="Reload Suricata using main.conf" class="badge bg-primary align-text-bottom text-white" onclick="ReloadSuricataMainConf(\''+uuid+'\',\''+response.data[line]["pid"]+'\')">Reload</span>'+
                                '</td>'+
                            '<tr>';
                        }else{
                            tableSuricata = tableSuricata + '<tr>'+
                                '<td style="word-wrap: break-word;">'+response.data[line]["name"]+
                                    '<br>'+
                                    '<div id="suricata-error-alert-'+line+'" style="cursor:pointer; color:Orange; display:none;">'+
                                    '&nbsp <i class="fas fa-exclamation-triangle fa-lg" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i>'+
                                        '&nbsp <span class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')">View Log</span>'+
                                    '</div>'+
                                '</td>'+
                                '<td style="word-wrap: break-word;" id="status-suricata-'+line+'">';
                                    if(response.data[line]["status"]=="enabled"){
                                        tableSuricata = tableSuricata + '<span class="badge bg-success align-text-bottom text-white">ON</span>';
                                        if(response.data[line]["running"]=="true"){
                                            tableSuricata = tableSuricata + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                        }else{
                                            tableSuricata = tableSuricata + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                        }
                                    }else if (response.data[line]["status"]=="disabled"){
                                        tableSuricata = tableSuricata + '<span class="badge bg-danger align-text-bottom text-white">OFF</span>';
                                        if(response.data[line]["running"]=="true"){
                                            tableSuricata = tableSuricata + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                        }else{
                                            tableSuricata = tableSuricata + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                        }
                                    }
                                    tableSuricata = tableSuricata + '</td>'+
                                '<td style="word-wrap: break-word;" id="suricata-bpf-default-'+line+'">'+response.data[line]["bpf"]+'</td>'+
                                '<td style="word-wrap: break-word;" id="suricata-ruleset-'+line+'">'+response.data[line]["rulesetName"]+'</td>';
                                tableSuricata = tableSuricata + '<td style="word-wrap: break-word;" id="suricata-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                                '<td style="word-wrap: break-word;">';
                                
                                    delete response.data[line]["rulesetSync"]
                                    console.log(response.data[line]);
                                    

                                    //cehck if rulesetSync param came from API for check if ruleset is sync
                                    if("rulesetSync" in response.data[line]){
                                        if(response.data[line]["status"] == "enabled" || response.data[line]["running"] == "true"){
                                            tableSuricata = tableSuricata + '<i class="fas fa-stop-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'disabled\', \''+response.data[line]["interface"]+'\' ,\''+response.data[line]["bpf"]+'\', \'suricata\')"></i> &nbsp';
                                        }else if (response.data[line]["status"]=="disabled" && (response.data[line]["rulesetSync"] == "true" || response.data[line]["running"] == "true")){                                    
                                            tableSuricata = tableSuricata + '<i class="fas fa-play-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'enabled\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["bpf"]+'\',  \'suricata\')"></i> &nbsp';                                        
                                        }
                                        tableSuricata = tableSuricata + '<i class="fas fa-sync-alt" style="color: grey; cursor: pointer;" onclick="syncRulesetModal(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                                        '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'suricata\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>';
    
                                        if(response.data[line]["rulesetSync"] =="false"){
                                            tableSuricata = tableSuricata + '<br>'+
                                            '<div>'+
                                                '<span style="cursor:pointer;" class="badge bg-warning align-text-bottom text-white" onclick="syncRulesetModal(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"><i class="fas fa-exclamation-triangle fa-lg" style="color:red;">&nbsp</i>Ruleset not synced</span>'+
                                            '</div>';
                                        }                                    
                                    }else{
                                        if(response.data[line]["status"] == "enabled" || response.data[line]["running"] == "true"){
                                            tableSuricata = tableSuricata + '<i class="fas fa-stop-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'disabled\', \''+response.data[line]["interface"]+'\' ,\''+response.data[line]["bpf"]+'\', \'suricata\')"></i> &nbsp';
                                        }else if (response.data[line]["status"]=="disabled" && response.data[line]["running"] == "false"){                                    
                                            tableSuricata = tableSuricata + '<i class="fas fa-play-circle" style="color:grey; cursor: pointer;" onclick="ChangeServiceStatus(\''+uuid+'\', \''+line+'\', \'status\', \'enabled\', \''+response.data[line]["interface"]+'\',\''+response.data[line]["bpf"]+'\',  \'suricata\')"></i> &nbsp';                                        
                                        }
                                        tableSuricata = tableSuricata + '<i class="fas fa-sync-alt" style="color: grey; cursor: pointer;" onclick="syncRulesetModal(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                                        '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                                        '<i class="fas fa-trash-alt" onclick="ModalDeleteService(\''+uuid+'\', \''+line+'\', \'suricata\', \''+response.data[line]["name"]+'\')" style="color: red; cursor: pointer;"></i>';                              
                                        tableSuricata = tableSuricata + '<br>'+
                                        '<div>'+
                                            '<span style="cursor:pointer;" class="badge bg-warning align-text-bottom text-white">Invalid node version</span>'+
                                        '</div>';

                                    }



                                tableSuricata = tableSuricata + '</td>'+
                            '</tr>'+
                            '<tr width="100%" id="edit-row-'+line+'" style="display:none;" bgcolor="peachpuff">'+
                                '<td style="word-wrap: break-word;" colspan="5">'+
                                    '<div class="form-row">'+
                                        '<div class="col">'+
                                            'Description: <input class="form-control" id="suricata-name-'+line+'" value="'+response.data[line]["name"]+'">'+
                                        '</div>'+
                                        '<div class="col">'+
                                            'Configuration file: <input class="form-control" id="suricata-config-file-'+line+'" value="'+response.data[line]["configFile"]+'">'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-row">'+
                                        '<div class="col">'+
                                            'Ruleset: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Suricata '+response.data[line]["ruleset"]+' ruleset" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\', \'suricata\', \''+line+'\')"></i>'+
                                            '<input class="form-control" id="suricata-ruleset-edit-'+line+'" value="'+response.data[line]["rulesetName"]+'" disabled>'+
                                            '<input class="form-control" id="suricata-ruleset-edit-id-'+line+'" value="'+response.data[line]["ruleset"]+'" style="display:none;" disabled>'+
                                        '</div>'+
                                        '<div class="col">'+
                                            'Interface: <i class="fas fa-edit" style="cursor: default; color: Dodgerblue; cursor: pointer;" title="Suricata '+response.data[line]["name"]+' Interface" style="cursor: default;" onclick="loadNetworkValuesService(\''+uuid+'\', \''+response.data[line]["name"]+'\', \''+line+'\', \''+response.data[line]["type"]+'\')"></i>'+
                                            '<input class="form-control" id="suricata-interface-'+line+'" value="'+response.data[line]["interface"]+'" disabled>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="form-row">'+
                                        '<div class="col">'+
                                            'BPF: <input class="form-control" id="suricata-bpf-'+line+'" value="'+response.data[line]["bpf"]+'">'+
                                        '</div>'+
                                        '<div class="col">'+
                                            'BPF File: <input class="form-control" id="suricata-bpf-file-'+line+'" value="'+response.data[line]["bpfFile"]+'">'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                                '<td style="word-wrap: break-word;" >'+
                                    '<div class="form-row text-center">'+
                                        '<div class="col">'+
                                            '<button class="btn btn-seconday" onclick="hideEditStap(\''+line+'\')">Cancel</button>'+
                                        '</div>'+
                                    '</div>'+
                                    '<br>'+
                                    '<div class="form-row text-center">'+
                                        '<div class="col">'+
                                            '<button class="btn btn-primary" onclick="modifyNodeOptionValues(\''+uuid+'\', \'suricata\', \''+line+'\')">Save</button>'+
                                        '</div>'+
                                    '</div>'+
                                '</td>'+
                            '</tr>';
                        }
                    }else if (response.data[line]["type"] == "zeek"){
                        tableZeek = tableZeek + '<tr style="display:none;">'+
                            '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'</td>'+
                            '<td style="word-wrap: break-word;" id="zeek-interface-default">'+response.data[line]["interface"]+'</td>'+
                            '<td style="word-wrap: break-word;">';
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
                                                '<button class="btn btn-primary" onclick="modifyNodeOptionValues(\''+uuid+'\', \'zeek\', \''+line+'\')">Save</button>'+
                                            '</div>'+
                                        '</div>'+
                                        '<br>'+
                                    '</div>'+
                                '</div>'+
                            '</td>'+
                        '</tr>';
    
                    }else if (response.data[line]["type"] == "socket-network"){
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
                                tableSocketNetwork = tableSocketNetwork + '<div id="soc-net-exclamation-'+line+'" style="cursor:pointer; display:none;">'+
                                    '&nbsp <i class="fas fa-exclamation-triangle fa-lg" style="color:Orange;" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                                    '<span class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')">View Log</span>'+
                                '</div>'+
                            '</td>'+
                            '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
                            '<td style="word-wrap: break-word;">'+response.data[line]["cert"]+'</td>'+
                            '<td style="word-wrap: break-word;" id="socket-network-interface-default-'+line+'">'+response.data[line]["interface"]+'</td>'+
                            '<td style="word-wrap: break-word;">';
                                if (response.data[line]["pid"] == "none"){
                                    tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-play" style="color: grey; cursor: pointer;" onclick="deployStapService(\''+uuid+'\', \''+line+'\', \'none\',\''+response.data[line]["port"]+'\', \''+response.data[line]["interface"]+'\',\'socket-network\')"></i> &nbsp';
                                }else if (response.data[line]["pid"] != "none"){
                                    tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-stop" style="color: grey; cursor: pointer;" onclick="stopStapService(\''+uuid+'\', \''+line+'\', \'socket-network\')"></i> &nbsp';
                                }
                                tableSocketNetwork = tableSocketNetwork + '<i class="fas fa-edit" id="modify-stap-'+line+'" style="color:grey; cursor: pointer;" onclick="showModifyStap(\''+line+'\')"></i>&nbsp'+
                                '<i class="fas fa-info-circle" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')" style="color: grey; cursor: pointer;">&nbsp</i>'+
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
                                        '<button class="btn btn-primary" onclick="modifyNodeOptionValues(\''+uuid+'\', \'socket-network\', \''+line+'\')">Save</button>'+
                                    '</div>'+
                                '</div>'+
                            '</td>'+
                        '</tr>';
                        if(response.data[line]["connectionsCount"] > 0){
                            tableSocketNetwork = tableSocketNetwork + '<tr>'+
                                '<td colspan="5">'+ 
                                    '<table class="table table-hover" style="table-layout: fixed"tyle="table-layout: fixed" width="100%">'+
                                        '<thead>'+
                                            '<th width="7%">Proto</th>'+
                                            '<th width="7%">Recv-Q</th>'+
                                            '<th width="7%">Send-Q</th>'+
                                            '<th width="">Local Addr</th>'+
                                            '<th width="">Client Addr</th>'+
                                            '<th width="">State</th>'+
                                            '<th width="">PID/name</th>'+
                                        '</thead>'+
                                        '<tbody>';                                          
                                            var conns = response.data[line]["connections"].split("\n");
                                            var result = conns.filter(con => con != "");                                                                                                              
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
                                tableSocketPcap = tableSocketPcap + '<div id="soc-pcap-exclamation-'+line+'" style="cursor:pointer; display:none;">'+
                                    '&nbsp <i class="fas fa-exclamation-triangle fa-lg" style="color:Orange;" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                                    '<span class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')">View Log</span>'+
                                '</div>'+
                            '</td>'+
                            '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
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
                                '<i class="fas fa-info-circle" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')" style="color: grey; cursor: pointer;">&nbsp</i>'+
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
                                        '<button class="btn btn-primary" onclick="modifyNodeOptionValues(\''+uuid+'\', \'socket-pcap\', \''+line+'\')">Save</button>'+
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
                                            '<th width="">Client Addr</th>'+
                                            '<th width="">State</th>'+
                                            '<th width="">PID/name</th>'+
                                        '</thead>'+
                                        '<tbody>';        
                                            var conns = response.data[line]["connections"].split("\n");
                                            var result = conns.filter(con => con != "");                        
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
                    }else if (response.data[line]["type"] == "network-socket"){
                        tableNetworkSocket = tableNetworkSocket + '<tr>';
                            if(response.data[line]["connectionsCount"] > 0){
                                tableNetworkSocket = tableNetworkSocket + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+' <span class="badge badge-pill bg-'+response.data[line]["connectionsColor"]+' align-text-bottom text-white">'+response.data[line]["connectionsCount"]+'</span><br>';
                            }else{
                                tableNetworkSocket = tableNetworkSocket + '<td style="word-wrap: break-word;">'+response.data[line]["name"]+'<br>';
                            }
                                if (response.data[line]["pid"] == "none"){
                                    tableNetworkSocket = tableNetworkSocket + '<span class="badge bg-danger align-text-bottom text-white">OFF</span> ';
                                    if(response.data[line]["running"]=="true"){
                                        tableNetworkSocket = tableNetworkSocket + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                    }else{
                                        tableNetworkSocket = tableNetworkSocket + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                    }
                                }else{
                                    tableNetworkSocket = tableNetworkSocket + '<span class="badge bg-success align-text-bottom text-white">ON</span> ';
                                    if(response.data[line]["running"]=="true"){
                                        tableNetworkSocket = tableNetworkSocket + '&nbsp <span class="badge bg-success align-text-bottom text-white">Running</span>';
                                    }else{
                                        tableNetworkSocket = tableNetworkSocket + '&nbsp <span class="badge bg-danger align-text-bottom text-white">Stopped</span>';
                                    }
                                }
                                tableNetworkSocket = tableNetworkSocket + '<div id="net-soc-exclamation-'+line+'" style="cursor:pointer; display:none;">'+
                                    '&nbsp <i class="fas fa-exclamation-triangle fa-lg" style="color:Orange;" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')"></i> &nbsp'+
                                    '<span class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')">View Log</span>'+
                                '</div>'+
                            '</td>'+
                            '<td style="word-wrap: break-word;">'+response.data[line]["port"]+'</td>'+
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
                                '<i class="fas fa-info-circle" onclick="GetCommandsLog(\''+uuid+'\', \''+line+'\', \''+response.data[line]["name"]+'\')" style="color: grey; cursor: pointer;">&nbsp</i>'+
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
                                        '<button class="btn btn-primary" onclick="modifyNodeOptionValues(\''+uuid+'\', \'network-socket\', \''+line+'\')">Save</button>'+
                                    '</div>'+
                                '</div>'+
                            '</td>'+
                        '</tr>';
                        if(response.data[line]["connectionsCount"] > 0){
                            tableNetworkSocket = tableNetworkSocket + '<tr>'+
                                '<td colspan="7">'+ 
                                    '<table class="table table-hover" style="table-layout: fixed"tyle="table-layout: fixed" width="100%">'+
                                        '<thead>'+
                                            '<th width="7%">Proto</th>'+
                                            '<th width="7%">Recv-Q</th>'+
                                            '<th width="7%">Send-Q</th>'+
                                            '<th width="">Local Addr</th>'+
                                            '<th width="">Client Addr</th>'+
                                            '<th width="">State</th>'+
                                            '<th width="">PID/name</th>'+
                                        '</thead>'+
                                        '<tbody>';      
                                            var conns = response.data[line]["connections"].split("\n");
                                            var result = conns.filter(con => con != "");                                    
                                            result.forEach(function (item, index) {
                                                tableNetworkSocket = tableNetworkSocket + '<tr>';
    
                                                var splittedData = item.split(' ');
                                                var dataFiltered = splittedData.filter(word => word != '');
                                                dataFiltered.forEach(function (value, pos) {
                                                    tableNetworkSocket = tableNetworkSocket + '<td style="word-wrap: break-word;">'+value+'</td>';
                                                })                                            
                                                tableNetworkSocket = tableNetworkSocket + '</tr>';
                                            });
                                            tableNetworkSocket = tableNetworkSocket +'</tbody>'+
                                    '</table>'+
                                '</td>'+
                            '</tr>';
                        }
                    }
                    document.getElementById('zeek-table-services').innerHTML = tableZeek;
                    document.getElementById('socket-network-table').innerHTML = tableSocketNetwork;
                    document.getElementById('socket-pcap-table').innerHTML = tableSocketPcap;
                    document.getElementById('network-socket-table').innerHTML = tableNetworkSocket;
                    document.getElementById('suricata-table-services').innerHTML = tableSuricata;
                    document.getElementById('suricata-table-services-command').innerHTML = tableSuricataCommand;
                }
    
                axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValuesSelected/'+uuid, {
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
                    if (response.data.ack == "false") {
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error!</strong> Load interfaces: '+response.data.error+'.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                    }else{
                        if (document.getElementById('zeek-interface') != null){
                            for (net in response.data){
                                document.getElementById('zeek-interface').value = response.data[net]["interface"];
                            }
                        }
                    }
                }
                })
                .catch(function (error){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Load interfaces: '+error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                });
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Ping Plugins: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function hideEditStap(line){
    document.getElementById('edit-row-'+line).style.display = "none";
}

function showModifyStap(service){
    $('#edit-row-'+service).show();
}

function modifyNodeOptionValues(uuid, type, service){
    $('#edit-row-'+service).hide();
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/modifyNodeOptionValues';

    var jsonDeployService = {}
    jsonDeployService["uuid"] = uuid;
    jsonDeployService["service"] = service;
    jsonDeployService["type"] = type;
    if (type == "socket-network"){
        jsonDeployService["name"] = document.getElementById('socket-network-name-'+service).value.trim();
        jsonDeployService["port"] = document.getElementById('socket-network-port-'+service).value.trim();
        jsonDeployService["cert"] = document.getElementById('socket-network-cert-'+service).value.trim();
        jsonDeployService["interface"] = document.getElementById('socket-network-interface-'+service).value.trim();
    }else if (type == "suricata"){
        jsonDeployService["name"] = document.getElementById('suricata-name-'+service).value.trim();
        jsonDeployService["configFile"] = document.getElementById('suricata-config-file-'+service).value.trim();
        jsonDeployService["rulesetName"] = document.getElementById('suricata-ruleset-edit-'+service).value.trim();
        jsonDeployService["ruleset"] = document.getElementById('suricata-ruleset-edit-id-'+service).value.trim();
        jsonDeployService["interface"] = document.getElementById('suricata-bpf-'+service).value.trim();
        jsonDeployService["bpf"] = document.getElementById('suricata-bpf-'+service).value.trim();
        jsonDeployService["bpfFile"] = document.getElementById('suricata-bpf-file-'+service).value.trim();
    }else if (type == "zeek"){
        jsonDeployService["name"] = document.getElementById('zeek-name-'+service).value.trim();
    }else if (type == "socket-pcap"){
        jsonDeployService["name"] = document.getElementById('socket-pcap-name-'+service).value.trim();
        jsonDeployService["port"] = document.getElementById('socket-pcap-port-'+service).value.trim();
        jsonDeployService["cert"] = document.getElementById('socket-pcap-cert-'+service).value.trim();
        jsonDeployService["pcap-path"] = document.getElementById('socket-pcap-pcap-path-'+service).value.trim();
        jsonDeployService["pcap-prefix"] = document.getElementById('socket-pcap-pcap-prefix-'+service).value.trim();
        jsonDeployService["bpf"] = document.getElementById('socket-pcap-bpf-'+service).value.trim();
    }else if (type == "network-socket"){
        jsonDeployService["name"] = document.getElementById('network-socket-name-'+service).value.trim();
        jsonDeployService["port"] = document.getElementById('network-socket-port-'+service).value.trim();
        jsonDeployService["cert"] = document.getElementById('network-socket-cert-'+service).value.trim();
        jsonDeployService["collector"] = document.getElementById('network-socket-collector-'+service).value.trim();
        jsonDeployService["interface"] = document.getElementById('network-socket-interface-'+service).value.trim();
        jsonDeployService["bpf"] = document.getElementById('network-socket-bpf-'+service).value.trim();
    }
    var dataJSON = JSON.stringify(jsonDeployService);

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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Save STAP Changes: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);                
                loadPlugins();
            }else{
                loadPlugins();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Save STAP Changes: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
    if(type == "socket-network"){document.getElementById('soc-net-exclamation-'+service).style.display = "none";}
    if(type == "socket-pcap"){document.getElementById('soc-pcap-exclamation-'+service).style.display = "none";}
    if(type == "network-socket"){document.getElementById('net-soc-exclamation-'+service).style.display = "none";}
    
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
    var dataJSON = JSON.stringify(jsonDeployService);

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
            if (response.data.ack == "false") {
                if(type == "socket-network"){document.getElementById('soc-net-exclamation-'+service).style.display = "block";}
                if(type == "socket-pcap"){document.getElementById('soc-pcap-exclamation-'+service).style.display = "block";}
                if(type == "network-socket"){document.getElementById('net-soc-exclamation-'+service).style.display = "block";}

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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Stop STAP: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Stop STAP: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Delete service: '+response.data.error+'.'+
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
            '<strong>Error!</strong> Delete service: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function ChangeServiceStatus(uuid, service, param, status, interface, bpf, type){
    // if (type == "suricata" && (interface == "" || bpf == "")){
    if (type == "suricata" && interface == ""){
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Please, assign an interface and a BPF for deploy a suricata service.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
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
        headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
            data: dataJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                PrivilegesMessage();
            }else{
                // response.data.ack = "false";
                if (response.data.ack == "false") {
                    progressBar.style.display = "none";
                    progressBarDiv.style.display = "none";
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    var htmlAlert = '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error!</strong> Change Service Status: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    alert.innerHTML = alert.innerHTML + htmlAlert;
                    document.getElementById('suricata-error-alert-'+service).style.display = "block";
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    progressBar.style.display = "none";
                    progressBarDiv.style.display = "none";
                    loadPlugins();
                }                
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Change Service Status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
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
                        if(response.data["size"]<1024){html = html +'<span class="badge badge-pill bg-success align-text-bottom text-white">'+response.data["size"]+' Bytes</span> <i class="fas fa-sync-alt" style="cursor: pointer; color:grey;" title="Reload Analyzer information" id="reload-analyzer" onclick="ReloadFilesData(\''+uuid+'\')"></i> <i style="color:grey;" id="analyzer-comparative"></i>';}
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
        }

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
            var wazuhCount = document.getElementById('wazuh-count-table-value').value;
            for (file in response.data){
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
        }
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
}


function loadNetworkValuesService(uuid, name, service, type){
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

                '<div class="modal-header" style="word-break: break-all;">'+
                  '<h4 class="modal-title" id="interface-node-header">'+name+' interface</h4>'+
                  '<button type="button" class="close" id="btn-select-interface-cross">&times;</button>'+
                '</div>'+

                '<div class="modal-body" id="interface-node-footer-table">';
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
                        var count = 0;
                        for (net in response.data){
                            count++;
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

                '<div class="modal-footer" id="interface-node-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" id="btn-select-interface-close">Close</button>';
                        if (response.data.ack != "false"){
                            if(type == "zeek"){
                                html = html + '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-interface-node" onclick="updateNetworkInterface(\''+uuid+'\', \''+type+'\', \''+service+'\')">Save</button>';
                            }else {
                                html = html + '<button type="submit" class="btn btn-primary" id="btn-deploy-network-value" data-dismiss="modal" id="btn-interface-node" onclick="UpdateSuricataValue(\''+uuid+'\', \''+name+'\', \''+service+'\', \''+type+'\')">Save</button>';
                            }
                        }
                    html = html + '</div>'+
                '</div>'+

              '</div>'+
            '</div>';

            document.getElementById('modal-window').innerHTML = html;
            // LoadNetworkValuesSelected(uuid);

            if(count == 0){
                document.getElementById('btn-deploy-network-value').style.display="none";
                var content = '&nbsp <i style="cursor:pointer; color:orange" class="fas fa-exclamation-triangle fa-lg" onclick="GetCommandsLog(\''+uuid+'\', \'interface\', \'interface\')"></i>'+
                    '&nbsp <span style="cursor:pointer; color:orange" class="badge bg-warning align-text-bottom text-white" onclick="GetCommandsLog(\''+uuid+'\', \'interface\', \'interface\')">View Log</span>';
                document.getElementById('interface-node-footer-table').innerHTML = content;
            }

            $('#modal-window').modal("show");
            $('#btn-select-interface-cross').click(function(){ $('#modal-window').modal("hide"); });
            $('#btn-select-interface-close').click(function(){ $('#modal-window').modal("hide"); });
        }
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
        // loadPlugins();
    })
    .catch(function (error) {
    });
}

function UpdateSuricataValue(uuid, name, service, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/updateSuricataValue';

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
    jsonSuricataInterface["value"] = valueSelected;
    jsonSuricataInterface["param"] = "interface";
    var dataJSON = JSON.stringify(jsonSuricataInterface);
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
