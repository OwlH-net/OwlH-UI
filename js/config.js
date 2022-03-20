function loadFileIntoTextarea() {
  content = document.getElementById('master-table-config');
  content.innerHTML =
    '<br>' +
    '<div class="my-3 p-3 bg-white rounded shadow-sm">' +
    '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'conn\')"><b>Master connection <i class="fas fa-sort-down" id="conn-form-icon"></i></b> </h6>' +
    '<span id="conn-form-span">' +
    '<br>' +
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
    '<tr>' +
    '<th>Ip</th>' +
    '<th>Port</th>' +
    '<th>Check</th>' +
    '</tr>' +
    '<tr>' +
    '<td id="file-ip"></td>' +
    '<td id="file-port"></td>' +
    '<td><a id="check-status-config" href="" class="btn btn-success float-center" target="_blank">Check Master API connection</a></td>' +
    '</tr>' +
    '</table>' +
    '</span>' +
    '</div>' +

    '<div id="admin-users-btn" style="display: none;" class="my-3 p-3 bg-white rounded shadow-sm">' +
    '<h6 class="border-bottom border-gray pb-2 mb-0" onclick="showActions(\'user-admin\')"><b>Administration <i class="fas fa-sort-down" id="user-admin-form-icon"></i></b> </h6>' +
    '<span id="user-admin-form-span">' +
    '<br>' +
    '<table class="table table-hover" style="table-layout: fixed" style="width:1px">' +
    '<tr>' +
    '<td width="35%">Users, groups and roles administration panel</td>' +
    '<td><button type="button" class="btn btn-primary float-left" onclick="adminUsers()">Admin users</button></td>' +
    '</tr>' +
    '</table>' +
    '</span>' +
    '</div>';

  $.getJSON('../conf/ui.conf', function (data) {
    document.getElementById('file-ip').innerHTML = data.master.ip;
    document.getElementById('file-port').innerHTML = data.master.port;
  });
}

function showActions(action) {
  var spanContent = document.getElementById(action + '-form-span');
  var icon = document.getElementById(action + '-form-icon');
  if (spanContent.style.display == "none") {
    spanContent.style.display = "block";
    icon.classList.add("fa-sort-up");
    icon.classList.remove("fa-sort-down");
  } else {
    spanContent.style.display = "none";
    icon.classList.add("fa-sort-down");
    icon.classList.remove("fa-sort-up");
  }
}

function checkStatus() {
  var ipmaster = document.getElementById('ip-master').value;
  var portmaster = document.getElementById('port-master').value;
  var nodeurl = 'https://' + ipmaster + ':' + portmaster + '/v1/home';
  document.getElementById('check-status-config').href = nodeurl;
}

function adminUsers() {
  document.location.href = 'users.html';
}

function loadJSONdata() {
  $.getJSON('../conf/ui.conf', function (data) {
    document.getElementById('dropdownMenuUser').innerHTML = document.getElementById('dropdownMenuUser').innerHTML + user
    document.getElementById('loger-user-name').value = user
    if (user == "admin") {
      $("#admin-users-btn").show();
    }
  });
}

loadJSONdata();
loadFileIntoTextarea();
