function loadJSONdata(){
	$.getJSON('../conf/ui.conf', function(data) {
	var ipLoad = document.getElementById('ip-master'); 
	ipLoad.value = data.master.ip;
	var portLoad = document.getElementById('port-master');
	portLoad.value = data.master.port;
	loadTitleJSONdata();
	getRulesetsBySearch();
	});
}
loadJSONdata();

function getRulesetsBySearch(){

    var progressBar = document.getElementById('progressBar-options');
    var progressBarDiv = document.getElementById('progressBar-options-div');
    progressBar.style.display = "block";
    progressBarDiv.style.display = "block";

    var urlWeb = new URL(window.location.href);
    var rulesetName = urlWeb.searchParams.get("rulesetName");
    var search = urlWeb.searchParams.get("search");

    document.getElementById('ruleset-search-title').innerHTML = "Search result for ruleset: "+rulesetName;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/search/getRulesetsBySearch';

    var jsondata = {}
    jsondata["search"] = search;
    if(rulesetName != null){jsondata["rulesetName"] = rulesetName;}
    var searchJSON = JSON.stringify(jsondata);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: searchJSON
    })
        .then(function (response) {
            if (response.data.ack == "false") {
                progressBar.style.display = "none";
                progressBarDiv.style.display = "none";
                html = html + '<div style="text-align:center"><h3 style="color:red;">Error retrieving search results...</h3></div>';
            }else{
                var html = "";
                html = html + '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
                '<thead>' +
                    '<tr>' +
                        '<th align="center" style="width: 7%">Status</th>' +
                        '<th style="width: 10%">Sid</th>' +
                        '<th>Description</th>' +
                        '<th>Ruleset</th>' +
                        '<th style="width: 8%">Actions</th>' +                
                    '</tr>' +
                '</thead>' +
                '<tbody>';
                for (rule in response.data){
                    console.log(response.data);
                    html = html + '<tr>'+
                        '<td>';
                            if(response.data[rule]["Rulesets"][0]["status"] == "Enabled"){
                                html = html + '<i class="fas fa-check-circle" style="color:green;"></i>';
                            }else{
                                html = html + '<i class="fas fa-times-circle" style="color:red;"></i>';
                            }
                        html = html + '</td>'+
                        '<td>'+response.data[rule]["sid"]+'</td>'+
                        '<td>'+response.data[rule]["msg"]+'</td>'+
                        '<td>'+response.data[rule]["Rulesets"][0]["name"]+'</td>'+
                        '<td><i class="fas fa-play-circle"></i></td>'+
                    '</tr>';
                }

                html = html + '</tbody>'+
                '</table>';
            }

            document.getElementById('list-ruleset-search').innerHTML = html;
            progressBar.style.display = "none";
            progressBarDiv.style.display = "none";

        })
        .catch(function error() {
        });
}
