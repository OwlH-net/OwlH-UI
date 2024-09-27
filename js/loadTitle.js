
function loadTitleJSONdata() {

  $.get('../conf/current.version', function (data) {
    document.getElementById('current-version-show').innerHTML = data;
    document.getElementById('current-version-show').onclick = function () { loadReadme(); };
    document.getElementById('current-version-show').style.cursor = "pointer";
  }, 'text');

  $.getJSON('../conf/ui.conf', function (data) {
    ipmaster = data.master.ip;
    portmaster = data.master.port;

    let title = document.getElementById('menu-title');
    let urlSetRuleset = 'https://' + ipmaster + ':' + portmaster + '/v1/master/getMasterTitle';

    axios({
      method: 'get',
      url: urlSetRuleset,
      timeout: 30000,
      headers: {
        'token': cToken,
        'user': user
      }
    })
      .then(function (response) {
        title.innerHTML = response.data;
        return true;
      })
      .catch(function (error) {
        console.log('loadTitle - error ->', error)
        return false;
      });
  })
}

function loadReadme() {
  window.open('https://github.com/OwlH-net/roadmap/blob/master/README.md', '_blank').focus();
}

loadTitleJSONdata();