<?php
session_start();
require_once("../config/config.php");

function login($username, $password) {
    $db = get_connection();

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


}