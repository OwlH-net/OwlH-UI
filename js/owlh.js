function showConfig(oip, oname, oport, ouuid){
    var cfgform = document.getElementById('divconfigform');
    cfgform.style.display = "block";
    var name = document.getElementById('cfgnodename');
    var ip = document.getElementById('cfgnodeip');
    var port = document.getElementById('cfgnodeport');
    var uuid = document.getElementById('cfgnodeid');
    port.value = oport;
    name.value = oname;
    ip.value = oip;
    uuid.value = ouuid;
}

function PingNode(uuid) {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ping/' + uuid;
  
  axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
            if (response.data.ping=='pong') {
                document.getElementById(uuid+'-online').className = "badge bg-success align-text-bottom text-white";
                document.getElementById(uuid+'-online').innerHTML = "ON LINE";
                PingService(uuid);
                PingSuricata(uuid);
                PingZeek(uuid);
                PingWazuh(uuid);
                PingStap(uuid);
                PingPorts(uuid);
                PingAnalyzer(uuid);
                PingCollector(uuid);
                PingCheckDeploy(uuid);
                PingDataflow(uuid);
                return "true";
            } else {
                document.getElementById(uuid+'-online').className = "badge bg-danger align-text-bottom text-white";
                document.getElementById(uuid+'-online').innerHTML = "OFF LINE";
            }      
        })
            .catch(function (error) {
            return "false";
        });   
    return "false";
}

