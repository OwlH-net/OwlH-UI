<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="img/favicon.ico">

        <title>OwlH Master</title>

        <!-- Bootstrap core CSS -->
        <link href="../css/dist/css/bootstrap.min.css" rel="stylesheet">

        <!-- fontawesome -->
        <link rel="stylesheet" href="css/fontawesome/css/all.css">


        <!-- Custom styles for this template -->
        <link href="../css/offcanvas.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
        <img class="mr-3" src="../img/owlhblack.png" alt="" height="30"><a class="navbar-brand mr-auto mr-lg-0"
                href="../nodes.html"><small>Master </small><i class="text-warning" id="menu-title"
                ></i> | </a>    
            <!-- <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button> -->
        
        
            <div class="navbar-collapse offcanvas-collapse" id="navbarsExampleDefault">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="../nodes.html">Nodes</a>
                    </li>
                    <li class="nav-item active">
                        <a class="nav-link" href="../rulesets.html">Open Rules</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../response.html">Adapt & Response</a>
                    </li>
                    <!-- <li class="nav-item">
                        <a class="nav-link" href="../kibana.html">Kibana</a>
                    </li> -->
                    <li class="nav-item">
                        <a class="nav-link" href="../config.html">Config</a>
                    </li>
                </ul>
                <p class="text-justify text-white mr-4">Current version: </p><p class="text-justify text-white mr-4" id="current-version-show"></p>
            </div>
        </nav>

        <main role="main" class="container">
            <div>
                <?php
                    //call API with sid
                    //check if sid exists. manage failures.
                    //take a raw rule from API
                    //put raw inside $line
                    $sid = htmlspecialchars($_GET['sid']);
                    $uuid = htmlspecialchars($_GET['fileuuid']);
                    $ipmaster = htmlspecialchars($_GET['ipmaster']);
                    $portmaster = htmlspecialchars($_GET['portmaster']);
                    $url = 'https://'.$ipmaster.':'.$portmaster.'/v1/ruleset/rule/'.$sid.'/'.$uuid;
                    function CallAPI($method, $url, $data = false){
                        $curl = curl_init();
                        switch ($method){
                            case "POST":
                                curl_setopt($curl, CURLOPT_POST, 1);
                    
                                if ($data)
                                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                                break;
                            case "PUT":
                                curl_setopt($curl, CURLOPT_PUT, 1);
                                break;
                            default:
                                if ($data)
                                    $url = sprintf("%s?%s", $url, http_build_query($data));
                        }
                        curl_setopt($curl, CURLOPT_URL, $url);
                        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
                        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
                        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 0);
                        curl_setopt($curl, CURLOPT_TIMEOUT, 300); 
                        
                        $result = curl_exec($curl);
                        curl_close($curl);
                    
                        return $result;
                    }
                    $response = CallAPI("GET", $url, false);
                    
                    $rjson = json_decode($response,true);
                    
                    $line = $rjson["raw"];
                    
                    preg_match('/msg:"([^"]+)"/', $line, $matches);


                    echo '<div class="d-flex align-items-center p-3 my-3 text-white-50 bg-low-blue rounded shadow-sm">
                        <img class="mr-3" src="../img/owlhblack.png" alt="" height="48">
                        <div class="lh-100">
                            <h3 class="mb-0 text-white lh-100"> SID '.$sid.' - '.$matches[1].'</h3>
                            <small>Rule info</small>
                        </div>
                    </div>';
                    
                    echo ' <table align="center" style="width:100%;table-layout:fixed"> <tr> <th colspan="2">Rule detail - RAW</th> </tr> <tr><td colspan="2" style="word-wrap:break-word">';
                    echo $line;
                    echo '<br><br></td></tr>';
                    //echo '<tr><td colspan="2" style="text-align:center"><a href="#">Disable rule</a><br><br><br></td></tr>';
                    echo '</table><table  align="center" style="width:100%;table-layout:fixed">';
                    //preg_match('/([^\(]+)\(([^\)]+)/', $line, $matches);
                    echo "<tr ><th  colspan=\"2\" style=\"border-bottom:2pt solid red\">Match</th></tr>";
                    
                    preg_match('/([^\(]+)\((.*)\)/', $line, $matches);
                    list ($type, $proto, $src, $srcport, $dir, $dst, $dstport) = split (" ",$matches[1]);
                    
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Type</td><td  style=\"border-bottom:1pt solid black;width:75%\">$type</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Proto</td><td  style=\"border-bottom:1pt solid black;width:75%\">$proto</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Source</td><td  style=\"border-bottom:1pt solid black;width:75%;word-wrap:break-word\">$src</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Source PORT</td><td  style=\"border-bottom:1pt solid black;width:75%\">$srcport</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Direction</td><td  style=\"border-bottom:1pt solid black;width:75%\">$dir</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Destination</td><td  style=\"border-bottom:1pt solid black;width:75%;word-wrap:break-word\">$dst</td></tr>"; 
                    echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">Destination PORT</td><td  style=\"border-bottom:1pt solid black;width:75%\">$dstport</td></tr>"; 
                    echo "<tr ><th  style=\"border-bottom:2pt solid red;width:25%\">Key</th><th  style=\"border-bottom:2pt solid red;width:75%\">Value</th></tr>"; 
                    
                    $details = split(";", $matches[2]);
                    foreach ($details as &$detail) {
                    list($key, $value) = split(":", $detail);
                    if (!empty($key)) {
                        echo "<tr ><td  style=\"border-bottom:1pt solid black;width:25%\">$key</td><td  style=\"border-bottom:1pt solid black;width:75%\">$value</td></tr>"; 
                    }
                    }
                    
                    echo '</table>';
                    echo "<br>";
                ?>
            </div>
            <!-- Load master ip/port -->
            <div id="load-json-data" style="display: none;">
                <input id="ip-master" type="text" class="form-control">
                <input id="port-master" type="text" class="form-control">
            </div>
        </main>

        <!-- Bootstrap core JavaScript
        ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->
        <script src="../js/axios/dist/axios.js"></script>
        <!-- <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script>window.jQuery || document.write('<script src="../css/site/docs/4.1/assets/js/vendor/jquery-slim.min.js"><\/script>')</script> -->
        <!-- <script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha26-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script> -->
        <!-- <script src="../css/site/docs/4.1/assets/js/vendor/popper.min.js"></script> -->
        <script src="../css/dist/js/bootstrap.min.js"></script>
        <script src="../js/jquery-3.3.1.js"></script>
        <!-- <script src="../css/site/docs/4.1/assets/js/vendor/holder.min.js"></script> -->
        <script src="../js/offcanvas.js"></script>
        <!-- <script src="../js/ruleset.js"></script> -->
        <script src="../js/loadTitle.js"></script>
    </body>
</html>