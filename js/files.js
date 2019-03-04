getAllFiles()
function getAllFiles(){
  var urlData = new URL(window.location.href);
  var uuid = urlData.searchParams.get("uuid");
  var node = urlData.searchParams.get("node");

  var files = document.getElementById('files-table');
  var banner = document.getElementById('title-banner');
  banner.innerHTML = "Node: "+node;

  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://'+ipmaster+':'+portmaster+'/v1/node/getAllFiles/'+uuid;

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
function loadJSONdata(){
  console.log("Loading JSON");
  $.getJSON('../conf/ui.conf', function(data) {
    console.log("getJSON");
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    getAllFiles();   
  });
}
loadJSONdata();