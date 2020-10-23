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
        document.getElementById('progressBar-options-div').style.display="none";
        document.getElementById('progressBar-options').style.display="none";
        GetGroupsDetails();
    });
}
var payload = "";
loadJSONdata();

function GetGroupsDetails(){
    document.getElementById('progressBar-options-div').style.display="block";
    document.getElementById('progressBar-options').style.display="block";

    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var gname = urlWeb.searchParams.get("gname");

    document.getElementById('group-name').innerHTML = gname;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var resultnodes = document.getElementById('pills-nodes');
    var resultsuricata = document.getElementById('pills-suricata');
    var resultzeek = document.getElementById('pills-zeek');
    var resultanalyzer = document.getElementById('pills-analyzer');

    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';

    axios({
        method: 'get',
        url: groupurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            document.getElementById('progressBar-options-div').style.display="none";
            document.getElementById('progressBar-options').style.display="none";
            PrivilegesMessage();
        }else{

            document.getElementById('progressBar-options-div').style.display="none";
            document.getElementById('progressBar-options').style.display="none";
            if (response.data == null) {
                resultnodes.innerHTML= '<div style="text-align:center"><h3">No data retrieved</h3></div>';
            }else if (response.data.ack == "false") {
                resultnodes.innerHTML= '<div style="text-align:center"><h3 style="color:red;">Error retrieving group data</h3></div>';
            }else{
                var html = "";
                var htmlnodes = "";
                var htmlsuricata = "";
                var htmlzeek = "";
                var htmlanalyzer = "";

                for(x=0; x<response.data.length; x++){
                    var groups = response.data[x];
                    if(groups['guuid'] == uuid){
                        htmlnodes = "" + '<div>'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white" onclick="modalSelectNodeGroup(\''+uuid+'\')">Add node</button>'+
                            '<button class="btn btn-success float-right text-decoration-none text-white mr-2" type="button" onclick="syncAllGroupElements(\''+uuid+'\')">Sync all</button>'+
                            '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="backButton()">Back</button>'+
                            '<b>Nodes</b>'+
                        '</div><br>'+
                            '<table class="table" id="nodes-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed" width="100%">'+
                                '<thead>'+
                                    '<tr>'+
                                        '<th>Node name</th>'+
                                        '<th>Node ip</th>'+
                                        '<th width="10%">Actions</th>'+
                                    '</tr>'+
                                '</thead>';
                                var allNodes = new Map();
                                for(nid in groups["Nodes"]){
                                    allNodes[nid] = new Map();
                                    allNodes[nid] = groups["Nodes"][nid];
                                    htmlnodes = htmlnodes + '<tr>'+
                                        '<td style="word-wrap: break-word;">'+groups["Nodes"][nid]["nname"]+'</td>'+
                                        '<td style="word-wrap: break-word;">'+groups["Nodes"][nid]["nip"]+'</td>'+
                                        '<td style="word-wrap: break-word;"><i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete node for this group" onclick="modalDeleteNodeForGroup(\''+groups["Nodes"][nid]["dbuuid"]+'\', \''+groups["Nodes"][nid]["nname"]+'\')"></i></td>'+
                                    '</tr>';
                                }
                            htmlnodes = htmlnodes + '</table></div>';
                            //suricata table
                            htmlsuricata =
                                '<b>Suricata</b> &nbsp'+
                                '<span id="suricata-group-mode-default" style="cursor:pointer;" class="badge bg-primary align-text-bottom text-white" onclick="ChangeGroupConfigTable(\'default-suricata-group-table\')">Current status</span>&nbsp'+
                                // '<span id="suricata-mode" style="cursor:pointer;" class="badge bg-secondary align-text-bottom text-white" onclick="ChangeGroupConfigTable(\'suricata-mode\')">Mode</span>'+
                                '<span id="suricata-mode" style="cursor:pointer;" class="badge bg-secondary align-text-bottom text-white" onclick="ChangeGroupConfigTable(\'expert-suricata-group-table\')">Configuration</span>'+
                                '&nbsp'+
                                '<span id="suricata-configuration" class="badge badge-pill bg-dark align-text-bottom text-white">&nbsp Action: &nbsp '+
                                    '<span style="cursor: pointer;" title="Stop Suricata" class="badge bg-danger align-text-bottom text-white" onclick="ChangeSuricataGroupService(\''+uuid+'\', \'stop\')">Stop</span> &nbsp '+
                                    '<span style="cursor: pointer;" title="Start Suricata" class="badge bg-primary align-text-bottom text-white" onclick="ChangeSuricataGroupService(\''+uuid+'\', \'start\')">Start</span> &nbsp '+
                                '</span>'+
                                '<br><br>'+
                                '<span id="suricata-configure" class="badge badge-pill bg-dark align-text-bottom text-white" style="display:none;">Mode: &nbsp '+
                                    // '<span id="suricata-group-mode-standalone" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeGroupConfigTable(\'standalone-suricata-group-table\')">Standalone</span> &nbsp '+
                                    '<span id="suricata-group-mode-expert" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeGroupConfigTable(\'expert-suricata-group-table\')">Expert</span>'+
                                '</span> &nbsp'+
                                '<button id="group-suricata-sync-btn" class="btn btn-primary float-right text-decoration-none text-white" style="display:none;" onclick="syncAllSuricataGroup(\''+uuid+'\')">Sync</button>'+

                                //Suricata default
                                '<div id="default-suricata-group-table">'+
                                    '<table class="table" style="table-layout: fixed" width="100%">'+
                                        '<tbody>'+
                                            // '<tr>'+
                                            //     '<td style="word-wrap: break-word;" width="25%">Ruleset &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select ruleset" onclick="modalLoadRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync ruleset to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['guuid']+'\')"></i></td>';
                                            //     if(groups['gruleset']  != ""){
                                            //         htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-'+groups['guuid']+'" style="color:black;" value="'+groups['gruleset']+'">'+groups['gruleset']+'</td>';
                                            //     }else{
                                            //         htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-'+groups['guuid']+'" value="" style="color:red;">No ruleset selected...</td>';
                                            //     }
                                            //     htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;"></td>'+
                                            // '</tr>'+
                                        '</tbody>'+
                                    '</table>'+
                                    '<br>'+
                                    '<table class="table" style="table-layout: fixed" width="100%">'+
                                        '<thead>'+
                                            '<th>Node name</th>'+
                                            '<th>status</th>'+
                                            '<th>interface</th>'+
                                            '<th>Actions</th>'+
                                        '</thead>'+
                                        '<tbody id="group-suricata-list">'+
                                        '</tbody>'+
                                    '</table>'+
                                '</div>'+

                                //Suricata expert
                                '<div id="expert-suricata-group-table" style="display: none;">'+
                                    '<table class="table" style="table-layout: fixed" width="100%">'+
                                        '<tbody>'+
                                            '<tr>'+
                                                '<td style="word-wrap: break-word;" width="25%">Ruleset &nbsp <i class="fas fa-plus" style="color:Dodgerblue; cursor: pointer;" title="Select rulesets" onclick="modalAddRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync ruleset to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['guuid']+'\')"></i></td>';
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-expert-'+groups['guuid']+'" style="color:black;" value="">No rulesets selected...</td>';
                                                // if(groups['gruleset']  != ""){
                                                //     htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-expert-'+groups['guuid']+'" style="color:black;" value="">No rulesets selected...</td>';
                                                // }else{
                                                //     htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-expert-'+groups['guuid']+'" value="" style="color:red;">No ruleset selected...</td>';
                                                // }
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;"></td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td style="word-wrap: break-word;" class="align-top" rowspan="3">Configuration &nbsp '+
                                                    '<i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Suricata paths" onclick="showEditGroup(\'suricata\', \''+groups['guuid']+'\')"></i> '+
                                                    '<i class="fas fa-sync-alt" title="Sync Suricata files to all nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncPathGroup(\''+groups['guuid']+'\', \'suricata\')"></i> '+
                                                    '<span class="badge bg-primary align-text-bottom text-white" title="Check if master and node file are equals" style="color:Dodgerblue; cursor: pointer;" onclick="GetMD5files(\''+groups['guuid']+'\', \'suricata\')">Reload</span>'+
                                                '</td>'+
                                                '<td style="word-wrap: break-word;">Master path: <i class="fas fa-folder-open" style="color:dodgerblue; cursor:pointer;" onclick="ShowMasterFiles()"></i></td>';
                                                if(groups["mastersuricata"] == ""){
                                                    htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" style="color: red;" id="group-suricata-master-path" value="">No Suricata master path...</td>';
                                                }else{
                                                    htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="group-suricata-master-path" value="'+groups["mastersuricata"]+'">'+groups["mastersuricata"]+'</td>';
                                                }
                                            htmlsuricata = htmlsuricata + '</tr>'+
                                            '<tr>'+
                                                //here goes master files and their MD5
                                                '<td style="word-wrap: break-word;" colspan="2" id="master-md5-files" style="display:none;"></td>'+
                                            '</tr>'+
                                            '<tr>'+
                                                '<td style="word-wrap: break-word;">Node path:</td>';
                                                if(groups["nodesuricata"] == ""){
                                                    htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" style="color: red;" id="group-suricata-node-path" value="">No Suricata node path...</td>';
                                                }else{
                                                    htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="group-suricata-node-path" value="'+groups["nodesuricata"]+'">'+groups["nodesuricata"]+'</td>';
                                                }
                                            htmlsuricata = htmlsuricata + '</tr>'+
                                            '<tr id="suricata-edit-row" style="display:none;">'+
                                                '<td style="word-wrap: break-word;">Master path: <input class="form-control" id="suricata-group-master-'+groups['guuid']+'" value="'+groups["mastersuricata"]+'"></td>'+
                                                '<td style="word-wrap: break-word;">Node path: <input class="form-control" id="suricata-group-node-'+groups['guuid']+'" value="'+groups["nodesuricata"]+'"></td>'+
                                                '<td style="word-wrap: break-word;" width="10%">'+
                                                    '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="changePaths(\''+groups['guuid']+'\', \'suricata\')">Save</button>'+
                                                    '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditGroup(\'suricata\')">Cancel</button> &nbsp '+
                                                '</td>'+
                                            '</tr>'+
                                        '</tbody>'+
                                    '</table>'+

                                    //here goes MD5 files for master and every group node
                                    '<br>'+
                                    '<div id="suricata-expert-sync-table"></div>'+
                                '</div>'+

                                //Suricata standalone
                                '<div id="standalone-suricata-group-table" style="display: none;">'+
                                    '<table class="table" style="table-layout: fixed" width="100%">'+
                                        '<tr>';
                                            // '<td style="word-wrap: break-word;" width="25%">Ruleset &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select ruleset" onclick="modalLoadRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync ruleset to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['guuid']+'\')"></i></td>';
                                            if(groups['gruleset']  != ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-standalone-'+groups['guuid']+'" style="color:black;" value="'+groups['gruleset']+'">'+groups['gruleset']+'</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="ruleset-group-standalone-'+groups['guuid']+'" value="" style="color:red;">No ruleset selected...</td>';
                                            }
                                            htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;"></td>'+
                                        '</tr>'+
                                        '<tr id="suricata-edit-row" style="display:none;">'+
                                            '<td style="word-wrap: break-word;">Master path: <input class="form-control" id="suricata-group-master-'+groups['guuid']+'" value="'+groups["mastersuricata"]+'"></td>'+
                                            '<td style="word-wrap: break-word;">Node path: <input class="form-control" id="suricata-group-node-'+groups['guuid']+'" value="'+groups["nodesuricata"]+'"></td>'+
                                            '<td style="word-wrap: break-word;" width="10%">'+
                                                '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="changePaths(\''+groups['guuid']+'\', \'suricata\')">Save</button>'+
                                                '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditGroup(\'suricata\')">Cancel</button> &nbsp '+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td style="word-wrap: break-word;" class="align-middle" rowspan="5">Services &nbsp <i class="fas fa-sync-alt" title="Sync Suricata files to all group node" style="color:Dodgerblue; cursor: pointer;" onclick="syncSuricataGroupService(\''+uuid+'\')"></i></td>'+
                                            '<td style="word-wrap: break-word;">Interface &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select an interface" onclick="modalEditGroupService(\''+uuid+'\', \'interface\', \'interface\')"></i></td>';
                                            if(groups["interface"] == ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-interface" value="" style="color: red;">No interface selected...</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-interface" value="'+groups["interface"]+'">'+groups["interface"]+'</td>';}
                                        htmlsuricata = htmlsuricata + '</tr>'+
                                        '<tr>'+
                                            '<td style="word-wrap: break-word;">BPF file &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a BPF file path" onclick="modalEditGroupService(\''+uuid+'\', \'BPFfile\', \'BPF file\')"></i></td>';
                                            if(groups["BPFfile"] == ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-bpffile" value="" style="color: red;">No BPF file selected...</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-bpffile" value="'+groups["BPFfile"]+'">'+groups["BPFfile"]+'</td>';}
                                        htmlsuricata = htmlsuricata + '</tr>'+
                                        '<tr>'+
                                            '<td style="word-wrap: break-word;">BPF rule &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a BPF rule" onclick="modalEditGroupService(\''+uuid+'\', \'BPFrule\', \'BPF rule\')"></i></td>';
                                            if(groups["BPFrule"] == ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-bpfrule" value="" style="color: red;">No BPF rule selected...</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-bpfrule" value="'+groups["BPFrule"]+'">'+groups["BPFrule"]+'</td>';}
                                        htmlsuricata = htmlsuricata + '</tr>'+
                                        '<tr>'+
                                            '<td style="word-wrap: break-word;">Config file &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a config file path" onclick="modalEditGroupService(\''+uuid+'\', \'configFile\', \'config file\')"></i></td>';
                                            if(groups["configFile"] == ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-configfile" value="" style="color: red;">No config file selected...</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-configfile" value="'+groups["configFile"]+'">'+groups["configFile"]+'</td>';
                                            }
                                        htmlsuricata = htmlsuricata + '</tr>'+
                                        '<tr>'+
                                        '<td style="word-wrap: break-word;">Command line &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Command line" onclick="modalEditGroupService(\''+uuid+'\', \'commandLine\', \'command line\')"></i></td>';
                                            if(groups["commandLine"] == ""){
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-commandline" value="" style="color: red;">No command line selected...</td>';
                                            }else{
                                                htmlsuricata = htmlsuricata + '<td style="word-wrap: break-word;" id="service-commandline" value="'+groups["commandLine"]+'">'+groups["commandLine"]+'</td>';}
                                        htmlsuricata = htmlsuricata + '</tr>'+
                                    '</table>'+
                                '</div>';

                            //zeek table
                            htmlzeek = "<div>"+
                            '<b>Zeek</b> '+
                            '<span id="zeek-configure" class="badge badge-pill bg-dark align-text-bottom text-white">Edit Configuration &nbsp '+
                                '<span id="group-zeek-mode-expert" class="badge bg-primary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeGroupConfigTable(\'expert-zeek-table\')">Expert</span> &nbsp'+
                                '<span id="group-zeek-mode-cluster" class="badge bg-secondary align-text-bottom text-white" style="cursor:pointer;" onclick="ChangeGroupConfigTable(\'cluster-zeek-table\')">Cluster</span> &nbsp '+
                            '</span> '+

                            '<button id="group-zeek-add-cluster-btn" style="display:none;" class="btn btn-primary float-right text-decoration-none text-white" onclick="modalAddCluster(\''+uuid+'\')">Add Cluster</button>'+
                            //zeek expert
                            '<div id="group-zeek-expert">'+
                                '<table class="table" id="zeek-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed"  width="100%">'+
                                    '<tbody>';
                                        htmlzeek = htmlzeek + '<tr>'+
                                            '<td style="word-wrap: break-word;" width="20%" class="align-middle" rowspan="2">Policies &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Zeek paths" onclick="showEditGroup(\'zeek\', \''+groups['guuid']+'\')"></i> <i class="fas fa-sync-alt" title="Sync files from master to node" style="color:Dodgerblue; cursor: pointer;" onclick="SyncPathGroup(\''+groups['guuid']+'\', \'zeek\')"></i></td>'+
                                            '<td style="word-wrap: break-word;">Master path</td>';
                                            if(groups["masterzeek"] == ""){
                                                htmlzeek = htmlzeek + '<td style="word-wrap: break-word;" id="group-zeek-master-path" value="" style="color: red;">No Zeek master path...</td>';
                                            }else{
                                                htmlzeek = htmlzeek + '<td style="word-wrap: break-word;" id="group-zeek-master-path" value="'+groups["masterzeek"]+'">'+groups["masterzeek"]+'</td>';
                                            }
                                        htmlzeek = htmlzeek + '</tr>'+
                                        '<tr>'+
                                            '<td style="word-wrap: break-word;">Node path</td>';
                                            if(groups["nodezeek"] == ""){
                                                htmlzeek = htmlzeek + '<td style="word-wrap: break-word;" id="group-zeek-node-path" value="" style="color: red;">No Zeek node path...</td>';
                                            }else{
                                                htmlzeek = htmlzeek + '<td style="word-wrap: break-word;" id="group-zeek-node-path" value="'+groups["nodezeek"]+'">'+groups["nodezeek"]+'</td>';
                                            }
                                            htmlzeek = htmlzeek + '</tr>'+
                                        '<tr id="zeek-edit-row" style="display:none;">'+
                                            '<td style="word-wrap: break-word;">Master: <input class="form-control" id="zeek-group-master-'+groups['guuid']+'" value="'+groups["masterzeek"]+'"></td>'+
                                            '<td style="word-wrap: break-word;">Node: <input class="form-control" id="zeek-group-node-'+groups['guuid']+'" value="'+groups["nodezeek"]+'"></td>'+
                                            '<td style="word-wrap: break-word;" width="10%">'+
                                                '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="changePaths(\''+groups['guuid']+'\', \'zeek\')">Save</button>'+
                                                '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditGroup(\'zeek\')">Cancel</button> &nbsp '+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>'+
                            '</div>'+
                            //zeek cluster
                            '<div id="group-zeek-cluster" style="display:none;">'+
                                '<table id="cluster-elements" class="table" style="table-layout: fixed" width="100%">'+
                                '</table>';
                            '</div>';

                            //analyzer table
                            htmlanalyzer = "<div>"+
                            '<b>Analyzer</b>'+
                            '<table class="table" id="cluster-for-group-'+groups['guuid']+'" style="table-layout: fixed" width="100%">'+
                                '<tbody>'+
                                    '<tr>'+
                                        '<td style="word-wrap: break-word;">'+
                                            '<span style="cursor: pointer;" id="group-enable-all-analyzer" class="badge bg-primary align-text-bottom text-white float-left mr-2" >Enable all</span>'+
                                            '<span style="cursor: pointer;" id="group-disable-all-analyzer" class="badge bg-success align-text-bottom text-white float-left mr-2" >Disable all</span>'+
                                        '</td>'+
                                        '<td style="word-wrap: break-word;">Edit analyzer &nbsp <i class="fas fa-edit" style="color: dodgerblue; cursor: pointer;" onclick="editAnalyzer(\'local\', \'group-analyzer\', \''+gname+'\')"></i></td>'+
                                        '<td style="word-wrap: break-word;">Synchronize analyzer &nbsp <i class="fas fa-sync" id="group-sync-analyzer" style="color: dodgerblue; cursor: pointer;"></i></td>'+
                                    '</tr>'+
                                '</tbody>'+
                            '</table>'+
                            '<table class="table" id="analyzer-nodes-status" style="table-layout: fixed" width="100%">'+
                            '</table>'+
                        '</tr>';
                    }

                }
                resultnodes.innerHTML = htmlnodes;
                resultsuricata.innerHTML = htmlsuricata;
                resultzeek.innerHTML = htmlzeek;
                resultanalyzer.innerHTML = htmlanalyzer;

            }
            $('#group-sync-analyzer').click(function(){ syncAnalyzer(uuid); });
            $('#group-enable-all-analyzer').click(function(){ ChangeAnalyzerStatus(allNodes, "Enabled"); });
            $('#group-disable-all-analyzer').click(function(){ ChangeAnalyzerStatus(allNodes, "Disabled"); });
            LoadAnalyzerNodeStatus(allNodes);
            GetAllClusterFiles(uuid);
            SuricataNodesStatus(uuid);
            loadGroupRulesets(uuid)
            GetMD5files(uuid,"suricata")
        }

    })
    .catch(function (error) {
        document.getElementById('progressBar-options-div').style.display="none";
        document.getElementById('progressBar-options').style.display="none";
        resultnodes.innerHTML = '<h3 align="center">No connection</h3>';
    });
}

function LoadAnalyzerNodeStatus(allNodes){
    var html = '<thead>'+
        '<tr>'+
            '<th>Node name</th>'+
            '<th>Node IP</th>'+
            '<th>Node status</th>'+
        '</tr>'+
    '</thead>'
    '<tbody>';
    for(x in allNodes){
        html = html + '<tr>'+
            '<td style="word-wrap: break-word;">'+allNodes[x]["nname"]+'</td>'+
            '<td style="word-wrap: break-word;">'+allNodes[x]["nip"]+'</td>';
            if(allNodes[x]["nstatus"] == "Enabled"){
                html = html + '<td style="word-wrap: break-word;"> <span class="badge bg-success align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">Enabled</span> </td>';
            }else if(allNodes[x]["nstatus"] == "Disabled"){
                html = html + '<td style="word-wrap: break-word;"> <span class="badge bg-danger align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">Disabled</span> </td>';
            }else{
                html = html + '<td style="word-wrap: break-word;"> <span class="badge bg-dark align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">N/A</span> </td>';
            }
        html = html + '</tr>';
    }
    html = html + '</tbody>';
    document.getElementById('analyzer-nodes-status').innerHTML = html;
}

async function ChangeAnalyzerStatus(nodes, status){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer';

    for(x in nodes){
        var jsonAnalyzer = {}
        jsonAnalyzer["uuid"] = nodes[x]["nuuid"];
        jsonAnalyzer["type"] = "groups";
        jsonAnalyzer["status"] = status;
        var dataJSON = JSON.stringify(jsonAnalyzer);

        // let response = await axios.put('https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer',{timeout: 30000,
        // headers:{'token': document.cookie,'user': payload.user}, data: dataJSON});
        await axios({
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
                        '<strong>Error!</strong> Change analyzer status: '+response.data.error+'.'+
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
                '<strong>Error!</strong>  Change analyzer status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
    GetGroupsDetails();
}

function editAnalyzer(node, type, name){
    if(node == "none"){
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
            '<strong>Alert!</strong> A node is needed for use the analyzer.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        document.location.href = 'https://' + location.host + '/edit.html?uuid='+node+'&file='+type+'&node='+name;
    }
}

function SuricataNodesStatus(guuid){
    var suricatas = document.getElementById('group-suricata-list');
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/group/suricata/status/'+guuid;

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
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error Suricata: </strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                var html = '';
                for(x in response.data){
                    if(response.data[x]["type"] == "suricata"){
                        html = html + '<tr bpf="'+response.data[x]["bpf"]+'" guuid="'+x+'" uuid="'+response.data[x]["node"]+'" interface="'+response.data[x]["interface"]+'">'+
                            '<td style="word-wrap: break-word;">'+response.data[x]["nodeName"]+'</td>'+
                            '<td style="word-wrap: break-word;">';
                                if(response.data[x]["status"] == "enabled"){
                                    html = html + '<span class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[x]["status"]+'</span>';
                                }else if(response.data[x]["status"] == "disabled"){
                                    html = html + '<span class="badge badge-pill bg-danger align-text-bottom text-white">'+response.data[x]["status"]+'</span>';
                                }
                            html = html + '</td>'+
                            '<td style="word-wrap: break-word;">'+response.data[x]["interface"]+'</td>'+
                            '<td style="word-wrap: break-word;"> <i class="fas fa-info" style="color: dodgerblue;"></i> </td>'+
                        '</tr>';
                    }
                }
                suricatas.innerHTML = html;
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error Suricata: </strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function ChangeSuricataGroupService(uuid,action){
    $('#group-suricata-list > tr').each(function() {
        if(action == "start"){
            ChangeServiceStatus($(this).attr('uuid'), $(this).attr('guuid'), 'status', 'enabled', $(this).attr('interface'), $(this).attr('bpf'), 'suricata');
        }else{
            ChangeServiceStatus($(this).attr('uuid'), $(this).attr('guuid'), 'status', 'disabled', $(this).attr('interface'), $(this).attr('bpf'), 'suricata');
        }
    });
}
function ChangeServiceStatus(uuid, service, param, status, interface, bpf, type){
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
    jsonChangeService["bpf"] = bpf;
    jsonChangeService["interface"] = interface;
    var dataJSON = JSON.stringify(jsonChangeService);

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
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change group service status: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
            }else{
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                GetGroupsDetails();
            }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error!</strong> Change group service status: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
    });

}

async function syncAnalyzer(group){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer/sync';

    var values = {}
    values["uuid"] = group;
    var dataJSON = JSON.stringify(values);

    await axios({
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
            for(x in response.data){
                if(response.data[x]["status"] == "error"){
                    errorNodes = errorNodes + response.data[x]["name"]+" ";
                    response.data.ack = "alert";
                }
            }
            if (response.data.ack == "alert") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-warning alert-dismissible fade show">'+
                    '<strong>Error!</strong> Nodes not synchronized: '+errorNodes
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Sync analyzer: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> All analyzers synchronized successfully.'+
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
            '<strong>Error!</strong> Sync analyzer status: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
    GetGroupsDetails();
}

function syncAllGroupElements(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/group/syncAll/'+uuid;
    // var newSyn = new Map();

    // //sync suricata ruleset
    // newSyn["suricata-rulesets"] = new Map();
    // newSyn["suricata-rulesets"]["ruleset-group"] = document.getElementById('ruleset-group-'+uuid).getAttribute("value");

    // //sync suricata config
    // newSyn["suricata-config"] = new Map();
    // newSyn["suricata-config"]["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
    // newSyn["suricata-config"]["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");

    // //sync suricata services
    // newSyn["suricata-services"] = new Map();
    // newSyn["suricata-services"]["interface"] = document.getElementById('service-interface').getAttribute("value");
    // newSyn["suricata-services"]["BPFfile"] =   document.getElementById('service-bpffile').getAttribute("value");
    // newSyn["suricata-services"]["BPFrule"] =   document.getElementById('service-bpfrule').getAttribute("value");
    // newSyn["suricata-services"]["configFile"] =document.getElementById('service-configfile').getAttribute("value");
    // newSyn["suricata-services"]["commandLine"]=document.getElementById('service-commandline').getAttribute("value");

    // // //sync zeek policies
    // // newSyn["zeek-policies"] = new Map();
    // // newSyn["zeek-policies"]["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
    // // newSyn["zeek-policies"]["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");

    // var dataJSON = JSON.stringify(newSyn);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        // data: dataJSON
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
                    '<strong>Success!</strong> Group synchronization complete.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
                GetGroupsDetails();
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Sync all: '+response.data.error+''+
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
            '<strong>Error!</strong>  Sync all: '+error+''+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function changePaths(guuid, type){
    if(type=="suricata" && document.getElementById("suricata-group-master-"+guuid).value == "" ||
    type=="suricata" && document.getElementById("suricata-group-node-"+guuid).value == "" ||
    type=="zeek" && document.getElementById("zeek-group-master-"+guuid).value == "" ||
    type=="zeek" && document.getElementById("zeek-group-node-"+guuid).value == ""
    ){
        if(type == "suricata"){
            if(document.getElementById("suricata-group-master-"+guuid).value == ""){
                $('#suricata-group-master-'+guuid).attr("placeholder", "Please, insert a valid master path");
                $('#suricata-group-master-'+guuid).css('border', '2px solid red');
            }else{
                $('#suricata-group-master-'+guuid).css('border', '2px solid #ced4da');
            }
            if(document.getElementById("suricata-group-node-"+guuid).value == ""){
                $('#suricata-group-node-'+guuid).attr("placeholder", "Please, insert a valid node path");
                $('#suricata-group-node-'+guuid).css('border', '2px solid red');
            }else{
                $('#suricata-group-node-'+guuid).css('border', '2px solid #ced4da');
            }
        }
        if(type == "zeek"){
            if(document.getElementById("zeek-group-master-"+guuid).value == ""){
                $('#zeek-group-master-'+guuid).attr("placeholder", "Please, insert a valid master path");
                $('#zeek-group-master-'+guuid).css('border', '2px solid red');
            }else{
                $('#zeek-group-master-'+guuid).css('border', '2px solid #ced4da');
            }
            if(document.getElementById("zeek-group-node-"+guuid).value == ""){
                $('#zeek-group-node-'+guuid).attr("placeholder", "Please, insert a valid node path");
                $('#zeek-group-node-'+guuid).css('border', '2px solid red');
            }else{
                $('#zeek-group-node-'+guuid).css('border', '2px solid #ced4da');
            }
        }
    }else{
        hideEditGroup(type);
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/changePaths';
        var groupjson = {}
        groupjson["uuid"] = guuid;
        groupjson["type"] = type;
        if(type == "suricata"){
            groupjson["mastersuricata"] = document.getElementById('suricata-group-master-'+guuid).value.trim();
            groupjson["nodesuricata"] = document.getElementById('suricata-group-node-'+guuid).value.trim();
        }else{
            groupjson["masterzeek"] = document.getElementById('zeek-group-master-'+guuid).value.trim();
            groupjson["nodezeek"] = document.getElementById('zeek-group-node-'+guuid).value.trim();
        }
        var grJSON = JSON.stringify(groupjson);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{'token': document.cookie,'user': payload.user},
            data: grJSON
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
                            '<strong>Success!</strong> Paths updated successfully.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                        GetGroupsDetails();
                    }else{
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                            '<strong>Error!</strong> Change paths: '+response.data.error+''+
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
                    '<strong>Error!</strong> Change paths: '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            });
    }
}

function ShowMasterFiles(){
    if($("#master-md5-files").is(':visible')){
        $("#master-md5-files").hide();
    }else{
        $("#master-md5-files").show();
    }
}

function ShowFilesMd5(nuuid){
    $('.node').each(function() {
        if($(this).attr('node') == nuuid){
            if($(this).is(':visible')){
                $(this).hide();
            }else{
                $(this).show();
            }
        }
    });
}

async function GetMD5files(guuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    //load MD5 files
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getMD5files';
    var groupjson = {}
    groupjson["uuid"] = guuid;
    groupjson["type"] = type;
    if(type == "suricata"){
        groupjson["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
        groupjson["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");
    }else{
        groupjson["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
        groupjson["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");
    }
    var grJSON = JSON.stringify(groupjson);

    //load all nodes for a group
    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';
    await axios({
        method: 'get',
        url: groupurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            var html = '<table class="table" width="100%" style="table-layout: fixed">'+
                '<thead>'+
                    '<tr>'+
                        '<th colspan="2">Node name</th>'+
                        '<th>Node IP</th>'+
                        '<th>Actions</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody id="files-checked-list">';
                    for(x in response.data){
                        for(y in response.data[x].Nodes){
                            html = html + '<tr>'+
                                    '<td style="word-wrap: break-word;" colspan="2">'+response.data[x].Nodes[y]["nname"]+'</td>'+
                                    '<td style="word-wrap: break-word;">'+response.data[x].Nodes[y]["nip"]+'</td>'+
                                    '<td style="word-wrap: break-word;">'+
                                        '<i style="color: dodgerblue; cursor:pointer;" class="fas fa-folder-open" onclick="ShowFilesMd5(\''+response.data[x].Nodes[y]["nuuid"]+'\')"></i> '+
                                        '<span id="global-files-status-'+response.data[x].Nodes[y]["nuuid"]+'" class="badge badge-pill bg-secondary align-text-bottom text-white">&nbsp</span>'+
                                    '</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td style="word-wrap: break-word;" colspan="4" id="files-'+response.data[x].Nodes[y]["nuuid"]+'"></td>'+
                                '</tr>';
                        }
                    html = html + '</tbody>'+
                    '</table>';
                    document.getElementById('suricata-expert-sync-table').innerHTML = html;
                }
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error checking files!</strong> Sync path: '+error+''+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    })

    //Put all files into table
    await axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
    })
    .then(function (responseBody) {
        if(responseBody.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(responseBody.data.permissions == "none"){
            PrivilegesMessage();
        }else{
                     //PUT ALL FILES LIST
                     var masterPaths = [];
                     var masterMD5 = [];
                     for(id in responseBody.data){
                         var MD5PathError = false;
                         for(file in responseBody.data[id]){
                            //get all master files
                            if(!masterPaths.includes(responseBody.data[id][file]["masterPath"])){
                                masterPaths.push(responseBody.data[id][file]["masterPath"]);
                                masterMD5.push(responseBody.data[id][file]["masterMD5"]);
                            }

                            //node files
                            var html2 = '<table style="display:none;" width="100%" bgcolor="AliceBlue" class="node" node="'+id+'">'+
                                '<tr>'+
                                    '<td style="word-wrap: break-word;"><b>File:</b> '+responseBody.data[id][file]["nodePath"]+'</td>'+
                                    '<td style="word-wrap: break-word;"><b>Master MD5:</b> '+responseBody.data[id][file]["masterMD5"]+'</td>'+
                                    '<td style="word-wrap: break-word;"><b>Node MD5:</b> '+responseBody.data[id][file]["nodeMD5"]+'</td>'+
                                    '<td style="word-wrap: break-word;">';
                                        if(responseBody.data[id][file]["equals"] == "true"){
                                            html2 = html2 + '<span class="badge-pill badge bg-success align-text-bottom text-white"> &nbsp </span>';
                                        }else{
                                            html2 = html2 + '<span class="badge-pill badge bg-danger align-text-bottom text-white"> &nbsp </span>';
                                            MD5PathError = true;
                                        }
                                    html2 = html2 + '</td>'+
                                '</tr>'+
                            '</table>';
                            //check if element exists. Then, put content
                            if($('#files-'+id).length >0){
                                document.getElementById('files-'+id).innerHTML = document.getElementById('files-'+id).innerHTML + html2;
                            }
                        }
                        //check if there are error for change main pill color
                        if(MD5PathError){
                            $('#global-files-status-'+id).attr('class', 'badge badge-pill bg-danger align-text-bottom text-white');
                        }else{
                            $('#global-files-status-'+id).attr('class', 'badge badge-pill bg-success align-text-bottom text-white');
                        }
                    }

                    //Master files and their MD5
                    var masterFiles = '<table width="100%" class="table" style="table-layout: fixed;">';
                    for(x in masterPaths)  {
                        masterFiles = masterFiles + '<tr>'+
                            '<td style="word-wrap: break-word;"><i class="fas fa-file" style="color:dodgerblue; cursor:pointer;" onclick="loadClusterFile(\'none\',\''+masterPaths[x]+'\',\'Master File\')"></i> <b>Path:</b> '+masterPaths[x]+'</td>'+
                            '<td style="word-wrap: break-word;"><b>MD5:</b> '+masterMD5[x]+'</td>'+
                        '<tr>';
                    }
                    masterFiles = masterFiles + '</table>';
                    document.getElementById('master-md5-files').innerHTML = masterFiles;
        }
    })
    .catch(function (error) {
        console.log(error);
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Error checking all files!</strong> Sync path: '+error+''+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

// function loadClusterFile(uuid, path, type){
//     var ipmaster = document.getElementById('ip-master').value;
//     document.location.host.href = 'https://' + ipmaster + '/show-file-content.html?type='+type+'&uuid='+uuid+'&path='+path;
// }

// async function GetMD5files(guuid, type){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     //load all nodes for a group
//     var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';

//     await axios({
//         method: 'get',
//         url: groupurl,
//         timeout: 30000,
//         headers:{'token': document.cookie,'user': payload.user}
//     })
//     .then(function (response) {
//         if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         if(response.data.permissions == "none"){
//             PrivilegesMessage();
//         }else{
//             var html = '<table class="table" width="100%" style="table-layout: fixed">'+
//                 '<thead>'+
//                     '<tr>'+
//                         '<th colspan="2">Node name</th>'+
//                         '<th>Node IP</th>'+
//                         '<th>Actions</th>'+
//                     '</tr>'+
//                 '</thead>'+
//                 '<tbody id="files-checked-list">';
//                     for(x in response.data){
//                         for(y in response.data[x].Nodes){
//                             html = html + '<tr>'+
//                                 '<td style="word-wrap: break-word;" colspan="2">'+response.data[x].Nodes[y]["nname"]+'</td>'+
//                                 '<td style="word-wrap: break-word;">'+response.data[x].Nodes[y]["nip"]+'</td>'+
//                                 '<td style="word-wrap: break-word;"><i style="color: dodgerblue;" class="fas fa-folder-open" onclick="ShowFilesMd5(\''+response.data[x].Nodes[y]["nuuid"]+'\')"></i></td>'+
//                             '</tr>'+
//                             '<tr id="file-row-'+response.data[x].Nodes[y]["nuuid"]+'">'+
//                             '</tr>';
//                         }
//                     }
//                 html = html + '</tbody>'+
//                 '</table>';
//                 document.getElementById('suricata-expert-sync-table').innerHTML = html;
//         }
//     })
//     .catch(function (error) {
//         console.log(error);
//         $('html,body').scrollTop(0);
//         var alert = document.getElementById('floating-alert');
//         alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//             '<strong>Error checking files!</strong> Sync path: '+error+''+
//             '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                 '<span aria-hidden="true">&times;</span>'+
//             '</button>'+
//         '</div>';
//         setTimeout(function() {$(".alert").alert('close')}, 30000);
//     })


//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     //load MD5 files
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getMD5files';
//     var groupjson = {}
//     groupjson["uuid"] = guuid;
//     groupjson["type"] = type;
//     if(type == "suricata"){
//         groupjson["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
//         groupjson["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");
//     }else{
//         groupjson["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
//         groupjson["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");
//     }
//     var grJSON = JSON.stringify(groupjson);

//     await axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         headers:{'token': document.cookie,'user': payload.user},
//         data: grJSON
//     })
//     .then(function (responseBody) {
//         if(responseBody.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         if(responseBody.data.permissions == "none"){
//             PrivilegesMessage();
//         }else{
//             //PUT ALL FILES LIST
//             for(id in responseBody.data){
//                 var html2 = '';
//                 for(file in responseBody.data[id]){
//                     html2 = html2 + '<table>'+
//                         '<tr>'+
//                             '<td style="word-wrap: break-word;">File: '+responseBody.data[id][file]["path"]+'</td>'+
//                             '<td style="word-wrap: break-word;">Master MD5: '+responseBody.data[id][file]["md5"]+'</td>'+
//                             '<td style="word-wrap: break-word;">Node MD5: '+responseBody.data[id][file]["md5"]+'</td>'+
//                             '<td style="word-wrap: break-word;">';
//                                 if(responseBody.data[id][file]["equals"] == "true"){
//                                     html2 = html2 + '<span class="badge bg-success align-text-bottom text-white">Equals</span>';
//                                 }else{
//                                     html2 = html2 + '<span class="badge bg-danger align-text-bottom text-white">Not equals</span>';
//                                 }
//                             html2 = html2 + '</td>'+
//                         '</tr>'+
//                     '</table>';
//                 }

//                 console.log('file-row-'+id+"   -----   "+document.getElementById('file-row-'+id).innerHTML);
//                 document.getElementById('file-row-'+id).innerHTML + html2;
//             }
//         }
//     })
//     .catch(function (error) {
//         console.log(error);
//         $('html,body').scrollTop(0);
//         var alert = document.getElementById('floating-alert');
//         alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//             '<strong>Error checking all files!</strong> Sync path: '+error+''+
//             '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                 '<span aria-hidden="true">&times;</span>'+
//             '</button>'+
//         '</div>';
//         setTimeout(function() {$(".alert").alert('close')}, 30000);
//     });

// }

// async function GetAllFiles(guuid, type){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     //load MD5 files
//     var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getMD5files';
//     var groupjson = {}
//     groupjson["uuid"] = guuid;
//     groupjson["type"] = type;
//     if(type == "suricata"){
//         groupjson["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
//         groupjson["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");
//     }else{
//         groupjson["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
//         groupjson["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");
//     }
//     var grJSON = JSON.stringify(groupjson);

//     await axios({
//         method: 'put',
//         url: nodeurl,
//         timeout: 30000,
//         headers:{'token': document.cookie,'user': payload.user},
//         data: grJSON
//     })
//     .then(function (responseBody) {
//         if(responseBody.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//         if(responseBody.data.permissions == "none"){
//             PrivilegesMessage();
//         }else{
//                     //PUT ALL FILES LIST
//                     for(id in responseBody.data){
//                         var html2 = '';
//                         for(file in responseBody.data[id]){
//                             html2 = html2 + '<table>'+
//                                 '<tr>'+
//                                     '<td style="word-wrap: break-word;">File: '+responseBody.data[id][file]["path"]+'</td>'+
//                                     '<td style="word-wrap: break-word;">Master MD5: '+responseBody.data[id][file]["md5"]+'</td>'+
//                                     '<td style="word-wrap: break-word;">Node MD5: '+responseBody.data[id][file]["md5"]+'</td>'+
//                                     '<td style="word-wrap: break-word;">';
//                                         if(responseBody.data[id][file]["equals"] == "true"){
//                                             html2 = html2 + '<span class="badge bg-success align-text-bottom text-white">Equals</span>';
//                                         }else{
//                                             html2 = html2 + '<span class="badge bg-danger align-text-bottom text-white">Not equals</span>';
//                                         }
//                                         html2 = html2 + '</td>'+
//                                 '</tr>'+
//                             '</table>';
//                         }
//                         document.getElementById('file-row-'+id).innerHTML = document.getElementById('file-row-'+id).innerHTML + html2;
//                     }
//         }
//     })
//     .catch(function (error) {
//         console.log(error);
//         $('html,body').scrollTop(0);
//         var alert = document.getElementById('floating-alert');
//         alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//             '<strong>Error checking all files!</strong> Sync path: '+error+''+
//             '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                 '<span aria-hidden="true">&times;</span>'+
//             '</button>'+
//         '</div>';
//         setTimeout(function() {$(".alert").alert('close')}, 30000);
//     });
// }

function SyncPathGroup(guuid, type){
    if(type == "suricata" && document.getElementById('group-suricata-master-path').getAttribute("value") == "" ||
        type == "suricata" && document.getElementById('group-suricata-node-path').getAttribute("value") == "" ||
        type == "zeek" && document.getElementById('group-zeek-master-path').getAttribute("value") == "" ||
        type == "zeek" && document.getElementById('group-zeek-node-path').getAttribute("value") == ""){

            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Paths are void. Please, insert a valid path.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);

    }else{
        hideEditGroup(type);
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/syncPathGroup';

        var groupjson = {}
        groupjson["uuid"] = guuid;
        groupjson["type"] = type;
        if(type == "suricata"){
            groupjson["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
            groupjson["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");
        }else{
            groupjson["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
            groupjson["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");
        }
        var grJSON = JSON.stringify(groupjson);
        axios({
            method: 'post',
            url: nodeurl,
            timeout: 30000,
            headers:{'token': document.cookie,'user': payload.user},
            data: grJSON
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
                        '<strong>Success!</strong> Paths synchronized successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                    GetGroupsDetails();
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Sync path: '+response.data.error+''+
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
                '<strong>Error!</strong> Sync path: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
    }
}

function showEditGroup(type, guuid){
    if(type=="suricata" || type=="zeek"){
        $('#'+type+'-group-master-'+guuid).css('border', '2px solid #ced4da');
        $('#'+type+'-group-node-'+guuid).css('border', '2px solid #ced4da');
        $('#'+type+'-group-master-'+guuid).attr('placeholder', '');
        $('#'+type+'-group-node-'+guuid).attr('placeholder', '');
    }
    $('#'+type+'-edit-row').show();
}

function hideEditGroup(type){
    $('#'+type+'-edit-row').hide();
}

function backButton(){
    window.history.back();
}

function loadClusterFile(uuid, path, type){
    document.location.href = 'https://' + location.host + '/show-file-content.html?type='+type+'&uuid='+uuid+'&path='+path;
}

function modalLoadRuleset(group){
    document.getElementById('modal-groups').innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Groups rulesets</h4>'+
                '<button type="button" class="close" id="ruleset-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;" id="group-ruleset-values">'+
            '</div>'+

            '<div class="modal-footer" id="ruleset-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="ruleset-group-close">Close</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#ruleset-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#ruleset-group-close').click(function(){ $('#modal-groups').modal("hide");});

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset', {headers:{'token': document.cookie,'user': payload.user}})
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                if (typeof response.data.error != "undefined"){
                    document.getElementById('group-ruleset-values').innerHTML = '<p>No rules available...</p>';
                }else{
                    var html = '';
                    html = html + '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                        '<thead>'+
                            '<th>Ruleset</th>'+
                            '<th>Select</th>'+
                        '</thead>'+
                        '<tbody>';
                            for(id in response.data){
                                html = html + '<tr>'+
                                    '<td style="word-wrap: break-word;">'+response.data[id]["name"]+'</td>'+
                                    '<td style="word-wrap: break-word;"><button type="submit" class="btn btn-primary" onclick="selectGroupRuleset(\''+group+'\', \''+response.data[id]["name"]+'\', \''+id+'\')">Select</button></td>'+
                                '<tr>';
                            }
                        html = html + '</tbody>'+
                    '</table>';
                    document.getElementById('group-ruleset-values').innerHTML = html;
                }
            }
        })
        .catch(function (error) {
            document.getElementById('group-ruleset-values').innerHTML = '<p>Error retrieving rules</p>';
        });
}

function syncAllSuricataGroup(guuid){
    syncSuricataGroupService(guuid)
    SyncPathGroup(guuid, "suricata");
    // SyncRulesetToAllGroupNodes(guuid);
}

function syncSuricataGroupService(guuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/syncAllSuricataGroup';

    var groupjson = {}
    groupjson["uuid"] = guuid;
    var grJSON = JSON.stringify(groupjson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                if(response.data.acke == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Sync group: '+error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Group synchronized successfully.'+
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
                '<strong>Error!</strong> Sync group: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function GetAllClusterFiles(guuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getClusterFiles/'+guuid;

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
                var html = '<tr>'+
                        '<td style="word-wrap: break-word;" id="cluster-row-span" rowspan="2" class="align-middle" width="20%">Cluster <i class="fas fa-sync" style="color:dodgerblue; cursor:pointer" onclick="SyncClusterFile(\''+guuid+'\', \'all\')"></i> </td>'+
                        '<th>Cluster path</td>'+
                        '<th width="20%">Actions</td>'+
                    '</tr>';
                var count = 1;
                for(uuid in response.data){
                    count = count+2;
                    html = html +'<tr>'+
                        '<td style="word-wrap: break-word;">'+response.data[uuid]["path"]+'</td>'+
                        '<td style="word-wrap: break-word;">'+
                            '<i id="edit-cluster-data-'+uuid+'" class="fas fa-edit" style="color:dodgerblue; cursor:pointer" onclick="showEditGroup(\''+uuid+'\')"></i> &nbsp'+
                            '<i class="fas fa-eye" style="color:dodgerblue; cursor:pointer" onclick="loadClusterFile(\''+uuid+'\', \''+response.data[uuid]["path"]+'\', \'Cluster group\')"></i> &nbsp'+
                            '<i class="fas fa-sync" style="color:dodgerblue; cursor:pointer" onclick="SyncClusterFile(\''+uuid+'\', \'one\')"></i> &nbsp'+
                            '<i class="fas fa-trash-alt" style="color:red; cursor:pointer" onclick="modalDeleteCluster(\''+uuid+'\', \''+response.data[uuid]["path"]+'\')"></i> &nbsp'+
                        '</td>'+
                    '</tr>'+
                    '<tr id="'+uuid+'-edit-row" style="display:none;" bgcolor="AntiqueWhite">'+
                        '<td style="word-wrap: break-word;">'+
                            '<div class="input-group">Path: &nbsp <input class="form-control" id="new-cluster-value-'+uuid+'" value="'+response.data[uuid]["path"]+'"></input></div>'+
                        '</td>'+
                        '<td style="word-wrap: break-word;" class="align-middle">'+
                            '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" id="edit-cluster-data-save-'+uuid+'" onclick="changeClusterValue(\''+guuid+'\', \''+uuid+'\')">Save</button>'+
                            '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" id="edit-cluster-data-close-'+uuid+'" onclick="hideEditGroup(\''+uuid+'\')">Cancel</button>'+
                        '</td>'+
                    '</tr>';
                }
                document.getElementById('cluster-elements').innerHTML = html;
                document.getElementById('cluster-row-span').rowSpan = count;
            }
        })
        .catch(function (error) {
        });
}

function SyncClusterFile(uuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    if(type == "one"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/syncClusterFile';
    }else{
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/syncAllGroupCluster';
    }
    var groupjson = {}
    groupjson["uuid"] = uuid;
    var grJSON = JSON.stringify(groupjson);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
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
                        '<strong>Error!</strong> Sync cluster file: '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Cluster file synchronized correctly.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
                GetGroupsDetails();
            }
        })
        .catch(function error() {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Sync cluster file: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function changeClusterValue(guuid, uuid){
    if(document.getElementById("new-cluster-value-"+uuid).value == ""){
        $('#new-cluster-value-'+uuid).attr("placeholder", "Please, insert a valid cluster path");
        $('#new-cluster-value-'+uuid).css('border', '2px solid red');
    }else{
        hideEditGroup(uuid);
        var ipmaster = document.getElementById('ip-master').value;
        var portmaster = document.getElementById('port-master').value;
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/changeClusterValue';

        var groupjson = {}
        groupjson["uuid"] = uuid;
        groupjson["guuid"] = guuid;
        groupjson["path"] = document.getElementById('new-cluster-value-'+uuid).value;
        var grJSON = JSON.stringify(groupjson);
        axios({
            method: 'put',
            url: nodeurl,
            timeout: 30000,
            headers:{'token': document.cookie,'user': payload.user},
            data: grJSON
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
                            '<strong>Error!</strong> '+response.data.error+'.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                    }else{
                        $('html,body').scrollTop(0);
                        var alert = document.getElementById('floating-alert');
                        alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                            '<strong>Success!</strong> Cluster file synchronized successfully.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                        GetGroupsDetails();
                    }
                }
            })
            .catch(function error() {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            });
    }
}

function modalDeleteCluster(uuid, name){
    var modalWindowDelete = document.getElementById('modal-groups');
    modalWindowDelete.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Delete cluster</h4>'+
                '<button type="button" class="close" id="delete-cluster-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;">'+
                '<p>Do you want to remove cluster <b>'+name+'</b> from the list?</p>'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="delete-cluster-group-close">Close</button>'+
                '<button type="submit" class="btn btn-danger" id="delete-cluster-group">Delete</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#delete-cluster-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-cluster-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-cluster-group').click(function(){ $('#modal-groups').modal("hide"); deleteCluster(uuid); });
}
function deleteCluster(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/deleteCluster';

    var groupjson = {}
    groupjson["uuid"] = uuid;
    var grJSON = JSON.stringify(groupjson);
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                GetGroupsDetails();
            }
        })
        .catch(function error() {
        });
}

function selectGroupRuleset(group, ruleset, rulesetID){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/changeGroupRuleset';

    var groupjson = {}
    groupjson["uuid"] = group;
    groupjson["ruleset"] = ruleset;
    groupjson["rulesetID"] = rulesetID;
    var grJSON = JSON.stringify(groupjson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                document.getElementById('ruleset-group-'+group).innerHTML = ruleset;
                document.getElementById('ruleset-group-'+group).style.color = "black";
                document.getElementById('ruleset-group-standalone-'+group).innerHTML = ruleset;
                document.getElementById('ruleset-group-standalone-'+group).style.color = "black";
                document.getElementById('ruleset-group-expert-'+group).innerHTML = ruleset;
                document.getElementById('ruleset-group-expert-'+group).style.color = "black";
            }
        })
        .catch(function (error) {
        });
}

function modalSelectNodeGroup(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getAllNodesGroup/'+uuid;
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
                var modalWindowDelete = document.getElementById('modal-groups');
                var html = '<div class="modal-dialog">'+
                    '<div class="modal-content">'+

                        '<div class="modal-header" style="word-break: break-all;">'+
                            '<h4 class="modal-title">Add nodes to group</h4>'+
                            '<button type="button" class="close" data-dismiss="modal" id="add-node-to-group-cross">&times;</button>'+
                        '</div>'+

                        '<div class="modal-body" style="word-break: break-all;">'+
                            '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                                '<thead>'+
                                    '<tr>'+
                                        '<th>Node name</th>'+
                                        '<th>Node IP</th>'+
                                        '<th>Select</th>'+
                                    '</tr>'+
                                '</thead>'+
                                '<tbody>';
                                    for(node in response.data){
                                        html = html + '<tr>';
                                            if(response.data[node]["token"] == "wait"){
                                                html = html + '<td style="word-wrap: break-word;" style="word-wrap: break-word; color:red;">(unavailable) '+response.data[node]["name"]+'</td>';
                                            }else{
                                                html = html + '<td style="word-wrap: break-word;">'+response.data[node]["name"]+'</td>';
                                            }
                                            html = html + '<td style="word-wrap: break-word;">'+response.data[node]["ip"]+'</td>';
                                            if (response.data[node]["checked"] == "true"){
                                                html = html + '<td style="word-wrap: break-word;"><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'" checked disabled></td>';
                                            }else{
                                                html = html + '<td style="word-wrap: break-word;"><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'"></td>';
                                            }
                                        '</tr>';
                                    }
                                html = html + '</tbody>'+
                            '</table>'+
                        '</div>'+

                        '<div class="modal-footer" id="delete-ruleset-footer-btn">'+
                            '<button type="button" id="add-node-to-group-close" class="btn btn-secondary">Close</button>'+
                            '<button type="button" id="add-node-to-group-button" class="btn btn-primary">Select</button>'+
                        '</div>'+

                    '</div>'+
                '</div>';
                modalWindowDelete.innerHTML = html;
                $('#modal-groups').modal("show");
                $('#add-node-to-group-button').click(function(){ addNodesToGroup(uuid); });
                $('#add-node-to-group-cross').click(function(){ $('#modal-groups').modal("hide");});
                $('#add-node-to-group-close').click(function(){ $('#modal-groups').modal("hide");});
            }
        })
        .catch(function (error) {
        });
}

