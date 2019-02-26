getAllFiles()
function getAllFiles(){
  var urlData = new URL(window.location.href);
  var uuid = urlData.searchParams.get("uuid");
  var node = urlData.searchParams.get("node");

  var files = document.getElementById('files-table');
  var banner = document.getElementById('title-banner');
  banner.innerHTML = "Node: "+node;

  var ip = "https://192.168.14.13";
  var port = ":50001";
  var route = "/getAllFiles";
  var nodeurl = ip+port+'/v1/node'+route+'/'+uuid

  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000
  })
    .then(function (response) {
      files.innerHTML = generateAllFilesOutput(response, node);
    })
    .catch(function (error){
      files.innerHTML = generateAllFilesOutput(error);
    });    
}

function generateAllFilesOutput(response, node) {
    var rules = response.data;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th>Name</th>                                                ' +
                '<th>Path</th>                                                ' +
                '<th>Actions</th>                                             ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (rule in rules) {
      if (rule != "nodeUUID"){
        html = html + '<tr><td>'+
            rule                                                    +
            '</td><td>                                                            '+
            '</td><td>                                                            '+                                                     
            '<a href="edit.html?uuid='+response.data.nodeUUID+'&file='+rule+'&node='+node+'"><button type="submit" class="btn btn-primary">Edit</button></a> '+
            '</td></tr>                                                           '
         
      }
    }
    html = html + '</tbody></table>';
    return  html;
}