<?php
session_start();
require_once("insert_func.php");
require_once("../auth/validation_functions.php");

if (isset($_POST["uploadJSON"])) {

    if (isset($_POST["buildingName"]) && isset($_POST["floorNumber"]) &&
        isset($_FILES["jsonFile"])) {
    
    
        //need to check for if blank inputs
        // 
        // 
        // 
        // 
        
            
        // receiving json content and setting variables
        $inputBuildingName = $_POST["buildingName"];
        $inputFloorNumber = $_POST["floorNumber"];
        
        $inputJSONFile = $_FILES['jsonFile']["tmp_name"];
    
        $fileContent = file_get_contents($inputJSONFile);
        
        $decodedJSON = json_decode($fileContent);
        $inputGridRowLength = $decodedJSON->gridRowLength;
        $inputGridColumnLength = $decodedJSON->gridColumnLength;

        $targetLocations = $decodedJSON->target_locations;
        $markers = $decodedJSON->markers;
        $walls = $decodedJSON->walls;
        
        if(blankTest($inputBuildingName) && blankTest($inputFloorNumber) &&
           blankTest($inputGridRowLength) && blankTest($inputGridColumnLength)) {

        //checks if the building name already exists in the building table
        //if not, insert it before retrieving its ID
            $buildingExists = doesBuildingAlreadyExist($inputBuildingName);

            if (!$buildingExists) {
                insertIntoBuildings($inputBuildingName, "", "");
            }
            
            $insertBuildingID = getBuildingID($inputBuildingName);

            //checks if the floor plan already exists in the floor table
            //if not, insert it before retrieving its ID
            $floorExists = doesFloorAlreadyExist($inputBuildingName, $inputFloorNumber);
        
            if (!$floorExists) {
                insertIntoFloors($inputBuildingName, $inputFloorNumber, $inputGridColumnLength, $inputGridRowLength);
            }

            $insertFloorID = getFloorID($inputBuildingName, $inputFloorNumber);
        
            //could potentially add logic to drop all previous data
            //associated with this floor before inserting this floor plan
            //
            //
            //
            //


            //insert into the indoor_locations table
            foreach($targetLocations as $rowNumber => $entireRow) {
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
                $inputLatitude = $entireRow->latitude;
                $inputLongitude = $entireRow->longitude;
                $inputImage= $entireRow->image_url;
                $inputName = $entireRow->name;
                $inputDescription = "";

                insertIntoIndoorLocations($insertFloorID, $inputRow, $inputCol, $inputImage, $inputLatitude, $inputLongitude, $inputName, $inputDescription);
                // if(blankTest($inputRow) && 
                //    blankTest($inputCol) &&
                //    blankTest($inputLatitude) && 
                //    blankTest($inputLongitude)) 
                //    {
                       
                //    }
            }

            //insert into the markers table
            foreach($markers as $rowNumber => $entireRow) {
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
                $inputLatitude = $entireRow->latitude;
                $inputLongitude = $entireRow->longitude;
                $inputImage= $entireRow->image_url;
                
                insertIntoMarkers($insertFloorID, $inputRow, $inputCol, $inputImage, $inputLatitude, $inputLongitude);
            }

            //insert into the walls table
            foreach($walls as $rowNumber => $entireRow) {
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
            
                insertIntoWalls($insertFloorID, $inputRow, $inputCol);
            }
        }
        else {
            $_SESSION["error"] = "building name, floor number, or grid dimension is null. <br>";
        }
    }

    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";
    }
    }
    
    //redirecting the results back to the form page
    header("Location: insert_page.php");
    
    ?>
