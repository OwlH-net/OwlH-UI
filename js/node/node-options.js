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
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    
    var html = 
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'monitor\', \''+uuid+'\')"><b>Node monitor</b> <i class="fas fa-sort-down" id="monitor-form-icon-'+uuid+'"></i></h6>'+
        '<span id="monitor-form-'+uuid+'" style="display:None"><br>'+
            '<table width="100%">'+
                '<tbody>'+                
                    '<tr>'+
                        '<td width="33%" valign="top"><div id="cpu-node-monitor-'+uuid+'"></div></td>'+
                        '<td width="33%" valign="top"><div id="mem-node-monitor-'+uuid+'"></div></td>'+
                        '<td width="34%" valign="top"><div id="sto-node-monitor-'+uuid+'"></div></td>'+
                    '</tr>'+               
                '</tbody>'+
            '</table>'+
        '</span>'+
    '</div>'+    
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'network-ids\',\''+uuid+'\')"><b>Network IDS</b> <i class="fas fa-sort-down" id="network-ids-form-icon-'+uuid+'"></i></h6>'+
        '<span id="network-ids-form-'+uuid+'" style="display:None"><br>'+
            '<p><img src="img/suricata.png" alt="" width="30"> '      +
            '  <span id="'+uuid+'-suricata" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |' + 
            '  <span style="font-size: 15px; color: grey;" >                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-suricata-icon" title="Stop Suricata" onclick="StopSuricata(\''+uuid+'\')"></i>                     ' +
            '    <i class="fas fa-sync-alt" title="Deploy ruleset" data-toggle="modal" data-target="#modal-window" onclick="syncRulesetModal(\''+uuid+'\',\''+name+'\')"></i>                                 ' +
            '    <i title="Configuration" style="cursor: default;" data-toggle="modal" data-target="#modal-window" onclick="loadBPF(\''+uuid+'\',\''+name+'\')">BPF</i>'+
            '    <i class="fas fa-code" title="Ruleset Management" data-toggle="modal" data-target="#modal-window" onclick="loadRuleset(\''+uuid+'\')"></i>                        ' +
            '  </span>                                                                        ' +
            '  </p>                                                                           ' +
            '  <p><img  src="img/bro.png" alt="" width="30">'+
            '  <span id="'+uuid+'-zeek" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                       ' +
            '  <span style="font-size: 15px; color: grey;" >                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-zeek-icon"></i>                         ' +
            '    <i class="fab fa-wpforms" title="Zeek: Deploy policy" data-toggle="modal" data-target="#modal-window" onclick="deployZeekModal(\''+uuid+'\')"></i>                  ' +
            '    <i class="fas fa-crown" style="color: darkkhaki;" title="Zeek: Is Master"></i>                  ' +
            '  </span>' +
            '  </p>   '+
        '</span>'+
    '</div>'+    
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'transport\',\''+uuid+'\')"><b>Transport</b> <i class="fas fa-sort-down" id="transport-form-icon-'+uuid+'"></i></h6>'+                                                                        
        '<span id="transport-form-'+uuid+'" style="display:None"><br>'+
            '  <p><img src="img/wazuh.png" alt="" width="30"> '+
            '  <span id="'+uuid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                        ' +
            '  <span style="font-size: 15px; color: grey;" >                                  ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-wazuh-icon"></i>                         ' +
            '  </span></p> '+
        '</span>'+
    '</div>'+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'plugins\',\''+uuid+'\')"><b>Plugins</b> <i class="fas fa-sort-down" id="plugins-form-icon-'+uuid+'"></i></h6>'+
        '<span id="plugins-form-'+uuid+'" style="display:None"><br>'+
            '  <p><i class="fas fa-plug fa-lg"></i>'+
            '  <span id="'+uuid+'-stap" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                         ' +
            '  <span style="font-size: 15px; color: grey;">                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-stap-icon"></i>                         ' +
            '    <i class="fas fa-cog" title="Configuration" style="color: grey;" onclick="loadStapURL(\''+uuid+'\', \''+name+'\')"></i>                             ' +
            '  </span></p> '+            
            '  <p><span style="font-size: 15px; color: grey;">                                   ' +
            '    <i style="color: Dodgerblue;" class="fas fa-plug fa-lg"></i> <span style="font-size: 15px; color: Grey;">&nbsp; STAP Collector &nbsp; | </span> <i id="stap-collector-'+uuid+'">[N/A]</i> | '+
            '    <i class="fas fa-play-circle" title="Play collector" onclick="playCollector(\''+uuid+'\')"></i>                         ' +
            '    <i class="fas fa-stop-circle" title="Stop collector" onclick="stopCollector(\''+uuid+'\')"></i>                         ' +
            '    <i class="fas fa-info-circle" title="Collector information" data-toggle="modal" data-target="#modal-window" onclick="showCollector(\''+uuid+'\')"></i>  ' +
            '  </span></p> '+   
            '  <p style="color: Dodgerblue;"><span style="font-size: 15px; color: grey;"> '+
            '  <span style="font-size: 15px; color: grey;">                                   ' +
            '    <img src="img/favicon.ico" height="25">Knownports | '+
            '    <span class="fas fa-play-circle" id="ports-status-'+uuid+'" title="Change status">[N/A]</span> <i style="padding-left:3px;" id="ports-status-btn-'+uuid+'" onclick="ChangeStatus(\''+uuid+'\')"></i> |                         ' +
            '    <i style="color: grey;" id="ports-mode-'+uuid+'">[N/A]</i> <i style="padding-left:2px; color: grey;"" class="fas fa-sync-alt" title="Change mode" onclick="ChangeMode(\''+uuid+'\')"></i>  <span style="color: grey;"">|</span>                            '+
            '    <i style="cursor: default; color: grey;" title="Show ports" data-toggle="modal" data-target="#modal-window" onclick="showPorts(\''+uuid+'\')">[Ports]</i>                              '+
            '  </span></p> '+ 
            '  <p style="color: Dodgerblue;"><span style="font-size: 15px; color: grey;"> '+
            '  <span style="font-size: 15px; color: grey;">                                   ' +
            '    <img src="img/favicon.ico" height="25">Analyzer | '+
            '    <span class="fas fa-play-circle" id="analyzer-status-'+uuid+'" title="Change analyzer status">[N/A]</span> <i style="padding-left:3px;" id="analyzer-status-btn-'+uuid+'" onclick="ChangeAnalyzerStatus(\''+uuid+'\')"></i>                         ' +
            '    <i class="fas fa-info-circle" title="Edit analyzer" onclick="editAnalyzer(\''+uuid+'\', \'analyzer\', \''+name+'\')"></i>  ' +
            '  </span></p> '+ 
        '  </span>'+ 
    '</div>'+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'flow\',\''+uuid+'\')"><b>Traffic flow</b> <i class="fas fa-sort-down" id="flow-form-icon-'+uuid+'"></i></h6>'+
        '<span id="flow-form-'+uuid+'" style="display:none"><br>'+
            '<table style="width:100%">'+
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
                    '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'network\', \''+uuid+'\')" id="collect-network" name="network" value="network" class="custom-control-input">'+
                        '<label class="custom-control-label" for="collect-network">Network</label> <i class="fas fa-info-circle" data-toggle="modal" data-target="#modal-window" onclick="loadNetworkValues(\''+uuid+'\')" style="color:grey;" title="Collector information"></i>'+
                    '</div>'+
                    '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'socket-pcap\', \''+uuid+'\')" id="collect-socket-pcap" name="network" value="socket-pcap" class="custom-control-input">'+
                        '<label class="custom-control-label" for="collect-socket-pcap">Socket -> PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
                    '</div>'+
                    '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'socket-network\', \''+uuid+'\')" id="collect-socket-network" name="network" value="socket-network" class="custom-control-input">'+
                        '<label class="custom-control-label" for="collect-socket-network">Socket -> Network</label> <i class="fas fa-info-circle" data-toggle="modal" data-target="#modal-window" onclick="SocketToNetworkList(\''+uuid+'\')" style="color:grey;" title="Socket to Network information"></i>'+
                    '</div>'+
                    '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'pcap-network\', \''+uuid+'\')" id="collect-pcap-network" name="network" value="pcap-network" class="custom-control-input">'+
                        '<label class="custom-control-label" for="collect-pcap-network">PCAP -> Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;"title="Collector information"></i>'+
                    '</div>'+
                '</td>'+
                '<td style="word-wrap: break-word;">'+
                    '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'network\', \''+uuid+'\')" id="analysis-network" name="analysis" value="network" class="custom-control-input">'+
                        '<label class="custom-control-label" for="analysis-network">Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;"title="Collector information"></i>'+
                    '</div>'+
                    '<div class="custom-control custom-radio">'+
                    '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'pcap\', \''+uuid+'\')" id="analysis-pcap" name="analysis" value="pcap" class="custom-control-input">'+
                        '<label class="custom-control-label" for="analysis-pcap">PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
                    '</div>'+
                '</td>'+
                '<td style="word-wrap: break-word;">'+
                    '<div class="custom-control custom-radio">'+
                        '<input type="radio" onclick="changeDataflowValues(\'transport\', \'value\', \'wazuh\', \''+uuid+'\')" id="transport-wazuh" name="transport" value="wazuh" class="custom-control-input">'+
                        '<label class="custom-control-label" for="transport-wazuh">Wazuh</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+uuid+'\', \'main.conf\', \''+name+'\')" style="color:grey;" title="Collector information"></i>'+
                    '</div>'+                    
                '</td>'+
                '<td style="word-wrap: break-word;"></td>'+
                '</tr>'+
            '</tbody>' +
                
            '</table>'+
        '</span>'+
    '</div>'+
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'deploy\',\''+uuid+'\')"><b>Deploy</b> <i class="fas fa-sort-down" id="deploy-form-icon-'+uuid+'"></i></h6>'+
        '<span id="deploy-form-'+uuid+'" style="display:None"><br>'+
            '<span style="font-size: 15px; color: Dodgerblue;">'+
                '<p id="deploy-node-suricata"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Suricata &nbsp; | '+
                '    <i class="fas fa-play-circle" title="Deploy Suricata" id="suricata-deploy-button" onclick="deployNode(\'suricata\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
                '<p id="deploy-node-zeek"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Zeek &nbsp; | '+
                '    <i class="fas fa-play-circle" title="Deploy Zeek" onclick="deployNode(\'zeek\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
                '<p id="deploy-node-moloch"><i style="color: Dodgerblue;" class="fas fa-search"></i> &nbsp; Moloch &nbsp; | '+
                '    <i class="fas fa-play-circle" title="Deploy Moloch" onclick="deployNode(\'moloch\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
                '<p id="deploy-node-interface"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; OwlH interface &nbsp; | '+
                '    <i class="fas fa-play-circle" title="Deploy OwlH interface" onclick="deployNode(\'interface\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
                '<p id="deploy-node-firewall"><i style="color: Dodgerblue;" class="fas fa-traffic-light"></i> &nbsp; OwlH firewall &nbsp; | '+
                '    <i class="fas fa-play-circle" title="Deploy OwlH firewall" onclick="deployNode(\'firewall\', \''+uuid+'\', \''+name+'\')"></i></p>                         ' +
            '</span>'+
        '</span>' +
    '</div>';
    
    document.getElementById('master-table-plugins').innerHTML = html;

    PingSuricata(uuid);
    PingZeek(uuid);
    PingWazuh(uuid);
    PingStap(uuid);
    PingPorts(uuid);
    PingAnalyzer(uuid);
    PingDataflow(uuid);
    PingCollector(uuid);
    PingMonitor(uuid);
}

