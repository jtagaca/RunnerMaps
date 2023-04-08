DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `services` varchar(200) DEFAULT "default",
  PRIMARY KEY (`categoryID`)
); 

-- https://www.techonthenet.com/mysql/unique.php
-- ALTER TABLE categories
-- ADD CONSTRAINT category_unique UNIQUE (services);