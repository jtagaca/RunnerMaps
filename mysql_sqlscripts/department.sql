CREATE TABLE `department` (
  `departmentID` INT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `numOfUsers` INT NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`departmentID`));