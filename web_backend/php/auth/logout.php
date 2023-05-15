<?php
require_once("../settings/style_sheet.php");

// if (isset($_SESSION["authorized"])) {
//     if ($_SESSION["authorized"] === true) {
//         header("Location: ../home/hub.php");
//     }
// }
if (isset($_POST["logout"])) {
    $_SESSION["authorized"] = false;

    unset($_SESSION["userID"]);
    unset($_SESSION["username"]);
    unset($_SESSION["userEmail"]);
    unset($_SESSION["userType"]);
    unset($_SESSION["departmentID"]);
    unset($_SESSION["style"]);

    unset($_SESSION["fontSize"]);
    unset($_SESSION["fontColor"]);
    unset($_SESSION["backgroundColor"]);
    unset($_SESSION["borderColor"]);

    unset($_SESSION["registerUsername"]);
    unset($_SESSION["registerEmail"]);
    unset($_SESSION["loginUsername"]);
    unset($_SESSION["registrationCode"]);

    $_SESSION = [];
    unset($_SESSION);
}

if (!$_SESSION["authorized"] || !isset($_SESSION["authorized"])) {
    header("Location: ../auth/login_page.php");
}
?>


<form action="<?=$_SERVER['PHP_SELF']?>" method="POST">
    <input class=logout type="submit" name="logout" value="Log Out">
</form>

<!-- <div>
    <a href="../auth/login_page.php"><img src="../images/csub.png" alt="school logo" height="50px" style="display: inline;"></a>
    <h1 style="display: inline; margin: 30px 5px">Campus Map</h1>
</div> -->