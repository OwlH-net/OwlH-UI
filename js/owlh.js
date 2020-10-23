
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

        //load title and nodes
        loadTitleJSONdata();
        GetAllNodes();
    });

}

function showConfig(oip, oname, oport, ouuid){
    document.getElementById('nidsform').style.display = "none";
    document.getElementById('add-nid-top').innerHTML = "Add NID";
    document.getElementById('add-nid-bottom').innerHTML = "Add NID";
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

async function PingNode(uuid, token) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ping/' + uuid;
    
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
                if (token=="wait") {
                    document.getElementById(uuid+'-online').className = "badge bg-warning align-text-bottom text-white";
                    document.getElementById(uuid+'-online').innerHTML = "PENDING REGISTRATION";
                    document.getElementById('node-values-'+uuid).innerHTML = '<span class="badge bg-primary align-text-bottom text-white float-" style="cursor: pointer;" onclick="registerNode(\''+uuid+'\')">Try registration now</span>';
                    document.getElementById('node-info-'+uuid).style.display = 'none';

                }else if (response.data.ping=='pong') {
                    document.getElementById('node-actions-'+uuid).style.color = "Dodgerblue";
                    document.getElementById(uuid+'-online').className = "badge bg-success align-text-bottom text-white";
                    document.getElementById(uuid+'-online').innerHTML = "ON LINE";
                    document.getElementById('node-row-'+uuid).setAttribute("status", "online");
    
                    PingMonitor(uuid);
                    var myVar = setInterval(function(){PingMonitor(uuid)}, 3000);
                }else{
                    //disable actions onclick
                    document.getElementById('node-monitor-'+uuid).onclick = "";
                    document.getElementById('node-services-'+uuid).onclick = "";
                    document.getElementById('node-config-'+uuid).onclick = "";
                    document.getElementById('node-files-'+uuid).onclick = "";
                    document.getElementById('node-change-'+uuid).onclick = "";
                    document.getElementById('node-incident-'+uuid).onclick = "";
                    document.getElementById('node-actions-'+uuid).onclick = "";
                    //disable actions style
                    document.getElementById('node-monitor-'+uuid).style.cursor = " default";
                    document.getElementById('node-services-'+uuid).style.cursor = "default";
                    document.getElementById('node-config-'+uuid).style.cursor = "default";
                    document.getElementById('node-files-'+uuid).style.cursor = "default";
                    document.getElementById('node-change-'+uuid).style.cursor = "default";
                    document.getElementById('node-incident-'+uuid).style.cursor = "default";
                    document.getElementById('node-actions-'+uuid).style.cursor = "default";
                    //set node status to OFFLINE
                    document.getElementById(uuid+'-online').className = "badge bg-danger align-text-bottom text-white";
                    document.getElementById(uuid+'-online').innerHTML = "OFF LINE";
                    //Set attr to offline
                    document.getElementById('node-row-'+uuid).setAttribute("status", "offline");
                }   
            }            
        })
        .catch(function (error) {
            document.getElementById('node-monitor-'+uuid).onclick = "";
            document.getElementById('node-services-'+uuid).onclick = "";
            document.getElementById('node-config-'+uuid).onclick = "";
            document.getElementById('node-files-'+uuid).onclick = "";
            document.getElementById('node-change-'+uuid).onclick = "";
            document.getElementById('node-incident-'+uuid).onclick = "";
            document.getElementById('node-actions-'+uuid).onclick = "";

            document.getElementById('node-monitor-'+uuid).style.cursor = " default";
            document.getElementById('node-services-'+uuid).style.cursor = "default";
            document.getElementById('node-config-'+uuid).style.cursor = "default";
            document.getElementById('node-files-'+uuid).style.cursor = "default";
            document.getElementById('node-change-'+uuid).style.cursor = "default";
            document.getElementById('node-incident-'+uuid).style.cursor = "default";
            document.getElementById('node-actions-'+uuid).style.cursor = "default";
        });   
}

