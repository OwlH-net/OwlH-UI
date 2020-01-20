
var payload = "";
loadJSONdata();

//load json data from local file
function loadJSONdata() {
    //get ui.conf file content
    $.getJSON('../conf/ui.conf', function (data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+data.master.ip+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+data.master.ip+'/login.html';}
         

        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;

        //load title and nodes
        loadTitleJSONdata();
        GetAllNodes();
    });

}

function showConfig(oip, oname, oport, ouuid){
    document.getElementById('divconfigform').style.display = "block";
    document.getElementById('divconfigform').scrollIntoView();

    var name = document.getElementById('cfgnodename');
    var ip = document.getElementById('cfgnodeip');
    var port = document.getElementById('cfgnodeport');
    var uuid = document.getElementById('cfgnodeid');
    port.value = oport.trim();
    name.value = oname.trim();
    ip.value = oip.trim();
    uuid.value = ouuid.trim();
}

// function DisableOfflineNodes() {
//     $('#node-table-tbody tr').each(function(){
//         console.log($(this));
//         console.log($(this).attr('status'));
//         // if ($(this).attr('status') == "online"){
//         //     console.log("online");
//         // }else if ($(this).attr('status') == "offline"){
//         //     console.log("not...");
//         // }
//     });
// }

async function PingNode(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ping/' + uuid;
    
    await axios({
            method: 'get',
            url: nodeurl,
            timeout: 3000,
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            }
    })
        .then(function (response) {            
            if (response.data.ping=='pong') {
                document.getElementById('node-actions-'+uuid).style.color = "Dodgerblue";
                document.getElementById(uuid+'-online').className = "badge bg-success align-text-bottom text-white";
                document.getElementById(uuid+'-online').innerHTML = "ON LINE";
                document.getElementById('node-row-'+uuid).setAttribute("status", "online");

                PingMonitor(uuid);
                var myVar = setInterval(function(){PingMonitor(uuid)}, 5000);
                // sortTableName();
            } else {
                document.getElementById('node-monitor-'+uuid).onclick = "";
                document.getElementById('node-services-'+uuid).onclick = "";
                document.getElementById('node-modify-'+uuid).onclick = "";
                document.getElementById('node-config-'+uuid).onclick = "";
                document.getElementById('node-files-'+uuid).onclick = "";
                document.getElementById('node-change-'+uuid).onclick = "";
                document.getElementById('node-incident-'+uuid).onclick = "";
                document.getElementById('node-actions-'+uuid).onclick = "";

                document.getElementById('node-monitor-'+uuid).style.cursor = " default";
                document.getElementById('node-services-'+uuid).style.cursor = "default";
                document.getElementById('node-modify-'+uuid).style.cursor = "default";
                document.getElementById('node-config-'+uuid).style.cursor = "default";
                document.getElementById('node-files-'+uuid).style.cursor = "default";
                document.getElementById('node-change-'+uuid).style.cursor = "default";
                document.getElementById('node-incident-'+uuid).style.cursor = "default";
                document.getElementById('node-actions-'+uuid).style.cursor = "default";

                document.getElementById(uuid+'-online').className = "badge bg-danger align-text-bottom text-white";
                document.getElementById(uuid+'-online').innerHTML = "OFF LINE";
                document.getElementById('node-row-'+uuid).setAttribute("status", "offline");
            }  
            if(document.getElementById('node-row-'+uuid).getAttribute == "offline"){
                // console.log("not a number");
            }    
        })
        .catch(function (error) {
            document.getElementById('node-monitor-'+uuid).onclick = "";
            document.getElementById('node-services-'+uuid).onclick = "";
            document.getElementById('node-modify-'+uuid).onclick = "";
            document.getElementById('node-config-'+uuid).onclick = "";
            document.getElementById('node-files-'+uuid).onclick = "";
            document.getElementById('node-change-'+uuid).onclick = "";
            document.getElementById('node-incident-'+uuid).onclick = "";
            document.getElementById('node-actions-'+uuid).onclick = "";

            document.getElementById('node-monitor-'+uuid).style.cursor = " default";
            document.getElementById('node-services-'+uuid).style.cursor = "default";
            document.getElementById('node-modify-'+uuid).style.cursor = "default";
            document.getElementById('node-config-'+uuid).style.cursor = "default";
            document.getElementById('node-files-'+uuid).style.cursor = "default";
            document.getElementById('node-change-'+uuid).style.cursor = "default";
            document.getElementById('node-incident-'+uuid).style.cursor = "default";
            document.getElementById('node-actions-'+uuid).style.cursor = "default";
        });   
}

