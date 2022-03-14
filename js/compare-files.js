function compareFiles() {
  var urlWeb = new URL(window.location.href);
  var file = urlWeb.searchParams.get("file");
  var uuid = urlWeb.searchParams.get("uuid");

  var resultElement = document.getElementById('compare-lines-table');
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  document.getElementById('ruleset-compare-files-title').innerHTML = file;

  var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/rulesetSource/compareSourceFiles/' + uuid;
  axios({
    method: 'get',
    url: nodeurl,
    timeout: 30000,
    headers: { 'token': cToken, 'user': user }
  })
    .then(function (response) {
      if (response.data.token == "none") { document.cookie = ""; document.location.href = 'login.html'; }
      if (response.data.permissions == "none") {
        PrivilegesMessage();
      } else {
        resultElement.innerHTML = generateAllLinesHTMLOutput(response);
      }
    })
    .catch(function (error) {
    });
}

function generateAllLinesHTMLOutput(response) {
  if (response.data.ack == "false") {
    return '<div style="text-align:center"><h3 style="color:red;">Error retrieving file data</h3></div>';
  }
  var lines = response.data
  var isEmptyRulesets = true;
  var html = '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
    '<thead>                                                      ' +
    '<tr>                                                         ' +
    '<th style="width: 10%">Sid</th>                                                 ' +
    '<th style="width: 10%">Ruleset file status</th>                                ' +
    '<th style="width: 30%">Ruleset file line</th>                                       ' +
    '<th style="width: 10%">Source file line status</th>                                ' +
    '<th style="width: 30%">Source file line</th>                                       ' +
    // '<th style="width: 10%">Actions</th>                                             ' +
    '</tr>                                                        ' +
    '</thead>                                                     ' +
    '<tbody>                                                     '
  for (line in lines) {

    if (lines[line]["enabled-new"] == "Enabled") {
      iconNew = '<i class="fas fa-check-circle" style="color:green;"></i>';
    } else {
      iconNew = '<i class="fas fa-times-circle" style="color:red;"></i>';
    }

    if (lines[line]["enabled-old"] == "Enabled") {
      iconOld = '<i class="fas fa-check-circle" style="color:green;"></i>';
    } else {
      iconOld = '<i class="fas fa-times-circle" style="color:red;"></i>';
    }

    if (lines[line]["enabled-old"] == "N/A") {
      iconOld = '';
    }
    if (lines[line]["enabled-new"] == "N/A") {
      iconNew = '';
    }

    isEmptyRulesets = false;
    html = html + '<tr><td style="word-wrap: break-word;">' +
      lines[line]["sid"] +
      '</td><td style="word-wrap: break-word;">                                                            ' +
      iconNew +
      '</td><td style="word-wrap: break-word;">                                                            ' +
      '<p id="' + line + '-new">' + lines[line]["new"] + '</p>                                        ' +
      '</td><td style="word-wrap: break-word;">                                                            ' +
      iconOld +
      '</td><td style="word-wrap: break-word;">                                                            ' +
      '<p id="' + line + '-old">' + lines[line]["old"] + '</p>' +
      '</tr>'
  }

  html = html +
    '</tbody></table>';
  // '<button type="button" class="btn btn-primary" onclick="createNewFile()">Create New File</button>';

  if (isEmptyRulesets) {
    return '<div style="text-align:center"><h3>Both files are equals</h3></div>';
  } else {
    return html;
  }
}

function loadJSONdata() {
  $.getJSON('../conf/ui.conf', function (data) {
    //token check
    var tokens = document.cookie.split(".");
    if (tokens.length != 3) {
      document.cookie = "";
    }
    if (document.cookie == "") {
      document.location.href = 'login.html';
    }
    try { payload = JSON.parse(atob(tokens[1])); }
    catch (err) { document.cookie = ""; document.location.href = 'login.html'; }

    //login button
    document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + user
    document.getElementById('loger-user-name').value = user

    var ipLoad = document.getElementById('ip-master');
    ipLoad.value = data.master.ip;
    var portLoad = document.getElementById('port-master');
    portLoad.value = data.master.port;

    compareFiles();
  });
}

loadJSONdata();