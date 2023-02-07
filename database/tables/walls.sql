CREATE TABLE `wall` (
  `floorID` int(11) NOT NULL,
  `row` varchar(45) DEFAULT NULL,
  `col` varchar(45) DEFAULT NULL,
  `wallID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`wallID`),
  KEY `foreign_key_wall_to_floors_index` (`floorID`),
  CONSTRAINT `foreign_key_of_wall_to_floors` FOREIGN KEY (`floorID`) REFERENCES `floors` (`floorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

