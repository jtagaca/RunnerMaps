<?php
session_start();
?>


<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Campus Map</title>
    </head>

    <body>
        <h1>Campus Map</h1>
        <h2>Insert a Map</h2>
        
        <!-- https://gomakethings.com/how-to-upload-and-process-a-json-file-with-vanilla-js/ -->
        <!-- https://www.php.net/manual/en/features.file-upload.post-method.php -->
        <form action="insert_ops.php" method="POST" enctype="multipart/form-data">

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
            <!-- <input type="hidden" name="MAX_FILE_SIZE" value="30000"> -->
            <input type="file" name="jsonFile" accept=".json">
            <br><br><br>

            <input type="submit" name="uploadJSON" value="Upload">
        </form>


    </body>

</html>

