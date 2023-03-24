<?php
session_start();
require_once("../config/config.php");
require_once("validation_functions.php");

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
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $_SESSION["success_message"] = "Account successfully created. Username: $username";
    }

    // unset($_POST["username"]);
    // unset($_POST["email"]);
    // unset($_POST["password"]);
    // unset($_POST["password_confirm"]);

    echo "executed <br>";
    header("Location: register_page.php");

    // $fetchedResult = $command->get_result();

    // while ($row = $fetchedResult->fetch_assoc()) {
    //     $output = $row["Result"];
    //     $error = $row["Error"];

    //     if ($output == "true") {
    //         $_SESSION["result"] = "Registration Successful.";
    //     }
    //     else {
    //         // $_SESSION["error"] = $error;
    //     }
    // }
}

if (isset($_POST["register"])) {

    if (isset($_POST["email"]) && isset($_POST["username"]) &&
        isset($_POST["password"]) && isset($_POST["password_confirm"])) {


        //need to check for if blank inputs
        // if () {
        //     echo "if fields are not entered";
        //     $_SESSION["error"] = "make sure all fields are entered <br>";
        // }
        
            
        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];
        $password_confirm = $_POST["password_confirm"];


        $usernameNotBlank = blankTest($username);
        $passwordNotBlank = blankTest($password);
        $emailNotBlank = blankTest($email);
        $usernameLengthValid = lengthTest($username, 4, 12);
        $passwordLengthValid = lengthTest($password, 6, 20);

        if (!$usernameNotBlank || !$passwordNotBlank || !$emailNotBlank ||
            !$usernameLengthValid || !$passwordLengthValid) {
        
            if (!$usernameNotBlank || !$passwordNotBlank || !$emailNotBlank) {
                $_SESSION["error"] = "Make sure all fields are entered <br>";
            }

            if (!$usernameLengthValid) {
                $_SESSION["error"] = $_SESSION["error"] . 
                                    "Usernames need to be 4-12 characters long<br>";

            }

            if (!$usernameLengthValid || !$passwordLengthValid) {
                $_SESSION["error"] = $_SESSION["error"] . 
                                    "passwords need to be 6-20 characters long <br>";

            }
        }

        else {
            if ($password !== $password_confirm) {
                $_SESSION["error"] = $_SESSION["error"] . 
                    "the retyped password and password do not match <br>";
            } 
            else {
                $userType = "supervisor";

                echo "before calling register <br>";
                register($username, $password, $userType, $email);
                echo "after calling register <br>";
                // $_SESSION["success_message"] = "Account successfully created. Username: $username";
            }
        }
    }
    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";
    }
}

echo "before redirecting <br>";
header("Location: register_page.php");

?>