function PingService(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingservice/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        }
    })
        .then(function (response) {
            if (response.data.ack == "true"){
                document.getElementById(uuid+'-owlhservice').style.display = "none";
            }else {
                document.getElementById(uuid+'-owlhservice').style.display = "block";
            }
            return true;
        })
        .catch(function (error) {
            return false;
        }); 
}

function PingMonitor(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingmonitor/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000
    })
        .then(function (response) {
            var cpuData = "";
            for(x in response.data.cpus){
                cpuData = cpuData + '<div id="cpu-core-'+x+'"><b>CPU '+x+':</b> '+ parseFloat(response.data.cpus[x].percentage).toFixed(2)+' % </div>';
            }
            document.getElementById('mem-'+uuid).innerHTML = "<b>MEM: </b>" + parseFloat(response.data.mem.percentage).toFixed(2)+" %";
            document.getElementById('sto-'+uuid).innerHTML = "<b>STO: </b>" + parseFloat(response.data.disk.percentage).toFixed(2)+" %";
            document.getElementById('cpu-'+uuid).innerHTML = cpuData;
        })
        .catch(function (error) {
        }); 
}

function DeployService(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/deployservice/'+uuid;
    axios({
        method: 'put',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000
    })
        .then(function (response) {
            GetAllNodes();
            return true;
        })
        .catch(function (error) {
            return false;
        });   
}