function registerNode(uuid){
    document.getElementById('progressBar-node').style.display = "block";
    document.getElementById('progressBar-node-div').style.display = "block";
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/registerNode/' + uuid;
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
        document.getElementById('progressBar-node').style.display = "none";
        document.getElementById('progressBar-node-div').style.display = "none";

        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            GetAllNodes();
        }
    })
    .catch(function (error) {
        document.getElementById('progressBar-node').style.display = "none";
        document.getElementById('progressBar-node-div').style.display = "none";
        $('html,body').scrollTop(0);
        var alert = document.getElementById('floating-alert');
        alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
            '<strong>Registration Error!</strong> '+error+'.'+
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                '<span aria-hidden="true">&times;</span>'+
            '</button>'+
        '</div>';
        setTimeout(function() {$(".alert").alert('close')}, 30000);   
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
            'user': payload.user
            
        }
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if (response.data.ack == "true"){
                    document.getElementById(uuid+'-owlhservice').style.display = "none";
                }else {
                    document.getElementById(uuid+'-owlhservice').style.display = "block";
                }
                return true;
            }
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
            'user': payload.user            
        },
        timeout: 30000
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                var cpuData = "";
                for(x in response.data.cpus){
                    cpuData = cpuData + '<div id="cpu-core-'+x+'"><b>CPU '+x+':</b> '+ parseFloat(response.data.cpus[x].percentage).toFixed(2)+' % </div>';
                }
                document.getElementById('mem-'+uuid).innerHTML = "<b>MEM: </b>" + parseFloat(response.data.mem.percentage).toFixed(2)+" %";
                document.getElementById('sto-'+uuid).innerHTML = "<b>STO: </b>" + parseFloat(response.data.disk.percentage).toFixed(2)+" %";
                document.getElementById('cpu-'+uuid).innerHTML = cpuData

                if(response.data.cpus.length > 8 || document.getElementById('cpu-content-'+uuid).style.display == "none"){
                    document.getElementById('cpu-content-'+uuid).style.display = "none";
                    document.getElementById('cores-icon-'+uuid).classList.remove("fa-sort-up");                    
                    document.getElementById('cores-icon-'+uuid).classList.add("fa-sort-down");
                }else{
                    document.getElementById('cpu-content-'+uuid).style.display = "block";
                    document.getElementById('cores-icon-'+uuid).classList.remove("fa-sort-down");
                    document.getElementById('cores-icon-'+uuid).classList.add("fa-sort-up");
                }
            }
        })
        .catch(function (error) {
        }); 
}

function ShowCores(uuid) {
    if(document.getElementById('cpu-content-'+uuid).style.display == "none"){
        document.getElementById('cpu-content-'+uuid).style.display = "block";
        document.getElementById('cores-icon-'+uuid).classList.add("fa-sort-down");
        document.getElementById('cores-icon-'+uuid).classList.remove("fa-sort-up");
    }else{
        document.getElementById('cpu-content-'+uuid).style.display = "none"
        document.getElementById('cores-icon-'+uuid).classList.remove("fa-sort-down");
        document.getElementById('cores-icon-'+uuid).classList.add("fa-sort-up");                    
    }
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
            'user': payload.user
            
        },
        timeout: 30000
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllNodes();
                return true;
            }
        })
        .catch(function (error) {
            return false;
        });   
}

