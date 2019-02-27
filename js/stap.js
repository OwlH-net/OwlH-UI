function showAddServer(){
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
    console.log("UUID");

    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");

    console.log(uuid);
    console.log(document.getElementById("nodeipform").value);

    var addserver = document.getElementById('show-add-server');
    var serverform = document.getElementById('serverform');
    var nodeName = document.getElementById('nodenameform');
    var nodeIP = document.getElementById('nodeipform');


    console.log(nodeName.value);
    console.log(nodeIP.value);

    serverform.style.display = "none";
    addserver.innerHTML = "Add Server";

    var nodeurl = 'https://192.168.14.13:50001/v1/stap/';

    var nodejson = {};
    nodejson["nodeName"] = nodeName.value;
    nodejson["nodeIP"] = nodeIP.value;
    nodejson["uuid"] = uuid;
    var nodeJSON = JSON.stringify(nodejson);

    axios({
        method: 'post',
        url: nodeurl,
        timeout: 3000,
        data: nodeJSON
    })
    .then(function (response) {
        //resultElement.innerHTML = generateAllServerHTMLOutput(response);
        return true;
    })
    .catch(function (error) {
        //resultElement.innerHTML = generateAllServerHTMLOutput(error);
        return false;
    }); 

}
/*
function generateAllServerHTMLOutput(response) {
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
        '    <i class="fas fa-stop-circle" title="Stop Suricata"></i>                     ' +
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
        '    <a href="stap.html?uuid='+nid+'"><i class="fas fa-cog" title="Configuration" style="color: grey;"></i><a>                             ' +
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
  
  */