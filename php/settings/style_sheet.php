<?php
session_start();
require_once("style_sheet_ops.php");
// update settings set fontsize=24 where userID = 5;

?>

<style>
    html{
        font-size: <?=$fontSize?>px;
        color: <?=$fontColor?>;
        background-color: <?=$backgroundColor?>;
    }

    body{
        font-size: <?=$fontSize?>px;
        color: <?=$fontColor?>;
        background-color: <?=$backgroundColor?>;
    }

    input{
        font-size: <?=$fontSize?>px;
        color: <?=$fontColor?>;   
    }

    .deleteForms{
        margin: 10px;
        padding: 5px 10px;
    }

    .logout {
        padding: 5px 30px;
    }

    .deleteButtons{
        padding: 5px 30px;
    }

    h1 {
        font-size: <?php echo $fontSize + 20;?>px;
    }

    h2 {
        font-size: <?php echo $fontSize + 10;?>px;
    }

    h3 {
        font-size: <?php echo $fontSize + 5;?>px;
    }

    table{
        text-align: center; 
        gap: auto;
        margin: 10px;
        padding: 10px;
        color: <?=$fontColor?>;
        font-size: <?=$fontSize?>px;
        border-collapse: collapse;
        border: 3px solid <?=$borderColor?>;
    }

    th {
        font-size: <?php echo $fontSize + 5;?>px;
        width: 300px;
        border: 3px solid <?=$borderColor?>;
    }
    td {
        border: 3px solid <?=$borderColor?>;
    }
</style>