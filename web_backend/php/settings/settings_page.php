<?php
session_start();
require_once("../auth/logout.php");
// require_once("../settings/style_sheet.php");


if (isset($_SESSION["error"])) {
    $errorMsg = $_SESSION["error"];
}
if (isset($_SESSION["success_message"])) {
    $success_message = $_SESSION["success_message"];
}

// echo $_SESSION["authorized"];

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

        <h1>Campus Map</h1>
        <h2>User Settings</h2>

        <form action="settings_ops.php" method="POST">

            Font Size:
            <input type="number" name="fontSize" value="<?=$_SESSION['fontSize'];?>"><br><br>
            Font Color:
            <input type="color" name="fontColor" value="<?=$_SESSION['fontColor'];?>"><br><br>
            Background Color:
            <input type="color" name="backgroundColor" value="<?=$_SESSION['backgroundColor'];?>"><br><br>
            Border Color:
            <input type="color" name="borderColor" value="<?=$_SESSION['borderColor'];?>"><br><br>
            

            <input style="background-color: #78AD9E;" type="submit" name="updateSettings" value="Update Settings"> 
            <input style="background-color: lightpink;" type="submit" name="restoreSettings" value="Restore to Default Settings">
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


    