function PingService(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingservice/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
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

function DeployService(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/deployservice/'+uuid;
    axios({
        method: 'put',
        url: nodeurl,
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
    document.getElementById('addnids').style.display = "none";


    //    var instance = axios.create({
    //     baseURL: 'https://' + ipmaster + ':' + portmaster + '/v1/node',
    //     httpsAgent: new https.Agent({
    //         rejectUnauthorized: false   
    //     })
    // });

    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/node', {
            params: { 
                // rejectUnauthorized: false 
            }
        })
        .then(function (response) {
            document.getElementById('addnids').style.display = "block";
            resultElement.innerHTML = generateAllNodesHTMLOutput(response);
        })
        .catch(function (error) {
            resultElement.innerHTML = '<h3 align="center">No connection</h3>'+
                '<a id="check-status-config" href="" class="btn btn-success float-right" target="_blank">Check Master API connection</a> ';
                checkStatus();
        });
}

function deleteNode(node) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/'+node;
    axios({
        method: 'delete',
        url: nodeurl,
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
    var addnids = document.getElementById('addnids');
    var nform = document.getElementById('nidsform');

    if (nform.style.display == "none") {
        nform.style.display = "block";
        addnids.innerHTML = "Close Add NIDS";
    } else {
        nform.style.display = "none";
        addnids.innerHTML = "Add NIDS";
    }
}

function generateAllNodesHTMLOutput(response) {
    if (response.data.ack == "false") {
        return '<div style="text-align:center"><h3 style="color:red;">Error retrieving all nodes data</h3></div>';
    }  
    var isEmpty = true;
    var nodes = response.data;
    var html =  '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th scope="col"></th>                                        ' +
                '<th scope="col">Name</th>                                    ' +
                '<th scope="col">Status</th>                                  ' +
                '<th scope="col"></th>                                ' +
                '<th scope="col"></th>                                 ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >'
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

        html = html + '<tr>                                                                     '+
            '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
            '   <td class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'           +
                '   <p class="text-muted">' + nodes[node]['ip'] + '</p>'                        +
                '   <i class="fas fa-code" title="Ruleset Management"></i> <span id="'+uuid+'-ruleset" class="text-muted small"></span>'+
                '   <br><br>'+
                '   <span id="'+uuid+'-owlhservice" style="display:none; font-size: 15px; cursor: default;" class="col-md-4 badge bg-warning align-text-bottom text-white" onclick="DeployService(\''+uuid+'\')">Install service</span>'+
            '   </td>' +
            '<td class="align-middle">                                                        ';
        html = html + '<span id="'+uuid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span></td>'+
            '<td class="align-middle">'+
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'network-ids\',\''+uuid+'\')"><b>Network IDS</b> <i class="fas fa-sort-down" id="network-ids-form-icon-'+uuid+'"></i></h6>'+
            '<span id="network-ids-form-'+uuid+'" style="display:None">'+
                '<p><img src="img/suricata.png" alt="" width="30"> '      +
                '  <span id="'+uuid+'-suricata" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |' + 
                '  <span style="font-size: 15px; color: grey;" >                                   ' +
                '    <i class="fas fa-stop-circle" id="'+uuid+'-suricata-icon" title="Stop Suricata" onclick="StopSuricata(\''+uuid+'\')"></i>                     ' +
                '    <i class="fas fa-sync-alt" title="Deploy ruleset" data-toggle="modal" data-target="#modal-window" onclick="syncRulesetModal(\''+uuid+'\',\''+nodes[node]['name']+'\')"></i>                                 ' +
                '    <i title="Configuration" style="cursor: default;" data-toggle="modal" data-target="#modal-window" onclick="loadBPF(\''+uuid+'\',\''+nodes[node]['name']+'\')">BPF</i>'+
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
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'transport\',\''+uuid+'\')"><b>Transport</b> <i class="fas fa-sort-down" id="transport-form-icon-'+uuid+'"></i></h6>'+                                                                        
            '<span id="transport-form-'+uuid+'" style="display:None">'+
                '  <p><img src="img/wazuh.png" alt="" width="30"> '+
                '  <span id="'+uuid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                        ' +
                '  <span style="font-size: 15px; color: grey;" >                                  ' +
                '    <i class="fas fa-stop-circle" id="'+uuid+'-wazuh-icon"></i>                         ' +
                '  </span></p> '+
            '</span>'+
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'plugins\',\''+uuid+'\')"><b>Plugins</b> <i class="fas fa-sort-down" id="plugins-form-icon-'+uuid+'"></i></h6>'+
            '<span id="plugins-form-'+uuid+'" style="display:None">'+
                '  <p><i class="fas fa-plug fa-lg"></i>'+
                '  <span id="'+uuid+'-stap" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                         ' +
                '  <span style="font-size: 15px; color: grey;">                                   ' +
                '    <i class="fas fa-stop-circle" id="'+uuid+'-stap-icon"></i>                         ' +
                '    <i class="fas fa-cog" title="Configuration" style="color: grey;" onclick="loadStapURL(\''+uuid+'\', \''+nodes[node]['name']+'\')"></i>                             ' +
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
                '    <i class="fas fa-info-circle" title="Edit analyzer" onclick="editAnalyzer(\''+uuid+'\', \'analyzer\', \''+nodes[node]['name']+'\')"></i>  ' +
                '  </span></p> '+ 
            '</span>'+ 

            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'flow\',\''+uuid+'\')"><b>Traffic flow</b> <i class="fas fa-sort-down" id="flow-form-icon-'+uuid+'"></i></h6>'+
            '<span id="flow-form-'+uuid+'" style="display:None">'+
                '<table>'+
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
                            '<label class="custom-control-label" for="collect-socket-pcap">Socket -> PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')" style="color:grey;" title="Collector information"></i>'+
                        '</div>'+
                        '<div class="custom-control custom-radio">'+
                        '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'socket-network\', \''+uuid+'\')" id="collect-socket-network" name="network" value="socket-network" class="custom-control-input">'+
                            '<label class="custom-control-label" for="collect-socket-network">Socket -> Network</label> <i class="fas fa-info-circle" data-toggle="modal" data-target="#modal-window" onclick="socketToNetwork(\''+node+'\')" style="color:grey;" title="Socket to Network information"></i>'+
                        '</div>'+
                        '<div class="custom-control custom-radio">'+
                        '<input type="radio" onclick="changeDataflowValues(\'collect\', \'value\', \'pcap-network\', \''+uuid+'\')" id="collect-pcap-network" name="network" value="pcap-network" class="custom-control-input">'+
                            '<label class="custom-control-label" for="collect-pcap-network">PCAP -> Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')" style="color:grey;"title="Collector information"></i>'+
                        '</div>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;">'+
                        '<div class="custom-control custom-radio">'+
                        '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'network\', \''+uuid+'\')" id="analysis-network" name="analysis" value="network" class="custom-control-input">'+
                            '<label class="custom-control-label" for="analysis-network">Network</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')" style="color:grey;"title="Collector information"></i>'+
                        '</div>'+
                        '<div class="custom-control custom-radio">'+
                        '<input type="radio" onclick="changeDataflowValues(\'analysis\', \'value\', \'pcap\', \''+uuid+'\')" id="analysis-pcap" name="analysis" value="pcap" class="custom-control-input">'+
                            '<label class="custom-control-label" for="analysis-pcap">PCAP</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')" style="color:grey;" title="Collector information"></i>'+
                        '</div>'+
                    '</td>'+
                    '<td style="word-wrap: break-word;">'+
                        '<div class="custom-control custom-radio">'+
                            '<input type="radio" onclick="changeDataflowValues(\'transport\', \'value\', \'wazuh\', \''+uuid+'\')" id="transport-wazuh" name="transport" value="wazuh" class="custom-control-input">'+
                            '<label class="custom-control-label" for="transport-wazuh">Wazuh</label> <i class="fas fa-info-circle" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')" style="color:grey;" title="Collector information"></i>'+
                        '</div>'+                    
                    '</td>'+
                    '<td style="word-wrap: break-word;"></td>'+
                    '</tr>'+
                '</tbody>' +
                    
                '</table>'+
            '</span>'+

            '</td>                                                            ' +
            '<td class="align-middle"> '+
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'actions\',\''+uuid+'\')"><b>Actions</b> <i class="fas fa-sort-down" id="actions-form-icon-'+uuid+'"></i></h6>'+
            '<span id="actions-form-'+uuid+'" style="display:None" color>'+                                                       
                '<span style="font-size: 15px; color: Dodgerblue;" >                            ' +
                '<i class="fas fa-arrow-alt-circle-down" title="See node files" onclick="loadFilesURL(\''+uuid+'\', \''+nodes[node]['name']+'\')"></i> | See node files             ' +
                '<br><i class="fas fa-cogs" title="Modify node details" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+uuid+"'"+');"></i> | Modify node                            ' +
                '<br><i class="fas fa-cog" title="Edit node configuration" onclick="loadEditURL(\''+node+'\', \'main.conf\', \''+nodes[node]['name']+'\')"></i> | Edit node configuration           ' +
                '<br><i class="fas fa-trash-alt" style="color: red;" title="Delete Node" data-toggle="modal" data-target="#modal-window" onclick="deleteNodeModal('+"'"+node+"'"+', '+"'"+nodes[node]['name']+"'"+');"></i> | Delete node                         ' +
                '</span>'+
            '</span>'+
            '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'deploy\',\''+uuid+'\')"><b>Deploy</b> <i class="fas fa-sort-down" id="deploy-form-icon-'+uuid+'"></i></h6>'+
            '<span id="deploy-form-'+uuid+'" style="display:None">'+
                '<span style="font-size: 15px; color: Dodgerblue;">'+
                    '<p id="deploy-node-suricata"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Suricata &nbsp; | '+
                    '    <i class="fas fa-play-circle" title="Deploy Suricata" id="suricata-deploy-button" onclick="deployNode(\'suricata\', \''+uuid+'\', \''+nodes[node]['name']+'\')"></i></p>                         ' +
                    '<p id="deploy-node-zeek"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; Zeek &nbsp; | '+
                    '    <i class="fas fa-play-circle" title="Deploy Zeek" onclick="deployNode(\'zeek\', \''+uuid+'\', \''+nodes[node]['name']+'\')"></i></p>                         ' +
                    '<p id="deploy-node-moloch"><i style="color: Dodgerblue;" class="fas fa-search"></i> &nbsp; Moloch &nbsp; | '+
                    '    <i class="fas fa-play-circle" title="Deploy Moloch" onclick="deployNode(\'moloch\', \''+uuid+'\', \''+nodes[node]['name']+'\')"></i></p>                         ' +
                    '<p id="deploy-node-interface"><i style="color: Dodgerblue;" class="fas fa-project-diagram"></i> &nbsp; OwlH interface &nbsp; | '+
                    '    <i class="fas fa-play-circle" title="Deploy OwlH interface" onclick="deployNode(\'interface\', \''+uuid+'\', \''+nodes[node]['name']+'\')"></i></p>                         ' +
                    '<p id="deploy-node-firewall"><i style="color: Dodgerblue;" class="fas fa-traffic-light"></i> &nbsp; OwlH firewall &nbsp; | '+
                    '    <i class="fas fa-play-circle" title="Deploy OwlH firewall" onclick="deployNode(\'firewall\', \''+uuid+'\', \''+nodes[node]['name']+'\')"></i></p>                         ' +
                '</span>'+
            '  </span>                                                                           ' +
            '</td>                                                                               ' +
            '</tr>';
    }
    html = html + '</tbody></table>';
    if (isEmpty){
        return '<div style="text-align:center"><h3>No nodes created. You can create a node now!</h3></div>';
    }else{
        return  html;
    }
}

