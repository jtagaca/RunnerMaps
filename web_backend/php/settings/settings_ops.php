<?php
session_start();
require_once("settings_func.php");

if (isset($_POST["updateSettings"])) {

    $userID = $_SESSION["userID"];
    
    $fontSize = $_POST["fontSize"];
    $fontColor = $_POST["fontColor"];
    $backgroundColor = $_POST["backgroundColor"];
    $borderColor = $_POST["borderColor"];

    $fontSize = htmlspecialchars($fontSize);
    $fontColor = htmlspecialchars($fontColor);
    $backgroundColor = htmlspecialchars($backgroundColor);
    $borderColor = htmlspecialchars($borderColor);

    if ($fontSize < 5 || $fontSize > 200) {
        $fontSize = $_SESSION["fontSize"];
        $error = "Invalid font size. Please enter a number between 5 and 200.";
        echo "<div style='color: red'>$error</div>";
    }

    updateSettings($userID, $fontSize, $fontColor, $backgroundColor, $borderColor);

    $settings = array(
        "fontSize" => $fontSize,
        "fontColor" => $fontColor, 
        "backgroundColor" => $backgroundColor,
        "borderColor" => $borderColor
    );

    $_SESSION["style"] = $settings;
}



if (isset($_POST["restoreSettings"])) {

    $userID = $_SESSION["userID"];
    
    $fontSize = "16";
    $fontColor = "#000000";
    $backgroundColor = "#FFFFFF";
    $borderColor = "grey";

    updateSettings($userID, $fontSize, $fontColor, $backgroundColor, $borderColor);

    $settings = array(
        "fontSize" => $fontSize,
        "fontColor" => $fontColor, 
        "backgroundColor" => $backgroundColor,
        "borderColor" => $borderColor
    );

    $_SESSION["style"] = $settings;
}
    

header("Location: settings_page.php");
    
?>
