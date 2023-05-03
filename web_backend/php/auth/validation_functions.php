<?php

// checks if it passes the blank test.
// returns true if NOT blank
function blankTest($input) {
    if ((strlen($input) == 0) || ($input == "") || $input == null) {
        return false;
    } 
    return true;
}

// checks if it passes the length test.
// returns true if VALID
function lengthTest($input, $min, $max) {
    if (strlen($input) < $min || strlen($input) > $max) {
        return false;
    }
    return true;
}



?>