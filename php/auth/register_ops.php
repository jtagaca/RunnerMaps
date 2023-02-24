<?php
session_start();
require_once("../config/config.php");

// function register($username, $password, $userType, $email_username, $email_domain) {
function register($username, $password, $userType, $email) {
    $db = get_connection();

    // print_r($db);

    $hashed = password_hash($password, PASSWORD_DEFAULT);

    // echo "hashed: $hashed <br>";
    echo "hashed: $hashed <br> username: $username <br> usertype: $userType <br> email: $email <br>";

    $command = $db->prepare("INSERT INTO users (`password`, `username`, `userType`, `email`) VALUES (?, ?, ?, ?)");
    // $command = $db->prepare("Call RegisterUser(?, ?, ?, ?)");

    echo "after prepare, before binding <br>";

    // print_r($db);
    $command->bind_param('ssss', $hashed, $username, $userType, $email);

    echo "after binding, before executing <br>";

    echo "$hashed and <br> $username and <br> $userType and <br> $email <br>";

    if (!$command->execute()) {
        die(mysqli_error($db) . "<br>");
    }

    echo "executed <br>";

    // $fetchedResult = $command->get_result();

    // while ($row = $fetchedResult->fetch_assoc()) {
    //     $output = $row["Result"];
    //     $error = $row["Error"];

    //     if ($output == "true") {
    //         $_SESSION["result"] = "Registration Successful.";
    //     }
    //     else {
    //         $_SESSION["error"] = $error;
    //     }
    // }
}

if (isset($_POST["register"])) {

    if (isset($_POST["email"]) && isset($_POST["username"]) &&
        isset($_POST["password"]) && isset($_POST["password_confirm"])) {

        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];
        $password_confirm = $_POST["password_confirm"];

        if ($password !== $password_confirm) {
            $_SESSION["error"] = 
                "the retyped password and password do not match <br>";
        } 
        else {
            $userType = "supervisor";

            echo "before calling register <br>";
            register($username, $password, $userType, $email);
            echo "after calling register <br>";
            $_SESSION["success_message"] = "Account successfully created. Username: $username";
        }
    }
    else {

        echo "if fields are not entered";
        $_SESSION["error"] = "make sure all fields are entered <br>";
    }
}

echo "before redirecting <br>";
header("Location: register_page.php");

?>