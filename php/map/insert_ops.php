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

        // if (is_uploaded_file($_FILES['jsonFile'])) {
        //     echo 2;
            
        // }

        // $inputJSONFile = file_get_contents('php://input');
        $inputJSONFile = $_FILES['jsonFile']["tmp_name"];
    
        print_r($inputJSONFile);
        // var_dump($inputJSONFile);
        
        $fileContent = file_get_contents($inputJSONFile);
        print_r($fileContent);
        
        



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