function GetAllNodes() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var resultElement = document.getElementById('nodes-table');
    document.getElementById('add-nid-bottom').style.display = "none";
    document.getElementById('add-nid-top').style.display = "none";

    //    var instance = axios.create({
    //     baseURL: 'https://' + ipmaster + ':' + portmaster + '/v1/node',
    //     httpsAgent: new https.Agent({
    //         rejectUnauthorized: false   
    //     })
    // });
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/node', {
            headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            }//Authorization
            // params: { token: document.cookie}// rejectUnauthorized: false }
        })
        .then(function (response) {
            var nodes = response.data;
            document.getElementById('add-nid-bottom').style.display = "block";
            document.getElementById('add-nid-top').style.display = "block";

            if (response.data.ack == "false") {
                document.getElementById('add-nid-bottom').style.display = "none";
                document.getElementById('add-nid-top').style.display = "none";
                document.getElementById('search-node-details').style.display = "none";
                document.getElementById('node-search-value').style.display = "none";
                resultElement.innerHTML =  '<div style="text-align:center"><h3 style="color:red;">Error retrieving nodes</h3></div>';
            }else{
                var isEmpty = true;
                
                var html =  
                '<div>'+
                    '<span id="show-nodes-online" onclick="showNodes(\'online\')" class="badge bg-success align-text-bottom text-white float-right" style="cursor:pointer;" title="Show only online nodes">ON LINE</span>'+
                    '<span id="show-nodes-offline" onclick="showNodes(\'offline\')" class="badge bg-danger align-text-bottom text-white float-right mr-1" style="cursor:pointer;" title="Show only offline nodes">OFF LINE</span>'+
                    '<span id="show-nodes-all" onclick="showNodes(\'all\')" class="badge bg-primary align-text-bottom text-white float-right mr-1" style="cursor:pointer;" title="Show all nodes">ALL NODES</span>'+
                    '<span id="sort-nodes-ip" onclick="sortTableIP()" sort="asc" class="sort-table asc badge bg-secondary align-text-bottom text-white float-left mr-1" style="cursor:pointer;"   title="Sort table by IP">Sort by IP</span>'+
                    '<span id="sort-nodes-name" onclick="sortTableName()" sort="asc" class="sort-table badge bg-secondary align-text-bottom text-white float-left mr-1" style="cursor:pointer;" title="Sort table by Name">Sort by Name</span>'+
                '</div>'+
                '<br>'+
                '<table class="table table-hover" style="table-layout: fixed" id="node-table"> ' +
                    '<thead> ' +
                        '<tr>  ' +
                            '<th scope="col" width="5%"></th> ' +
                            '<th id="node-table-name-column" scope="col" width="30%" align="left">Name</th> ' +
                            '<th scope="col" width="25%" align="right">Status</th> ' +
                            '<th scope="col" width="10%"></th>' +
                            '<th scope="col" width="25%">Actions</th>  ' +
                        '</tr> ' +
                    '</thead> ' +
                    '<tbody id="node-table-tbody">';
                        for (node in nodes) {
                            isEmpty = false;
                            if (nodes[node]['port'] != undefined) {
                                port = nodes[node]['port'];
                            } else {
                                port = "10443";
                            }
                            var uuid = node;
                            PingNode(uuid);
                            getRulesetUID(uuid);
                    
                    
                            html = html + '<tr class="node-search" id="node-row-'+node+'" name="'+nodes[node]['name']+'" ip="'+nodes[node]['ip']+'" status="offline">'+
                                '<td></td>'+
                                '<td width="33%" style="word-wrap: break-word;" class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'           +
                                    '<p class="text-muted">' + nodes[node]['ip'] + '</p>'                        +
                                    '<i class="fas fa-code" title="Ruleset Management"></i> <span id="'+uuid+'-ruleset" class="text-muted small"></span>'+
                                    '<br><br>'+
                                    '<span id="'+uuid+'-owlhservice" style="display:none; font-size: 15px; cursor: default;" class="col-md-4 badge bg-warning align-text-bottom text-white" onclick="DeployService(\''+uuid+'\')">Install service</span>'+
                                '</td>' +
                                '<td width="33%" style="word-wrap: break-word;" class="align-middle">'+
                                    '<span id="'+uuid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span> <br>'+
                                    '<span>'+
                                        '<div><p></p></div>'+
                                        '<div id="node-values-'+uuid+'">'+
                                            '<div id="mem-'+uuid+'"><b>MEM:</b> </div>'+
                                            '<div id="sto-'+uuid+'"><b>STO:</b> </div>'+                        
                                            '<div id="cpu-'+uuid+'"></div>'+                        
                                        '</div>'+
                                    '</span>'+
                                '</td>'+    
                                '<td></td>'+        
                                '<td width="33%" style="word-wrap: break-word;" class="align-middle"> '+                                   
                                    '<span style="font-size: 15px; color: Grey;" id="node-actions-'+uuid+'">'+                                                                          
                                        '<i id="node-monitor-'+uuid+'" class="fas fa-desktop" style="cursor: pointer;" id="details-'+uuid+'" title="Node monitoring" onclick="ShowMonitoring(\''+uuid+'\', \''+nodes[node]['name']+'\');"></i> | Node monitoring' +
                                        '<br><i id="node-services-'+uuid+'" class="fas fa-box-open" style="cursor: pointer;" title="node services configuration" onclick="showServicesConfig(\''+uuid+'\', \''+nodes[node]['name']+'\');"></i> | Node services configuration' +
                                        '<br><i id="node-modify-'+uuid+'" class="fas fa-cogs" style="cursor: pointer;" title="Modify node details" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+uuid+"'"+');"></i> | Modify node' +
                                        '<br><i id="node-config-'+uuid+'" class="fas fa-cog" style="cursor: pointer;" title="Edit node configuration" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')"></i> | Edit node configuration' +
                                        '<br><i id="node-files-'+uuid+'" class="fas fa-arrow-alt-circle-down" style="cursor: pointer;" title="See node files" onclick="loadFilesURL(\''+uuid+'\', \''+nodes[node]['name']+'\')"></i> | See node files' +
                                        '<br><i id="node-change-'+uuid+'" class="fas fa-clipboard-list" style="cursor: pointer;" title="Change control data" onclick="loadChangeControl(\''+uuid+'\', \'node\')"></i> | Change control' +
                                        '<br><i id="node-incident-'+uuid+'" class="fas fa-archive" style="cursor: pointer;" title="Incident data" onclick="loadIncidentMaster(\''+uuid+'\', \'node\')"></i> | Incident data' +
                                        '<br><i class="fas fa-trash-alt" style="color: red; cursor: pointer;" title="Delete Node" data-toggle="modal" data-target="#modal-window" onclick="deleteNodeModal('+"'"+node+"'"+', '+"'"+nodes[node]['name']+"'"+');"></i> | Delete node';
                                    '</span>'+
                                '</td> ' +
                            '</tr>';                             
                        }
                html = html + '</tbody></table>';
            
                if (isEmpty){
                    resultElement.innerHTML = '<div style="text-align:center"><h3>No nodes created.</h3></div>';
                }else{
                    resultElement.innerHTML = html;
                    
                    //search bar
                    $('#node-search-value').click(function(){ loadNodeBySearch(document.getElementById('search-node-details').value)});
                
                    //listener for seach bar
                    document.getElementById('search-node-details').addEventListener('input', evt => {
                        if (document.getElementById('search-node-details').value.trim() == ""){ showAllHiddenNodes();} 
                    });
                }                    
            }            
            // $('#node-table').click(function(){sortTable(); });
            // DisableOfflineNodes();
        })
        .catch(function (error) {
            resultElement.innerHTML = '<h3 align="center">No connection</h3>'+
                '<a id="check-status-config" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
                checkStatus();
        });
}



