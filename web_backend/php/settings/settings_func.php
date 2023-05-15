<?php
session_start();
require_once("../config/config.php");

function initializeSettings($userID) {
    
    $fontSize = "16";
    $fontColor = "#000000";
    $backgroundColor = "#FFFFFF";
    $borderColor = "grey";

    echo "in settings func";

    $db = get_connection();
    $command = $db->prepare("insert into settings (`userID`, `fontSize`, 
                                    `fontColor`, `backgroundColor`, 
                                    `borderColor`) values (?, ?, ?, ?, ?)");
    $command->bind_param('issss', $userID, $fontSize, $fontColor, 
                                            $backgroundColor, $borderColor);
    
    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
        die();
    }
    
    return;
}

function updateSettings($userID, $fontSize, $fontColor, 
                                            $backgroundColor, $borderColor) {
    $db = get_connection();
    $command = $db->prepare("update settings set `fontSize` = ?, 
                                    `fontColor` = ?, `backgroundColor` = ?, 
                                        `borderColor` = ? where userID = ?");
    $command->bind_param('ssssi', $fontSize, $fontColor, $backgroundColor, 
                                                        $borderColor, $userID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
        die();
    }

    return;    
}

function fetchSettings($userID) {
    $db = get_connection();
    $command = $db->prepare("SELECT * FROM settings WHERE userID = ?;");
    $command->bind_param('i', $userID);

    if (!$command->execute()) {
        $_SESSION["error"] = die(mysqli_error($db) . "<br>");
    }

    $fetchedResult = $command->get_result();

    $settings = [];
    if ($row = $fetchedResult->fetch_assoc()) {
        $fontSize = $row["fontSize"];
        $fontColor = $row["fontColor"];
        $backgroundColor = $row["backgroundColor"];
        $borderColor = $row["borderColor"];
        
        $settings = array(
            "fontSize" => $fontSize,
            "fontColor" => $fontColor, 
            "backgroundColor" => $backgroundColor,
            "borderColor" => $borderColor
        );
    }
    
    return $settings;
}



?>