function loadNetworkValues(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValues/'+uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        var html = '<div class="modal-dialog">'+
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
              '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
              if (response.data.ack != "false"){
                  html = html + '<a class="btn btn-success" data-toggle="modal" data-target="#modal-window1" id="btn-new-local">New local</a>'+
                  '<a class="btn btn-success" data-toggle="modal" data-target="#modal-window2" id="btn-new-vxlan">New VxLAN</a>'+
                  '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-delete-node" onclick="updateNetworkInterface(\''+uuid+'\')">Deploy</button>';
              }
            html = html + '</div>'+
    
          '</div>'+
        '</div>'+

        //Modal for new local
        '<div class="modal fade" id="modal-window1">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                
                '<div class="modal-header">'+
                    '<h4 class="modal-title" id="delete-node-header">New Local</h4>'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
            
                '<div class="modal-body">'+ 
                    '<form>'+
                        '<div class="form-group row">'+
                            '<label for="listenPortNewLocal" class="ml-4 col-form-label align-middle">Interface Name: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="listenPortNewLocal" value="owlh">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="certificateNewLocal" class="ml-4 col-form-label">MTU: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="certificateNewLocal" value="65535">'+
                        '</div>'+
                    '</form>'+
                '</div>'+
            
                '<div class="modal-footer" id="delete-node-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" id="btn-new-local-close" >Close</button>'+
                    '<button type="submit" class="btn btn-primary" id="btn-new-local-ok" onclick="saveNewLocal(\''+uuid+'\')">Deploy</button>'+
                '</div>'+
            
                '</div>'+
            '</div>'+
        '</div>'+

        //Modal for new VxLAN
        '<div class="modal fade" id="modal-window2">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                
                '<div class="modal-header">'+
                    '<h4 class="modal-title" id="delete-node-header">New Local</h4>'+
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
            
                '<div class="modal-body">'+ 
                    '<form>'+
                        '<div class="form-group row">'+
                            '<label for="ifaceNameVxLAN" class="ml-4 col-form-label align-middle">Interface Name: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="ifaceNameVxLAN" value="owlh">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="VxLANid" class="ml-4 col-form-label">VxLAN ID: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="VxLANid" value="vxlan0">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="locaIPVxLAN" class="ml-4 col-form-label">Local IP: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="locaIPVxLAN" value="1.1.1.1">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="portVxLAN" class="ml-4 col-form-label">Port: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="portVxLAN" value="4785">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="baseInterfaceVxLAN" class="ml-4 col-form-label">Base Interface: </label>'+
                            '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                // '<thead>              ' +
                                //     '<tr>                 ' +
                                //         '<th>Network</th>        ' +
                                //         '<th>Select</th>     ' +
                                //     '</tr>                ' +
                                // '</thead>             ' +
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
                            '</table>'+
                        '</div>'+
                    '</form>'+
                '</div>'+
            
                '<div class="modal-footer" id="delete-node-footer-btn">'+
                    '<button type="button" class="btn btn-secondary" id="btn-vxlan-close" >Close</button>'+
                    '<button type="submit" class="btn btn-primary" id="btn-vxlan-ok" onclick="saveVxLAN(\''+uuid+'\')">Deploy</button>'+
                '</div>'+
            
                '</div>'+
            '</div>'+
        '</div>';

        document.getElementById('modal-window').innerHTML = html;
        LoadNetworkValuesSelected(uuid);
        //load dataflow values for secondary modals
        axios.get('https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid)
        .then(function (response) {
            console.log(response.data);
            document.getElementById('listenPortNewLocal').value = response.data["newlocal"]["name"];
            document.getElementById('certificateNewLocal').value = response.data["newlocal"]["cert"];
            document.getElementById('ifaceNameVxLAN').value = response.data["vxlan"]["name"];
            document.getElementById('VxLANid').value = response.data["vxlan"]["vxlanID"];
            document.getElementById('locaIPVxLAN').value = response.data["vxlan"]["localIp"];
            document.getElementById('portVxLAN').value = response.data["vxlan"]["portIp"];
            document.getElementById('baseInterfaceVxLAN').value = response.data["vxlan"]["baseIface"];
        })

        //jQuery for close secondary modal
        $('#btn-new-local-close').click(function(){ $('#modal-window1').modal('toggle');  });
        $('#btn-new-local-ok').click(function(){ $('#modal-window1').modal('toggle'); });
        $('#btn-vxlan-close').click(function(){ $('#modal-window2').modal('toggle');  });
        $('#btn-vxlan-ok').click(function(){ $('#modal-window2').modal('toggle');  });
    })
    .catch(function (error) {
    });
}

