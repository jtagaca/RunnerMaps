CREATE TABLE `users` (
  `userID` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  -- `username` varchar(255) NOT NULL UNIQUE,
  `username` varchar(255) NOT NULL,
  `userType` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `departmentID` int(11) DEFAULT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE (`username`),
  KEY `foreign_key_of_users_to_department_idx` (`departmentID`),
  -- CONSTRAINT `foreign_key_of_users_to_department` FOREIGN KEY (`departmentID`) REFERENCES `department` (`departmentID`) 
  -- ON DELETE NO ACTION ON UPDATE NO ACTION
  CONSTRAINT `foreign_key_of_users_to_department` FOREIGN KEY (`departmentID`) REFERENCES `department` (`departmentID`) 
) 

-- ALTER TABLE table_name
-- ADD CONSTRAINT constraint_name UNIQUE (column1, column2, ... column_n);

-- ALTER TABLE users
-- ADD CONSTRAINT username_unique UNIQUE (username);