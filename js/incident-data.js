function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadIncidentData();        
        loadTitleJSONdata();
    });
}
loadJSONdata();

function loadIncidentData(){
    var urlData = new URL(window.location.href);
    var type = urlData.searchParams.get("type");
    var uuid = urlData.searchParams.get("uuid");

    var progressBar = document.getElementById('progressBar-incident');
    var progressBarDiv = document.getElementById('progressBar-incident-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    document.getElementById('change-incident-data').innerHTML = type;   

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    if(type=="master"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/master/incidents';
    }else if(type=="node"){
        var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/incidents/'+uuid;
    }

    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        console.log(response.data);
        var isEmpty = true;
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";

        html = '<table class="table" style="table-layout: fixed" style="width:1px">'+
            '<thead>'+
                '<tr>'+
                    '<th>Date</th>'+
                    '<th>Device</th>'+
                    '<th>Status</th>'+
                    '<th>Level</th>'+
                    '<th>Actions</th>'+
                '</tr>'+
            '</thead>'+
            '<tbody>';
                for(data in response.data){
                    isEmpty = false;
                    html = html + '<tr>'+
                        '<td>'+response.data[data]["date"]+'</td>'+
                        '<td>'+response.data[data]["deviceName"]+'</td>'+                        
                        '<td>'+response.data[data]["status"]+'</td>'+
                        '<td>'+response.data[data]["level"]+'</td>'+
                        '<td><i class="fas fa-chevron-circle-down" style="cursor:pointer;" onclick="showincidentDetails(\''+data+'\')" id="details-show-'+data+'"></i></td>'+
                    '</tr>'+
                    '<tr>'+
                        '<td colspan="5">'+
                            '<table id="incident-'+data+'" style="display: none;" class="table" style="table-layout: fixed" style="width:100%">'+
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

        if (isEmpty == true){
            html = '<h2 class="text-center">There are no incidents available</h2>';
        }
        document.getElementById("incident-data-content").innerHTML = html;
    })
    .catch(function (error) {
    });
}

function showincidentDetails(uuid){
    var showDetailsButton = document.getElementById('details-show-'+uuid);
    var details = document.getElementById('incident-'+uuid);

    if (details.style.display == "none") {
        details.style.display = "block";
        showDetailsButton.className = "fas fa-chevron-circle-up";
    } else if (details.style.display == "block"){
        details.style.display = "none";
        showDetailsButton.className = "fas fa-chevron-circle-down";
    }
}