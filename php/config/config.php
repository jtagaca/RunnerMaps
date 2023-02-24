<?php
function get_connection() {
    static $connection;

    if (!isset($connection)) {
        // server address, username, password, database name
        $connection = mysqli_connect('localhost', 'jkuo', 'Qac-3Htufo', 'jkuo')
            or die(mysqli_connect_error());
        // $connection = mysqli_connect(
        //     'jtagacasqlserver.mysql.database.azure.com', 
        //     'jkuo', 
        //     'EQip0Jr<Qh#1E}xpLF1"', 
        //     'runner_maps')
        //     or die(mysqli_connect_error());
    }
    if ($connection === false) {
        echo "Connection to database failed";
        echo mysqli_connect_error();
    }
    return $connection;
}
?>


