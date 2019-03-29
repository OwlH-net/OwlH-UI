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
    GetAllServers();
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
        PingStapServer(server);
        html = html + 
        '<tr>                                                                     '+
            '<th class="align-middle" scope="row"><img data-src="holder.js/16x16?theme=thumb&bg=007bff&fg=007bff&size=1" alt="" class="mr-2 rounded"></th>' +
            '<td class="align-middle">' + servers[server]['ip'] + '</td>'+
            '<td class="align-middle">' + servers[server]['name'] + '</td>'+
        //     console.log("Server :"+server+"  ^^^^  "+servers[server]['status']+" -- "+servers[server]['ip']+"  --  "+servers[server]['name']);
        //    if (servers[server]['status'] == "true"){
                // html = html + '<td class="align-middle"> <span class="badge badge-pill bg-success align-text-bottom text-white">ON</span>              '+
                '<td class="align-middle"> <span id="'+server+'-server-stap" class="badge badge-pill bg-success align-text-bottom text-white">ON</span>              '+
                '<td class="align-middle">                                                                                                             ' +
                '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
                '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
                '       <i class="fas fa-stop-circle low-blue" title="Stop server" id="'+server+'-server-icon-stap" onclick="StopStapServer(\''+server+'\')"></i>                       ' +
                '  </span>                                                                                                                             ' +
                '</td>' ;
            // }else if (servers[server]['status'] == "false"){
            //     html = html + '<td class="align-middle"> <span class="badge badge-pill bg-danger align-text-bottom text-white">OFF</span>              ' +
            //     '<td class="align-middle">                                                                                                             ' +
            //     '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                 ' +
            //     '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                           ' +
            //     '       <i class="fas fa-play-circle low-blue" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>                         ' +
            //     '  </span>                                                                                                                             ' +
            //     '</td>' ;
            // }else if(servers[server]['status']){
            //     html = html + 
            //     '<td class="align-middle"> '+
            //     '<span class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span>                                                         ' +
            //     '<td class="align-middle">                                                                                                              ' +
            //     '  <span style="font-size: 20px; color: Dodgerblue;" >                                                                                  ' +
            //     '       <i class="fas fa-eye low-blue" title="Show details" onclick="loadServerDetails(\''+server+'\')"></i>                            ' +
            //     '       <i class="fas fa-play-circle low-blue" title="Run server" onclick="RunStapServer(\''+server+'\')"></i>                          ' +
            //     '  </span>                                                                                                                              ' +
            //     '</td>' ;
            //}
        html = html + '</tr>' ;
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
      loadTitleJSONdata();
      GetAllServers();   
    });
  }
  loadJSONdata();



function RunStapServer(server){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/stap/RunStapServer/'+uuid+'/'+server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
        .then(function (response) {
        console.log(response+"--------Stap server running");
        })
        .catch(function error(){
        console.log(error);
        });

        GetAllServers();
}

//Stop stap system
function StopStapServer(server){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/stap/StopStapServer/'+uuid+'/'+server;
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
    })
        .then(function (response) {
        console.log(response+"--------Stap server stopped");
        })
        .catch(function error(){
        console.log(error);
        });
        GetAllServers();
}

function PingStapServer(server) {
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/stap/PingStapServer/'+uuid+'/'+server;
    axios({
      method: 'get',
      url: nodeurl,
      timeout: 30000
    })
      .then(function (response) {
        if (!response.data.stapStatus) {
            document.getElementById(server+'-server-stap').className = "badge bg-danger align-text-bottom text-white";
            document.getElementById(server+'-server-stap').innerHTML = "OFF";
            document.getElementById(server+'-server-icon-stap').className = "fas fa-play-circle";
            document.getElementById(server+'-server-icon-stap').onclick = function(){ RunStapServer(server);};
            document.getElementById(server+'-server-icon-stap').title = "Run stap server";
        }else{
            document.getElementById(server+'-server-stap').className = "badge bg-success align-text-bottom text-white";
            document.getElementById(server+'-server-stap').innerHTML = "ON";
            document.getElementById(server+'-server-icon-stap').className = "fas fa-stop-circle";
            document.getElementById(server+'-server-icon-stap').onclick = function(){ StopStapServer(server);};
            document.getElementById(server+'-server-icon-stap').title = "Stop stap server";
        } 
      })
      .catch(function (error) {
        document.getElementById(server+'-serverstap').className = "badge bg-dark align-text-bottom text-white";
        document.getElementById(server+'-serverstap').innerHTML = "N/A";
        return false;
      });   
    return true;
  }