function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        //token check
        var tokens = document.cookie.split(".");
        if (tokens.length != 3){
            document.cookie = "";
        }
        if(document.cookie == ""){
            document.location.href='https://'+location.hostname+'/login.html';
        }
        try {payload = JSON.parse(atob(tokens[1]));}
        catch(err) {document.cookie = ""; document.location.href='https://'+location.hostname+'/login.html';}

        //login button
        document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + payload.user

        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        getServideCommands();
        loadTitleJSONdata();
    });
}
var payload = "";
loadJSONdata();

function getServideCommands(){
    var urlWeb = new URL(window.location.href);
    var node = urlWeb.searchParams.get("node");
    var service = urlWeb.searchParams.get("service");
    var name = urlWeb.searchParams.get("name");
    document.getElementById('command-name').innerHTML = name;

    var progressBar = document.getElementById('progressBar-control');
    var progressBarDiv = document.getElementById('progressBar-control-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/node/plugins/getCommands';

    var jsonService = {}
    jsonService["uuid"] = node;
    jsonService["service"] = service;
    var dataJSON = JSON.stringify(jsonService);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        headers:{
                'token': document.cookie,
                'user': payload.user,
                'uuid': payload.uuid,
            },
        data: dataJSON
    })
    .then(function (response) {
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        if(response.data.token == "none"){document.cookie=""; document.location.href='https://'+location.hostname+'/login.html';}
        if(response.data.permissions == "none"){
            PrivilegesMessage();
        }else{
            if (response.data.ack == "false") {
                $('html,body').scrollTop(0);
                var alert = document.getElementById('floating-alert');
                alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                    '<strong>Error!</strong> Get commands error: '+response.data.error+'.'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                '</div>';
                setTimeout(function() {$(".alert").alert('close')}, 5000);
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
            }else{
                console.log(response.data);
                var isEmpty = true;

                html = '<div class="input-group" width="100%">'+
                    '<input class="form-control mx-3 searchInputValue" type="text" placeholder="Search by name..." aria-label="Search" id="search-value-details">'+
                    '<a type="button" class="btn btn-primary" id="command-search-value"><i class="fas fa-search" style="color: white;"></i></a>'+
                '</div><br>'+
                '<div>'+
                    '<span id="sort-command-date" onclick="sortTable()" sort="desc" class="sort-table badge bg-secondary align-text-bottom text-white float-left mr-1" style="cursor:pointer;" title="Sort table by date">Sort by date</span>'+
                '<div>'+
                '<br>'+
                '<table class="table" style="table-layout: fixed" style="width:1px" id="command-table">'+
                    '<thead>'+
                        '<tr>'+
                            '<th onclick="sortTable()">Date</td>'+
                            '<th>Type</td>'+
                            '<th>Actions</td>'+
                        '</tr>'+
                    '</thead>'+
                    '<tbody>';
                        for(data in response.data){
                            isEmpty = false;    
                            html = html + '<tr date="'+response.data[data]["date"]+'">'+
                                '<td>'+response.data[data]["date"]+'</td>'+
                                '<td>'+response.data[data]["type"]+'</td>'+                       
                                '<td><i class="fas fa-chevron-circle-down" style="cursor:pointer;" onclick="showCommandDetails(\''+data+'\')" id="details-show-'+data+'"></i></td>'+
                            '</tr>'+
                            '<tr date="'+response.data[data]["date"]+'">'+
                                '<td colspan="3">'+
                                    '<table id="command-'+data+'" style="display: none;" class="table" style="table-layout: fixed" style="width:100%">'+
                                        '<tr date="'+response.data[data]["date"]+'">'+
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
                    html = '<h2 class="text-center">There is no service command executed</h2>';
                }
                document.getElementById("command-content").innerHTML = html;

                //search bar
                $('#command-search-value').click(function(){ loadValueBySearch(document.getElementById('search-value-details').value)});
            
                // listener for seach bar
                document.getElementById('search-value-details').addEventListener('input', evt => {
                    if (document.getElementById('search-value-details').value.trim() == ""){ showAllHiddenRows();} 
                });

            }
        }
    })
    .catch(function (error) {
        console.log(error);
        progressBar.style.display = "none";
        progressBarDiv.style.display = "none";
        $('html,body').scrollTop(0);
            var alert = document.getElementById('floating-alert');
            alert.innerHTML = '<div class="alert alert-danger alert-dismissible fade show">'+
                '<strong>Error!</strong> Get commands error: '+error+'.'+
                '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
                    '<span aria-hidden="true">&times;</span>'+
                '</button>'+
            '</div>';
            setTimeout(function() {$(".alert").alert('close')}, 5000);
    });
}

function loadValueBySearch(search){
    showAllHiddenRows();
    $('#command-table tbody').each(function(){
        $(this).find('tr').each(function(){
            if ($(this).attr("date").toLowerCase().includes(search.toLowerCase())
            ){
                //none
            }else {
                $(this).hide();
            }
        })
    })
}

function showAllHiddenRows(){
    $('#command-table tbody').each(function(){
        $(this).find('tr').each(function(){
            $(this).show();
        })
    })
}

function showCommandDetails(uuid){
    var showDetailsButton = document.getElementById('details-show-'+uuid);
    var details = document.getElementById('command-'+uuid);

    if (details.style.display == "none") {
        details.style.display = "block";
        showDetailsButton.className = "fas fa-chevron-circle-up";
    } else if (details.style.display == "block"){
        details.style.display = "none";
        showDetailsButton.className = "fas fa-chevron-circle-down";
    }
}

function sortTable() {
    var type = document.getElementById('sort-command-date').getAttribute("sort");
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("command-table");
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
        document.getElementById('sort-command-date').setAttribute("sort", "desc");
    }else{
        document.getElementById('sort-command-date').setAttribute("sort", "asc");
    }
}