// function GetAllRulesetSource(){
//     var ipmaster = document.getElementById('ip-master').value;
//     var portmaster = document.getElementById('port-master').value;
//     var result = document.getElementById('list-ruleset-source');
//     var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/';
//     document.getElementById('ruleset-source-text').style.display ="none";

//     axios({
//         method: 'get',
//         url: sourceurl,
//         timeout: 30000
//     })
//     .then(function (response) {
//         document.getElementById('ruleset-source-text').style.display ="block";
//         result.innerHTML = generateAllRulesetSourceHTMLOutput(response);
//     })
//     .catch(function (error) {
//         result.innerHTML = '<h3 align="center">No connection</h3>';
//     });
// }

// function generateAllRulesetSourceHTMLOutput(response) {
//     var isEmpty = true;
//     var sources = response.data;
//     var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
//         '<thead>                                                      ' +
//         '<tr>                                                         ' +
//         '<th>Name</th>                                                  ' +
//         '<th>Description</th>                                          ' +
//         '<th>Path</th>                                                    ' +
//         '<th>Url</th>                                               ' +
//         '<th style="width: 15%">Actions</th>                                ' +
//         '</tr>                                                        ' +
//         '</thead>                                                     ' +
//         '<tbody>                                                      ' 
//     for (source in sources) {
//         isEmpty = false;
//         html = html + '<tr><td>'+
//             sources[source]['name']+
//             '</td><td>'+
//             sources[source]['desc']+
//             '</td><td>'+
//             sources[source]['path']+
//             '</td><td>'+
//             sources[source]['url']+
//             '</td><td class="align-middle">'+
//                 // '<p>                            ' +
//                 '<span style="font-size: 20px; color: Dodgerblue;">'+
//                     '<i class="fas fa-download" title="Download file" onclick="downloadFile(\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;'+
//                     '<i class="fas fa-sticky-note low-blue" title="Edit source" onclick="showEditRulesetSource(\''+sources[source]['name']+'\',\''+sources[source]['desc']+'\',\''+sources[source]['path']+'\',\''+sources[source]['url']+'\',\''+source+'\')"></i> &nbsp;'+
//                     '<i class="fas fa-trash-alt low-blue" title="Delete source" data-toggle="modal" data-target="#modal-delete-source" onclick="modalDeleteRulesetSource(\''+sources[source]['name']+'\',\''+source+'\')"></i> &nbsp;'+
//                     '<a href="compare-files.html"><i class="fas fa-cog low-blue" title="Compare files" onclick="compareFiles()"></i></a>                              ' +
//                     '<a href="ruleset-details.html?uuid='+source+'&path='+sources[source]['path']+'"><i class="fas fa-info-circle" title="Details"></i></a>'+
//                 '</span>'+
//                 // '</p>'+     
//             '</td></tr>'
//     }
//     html = html + '</tbody></table>';
//     if (isEmpty){
//         return '<h3 style="text-align:center">No sources created</h3>';
//     }else{
//         return html;
//     }
// }




























function GetAllRulesetDetails(){
    var urlWeb = new URL(window.location.href);
    var uuid = urlWeb.searchParams.get("uuid");
    var path = urlWeb.searchParams.get("path");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var result = document.getElementById('list-ruleset-details');
    var sourceurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/details/';

    var nodejson = {}
    nodejson["uuid"] = uuid;
    nodejson["path"] = path;
    var nodeJSON = JSON.stringify(nodejson);
    axios({
        method: 'put',
        url: sourceurl,
        timeout: 30000,
        data: nodeJSON
    })
    .then(function (response) {
        // result.innerHTML = generateAllRulesetDetailsHTMLOutput(response);
    })
    .catch(function (error) {
        result.innerHTML = '<h3 align="center">No connection</h3>';
    });
}



function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
      var ipLoad = document.getElementById('ip-master'); 
      ipLoad.value = data.master.ip;
      var portLoad = document.getElementById('port-master');
      portLoad.value = data.master.port;
      loadTitleJSONdata();
      GetAllRulesetDetails();
    });
  }
  loadJSONdata();