function GetAllNodes() {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var resultElement = document.getElementById('nodes-table');
    //hide buttons
    document.getElementById('add-nid-bottom').style.display = "none";
    document.getElementById('add-nid-top').style.display = "none";
    document.getElementById('search-node-details').style.display = "none";
    // document.getElementById('node-search-value').style.display = "none";
    document.getElementById('progressBar-node').style.display = "block";
    document.getElementById('progressBar-node-div').style.display = "block";

    //    var instance = axios.create({
    //     baseURL: 'https://' + ipmaster + ':' + portmaster + '/v1/node',
    //     httpsAgent: new https.Agent({
    //         rejectUnauthorized: false   
    //     })
    // });
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/node', {
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            }//Authorization
            // params: { token: document.cookie}// rejectUnauthorized: false }
        })

        .then(function (response) {   
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}            

            if(response.data.permissions == "none"){
                document.getElementById('progressBar-node').style.display = "none";
                document.getElementById('progressBar-node-div').style.display = "none";
                PrivilegesMessage();              
            }else{
                if (response.data.ack == "false") {
                    document.getElementById('add-nid-bottom').style.display = "none";
                    document.getElementById('add-nid-top').style.display = "none";
                    document.getElementById('search-node-details').style.display = "none";
                    // document.getElementById('node-search-value').style.display = "none";
                    document.getElementById('progressBar-node').style.display = "none";
                    document.getElementById('progressBar-node-div').style.display = "none";
                    resultElement.innerHTML =  '<div style="text-align:center"><h3 style="color:red;">Error retrieving nodes</h3></div>';
                }else{
                    document.getElementById('add-nid-bottom').style.display = "block";
                    document.getElementById('add-nid-top').style.display = "block";
                    document.getElementById('search-node-details').style.display = "block";
                    // document.getElementById('node-search-value').style.display = "block";
                    document.getElementById('progressBar-node').style.display = "none";
                    document.getElementById('progressBar-node-div').style.display = "none";
                    
                    var vals = response.data.result;                      
                    var nodes = JSON.parse(vals.replace('\\', ''));
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
                                PingNode(uuid, nodes[node]['token']);                       
                                
                                html = html + '<tr class="node-search" id="node-row-'+node+'" name="'+nodes[node]['name']+'" ip="'+nodes[node]['ip']+'" status="offline">'+
                                    '<td></td>'+
                                    '<td width="33%" style="word-wrap: break-word;" class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'+
                                        '<p class="text-muted">' + nodes[node]['ip'] + '</p>'+
                                        // '<i class="fas fa-code" title="Ruleset Management"></i> '+
                                        '<div id="node-info-'+node+'">'+
                                            '<p><b>Suricata rulesets</b></p>'+
                                            '<p id="all-data-'+uuid+'" class="text-danger small">No ruleset selected...</p>'+
                                            '<p><b>Zeek</b></p>'+
                                            '<p id="zeek-data-'+uuid+'" class="text-danger small">Zeek is not available...</p>'+
                                        '</div>'+
                                        // '<div>'+
                                        // '</div>'+
                                        // '<br><br>'+                                        
                                        // '<span id="'+uuid+'-owlhservice" style="display:none; font-size: 15px; cursor: default;" class="col-md-4 badge bg-warning align-text-bottom text-white" onclick="DeployService(\''+uuid+'\')">Install service</span>'+
                                    '</td>' +
                                    '<td width="33%" style="word-wrap: break-word;" class="align-middle">'+
                                        '<span id="'+uuid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span> <br>'+
                                        '<span>'+
                                            '<div><p></p></div>'+
                                            '<div id="node-values-'+uuid+'">'+
                                                '<div id="mem-'+uuid+'"><b>MEM:</b> </div>'+
                                                '<div id="sto-'+uuid+'"><b>STO:</b> </div>'+   
                                                '<br>'+
                                                '<h6 onclick="ShowCores(\''+uuid+'\')" style="cursor: pointer;">Cores <i id="cores-icon-'+uuid+'" class="fas fa-sort-up"></i></h6>'+                     
                                                '<div id="cpu-content-'+uuid+'" style="display:block;">'+
                                                    '<div id="cpu-'+uuid+'"></div>'+                        
                                                '</div>'+                        
                                            '</div>'+
                                        '</span>'+
                                    '</td>'+    
                                    '<td></td>'+        
                                    '<td width="33%" style="word-wrap: break-word;" class="align-middle"> '+                                   
                                        '<span style="font-size: 15px; color: Grey;" id="node-actions-'+uuid+'">'+                                                                          
                                            '<i id="node-services-'+uuid+'" class="fas fa-box-open" style="cursor: pointer;" title="node services configuration" onclick="showServicesConfig(\''+uuid+'\', \''+nodes[node]['name']+'\');"></i> | Node services configuration' +
                                            '<br><i id="node-monitor-'+uuid+'" class="fas fa-desktop" style="cursor: pointer;" id="details-'+uuid+'" title="Node monitoring" onclick="ShowMonitoring(\''+uuid+'\', \''+nodes[node]['name']+'\');"></i> | Node monitoring' +
                                            '<br><i id="node-config-'+uuid+'" class="fas fa-cog" style="cursor: pointer;" title="Edit node configuration" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')"></i> | Edit node configuration' +
                                            '<br><i id="node-files-'+uuid+'" class="fas fa-arrow-alt-circle-down" style="cursor: pointer;" title="See node files" onclick="loadFilesURL(\''+uuid+'\', \''+nodes[node]['name']+'\')"></i> | See node files' +
                                            '<br><i id="node-change-'+uuid+'" class="fas fa-clipboard-list" style="cursor: pointer;" title="Change control data" onclick="loadChangeControl(\''+uuid+'\', \'node\', \''+nodes[node]['name']+'\')"></i> | Change control' +
                                            '<br><i id="node-incident-'+uuid+'" class="fas fa-archive" style="cursor: pointer;" title="Incident data" onclick="loadIncidentMaster(\''+uuid+'\', \'node\', \''+nodes[node]['name']+'\')"></i> | Incident data' +
                                            '<div style="color:dodgerblue; border-top: 1px solid">'+
                                                '<i id="node-modify-'+uuid+'" class="fas fa-cogs" style="cursor: pointer;" title="Modify node details" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+uuid+"'"+');"></i> | Modify node' +
                                                '<br><i class="fas fa-trash-alt" style="color: red; cursor: pointer;" title="Delete Node" data-toggle="modal" data-target="#modal-window" onclick="deleteNodeModal('+"'"+node+"'"+', '+"'"+nodes[node]['name']+"'"+');"></i> | Delete node'+
                                            '</div>';
                                        '</span>'+
                                    '</td> ' +
                                '</tr>';  
                                
                                //Get node local ruleset
                                getRulesetUID(uuid);
                                PingZeek(uuid);
                            }
                    html = html + '</tbody></table>';
                
                    if (isEmpty){
                        resultElement.innerHTML = '<div style="text-align:center"><h3>No nodes created.</h3></div>';
                    }else{
                        resultElement.innerHTML = html;
                        
                        //search bar
                        $('#search-node-details').keyup(function(){ loadNodeBySearch(document.getElementById('search-node-details').value)});
                    
                        //listener for search bar
                        document.getElementById('search-node-details').addEventListener('input', evt => {
                            if (document.getElementById('search-node-details').value.trim() == ""){ showAllHiddenNodes();} 
                        });
                    }                    
                }                           
                //hide progressBar when nodes have finished loading
                document.getElementById('progressBar-node').style.display = "none";
                document.getElementById('progressBar-node-div').style.display = "none";
            }
            GetAllRulesetsForAllNodes();
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);   

            document.getElementById('progressBar-node').style.display = "none";
            document.getElementById('progressBar-node-div').style.display = "none";
            resultElement.innerHTML = '<h3 align="center">No connection</h3>'+
                '<a id="check-status-config" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
                checkStatus();
        });
}

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
    // showAllHiddenNodes();
    if (search.length == 0){
        // $('#search-node-details').css('border', '2px solid red');
        $('#search-node-details').css('border', '2px solid #ced4da');
        $('#search-node-details').attr("placeholder", "Search by name or ip...");
    }else{
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
            'user': payload.user
            
        },
        timeout: 30000
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                GetAllNodes();
                return true;
            }
        })
        .catch(function (error) {
            return false;
        });   
}

