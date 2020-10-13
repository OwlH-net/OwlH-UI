<?php

$file = "../conf/ui.conf";
$newjson = file_get_contents("php://input");
echo  file_put_contents($file, $newjson);
?>

<!-- // var e = "conf/ui.conf"
// $.ajax({
//     url: e,
//     dataType: "json",
//     success: function(data) {
//     }
// }); -->