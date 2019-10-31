function loadJSONdata(){
    $.getJSON('../conf/ui.conf', function(data) {
        var ipLoad = document.getElementById('ip-master');
        ipLoad.value = data.master.ip;
        var portLoad = document.getElementById('port-master');
        portLoad.value = data.master.port;
        loadPlugins();
        loadTitleJSONdata();
    });
}
loadJSONdata();

function loadPlugins(){
    var urlWeb = new URL(window.location.href);
    var name = urlWeb.searchParams.get("node");
    var uuid = urlWeb.searchParams.get("uuid");
    document.getElementById('node-config-title').innerHTML = name;

    var html =
    //CHARTS
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'monitor\', \''+uuid+'\')"><b>Node monitor</b> <i class="fas fa-sort-down" id="monitor-form-icon-'+uuid+'"></i></h6>'+
        '<span id="monitor-form-'+uuid+'" style="display:block"><br>'+
            '<table width="100%" style="table-layout: fixed">'+
                '<tbody id="chart-content">'+
                    '<tr>'+
                            '<div>'+
                                '<td style="word-wrap: break-word;" valign="top" width="50%"><canvas id="myChartPercentage"></canvas></td>'+
                            '</div>'+
                            '<div>'+
                                '<td style="word-wrap: break-word;" valign="top" width="50%"><canvas id="myChartOwlh"></canvas></td>'+
                            '</div>'+
                    '</tr>'+
                    '<tr>'+
                            '<div>'+
                                '<td style="word-wrap: break-word;" valign="top" width="50%"><canvas id="myChartMem"></canvas></td>'+
                            '</div>'+
                            '<div>'+
                                '<td style="word-wrap: break-word;" valign="top" width="50%"><canvas id="myChartSto"></canvas></td>'+
                            '</div>'+
                    '</tr>'+
                '</tbody>'+
            '</table>'+
        '</span>'+
    '</div>'+

    //FILES
    '<div class="my-3 p-3 bg-white rounded shadow-sm">'+
        '<h6 class="border-bottom border-gray pb-2 mb-0" style="color: black;" onclick="showActions(\'files\', \''+uuid+'\')"><b>Node files</b> <i class="fas fa-sort-down" id="files-form-icon-'+uuid+'"></i></h6>'+
        '<span id="files-form-'+uuid+'" style="display:block"><br>'+
            '<button type="button" class="btn btn-primary float-right" style="font-size: 15px;" onclick="AddMonitorFileModal(\''+uuid+'\')">Add file</button><br><br>'+
            '<table width="100%" style="table-layout: fixed" class="table table-hover">'+
                '<thead>'+
                    '<tr>'+
                        '<th>Path</th>'+
                        '<th width="15%">Status</th>'+
                        '<th width="20%">Actions</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody id="file-data-monitor">'+
                '</tbody>'+
            '</table>'+
        '</span>'+
    '</div>';
   
    document.getElementById('master-table-plugins').innerHTML = html;

    PingMonitor(uuid);
    PingMonitorFiles(uuid);
    var myVar = setInterval(function(){PingMonitor(uuid)}, 5000);

    $('#show-collector-info').click(function(){ showCollector(uuid);});
    $('#show-ports-plugin').click(function(){ showPorts(uuid);});
}