function GetAllRulesetsForAllNodes(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/master/getAllRulesetsForAllNodes';
    axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user
        },
        timeout: 30000
    })
        .then(function (response) {
            
            console.log(response.data);

            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                for(uuid in response.data){
                    var html = '';
                    var isEmpty = true;
                    for(group in response.data[uuid]){
                        if (response.data[uuid][group] != ""){
                            isEmpty = false;
                            rulesets = response.data[uuid][group].split(",");
                            for(x in rulesets){
                                html = html + rulesets[x] +' ('+group+')<br>';                        
                            }
                        }
                    }
                    if (!isEmpty){
                        if (document.getElementById('all-data-'+uuid).innerHTML == "No ruleset selected..."){
                            document.getElementById('all-data-'+uuid).className = 'text-dark small';
                            document.getElementById('all-data-'+uuid).innerHTML = html;
                        }else{
                            document.getElementById('all-data-'+uuid).innerHTML = document.getElementById('all-data-'+uuid).innerHTML + '<br>'+html;
                        }
                    }
                }
            }
        })
        .catch(function (error) {
        });   
}

function formAddNids(){
    var addnidsbot = document.getElementById('add-nid-bottom');
    var addnidstop = document.getElementById('add-nid-top');
    var nform = document.getElementById('nidsform');
    document.getElementById('divconfigform').style.display = "none";

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
            'user': payload.user
            
        },
        timeout: 30000
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
            'user': payload.user
            
        },
        timeout: 30000,
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
                    '<strong>Success!</strong> '+value+' deployed successfully for node '+nodeName+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 30000);
            }else{
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> '+value+' has not been deployed for node '+nodeName+'.'+
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

function ShowMonitoring(uuid, name){
    document.location.href = 'https://' + location.host + '/node-monitor.html?uuid='+uuid+'&node='+name;
}
function showServicesConfig(uuid, name){
    // document.location.href = 'https://' + location.host + '/node-options.html?uuid='+uuid+'&node='+name+'&nodetab=suricata';
    document.location.href = 'node-options.html?uuid='+uuid+'&node='+name+'&nodetab=suricata';
}
function editAnalyzer(uuid, file, nodeName){
    document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
}
function loadIncidentMaster(uuid, type, name){
    document.location.href = 'https://' + location.host + '/incident-data.html?type='+type+'&uuid='+uuid+'&node='+name;
}
function loadChangeControl(uuid, type, name){
    document.location.href = 'https://' + location.host + '/control-data.html?type='+type+'&uuid='+uuid+'&node='+name;
}
function loadStapURL(uuid, nodeName){
    document.location.href = 'https://' + location.host + '/stap.html?uuid='+uuid+'&node='+nodeName;
}
function loadFilesURL(uuid, nodeName){
    document.location.href = 'https://' + location.host + '/files.html?uuid='+uuid+'&node='+nodeName;
}
function loadEditURL(uuid, file, nodeName){
    document.location.href = 'https://' + location.host + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
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
            'user': payload.user
            
        },
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            GetAllNodes()
        }
    })
    .catch(function (error) {
    });
}

