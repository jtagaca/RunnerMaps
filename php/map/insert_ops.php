<?php
session_start();
require_once("insert_func.php");

if (isset($_POST["uploadJSON"])) {

    if (isset($_POST["buildingName"]) && isset($_POST["floorNumber"]) &&
        isset($_FILES["jsonFile"])) {
    
    
        //need to check for if blank inputs
        // 
        // 
        // 
        // 
        
            
        // receiving json content
        // https://www.geeksforgeeks.org/how-to-receive-json-post-with-php/
        // https://html.form.guide/php-form/html5-input-type-file/
        // https://www.php.net/manual/en/features.file-upload.post-method.php
        // https://www.geeksforgeeks.org/how-to-append-data-in-json-file-through-html-form-using-php/
        // https://stackoverflow.com/questions/18675353/echo-file-get-contents-filesimagetmp-name-doesnt-do-anything
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

        // doesBuildingExist("2");

        
        $buildingExists = doesBuildingAlreadyExist($inputBuildingName);
        // echo $buildingExists;

        if (!$buildingExists) {
            insertIntoBuildings($inputBuildingName, "", "");
        }
        
        $insertBuildingID = getBuildingID($inputBuildingName);
        // echo $insertBuildingID;
        // echo $insertBuildingID;

        $floorExists = doesFloorAlreadyExist($inputBuildingName, $inputFloorNumber);
       
        // echo "insert: $insertBuildingID.";

        if ($floorExists) {
            $_SESSION["insert_error"] = "floor data already exists in database";
            echo $_SESSION["insert_error"];
        }
        else {
            insertIntoFloors($inputBuildingName, $inputFloorNumber, $inputGridColumnLength, $inputGridRowLength);
            $insertFloorID = getFloorID($inputBuildingName, $inputFloorNumber);
        // echo $insertFloorID;

            foreach($targetLocations as $rowNumber => $entireRow) {
                // print_r($rowData);
                // echo "<br><br>";
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
                $inputLatitude = $entireRow->latitude;
                $inputLongitude = $entireRow->longitude;
                $inputImage= $entireRow->image_url;
                $inputName = $entireRow->name;

                // insertIntoIndoorLocations($insertFloorID, $inputRow, $inputCol, $inputImage, $inputLatitude, $inputLongitude, $name, "");

                // print_r($nameInput);
                // echo "<br><br>";
            }

            foreach($markers as $rowNumber => $entireRow) {
                // print_r($rowData);
                // echo "<br><br>";
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
                $inputLatitude = $entireRow->latitude;
                $inputLongitude = $entireRow->longitude;
                $inputImage= $entireRow->image_url;
                $inputName = $entireRow->name;

                insertIntoMarkers($insertFloorID, $inputRow, $inputCol, $inputImage, $inputLatitude, $inputLongitude);

                // print_r($inputRow);
                // echo "<br><br>";
            }

            foreach($walls as $rowNumber => $entireRow) {
                // print_r($rowData);
                // echo "<br><br>";
                
                $inputRow = $entireRow->row;
                $inputCol = $entireRow->col;
            

                insertIntoWall($insertFloorID, $inputRow, $inputCol);

                // print_r($inputRow);
                // echo "<br><br>";
            }


            //object method:
            // $decodedJSON = json_decode($fileContent);
            // print_r($decodedJSON->gridRowLength);
            // echo "<br><br>";

            // print_r($decodedJSON->gridColumnLength);
            // echo "<br><br>";

            // print_r($decodedJSON->target_locations);
            // echo "<br><br>";

            // print_r($decodedJSON->markers);
            // echo "<br><br>";

            // print_r($decodedJSON->walls);
            // echo "<br><br>";

            // print_r($decodedJSON->target_locations[0]);
            // echo "<br><br>";
            
            // print_r($decodedJSON->target_locations[0] -> row);
            // echo "<br><br>";

            


            //associative array method:
            // $decodedJSON = json_decode($fileContent, true);

            // $gridRowLength = $decodedJSON["gridRowLength"];
            // $gridColumnLength = $decodedJSON["gridColumnLength"];
            // $targetLocations = $decodedJSON["target_locations"];
            // $markers = $decodedJSON["markers"]; 
            // $walls = $decodedJSON["walls"];

            // foreach($targetLocations as $rowNumber => $rowData) {
            //     foreach($rowData as $key => $value) {
            //         echo "key: <br>";
            //         print_r($key);
            //         echo "<br>";
            //         echo "value: <br>";
            //         print_r($value);
            //         echo "<br>";
            //         echo "<br>";
            //     }
            // }
        }
    }
    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";

        // print_r($_POST["buildingName"]);
        // print_r($_POST["floorNumber"]);
        // print_r($_POST["jsonFile"]);
    }
    }
    
    // header("Location: insert_page.php");
    
    ?>

<!-- 
<?php
// https://www.php.net/manual/en/features.file-upload.post-method.php
// $uploaddir = '/var/www/uploads/';
// $uploadfile = $uploaddir . basename($_FILES['userfile']['name']);

// echo '<pre>';
// if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadfile)) {
//     echo "File is valid, and was successfully uploaded.\n";
// } else {
//     echo "Possible file upload attack!\n";
// }

// echo 'Here is some more debugging info:';
// print_r($_FILES);

// print "</pre>";

?> -->
