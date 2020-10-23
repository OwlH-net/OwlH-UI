function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='login.html';}
        //login button
                document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user
        document.getElementById('loger-user-name').value = payload.user
                 
        var ipLoad = document.getElementById('ip-master'); 
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadIncidentData();        
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();

function loadIncidentData(){
    var urlData = new URL(window.location.href);
    var type = urlData.searchParams.get("type");
    var uuid = urlData.searchParams.get("uuid");
    var name = urlData.searchParams.get("node");

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
        timeout: 30000,
        headers:{'token': document.cookie,'user': payload.user}
    })
   .then(function (response) {
        if(response.data.token == "none"){document.cookie=""; document.location.href='login.html';}
        if(response.data.permissions == "none"){
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";
            PrivilegesMessage();              
        }else{
            if(response.data.ack == "false"){
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                document.getElementById("incident-data-content").innerHTML = '<h3 class="text-center">There are not incidents for node <b>'+name+'</b></h3>';
            }else{
                var isEmpty = true;
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
        
                html = '<div class="input-group" width="100%">'+
                    '<input class="form-control mx-3" type="text" placeholder="Search by name..." aria-label="Search" id="search-value-details">'+
                    '<a type="button" class="btn btn-primary" id="incident-search-value"><i class="fas fa-search" style="color: white;"></i></a>'+
                '</div><br>'+
                '<div>'+
                    '<span id="sort-incident-date" onclick="sortTable()" sort="desc" class="sort-table badge bg-secondary align-text-bottom text-white float-left mr-1" style="cursor:pointer;" title="Sort table by date">Sort by date</span>'+
                '<div>'+
                '<br>'+
                '<table class="table" style="table-layout: fixed" style="width:1px" id="incident-table">'+
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
                            html = html + '<tr date="'+response.data[data]["date"]+'" device="'+response.data[data]["deviceName"]+'" desc="'+response.data[data]["desc"]+'" ip="'+response.data[data]["deviceIp"]+'">'+
                                '<td>'+response.data[data]["date"]+'</td>'+
                                '<td>'+response.data[data]["deviceName"]+'</td>'+                        
                                '<td>'+response.data[data]["status"]+'</td>'+
                                '<td>'+response.data[data]["level"]+'</td>'+
                                '<td><i class="fas fa-chevron-circle-down" style="cursor:pointer;" onclick="showincidentDetails(\''+data+'\')" id="details-show-'+data+'"></i></td>'+
                            '</tr>'+
                            '<tr date="'+response.data[data]["date"]+'" device="'+response.data[data]["deviceName"]+'" desc="'+response.data[data]["desc"]+'" ip="'+response.data[data]["deviceIp"]+'">'+
                                '<td colspan="5">'+
                                    '<table id="incident-'+data+'" style="display: none;" class="table" style="table-layout: fixed" style="width:100%">'+
                                        '<tr date="'+response.data[data]["date"]+'" device="'+response.data[data]["deviceName"]+'" desc="'+response.data[data]["desc"]+'" ip="'+response.data[data]["deviceIp"]+'">'+
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
                    html = '<h2 class="text-center">There are no incidents available for node <b>'+name+'</b></h2>';
                }
                document.getElementById("incident-data-content").innerHTML = html;
    
                //search bar
                $('#incident-search-value').click(function(){ loadValueBySearch(document.getElementById('search-value-details').value)});
            
                // listener for seach bar
                document.getElementById('search-value-details').addEventListener('input', evt => {
                    if (document.getElementById('search-value-details').value.trim() == ""){ showAllHiddenRows();} 
                });
    
                //sort table by date
                // sortTable();
            }
        }
    })
    .catch(function (error) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        document.getElementById("command-content").innerHTML = '<h3 class="text-center">Error getting incidents for node <b>'+name+'</b></h3>';
    });
}

function showAllHiddenRows(){
    $('#incident-table tbody').each(function(){
        $(this).find('tr').each(function(){
            $(this).show();
        })
    })
}

function loadValueBySearch(search){
    showAllHiddenRows();
    $('#incident-table tbody').each(function(){
        $(this).find('tr').each(function(){
            if ($(this).attr("date").toLowerCase().includes(search.toLowerCase()) //|| 
            // $(this).attr("device").toLowerCase().includes(search.toLowerCase()) ||
            // $(this).attr("desc").toLowerCase().includes(search.toLowerCase()) ||
            // $(this).attr("ip").toLowerCase().includes(search.toLowerCase())
            ){
                //none
            }else {
                $(this).hide();
            }
        })
    })
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

    var type = document.getElementById('sort-incident-date').getAttribute("sort");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("incident-table");
    switching = true;
    while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < (rows.length - 1); i++) {
			shouldSwitch = false;
			x = rows[i].getAttribute("date");
            y = rows[i + 1].getAttribute("date");
            if (type == "asc"){
                if (x.toLowerCase() > y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }else{
                if (x.toLowerCase() < y.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
		}
    }

    //change attr
    if (type == "asc"){
        document.getElementById('sort-incident-date').setAttribute("sort", "desc");
    }else{
        document.getElementById('sort-incident-date').setAttribute("sort", "asc");
    }

    document.getElementById('progressBar-incident').style.display = "none";
    document.getElementById('progressBar-incident-div').style.display = "none";
}