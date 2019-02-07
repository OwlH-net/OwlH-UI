
document.addEventListener('DOMContentLoaded', GetAllNodes(), false);

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

  axios.get('https://192.168.14.13:50001/v1/master')
    .then(function (response) {
      logAll.innerHTML = logAll.innerHTML + ' <br />  >> dentro del get - success' + response;
      resultElement.innerHTML = generateSuccessHTMLOutput(response);
    })
    .catch(function (error) {
      logAll.innerHTML = logAll.innerHTML + ' <br /> >> dentro del get - error -> ' + error;
      //resultElement.innerHTML = generateErrorHTMLOutput(error);
    });   

  logAll.innerHTML = logAll.innerHTML + '-- saliendo en get';
}

function PingNode(nid) {
  ip = "192.168.14.13"
  port = "50001"
  //alog("ping node - " + nid);
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/ping/' + nid;
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
  var resultElement = document.getElementById('nodes-table');
  //alog("Vamos a darle caña");
  axios.get('https://192.168.14.13:50001/v1/node')
    .then(function (response) {
      //alog("tenemos respuesta - todos los nodos");
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
  //alog (node);
  var nodeurl = 'https://192.168.14.13:50001/v1/node'+node;
  //alog (nodeurl)
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
  //alog ("vamos a empezar la tabla");
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
    //alog("pues vamos a crear la tabla con los nodos")
    //alog("node - " + nodes[node]['ip'] + "-" + nodes[node]['port'])
    if (nodes[node]['port'] != undefined) {
      port = nodes[node]['port'];
    } else {
      port = "10443";
    }
    var nid = nodes[node]['name'].replace(/ /gi, "-") + "-" + nodes[node]['ip'].replace(/\./gi, "-");
    //alog ("nid - " + nid);
    PingNode(nid);
    //suricataStatus = PingSuricata(nid);
    alog("isONLINE-->"+PingNode(nid));
    //online=true;
    //alog (online); 

  html = html + '<tr>                                                                     '+
      '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
      ' <td class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'           +
      ' <p class="text-muted small">' + nodes[node]['ip'] + '</p>'                        +
      '</td>'                                                                             +
      '<td class="align-middle">                                                        ';
  html = html + '<span id="'+nid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span></td>';
      html = html + ' <td class="align-middle">'+nodes[node]['milana']+'</td><td class="align-middle">';

      /*

      if (isOnline){
        
        if (nodes[node]['suricata'] != undefined) {
          html = html +'<p><img src="img/suricata.png" alt="" width="30"> '      +
          '  <span id="'+nid+'-suricata" class="badge badge-pill bg-success align-text-bottom text-white">ON</span> |' + 
          '  <span style="font-size: 15px; color: red;" >                                   ' +
          '    <i class="fas fa-stop-circle" title="Stop Suricata"></i>                     ' +
          '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
          '    <i class="fas fa-code" title="Ruleset Management"></i>                       ' +
          '  </span>                                                                        ' +
          '  </p>                                                                           '; 
        } else {
          html = html +'<p><img src="img/suricata.png" alt="" width="30"> '      +
          '  <span id="'+nid+'-suricata" class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span> |' + 
          '  <span style="font-size: 15px; color: red;" >                                   ' +
          '    <i class="fas fa-play-circle" title="Start Suricata"></i>                     ' +
          '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
          '    <i class="fas fa-code" title="Ruleset Management"></i>                       ' +
          '  </span>                                                                        ' +
          '  </p>                                                                           '; 
        }
        if (nodes[node]['bro'] != undefined) {
          html = html +' <p><img  src="img/bro.png" alt="" width="30"> <span class="badge badge-pill bg-success align-text-bottom text-white">ON</span> |                                       ' +
        '  <span style="font-size: 15px; color: red;" >                                   ' +
        '    <i class="fas fa-stop-circle" title="Stop Bro"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '    <i class="fas fa-crosshairs" title="Policy Management"></i>                  ' +
        '  </span>                                                                        ' +
        '  </p>                                                                            '; 
        } else {
          html = html +' <p><img  src="img/bro.png" alt="" width="30"> <span class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span> |                                       ' +
        '  <span style="font-size: 15px; color: red;" >                                   ' +
        '    <i class="fas fa-play-circle" title="Start Bro"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '    <i class="fas fa-crosshairs" title="Policy Management"></i>                  ' +
        '  </span>                                                                        ' +
        '  </p>                                                                            '; 
        }
        if (nodes[node]['wazuh'] != undefined) {
          html = html +'<p><img src="img/wazuh.png" alt="" width="30"> <span class="badge badge-pill bg-success align-text-bottom text-white">ON</span>                                         ' +
        '   |                                                                             ' +
        '  <span style="font-size: 15px; color: red;" >                                   ' +
        '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '  </span></p>                                                                         '; 
        } else {
          html = html +'<p><img src="img/wazuh.png" alt="" width="30"> <span class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span>                                         ' +
        '   |                                                                             ' +
        '  <span style="font-size: 15px; color: red;" >                                   ' +
        '    <i class="fas fa-play-circle" title="Start Wazuh"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '  </span></p>                                                                           '; 
        }
      } else {
        */
        html = html +'<p><img src="img/suricata.png" alt="" width="30"> '      +
        '  <span id="'+nid+'-suricata" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |' + 
        '  <span style="font-size: 15px; color: grey;" >                                   ' +
        '    <i class="fas fa-stop-circle" title="Stop Suricata"></i>                     ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '    <i class="fas fa-code" title="Ruleset Management"></i>                       ' +
        '  </span>                                                                        ' +
        '  </p>                                                                           ' +
        '  <p><img  src="img/bro.png" alt="" width="30"> <span id="'+nid+'-zeek" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                       ' +
        '  <span style="font-size: 15px; color: grey;" >                                   ' +
        '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '    <i class="fas fa-crosshairs" title="Policy Management"></i>                  ' +
        '  </span>                                                                        ' +
        '  </p>                                                                           ' +
        '    <p><img src="img/wazuh.png" alt="" width="30"> <span id="'+nid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                         ' +
        '   |                                                                             ' +
        '  <span style="font-size: 15px; color: grey;" >                                   ' +
        '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
        '    <i class="fas fa-cog" title="Configuration"></i>                             ' +
        '  </span></p> ';                      
      //}
    
    html = html +   '</td>                                                                            ' +
      '<td class="align-middle">                                                        ' +
      '  <span style="font-size: 20px; color: Dodgerblue;" >                            ' +
      '    <i class="fas fa-arrow-alt-circle-down" title="Node Status"></i>             ' +
      '    <i class="fas fa-stop-circle" title="Stop Node"></i>                         ' +
      '    <i class="fas fa-cogs" title="Configuration" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+nid+"'"+');"></i>                            ' +//icono configuration
      //'    <a href="config-node.php?nid='+nid+'&name='+name+'&port='+port+'"><i class="fas fa-cogs" title="Configuration"></i></a>           ' +
      //'    <a href="config-node.php" onclick="DeleteNode('+"'"+node+"'"+');"><i class="fas fa-cogs" title="Configuration"></i></a>           ' +
      '    <i class="fas fa-sync-alt" title="Sync"></i>                                 ' +
      '    <a style="font-size: 20px; color: Dodgerblue;" onclick="DeleteNode('+"'"+node+"'"+');"> ' +
      '      <i class="fas fa-trash-alt" title="Delete Node" ></i>                         ' +
      '    </a>                                                                            ' +
      '  </span>' +
      '</td>                                                                            ' +
      '</tr>';

  }
  html = html + '  </tbody></table>';
  return  html;
}

function PingSuricata(nid) {
  ip = "192.168.14.13"
  port = "50001"
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/suricata/' + nid;
  alog(" url -> " + nodeurl);
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      //logAll.innerHTML = logAll.innerHTML + '<br/> success';
      if (response.data.status=='false') {
        alog("suricata status FALSE==>"+nid);
        document.getElementById(nid+'-suricata').className = "badge bg-danger align-text-bottom text-white";
        document.getElementById(nid+'-suricata').innerHTML = "OFF";
      } else {
        alog("suricata info TRUE==>"+nid);
        document.getElementById(nid+'-suricata').className = "badge bg-success align-text-bottom text-white";
        document.getElementById(nid+'-suricata').innerHTML = "ON";
      }
      return true;
    })
    .catch(function (error) {
      alog("suricata info N/A==>"+nid);
      //logAll.innerHTML = logAll.innerHTML + '<br/> error >> ' + nid + ' >> ' + error;
      document.getElementById(nid+'-suricata').className = "badge bg-dark align-text-bottom text-white";
      document.getElementById(nid+'-suricata').innerHTML = "N/A";

      return false;
    });   
  return false;
}

function PingZeek(nid) {
  ip = "192.168.14.13"
  port = "50001"
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/suricata/' + nid;
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
  ip = "192.168.14.13"
  port = "50001"
  alog("ping node - " + nid);
  var nodeurl = 'https://'+ ip + ':' + port + '/v1/node/suricata/' + nid;
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