function PingMonitor(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingmonitor/' + uuid;
    var html = "";
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            for(x in response.data.cpus){
                document.getElementById('cpu-node-monitor-'+uuid).innerHTML = document.getElementById('cpu-node-monitor-'+uuid).innerHTML + '<div id="cpu-core-'+x+'"><b>CPU '+x+':</b> '+ parseFloat(response.data.cpus[x].percentage).toFixed(2)+' % </div>';
            }

            document.getElementById('sto-node-monitor-'+uuid).innerHTML = document.getElementById('sto-node-monitor-'+uuid).innerHTML + '<div id="sto-node-values-1"><b>STORAGE percentage used: </b>'+parseFloat(response.data.disk.percentage).toFixed(2)+' %</div>';            
            document.getElementById('sto-node-monitor-'+uuid).innerHTML = document.getElementById('sto-node-monitor-'+uuid).innerHTML + '<div id="sto-node-values-2"><b>STORAGE used: </b>'+parseFloat(response.data.disk.useddisk).toFixed(2)+' MB</div>';            
            document.getElementById('sto-node-monitor-'+uuid).innerHTML = document.getElementById('sto-node-monitor-'+uuid).innerHTML + '<div id="sto-node-values-3"><b>STORAGE free: </b>'+parseFloat(response.data.disk.freedisk).toFixed(2)+' MB</div>';            
            document.getElementById('sto-node-monitor-'+uuid).innerHTML = document.getElementById('sto-node-monitor-'+uuid).innerHTML + '<div id="sto-node-values-4"><b>STORAGE total: </b>'+parseFloat(response.data.disk.totaldisk).toFixed(2)+' MB</div>';            
            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-1"><b>MEMORY percentage: </b>'+parseFloat(response.data.mem.percentage).toFixed(2)+' %</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-6"><b>MEMORY total alloc: </b>'+parseFloat(response.data.mem.totalalloc).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-2"><b>MEMORY alloc: </b>'+parseFloat(response.data.mem.alloc).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-4"><b>MEMORY gc: </b>'+parseFloat(response.data.mem.gc).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-5"><b>MEMORY sys: </b>'+parseFloat(response.data.mem.sys).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-8"><b>MEMORY used: </b>'+parseFloat(response.data.mem.usedmem).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-3"><b>MEMORY free: </b>'+parseFloat(response.data.mem.freemem).toFixed(2)+' MB</div>';            
            document.getElementById('mem-node-monitor-'+uuid).innerHTML = document.getElementById('mem-node-monitor-'+uuid).innerHTML + '<div id="mem-node-values-7"><b>MEMORY total: </b>'+parseFloat(response.data.mem.totalmem).toFixed(2)+' MB</div>';            
            
        })
        .catch(function (error) {
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
        loadPlugins()
    })
    .catch(function (error) {
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
        if (response.data.ack == "true") {
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> '+value+' deployed successfully for node '+nodeName+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            
        }else{
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> '+value+' has not been deployed for node '+nodeName+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
        }
    })
    .catch(function (error) {
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
            // loadPlugins();
        })
        .catch(function error() {
        });

    setTimeout(function (){
        loadPlugins();
    }, 1000);
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

      '<div class="modal-body" id="sync-node-footer-table">'+ 
        '<p>Do you want to sync ruleset for <b>'+name+'</b> node?</p>'+
      '</div>'+

      '<div class="modal-footer" id="sync-node-footer-btn">'+
        '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'+
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-sync-node" onclick="sendRulesetToNode(\''+node+'\')">sync</button>'+
      '</div>'+

    '</div>'+
  '</div>';
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
    url: nodeurl,
    timeout: 3000
  })
    .then(function (response) {
        if('bpf' in response.data){
            inputBPF.value=response.data.bpf;     
        }else{
            inputBPF.value='';
            headerBPF.innerHTML = headerBPF.innerHTML + '<br>Not defined';
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
      url: nodeurl,
      timeout: 30000,
      data: bpfjson
    })
      .then(function (response) {
        return true;
      })
      .catch(function (error) {
        return false;
      });   
  }

