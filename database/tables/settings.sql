CREATE TABLE `settings` (
  `settingID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) DEFAULT -1,
  `fontsize` varchar(30) DEFAULT 16,
  `fontColor` varchar(30) DEFAULT NULL,
  `backgroundColor` varchar(30) DEFAULT NULL,
  `borderColor` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`settingID`),
  CONSTRAINT `settings_fk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
  ON DELETE SET NULL ON UPDATE CASCADE
);