CREATE TABLE
    `wall` (
        `floorID` int(11) NOT NULL,
        `buildingID` int(11) NOT NULL,
        `row` varchar(45) DEFAULT NULL,
        `col` varchar(45) DEFAULT NULL,
        `wallID` int(11) NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (`wallID`)
    ) ENGINE = InnoDB DEFAULT CHARSET = latin1;