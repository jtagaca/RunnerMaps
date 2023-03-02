DROP TABLE IF EXISTS `markers`;
-- good
CREATE TABLE `markers` ( -- complained about not being on the same line
        `markerID` int(11) NOT NULL AUTO_INCREMENT, -- changed the single quotes
        `floorID` int(11) NOT NULL,
        `image` TEXT DEFAULT NULL, -- was missing "DEFAULT"
        `row` varchar(45) DEFAULT NULL,
        `col` varchar(45) DEFAULT NULL,
        `latitude` decimal(9,6) DEFAULT NULL,
        `longitude` decimal(9,6) DEFAULT NULL,
        PRIMARY KEY (`markerID`), -- found a typo "makerID".
                                 -- man! found the final bug. it was missing a comma.
        KEY `foreign_key_wall_to_floors_index` (`floorID`), -- wall to floors? typo?
        CONSTRAINT `foreign_key_of_markers_to_floors` FOREIGN KEY (`floorID`) REFERENCES `floors` (`floorID`) 
        -- ON DELETE NO ACTION ON UPDATE NO ACTION
    ); -- was missing semi-colon