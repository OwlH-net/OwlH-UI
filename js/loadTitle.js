
function loadTitleJSONdata(){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var title = document.getElementById('menu-title');
    var urlSetRuleset = 'https://'+ ipmaster + ':' + portmaster + '/v1/master/getMasterTitle';


    $.get('../conf/current.version', function(data) {
        document.getElementById('current-version-show').innerHTML = data;        
        document.getElementById('current-version-show').onclick = function(){loadReadme();}; 
        document.getElementById('current-version-show').style.cursor = "pointer"; 
        // document.getElementById('current-version-text').onclick = function(){loadReadme();}; 
        // document.getElementById('current-version-text').style.cursor = "pointer"; 
               
    }, 'text');

    axios({
        method: 'get',
        url: urlSetRuleset,
        timeout: 30000,
        headers:{
            'token': document.cookie,
            'user': payload.user            
        }
    })
   .then(function (response) {
        title.innerHTML = response.data;
        return true;
    })
    .catch(function (error) {
        return false;
    }); 
}

function loadReadme(){
    window.open('https://github.com/OwlH-net/roadmap/blob/master/README.md', '_blank').focus();
}

loadTitleJSONdata();