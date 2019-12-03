# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.9)
# Datenbank: SNOOPYDB
# Erstellungsdauer: 2014-10-13 09:07:35 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Export von Tabelle Championship
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Championship`;

CREATE TABLE `Championship` (
  `id` int(11) DEFAULT NULL,
  `YEAR` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `Championship` WRITE;
/*!40000 ALTER TABLE `Championship` DISABLE KEYS */;

INSERT INTO `Championship` (`id`, `YEAR`, `NAME`)
VALUES
	(1,'2010','South-Africa'),
	(2,'2006','Germany'),
	(3,'2002','South-Korea'),
	(4,'1998','France');

/*!40000 ALTER TABLE `Championship` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle ChampionshipTeams
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ChampionshipTeams`;

CREATE TABLE `ChampionshipTeams` (
  `teamID` int(11) DEFAULT NULL,
  `championshipID` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `ChampionshipTeams` WRITE;
/*!40000 ALTER TABLE `ChampionshipTeams` DISABLE KEYS */;

INSERT INTO `ChampionshipTeams` (`teamID`, `championshipID`)
VALUES
	(1,2),
	(1,3),
	(2,1),
	(2,2),
	(2,3),
	(3,2);

/*!40000 ALTER TABLE `ChampionshipTeams` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle Player
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Player`;

CREATE TABLE `Player` (
  `id` int(11) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `jerseyNumber` int(11) DEFAULT NULL,
  `skill` varchar(255) DEFAULT NULL,
  `bestFriend` int(11) DEFAULT NULL,
  `teamID` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `Player` WRITE;
/*!40000 ALTER TABLE `Player` DISABLE KEYS */;

INSERT INTO `Player` (`id`, `NAME`, `jerseyNumber`, `skill`, `bestFriend`, `teamID`)
VALUES
	(1,'C++_Player1',8,'Header',9,1),
	(2,'C++_Player2',13,'Freekick',8,1),
	(3,'C++_Player3',10,'Penalty',7,1),
	(4,'Maple_Player1',8,'Header',6,2),
	(5,'Maple_Player2',9,'Freekick',5,2),
	(6,'Maple_Player3',10,'Penalty',4,2),
	(7,'Physics_Player1',8,'Header',3,3),
	(8,'Physics_Player2',9,'Freekick',2,3),
	(9,'Physics_Player3',10,'Penalty',1,3);

/*!40000 ALTER TABLE `Player` ENABLE KEYS */;
UNLOCK TABLES;


# Export von Tabelle Team
# ------------------------------------------------------------

DROP TABLE IF EXISTS `Team`;

CREATE TABLE `Team` (
  `id` int(11) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

LOCK TABLES `Team` WRITE;
/*!40000 ALTER TABLE `Team` DISABLE KEYS */;

INSERT INTO `Team` (`id`, `NAME`)
VALUES
	(1,'FC++'),
	(2,'FC Maple'),
	(3,'SC Physics');

/*!40000 ALTER TABLE `Team` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
