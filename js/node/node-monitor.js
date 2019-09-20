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
                '<tbody>'+
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
    '</div>';

   
    document.getElementById('master-table-plugins').innerHTML = html;

    PingMonitor(uuid);
    var myVar = setInterval(function(){PingMonitor(uuid)}, 5000);

    $('#show-collector-info').click(function(){ showCollector(uuid);});
    $('#show-ports-plugin').click(function(){ showPorts(uuid);});
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
