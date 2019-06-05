function loadPlugins(){
    content = document.getElementById('master-table-plugins');
    content.innerHTML ='<div class="my-3 p-3 bg-white rounded shadow-sm">'+
    '<h6 class="border-bottom border-gray pb-2 mb-0">Plugins</h6>'+
    '<br>'+
    '<p><i style="color: Dodgerblue;" class="fas fa-plug fa-lg"></i> <span style="font-size: 15px; color: Grey;">&nbsp; STAP Collector &nbsp; | </span> <i class="fas fa-compress-arrows-alt" id="master-collector-status"></i> | '+
    '  <span style="font-size: 15px; color: grey;">                                   ' +
    '    <i class="fas fa-play-circle" title="Play collector" onclick="playMasterCollector()"></i>                         ' +
    '    <i class="fas fa-stop-circle" title="Stop collector" onclick="stopMasterCollector()"></i>                         ' +
    '    <i class="fas fa-info-circle" title="Collector information" onclick="showMasterCollector()"></i>  ' +
    '  </span></p> '+
    '</div>';
    PingCollector();
}

function PingCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var collectorMasterStatus = document.getElementById('master-collector-status');
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Master STAP Collector is not available.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
        }else if (response.data != ""){
            collectorMasterStatus.style.color="green";
        }else{
            collectorMasterStatus.style.color="red";
        }
    })
    .catch(function (error) {
        return false;
    });
}

function playMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/playMasterCollector';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t start Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
        }
        return true;
    })
    .catch(function (error) {
        return false;
    });
}

function stopMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/stopMasterCollector';
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t stop Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
        }else{
            return true;
        }
    })
    .catch(function (error) {
        return false;
    });
}

function showMasterCollector(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/collector/showMasterCollector';
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Can\'t retrieve data from Master STAP Collector.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
        }else{
            showMasterModalCollector(response);
            return true;
        }
    })
    .catch(function (error) {
        return false;
    });
}

function showMasterModalCollector(response){
    var res = response.data.split("\n");
    var html = '<div class="modal-dialog modal-lg">'+
                    '<div class="modal-content">'+
                
                        '<div class="modal-header">'+
                            '<h4 class="modal-title" id="modal-collector-header">Master STAP Collector status</h4>'+
                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
                                '<span aria-hidden="true">&times;</span>'+
                            '</button>'+
                        '</div>'+
                
                        '<div class="modal-body">'
                                if (response.data == ""){
                                    html = html + '<p>There are no ports</p>';
                                }else{
                                    html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                                    '<thead>                                                      ' +
                                        '<tr>                                                         ' +
                                            '<th>Proto</th>                                             ' +
                                            '<th>RECV</th>                                             ' +
                                            '<th>SEND</th>                                             ' +
                                            '<th style="width: 25%">LOCAL IP</th>                                             ' +
                                            '<th style="width: 25%">REMOTE IP</th>                                             ' +
                                            '<th style="width: 15%">STATUS</th>                                             ' +
                                            '<th></th>                                             ' +
                                        '</tr>                                                        ' +
                                    '</thead>                                                     ' +
                                    '<tbody>                                                     ' 
                                    for(line in res) {
                                        if (res[line] != ""){
                                            // var x = res[line].split(" ");
                                            var vregex = /([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)/;
                                            var lineSplited = vregex.exec(res[line]);
                                            // continue;
                                            // for( var i = 0; i < x.length; i++){ 
                                            //     if ( x[i] === "") {
                                            //       x.splice(i, 1); 
                                            //       i--;
                                            //     }
                                            //  }
                                            // console.log(x);
                                            // [ "tcp", "0", "0", "192.168.0.101:22", "192.168.0.164:55427", "ESTABLISHED", "4084/sshd:", "root@pts" ]

    
                                            // var lineSplited = res[line].split(" ");
                                            html = html + '<tr><td>' +
                                            // lineSplited[0]+
                                            // '</td><td>     ' +
                                            lineSplited[1]+
                                            '</td><td>     ' +
                                            lineSplited[2]+
                                            '</td><td>     ' +
                                            lineSplited[3]+
                                            '</td><td>     ' +
                                            lineSplited[4]+
                                            '</td><td>     ' +
                                            lineSplited[5]+
                                            '</td><td>     ' +
                                            lineSplited[6]+
                                            '</td><td>     ' +
                                            lineSplited[7]+
                                            '</td></tr>'
                                            // html = html + res[line].replace(" ","&#09;")+"<br>";
                                        }
                                    }
                                }
                        html = html +
                        '</div>'+
                
                    '</div>'+
                '</div>';
    document.getElementById('modal-master').innerHTML = html;
    $('#modal-master').modal('show')
}

function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadPlugins();
        loadTitleJSONdata();
    });
  }
  loadJSONdata();