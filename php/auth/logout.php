<?php

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

}

if (!$_SESSION["authorized"] || !isset($_SESSION["authorized"])) {
    header("Location: ../auth/login_page.php");
}
?>


<form action="<?=$_SERVER['PHP_SELF']?>" method="POST">
    <input type="submit" name="logout" value="Log Out">
</form>

