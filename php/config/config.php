<?php
function get_connection() {
    static $connection;

    if (!isset($connection)) {
        //the following are placeholders. the dev would have to substitute in
        //the sensitive information themselves
        $connection = mysqli_connect('server address', 'username', 
                                     'password', 'database name')
            or die(mysqli_connect_error());
    }
    if ($connection === false) {
        echo "Connection to database failed";
        echo mysqli_connect_error();
    }
    return $connection;
}
?>
