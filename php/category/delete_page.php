<?php
session_start();
require_once("delete_func.php");
// require_once("../settings/style_sheet.php");
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

        <h1>Campus Map</h1>
        <h2>Delete Indoor Locations</h2>
        
        <?php
            $floorPlans = fetchFloorPlans();
            // print_r($floorPlans);
            foreach ($floorPlans as $floorPlan) {
                // print_r($floorPlan);
                $floorID = $floorPlan["floorID"];
                // echo $floorID;

                $locations = fetchIndoorLocationsByFloorID($floorID);
                // print_r($locations);

                $buildingName = $floorPlan["buildingName"];
                $floorNumber = $floorPlan["floorNumber"];
                $table_heading = "<h3>$buildingName: floor $floorNumber </h3>";
                $table_start = "<table>
                                <tr>
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