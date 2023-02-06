DROP TABLE IF EXISTS `floors`;

CREATE TABLE `floors` (
  `floorID` int(11) NOT NULL AUTO_INCREMENT,
  `buildingID` int(11),
  `floorNumber` int(11) NOT NULL,
  `gridSize` int(11) DEFAULT 0,
  PRIMARY KEY (`floorID`),
  KEY `buildingID` (`buildingID`),
  CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`buildingID`) REFERENCES `buildings` (`buildingID`)
  ON DELETE SET NULL ON UPDATE CASCADE
); 
