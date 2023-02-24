<?php session_start(); ?>

<?php
session_start();

if (isset($_SESSION["error"])) {
    $errorMsg = $_SESSION["error"];
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
            <input type="text" name="email" placeholder="someone@example.com">
            <br><br>
            <p>Choose a Username</p>
            <input type="text" name="username" value="<?=$_SESSION["registerUsername"]?>" placehodler="username"> 
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
        <br> <br>
        <a href="../index.php"> Log In Instead </a>

    </body>

</html>