function addNodesToGroup(uuid){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/addGroupNodes';

    var nodes = [];
    $("input:checked").each(function () {
        nodes.push($(this).attr("uuid"));
    });

    var nodejson = {}
    nodejson["uuid"] = uuid;
    nodejson["nodes"] = nodes;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: nodeJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                GetGroupsDetails();
            }
        })
        .catch(function (error) {
        });
}

function deleteNodeForGroup(uuid){
    $('#modal-groups').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/deleteNodeGroup/' + uuid;
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
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
                    '<strong>Delete group error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                GetGroupsDetails();
            }
        }
    })
    .catch(function error(error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Delete group error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function modalDeleteNodeForGroup(uuid, nname){
    var modalWindowDelete = document.getElementById('modal-groups');
    modalWindowDelete.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Delete node from group list</h4>'+
                '<button type="button" class="close" id="delete-node-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;">'+
                '<p>Do you want to remove node <b>'+nname+'</b> from the list?</p>'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="delete-node-group-close">Close</button>'+
                '<button type="submit" class="btn btn-danger" id="delete-node-group">Delete</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#delete-node-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-node-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-node-group').click(function(){ deleteNodeForGroup(uuid); });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function SyncRulesetToAllGroupNodes(guuid){
    document.getElementById('progressBar-options-div').style.display="block";
    document.getElementById('progressBar-options').style.display="block";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/syncGroups';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = guuid;
    // jsonRuleUID["name"] = document.getElementById('ruleset-group-'+guuid).innerHTML;
    var dataJSON = JSON.stringify(jsonRuleUID);
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
            document.getElementById('progressBar-options-div').style.display="none";
            document.getElementById('progressBar-options').style.display="none";
        }else{
            document.getElementById('progressBar-options-div').style.display="none";
            document.getElementById('progressBar-options').style.display="none";

            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Ruleset synchronized succesfully for all group nodes.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-options-div').style.display="none";
        document.getElementById('progressBar-options').style.display="none";

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Synchronize for all group nodes: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function modalEditGroupService(uuid, type, editField){
    var modalWindowUpdate = document.getElementById('modal-groups');
    modalWindowUpdate.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Update group services</h4>'+
                '<button type="button" class="close" id="update-node-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;">'+
                '<input class="form-control" id="suricata-group-service-value" placeholder="Insert the new value for '+editField+'...">'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="update-node-group-close">Close</button>'+
                '<button type="button" class="btn btn-primary" id="update-node-group">Update</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#update-node-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#update-node-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#update-node-group').click(function(){ $('#modal-groups').modal("hide"); updateGroupService(uuid, type, document.getElementById("suricata-group-service-value").value.trim()); });
}

function updateGroupService(uuid, type, value){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/updateGroupService';

    var groupjson = {}
    groupjson["uuid"] = uuid;
    groupjson["param"] = type;
    groupjson["value"] = value;
    var grJSON = JSON.stringify(groupjson);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
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
                            '<strong>Error updateGroupService!</strong> '+response.data.error+''+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                        alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                            '<strong>Success!</strong> Group value updated successfully.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                        GetGroupsDetails();
                }
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error updating Values! </strong> '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function modalAddCluster(uuid){
    var modalWindowDelete = document.getElementById('modal-groups');
    modalWindowDelete.innerHTML =
    '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Add cluster</h4>'+
                '<button type="button" class="close" id="add-cluster-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;">'+
                '<input class="form-control" id="add-cluster-value" placeholder="Insert a cluster path...">'+
            '</div>'+

            '<div class="modal-footer">'+
                '<button type="button" class="btn btn-secondary" id="add-cluster-close">Close</button>'+
                '<button type="submit" class="btn btn-primary" id="add-cluster">Add</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#add-cluster-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#add-cluster-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#add-cluster').click(function(){ $('#modal-groups').modal("hide"); addCluster(uuid, document.getElementById('add-cluster-value').value); });
}

