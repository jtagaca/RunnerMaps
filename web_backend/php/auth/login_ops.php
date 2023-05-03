<?php
session_start();
require_once("../config/config.php");
require_once("validation_functions.php");
require_once("../settings/settings_func.php");

$userExists = false;

function login($username, $password) {    
    /*
        first validate on backend:
        - blank submissions or not
        - minimum length for username
        - minimum length for password
    */

    /*
        then validate via database the credentials:
        1. prepare statements
        2. bind param
        3. execute
        4. retrieve result
        5. set session variables based on auth result
    */

    /*
        then handle the post submissions 
        - success = jump to home
        - failure = display error message
    */

    /*
        perhaps having 3 wrong attempts in a row:
        - could highlight "reset password" link
    */


    $db = get_connection();
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    $count = $db->prepare("SELECT count(*) as count FROM users WHERE username = ?");
    $count->bind_param('s', $username);

    if (!$count->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }
    else {
        $fetchedResult = $count->get_result();


        if ($row = $fetchedResult->fetch_assoc()) {

            if ($row["count"] == 0) {
                $userExists = false;
                $_SESSION["error"] = "User not found. <br>";
                header("Location: login_page.php");
            }
            else {
                $userExists = true;
            }
        }
    }




    if ($userExists) {

        $command = $db->prepare("SELECT * FROM users WHERE username = ?");
        $command->bind_param('s', $username);


        $retrievedPassword = "";
        $userID = "";
        $userType = "";
        $userEmail = "";
        $deptID = "";

        if (!$command->execute()) {
            $_SESSION["error"] = die(mysqli_error($db) . "<br>");
        }
        else {
            $fetchedResult = $command->get_result();


            if ($row = $fetchedResult->fetch_assoc()) {

                // if (is_null($row)) {
                //     $_SESSION["error"] = "User not found. <br>";
                //     header("Location: login_page.php");
                // }

                $retrievedPassword = $row["password"];
                $userID = $row["userID"];
                $userType = $row["userType"];
                $userEmail = $row["email"];
                $deptID = $row["departmentID"];
            }
            // else {
            //     $_SESSION["error"] = "Query Failed. <br>";
            //     header("Location: login_page.php");
            // }

            $validLogIn = password_verify($password, $retrievedPassword);

            if ($validLogIn) {

                $_SESSION["success_message"] = "Login Successful <br>";

                $_SESSION["authorized"] = true;
                $_SESSION["userID"] = $userID;
                $_SESSION["username"] = $username;
                $_SESSION["userEmail"] = $userEmail;
                $_SESSION["userType"] = $userType;
                $_SESSION["departmentID"] = $deptID;

                $settings = fetchSettings($userID);
                $_SESSION["style"] = $settings;
                
                // header("Location: ../home/hub.php");

            }
            else {
                $_SESSION["error"] = "No matching combination of username & password found";    
                header("Location: login_page.php");
            }
        }
    }
}


if (isset($_POST["login"])) {

    if (isset($_POST["username"]) && isset($_POST["password"])) {

        $username = $_POST["username"];
        $password = $_POST["password"];

        //for sticky form
        $_SESSION["loginUsername"] = $username;

        $usernameNotBlank = blankTest($username);
        $passwordNotBlank = blankTest($password);
        $lengthValid = lengthTest($username, 4, 12);

        if (!$usernameNotBlank || !$passwordNotBlank || !$lengthValid) {
            
            $_SESSION["error"] = "Make sure all fields are entered <br>";

            if (!$usernameNotBlank) {
                $_SESSION["error"] = $_SESSION["error"] . "Username is blank.<br>";
            }
        
            if (!$passwordNotBlank) {
                $_SESSION["error"] = $_SESSION["error"] . "Password is blank.<br>";
            }
        
            if (!$lengthValid) {
                $_SESSION["error"] = $_SESSION["error"] . "Username needs to be between 4 - 12 characters<br>";
            }
            header("Location: login_page.php");
        }
        else {

            login($username, $password);
            header("Location: login_page.php");
        }
    }
    else {
        echo "if form submission is invalid";
        $_SESSION["error"] = "please submit the form properly <br>";
    }
}

header("Location: login_page.php");


?>