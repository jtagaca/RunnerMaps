CREATE TABLE `runner_maps`.`indoor_locations` (
  `locationID` INT NOT NULL AUTO_INCREMENT,
  `buildingID` INT NOT NULL,
  `departmentID` INT NULL,
  `categoryID` INT NULL,
  `floorID` INT NOT NULL,
  `row` VARCHAR(45) NOT NULL,
  `col` VARCHAR(45) NOT NULL,
  `image` TEXT NULL,
  `latitude` DECIMAL(9,6) NULL,
  `longitude` DECIMAL(9,6) NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`locationID`));