async function getRulesetUID(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/' + uuid;
    await axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        timeout: 30000
    })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            getRuleName(response.data, uuid);
            return true;
        }
    })
    .catch(function (error) {
        return false;
    });
}

async function getRuleName(uuidRuleset, uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/name/' + uuidRuleset;
    await axios({
        method: 'get',
        url: nodeurl,
        headers:{
            'token': document.cookie,
            'user': payload.user
            
        },
        timeout: 30000
    })
        .then(function (response) {
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{
                if (response.data != ""){
                    if (document.getElementById('all-data-'+uuid).innerHTML == "No ruleset selected..."){
                        document.getElementById('all-data-'+uuid).className = 'text-dark small';
                        document.getElementById('all-data-'+uuid).innerHTML = response.data;
                    }else{
                        document.getElementById('all-data-'+uuid).innerHTML = document.getElementById('all-data-'+uuid).innerHTML + response.data;
                    }
                }
                // if (typeof response.data.error != "undefined" || response.data == ""){
                    // document.getElementById(uuid + '-ruleset').innerHTML = "No ruleset selected...";
                    // document.getElementById(uuid + '-ruleset').className = "text-danger";
                // } else {
                    // document.getElementById(uuid + '-ruleset').innerHTML = response.data;
                    // document.getElementById(uuid + '-ruleset').className = "text-muted-small";
                // }
                return response.data;
            }
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

function addNode() {          
    document.getElementById('progressBar-node').style.display = "block";
    document.getElementById('progressBar-node-div').style.display = "block";       
    var nname = document.getElementById('nodename').value.trim();
    var nip = document.getElementById('nodeip').value.trim();
    var nport = document.getElementById('nodeport').value.trim();
    var nuser = document.getElementById('nodeuser').value.trim();
    var npass = document.getElementById('nodepass').value.trim();
    if(nname=="" || nip=="" || nport==""){
        document.getElementById('progressBar-node').style.display = "none";
        document.getElementById('progressBar-node-div').style.display = "none";
		$('html,body').scrollTop(0);
		var alert = document.getElementById('floating-alert');
		alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
			'<strong>Error!</strong> Please, insert a name, port and IP for add a new node.'+
			'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
				'<span aria-hidden="true">&times;</span>'+
			'</button>'+
		'</div>';
      setTimeout(function() {$(".alert").alert('close')}, 30000);
    }else{
		formAddNids();//close add nids form
		var nodejson = {}
		nodejson["nodepass"] = npass;
		nodejson["nodeuser"] = nuser;
		nodejson["name"] = nname;
		nodejson["port"] = nport;
		nodejson["ip"] = nip;
		var nodeJSON = JSON.stringify(nodejson);
		var ipmaster = document.getElementById('ip-master').value;
		var portmaster = document.getElementById('port-master').value;
		var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/';
		axios({
			method: 'post',
            url: nodeurl,
            headers:{
                'token': document.cookie,
                'user': payload.user
                
            },
			timeout: 30000,
			data: nodeJSON
		})
		.then(function (response) {
            document.getElementById('progressBar-node').style.display = "none";
            document.getElementById('progressBar-node-div').style.display = "none";
            if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
            if(response.data.permissions == "none"){
                PrivilegesMessage();              
            }else{   
                if(response.data.ack == "false"){
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                        '<strong>Error adding node!</strong> '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    $('html,body').scrollTop(0);
                    var alert = document.getElementById('floating-alert');
                    alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                        '<strong>Success!</strong> Node added successfully.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }
                GetAllNodes();
            }
		})
		.catch(function (error) {
            document.getElementById('progressBar-node').style.display = "none";
            document.getElementById('progressBar-node-div').style.display = "none";
			$('html,body').scrollTop(0);
			var alert = document.getElementById('floating-alert');
			alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
				'<strong>Error adding node!</strong> '+error+'.'+
				'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
					'<span aria-hidden="true">&times;</span>'+
				'</button>'+
			'</div>';
			setTimeout(function() {$(".alert").alert('close')}, 30000);
		});   
    }
}

function modifyNodeInformation() {
    var name = document.getElementById('cfgnodename').value;
    var ip = document.getElementById('cfgnodeip').value;
    var port = document.getElementById('cfgnodeport').value;
    var nid = document.getElementById('cfgnodeid').value;
    var usr = document.getElementById('cfgnodeuser').value;
    var pass = document.getElementById('cfgnodepass').value;
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node';
    
    if(name=="" || ip=="" || port=="" || usr=="" || pass==""){
      if(name == ""){$('#cfgnodename').attr("placeholder", "Please, insert a valid name"); $('#cfgnodename').css('border', '2px solid red'); }else{$('#cfgnodename').css('border', '2px solid #ced4da');}
      if(ip == ""){$('#cfgnodeip').attr("placeholder", "Please, insert a valid ip"); $('#cfgnodeip').css('border', '2px solid red'); }else{$('#cfgnodeip').css('border', '2px solid #ced4da');}
      if(port == ""){$('#cfgnodeport').attr("placeholder", "Please, insert a valid port"); $('#cfgnodeport').css('border', '2px solid red'); }else{$('#cfgnodeport').css('border', '2px solid #ced4da');}
      if(usr == ""){$('#cfgnodeuser').attr("placeholder", "Please, insert a valid user"); $('#cfgnodeuser').css('border', '2px solid red'); }else{$('#cfgnodeuser').css('border', '2px solid #ced4da');}
      if(pass == ""){$('#cfgnodepass').attr("placeholder", "Please, insert a valid pass"); $('#cfgnodepass').css('border', '2px solid red'); }else{$('#cfgnodepass').css('border', '2px solid #ced4da');}
    }else{
      var nodejson = {}
      nodejson["name"] = name;
      nodejson["port"] = port;
      nodejson["ip"] = ip;
      nodejson["id"] = nid;
      nodejson["user"] = usr;
      nodejson["pass"] = pass;
      var newValues = JSON.stringify(nodejson);

      axios({
        method: 'put',
        headers:{'token': document.cookie,'user': payload.user},
        url: nodeurl,
        timeout: 30000,
        data: newValues
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
                        '<strong>Modify node error!</strong> '+response.data.error+'.'+
                        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                            '<span aria-hidden="true">&times;</span>'+
                        '</button>'+
                    '</div>';
                    setTimeout(function() {$(".alert").alert('close')}, 30000);
                }else{
                    GetAllNodes();
                }
            }
        })
        .catch(function (error) {
            $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = alert.innerHTML + '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Modify node error!</strong> '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 30000);
        });   
        document.getElementById('divconfigform').style.display = "none";
        return false;
    }
}

function cancelNodeModification(){
    document.getElementById('divconfigform').style.display = "none";
}

function loadBPF(nid, name){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = '<div class="modal-dialog">'+
                '<div class="modal-content">'+
    
                 '<div class="modal-header">'+
                        '<h4 class="modal-title" id="bpf-header">BPF</h4>'+
                        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                    '</div>'+
    
                    '<div class="modal-body" id="modal-footer-inputtext">'+
                        '<input type="text" class="form-control" id="recipient-name">'+
                    '</div>'+
    
                    '<div class="modal-footer" id="modal-footer-btn">'+
                        '<!-- Buttons -->'+
                    '</div>'+
    
                '</div>'+
            '</div>';
  var inputBPF = document.getElementById('recipient-name');
  var headerBPF = document.getElementById('bpf-header');
  var footerBPF = document.getElementById("modal-footer-btn");
  headerBPF.innerHTML = "BPF - "+name;
  footerBPF.innerHTML = '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveBPF(\''+nid+'\')" id="btn-save-changes">Save changes</button>';
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/'+nid+'/bpf';
  axios({
    method: 'get',
    headers:{
        'token': document.cookie,
        'user': payload.user
        
    },
    url: nodeurl,
    timeout: 3000
  })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            if('bpf' in response.data){
                inputBPF.value=response.data.bpf;     
            }else{
                inputBPF.value='';
                headerBPF.innerHTML = headerBPF.innerHTML + '<br>Not defined';
            }
        }
    })
    .catch(function (error) {
      windowModalLog.innerHTML = error+"++<br>";
    });   
}



