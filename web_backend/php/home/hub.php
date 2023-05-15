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
        <div>
            <a href="../auth/login_page.php"><img src="../images/csub.png" 
            alt="school logo" height="50px" style="display: inline;"></a>
            <h1 style="display: inline; margin: 30px 5px">Campus Map Hub</h1>
        </div>
        
        
        <h2>
        <a href="../map/insert_page.php"> Insert a Map </a>
        </h2>

        <h2>
        <a href="../map/delete_page.php"> View Maps </a>
        </h2>
    

        <h2>
            <a href="../category/delete_page.php"> View Indoor Locations </a>
        </h2>
        

        <h2>
        <a href="../category/insert_page.php"> Category Hub </a>
        </h2>
        
        <br>
        
        <h2>
        <a href="../settings/settings_page.php"> User Settings </a>
        </h2>



    </body>
    
</html>