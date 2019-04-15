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
    var isEmptyFiles = true;
    var files = response.data;
    var html =  '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>                                                      ' +
                '<tr>                                                         ' +
                '<th>Name</th>                                                ' +
                '<th>Path</th>                                                ' +
                '<th>Actions</th>                                             ' +
                '</tr>                                                        ' +
                '</thead>                                                     ' +
                '<tbody >                                                     ' 
    for (file in files) {
        isEmptyFiles=false;
        if (file != "nodeUUID"){
            html = html + '<tr><td>'+
                file                                                    +
                '</td><td>                         '+
                files[file]+
                '</td><td>                                                            '+                                                     
                '<a href="edit.html?uuid='+files.nodeUUID+'&file='+file+'&node='+node+'"><button type="submit" class="btn btn-primary">Edit</button></a> '+
                '</td></tr>                                                           '
        }
    }
    html = html + '</tbody></table>';

    if (isEmptyFiles){
        return '<div style="text-align:center"><h3>No files available...</h3></div>'; 
    }else{
        return html;
    }
}
function loadJSONdata(){
  $.getJSON('../conf/ui.conf', function(data) {
    var ipLoad = document.getElementById('ip-master'); 
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;
    loadTitleJSONdata();
    getAllFiles();   
  });
}
loadJSONdata();