function saveBPF(nid){
  var inputBPF = document.getElementById('recipient-name');
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/'+nid+'/bpf';
  var jsonbpfdata = {}
  jsonbpfdata["nid"] = nid;
  jsonbpfdata["bpf"] = inputBPF.value;
  var bpfjson = JSON.stringify(jsonbpfdata);

  axios({
    method: 'put',
    headers:{
        'token': document.cookie,
        'user': payload.user
        
    },
    url: nodeurl,
    timeout: 30000,
    data: bpfjson
  })
    .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();              
        }else{   
            return true;
        }
    })
    .catch(function (error) {
      return false;
    });   
}

function deleteNodeModal(node, name){
  var modalWindow = document.getElementById('modal-window');
  modalWindow.innerHTML = 
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
    
      '<div class="modal-header">'+
        '<h4 class="modal-title" id="delete-node-header">Node</h4>'+
        '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
      '</div>'+

      '<div class="modal-body" id="delete-node-footer-table" style="word-break: break-all;">'+ 
        '<p>Do you want to delete <b>'+name+'</b> node?</p>'+
      '</div>'+

      '<div class="modal-footer" id="delete-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
        '<button type="submit" class="btn btn-danger" data-dismiss="modal" id="btn-delete-node" onclick="deleteNode(\''+node+'\')">Delete</button>'+
      '</div>'+

    '</div>'+
  '</div>';
}