function saveNewLocal(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveNewLocal';

    var jsonPorts = {}
    jsonPorts["uuid"] = uuid;
    jsonPorts["listenPortNewLocal"] = document.getElementById('listenPortNewLocal').value;
    jsonPorts["certificate"] = document.getElementById('certificateNewLocal').value;
    var dataJSON = JSON.stringify(jsonPorts);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
    })
    .catch(function (error) {
    });
}

function saveVxLAN(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveNewLocal';

    var jsonPorts = {}
    jsonPorts["uuid"] = uuid;
    jsonPorts["interface"] = document.getElementById('ifaceNameVxLAN').value;
    jsonPorts["lanIp"] = document.getElementById('VxLANid').value;
    jsonPorts["localIp"] = document.getElementById('locaIPVxLAN').value;
    jsonPorts["portIp"] = document.getElementById('portVxLAN').value;
    jsonPorts["baseInterface"] = document.getElementById('baseInterfaceVxLAN').value;
    var dataJSON = JSON.stringify(jsonPorts);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
    })
    .catch(function (error) {
    });
}


function LoadNetworkValuesSelected(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadNetworkValuesSelected/'+uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        document.getElementById('net-value-'+response.data[uuid]["interface"]).checked = "true";
    })
    .catch(function (error) {
    });
}