function AddMonitorFileModal(uuid){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML =
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
  
        '<div class="modal-header" style="word-break: break-all;">'+
          '<h4 class="modal-title">Add new file</h4>'+
          '<button type="button" class="close" id="add-file-modal-cross">&times;</button>'+
        '</div>'+
  
        '<div class="modal-body" style="word-break: break-all;">'+
          '<p>Insert the path for add this file.</p>'+
          '<input type="text" class="form-control" id="new-file-path" value="" required>'+
        '</div>'+
  
        '<div class="modal-footer" id="sync-node-footer-btn" style="word-break: break-all;">'+
          '<button type="button" class="btn btn-secondary" id="add-file-modal-close">Cancel</button>'+
          '<button type="button" class="btn btn-primary" id="add-file-modal">Add</button>'+
        '</div>'+
  
      '</div>'+
    '</div>';
    $('#modal-window').modal("show");
    $('#add-file-modal').click(function(){ AddMonitorFile(uuid, document.getElementById('new-file-path').value); });
    $('#add-file-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#add-file-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function ModalDeleteMonitorFile(uuid, file,path){
    var modalWindow = document.getElementById('modal-window');
    modalWindow.innerHTML =
    '<div class="modal-dialog">'+
      '<div class="modal-content">'+
  
        '<div class="modal-header" style="word-break: break-all;">'+
          '<h4 class="modal-title">Add new file</h4>'+
          '<button type="button" class="close" id="add-file-modal-cross">&times;</button>'+
        '</div>'+
  
        '<div class="modal-body" style="word-break: break-all;">'+
          '<p>Do you want to delete this file?</p>'+
          '<p><b>'+path+'</b></p>'+
        '</div>'+
  
        '<div class="modal-footer" id="sync-node-footer-btn" style="word-break: break-all;">'+
          '<button type="button" class="btn btn-secondary" id="add-file-modal-close">Cancel</button>'+
          '<button type="button" class="btn btn-danger" id="add-file-modal">Delete</button>'+
        '</div>'+
  
      '</div>'+
    '</div>';
    $('#modal-window').modal("show");
    $('#add-file-modal').click(function(){ DeleteMonitorFile(uuid, file); });
    $('#add-file-modal-close').click(function(){ $('#modal-window').modal("hide");});
    $('#add-file-modal-cross').click(function(){ $('#modal-window').modal("hide");});
}

function DeleteMonitorFile(uuid, file){
    $('#modal-window').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/monitor/deleteFile';


    var jsonSave = {}
    jsonSave["uuid"] = uuid;
    jsonSave["file"] = file;
    var dataJSON = JSON.stringify(jsonSave);
    axios({
        method: 'delete',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
    })
    .catch(function (error) {
    });
}

function AddMonitorFile(uuid, path){
    $('#modal-window').modal("hide");
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/monitor/addFile';


    var jsonSave = {}
    jsonSave["uuid"] = uuid;
    jsonSave["path"] = path;
    var dataJSON = JSON.stringify(jsonSave);
    axios({
        method: 'post',
        url: nodeurl,
        timeout: 30000,
        data: dataJSON
    })
    .then(function (response) {
        loadPlugins();
    })
    .catch(function (error) {
    });
}

function PingMonitorFiles(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/monitor/pingMonitorFiles/' + uuid;
    var html = "";
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){
            document.getElementById('file-data-monitor').innerHTML= '<p style="color:red;">There are no files</p>'
        }else{
            for (file in response.data){
                html = html + '<tr>'+
                    '<td style="word-wrap: break-word;" id="'+file+'-monitor-files">'+response.data[file]["path"]+'</td>'+
                    '<td style="word-wrap: break-word;" id="monitor-file-column-'+file+'">';
                    if(response.data[file]["size"] < 0){
                        html = html +'<span id="monitor-file-status-'+file+'" class="badge badge-pill bg-danger align-text-bottom text-white">&nbsp</span>';
                    }else{
                        if(response.data[file]["size"]<1024){html = html +'<span id="monitor-file-status-'+file+'" class="badge badge-pill bg-success align-text-bottom text-white">'+response.data[file]["size"].toFixed(2)+' Bytes</span>';}
                        if(response.data[file]["size"]>=1024 && response.data[file]["size"]<1048576){html = html +'<span id="monitor-file-status-'+file+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1024).toFixed(2)+' kB</span>';}
                        if(response.data[file]["size"]>=1048576 && response.data[file]["size"]<1073741824){html = html +'<span id="monitor-file-status-'+file+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1048576).toFixed(2)+' MB</span>';}
                        if(response.data[file]["size"]>=1073741824){html = html +'<span id="monitor-file-status-'+file+'" class="badge badge-pill bg-success align-text-bottom text-white">'+(response.data[file]["size"]/1073741824).toFixed(2)+' GB</span>';}
                    }
                    html = html + '</td>'+
                    '<td style="color:grey; word-wrap: break-word;">';
                        if(response.data[file]["size"] >=0){
                            html = html + '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'10\', \''+response.data[file]["path"]+'\')">10</span> &nbsp'+
                            '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'50\', \''+response.data[file]["path"]+'\')">50</span> &nbsp'+
                            '<span style="cursor:pointer;" class="badge badge-pill bg-secondary align-text-bottom text-white" onclick="LoadPageLastLines(\''+uuid+'\', \'100\', \''+response.data[file]["path"]+'\')">100</span> &nbsp';
                        }
                        html = html + '<i class="fas fa-trash-alt" style="color:red;cursor: pointer;" onclick="ModalDeleteMonitorFile(\''+uuid+'\', \''+file+'\', \''+response.data[file]["path"]+'\')"></i>'+
                    '</td>'+
                '<tr>';
            }
            document.getElementById('file-data-monitor').innerHTML= html;
        }
    })
    .catch(function (error) {
    });

}

function LoadPageLastLines(uuid, line, path) {
    var ipmaster = document.getElementById('ip-master').value;
    document.location.href = 'https://' + ipmaster + '/load-content.html?uuid='+uuid+'&line='+line+'&path='+path;
}

