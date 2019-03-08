
function loadTitleJSONdata(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var title = document.getElementById('menu-title');
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/getMasterTitle';
    axios({
        method: 'get',
        url: urlSetRuleset,
        timeout: 30000
    })
    .then(function (response) {
        console.log(ipmaster+" --> "+portmaster+" : "+response.data);
        title.innerHTML = response.data;
        return true;
    })
    .catch(function (error) {
        return false;
    }); 
}

// function loadJSONdata(){
//     console.log("Loading JSON");
//     $.getJSON('../conf/ui.conf', function(data) {
//         console.log("getJSON");
//         var ipLoad = document.getElementById('ip-master'); 
//         ipLoad.value = data.master.ip;
//         var portLoad = document.getElementById('port-master');
//         portLoad.value = data.master.port;
//         loadTitleJSONdata();
//         loadRuleset();   
//     });
// }
// loadJSONdata();
loadTitleJSONdata();