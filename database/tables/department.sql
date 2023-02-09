DROP TABLE IF EXISTS `department`;

CREATE TABLE `department` (
  `departmentID` INT AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `numOfUsers` INT NOT NULL,
  `description` TEXT NULL,
  PRIMARY KEY (`departmentID`));