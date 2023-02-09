DROP TABLE IF EXISTS `markers`;
-- good
CREATE TABLE
    `markers` (
        'markerID' int(11) NOT NULL AUTO_INCREMENT,
        `floorID` int(11) NOT NULL,
        `image` TEXT NULL,
        `row` varchar(45) DEFAULT NULL,
        `col` varchar(45) DEFAULT NULL,
        PRIMARY KEY (`makerID`)
        KEY `foreign_key_wall_to_floors_index` (`floorID`),
        CONSTRAINT `foreign_key_of_markers_to_floors` FOREIGN KEY (`floorID`) REFERENCES `floors` (`floorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) 