function socketToNetwork(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/loadDataflowValues/'+uuid;

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        var modalWindow = document.getElementById('modal-window');
        modalWindow.innerHTML = 
        '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            
                '<div class="modal-header">'+
                '<h4 class="modal-title">Socket to Network</h4>'+
                '<button type="button" class="close" data-dismiss="modal">&times;</button>'+
                '</div>'+
        
                '<div class="modal-body">'+ 
                    '<form>'+
                        '<div class="form-group row">'+
                            '<label for="listenPort" class="ml-4 col-form-label align-middle">Listen port: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="listenPort" value="'+response.data["sockettonetwork"]["port"]+'">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="certificate" class="ml-4 col-form-label">Cert: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="certificate" value="'+response.data["sockettonetwork"]["cert"]+'">'+
                        '</div>'+
                        '<br>'+
                        '<div class="form-group row">'+
                            '<label for="interface" class="ml-4 col-form-label">Interface: </label>'+
                            '<input type="text" class="ml-4 mr-4 form-control" id="interface" value="'+response.data["sockettonetwork"]["interface"]+'">'+
                        '</div>'+
                '</div>'+
        
                '<div class="modal-footer">'+
                    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
                    '<button type="submit" class="btn btn-primary" data-dismiss="modal" id="btn-delete-node" onclick="saveSocketToNetwork(\''+uuid+'\')">Save</button>'+
                '</div>'+
        
            '</div>'+
        '</div>';
        return response.data;
    })
    .catch(function (error) {
    });
}

function saveSocketToNetwork(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/saveSocketToNetwork';
    
    var jsonDeploy = {}
    jsonDeploy["cert"] = document.getElementById('certificate').value;
    jsonDeploy["interface"] = document.getElementById('interface').value;
    jsonDeploy["port"] = document.getElementById('listenPort').value;
    jsonDeploy["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeploy);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
    })
    .catch(function (error) {
    });
}

function updateNetworkInterface(uuid){
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
    })
    .catch(function (error) {
    });
}