function addCluster(uuid, path){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/addCluster';

    var groupjson = {}
    groupjson["uuid"] = uuid;
    groupjson["path"] = path;
    var grJSON = JSON.stringify(groupjson);

    axios({
        method: 'post',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: grJSON
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
                            '<strong>Error!</strong> Add cluster: '+response.data.error+''+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                        alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                            '<strong>Success!</strong> Cluster added successfully.'+
                            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>';
                        setTimeout(function() {$(".alert").alert('close')}, 30000);
                        GetGroupsDetails();
                }
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error! </strong> Add cluster: '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function ChangeGroupConfigTable(tab){
    if (tab == "suricata-mode"){
        // $("#suricata-configure").show();
        // document.getElementById('suricata-mode').className = 'badge bg-primary align-text-bottom text-white';
        // document.getElementById('suricata-group-mode-default').className = 'badge bg-secondary align-text-bottom text-white';
        // document.getElementById('group-suricata-sync-btn').style.display = 'none';
    }else if (tab == "standalone-suricata-group-table"){
        document.getElementById('standalone-suricata-group-table').style.display = 'block';
        document.getElementById('expert-suricata-group-table').style.display = 'none';
        document.getElementById('default-suricata-group-table').style.display = 'none';
        document.getElementById('group-suricata-sync-btn').style.display = 'none';

        // document.getElementById('suricata-group-mode-standalone').className = 'badge bg-primary align-text-bottom text-white';
        document.getElementById('suricata-group-mode-default').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('suricata-group-mode-expert').className = 'badge bg-secondary align-text-bottom text-white';
    } else if (tab == "expert-suricata-group-table") {
        document.getElementById('standalone-suricata-group-table').style.display = 'none';
        document.getElementById('expert-suricata-group-table').style.display = 'block';
        document.getElementById('default-suricata-group-table').style.display = 'none';
        document.getElementById('group-suricata-sync-btn').style.display = 'block';

        document.getElementById('suricata-group-mode-default').className = 'badge bg-secondary align-text-bottom text-white';
        // document.getElementById('suricata-group-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('suricata-mode').className = 'badge bg-primary align-text-bottom text-white';
    } else if (tab == "default-suricata-group-table") {
        $("#suricata-configure").hide();
        document.getElementById('standalone-suricata-group-table').style.display = 'none';
        document.getElementById('expert-suricata-group-table').style.display = 'none';
        document.getElementById('default-suricata-group-table').style.display = 'block';
        document.getElementById('group-suricata-sync-btn').style.display = 'none';

        document.getElementById('suricata-group-mode-default').className = 'badge bg-primary align-text-bottom text-white';
        document.getElementById('suricata-mode').className = 'badge bg-secondary align-text-bottom text-white';
        // document.getElementById('suricata-group-mode-standalone').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('suricata-group-mode-expert').className = 'badge bg-secondary align-text-bottom text-white';
    }else if (tab == "expert-zeek-table") {
        $("#group-zeek-add-cluster-btn").hide();
        $("#group-zeek-cluster").hide();
        $("#group-zeek-expert").show();
        document.getElementById('group-zeek-mode-expert').className = 'badge bg-primary align-text-bottom text-white';
        document.getElementById('group-zeek-mode-cluster').className = 'badge bg-secondary align-text-bottom text-white';
    }else if (tab == "cluster-zeek-table") {
        $("#group-zeek-add-cluster-btn").show();
        $("#group-zeek-cluster").show();
        $("#group-zeek-expert").hide();
        document.getElementById('group-zeek-mode-expert').className = 'badge bg-secondary align-text-bottom text-white';
        document.getElementById('group-zeek-mode-cluster').className = 'badge bg-primary align-text-bottom text-white';
    }
}

// function InsertCluster(uuid){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/addCluster';

//     var groupjson = {}
//     groupjson["uuid"] = uuid;
//     groupjson["param"] =    ;
//     groupjson["value"] = value;
//     var grJSON = JSON.stringify(groupjson);

//     axios({
//         method: 'post',
//         url: nodeurl,
//         timeout: 30000,
            // headers:{'token': document.cookie,'user': payload.user},
//         data: grJSON
//     })
//         .then(function (response) {
                // if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
//             if(response.data.ack == "false"){
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                     alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//                         '<strong>InsertCluster Error!</strong> '+response.data.error+''+
//                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                             '<span aria-hidden="true">&times;</span>'+
//                         '</button>'+
//                     '</div>';
//                     setTimeout(function() {$(".alert").alert('close')}, 30000);
//             }else{
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                     alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
//                         '<strong>Success!</strong> Group value updated successfully.'+
//                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                             '<span aria-hidden="true">&times;</span>'+
//                         '</button>'+
//                     '</div>';
//                     setTimeout(function() {$(".alert").alert('close')}, 30000);
//                     GetGroupsDetails();
//             }
//         })
//         .catch(function error(error) {
//             $('html,body').scrollTop(0);
//             var alert = document.getElementById('floating-alert');
//                 alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
//                     '<strong>Error updating Values! </strong> '+error+''+
//                     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                         '<span aria-hidden="true">&times;</span>'+
//                     '</button>'+
//                 '</div>';
//                 setTimeout(function() {$(".alert").alert('close')}, 30000);
//         });
// }

function addRulesetsToGroup(group){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/addRulesetsToGroup';

    var rulesets = [];
    $("input:checked").each(function () {
        rulesets.push($(this).attr("uuid"));
        console.log($(this).attr("uuid"));
    });

    var nodejson = {}
    nodejson["uuid"] = group;
    nodejson["rulesets"] = rulesets.toString();
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user},
        data: nodeJSON
        })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                GetGroupsDetails();
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error adding rulesets to group:</strong> '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

