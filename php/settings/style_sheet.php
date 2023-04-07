<?php
session_start();
require_once("style_sheet_ops.php");
// update settings set fontsize=24 where userID = 5;

?>

<style>
    html{
        font-size: <?=$fontSize?>px;
        color: <?=$fontColor?>;
        background-color: <?$=$backgroundColor?>;
    }

    table{
        text-align: center; 
        gap: auto;
        margin: 10px;
        padding: 10px;
        /* font-size: <?=$fontSize?>px; */
        border-collapse: collapse;
        border: 3px solid <?=$borderColor?>;
    }
    th {
        width: 300px;
        border: 3px solid <?=$borderColor?>;
    }
    td {
        border: 3px solid <?=$borderColor?>;
    }
</style>