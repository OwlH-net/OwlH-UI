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

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
  
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/';

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

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/'+uuid;

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
    var servers = response.data;
    var isOnline;// = false;
    var suricataStatus = false;
    var html =  
        '<div class="container" id="servers-detail" style="display:none;">           ' +                                                                         
        '</div>                                                    ' +                                                                          
            '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                    '<tr>                                                         ' +
                        '<th scope="col"></th>                                        ' +
                        '<th scope="col">IP</th>                                      ' +
                        '<th scope="col">Name</th>                                    ' +
                        '<th scope="col">Status</th>                                  ' +
                        '<th scope="col">Actions</th>                                 ' +
                    '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody>                                                      ' ;

    for (server in servers) {
  
        html = html + 
        '<tr>                                                                     '+
            '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
            '<td class="align-middle">' + servers[server]['ip'] + '</td>'+
            '<td class="align-middle">' + servers[server]['name'] + '</td>'+
            '<td class="align-middle"> <span class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>'+  
            '<td class="align-middle">                                                           ' +
            '  <span style="font-size: 20px; color: Dodgerblue;" >                               ' +
            '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                          ' +
            '  </span>                                                                           ' +
            '</td>                                                                               ' +
        '</tr>                                                                                   ' ;
    }
    html = html + '</tbody></table>';
    return  html;
  }
  
  function loadServerDetails(server){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var addserver = document.getElementById('servers-detail');

    if (addserver.style.display == "none") {
        addserver.style.display = "block";
    } else {
        addserver.style.display = "none";
    }

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var urlServer = 'https://'+ipmaster+':'+portmaster+'/v1/stap/server/'+uuid+"/"+server;
    axios({
        method: 'get',
        url: urlServer,
        timeout: 30000
    })
    .then(function (response) {
        serverData = response.data[server]; 
        var htmDetails =
        '<h3 class="mb-0 low-blue lh-100">'+response.data[server]['name']+' server details</h3>                                                              '+
        '<table class="table table-hover">                                      ' +    
            '<thead>                                                            '+
                '<tr>                                                         ' +
                    '<th scope="col">Param</th>                                    ' +
                    '<th scope="col">Value</th>                                  ' +
                    '<th scope="col" colspan="15%">Actions</th>                                 ' +
                '</tr>                                                        ' +
            '</thead>                                                                           '+
            '</tbody>                                                                   ';
                for (nameDetail in response.data[server]){                                                                        
                    htmDetails = htmDetails +
                    '<tr>                                                                                                   ' +
                        '<td id class="align-middle">'+nameDetail+'</td>                                                    ' +
                        '<td id class="align-middle" >'+response.data[server][nameDetail]+'</td>                            ' +
                        '<td><i class="fas fa-sticky-note low-blue" title="Edit"></i></td>                                  ' +
                    '</tr>                                                                                                  ' ;
                }
            htmDetails = htmDetails +
            '</tbody>                                                                                                   ' +
        '</table>                                                                                                       ' ;    
        addserver.innerHTML = htmDetails
        return true;   
    })
    .catch(function (error) {
        console.log(error);
        return false;
    }); 
  }

  function loadJSONdata(){
    console.log("Loading JSON");
    $.getJSON('../conf/ui.conf', function(data) {
      console.log("getJSON");
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      GetAllServers();   
    });
  }
  loadJSONdata();