//add N rulesets into suricata expert mode
function modalAddRuleset(group){
    document.getElementById('modal-groups').innerHTML = '<div class="modal-dialog modal-lg">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Add rulesets to group</h4>'+
                '<button type="button" class="close" id="add-ruleset-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;" id="add-group-ruleset-values">'+
            '</div>'+

            '<div class="modal-footer" id="add-ruleset-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="add-ruleset-group-close">Close</button>'+
                '<button type="button" class="btn btn-primary" id="add-ruleset-group-btn">Add</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#add-ruleset-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#add-ruleset-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#add-ruleset-group-btn').click(function(){ $('#modal-groups').modal("hide"); addRulesetsToGroup(group);});    

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/group/getGroupSelectedRulesets/'+group, {headers:{'token': document.cookie,'user': payload.user}})
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();
            }else{
                if (typeof response.data.error != "undefined"){
                    document.getElementById('add-group-ruleset-values').innerHTML = '<p>No rules available...</p>';
                }else{
                    var rulesetNames = [];
                    var html = '';
                    html = html + '<table class="table table-hover" style="table-layout: fixed" width="100%">'+
                        '<thead>'+
                            '<th>Ruleset</th>'+
                            '<th>Description</th>'+
                            '<th width="10%">Select</th>'+
                        '</thead>'+
                        '<tbody>';
                            for(id in response.data){
                                rulesetNames.push(response.data[id]["name"]);
                                html = html + '<tr>'+
                                    '<td style="word-wrap: break-word;">'+response.data[id]["name"]+'</td>'+
                                    '<td style="word-wrap: break-word;">'+response.data[id]["desc"]+'</td>';
                                    if(response.data[id]["checked"] == "true"){
                                        html = html + '<td style="word-wrap: break-word;"><input type="checkbox" id="checkbox-ruleset-group-'+id+'" uuid="'+id+'" value="'+response.data[id]["name"]+'" checked disabled></td>';
                                    }else{
                                        html = html + '<td style="word-wrap: break-word;"><input type="checkbox" id="checkbox-ruleset-group-'+id+'" uuid="'+id+'" value="'+response.data[id]["name"]+'"></td>';
                                    }
                                    html = html + '<tr>';
                            }
                        html = html + '</tbody>'+
                    '</table>';
                    document.getElementById('add-group-ruleset-values').innerHTML = html;

                    loadGroupRulesets(group);
                }
            }
        })
        .catch(function (error) {
            document.getElementById('add-group-ruleset-values').innerHTML = '<p>Error retrieving rules</p>';
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error retrieving group rulesets:</strong> '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
        });
}

