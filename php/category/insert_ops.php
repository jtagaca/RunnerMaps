<?php
session_start();
require_once("insert_func.php");
require_once("../auth/validation_functions.php");

if (isset($_POST["addCategory"])) {
    if (isset($_POST["categoryName"])) {
        $categoryName = $_POST["categoryName"];
        
        if (blankTest($categoryName)) {
            $testFailed = doesCategoryAlreadyExist($categoryName);

            if (!$testFailed) {
                insertIntoCategories($categoryName);
            }
        }
        else {
            $_SESSION["error"] = "The category entered was blank. <br>";

        }
    }
}

// else {
//     echo "if form submission is invalid";
//     $_SESSION["error"] = "please submit the form properly <br>";
// }

if (isset($_POST["updateCategory"])) {
    if (isset($_POST["updatedCategory"])) {
        // https://html.form.guide/php-form/php-form-select/

        if (isset($_POST["locationID"])) {
            $locationID = $_POST["locationID"];
            $categoryName = $_POST["updatedCategory"];

            if (blankTest($locationID) && blankTest($categoryName)) {
                updateCategories($locationID, $categoryName);
            }
        }
    }
    else {
        $_SESSION["error"] = "please select a category. <br>";
    }
}


if (isset($_POST["editCategoryName"])) {
    if (isset($_POST["oldCategoryName"]) && isset($_POST["newCategoryName"])) {

        $oldCategoryName = $_POST["oldCategoryName"];
        $newCategoryName = $_POST["newCategoryName"];

        if (blankTest($oldCategoryName) && blankTest($newCategoryName)) {
            editCategoryName($oldCategoryName, $newCategoryName);
        }
        }
    }
    else {
        $_SESSION["error"] = "please select a category. <br>";
    }

// else {
//     echo "if form submission is invalid";
//     $_SESSION["error"] = "please submit the form properly <br>";
// }


//redirecting the results back to the form page
header("Location: insert_page.php");
    
?>
