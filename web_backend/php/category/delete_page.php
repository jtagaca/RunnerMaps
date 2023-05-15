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
        <h2>Delete Indoor Locations</h2>
        
        <?php
            // generate the tables
            $floorPlans = fetchFloorPlans();

            foreach ($floorPlans as $floorPlan) {
                $floorID = $floorPlan["floorID"];

                $locations = fetchIndoorLocationsByFloorID($floorID);

                $buildingName = $floorPlan["buildingName"];
                $floorNumber = $floorPlan["floorNumber"];
                $table_heading = "<h3>$buildingName: floor $floorNumber </h3>";
                $table_start = "<table>
                                <tr>
                                    <th>Location ID</th>
                                    <th>Location Name</th>
                                    <th>Service</th>
                                    <th>Delete</th>
                                </tr>";

                $table_end = "</table>";
                
                echo $table_heading;
                echo $table_start;

                foreach($locations as $location) {
                    printIndoorLocations($location);
                }

                echo $table_end;
            }
        ?>

        
        <?php
            
        ?>


    </body>

</html>