function loadGroupRulesets(group){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/group/getGroupSelectedRulesets/'+group, {headers:{'token': document.cookie,'user': payload.user}})
    .then(function (response) {
        var rulesetNames = [];
        var html = '';
        
        for(id in response.data){
            if(response.data[id]["checked"] == "true"){
               rulesetNames.push(response.data[id]["name"]);
               html = html + '<span class="badge badge-pill bg-dark align-text-bottom text-white">'+response.data[id]["name"]+'</span> | <i class="fas fa-trash-alt" style="color:red; cursor: pointer;" onclick="modalDeleteExpertGroupRuleset(\''+response.data[id]["name"]+'\', \''+group+'\', \''+id+'\')"></i><br>';
            }
        }

        if(rulesetNames.length > 0){
            document.getElementById('ruleset-group-expert-'+group).innerHTML = html;
        }else{
            document.getElementById('ruleset-group-expert-'+group).innerHTML = "<b>There are no rulesets selected...</b>";
        }
    })
    .catch(function (error) {
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error retrieving group rulesets:</strong> '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}

function modalDeleteExpertGroupRuleset(name, group, id){
    document.getElementById('modal-groups').innerHTML = '<div class="modal-dialog">'+
        '<div class="modal-content">'+

            '<div class="modal-header" style="word-break: break-all;">'+
                '<h4 class="modal-title">Delete ruleset</h4>'+
                '<button type="button" class="close" id="delete-ruleset-group-cross">&times;</button>'+
            '</div>'+

            '<div class="modal-body" style="word-break: break-all;" id="delete-group-ruleset-values">'+
                '<p>Do you want to delete ruleset <b>'+name+'</b>?</p>'+
            '</div>'+

            '<div class="modal-footer" id="delete-ruleset-ruleset-footer-btn">'+
                '<button type="button" class="btn btn-secondary" id="delete-ruleset-group-close">Close</button>'+
                '<button type="button" class="btn btn-danger" id="delete-ruleset-group-btn">Delete</button>'+
            '</div>'+

        '</div>'+
    '</div>';
    $('#modal-groups').modal("show");
    $('#delete-ruleset-group-cross').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-ruleset-group-close').click(function(){ $('#modal-groups').modal("hide");});
    $('#delete-ruleset-group-btn').click(function(){ $('#modal-groups').modal("hide"); deleteExpertGroupRuleset(group, id);});    
}

function deleteExpertGroupRuleset(group, id){
    document.getElementById('progressBar-options-div').style.display="block";
    document.getElementById('progressBar-options').style.display="block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;

    var values = {}
    values["uuid"] = group;
    values["ruleset"] = id;
    var valuesJSON = JSON.stringify(values);

    console.log(valuesJSON)

    axios.delete('https://'+ipmaster+':'+portmaster+'/v1/group/deleteExpertGroupRuleset', {timeout: 30000, data: valuesJSON,
    headers:{'token': document.cookie,'user': payload.user}})
    .then(function (response) {
        document.getElementById('progressBar-options-div').style.display="none";
        document.getElementById('progressBar-options').style.display="none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error deleting group rulesets:</strong> '+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                loadGroupRulesets(group);
            }
        }       
    })
    .catch(function (error) {
        document.getElementById('progressBar-options-div').style.display="none";
        document.getElementById('progressBar-options').style.display="none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error deleting group rulesets:</strong> '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
    });
}