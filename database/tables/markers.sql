DROP TABLE IF EXISTS `markers`;

CREATE TABLE
    `markers` (
        'markerID' int(11) NOT NULL AUTO_INCREMENT,
        `floorID` int(11) NOT NULL,
        `buildingID` int(11) NOT NULL,
        `image` TEXT NULL,
        `row` varchar(45) DEFAULT NULL,
        `col` varchar(45) DEFAULT NULL,
        PRIMARY KEY (`makerID`)
    ) 