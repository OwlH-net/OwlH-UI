//document.addEventListener('DOMContentLoaded', loadJSONdata(), false);
// document.addEventListener('DOMContentLoaded', GetAllNodes(), false);

function loadJSONdata(){
  console.log("Loading JSON");
  
  $.getJSON('../conf/ui.conf', function(data) {
    console.log("getJSON");
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    GetAllNodes();   
  });
}

function showConfig(oip, oname, oport, onid){
  var cfgform = document.getElementById('divconfigform');

  //if (cfgform.style.display == "none") {
    cfgform.style.display = "block";
    var name = document.getElementById('cfgnodename');
    var ip = document.getElementById('cfgnodeip');
    var port = document.getElementById('cfgnodeport');
    var nid = document.getElementById('cfgnodeid');
    port.value = oport;
    name.value = oname;
    ip.value = oip;
    nid.value = onid;
    /*
  } else {
    cfgform.style.display = "none";
  }
  */
}

function alog(txt) {
    var logAll = document.getElementById('logAll');
    logAll.innerHTML = logAll.innerHTML + "<br/>" + txt;
}


function performGetRequest1() {
  var resultElement = document.getElementById('getResult1');
  var logAll = document.getElementById('logAll');
  logAll.innerHTML = ' >> hola';
  resultElement.innerHTML = ' -- entrando en get';

  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;

  axios.get('https://'+ipmaster+':'+portmaster+'/v1/master')
    .then(function (response) {
      logAll.innerHTML = logAll.innerHTML + ' <br />  >> inside get - success' + response;
      resultElement.innerHTML = generateSuccessHTMLOutput(response);
    })
    .catch(function (error) {
      logAll.innerHTML = logAll.innerHTML + ' <br /> >> inside get - error -> ' + error;
      //resultElement.innerHTML = generateErrorHTMLOutput(error);
    });   

  logAll.innerHTML = logAll.innerHTML + '-- get exit';
}

function PingNode(nid) {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  //alog("ping node - " + nid);
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ping/' + nid;
  //alog(" url -> " + nodeurl);
  
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> success';
      if (response.data.ping=='pong') {
        document.getElementById(nid+'-online').className = "badge bg-success align-text-bottom text-white";
        document.getElementById(nid+'-online').innerHTML = "ON LINE";
        alog("NODE STATUS ANSWER--TRUE");
        alog("isONLINE TRUE");
        PingSuricata(nid);
        PingZeek(nid);
        PingWazuh(nid);
        return "true";
      } else {
        document.getElementById(nid+'-online').className = "badge bg-danger align-text-bottom text-white";
        document.getElementById(nid+'-online').innerHTML = "OFF LINE";
        //return false;
      }
      alog("NODE STATUS ANSWER--FALSE");
      
    })
    .catch(function (error) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> error >> ' + nid + ' >> ' + error;
      document.getElementById(nid+'-online').className = "badge bg-danger align-text-bottom text-white";
      document.getElementById(nid+'-online').innerHTML = "OFF LINE";

      return "false";
    });   
  return "false";
}

function GetAllNodes() {
  console.log("Entrando en GetAllNodes");
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var resultElement = document.getElementById('nodes-table');
  var i=0;
  while(document.getElementById('ip-master').value==''){
    console.log('ip master is empty');
    console.log('-->'+document.getElementById('ip-master').value);
    setTimeout(function(){
      console.log("Waiting master");
    }, 1000);

    console.log(i);
    i++;

    if(i === 10){
      console.log("Exit");
      break;
    }
  }
  console.log('qweqwe'+ipmaster+portmaster);
  axios.get('https://'+ipmaster+':'+portmaster+'/v1/node')
  .then(function (response) {
      resultElement.innerHTML = generateAllNodesHTMLOutput(response);
    })
    .catch(function (error) {
      resultElement.innerHTML = generateAllNodesHTMLOutput(error);
    });   
}

function clearLogField() {
    var logAll = document.getElementById('logAll');
    //alog ("")
}

function DeleteNode(node) {
  var logAll = document.getElementById('logAll');
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/'+node;

  axios({
    method: 'delete',
    url: nodeurl,
    timeout: 30
  })
    .then(function (response) {
      logAll.innerHTML = logAll.innerHTML + '<br/> success';
      return true;
    })
    .catch(function (error) {
      logAll.innerHTML = logAll.innerHTML + '<br/> error - ' + ip;
      return false;
    });   
  GetAllNodes();
  return false;
}