// function sortTable() {
    // var $table = $('node-table');
    // var $tableBody = $table.find('tbody');
    // var rows, sortedRows;

    // function sortRows(a, b){
    //     if ( $(a).find('tr:first-Child').text() > $(b).find('td:first-Child').text() ) {
    //         return 1;
    //     }

    //     if ( $(a).find('td:first-Child').text() < $(b).find('td:first-Child').text() ) {
    //         return -1;
    //     }

    //     return 0;
    // }


    // $($('#node-table > tbody  > tr')).val('');
    // // $('#node-table > tbody  > tr').each(function() {
    // // });
// }

function showNodes(status){
    if (status == "all"){
        showAllHiddenNodes();
    }else{
        showAllHiddenNodes();
        $('#node-table tbody').each(function(){
            $(this).find('tr').each(function(){
                if ($(this).attr('status') == status){
                }else{
                    $(this).hide();
                }
            });
        });
    }
}

function showAllHiddenNodes(){
    $('#node-table tbody').each(function(){
        $(this).find('tr').each(function(){
            $(this).show();
        })
    })
}

function loadNodeBySearch(search){
    showAllHiddenNodes();
    if (search.length == 0){
        $('#search-node-details').css('border', '2px solid red');
        $('#search-node-details').attr("placeholder", "Insert a valid name for search...");
    }else{
        $('#search-node-details').css('border', '2px solid #ced4da');
        $('#search-node-details').attr("placeholder", "");
        $('#node-table tbody').each(function(){
            $(this).find('tr').each(function(){
                if ($(this).attr("name").toLowerCase().includes(search.toLowerCase()) || $(this).attr("ip").toLowerCase().includes(search.toLowerCase())){
                }else {
                    $(this).hide();
                }
            })
        })
    }
}

function deleteNode(node) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/'+node;
    axios({
        method: 'delete',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000
    })
        .then(function (response) {
            GetAllNodes();
            return true;
        })
        .catch(function (error) {
            return false;
        });   
}

function formAddNids(){
    var addnidsbot = document.getElementById('add-nid-bottom');
    var addnidstop = document.getElementById('add-nid-top');
    var nform = document.getElementById('nidsform');

    if (nform.style.display == "none") {
        nform.style.display = "block";
        addnidsbot.innerHTML = "Close Add NID";
        addnidstop.innerHTML = "Close Add NID";
        nform.scrollIntoView();
    } else {
        nform.style.display = "none";
        addnidsbot.innerHTML = "Add NID";
        addnidstop.innerHTML = "Add NID";
    }
}
    
