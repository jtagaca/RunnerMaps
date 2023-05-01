CREATE TABLE `settings` (
  `settingID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT -1,
  `fontSize` varchar(30) DEFAULT 16,
  `fontColor` varchar(30) DEFAULT NULL,
  `backgroundColor` varchar(30) DEFAULT NULL,
  `borderColor` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`settingID`),
  CONSTRAINT `settings_fk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
  ON DELETE SET NULL ON UPDATE CASCADE
);

-- how to fix my typo:
-- https://phoenixnap.com/kb/how-to-rename-column-mysql
-- ALTER TABLE table_name RENAME COLUMN old_column_name TO new_column_name; 
-- ALTER TABLE settings RENAME COLUMN fontsize TO fontSize; 

-- ALTER TABLE table_name CHANGE old_column_name new_col_name Data Type;
-- ALTER TABLE settings CHANGE fontsize fontSize varchar(30);