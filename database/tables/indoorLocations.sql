
-- good
CREATE TABLE `indoor_locations` (
  `locationID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) DEFAULT NULL,
  `floorID` int(11) NOT NULL,
  `row` varchar(45) NOT NULL,
  `col` varchar(45) NOT NULL,
  `image` text,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`locationID`),
  KEY `foreign_key_indoor_locations_to_floors_index` (`floorID`),
  KEY `foreign_key_indoor_locations_to_categories_index` (`categoryID`),
  CONSTRAINT `foreign_key_of_indoor_locations_to_categories` FOREIGN KEY (`categoryID`) REFERENCES `categories` (`categoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `foreign_key_of_indoor_locations_to_floors` FOREIGN KEY (`floorID`) REFERENCES `floors` (`floorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
