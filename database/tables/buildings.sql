DROP TABLE IF EXISTS `buildings`;

CREATE TABLE `buildings` (
  `buildingID` int(11) NOT NULL AUTO_INCREMENT,
  `buildingName` varchar(100) NOT NULL,
  `mapURL` varchar(200) DEFAULT NULL,
  `geolocation` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`buildingID`),
  UNIQUE (`buildingName`)
); 