function changeDataflowValues(FlowUUID, param, value, uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/changeDataflowValues';
    var jsonDeploy = {}
    jsonDeploy["FlowUUID"] = FlowUUID;
    jsonDeploy["value"] = value;
    jsonDeploy["param"] = param;
    jsonDeploy["uuid"] = uuid;
    var dataJSON = JSON.stringify(jsonDeploy);

    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        GetAllNodes();
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
        for (flow in response.data){
            document.getElementById(flow+'-'+response.data[flow]["value"]).checked = "true";
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

function showMasterFile(file){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit-master.html?file='+file;
}

function editAnalyzer(uuid, file, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+file+'&node='+nodeName;
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
function loadEditURL(uuid, nodeName){
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/edit.html?uuid='+uuid+'&file='+nodeName+'&node='+nodeName;
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
        GetAllNodes()
    })
    .catch(function (error) {
    });
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
        GetAllNodes()
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
        GetAllNodes()
    })
    .catch(function (error) {
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
    var html = '<div class="modal-dialog modal-xlg">'+
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

// function showModalPorts(response, uuid){
//     var html = '<div class="modal-dialog modal-lg">'+
//         '<div class="modal-content">'+
    
//             '<div class="modal-header">'+
//                 '<h4 class="modal-title">Ports</h4>'+
//                 '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
//                     '<span aria-hidden="true">&times;</span>'+
//                 '</button>'+
//             '</div>'+

//             '<div class="modal-body">';

//                 if(response.data.ack=="false"){
//                     console.log(response.data.ack);
//                     htlm = html + '<h4 class="modal-title" style="color:red;">Error retrieving ports...</h4>';
//                 }else{
//                     console.log(response);
//                     htlm = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
//                             '<thead>                                                      ' +
//                                 '<tr>                                                         ' +
//                                     '<th width="30%">Portproto</th>                                    ' +
//                                     '<th>First</th>                                         ' +
//                                     '<th>Last</th>                                 ' +
//                                     '<th width="10%">Select</th>                                 ' +
//                                 '</tr>                                                        ' +
//                             '</thead>                                                     ' +
//                             '<tbody>                                                     ' ;
//                                 for(line in response.data){
//                                     var first = new Date(response.data[line]["first"]*1000);
//                                     var last = new Date(response.data[line]["last"]*1000);
                                    
//                                     html = html + '<tr><td>                            ' +
//                                     response.data[line]["portprot"]+
//                                     '</td><td>'+
//                                     first+
//                                     '</td><td>'+
//                                     last+
//                                     '</td><td align="center">'+
//                                         '<input class="form-check-input" type="checkbox" id="'+line+'"></input>'+
//                                     '</td></tr>';
//                                 }
//                             html = html +'</tbody>'+
//                         '</table>';
//                 }
//             html = html +'</div>'+

//             '<div class="modal-footer" id="ruleset-note-footer-btn">'+
//                 '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
//                 '<button type="button" class="btn btn-dark" data-dismiss="modal" onclick="deleteAllPorts(\''+uuid+'\')">Delete all</button>' +
//                 '<button type="button" class="btn btn-primary" data-dismiss="modal" onclick="deletePorts(\''+uuid+'\')">Delete</button>' +
//             '</div>'+


//         '</div>'+
//     '</div>';
    
//     document.getElementById('modal-window').innerHTML = html;
// }

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
            // GetAllNodes();
        })
        .catch(function error() {
        });

    setTimeout(function (){
        GetAllNodes();
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
            // GetAllNodes();
        })
        .catch(function error() {
        });

    setTimeout(function (){
        GetAllNodes();
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
                // document.getElementById('suricata-deploy-button').onclick = function () { };                
                // document.getElementById('suricata-deploy-button').style.color = "grey";                
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

function PingCheckDeploy(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/checkDeploy/'+uuid;
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        for(deploy in response.data){
            if(response.data[deploy] == "false"){
                document.getElementById('deploy-node-'+deploy).style.display = "none";
            }else{
                document.getElementById('deploy-node-'+deploy).style.display = "block";
            }
        }        
    })
    .catch(function (error) {

    });
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

    GetAllNodes();
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

    GetAllNodes();
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

    GetAllNodes();
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

    GetAllNodes();
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
    GetAllNodes();
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
    GetAllNodes();
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


function getRulesetUID(uuid) {
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/ruleset/get/' + uuid;
    axios({
        method: 'get',
        url: nodeurl,
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

//load json data from local file
function loadJSONdata() {
    $.getJSON('../conf/ui.conf', function (data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadTitleJSONdata();
        GetAllNodes();
    });
}
loadJSONdata();