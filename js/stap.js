//Load All servers for first time
GetAllServers()

function showAddServerForm(){
    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');

    if (serverform.style.display == "none") {
      serverform.style.display = "block";
      addserver.innerHTML = "Close Add Server";
    } else {
      serverform.style.display = "none";
      addserver.innerHTML = "Add Server";
    }
}

function addServerToNode(){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");

    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    var nodeName = document.getElementById('nodenameform');
    var nodeIP = document.getElementById('nodeipform');

    serverform.style.display = "none";
    addserver.innerHTML = "Add Server";

    var urlServer = 'https://192.168.14.13:50001/v1/stap/';

    var nodejson = {};
    nodejson["nodeName"] = nodeName.value;
    nodejson["nodeIP"] = nodeIP.value;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'post',
        url: urlServer,
        timeout: 3000,
        data: nodeJSON
    })
    .then(function (response) {
        resultElement.innerHTML = generateAllServerHTMLOutput(response);
        return true;
    })
    .catch(function (error) {
        resultElement.innerHTML = generateAllServerHTMLOutput(error);
        return false;
    }); 
}

function GetAllServers() {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var node = urlWeb.searchParams.get("node");

    var tableServer = document.getElementById('servers-table');
    var subtitleBanner = document.getElementById('subtitle-servers-list');
    subtitleBanner.innerHTML = 'Servers for node: '+node;

    var urlServer = 'https://192.168.14.13:50001/v1/stap/'+uuid;

    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000
    })
    .then(function (response) {
        console.log(response.data);
        tableServer.innerHTML = generateAllServerHTMLOutput(response);
        return true;
    })
    .catch(function (error) {
        tableServer.innerHTML = generateAllServerHTMLOutput(error);
        return false;
    }); 
}

function generateAllServerHTMLOutput(response) {
    var nodes = response.data;
    var isOnline;// = false;
    var suricataStatus = false;
    var html =  '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th scope="col"></th>                                        ' +
                '<th scope="col">IP</th>                                      ' +
                '<th scope="col">Name</th>                                    ' +
                '<th scope="col">Status</th>                                  ' +
                '<th scope="col">Actions</th>                                 ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody>'
    for (node in nodes) {
  
        html = html + '<tr>                                                                     '+
            '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
                '<td class="align-middle">' + nodes[node]['name'] + '</td>'+
                '<td class="align-middle">' + nodes[node]['ip'] + '</td>'+
                '<td class="align-middle"> <span class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>'+  
                '<td class="align-middle">                                                           ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                               ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+node+'\')"></i>                          ' +
                '  </span>                                                                           ' +
                '</td>                                                                               ' +
        '</tr>                                                                                    '+
        '<tr>'+
            '<td></td>'+
            '<td class="align-middle" style="display: none;" id="hidden-servers-details-'+node+'" colspan="4" rowspan="4">         ' +
            '  <span style="color: Dodgerblue">                               ' +
            '       '+nodes[node]['bro_on']+'                          ' +
            '  </span>                                                                           ' +
            '  <span style="color: Dodgerblue">                               ' +
            '       '+nodes[node]['capture_time']+'                          ' +
            '  </span>                                                                           ' +
            '  <span style="font-size: 18px;>                               ' +
            '       '+nodes[node]['default_interface']+'                          ' +
            '  </span>                                                                           ' +
            '  <span style="font-size: 18px;>                               ' +
            '       '+nodes[node]['filter_path']+'                          ' +
            '  </span>                                                                           ' +
            '</td>                                                                               ' +
        '</tr>';
    }
    html = html + '</tbody></table>';
    return  html;
  }
  
  function loadServerDetails(node){
    console.log("----"+node);  
    var addserver = document.getElementById('hidden-servers-details-'+node);

    if (addserver.style.display == "none") {
        addserver.style.display = "block";
    } else {
        addserver.style.display = "none";
    }
  }