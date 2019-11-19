function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 
        GetGroupsDetails();
    });
}
loadJSONdata();

function GetGroupsDetails(){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var gname = urlWeb.searchParams.get("gname");

    document.getElementById('group-name').innerHTML = gname;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-groups');
    var groupurl = 'https://' + ipmaster + ':' + portmaster + '/v1/group/';

    axios({
        method: 'get',
        url: groupurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false") {
            result.innerHTML= '<div style="text-align:center"><h3 style="color:red;">Error retrieving group data</h3></div>';
        }else{
            var html = "";
            html = html + '<div>';
            for(x=0; x<response.data.length; x++){
                var groups = response.data[x];
                if(groups['guuid'] == uuid){
                    html = html + '<div>'+
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
                                html = html + '<tr>'+                           
                                    '<td>'+groups["Nodes"][nid]["nname"]+'</td>'+
                                    '<td>'+groups["Nodes"][nid]["nip"]+'</td>'+
                                    '<td><i class="fas fa-trash-alt" style="color: red; cursor: pointer; font-size: 20px" title="Delete node for this group" onclick="modalDeleteNodeForGroup(\''+groups["Nodes"][nid]["dbuuid"]+'\', \''+groups["Nodes"][nid]["nname"]+'\')"></i></td>'+
                                '</tr>';
                            }
                        html = html + '</table>'+
                        //suricata table
                        '<b>Suricata</b>'+
                        '<table class="table" id="suricata-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed"  width="100%">'+                                                         
                            '<tbody>'+     
                                '<tr>'+                           
                                    '<td width="25%">Ruleset &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select ruleset" onclick="modalLoadRuleset(\''+groups['guuid']+'\')"></i>&nbsp<i class="fas fa-sync-alt" title="Sync to all group nodes" style="color:Dodgerblue; cursor: pointer;" onclick="SyncRulesetToAllGroupNodes(\''+groups['guuid']+'\')"></i></td>';
                                    if(groups['gruleset']  != ""){
                                        html = html + '<td id="ruleset-group-'+groups['guuid']+'" style="color:black;" value="'+groups['gruleset']+'">'+groups['gruleset']+'</td>';                                            
                                    }else{
                                        html = html + '<td id="ruleset-group-'+groups['guuid']+'" value="" style="color:red;">No ruleset selected...</td>';                                            
                                    }
                                    html = html + '<td></td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td class="align-middle" rowspan="2">Configuration &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Suricata paths" onclick="showEditGroup(\'suricata\')"></i> <i class="fas fa-sync-alt" title="Sync files from master to node" style="color:Dodgerblue; cursor: pointer;" onclick="SyncPathGroup(\''+groups['guuid']+'\', \'suricata\')"></i></td>'+
                                    '<td>Master path:</td>';
                                    if(groups["mastersuricata"] == ""){
                                        html = html + '<td style="color: red;" id="group-suricata-master-path" value="">No Suricata master path...</td>';
                                    }else{
                                        html = html + '<td id="group-suricata-master-path" value="'+groups["mastersuricata"]+'">'+groups["mastersuricata"]+'</td>';
                                    }
                                html = html + '</tr>'+
                                '<tr>'+                           
                                    '<td>Node path:</td>';
                                    if(groups["nodesuricata"] == ""){
                                        html = html + '<td style="color: red;" id="group-suricata-node-path" value="">No Suricata node path...</td>';
                                    }else{
                                        html = html + '<td id="group-suricata-node-path" value="'+groups["nodesuricata"]+'">'+groups["nodesuricata"]+'</td>';
                                    }
                                html = html + '</tr>'+
                                '<tr id="suricata-edit-row" style="display:none;">'+
                                    '<td>Master path: <input class="form-control" id="suricata-group-master-'+groups['guuid']+'" value="'+groups["mastersuricata"]+'"></td>'+
                                    '<td>Node path: <input class="form-control" id="suricata-group-node-'+groups['guuid']+'" value="'+groups["nodesuricata"]+'"></td>'+
                                    '<td width="10%">'+
                                        '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="changePaths(\''+groups['guuid']+'\', \'suricata\')">Save</button>'+
                                        '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditGroup(\'suricata\')">Cancel</button> &nbsp '+
                                    '</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td class="align-middle" rowspan="5">Services &nbsp <i class="fas fa-sync-alt" title="Sync files from master to node" style="color:Dodgerblue; cursor: pointer;" onclick=""></i></td>'+
                                    '<td>Interface &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Select an interface" onclick="modalEditGroupService(\''+uuid+'\', \'interface\', \'interface\')"></i></td>';
                                    if(groups["interface"] == ""){html = html + '<td id="service-interface" value="" style="color: red;">No interface selected...</td>';}else{html = html + '<td id="service-interface" value="'+groups["interface"]+'">'+groups["interface"]+'</td>';}
                                html = html + '</tr>'+
                                '<tr>'+
                                    '<td>BPF file &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a BPF file path" onclick="modalEditGroupService(\''+uuid+'\', \'BPFfile\', \'BPF file\')"></i></td>';
                                    if(groups["BPFfile"] == ""){html = html + '<td id="service-bpffile" value="" style="color: red;">No BPF file selected...</td>';}else{html = html + '<td id="service-bpffile" value="'+groups["BPFfile"]+'">'+groups["BPFfile"]+'</td>';}
                                html = html + '</tr>'+
                                '<tr>'+
                                    '<td>BPF rule &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a BPF rule" onclick="modalEditGroupService(\''+uuid+'\', \'BPFrule\', \'BPF rule\')"></i></td>';
                                    if(groups["BPFrule"] == ""){html = html + '<td id="service-bpfrule" value="" style="color: red;">No BPF rule selected...</td>';}else{html = html + '<td id="service-bpfrule" value="'+groups["BPFrule"]+'">'+groups["BPFrule"]+'</td>';}
                                html = html + '</tr>'+
                                '<tr>'+
                                    '<td>Config file &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Insert a config file path" onclick="modalEditGroupService(\''+uuid+'\', \'configFile\', \'config file\')"></i></td>';
                                    if(groups["configFile"] == ""){html = html + '<td id="service-configfile" value="" style="color: red;">No config file selected...</td>';}else{html = html + '<td id="service-configfile" value="'+groups["configFile"]+'">'+groups["configFile"]+'</td>';}
                                html = html + '</tr>'+
                                '<tr>'+
                                    '<td>Command line &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Command line" onclick="modalEditGroupService(\''+uuid+'\', \'commandLine\', \'command line\')"></i></td>';
                                    if(groups["commandLine"] == ""){html = html + '<td id="service-commandline" value="" style="color: red;">No command line selected...</td>';}else{html = html + '<td id="service-commandline" value="'+groups["commandLine"]+'">'+groups["commandLine"]+'</td>';}
                                html = html + '</tr>'+
                            '</tbody>'+                           
                        '</table>'+
                        //zeek table
                        '<b>Zeek</b> <button class="btn btn-primary float-right text-decoration-none text-white" onclick="modalAddCluster(\''+uuid+'\')">Add Cluster</button>'+
                        '<table class="table" id="zeek-nodes-for-group-'+groups['guuid']+'" style="table-layout: fixed"  width="100%">'+                         
                            '<tbody>';      
                                html = html + '<tr>'+                           
                                    '<td width="20%" class="align-middle" rowspan="2">Policies &nbsp <i class="fas fa-edit" style="color:Dodgerblue; cursor: pointer;" title="Change Zeek paths" onclick="showEditGroup(\'zeek\')"></i> <i class="fas fa-sync-alt" title="Sync files from master to node" style="color:Dodgerblue; cursor: pointer;" onclick="SyncPathGroup(\''+groups['guuid']+'\', \'zeek\')"></i></td>'+
                                    '<td>Master path</td>';
                                    if(groups["masterzeek"] == ""){
                                        html = html + '<td id="group-zeek-master-path" value="" style="color: red;">No Zeek master path...</td>';
                                    }else{
                                        html = html + '<td id="group-zeek-master-path" value="'+groups["masterzeek"]+'">'+groups["masterzeek"]+'</td>';
                                    }
                                html = html + '</tr>'+
                                '<tr>'+                           
                                    '<td>Node path</td>';
                                    if(groups["nodezeek"] == ""){
                                        html = html + '<td id="group-zeek-node-path" value="" style="color: red;">No Zeek node path...</td>';
                                    }else{
                                        html = html + '<td id="group-zeek-node-path" value="'+groups["nodezeek"]+'">'+groups["nodezeek"]+'</td>';
                                    }                                            
                                    html = html + '</tr>'+
                                '<tr id="zeek-edit-row" style="display:none;">'+
                                    '<td>Master: <input class="form-control" id="zeek-group-master-'+groups['guuid']+'" value="'+groups["masterzeek"]+'"></td>'+
                                    '<td>Node: <input class="form-control" id="zeek-group-node-'+groups['guuid']+'" value="'+groups["nodezeek"]+'"></td>'+
                                    '<td width="10%">'+
                                        '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" onclick="changePaths(\''+groups['guuid']+'\', \'zeek\')">Save</button>'+
                                        '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" onclick="hideEditGroup(\'zeek\')">Cancel</button> &nbsp '+
                                    '</td>'+
                                '</tr>'+                                
                            '</tbody>'+    
                        '</table>'+
                        //Zeek cluster
                        '<table id="cluster-elements" class="table" style="table-layout: fixed" width="100%">'+
                        '</table>'+

                        //analyzer table
                        '<b>Analyzer</b>'+
                        '<table class="table" id="cluster-for-group-'+groups['guuid']+'" style="table-layout: fixed" width="100%">'+                          
                            '<tbody>'+
                                '<tr>'+
                                    '<td>'+
                                        '<span style="cursor: pointer;" id="group-enable-all-analyzer" class="badge bg-primary align-text-bottom text-white float-left mr-2" >Enable all</span>'+
                                        '<span style="cursor: pointer;" id="group-disable-all-analyzer" class="badge bg-secondary align-text-bottom text-white float-left mr-2" >Disable all</span>'+
                                    '</td>'+                                                            
                                    '<td>Edit analyzer &nbsp <i class="fas fa-edit" style="color: dodgerblue; cursor: pointer;" onclick="editAnalyzer(\'local\', \'group-analyzer\', \''+gname+'\')"></i></td>'+                                       
                                    '<td>Synchronize analyzer &nbsp <i class="fas fa-sync" id="group-sync-analyzer" style="color: dodgerblue; cursor: pointer;"></i></td>'+                                       
                                '</tr>'+
                            '</tbody>'+    
                        '</table>'+
                        '<table class="table" id="analyzer-nodes-status" style="table-layout: fixed" width="100%">'+
                        '</table>'+
                    '</tr>';
                }

            }
            html = html + '</div>';
            result.innerHTML = html;
        }

        $('#group-sync-analyzer').click(function(){ syncAnalyzer(allNodes); });
        $('#group-enable-all-analyzer').click(function(){ ChangeAnalyzerStatus(allNodes, "Enabled"); });
        $('#group-disable-all-analyzer').click(function(){ ChangeAnalyzerStatus(allNodes, "Disabled"); });
        LoadAnalyzerNodeStatus(allNodes);
        GetAllClusterFiles(uuid);
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
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
            '<td>'+allNodes[x]["nname"]+'</td>'+        
            '<td>'+allNodes[x]["nip"]+'</td>';
            if(allNodes[x]["nstatus"] == "Enabled"){
                html = html + '<td> <span class="badge bg-success align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">Enabled</span> </td>';
            }else if(allNodes[x]["nstatus"] == "Disabled"){
                html = html + '<td> <span class="badge bg-danger align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">Disabled</span> </td>';
            }else{
                html = html + '<td> <span class="badge bg-dark align-text-bottom text-white" id="analyzer-status-'+allNodes[x]["nuuid"]+'">N/A</span> </td>';
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
    
        // let response = await axios.put('https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer',{timeout: 30000, data: dataJSON});
        await axios({
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
            }

        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong>  Change analyzer status: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
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
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    }else{
        var ipmaster = document.getElementById('ip-master').value;
        document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+node+'&file='+type+'&node='+name;
    }
}

async function syncAnalyzer(nodes){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/analyzer/sync';

    var errorNodes = "";

    var dataJSON = JSON.stringify(nodes);

    await axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
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
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else if (response.data.ack == "false") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Sync analyzer: '+response.data.error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Error!</strong> All analyzers synchronized successfully.'+
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
            '<strong>Error!</strong> Sync analyzer status: '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
    // }
    GetGroupsDetails();
}

function syncAllGroupElements(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/group/syncAll/'+uuid;
    var newSyn = new Map();

    //sync suricata ruleset
    newSyn["suricata-rulesets"] = new Map();
    newSyn["suricata-rulesets"]["ruleset-group"] = document.getElementById('ruleset-group-'+uuid).getAttribute("value");

    //sync suricata config
    newSyn["suricata-config"] = new Map();
    newSyn["suricata-config"]["mastersuricata"] = document.getElementById('group-suricata-master-path').getAttribute("value");
    newSyn["suricata-config"]["nodesuricata"] = document.getElementById('group-suricata-node-path').getAttribute("value");

    //sync suricata services  
    newSyn["suricata-services"] = new Map();
    newSyn["suricata-services"]["interface"] = document.getElementById('service-interface').getAttribute("value");
    newSyn["suricata-services"]["BPFfile"] =   document.getElementById('service-bpffile').getAttribute("value");
    newSyn["suricata-services"]["BPFrule"] =   document.getElementById('service-bpfrule').getAttribute("value");
    newSyn["suricata-services"]["configFile"] =document.getElementById('service-configfile').getAttribute("value");
    newSyn["suricata-services"]["commandLine"]=document.getElementById('service-commandline').getAttribute("value");

    //sync zeek policies  
    newSyn["zeek-policies"] = new Map();
    newSyn["zeek-policies"]["masterzeek"] = document.getElementById('group-zeek-master-path').getAttribute("value");
    newSyn["zeek-policies"]["nodezeek"] = document.getElementById('group-zeek-node-path').getAttribute("value");

    var dataJSON = JSON.stringify(newSyn);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 300000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Group synchronization complete.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
            GetGroupsDetails();
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Sync all: '+response.data.error+''+
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
            '<strong>Error!</strong>  Sync all: '+error+''+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function changePaths(guuid, type){
    hideEditGroup(type);
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/changePaths';

    var groupjson = {}
    groupjson["uuid"] = guuid;
    groupjson["type"] = type;
    if(type == "suricata"){
        groupjson["mastersuricata"] = document.getElementById('suricata-group-master-'+guuid).value;
        groupjson["nodesuricata"] = document.getElementById('suricata-group-node-'+guuid).value;
    }else{
        groupjson["masterzeek"] = document.getElementById('zeek-group-master-'+guuid).value;
        groupjson["nodezeek"] = document.getElementById('zeek-group-node-'+guuid).value;
    }
    var grJSON = JSON.stringify(groupjson);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: grJSON
        })
        .then(function (response) {           
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Paths updated successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
                GetGroupsDetails();
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Change paths: '+response.data.error+''+
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
                '<strong>Error!</strong> Change paths: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }); 
}

function SyncPathGroup(guuid, type){

    if(type == "suricata" && document.getElementById('group-suricata-master-path').getAttribute("value") == ""
        || type == "suricata" && document.getElementById('group-suricata-node-path').getAttribute("value") == ""
        || type == "suricata" && document.getElementById('group-suricata-node-path').getAttribute("value") == ""
        || type == "suricata" && document.getElementById('group-suricata-node-path').getAttribute("value") == ""){
            
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Paths are void. Please, insert a valid path.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);

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
            data: grJSON
        })
        .then(function (response) {      
            if (response.data.ack == "true") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Paths synchronized successfully.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
                GetGroupsDetails();
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Sync path: '+response.data.error+''+
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
                '<strong>Error!</strong> Sync path: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }); 
    }
}

function showEditGroup(type){
    $('#'+type+'-edit-row').show();
}

function hideEditGroup(type){
    $('#'+type+'-edit-row').hide();
}

function backButton(){
    window.history.back();
}

function loadClusterFile(uuid, path, type){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/show-file-content.html?type='+type+'&uuid='+uuid+'&path='+path;
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
    axios.get('https://'+ipmaster+':'+portmaster+'/v1/ruleset')
        .then(function (response) {
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
                                '<td>'+response.data[id]["name"]+'</td>'+
                                '<td><button type="submit" class="btn btn-primary" onclick="selectGroupRuleset(\''+group+'\', \''+response.data[id]["name"]+'\', \''+id+'\')">Select</button></td>'+
                            '<tr>';
                        }
                    html = html + '</tbody>'+
                '</table>';
                document.getElementById('group-ruleset-values').innerHTML = html;
            }
        })
        .catch(function (error) {
            document.getElementById('group-ruleset-values').innerHTML = '<p>Error retrieving rules</p>';
        }); 
}

