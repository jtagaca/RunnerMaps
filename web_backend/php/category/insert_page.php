<?php
session_start();
require_once("../auth/logout.php");
require_once("insert_func.php");


if (isset($_SESSION["error"])) {
    $errorMsg = $_SESSION["error"];
}
if (isset($_SESSION["success_message"])) {
    $success_message = $_SESSION["success_message"];
}


?>


<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Campus Map</title>
    </head>

    <body>
        <h3>
        <a href="../home/hub.php"> Back to Hub </a>
        </h3>
        <br><br>

        <div>
            <a href="../auth/login_page.php"><img src="../images/csub.png" 
                alt="school logo" height="50px" style="display: inline;"></a>
            <h1 style="display: inline; margin: 30px 5px">Campus Map</h1>
        </div>
        <h2>Insert a Category</h2>
        
        <form action="insert_ops.php" method="POST">
            Enter a New Category Name: <br>
            <input type="text" name="categoryName">
            <br><br>           
        
            <input style="background-color: #ADD8E6;" type="submit" 
                                name="addCategory" value="Add a New Category">
        </form>

        <br>
        <br>
        <br>

        <h2>Edit a Category</h2>
        <div> 
            <span style="background-color:yellow;">
                Note: This change will apply to ALL LOCATIONS 
                that share this category.
            </span>
        </div>
        <form action="insert_ops.php" method="POST">
            Old Category Name: <br>
            <input type="text" name="oldCategoryName">
            <br><br>           

            New Category Name: <br>
            <input type="text" name="newCategoryName">
            <br><br>           
        
            <input style="background-color: #ADD8E6;" type="submit" 
                                    name="editCategoryName" value="Edit">
        </form>

        <br>
        <br>
        <br>


        <h2>Update an Indoor Location's Category</h2>
        <form action="insert_ops.php" method="POST">
            Location ID: <br>
            <input type="text" name="locationID" accept="numbers">
            <br><br>

            Category: <br>
            
            <?php
                printCategoriesOptions();
            ?>
            
            <br>
            <br>
            <input style="background-color: #ADD8E6;" type="submit" 
                            name="updateCategory" value="Update Category">
        </form>

        <br><br>
        <p style="color:red"><?=$errorMsg?></p>
        <p style="color:green"><?=$success_message?></p>
        <br> <br>
        
        <?php 
        unset($_SESSION["error"]); 
        unset($_SESSION["success_message"]);
        ?>

    </body>

</html>

