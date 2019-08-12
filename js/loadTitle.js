
function loadTitleJSONdata(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var title = document.getElementById('menu-title');
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/getMasterTitle';


    $.get('../conf/current.version', function(data) {
        document.getElementById('current-version-show').innerHTML = data;        
    }, 'text');

    axios({
        method: 'get',
        url: urlSetRuleset,
        timeout: 30000
    })
    .then(function (response) {
        title.innerHTML = response.data;
        return true;
    })
    .catch(function (error) {
        return false;
    }); 
}

loadTitleJSONdata();