function syncRulesetModal(node, name){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML = 
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
      
        '<div class="modal-header">'+
          '<h4 class="modal-title" id="sync-node-header">Node</h4>'+
          '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
        '</div>'+
  
        '<div class="modal-body" id="sync-node-footer-table" style="word-break: break-all;">'+ 
          '<p>Do you want to sync ruleset for <b>'+name+'</b> node?</p>'+
        '</div>'+
  
        '<div class="modal-footer" id="sync-node-footer-btn">'+
          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
          '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-sync-node" onclick="sendRulesetToNode(\''+node+'\')">sync</button>'+
        '</div>'+
  
      '</div>'+
    '</div>';
  }

  function PingZeek(uuid) {
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
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            if (response.data.mode != "") {
                if (response.data.mode == "standalone") {
                    document.getElementById('zeek-data-'+uuid).innerHTML = "Mode: Standalone";
                    document.getElementById('zeek-data-'+uuid).className = 'text-dark small';
                }else if (response.data.mode == "cluster" && !response.data.manager){
                    document.getElementById('zeek-data-'+uuid).innerHTML = "Mode: Cluster";
                    document.getElementById('zeek-data-'+uuid).className = 'text-dark small';
                }else if (response.data.mode == "cluster" && response.data.manager){
                    document.getElementById('zeek-data-'+uuid).innerHTML = "Mode: Cluster (Manager)";
                    document.getElementById('zeek-data-'+uuid).className = 'text-dark small';

                }
            }
        }
    })
    .catch(function (error) {
    });
}