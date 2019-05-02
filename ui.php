<?php

$file = "conf/ui.conf";
$newjson = file_get_contents("php://input");
echo  file_put_contents($file, $newjson);
?>