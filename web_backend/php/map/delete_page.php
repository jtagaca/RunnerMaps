<?php
session_start();
require_once("delete_func.php");
require_once("../auth/logout.php");
?>

<!DOCTYPE html>

<html lang="en">

    <head>

        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width,initial-scale=1">
    
        <title>View Maps</title>

    </head>

    <body>
        <h3>
        <a href="../home/hub.php"> Back to Hub </a>
        </h3>
        <br><br>

        <div>
            <a href="../auth/login_page.php"><img src="../images/csub.png" 
                alt="school logo" height="50px" style="display: inline;"></a>
            <h1 style="display: inline; margin: 30px 5px">Campus Map</h1>
        </div>
        <h2>Delete Floor Plans</h2>
        

        <table>
            <tr>
                <th>Building Name</th>
                <th>Floor Number</th>
                <th>Delete</th>
            </tr>
        <?php
            $floorPlans = fetchFloorPlans();
            foreach ($floorPlans as $floorPlan) {
                printFloorPlan($floorPlan);
            }
        ?>
        </table>

    </body>

</html>