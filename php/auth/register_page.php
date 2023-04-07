<?php
session_start();

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
        <h1>Campus Map</h1>
        <h2>Register</h2>
        
        <form action="register_ops.php" method="POST">
            <p>Email Address:</p>
            <input type="text" name="email" value="<?=$_SESSION["registerEmail"]?>" placeholder="someone@example.com">
            <!-- <input type="text" name="email_username" placeholder="someone"> <span>@</span>
            <input type="text" name="email_domain" placeholder="example.com"> -->
            <br><br>
            <p>Choose a Username</p>
            <input type="text" name="username" value="<?=$_SESSION["registerUsername"]?>" placeholder="username"> 
            <br><br>
            <p>Choose a Password</p>
            <input type="password" name="password" placeholder="*****">
            <br><br>
            <p>Confirm Your Password</p>
            <input type="password" name="password_confirm" placeholder="*****">
            <br><br>
            <br>
            <input type="submit" name="register" value="Register">
        </form>
        <br><br>
        <p style="color:red"><?=$errorMsg?></p>
        <p style="color:green"><?=$success_message?></p>
        <br> <br>
        <a href="login_page.php"> Log In Instead </a>

        <?php 
        unset($_SESSION["error"]); 
        unset($_SESSION["success_message"]);
        ?>

    </body>
    
</html>