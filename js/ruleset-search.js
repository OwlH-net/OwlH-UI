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
    var urlWeb = new URL(window.location.href);
    var rulesetName = urlWeb.searchParams.get("rulesetName");
    var search = urlWeb.searchParams.get("search");
    var uuid = urlWeb.searchParams.get("uuid");

    document.getElementById('ruleset-search-title').innerHTML = "Search result for ruleset: "+rulesetName;

    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/search/getRulesetsBySearch';

    var jsondata = {}
    jsondata["search"] = search;
    jsondata["rulesetName"] = rulesetName;
    jsondata["uuid"] = uuid
    var searchJSON = JSON.stringify(jsondata);
    axios({
        method: 'put',
        url: nodeurl,
        timeout: 30000,
        data: searchJSON
    })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function error() {
        });
}
