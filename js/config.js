function formAddGroup(){
    var addGroupId = document.getElementById('add-group');
    var textGroup = document.getElementById('group-text');

    if (addGroupId.style.display == "none") {
        addGroupId.style.display = "block";
        textGroup.innerHTML = "Close add new group";
    } else {
        addGroupId.style.display = "none";
        textGroup.innerHTML = "Add new group";
    }
}

function addGroup() {
    // var groupname = document.getElementById('groupname').value;
    // var groupdesc = document.getElementById('groupdesc').value;
    // var ipmaster = document.getElementById('ip-master').value;
    // var portmaster = document.getElementById('port-master').value;
    // var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/group/';
    // console.log(groupname);
    // console.log(groupdesc);
    // console.log(nodeurl);
    
    // formAddGroup();//close add group form
    // var nodejson = {}
    // nodejson["name"] = groupname;
    // nodejson["desc"] = groupdesc;
    // var nodeJSON = JSON.stringify(nodejson);

    // axios({
    //     method: 'post',
    //     url: nodeurl,
    //     timeout: 30000,
    //     data: nodeJSON
    // })
    // .then(function (response) {
    //     //GetAllGroups();
    //     console.log(response);
    //     return true;
    // })
    // .catch(function (error) {
    //     return false;
    // });   
        //GetAllGroups(); 
}

function getAllGroups(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var resultElement = document.getElementById('groups-list');
    formAddGroup();
    axios.get('https://' + ipmaster + ':' + portmaster + '/v1/getAllGroups')
        .then(function (response) {
            resultElement.innerHTML = generateAllNodesHTMLOutput(response);
        })
        .catch(function (error) {
            resultElement.innerHTML = '<h3 align="center">No connection</h3>';
        });
}

function generateAllNodesHTMLOutput(response) {
    var isEmpty = true;
    var nodes = response.data;
    var html =  '<table class="table table-hover">                            ' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th scope="col"></th>                                        ' +
                '<th scope="col">Name</th>                                    ' +
                '<th scope="col">Status</th>                                  ' +
                '<th scope="col">Tags <span style="font-size: 10px;"></span></th>            ' +
                '<th scope="col">Services</th>                                ' +
                '<th scope="col">Actions</th>                                 ' +
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
            ' <td class="align-middle"> <strong>' + nodes[node]['name'] + '</strong>'           +
            ' <p class="text-muted">' + nodes[node]['ip'] + '</p>'                        +
            ' <i class="fas fa-code" title="Ruleset Management"></i> <span id="'+uuid+'-ruleset" class="text-muted small"></span>'                        +
            '</td>'                                                                             +
            '<td class="align-middle">                                                        ';
        html = html + '<span id="'+uuid+'-online" class="badge bg-dark align-text-bottom text-white">N/A</span></td>';
            html = html + ' <td class="align-middle" id="'+uuid+'-tag"></td><td class="align-middle">';
            html = html +'<p><img src="img/suricata.png" alt="" width="30"> '      +
            '  <span id="'+uuid+'-suricata" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |' + 
            '  <span style="font-size: 15px; color: grey;" >                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-suricata-icon" title="Stop Suricata" onclick="StopSuricata(\''+uuid+'\')"></i>                     ' +
            '    <i class="fas fa-sync-alt" title="Deploy ruleset" onclick="sendRulesetToNode('+"'"+uuid+"'"+')"></i>                                 ' +
            '    <a title="Configuration" style="cursor: default;" data-toggle="modal" data-target="#modal-change-bpf" onclick="loadBPF(\''+uuid+'\',\''+nodes[node]['name']+'\')">BPF</a>'+
            '    <i class="fas fa-code" title="Ruleset Management" data-toggle="modal" data-target="#modal-ruleset-management" onclick="loadRuleset(\''+uuid+'\')"></i>                        ' +
            '  </span>                                                                        ' +
            '  </p>                                                                           ' +
            '  <p><img  src="img/bro.png" alt="" width="30">'+
            '  <span id="'+uuid+'-zeek" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                       ' +
            '  <span style="font-size: 15px; color: grey;" >                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-zeek-icon"></i>                         ' +
            '    <i class="fab fa-wpforms" title="Zeek policy management"></i>                  ' +
            '  </span>                                                                        ' +
            '  </p>                                                                           ' +
            '  <p><img src="img/wazuh.png" alt="" width="30"> '+
            '  <span id="'+uuid+'-wazuh" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                        ' +
            '  <span style="font-size: 15px; color: grey;" >                                  ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-wazuh-icon"></i>                         ' +
            '  </span></p> '+
            '  <p><i class="fas fa-plug fa-lg"></i>'+
            '  <span id="'+uuid+'-stap" class="badge badge-pill bg-dark align-text-bottom text-white">N/A</span> |                                         ' +
            '  <span style="font-size: 15px; color: grey;">                                   ' +
            '    <i class="fas fa-stop-circle" id="'+uuid+'-stap-icon"></i>                         ' +
            '    <a href="stap.html?uuid='+uuid+'&node='+nodes[node]['name']+'"><i class="fas fa-cog" title="Configuration" style="color: grey;"></i><a>                             ' +
            '  </span></p> ';                      
            html = html +   '</td>                                                              ' +
            '<td class="align-middle">                                                        ' +
            '  <span style="font-size: 20px; color: Dodgerblue;" >                            ' +
            '    <a href="files.html?uuid='+node+'&node='+nodes[node]['name']+'"><i class="fas fa-arrow-alt-circle-down" title="See node files"></i></a>             ' +
            '    <i class="fas fa-cogs" title="Modify node details" onclick="showConfig('+"'"+nodes[node]['ip']+"','"+nodes[node]['name']+"','"+nodes[node]['port']+"','"+uuid+"'"+');"></i>                            ' +
            '    <a href="edit.html?uuid='+node+'&file=main.conf&node='+nodes[node]['name']+'" style="font-size: 20px; color: Dodgerblue;"><i class="fas fa-cog" title="Edit node configuration"></i></a>           ' +
            '    <a style="font-size: 20px; color: Dodgerblue;" onclick="deleteNodeModal('+"'"+node+"'"+', '+"'"+nodes[node]['name']+"'"+');"> ' +
            '      <i class="fas fa-trash-alt" title="Delete Node" data-toggle="modal" data-target="#modal-delete-nodes"></i>                         ' +
            '    </a>                                                                            ' +
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


function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadTitleJSONdata();
    });
  }
  loadJSONdata();