function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadControlData();        
        loadTitleJSONdata();
    });
}
loadJSONdata();

function loadControlData(){
    var urlData = new URL(window.location.href);
    var type = urlData.searchParams.get("type");
    var uuid = urlData.searchParams.get("uuid");

    var progressBar = document.getElementById('progressBar-control');
    var progressBarDiv = document.getElementById('progressBar-control-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    document.getElementById('change-control-data').innerHTML = type;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    if(type=="master"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/changecontrol';
    }else if(type=="node"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/changecontrol/'+uuid;
    }

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";

        html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">'+
            '<thead>'+
                '<tr>'+
                    '<th>Date</td>'+
                    '<th>Device</td>'+
                    '<th>Status</td>'+
                    '<th>Action value</td>'+
                    '<th>Action desc</td>'+
                    '<th>Actions</td>'+
                '</tr>'+
            '</thead>'+
            '<tbody>';
                for(data in response.data){
                    html = html + '<tr>'+
                        '<td>'+response.data[data]["time"]+'</td>'+
                        '<td>'+response.data[data]["deviceName"]+'</td>';                        
                        if(response.data[data]["actionStatus"] == "success"){
                            html = html + '<td style="color:green;">'+response.data[data]["actionStatus"]+'</td>';
                        }else if(response.data[data]["actionStatus"] == "error"){
                            html = html + '<td style="color:red;">'+response.data[data]["actionStatus"]+'</td>';
                        }
                        html = html + '<td>'+response.data[data]["action"]+'</td>'+
                        '<td>'+response.data[data]["actionDescription"]+'</td>'+
                        '<td><i class="fas fa-chevron-circle-down" style="cursor:pointer;" onclick="showControlDetails(\''+data+'\')" id="details-show-'+data+'"></i></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="6">'+
                            '<table id="control-'+data+'" style="display: none;"  class="table table-hover" style="table-layout: fixed" style="width:100%">'+
                                '<tr>'+
                                    '<td>';
                                        for(param in response.data[data]){
                                            html = html + '<b>'+param+': </b>'+response.data[data][param]+'<br>';
                                        }
                                    html = html + '</td>'+
                                '</tr>'+
                            '</table>'+
                        '</td>'+
                    '</tr>';
                }
                
            html = html + '</tbody>'+
        '</table>';
        document.getElementById("control-data-content").innerHTML = html;
    })
    .catch(function (error) {
    });
}

function showControlDetails(uuid){
    var showDetailsButton = document.getElementById('details-show-'+uuid);
    var details = document.getElementById('control-'+uuid);

    if (details.style.display == "none") {
        details.style.display = "block";
        showDetailsButton.className = "fas fa-chevron-circle-up";
    } else if (details.style.display == "block"){
        details.style.display = "none";
        showDetailsButton.className = "fas fa-chevron-circle-down";
    }
}