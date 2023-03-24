<?php

function blankTest($input) {
    if ((strlen($input) == 0) || ($input == "") || $input == null) {
        return false;
    } 
    return true;
}

function lengthTest($input, $min, $max) {
    if (strlen($input) < $min || strlen($input) > $max) {
        return false;
    }
    return true;
}



?>