function loadRuleset(nid){
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
              resultElement.innerHTML = generateAllRulesModal(response, nid);
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
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function generateAllRulesModal(response, nid) {
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
        '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="saveRuleSelected(\''+rule+'\', \''+nid+'\')">Select</button>        ' +
        '</td></tr>                                                           '
    }
    html = html + '</tbody></table>';
    
    if (isEmpty){
        return '<p>No rules available...</p>';;
    }else{
        return html;
    }
}


function saveRuleSelected(rule, nid){
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
            getRulesetUID(nid);
            return true;
        })
            .catch(function (error) {
            return false;
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
    document.getElementById('modal-window').innerHTML = html;
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
        loadPlugins()
    })
    .catch(function (error) {
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
        loadPlugins()
    })
    .catch(function (error) {
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
                html = html + '<div class="modal-body">  '+
                    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                        '<thead>                                                      ' +
                            '<tr>                                                         ' +
                                '<th width="30%">Portproto</th>                                    ' +
                                '<th>First</th>                                         ' +
                                '<th>Last</th>                                 ' +
                                '<th width="10%">Select</th>                                 ' +
                            '</tr>                                                        ' +
                        '</thead>                                                     ' +
                        '<tbody>                                                     ' 
                            for(line in response.data){
                                var first = new Date(response.data[line]["first"]*1000);
                                var last = new Date(response.data[line]["last"]*1000);
                                
                                html = html + '<tr><td id="">                            ' +
                                response.data[line]["portprot"]+'<br>'                    +
                                '</td><td>'+
                                first+
                                '</td><td>'+
                                last+
                                '</td><td align="center">'+
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
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-success alert-dismissible fade show">'+
                '<strong>Success!</strong> Suricata ruleset deployment complete.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            
        }else{
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Suricata deployment Error! </strong>'+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
        }
    })
    .catch(function (error) {
        var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong>'+response.data.error+''+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
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
            // loadPlugins();
        })
        .catch(function error() {
        });

    setTimeout(function (){
        loadPlugins();
    }, 1000);
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
            // loadPlugins();
        })
        .catch(function error() {
        });

    setTimeout(function (){
        loadPlugins();
    }, 1000);
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
        })
        .catch(function error() {
        });

    loadPlugins();
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
        })
        .catch(function error() {
        });

    loadPlugins();
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
        })
        .catch(function error() {
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
        })
        .catch(function error() {
        });

    loadPlugins();
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
        })
        .catch(function error() {
        });
    loadPlugins();
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
        })
        .catch(function error() {
        });
    loadPlugins();
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
            document.getElementById(uuid + '-stap').innerHTML = "N/A";
            return false;
        });
    return false;
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
                if (response.data[line]["status"] == "Enabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "ON";
                }else if (response.data[line]["status"] == "Disabled"){
                    document.getElementById('ports-status-'+uuid).innerHTML = "OFF";
                }
                document.getElementById('ports-mode-'+uuid).innerHTML = response.data[line]["mode"];
                
                if (response.data[line]["status"] == "Enabled"){
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-stop-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-success align-text-bottom text-white";
                }else{
                    document.getElementById('ports-status-btn-'+uuid).className = "fas fa-play-circle";
                    document.getElementById('ports-status-'+uuid).className = "badge bg-danger align-text-bottom text-white";
                }                
            }
            return true;
        })
        .catch(function (error) {
            
            return false;            
        });
    return false;
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
            return true;
        })
        .catch(function (error) {
            
            return false;            
        });
    return false;
}
