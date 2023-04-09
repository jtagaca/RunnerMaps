CREATE TABLE `codes` (
  `codeID` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(30) NOT NULL,
  `used` int(1) DEFAULT 0,
  `userID` int(11) default NULL,
  PRIMARY KEY  (`codeID`),
  KEY `userID` (`userID`),
  CONSTRAINT `codes_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
  ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- how to fix my typo:
-- https://phoenixnap.com/kb/how-to-rename-column-mysql
-- ALTER TABLE table_name RENAME COLUMN old_column_name TO new_column_name; 
-- ALTER TABLE settings RENAME COLUMN fontsize TO fontSize; 

-- ALTER TABLE table_name CHANGE old_column_name new_col_name Data Type;
-- ALTER TABLE settings CHANGE fontsize fontSize varchar(30);