function PingMonitor(uuid){
    var ipmaster = document.getElementById('ip-master').value;
    var portmaster = document.getElementById('port-master').value;
    var nodeurl = 'https://'+ ipmaster + ':' + portmaster + '/v1/node/pingmonitor/' + uuid;
    var html = "";
    axios({
        method: 'get',
        url: nodeurl,
        timeout: 30000
    })
    .then(function (response) {
        if (response.data.ack == "false"){            
            document.getElementById('chart-content').innerHTML = '<h5 class="text-center" style="color:red;">The are no information due to node connection...</h5>';

        }else{
            var CPUvalues = [];
            var CPUpercentage = [];
            for(x in response.data.cpus){
                CPUvalues.push("CPU: "+x);
                CPUpercentage.push(parseFloat(response.data.cpus[x].percentage).toFixed(2));
            }
    
            //CPU USE PERCENTAGE
            var ctx_cpu = document.getElementById('myChartPercentage').getContext('2d');
            var chart = new Chart(ctx_cpu, {
                type: 'bar',
    
                data: {
                    scaleOverride : true,
                    labels: CPUvalues,
                    datasets: [{
                        label: 'CPU percentage usage',
                        backgroundColor: 'rgb(36, 138, 216)',
                        borderColor: 'rgb(208, 91, 91)',
                        data: CPUpercentage
                    }]
                },
                options: {
                    animation: false,
                    layout: {padding: {left: 0,right: 50,top: 0,bottom: 0}},
                    responsive: true,
                    maintainAspectRatio: true,
                    // title: {
                    // 	display: true,
                    // 	text: 'Min and Max Settings'
                    // },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Percentage'
                            },
                            ticks: {
                                beginAtZero: true,
                                min: 0,
                                max: 100,
                            }
                        }],
                        xAxes: [{
                            barPercentage: 0.3
                        }]
                    }
                }
            });
    
            //MEMORY STATS
            var ctx_owlh = document.getElementById('myChartOwlh').getContext('2d');
            var chart = new Chart(ctx_owlh, {
                type: 'bar',
                data: {
                    labels: ['Total alloc', 'alloc', 'gc', 'sys'],
                    datasets: [{
                        label: 'MEMORY OwlH stats',
                        backgroundColor: ['rgb(48,216,36)','rgb(216,150,36)','rgb(36,168,216)','rgb(216,36,54)'],
                        borderColor: 'rgb(255, 255, 255)',
                        data: [
                                parseFloat(response.data.mem.totalalloc).toFixed(2),
                                parseFloat(response.data.mem.alloc).toFixed(2),
                                parseFloat(response.data.mem.gc).toFixed(2),
                                parseFloat(response.data.mem.sys).toFixed(2)
                            ],
                        }
                    ],
                },
                options: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: {padding: {left: 50,right: 0,top: 0,bottom: 0}},
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Memory in MiB'
                            },
                            ticks: {
                                beginAtZero: true,
                                // min: 0,
                                // max: 5000,
                                // maxTicksLimit: 5
                            }
                        }]
                    }
                }
            });
            //MEMORY STATS
            var ctx_mem = document.getElementById('myChartMem').getContext('2d');
            var chart = new Chart(ctx_mem, {
                type: 'doughnut',
                data: {
                    labels: ['MEMORY used', 'MEMORY free'],
                    datasets: [{
                        label: 'MEMORY stats',
                        backgroundColor: ['rgb(216,36,54)','rgb(48,216,36)'],
                        borderColor: 'rgb(255, 255, 255)',
                        data: [
                            parseFloat(response.data.mem.usedmem).toFixed(2),
                            parseFloat(response.data.mem.freemem).toFixed(2)
                        ]
                    }]
                },
                options: {
                    animation: false,
                    layout: {padding: {left: 0,right: 50,top: 50,bottom: 0}},
                    responsive: true,
                    maintainAspectRatio: true,
                }
            });
            //STORAGE STATS
            var ctx_sto = document.getElementById('myChartSto').getContext('2d');
            var chart = new Chart(ctx_sto, {
                type: 'doughnut',
                data: {
                    labels: ['STORAGE used','STORAGE free'],
                    datasets: [{
                        label: 'STORAGE stats',
                        backgroundColor: ['rgb(216,36,54)','rgb(48,216,36)'],
                        borderColor: 'rgb(255, 255, 255)',
                        data: [
                            parseFloat(response.data.disk.useddisk).toFixed(2),
                            parseFloat(response.data.disk.freedisk).toFixed(2)
                        ]
                    }]
                },
                options: {
                    layout: {
                        padding: {left: 50,right: 0,top: 50,bottom: 0}
                    },
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: true,
                }
            });
    
            ctx_cpu.render();
            ctx_owlh.render();
            ctx_mem.render();
            ctx_sto.render();
        }
    })
    .catch(function (error) {
    });
}

function showActions(action,uuid){
    var addnids = document.getElementById(action+'-form-'+uuid);
    var icon = document.getElementById(action+'-form-icon-'+uuid);
    if (addnids.style.display == "none") {
        addnids.style.display = "block";
        icon.classList.add("fa-sort-up");
        icon.classList.remove("fa-sort-down");
    } else {
        addnids.style.display = "none";
        icon.classList.add("fa-sort-down");
        icon.classList.remove("fa-sort-up");
    }
}
