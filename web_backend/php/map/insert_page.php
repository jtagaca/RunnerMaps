<?php
session_start();
require_once("../auth/logout.php");


if (isset($_SESSION["error"])) {
    $errorMsg = $_SESSION["error"];
}
if (isset($_SESSION["success_message"])) {
    $success_message = $_SESSION["success_message"];
}


?>


<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Campus Map</title>
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
        <h2>Insert a Map</h2>
        <!-- https://gomakethings.com/how-to-upload-and-
                                    process-a-json-file-with-vanilla-js/ -->
        <!-- https://www.php.net/manual/en/
                                    features.file-upload.post-method.php -->
        <form action="insert_ops.php" method="POST" 
                                            enctype="multipart/form-data">

            <label for="buildingName">Building Name:</label> 
            <br>
            <input type="text" name="buildingName">
            <br><br>

            <!-- could eventually auto-generate floor numbers -->
            <label for="floorNumber">Floor Number:</label> 
            <br>
            <input type="text" name="floorNumber" accept="numbers">
            <br><br>
        
            <label for="jsonFile">Upload the JSON File</label>
            <br>
            <!-- thought about limiting file size but didn't in the end -->
            <!-- <input type="hidden" name="MAX_FILE_SIZE" value="30000"> -->
            <input type="file" name="jsonFile" accept=".json">
            <br><br><br>

            <input type="submit" name="uploadJSON" value="Upload">
        </form>

        <br><br>
        <p style="color:red"><?=$errorMsg?></p>
        <p style="color:green"><?=$success_message?></p>
        <br> <br>
        
        <?php 
        unset($_SESSION["error"]); 
        unset($_SESSION["success_message"]);
        ?>

    </body>

</html>

