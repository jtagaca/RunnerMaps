CREATE TABLE
    `markers` (
        `markerID` int(11) NOT NULL AUTO_INCREMENT,
        `floorID` int(11) NOT NULL,
        `image` text,
        `row` varchar(45) DEFAULT NULL,
        `col` varchar(45) DEFAULT NULL,
        `latitude` decimal(16, 16) DEFAULT NULL,
        `longitude` decimal(16, 16) DEFAULT NULL,
        PRIMARY KEY (`markerID`),
        KEY `foreign_key_marker_to_floors_index` (`floorID`),
        CONSTRAINT `foreign_key_of_markers_to_floors` FOREIGN KEY (`floorID`) REFERENCES `floors` (`floorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
    ) ENGINE = InnoDB DEFAULT CHARSET = latin1;