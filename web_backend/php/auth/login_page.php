<?php
session_start();
require_once("../settings/settings_func.php");
require_once("../settings/style_sheet.php");

// log in form
if (isset($_SESSION["authorized"])) {
    if ($_SESSION["authorized"] === true) {
        header("Location: ../home/hub.php");
    }
}

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
        <div>
        <a href="../auth/login_page.php"><img src="../images/csub.png" alt="school logo" height="50px" style="display: inline;">
            <h1 style="display: inline; margin: 30px 5px">Campus Map</h1></a>
        </div>
        <h2>Log In</h2>
        <form action="login_ops.php" method="POST">
            <p>Username</p>
            <input type="text" name="username" value="<?=$_SESSION["loginUsername"]?>" placeholder="username"> 
            <br><br>
            <p>Password</p>
            <input type="password" name="password" placeholder="*****">
            <br><br>
            <br>
            <input type="submit" name="login" value="Log In">
        </form>
        <br><br>
        <p style="color:red"><?=$errorMsg?></p>
        <p style="color:green"><?=$success_message?></p>
        <br> <br>
        <a href="register_page.php"> Register Instead </a>

        <?php 
        unset($_SESSION["error"]); 
        unset($_SESSION["success_message"]);
        ?>

    </body>
    
</html>