
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

loadTitleJSONdata();