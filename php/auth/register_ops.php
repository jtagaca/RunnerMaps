<?php
session_start();
require_once("../config/config.php");
require_once("validation_functions.php");
require_once("../settings/settings_func.php");

function checkUsername($username) {
    $db = get_connection();
    $command = $db->prepare("SELECT count(*) FROM users WHERE username = ?;");
    $command->bind_param('s', $username);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $count = 0;
    if ($row = $fetchedResult->fetch_assoc()) {
        $count = $row["count(*)"];
    }
    
    return $count;
}

// insert into codes (`code`) values ("1111");

function registrationCodeValid($registrationCode) {
    $db = get_connection();
    $command = $db->prepare("SELECT count(*) FROM codes WHERE code = ? and used = 0;");
    $command->bind_param('s', $registrationCode);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $count = 0;
    if ($row = $fetchedResult->fetch_assoc()) {
        $count = $row["count(*)"];
    }

    if ($count > 1) {
        return true;
    }
    
    return false;
}

function fetchRegistrationCodeID($registrationCode) {
    $db = get_connection();
    $command = $db->prepare("SELECT codeID FROM codes WHERE code = ? and used = 0 order by codeID limit 1;");
    $command->bind_param('s', $registrationCode);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $count = 0;
    if ($row = $fetchedResult->fetch_assoc()) {
        $codeID = $row["codeID"];
    }
    
    return $codeID;
}

function updateRegistrationCode($registrationCode, $username) {

    $codeID = fetchRegistrationCodeID($registrationCode);
    $userID = fetchUserID($username);

    $db = get_connection();
    $command = $db->prepare("UPDATE codes set used = 1, userID = ? WHERE codeID = ?");
    $command->bind_param('ii', $userID, $codeID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    return;
}


// function register($username, $password, $userType, $email_username, $email_domain) {
function register($username, $password, $userType, $email, $registrationCode) {
    $db = get_connection();
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    echo "hashed: $hashed <br> username: $username <br> usertype: $userType <br> email: $email <br>";

    $command = $db->prepare("INSERT INTO users (`password`, `username`, `userType`, `email`) VALUES (?, ?, ?, ?)");
    $command->bind_param('ssss', $hashed, $username, $userType, $email);

    echo "after binding, before executing <br>";
    echo "$hashed and <br> $username and <br> $userType and <br> $email <br>";

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        updateRegistrationCode($registrationCode, $username);
        $_SESSION["success_message"] = "Account successfully created. Username: $username";
    }

    echo "executed <br>";
}

function fetchUserID($username) {
    $db = get_connection();
    $command = $db->prepare("SELECT userID FROM users WHERE username = ?;");
    $command->bind_param('s', $username);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $userID = [];
    if ($row = $fetchedResult->fetch_assoc()) {
        $userID = $row["userID"];
    }
    
    return $userID;
}

if (isset($_POST["register"])) {

    if (isset($_POST["email"]) && isset($_POST["username"]) &&
        isset($_POST["password"]) && isset($_POST["password_confirm"]) &&
        isset($_POST["registrationCode"])) {


        //need to check for if blank inputs
        // if () {
        //     echo "if fields are not entered";
        //     $_SESSION["error"] = "make sure all fields are entered <br>";
        // }
        
            
        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];
        $password_confirm = $_POST["password_confirm"];
        $registrationCode = $_POST["registrationCode"];

        $_SESSION["registerUsername"] = $username;
        $_SESSION["registerEmail"] = $email;
        $_SESSION["registrationCode"] = $registrationCode;


        $usernameNotBlank = blankTest($username);
        $passwordNotBlank = blankTest($password);
        $emailNotBlank = blankTest($email);
        $registrationCodeNotBlank = blankTest($registrationCode);
        $usernameLengthValid = lengthTest($username, 4, 12);
        $passwordLengthValid = lengthTest($password, 6, 20);

        if (!$usernameNotBlank || !$passwordNotBlank || !$emailNotBlank ||
            !$usernameLengthValid || !$passwordLengthValid || !$registrationCodeNotBlank) {
        
            if (!$usernameNotBlank || !$passwordNotBlank || !$emailNotBlank || !$registrationCodeNotBlank) {
                $_SESSION["error"] .= "Make sure all fields are entered <br>";
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
                
                $codeValid = registrationCodeValid($registrationCode);
echo $codeValid;
                if ($codeValid) {
                    $count = checkUsername($username);
                    if ($count == 0) {
                        $userType = "supervisor";

                        echo "before calling register <br>";
                        register($username, $password, $userType, $email, $registrationCode);
                        $userID = fetchUserID($username);
                        echo $userID;
                        echo "before initializing settings";
                        initializeSettings($userID);
                        echo "after initializing settings";
                        echo "after calling register <br>";
                        header("Location: register_page.php");
                    }
                    else {
                        $_SESSION["error"] = $_SESSION["error"] . 
                        "username already exists <br>";
                    }
                }
                else {
                    $_SESSION["error"] = $_SESSION["error"] . 
                        "please enter a valid registration code <br>";
                }

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