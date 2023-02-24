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
        <h2>Log In</h2>
        
        <form action="auth/login.php" method="POST">
            <input type="text" name="username" value="<?=$_SESSION["loginUsername"]?>" placehodler="username"> 
            <input type="password" name="password" placeholder="*****">
            <input type="submit" name="login" value="Log In">
        </form>
        <br><br>
        <a href="auth/reset_password_page.php"> Forgot Password </a>
        <br> <br>
        <a href="auth/register_page.php"> Register an Account </a>

    </body>

</html>