function PingDataflow(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
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
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if (response.data.ack == "true") {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> '+value+' deployed successfully for node '+nodeName+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
        }else{
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+value+' has not been deployed for node '+nodeName+'.'+
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

function loadIncidentMaster(uuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/incident-data.html?type='+type+'&uuid='+uuid;
}

function ShowMonitoring(uuid, name){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/node-monitor.html?uuid='+uuid+'&node='+name;
}

function showServicesConfig(uuid, name){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/node-options.html?uuid='+uuid+'&node='+name;
}

// function showMasterFile(file){
//     var ipmaster = document.getElementById('ip-master').value;
//     document.location.href = 'https://' + ipmaster + '/edit-master.html?file='+file;
// }

function editAnalyzer(uuid, file, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
}

function loadChangeControl(uuid, type){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/control-data.html?type='+type+'&uuid='+uuid;
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

function loadStapURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/stap.html?uuid='+uuid+'&node='+nodeName;
}
function loadFilesURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/files.html?uuid='+uuid+'&node='+nodeName;
}
function loadEditURL(uuid, file, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
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
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        GetAllNodes()
    })
    .catch(function (error) {
    });
}

function getRulesetUID(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000
    })
    .then(function (response) {
        getRuleName(response.data, uuid);
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function getRuleName(uuidRuleset, uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/name/' + uuidRuleset;
    axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user,
            'uuid': payload.uuid,
        },
        timeout: 30000
    })
        .then(function (response) {
            if (typeof response.data.error != "undefined") {
                document.getElementById(uuid + '-ruleset').innerHTML = "No ruleset selected...";
                document.getElementById(uuid + '-ruleset').className = "text-danger";
            } else {
                document.getElementById(uuid + '-ruleset').innerHTML = response.data;
                document.getElementById(uuid + '-ruleset').className = "text-muted-small";
            }
            return response.data;
        })
        .catch(function (error) {
            return false;
        });
}

function checkStatus() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
    document.getElementById('check-status-config').href = nodeurl;
}

function sortTableName() {
    var type = document.getElementById('sort-nodes-name').getAttribute("sort");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("node-table");
    switching = true;
    while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getAttribute("name");
            y = rows[i + 1].getAttribute("name");
            if (type == "asc"){
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }else{
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
    }

    //change attr
    if (type == "asc"){
        document.getElementById('sort-nodes-name').setAttribute("sort", "desc");
    }else{
        document.getElementById('sort-nodes-name').setAttribute("sort", "asc");
    }
}

function sortTableIP() {
    var type = document.getElementById('sort-nodes-ip').getAttribute("sort");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("node-table");
    switching = true;
    while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
			x = rows[i].getAttribute("ip").split('.');
            y = rows[i + 1].getAttribute("ip").split('.');
            if (type == "asc"){
                if (parseInt(x[0]) > parseInt(y[0])) {
                    shouldSwitch = true;
                    break;
                }else if ((parseInt(x[0]) == parseInt(y[0])) && (parseInt(x[1]) > parseInt(y[1]))){
                    shouldSwitch = true;
                    break;
                }else if ((parseInt(x[0]) == parseInt(y[0])) && (parseInt(x[1]) == parseInt(y[1])) && (parseInt(x[2]) > parseInt(y[2]))){
                    shouldSwitch = true;
                    break;
                }else if ((parseInt(x[0]) == parseInt(y[0])) && (parseInt(x[1]) == parseInt(y[1])) && (parseInt(x[2]) == parseInt(y[2])) && (parseInt(x[3]) > parseInt(y[3]))){
                    shouldSwitch = true;
                    break;
                }
            }else{
                if (x[0] < y[0]) {
                    shouldSwitch = true;
                    break;
                }else if ((x[0] == y[0]) && (x[1] < y[1])){
                    shouldSwitch = true;
                    break;
                }else if ((x[0] == y[0]) && (x[1] == y[1]) && (x[2] < y[2])){
                    shouldSwitch = true;
                    break;
                }else if ((x[0] == y[0]) && (x[1] == y[1]) && (x[2] == y[2]) && (x[3] < y[3])){
                    shouldSwitch = true;
                    break;
                }
            }
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
    }

    //change attr
    if (type == "asc"){
        document.getElementById('sort-nodes-ip').setAttribute("sort", "desc");
    }else{
        document.getElementById('sort-nodes-ip').setAttribute("sort", "asc");
    }
}