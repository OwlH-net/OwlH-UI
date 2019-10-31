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
        if(response.data.ack == "false"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            document.getElementById("incident-data-content").innerHTML = '<h3 class="text-center">There are not incidents</h3>';
        }else{
            var isEmpty = true;
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
    
            html = '<table class="table" style="table-layout: fixed" style="width:1px" id="incident-table">'+
                '<thead>'+
                    '<tr>'+
                        '<th onclick="sortTable()">Date</th>'+
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
        }
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

function sortTable() {
    document.getElementById('progressBar-incident').style.display = "block";
    document.getElementById('progressBar-incident-div').style.display = "block";
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("incident-table");
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		rows = table.rows;
		/* Loop through all table rows (except the
		first, which contains table headers): */
		for (i = 1; i < (rows.length - 1); i++) {
			// Start by saying there should be no switching:
			shouldSwitch = false;
			/* Get the two elements you want to compare,
			one from current row and one from the next: */
			x = rows[i].getElementsByTagName("TD")[0];
			y = rows[i + 1].getElementsByTagName("TD")[0];
			// Check if the two rows should switch place:
			if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
			// If so, mark as a switch and break the loop:
			shouldSwitch = true;
			break;
			}
		}
		if (shouldSwitch) {
			/* If a switch has been marked, make the switch
			and mark that a switch has been done: */
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
    }
    document.getElementById('progressBar-incident').style.display = "none";
    document.getElementById('progressBar-incident-div').style.display = "none";
}