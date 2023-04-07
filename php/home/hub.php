<?php
session_start();
require_once("../auth/logout.php");
?>

<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Campus Map Hub</title>
    </head>

    <body>
        <h1>Campus Map Hub</h1>
        
        <h2>
        <a href="../map/insert_page.php"> Insert a Map </a>
        </h2>

        <h2>
        <a href="../map/delete_page.php"> Delete a Map </a>
        </h2>

        <h2>
        <a href="../category/delete_page.php"> Delete an Indoor Location </a>
        </h2>

        <h2>
        <a href="../settings/settings_page.php"> User Settings </a>
        </h2>

    </body>
    
</html>