function GetAllClusterFiles(guuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/getClusterFiles/'+guuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
        })
        .then(function (response) {
            var html = '<tr>'+
                    '<td id="cluster-row-span" rowspan="2" class="align-middle" width="20%">Cluster <i class="fas fa-sync" style="color:dodgerblue; cursor:pointer" onclick="SyncClusterFile(\''+guuid+'\', \'all\')"></i> </td>'+
                    '<th>Cluster path</td>'+
                    '<th width="20%">Actions</td>'+
                '</tr>';
            var count = 1;
            for(uuid in response.data){
                count = count+2;
                html = html +'<tr>'+
                    '<td>'+response.data[uuid]["path"]+'</td>'+
                    '<td>'+
                        '<i id="edit-cluster-data-'+uuid+'" class="fas fa-edit" style="color:dodgerblue; cursor:pointer" onclick="showEditGroup(\''+uuid+'\')"></i> &nbsp'+
                        '<i class="fas fa-eye" style="color:dodgerblue; cursor:pointer" onclick="loadClusterFile(\''+uuid+'\', \''+response.data[uuid]["path"]+'\', \'Cluster group\')"></i> &nbsp'+
                        '<i class="fas fa-sync" style="color:dodgerblue; cursor:pointer" onclick="SyncClusterFile(\''+uuid+'\', \'one\')"></i> &nbsp'+
                        '<i class="fas fa-trash-alt" style="color:red; cursor:pointer" onclick="modalDeleteCluster(\''+uuid+'\', \''+response.data[uuid]["path"]+'\')"></i> &nbsp'+
                    '</td>'+
                '</tr>'+
                '<tr id="'+uuid+'-edit-row" style="display:none;" bgcolor="AntiqueWhite">'+
                    '<td>'+
                        '<div class="input-group">Path: &nbsp <input class="form-control" id="new-cluster-value-'+uuid+'" value="'+response.data[uuid]["path"]+'"></input></div>'+
                    '</td>'+
                    '<td class="align-middle">'+
                        '<button class="btn btn-primary float-right text-decoration-none text-white mr-2" id="edit-cluster-data-save-'+uuid+'" onclick="changeClusterValue(\''+guuid+'\', \''+uuid+'\')">Save</button>'+
                        '<button class="btn btn-secondary float-right text-decoration-none text-white mr-2" id="edit-cluster-data-close-'+uuid+'" onclick="hideEditGroup(\''+uuid+'\')">Cancel</button>'+
                    '</td>'+
                '</tr>';
            }
            document.getElementById('cluster-elements').innerHTML = html;
            document.getElementById('cluster-row-span').rowSpan = count;
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
        data: grJSON
    })
        .then(function (response) {
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Sync cluster file: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                    '<strong>Success!</strong> Cluster file synchronized correctly.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }
            GetGroupsDetails();
        })
        .catch(function error() {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Sync cluster file: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
}

function changeClusterValue(guuid, uuid){    
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
        data: grJSON
    })
        .then(function (response) {
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
            }
            GetGroupsDetails();
        })
        .catch(function error() {
        });
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
        data: grJSON
    })
        .then(function (response) {
            GetGroupsDetails();
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
        data: grJSON
        })
        .then(function (response) {
            document.getElementById('ruleset-group-'+group).innerHTML = ruleset;
            // GetGroupsDetails();
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
        timeout: 30000
    })
        .then(function (response) {
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
                                    html = html + '<tr>'+
                                        '<td style="word-wrap: break-word;">'+response.data[node]["name"]+'</td>'+
                                        '<td style="word-wrap: break-word;">'+response.data[node]["ip"]+'</td>';
                                        if (response.data[node]["checked"] == "true"){
                                            html = html + '<td><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'" checked disabled></td>';
                                        }else{
                                            html = html + '<td><input type="checkbox" id="checkbox-nodes-'+node+'" uuid="'+node+'" value="'+response.data[node]["name"]+'"></td>';
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
        data: nodeJSON
        })
        .then(function (response) {
            GetGroupsDetails();
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
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
            GetGroupsDetails();
        })
        .catch(function error() {
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

function SyncRulesetToAllGroupNodes(groupID){
    document.getElementById('progressBar-create-div').style.display="block";
    document.getElementById('progressBar-create').style.display="block"; 

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/syncGroups';

    var jsonRuleUID = {}
    jsonRuleUID["uuid"] = groupID;
    var dataJSON = JSON.stringify(jsonRuleUID);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 300000,
        data: dataJSON
    })
    .then(function (response) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 

        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Ruleset synchronized succesfully for all group nodes.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-create-div').style.display="none";
        document.getElementById('progressBar-create').style.display="none"; 

        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Synchronize for all group nodes: '+error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
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
    $('#update-node-group').click(function(){ $('#modal-groups').modal("hide"); updateGroupService(uuid, type, document.getElementById("suricata-group-service-value").value); });
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
        data: grJSON
    })
        .then(function (response) {
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Group value updated successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                    GetGroupsDetails();
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error updating Values! </strong> '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
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
        data: grJSON
    })
        .then(function (response) {
            if(response.data.ack == "false"){
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error!</strong> Add cluster: '+response.data.error+''+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Cluster added successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 5000);
                    GetGroupsDetails();
            }
        })
        .catch(function error(error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error! </strong> Add cluster: '+error+''+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
        });
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
//         data: grJSON
//     })
//         .then(function (response) {
//             if(response.data.ack == "false"){
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                     alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
//                         '<strong>Error!</strong> Synchronize for all group nodes: '+response.data.error+''+
//                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                             '<span aria-hidden="true">&times;</span>'+
//                         '</button>'+
//                     '</div>';
//                     setTimeout(function() {$(".alert").alert('close')}, 5000);
//             }else{
//                 $('html,body').scrollTop(0);
//                 var alert = document.getElementById('floating-alert');
//                     alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
//                         '<strong>Success!</strong> Group value updated successfully.'+
//                         '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                             '<span aria-hidden="true">&times;</span>'+
//                         '</button>'+
//                     '</div>';
//                     setTimeout(function() {$(".alert").alert('close')}, 5000);
//                     GetGroupsDetails();
//             }
//         })
//         .catch(function error(error) {
//             $('html,body').scrollTop(0);
//             var alert = document.getElementById('floating-alert');
//                 alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
//                     '<strong>Error updating Values! </strong> '+error+''+
//                     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                         '<span aria-hidden="true">&times;</span>'+
//                     '</button>'+
//                 '</div>';
//                 setTimeout(function() {$(".alert").alert('close')}, 5000);
//         });
// }
