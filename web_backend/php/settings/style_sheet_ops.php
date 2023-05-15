<?php
session_start();

if (isset($_SESSION["style"])) {
    $settings = $_SESSION["style"];
    
    if (!is_null($settings)) {
        $fontSize = $settings["fontSize"];
        $fontColor = $settings["fontColor"];
        $backgroundColor = $settings["backgroundColor"];
        $borderColor = $settings["borderColor"];

    }
    
    else {
        $fontSize = "16";
        $fontColor = "#0A0462";
        $backgroundColor = "#DDFDFC";
        $backgroundColor = "#E2D1F9";
        $borderColor = "#1A5615";
    }
    
    $_SESSION["fontSize"] = $fontSize;
    $_SESSION["fontColor"] = $fontColor;
    $_SESSION["backgroundColor"] = $backgroundColor;
    $_SESSION["borderColor"] = $borderColor;

}

else {
    // making the registration and login page light purple

    $fontSize = "16";
    $fontColor = "#0A0462";
    // $backgroundColor = "#DDFDFC"; // blue
    // $backgroundColor = "#E2D1F9"; // purple
    $backgroundColor = "#f0e8fc"; 
    $borderColor = "#1A5615";

    $_SESSION["fontSize"] = $fontSize;
    $_SESSION["fontColor"] = $fontColor;
    $_SESSION["backgroundColor"] = $backgroundColor;
    $_SESSION["borderColor"] = $borderColor;
}


?>