function addNids(){
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

function generateSuccessHTMLOutput(response) {
  return  '<h4>Result</h4>' + 
          '<h5>Status:</h5> ' + 
          '<pre>' + response.status + ' ' + response.statusText + '</pre>' +
          '<h5>Headers:</h5>' + 
          '<pre>' + JSON.stringify(response.headers, null, '\t') + '</pre>' + 
          '<h5>Data:</h5>' + 
          '<pre>' + JSON.stringify(response.data, null, '\t') + '</pre>'; 
}

function generateAllNodesHTMLOutput(response) {
  var nodes = response.data;
  var isOnline;// = false;
  var suricataStatus = false;
  var html =  '<table class="table table-hover">                            ' +
              '<thead>                                                      ' +
              '<tr>                                                         ' +
              '<th scope="col"></th>                                        ' +
              '<th scope="col">Name</th>                                    ' +
              '<th scope="col">Status</th>                                  ' +
              '<th scope="col">Tags <span style="font-size: 10px;" ><a href="tags.html"><i class="fas fa-cog" title="Manage Tags"></i></a></span></th>            ' +
              '<th scope="col">Services</th>                                ' +
              '<th scope="col">Actions</th>                                 ' +
              '</tr>                                                        ' +
              '</thead>                                                     ' +
              '<tbody >'
  for (node in nodes) {
    if (nodes[node]['port'] != undefined) {
      port = nodes[node]['port'];
    } else {
      port = "10443";
    }
    var nid = node;

    PingNode(nid);
    alog("isONLINE-->"+PingNode(nid));

    getRuleUID(nid);

  html = html + '<tr>                                                                     '+
      '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
      ' <td class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'           +
      ' <p class="text-muted">' + nodes[node]['ip'] + '</p>'                        +
      ' <i class="fas fa-code" title="Ruleset Management"></i> <span id="'+nid+'-ruleset" class="text-muted small"></span>'                        +
      '</td>'                                                                             +
      '<td class="align-middle">                                                        ';
  html = html + '<span id="'+nid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span></td>';
      html = html + ' <td class="align-middle">'+nodes[node]['milana']+'</td><td class="align-middle">';
      html = html +'<p><img src="img/suricata.png" alt="" width="30"> '      +
      '  <span id="'+nid+'-suricata" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |' + 
      '  <span style="font-size: 15px; color: grey;" >                                   ' +
      '    <i class="fas fa-stop-circle" id="'+nid+'-suricata-icon" title="Stop Suricata" onclick="StopSuricata(\''+nid+'\')"></i>                     ' +
      '    <i class="fas fa-cog" title="Configuration" data-toggle="modal" data-target="#modal-change-bpf" onclick="loadBPF(\''+nid+'\')"></i> ' +
      '    <i class="fas fa-code" title="Ruleset Management" data-toggle="modal" data-target="#modal-ruleset-management" onclick="loadRuleset(\''+nid+'\')"></i>                        ' +
      '  </span>                                                                        ' +
      '  </p>                                                                           ' +
      '  <p><img  src="img/bro.png" alt="" width="30"> <span id="'+nid+'-zeek" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                       ' +
      '  <span style="font-size: 15px; color: grey;" >                                   ' +
      '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
      '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
      '    <i class="fas fa-crosshairs" title="Policy Management"></i>                  ' +
      '  </span>                                                                        ' +
      '  </p>                                                                           ' +
      '  <p><img src="img/wazuh.png" alt="" width="30"> <span id="'+nid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                         ' +
      '   |                                                                             ' +
      '  <span style="font-size: 15px; color: grey;" >                                  ' +
      '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
      '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
      '  </span></p> '+
      '  <p><i class="fas fa-plug fa-lg"></i>   <span id="'+nid+'-softtap" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                         ' +
      '   |                                                                             ' +
      '  <span style="font-size: 15px; color: grey;">                                   ' +
      '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
      '    <a href="stap.html?uuid='+nid+'&node='+nodes[node]['name']+'"><i class="fas fa-cog" title="Configuration" style="color: grey;"></i><a>                             ' +
      '  </span></p> ';                      
      html = html +   '</td>                                                              ' +
      '<td class="align-middle">                                                        ' +
      '  <span style="font-size: 20px; color: Dodgerblue;" >                            ' +
      '    <a href="files.html?uuid='+node+'&node='+nodes[node]['name']+'"><i class="fas fa-arrow-alt-circle-down" title="Node Status"></i></a>             ' +
      '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
      '    <i class="fas fa-cogs" title="Configuration" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+nid+"'"+');"></i>                            ' +
      '    <i class="fas fa-sync-alt" title="Sync" onclick="sendRulesetToNode('+"'"+nid+"'"+')"></i>                                 ' +
      '    <a href="edit.html?uuid='+node+'&file=main.conf&node='+nodes[node]['name']+'" style="font-size: 20px; color: Dodgerblue;"><i class="fas fa-cog" title="Edit file"></i></a>           ' +
      '    <a style="font-size: 20px; color: Dodgerblue;" onclick="DeleteNode('+"'"+node+"'"+');"> ' +
      '      <i class="fas fa-trash-alt" title="Delete Node" ></i>                         ' +
      '    </a>                                                                            ' +
      '  </span>                                                                           ' +
      '</td>                                                                               ' +
      '</tr>';

  }
  html = html + '</tbody></table>';
  return  html;
}

function sendRulesetToNode(nid){
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/ruleset/set/' + nid;
  alog(" url -> " + nodeurl);
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

//Run suricata system
function RunSuricata(nid){
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/RunSuricata/' + nid;
  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      console.log("Launch suricata");
      // GetAllNodes();
    })
    .catch(function error(){
      console.log(error);
    });

  GetAllNodes();
}

//Stop suricata system
function StopSuricata(nid){
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/StopSuricata/' + nid;
  axios({
    method: 'put',
    url: nodeurl,
    timeout: 30000,
  })
    .then(function (response) {
      console.log("Kill Suricata service");
      GetAllNodes();
    })
    .catch(function error(){
      console.log(error);
    });
}

function PingSuricata(nid) {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/suricata/' + nid;
  alog(" url -> " + nodeurl);
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      console.log("bin--"+response.data.bin);
      console.log("path--"+response.data.path);
      console.log("running--"+response.data.running);

      if (!response.data.path && !response.data.bin) {
        console.log("!path && !bin");
        alog("suricata status N/A==>"+nid);
        document.getElementById(nid+'-suricata').className = "badge bg-dark align-text-bottom text-white";
        document.getElementById(nid+'-suricata').innerHTML = "N/A";
        document.getElementById(nid+'-suricata-icon').className = "fas fa-play-circle";
        document.getElementById(nid+'-suricata-icon').onclick = function(){ RunSuricata(nid);};
        document.getElementById(nid+'-suricata-icon').title = "Run Suricata";
      } else if (response.data.path || response.data.bin){
        console.log("path && bin");
        if(response.data.running){
          console.log("running");
          document.getElementById(nid+'-suricata').className = "badge bg-success align-text-bottom text-white";
          document.getElementById(nid+'-suricata').innerHTML = "ON";
          document.getElementById(nid+'-suricata-icon').className = "fas fa-stop-circle";
          document.getElementById(nid+'-suricata-icon').onclick = function(){ StopSuricata(nid);};
          document.getElementById(nid+'-suricata-icon').title = "Stop Suricata";
        }else{
          console.log("!running");
          document.getElementById(nid+'-suricata').className = "badge bg-danger align-text-bottom text-white";
          document.getElementById(nid+'-suricata').innerHTML = "OFF";
          document.getElementById(nid+'-suricata-icon').className = "fas fa-play-circle";
          document.getElementById(nid+'-suricata-icon').onclick = function(){ RunSuricata(nid);};
          document.getElementById(nid+'-suricata-icon').title = "Run Suricata";
        }
      }
      return true;
    })
    .catch(function (error) {
      alog("suricata info N/A==>"+nid);
      document.getElementById(nid+'-suricata').className = "badge bg-dark align-text-bottom text-white";
      document.getElementById(nid+'-suricata').innerHTML = "N/A";

      return false;
    });   
  return false;
}

function PingZeek(nid) {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/zeek/' + nid;
  alog(" url -> " + nodeurl);
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> success';
      if (response.data.status=='false') {
        alog("zeek status FALSE==>"+nid);
        document.getElementById(nid+'-zeek').className = "badge bg-danger align-text-bottom text-white";
        document.getElementById(nid+'-zeek').innerHTML = "OFF";
      } else {
        alog("zeek info TRUE==>"+nid);
        document.getElementById(nid+'-zeek').className = "badge bg-success align-text-bottom text-white";
        document.getElementById(nid+'-zeek').innerHTML = "ON";
      }
      return true;
    })
    .catch(function (error) {
      alog("zeek info N/A==>"+nid);
      //logAll.innerHTML = logAll.innerHTML + '<br/> error >> ' + nid + ' >> ' + error;
      document.getElementById(nid+'-zeek').className = "badge bg-dark align-text-bottom text-white";
      document.getElementById(nid+'-zeek').innerHTML = "N/A";

      return false;
    });   
  return false;
}

function PingWazuh(nid) {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/wazuh/' + nid;
  alog(" url -> " + nodeurl);
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> success';
      if (response.data.status=='false') {
        alog("wazuh status FALSE==>"+nid);
        document.getElementById(nid+'-wazuh').className = "badge bg-danger align-text-bottom text-white";
        document.getElementById(nid+'-wazuh').innerHTML = "OFF";
      } else {
        alog("wazuh info TRUE==>"+nid);
        document.getElementById(nid+'-wazuh').className = "badge bg-success align-text-bottom text-white";
        document.getElementById(nid+'-wazuh').innerHTML = "ON";
      }
      return true;
    })
    .catch(function (error) {
      alog("wazuh info N/A==>"+nid);
      //logAll.innerHTML = logAll.innerHTML + '<br/> error >> ' + nid + ' >> ' + error;
      document.getElementById(nid+'-wazuh').className = "badge bg-dark align-text-bottom text-white";
      document.getElementById(nid+'-wazuh').innerHTML = "N/A";

      return false;
    });   
  return false;
  //comment
}

function getRuleUID(nid){
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/get/' + nid;
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })    
    .then(function (response) {
      getRuleName(response.data, nid);
      return true;
    })
    .catch(function (error) {
      return false;
    }); 
}

function getRuleName(uuid, nid){
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/ruleset/get/name/' + uuid;
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })    
    .then(function (response) {
      document.getElementById(nid+'-ruleset').innerHTML = response.data;
      return response.data;
    })
    .catch(function (error) {
      return false;
    }); 
}

//load json data from local file
loadJSONdata();