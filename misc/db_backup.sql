-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2025 at 12:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `state4`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brandID` int(11) NOT NULL,
  `brandName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brandID`, `brandName`) VALUES
(1, 'Hanes'),
(2, 'Port & Company'),
(3, 'Jerzees');

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `colorID` int(11) NOT NULL,
  `colorName` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`colorID`, `colorName`) VALUES
(1, 'white'),
(2, 'ash'),
(3, 'assorted'),
(4, 'athletic heather');

-- --------------------------------------------------------

--
-- Table structure for table `districts`
--

CREATE TABLE `districts` (
  `districtID` tinyint(4) NOT NULL,
  `districtName` varchar(5) NOT NULL,
  `districtDescription` varchar(50) NOT NULL,
  `primaryCity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`districtID`, `districtName`, `districtDescription`, `primaryCity`) VALUES
(1, 'I', 'North', 'Coeur d\'Alene'),
(2, 'II', 'North Central', 'Lewiston'),
(3, 'III', 'Southwest', 'Boise'),
(4, 'IV', 'South Central', 'Twin Falls'),
(5, 'V', 'Southeast', 'Pocatello'),
(6, 'VI', 'East', 'Idaho Falls');

-- --------------------------------------------------------

--
-- Table structure for table `divisions`
--

CREATE TABLE `divisions` (
  `divisionID` tinyint(4) NOT NULL,
  `divisionName` varchar(5) NOT NULL,
  `minPop` int(11) NOT NULL,
  `pre24Name` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `divisions`
--

INSERT INTO `divisions` (`divisionID`, `divisionName`, `minPop`, `pre24Name`) VALUES
(1, '1A', 0, '1A DI'),
(2, '2A', 85, '1A DI'),
(3, '3A', 160, '2A'),
(4, '4A', 320, '3A'),
(5, '5A', 640, '4A'),
(6, '6A', 1280, '5A');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employeeID` tinyint(4) NOT NULL,
  `employeeName` varchar(30) NOT NULL,
  `employeeShortName` varchar(15) NOT NULL,
  `employeePhone` varchar(20) DEFAULT NULL,
  `employeeEmail` varchar(320) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employeeID`, `employeeName`, `employeeShortName`, `employeePhone`, `employeeEmail`) VALUES
(1, 'Ben Cowan', 'Ben', '2089215438', NULL),
(2, 'Nick McConnell', 'Nick', '2089216674', NULL),
(3, 'Ruben Holguin', 'Ruben', '2087036791', NULL),
(4, 'Kathy Phillips', 'Kathy', '2086317404', NULL),
(5, 'Camille Brown', 'Camille', '2088611747', NULL),
(6, 'Nancy Belliveau', 'Nancy', '2088667809', NULL),
(7, 'Rachel', 'Rachel', NULL, NULL),
(8, 'Danny Tommack', 'Danny', '2088590700', NULL),
(9, 'Cidney', 'Cidney', NULL, NULL),
(10, 'Michael Frazen', 'Michael', NULL, NULL),
(11, 'Blake Tommack', 'Blake', NULL, NULL),
(12, 'BJ Klotz', 'BJ', NULL, NULL),
(13, 'TBD', 'TBD', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `eventhassport`
--

CREATE TABLE `eventhassport` (
  `eventHasSportID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  `sportID` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventhassport`
--

INSERT INTO `eventhassport` (`eventHasSportID`, `eventID`, `sportID`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 4),
(4, 4, 3),
(5, 5, 5),
(6, 6, 6),
(7, 7, 7),
(8, 8, 8),
(9, 9, 9),
(10, 10, 10),
(11, 10, 11),
(12, 11, 12),
(13, 12, 13),
(14, 13, 14),
(15, 14, 1),
(16, 15, 15),
(17, 16, 16),
(18, 17, 17),
(19, 18, 18);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventID` int(11) NOT NULL,
  `sportID` tinyint(4) DEFAULT NULL,
  `eventYear` tinyint(4) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eventID`, `sportID`, `eventYear`, `startDate`, `endDate`) VALUES
(1, 1, 24, '2024-10-11', '2024-10-12'),
(2, 2, 24, '2024-10-24', '2024-10-26'),
(3, 4, 24, '2024-11-02', '2024-11-02'),
(4, 3, 24, '2024-10-31', '2024-11-02'),
(5, 5, 24, '2024-11-08', '2024-11-09'),
(6, 6, 24, '2024-11-22', '2024-11-23'),
(7, 7, 24, '2024-12-06', '2024-12-07'),
(8, 8, 24, '2025-02-20', '2025-02-22'),
(9, 9, 24, '2025-02-28', '2025-03-01'),
(10, 10, 24, '2025-02-28', '2025-03-01'),
(11, 12, 24, '2025-03-06', '2025-03-08'),
(12, 13, 24, '2025-03-14', '2025-03-15'),
(13, 14, 24, '2025-04-11', '2025-04-12'),
(14, 1, 24, '2025-05-12', '2025-05-13'),
(15, 15, 24, '2025-05-15', '2025-05-17'),
(16, 16, 24, '2025-05-15', '2025-05-17'),
(17, 17, 24, '2025-05-16', '2025-05-17'),
(18, 18, 24, '2025-05-16', '2025-05-17'),
(19, 11, 24, '2025-02-28', '2025-03-01');

-- --------------------------------------------------------

--
-- Table structure for table `eventsitehasdivision`
--

CREATE TABLE `eventsitehasdivision` (
  `eventSiteHasDivisionID` int(11) NOT NULL,
  `eventSiteID` int(11) NOT NULL,
  `divisionID` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventsitehasdivision`
--

INSERT INTO `eventsitehasdivision` (`eventSiteHasDivisionID`, `eventSiteID`, `divisionID`) VALUES
(67, 83, 6),
(68, 84, 5),
(69, 85, 6),
(70, 86, 6),
(71, 87, 5),
(72, 88, 5),
(73, 89, 4),
(74, 90, 6),
(75, 90, 5),
(76, 90, 4),
(77, 90, 3),
(78, 90, 2),
(79, 91, 6),
(80, 91, 5),
(81, 92, 4),
(82, 93, 3),
(83, 94, 2),
(84, 95, 1),
(85, 96, 6),
(86, 96, 5),
(87, 97, 6),
(88, 97, 5),
(89, 97, 4),
(90, 98, 6),
(91, 99, 5),
(92, 100, 4),
(93, 101, 3),
(94, 102, 2),
(95, 154, 1),
(96, 155, 6),
(97, 155, 5),
(98, 155, 4),
(99, 155, 3),
(100, 156, 6),
(101, 156, 5),
(102, 156, 4),
(103, 156, 3),
(104, 157, 6),
(105, 158, 5),
(106, 159, 4),
(107, 160, 3),
(108, 161, 2),
(109, 162, 1),
(110, 163, 6),
(111, 163, 5),
(112, 163, 4),
(113, 164, 4),
(114, 165, 3),
(115, 166, 6),
(116, 167, 5),
(117, 167, 4),
(118, 168, 2),
(119, 169, 6),
(120, 170, 5),
(121, 171, 4),
(122, 172, 3),
(123, 173, 2),
(124, 174, 6),
(125, 175, 5),
(126, 176, 4),
(127, 177, 6),
(128, 177, 5),
(129, 178, 4),
(130, 178, 3),
(131, 178, 2),
(132, 179, 6),
(133, 180, 2),
(134, 181, 1),
(135, 182, 4),
(136, 181, 5),
(137, 181, 3),
(138, 168, 3),
(139, 183, 4),
(140, 183, 5),
(141, 183, 6),
(142, 184, 3),
(143, 184, 4),
(144, 184, 5),
(145, 184, 6);

-- --------------------------------------------------------

--
-- Table structure for table `eventsitehasemployee`
--

CREATE TABLE `eventsitehasemployee` (
  `eventSiteHasEmployeeID` int(11) NOT NULL,
  `eventSiteID` int(11) NOT NULL,
  `employeeID` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventsitehasemployee`
--

INSERT INTO `eventsitehasemployee` (`eventSiteHasEmployeeID`, `eventSiteID`, `employeeID`) VALUES
(1, 83, 1),
(2, 84, 2),
(3, 85, 1),
(4, 86, 3),
(5, 87, 4),
(6, 88, 5),
(7, 89, 2),
(8, 90, 2),
(9, 91, 4),
(10, 91, 7),
(11, 92, 7),
(12, 93, 1),
(13, 94, 8),
(14, 95, 6),
(15, 96, 1),
(16, 96, 5),
(17, 97, 2),
(18, 97, 6),
(19, 98, 4),
(20, 98, 9),
(21, 98, 2),
(22, 99, 6),
(23, 100, 1),
(24, 101, 5),
(25, 102, 3),
(26, 154, 2),
(27, 156, 6),
(28, 156, 3),
(29, 156, 2),
(30, 156, 8),
(31, 155, 4),
(32, 155, 5),
(33, 155, 10),
(34, 155, 1),
(35, 157, 4),
(36, 157, 9),
(37, 157, 2),
(38, 158, 1),
(39, 159, 5),
(40, 160, 6),
(41, 161, 2),
(42, 162, 3),
(43, 163, 6),
(44, 163, 2),
(45, 183, 2),
(46, 183, 3),
(47, 164, 6),
(48, 165, 2),
(49, 167, 3),
(50, 167, 13),
(51, 168, 10),
(52, 168, 2),
(53, 170, 5),
(54, 173, 1),
(55, 174, 7),
(56, 175, 6),
(57, 176, 12),
(58, 177, 4),
(59, 177, 9),
(60, 178, 8);

-- --------------------------------------------------------

--
-- Table structure for table `eventsitehasgender`
--

CREATE TABLE `eventsitehasgender` (
  `eventSiteHasGenderID` int(11) NOT NULL,
  `eventSiteID` int(11) NOT NULL,
  `genderID` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventsitehasgender`
--

INSERT INTO `eventsitehasgender` (`eventSiteHasGenderID`, `eventSiteID`, `genderID`) VALUES
(1, 85, 1),
(2, 86, 2),
(3, 87, 1),
(4, 88, 2);

-- --------------------------------------------------------

--
-- Table structure for table `eventsiteinventories`
--

CREATE TABLE `eventsiteinventories` (
  `eventSiteInventoryID` int(11) NOT NULL,
  `eventSiteID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `startQ` int(11) NOT NULL,
  `endQ` int(11) NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `addedQ` int(11) NOT NULL DEFAULT 0,
  `removedQ` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `eventsites`
--

CREATE TABLE `eventsites` (
  `eventSiteID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  `siteID` int(11) DEFAULT NULL,
  `managerName` varchar(20) DEFAULT NULL,
  `vehicleID` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `eventsites`
--

INSERT INTO `eventsites` (`eventSiteID`, `eventID`, `siteID`, `managerName`, `vehicleID`) VALUES
(83, 1, 1, 'Travis Bell', 1),
(84, 1, 2, 'Randy Winn', NULL),
(85, 2, 3, 'Victoria Beecher', 2),
(86, 2, 4, 'TJ Clary', NULL),
(87, 2, 5, 'Tyler Johnson', NULL),
(88, 2, 6, 'Larry Stocking', NULL),
(89, 2, 7, 'Aaron Lippy', 3),
(90, 3, 8, 'Tim Severa', 3),
(91, 4, 9, 'Travis Hobson', NULL),
(92, 4, 10, 'Troy Anderson', NULL),
(93, 4, 11, 'Pat Laney', 2),
(94, 4, 12, 'Scott Burton', NULL),
(95, 4, 13, 'Ted Reynolds', NULL),
(96, 5, 14, 'Deb Hill', NULL),
(97, 7, 13, 'Tauyna Page', NULL),
(98, 8, 15, 'Shawnie Dakan', NULL),
(99, 8, 16, 'Dane Pence', NULL),
(100, 8, 17, 'Andy Ankeny', NULL),
(101, 8, 18, 'Tom Shanahan', NULL),
(102, 8, 19, 'Todd Cady', NULL),
(154, 8, 38, 'Greg Carpenter', 2),
(155, 9, 20, 'Travis Bell', NULL),
(156, 10, 15, 'Julie Hammons', 3),
(157, 11, 15, 'Vince Mann', NULL),
(158, 11, 21, 'Troy Rice', 4),
(159, 11, 22, 'Tony Brulotte', 3),
(160, 11, 23, 'Jason Willer', 4),
(161, 11, 24, 'Kris Knowles', 2),
(162, 11, 25, 'Jon Hallock', 3),
(163, 12, 26, 'Amy Alfredson', 1),
(164, 14, 27, 'Stacy Wilson', 4),
(165, 14, 2, 'Jennifer Murdock', 1),
(166, 15, 22, 'Ashley Holt', 3),
(167, 15, 28, 'Eric Bonds', 3),
(168, 15, 29, 'Larry Taylor', 1),
(169, 16, 30, 'Tony Brulotte', NULL),
(170, 16, 31, 'Jon Hallock', 3),
(171, 16, 32, 'Pat Lloyd', 4),
(172, 16, 33, 'Bowe von Brethorst', 3),
(173, 16, 34, 'Allen Hutchens', 4),
(174, 17, 35, 'Brian Barber', 4),
(175, 17, 36, 'Pat Coffey', 4),
(176, 17, 37, 'Larry Stocking', 4),
(177, 18, 16, 'Terry Beck', 3),
(178, 18, 17, 'Andy Ankeny', 3),
(179, 6, 39, NULL, NULL),
(180, 6, 40, NULL, NULL),
(181, 6, 20, NULL, NULL),
(182, 6, 17, NULL, NULL),
(183, 13, 41, 'Brock Sondrup', NULL),
(184, 19, 15, 'Julie Hammons', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `genders`
--

CREATE TABLE `genders` (
  `genderID` tinyint(4) NOT NULL,
  `genderName` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `genders`
--

INSERT INTO `genders` (`genderID`, `genderName`) VALUES
(1, 'boys'),
(2, 'girls'),
(3, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inventoryitems`
--

CREATE TABLE `inventoryitems` (
  `itemID` int(11) NOT NULL,
  `styleID` int(11) NOT NULL,
  `sizeID` tinyint(4) NOT NULL,
  `colorID` int(11) NOT NULL,
  `price` float NOT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventoryitems`
--

INSERT INTO `inventoryitems` (`itemID`, `styleID`, `sizeID`, `colorID`, `price`, `stock`) VALUES
(1, 1, 1, 1, 19, 0),
(2, 1, 2, 1, 19, 0),
(3, 1, 3, 1, 19, 0),
(4, 1, 4, 1, 19, 0),
(5, 1, 5, 1, 21, 0),
(6, 1, 6, 1, 23, 0),
(7, 2, 9, 1, 19, 0),
(8, 2, 10, 1, 19, 0),
(9, 2, 11, 1, 19, 0),
(10, 1, 7, 1, 25, 0),
(11, 3, 1, 1, 26, 0),
(12, 3, 2, 1, 26, 0),
(13, 3, 3, 1, 26, 0),
(14, 3, 4, 1, 26, 0),
(15, 3, 5, 1, 28, 0),
(16, 3, 6, 1, 30, 0),
(17, 4, 1, 2, 30, 0),
(18, 4, 2, 2, 30, 0),
(19, 4, 3, 2, 30, 0),
(20, 4, 4, 2, 30, 0),
(21, 4, 5, 2, 32, 0),
(22, 4, 6, 2, 34, 0),
(23, 5, 9, 2, 30, 0),
(24, 5, 10, 2, 30, 0),
(25, 5, 11, 2, 30, 0),
(26, 7, 10, 2, 36, 0),
(27, 7, 11, 2, 36, 0),
(28, 7, 12, 2, 36, 0),
(29, 8, 1, 4, 42, 0),
(30, 8, 2, 4, 42, 0),
(31, 8, 3, 4, 42, 0),
(32, 8, 4, 4, 44, 0),
(33, 8, 5, 4, 46, 0),
(34, 8, 6, 4, 48, 0),
(35, 6, 1, 2, 36, 0),
(36, 6, 2, 2, 36, 0),
(37, 6, 3, 2, 36, 0),
(38, 6, 4, 2, 36, 0),
(39, 6, 5, 2, 39, 0),
(40, 6, 6, 2, 41, 0),
(41, 6, 7, 2, 43, 0);

-- --------------------------------------------------------

--
-- Table structure for table `messageorders`
--

CREATE TABLE `messageorders` (
  `messageOrderID` int(11) NOT NULL,
  `schoolOrderID` int(11) NOT NULL,
  `genderID` tinyint(4) NOT NULL,
  `orderedBy` varchar(60) NOT NULL,
  `orderText` text DEFAULT NULL,
  `fileName` varchar(30) DEFAULT NULL,
  `orderDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messageorders`
--

INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(1, 1, 3, 'Travis Hobson', 'From: Travis Hobson\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nThunder Ridge High School\nTitans\nBlue, Black, Silver\nScott Woolstenhulme\nTrent Dabell\nTravis Hobson\nJorden Cammack\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Hobson\nThunder Ridge High School\n6A\nDrama\n\nS: 1\nM: 10\nL: 6\nXL: 4\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.186.179\nID: b055c667-7d4a-4f48-8ba2-2686b4f61178\n', 'roster (95).txt', '2024-11-14 20:18:16'),
(2, 2, 2, 'Gavin Watson', 'From: Gavin Watson\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCentennial High School\nPatriots\nMaroon & Silver\nDerek Bub\nJason Robarge\nGavin Watson\nSuzanne Fore\n\n---------------------------------------------------------\nSHIRTS\n\nGavin Watson\nCentennial High School\n6A\nSwimming - Girls\n\nM: 2\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.206\nID: 6ae877dc-1e92-4f92-bf01-ae916f84452a\n', 'roster (94).txt', '2024-11-14 21:40:43'),
(3, 3, 1, 'Brodie Parrott', 'From: Brodie Parrott\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nFiler High School\nWildcats\nRed, White & Navy\nKelli Schroeder\nShane Hild\nBrodie Parrott\nBeth Lamb\n\n---------------------------------------------------------\nSHIRTS\n\nBrodie Parrott\nFiler High School\n4A\nSwimming - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.73\nID: c25cfbe7-4572-458f-9954-7a12339e5877\n', 'roster (93).txt', '2024-11-14 21:40:43'),
(4, 4, 2, 'Greg Carpenter', 'From: Greg Carpenter\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nNampa High School\nBulldogs\nRed, Blue & White\nGregg Russell\nKasey Burkholder\nGreg Carpenter\nJohn Apgar\n\n---------------------------------------------------------\nSHIRTS\n\nGreg Carpenter\nNampa High School\n6A\nSwimming - Girls\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.111\nID: 4677d5af-f5df-419a-98ae-c9e7b5b9977e\n', 'roster (92).txt', '2024-11-14 21:40:43'),
(5, 5, 1, 'Kevin Stilling', 'From: Kevin Stilling\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nWood River High School\nWolverines\nGreen & White\nJim Foudy\nJulia Grafft\nKevin Stilling\nKaedi Fry\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Stilling\nWood River High School\n5A\nSwimming - Boys\n\nM: 2\nL: 1\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.104\nID: e47b4283-bf8e-4498-9b39-e47abad6bb2e\n', 'roster (91).txt', '2024-11-14 21:40:43'),
(6, 5, 2, 'Kevin Stilling', 'From: Kevin Stilling\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nWood River High School\nWolverines\nGreen & White\nJim Foudy\nJulia Grafft\nKevin Stilling\nKaedi Fry\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Stilling\nWood River High School\n5A\nSwimming - Girls\n\nM: 5\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.104\nID: 978a16a6-462b-4341-bfa7-558ec9318370\n', 'roster (90).txt', '2024-11-14 21:40:43'),
(7, 6, 1, 'Shaun Walker', 'From: Shaun Walker\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\nBruins\nNavy, Lt Blue & White\nBrady Dickinson\nNancy Jones\nShaun Walker\nBeth Lamb\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nSwimming - Boys\n\nL: 7\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 19ab5b13-b182-415a-bb11-d78d389efffc\n', 'roster (89).txt', '2024-11-14 21:40:43'),
(8, 6, 2, 'Shaun Walker', 'From: Shaun Walker\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\nBruins\nNavy, Lt Blue & White\nBrady Dickinson\nNancy Jones\nShaun Walker\nBeth Lamb\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nSwimming - Girls\n\nS: 1\nM: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 2a2e352e-dfd0-4fb7-9f3b-f13f70034861\n', 'roster (88).txt', '2024-11-14 21:40:43'),
(9, 7, 2, 'Patrick Laney', 'From: Patrick Laney\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMoscow High School\nBears\nRed, Black & White\nShawn Tiegs\nErik Perryman\nPatrick Laney\nShelly Ruspakka\n\n---------------------------------------------------------\nSHIRTS\n\nPatrick Laney\nMoscow High School\n5A\nSwimming - Girls\n\nS: 2\nM: 4\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.163\nID: 7f8baffb-5817-4590-a0d1-2c14f0bce488\n', 'roster (85).txt', '2024-11-14 21:40:43'),
(10, 8, 1, 'Luke Wolf', 'From: Luke Wolf\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nKuna High School\nKavemen\nBlack & Vegas Gold\nKim Bekkedahl\nRobbie Reno\nLuke Wolf\nLeslie Kohler\n\n---------------------------------------------------------\nSHIRTS\n\nLuke Wolf\nKuna High School\n6A\nSwimming - Boys\n\nM: 1\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.5\nID: 69fe2a69-80bf-4f58-8ac5-c0e5c8f13a2e\n', 'roster (87).txt', '2024-11-14 21:40:43'),
(11, 7, 1, 'Patrick Laney', 'From: Patrick Laney\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMoscow High School\nBears\nRed, Black & White\nShawn Tiegs\nErik Perryman\nPatrick Laney\nShelly Ruspakka\n\n---------------------------------------------------------\nSHIRTS\n\nPatrick Laney\nMoscow High School\n5A\nSwimming - Boys\n\nM: 3\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.218\nID: 09246c98-7483-456b-87e1-ebd170434c68\n', 'roster (86).txt', '2024-11-14 21:40:43'),
(12, 9, 1, 'Eric Bonds', 'From: Eric Bonds\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nSkyview High School\nHawks\nNavy, Silver, Light Blue & White\nGregg Russell\nDave Young\nEric Bonds\nJohn Apgar\n\n---------------------------------------------------------\nSHIRTS\n\nEric Bonds\nSkyview High School\n5A\nSwimming - Boys\n\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.217\nID: 9bbbbeed-9f34-494f-9945-eac47dce576a\n', 'roster (84).txt', '2024-11-14 21:40:43'),
(13, 9, 2, 'Eric Bonds', 'From: Eric Bonds\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSkyview High School\nHawks\nNavy, Silver, Light Blue & White\nGregg Russell\nDave Young\nEric Bonds\nJohn Apgar\n\n---------------------------------------------------------\nSHIRTS\n\nEric Bonds\nSkyview High School\n5A\nSwimming - Girls\n\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.104\nID: 55f4b03f-0637-4362-990d-bdac3b7ab26b\n', 'roster (83).txt', '2024-11-14 21:40:43'),
(14, 10, 1, 'Dane Pence', 'From: Dane Pence\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMountain View High School\nMavericks\nBlue, Green & White\nDerek Bub\nScot Montoya\nDane Pence\nMaddie Rice\n\n---------------------------------------------------------\nSHIRTS\n\nDane Pence\nMountain View High School\n6A\nSwimming - Boys\n\nM: 1\nL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.227\nID: 913a61a5-7d41-4ec7-b422-76bd5a3cbe4c\n', 'roster (82).txt', '2024-11-14 21:40:43'),
(15, 10, 2, 'Dane Pence', 'From: Dane Pence\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMountain View High School\nMavericks\nBlue, Green & White\nDerek Bub\nScot Montoya\nDane Pence\nMaddie Rice\n\n---------------------------------------------------------\nSHIRTS\n\nDane Pence\nMountain View High School\n6A\nSwimming - Girls\n\nS: 1\nM: 5\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.227\nID: 11146d89-305c-4896-a1d1-b1db92082185\n', 'roster (81).txt', '2024-11-14 21:40:43'),
(16, 11, 2, 'Josh Wells', 'From: Josh Wells\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nShelley High School\nRussets\nRed, Black & White\nDoug McLaren\nBurke Davis\nJosh Wells\nTia Rickabaugh\n\n---------------------------------------------------------\nSHIRTS\n\nJosh Wells\nShelley High School\n5A\nSwimming - Girls\n\nS: 1\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.63\nID: 7eef417f-71aa-4d0f-98a4-446701bc9634\n', 'roster (80).txt', '2024-11-14 21:40:43'),
(17, 12, 1, 'Ted Reynolds', 'From: Ted Reynolds\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCanyon Ridge High School\nRiverhawks\nCrimson & Silver\nBrady Dickinson\nRandall Miskin\nTed Reynolds\nMichael Ashby\n\n---------------------------------------------------------\nSHIRTS\n\nTed Reynolds\nCanyon Ridge High School\n6A\nSwimming - Boys\n\nM: 1\nL: 4\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.24\nID: 21b70f62-1be1-4023-a468-45b069cce35d\n', 'roster (78).txt', '2024-11-14 21:40:43'),
(18, 13, 1, 'Tyler Johnson', 'From: Tyler Johnson\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBonneville High School\nBees\nGreen, Gold & White\nScott Woolstenhulme\nJustin Jolley\nTyler Johnson\nGlenn Roth\n\n---------------------------------------------------------\nSHIRTS\n\nTyler Johnson\nBonneville High School\n5A\nSwimming - Boys\n\nM: 1\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.214.86\nID: bbff3421-8c30-4716-9f11-497af743ac26\n', 'roster (76).txt', '2024-11-14 21:40:43'),
(19, 12, 2, 'Ted Reynolds', 'From: Ted Reynolds\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCanyon Ridge High School\nRiverhawks\nCrimson & Silver\nBrady Dickinson\nRandall Miskin\nTed Reynolds\nMichael Ashby\n\n---------------------------------------------------------\nSHIRTS\n\nTed Reynolds\nCanyon Ridge High School\n6A\nSwimming - Girls\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.93\nID: 8526a39d-fc44-4591-9418-c1e350ee0117\n', 'roster (77).txt', '2024-11-14 21:40:43'),
(20, 14, 1, 'Ty Shippen', 'From: Ty Shippen\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nRyan Hancock\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nSwimming - Boys\n\nM: 2\nL: 1\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.102\nID: 97130a96-3d85-4e41-8c76-b507709abebd\n', 'roster (75).txt', '2024-11-14 21:40:43'),
(21, 14, 2, 'Ty Shippen', 'From: Ty Shippen\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nRyan Hancock\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nSwimming - Girls\n\nM: 3\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.102\nID: 01276d88-2a7f-454f-9b31-fa6d3ea6abd7\n', 'roster (74).txt', '2024-11-14 21:40:43'),
(22, 15, 2, 'Larry Stocking', 'From: Larry Stocking\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nHillcrest High School\nKnights\nRed, Black & White\nScott Woolstenhulme\nTy Salsbery\nLarry Stocking\nSara Nelson\n\n---------------------------------------------------------\nSHIRTS\n\nLarry Stocking\nHillcrest High School\n5A\nSwimming - Girls\n\nM: 5\nL: 3\n2XL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.186.179\nID: 534b339b-c931-4869-bba4-64113cefa920\n', 'roster (73).txt', '2024-11-14 21:40:43'),
(23, 16, 1, 'Todd Cady', 'From: Todd Cady\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nColumbia High School\nWildcats\nMaroon & Gold\nGreg Russell\nCory Woolstenhulme\nTodd Cady\nJohn Apgar\n\n---------------------------------------------------------\nSHIRTS\n\nTodd Cady\nColumbia High School\n5A\nSwimming - Boys\n\nM: 1\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.71\nID: 4817c7ce-3e54-42d0-8bde-4e1d613535b6\n', 'roster (71).txt', '2024-11-14 21:40:43'),
(24, 16, 2, 'Todd Cady', 'From: Todd Cady\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nColumbia High School\nWildcats\nMaroon & Gold\nGreg Russell\nCory Woolstenhulme\nTodd Cady\nJohn Apgar\n\n---------------------------------------------------------\nSHIRTS\n\nTodd Cady\nColumbia High School\n5A\nSwimming - Girls\n\nS: 1\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.71\nID: c1542189-7e0d-47a0-96f4-52d8c410a033\n', 'roster (72).txt', '2024-11-14 21:40:43'),
(25, 17, 1, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nAaron Tabor\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nSwimming - Boys\n\nM: 4\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 67df0155-e225-4c33-88b1-82e8bbaad53d\n', 'roster (70).txt', '2024-11-14 21:40:43'),
(26, 17, 2, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nAaron Tabor\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nSwimming - Girls\n\nM: 2\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 331dc8e1-2fe7-4fb4-b518-3eb28485f885\n', 'roster (69).txt', '2024-11-14 21:40:43'),
(27, 18, 1, 'Scott Burton', 'From: Scott Burton\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nJerome High School\nTigers\nBlack & Orange\nBrent Johnson\nNathan Tracy\nScott Burton\nBritani Barrus\n\n---------------------------------------------------------\nSHIRTS\n\nScott Burton\nJerome High School\n5A\nSwimming - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.14\nID: 79007b60-9981-4dbd-acb0-305c97d72c05\n', 'roster (67).txt', '2024-11-14 21:40:43'),
(28, 18, 2, 'Scott Burton', 'From: Scott Burton\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nJerome High School\nTigers\nBlack & Orange\nBrent Johnson\nNathan Tracy\nScott Burton\nBritani Barrus\n\n---------------------------------------------------------\nSHIRTS\n\nScott Burton\nJerome High School\n5A\nSwimming - Girls\n\nS: 2\nM: 3\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.14\nID: a91b43ed-748a-4938-aa8b-337bb1a85759\n', 'roster (66).txt', '2024-11-14 21:40:43'),
(29, 19, 1, 'Travis Hobson', 'From: Travis Hobson\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nThunder Ridge High School\nTitans\nBlue, Black, Silver\nScott Woolstenhulme\nTrent Dabell\nTravis Hobson\nJaNeil Jones\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Hobson\nThunder Ridge High School\n6A\nSwimming - Boys\n\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.214.110\nID: 15bc38e5-5e82-4e6e-b6f0-d47ffdb975ac\n', 'roster (65).txt', '2024-11-14 21:40:43'),
(30, 19, 2, 'Travis Hobson', 'From: Travis Hobson\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nThunder Ridge High School\nTitans\nBlue, Black, Silver\nScott Woolstenhulme\nTrent Dabell\nTravis Hobson\nJaNeil Jones\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Hobson\nThunder Ridge High School\n6A\nSwimming - Girls\n\nS: 1\nM: 6\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.214.111\nID: a328222d-5e05-44bb-9465-31c37a90052d\n', 'roster (64).txt', '2024-11-14 21:40:43'),
(31, 20, 2, 'Connor Jackson', 'From: Connor Jackson\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCole Valley Christian High School\nChargers\nBlue, White & Silver\nAllen Howlett\nKim DeMain\nConnor Jackson\nKristin Hill\n\n---------------------------------------------------------\nSHIRTS\n\nConnor Jackson\nCole Valley Christian High School\n4A\nSwimming - Girls\n\nM: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.91.22\nID: 1a2b641c-72e6-4183-9581-0c1e77f51795\n', 'roster (63).txt', '2024-11-14 21:40:43'),
(32, 20, 1, 'Connor Jackson', 'From: Connor Jackson\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCole Valley Christian High School\nChargers\nBlue, White & Silver\nAllen Howlett\nKim DeMain\nConnor Jackson\nKristin Hill\n\n---------------------------------------------------------\nSHIRTS\n\nConnor Jackson\nCole Valley Christian High School\n4A\nSwimming - Boys\n\nM: 1\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.91.22\nID: 1977cb09-e879-4685-9239-d18c0d714f39\n', 'roster (62).txt', '2024-11-14 21:40:43'),
(33, 21, 1, 'Tom Shanahan', 'From: Tom Shanahan\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBishop Kelly High School\nKnights\nBlack & Gold\nBill Avey\nSarah Quilici\nTom Shanahan\nRyan Stratton\n\n---------------------------------------------------------\nSHIRTS\n\nTom Shanahan\nBishop Kelly High School\n5A\nSwimming - Boys\n\nL: 10\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.6\nID: da015a29-77c2-4b10-aca1-bf1e1a661f6b\n', 'roster (60).txt', '2024-11-14 21:40:43'),
(34, 21, 2, 'Tom Shanahan', 'From: Tom Shanahan\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBishop Kelly High School\nKnights\nBlack & Gold\nBill Avey\nSarah Quilici\nTom Shanahan\nRyan Stratton\n\n---------------------------------------------------------\nSHIRTS\n\nTom Shanahan\nBishop Kelly High School\n5A\nSwimming - Girls\n\nS: 2\nM: 5\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.6\nID: 6ea99495-3fb6-48e7-bef9-2e169f7f91f6\n', 'roster (59).txt', '2024-11-14 21:40:43'),
(35, 22, 1, 'Nichole Williamson', 'From: Nichole Williamson\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMeridian High School\nWarriors\nBlue & Gold\nDerek Bub\nJill Lilienkamp\nNichole Williamson\nAndrea Thiltgen\n\n---------------------------------------------------------\nSHIRTS\n\nNichole Williamson\nMeridian High School\n6A\nSwimming - Boys\n\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.166\nID: 5dc8d1a5-f039-438f-94d4-dd4656554ee4\n', 'roster (57).txt', '2024-11-14 21:40:43'),
(36, 23, 2, 'Douglas Henderson', 'From: Douglas Henderson\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLewiston High School\nBengals\nPurple & Gold\nLance Hansen\nKevin Driskill\nDoug Henderson\nDonelle McKee\n\n---------------------------------------------------------\nSHIRTS\n\nDouglas Henderson\nLewiston High School\n5A\nSwimming - Girls\n\nS: 1\nM: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.9\nID: b6dc62fa-ee53-4d15-adf2-69dc573faad9\n', 'roster (55).txt', '2024-11-14 21:40:43'),
(37, 23, 1, 'Douglas Henderson', 'From: Douglas Henderson\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nLewiston High School\nBengals\nPurple & Gold\nLance Hansen\nKevin Driskill\nDoug Henderson\nDonelle McKee\n\n---------------------------------------------------------\nSHIRTS\n\nDouglas Henderson\nLewiston High School\n5A\nSwimming - Boys\n\nM: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.9\nID: 6cb4e657-47e8-4d5b-8bc9-8200ed157255\n', 'roster (54).txt', '2024-11-14 21:40:43'),
(38, 24, 1, 'Norma Alley', 'From: Norma Alley\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene High School\nVikings\nRoyal & White\nShon Hocker\nMike Randles\nVictoria Beecher\nLaura Curtis\n\n---------------------------------------------------------\nSHIRTS\n\nNorma Alley\nCoeur d\'Alene High School\n6A\nSwimming - Boys\n\nM: 2\nL: 3\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.224\nID: 7f9fc572-9e23-4329-ac8b-ad2de972d1d7\n', 'roster (53).txt', '2024-11-14 21:40:43'),
(39, 25, 1, 'Shayne Proctor', 'From: Shayne Proctor\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMadison High School\nBobcats\nRed, White & Gray\nRandy Lords\nBradee Klassen\nShayne Proctor\nTerry Tlustek\n\n---------------------------------------------------------\nSHIRTS\n\nShayne Proctor\nMadison High School\n6A\nSwimming - Boys\n\nL: 4\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.63\nID: de587ef9-2f73-4d0a-8aeb-23c7b10eb7eb\n', 'roster (51).txt', '2024-11-14 21:40:43'),
(40, 25, 2, 'Shayne Proctor', 'From: Shayne Proctor\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMadison High School\nBobcats\nRed, White & Gray\nRandy Lords\nBradee Klassen\nShayne Proctor\nTerry Tlustek\n\n---------------------------------------------------------\nSHIRTS\n\nShayne Proctor\nMadison High School\n6A\nSwimming - Girls\n\nM: 1\nL: 5\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.63\nID: ee2ca425-c106-427e-b2eb-9267149bfff7\n', 'roster (52).txt', '2024-11-14 21:40:43'),
(41, 24, 2, 'Norma Alley', 'From: Norma Alley\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene High School\nVikings\nRoyal & White\nShon Hocker\nMike Randles\nVictoria Beecher\nLaura Curtis\n\n---------------------------------------------------------\nSHIRTS\n\nNorma Alley\nCoeur d\'Alene High School\n6A\nSwimming - Girls\n\nS: 1\nM: 4\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.224\nID: 5a8b1e59-f756-4553-80da-51be1618fe32\n', 'roster (49).txt', '2024-11-14 21:40:43'),
(42, 26, 2, 'Rachael Petersen', 'From: Rachael Petersen\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLake City High School\nTimberwolves\nNavy, Teal & Silver\nShon Hocker\nDeanne Clifford\nTroy Anderson\nMichelle Sobek\n\n---------------------------------------------------------\nSHIRTS\n\nRachael Petersen\nLake City High School\n6A\nSwimming - Girls\n\nS: 2\nM: 4\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.190\nID: ca1996bd-4378-46d6-8b29-38d99152e4f4\n', 'roster (48).txt', '2024-11-14 21:40:43'),
(43, 26, 1, 'Rachael Petersen', 'From: Rachael Petersen\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nLake City High School\nTimberwolves\nNavy, Teal & Silver\nShon Hocker\nDeanne Clifford\nTroy Anderson\nMichelle Sobek\n\n---------------------------------------------------------\nSHIRTS\n\nRachael Petersen\nLake City High School\n6A\nSwimming - Boys\n\nL: 2\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.234\nID: f0729d5f-6f07-4001-83a6-db6d2e95b201\n', 'roster (47).txt', '2024-11-14 21:40:43'),
(44, 27, 1, 'Robert Parker', 'From: Robert Parker\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nPocatello High School\nThunder\nRed & Blue\nDoug Howell\nLisa Delonas\nRobert Parker\nAileen Pannecoucke\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Parker\nPocatello High School\n5A\nSwimming - Boys\n\nM: 1\nL: 7\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.119\nID: 70c21ef9-d87b-4412-bd3b-6c2ae2d9f6d4\n', 'roster (46).txt', '2024-11-14 21:40:43'),
(45, 27, 2, 'Robert Parker', 'From: Robert Parker\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nPocatello High School\nThunder\nRed & Blue\nDoug Howell\nLisa Delonas\nRobert Parker\nAileen Pannecoucke\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Parker\nPocatello High School\n5A\nSwimming - Girls\n\nS: 1\nM: 1\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.119\nID: fd098000-c105-4ab5-ba10-0c28de36ccab\n', 'roster (45).txt', '2024-11-14 21:40:43'),
(46, 28, 1, 'Matt Neff', 'From: Matt Neff\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nLakeland High School\nHawks\nGreen & Gold\nLisa Arnold\nJimmy Hoffman\nMatt Neff\nMichelle Dansereau\n\n---------------------------------------------------------\nSHIRTS\n\nMatt Neff\nLakeland High School\n5A\nSwimming - Boys\n\nM: 2\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.244\nID: a6f535ee-a63c-459a-9096-19e2fd55828e\n', 'roster (44).txt', '2024-11-14 21:40:43'),
(47, 29, 1, 'Kim Liebich', 'From: Kim Liebich\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nRiverstone International School\nOtters\nNavy & Light Blue\nJohn Gasparini\nStacey Walker\nKim Liebich\nHailey McGahan\n\n---------------------------------------------------------\nCOMMENT\n\nThank you!\n\n---------------------------------------------------------\nSHIRTS\n\nKim Liebich\nRiverstone International School\n2A\nSwimming - Boys\n\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.61\nID: f43dfcfc-5657-4987-abd9-c13f7f053010\n', 'roster (43).txt', '2024-11-14 21:40:43'),
(48, 30, 2, 'Craig Christensen', 'From: Craig Christensen\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nPost Falls High School\nTrojans\nOrange & Black\nDena Naccarato\nChris Sensel\nCraig Christensen\nJessica Watkins\n\n---------------------------------------------------------\nSHIRTS\n\nCraig Christensen\nPost Falls High School\n6A\nSwimming - Girls\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.187\nID: 2c771141-7127-4011-a287-a0b591708a22\n', 'roster (42).txt', '2024-11-14 21:40:43'),
(49, 30, 1, 'Craig Christensen', 'From: Craig Christensen\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nPost Falls High School\nTrojans\nOrange & Black\nDena Naccarato\nChris Sensel\nCraig Christensen\nJessica Watkins\n\n---------------------------------------------------------\nSHIRTS\n\nCraig Christensen\nPost Falls High School\n6A\nSwimming - Boys\n\nM: 2\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.187\nID: 6e3f2b18-c7b4-469b-a530-b0584386f5aa\n', 'roster (41).txt', '2024-11-14 21:40:43'),
(50, 31, 1, 'Troy Rice', 'From: Troy Rice\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nRoberta Garvin\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nSwimming - Boys\n\nL: 5\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.178\nID: 7f5f82f3-25ba-420e-a3c6-a7d811f4df8e\n', 'roster (40).txt', '2024-11-14 21:40:43'),
(51, 31, 2, 'Troy Rice', 'From: Troy Rice\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nRoberta Garvin\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nSwimming - Girls\n\nS: 1\nM: 2\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.178\nID: e229eb10-3418-4d01-8c28-ced772d64d97\n', 'roster (39).txt', '2024-11-14 21:40:43'),
(52, 32, 1, 'Brian Barber', 'From: Brian Barber\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBoise High School\nBrave\nRed & White\nLisa Roberts\nDeborah Watts\nBrian Barber\nCraig Quarterman\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Barber\nBoise High School\n6A\nSwimming - Boys\n\nM: 4\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.30\nID: 05a692bc-7874-49e6-8c13-ab6dae2e1895\n', 'roster (38).txt', '2024-11-14 21:40:43'),
(53, 32, 2, 'Brian Barber', 'From: Brian Barber\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBoise High School\nBrave\nRed & White\nLisa Roberts\nDeborah Watts\nBrian Barber\nCraig Quarterman\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Barber\nBoise High School\n6A\nSwimming - Girls\n\nM: 4\nL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.30\nID: 29b988aa-258e-4ec9-86c1-a9df909b2265\n', 'roster (37).txt', '2024-11-14 21:40:43'),
(54, 33, 1, 'Jennifer Murdock', 'From: Jennifer Murdock\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nDeclo High School\nHornets\nOrange & Black\nSandra Miller\nRoland Bott\nJennifer Murdock\nJessica Thompson\n\n---------------------------------------------------------\nSHIRTS\n\nJennifer Murdock\nDeclo High School\n4A\nSwimming - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.35.82\nID: c714d2c5-29ec-4454-8272-a81f8507cb15\n', 'roster (36).txt', '2024-11-14 21:40:43'),
(55, 33, 2, 'Jennifer Murdock', 'From: Jennifer Murdock\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nDeclo High School\nHornets\nOrange & Black\nSandra Miller\nRoland Bott\nJennifer Murdock\nJessica Thompson\n\n---------------------------------------------------------\nSHIRTS\n\nJennifer Murdock\nDeclo High School\n4A\nSwimming - Girls\n\nS: 2\nM: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.35.82\nID: 0028c0c5-30e5-4ac5-a496-7a6cfbce3cba\n', 'roster (35).txt', '2024-11-14 21:40:43'),
(56, 34, 1, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nPeggy Kaiser\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nSwimming - Boys\n\nL: 4\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.6\nID: 3c6eb3ae-3df3-4698-9587-54fb025df5ef\n', 'roster (34).txt', '2024-11-14 21:40:43'),
(57, 34, 2, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nPeggy Kaiser\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nSwimming - Girls\n\nM: 3\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.6\nID: 2b8508a2-5459-499a-b741-a3bbe72cc89a\n', 'roster (33).txt', '2024-11-14 21:40:43'),
(58, 35, 2, 'Brady Trenkle', 'From: Brady Trenkle\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMinico High School\nSpartans\nRed & Gold\nSpencer Larsen\nKimberley Kidd\nBrady Trenkle\nMelanie Knowles\n\n---------------------------------------------------------\nSHIRTS\n\nBrady Trenkle\nMinico High School\n5A\nSwimming - Girls\n\nM: 2\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.187.51\nID: e48a5992-9218-4f1d-83e2-c91540cb7a06\n', 'roster (32).txt', '2024-11-14 21:40:43'),
(59, 36, 2, 'Ryon Pope', 'From: Ryon Pope\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nGooding High School\nSenators\nRed & Black\nDavid Carson\nLeigh Patterson\nRyon Pope\nDanielle Lofgran\n\n---------------------------------------------------------\nSHIRTS\n\nRyon Pope\nGooding High School\n4A\nSwimming - Girls\n\nS: 1\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.43\nID: 28606774-7c28-409d-8fa5-910ee9b5840f\n', 'roster (30).txt', '2024-11-14 21:40:43'),
(60, 35, 1, 'Brady Trenkle', 'From: Brady Trenkle\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMinico High School\nSpartans\nRed & Gold\nSpencer Larsen\nKimberley Kidd\nBrady Trenkle\nMelanie Knowles\n\n---------------------------------------------------------\nSHIRTS\n\nBrady Trenkle\nMinico High School\n5A\nSwimming - Boys\n\nM: 1\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.210.107\nID: 45608775-93ac-4895-9879-ab8326f586bd\n', 'roster (31).txt', '2024-11-14 21:40:43'),
(61, 37, 2, 'Randy Winn', 'From: Randy Winn\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBurley High School\nBobcats\nGreen, Gray, Black & White\nSandra Miller\nLevi Power\nRandy Winn\nMelanie Knowles\n\n---------------------------------------------------------\nCOMMENT\n\nAli Hemsley - S\n\n---------------------------------------------------------\nSHIRTS\n\nRandy Winn\nBurley High School\n5A\nSwimming - Girls\n\nS: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.211.10\nID: 12a9f18e-a299-44ad-995f-928916a8ab9c\n', 'roster (29).txt', '2024-11-14 21:40:43'),
(62, 37, 1, 'Randy Winn', 'From: Randy Winn\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBurley High School\nBobcats\nGreen, Gray, Black & White\nSandra Miller\nLevi Power\nRandy Winn\nMelanie Knowles\n\n---------------------------------------------------------\nCOMMENT\n\nColton Treasure - M  Austin Hemsley - M  Zack Neal - L  Isaac Sheffer - L  Ty Abenroth - L  Kaleb Dial - XL\n\n---------------------------------------------------------\nSHIRTS\n\nRandy Winn\nBurley High School\n5A\nSwimming - Boys\n\nM: 2\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.211.10\nID: 41b64271-0952-4727-8c1c-7294132a5fd2\n', 'roster (28).txt', '2024-11-14 21:40:43'),
(63, 36, 1, 'Ryon Pope', 'From: Ryon Pope\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nGooding High School\nSenators\nRed & Black\nDavid Carson\nLeigh Patterson\nRyon Pope\nDanielle Lofgran\n\n---------------------------------------------------------\nSHIRTS\n\nRyon Pope\nGooding High School\n4A\nSwimming - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.43\nID: 5dd01e3d-1af8-42b3-9c16-cc0107f7dad5\n', 'roster (27).txt', '2024-11-14 21:40:43'),
(64, 38, 1, 'Ted Bell', 'From: Ted Bell\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nHighland High School - Pocatello\nRams\nBlack, White & Red\nDoug Howell\nBrad Wallace\nTravis Bell\nDan Dallon\n\n---------------------------------------------------------\nSHIRTS\n\nTed Bell\nHighland High School - Pocatello\n6A\nSwimming - Boys\n\nM: 2\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.63\nID: be6d48cb-6891-40a4-a530-cb64ed453bdd\n', 'roster (26).txt', '2024-11-14 21:40:43'),
(65, 38, 2, 'Ted Bell', 'From: Ted Bell\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nHighland High School - Pocatello\nRams\nBlack, White & Red\nDoug Howell\nBrad Wallace\nTravis Bell\nDan Dallon\n\n---------------------------------------------------------\nSHIRTS\n\nTed Bell\nHighland High School - Pocatello\n6A\nSwimming - Girls\n\nM: 2\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.63\nID: d347d965-ad1e-4907-9410-72790f81bce9\n', 'roster (25).txt', '2024-11-14 21:40:43'),
(66, 39, 2, 'Nick Birch', 'From: Nick Birch\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nLiz Grimes\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nSwimming - Girls\n\nM: 4\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.55\nID: 2e51fcce-b388-424e-8114-4b043d040942\n', 'roster (24).txt', '2024-11-14 21:40:43'),
(67, 40, 1, 'Dane Roy', 'From: Dane Roy\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nBrooke Snyder\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nSwimming - Boys\n\nM: 1\nL: 1\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.188\nID: b7949edc-3351-41e9-86c6-889cf78c0239\n', 'roster (22).txt', '2024-11-14 21:40:43'),
(68, 39, 1, 'Nick Birch', 'From: Nick Birch\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nLiz Grimes\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nSwimming - Boys\n\nM: 2\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.220\nID: 4fb2955f-011c-41bf-8c39-ecb492cfdc10\n', 'roster (23).txt', '2024-11-14 21:40:43'),
(69, 41, 1, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nChristine Dustin\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nSwimming - Boys\n\nS: 1\nM: 3\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.32\nID: 066993a7-97c2-4fac-93f7-619cb9c91a36\n', 'roster (20).txt', '2024-11-14 21:40:43'),
(70, 40, 2, 'Dane Roy', 'From: Dane Roy\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nBrooke Snyder\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nSwimming - Girls\n\nM: 1\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.188\nID: 438aeff4-d777-4077-ae4d-c924748fb83b\n', 'roster (21).txt', '2024-11-14 21:40:43'),
(71, 42, 2, 'Tol Gropp', 'From: Tol Gropp\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nTimberline High School - Boise\nWolves\nBlue, Silver & Black\nLisa Roberts\nDiana Molino\nTol Gropp\nHailey McGahan\n\n---------------------------------------------------------\nSHIRTS\n\nTol Gropp\nTimberline High School - Boise\n6A\nSwimming - Girls\n\nS: 4\nM: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.132\nID: a737b371-f5d4-4d78-bbc3-d4ee6ce2e230\n', 'roster (18).txt', '2024-11-14 21:40:43'),
(72, 41, 2, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nChristine Dustin\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nSwimming - Girls\n\nS: 1\nM: 6\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.96\nID: 118f2b77-641e-4f27-9c4f-0b1bc10ded7d\n', 'roster (19).txt', '2024-11-14 21:40:43'),
(73, 42, 1, 'Tol Gropp', 'From: Tol Gropp\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nTimberline High School - Boise\nWolves\nBlue, Silver & Black\nLisa Roberts\nDiana Molino\nTol Gropp\nHailey McGahan\n\n---------------------------------------------------------\nSHIRTS\n\nTol Gropp\nTimberline High School - Boise\n6A\nSwimming - Boys\n\nS: 1\nM: 3\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.132\nID: d2526e40-68ca-4d3e-805a-027553183c0d\n', 'roster (17).txt', '2024-11-14 21:40:43'),
(74, 43, 1, 'Zach Dong', 'From: Zach Dong\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nKimberly High School\nBulldogs\nRed, Black & White\nLuke Schroeder\nDarin Gonzales\nZach Dong\nMatt Wirtz\n\n---------------------------------------------------------\nSHIRTS\n\nZach Dong\nKimberly High School\n4A\nSwimming - Boys\n\nM: 1\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.246.35\nID: 4b30bcef-b09b-4621-b064-4d811056d977\n', 'roster (16).txt', '2024-11-14 21:40:43'),
(75, 43, 2, 'Zach Dong', 'From: Zach Dong\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nKimberly High School\nBulldogs\nRed, Black & White\nLuke Schroeder\nDarin Gonzales\nZach Dong\nMatt Wirtz\n\n---------------------------------------------------------\nSHIRTS\n\nZach Dong\nKimberly High School\n4A\nSwimming - Girls\n\nS: 1\nM: 4\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.48\nID: 1b750d59-57e9-4bed-a162-47f82b67abc0\n', 'roster (15).txt', '2024-11-14 21:40:43'),
(76, 44, 1, 'Andy Ankeny', 'From: Andy Ankeny\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMiddleton High School\nVikings\nNavy & Gold\nMarc Gee\nJohnny Hullinger\nAndy Ankeny\nLarry Beidler\n\n---------------------------------------------------------\nSHIRTS\n\nAndy Ankeny\nMiddleton High School\n5A\nSwimming - Boys\n\nM: 2\nL: 2\nXL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.167\nID: 774d9d2c-b974-4ccc-84a9-4a6807a3dda8\n', 'roster (14).txt', '2024-11-14 21:40:43'),
(77, 44, 2, 'Andy Ankeny', 'From: Andy Ankeny\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMiddleton High School\nVikings\nNavy & Gold\nMarc Gee\nJohnny Hullinger\nAndy Ankeny\nLarry Beidler\n\n---------------------------------------------------------\nSHIRTS\n\nAndy Ankeny\nMiddleton High School\n5A\nSwimming - Girls\n\nM: 1\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.147\nID: d1c0a332-0c17-4791-afbd-03dddd3e61d3\n', 'roster (13).txt', '2024-11-14 21:40:43'),
(78, 45, 1, 'John Hartz', 'From: John Hartz\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nRidgevue High School\nWarhawks\nOrange, Black, White & Gray\nLisa Boyd\nRobert Gwyn\nJohn Hartz\nTBD\n\n---------------------------------------------------------\nSHIRTS\n\nJohn Hartz\nRidgevue High School\n6A\nSwimming - Boys\n\nM: 3\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.93\nID: e8fac797-49fa-4fb8-acbb-d01b94871a42\n', 'roster (12).txt', '2024-11-14 21:40:43'),
(79, 46, 2, 'Rikki Tolmie', 'From: Rikki Tolmie\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nParma High School\nPanthers\nBlack, White & Red\nDale Layne\nMonique Jensen\nRikki Tolmie\nTBD\n\n---------------------------------------------------------\nSHIRTS\n\nRikki Tolmie\nParma High School\n3A\nSwimming - Girls\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.191\nID: 9fadf743-5cbc-4417-93ba-257872770f08\n', 'roster (10).txt', '2024-11-14 21:40:43'),
(80, 45, 2, 'John Hartz', 'From: John Hartz\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRidgevue High School\nWarhawks\nOrange, Black, White & Gray\nLisa Boyd\nRobert Gwyn\nJohn Hartz\nTBD\n\n---------------------------------------------------------\nSHIRTS\n\nJohn Hartz\nRidgevue High School\n6A\nSwimming - Girls\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.146\nID: 71398ebe-92a2-4639-9945-9e6a4d029d30\n', 'roster (11).txt', '2024-11-14 21:40:43'),
(81, 47, 2, 'TJ Clary', 'From: TJ Clary\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSandpoint High School\nBulldogs\nRed & White\nBecky Meyer\nJacki Crossingham\nTJ Clary\nGreg Jackson\n\n---------------------------------------------------------\nSHIRTS\n\nTJ Clary\nSandpoint High School\n5A\nSwimming - Girls\n\nS: 1\nM: 5\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.132\nID: b5e2807a-2309-4d90-91a5-3a7992ad61e2\n', 'roster (9).txt', '2024-11-14 21:40:43'),
(82, 47, 1, 'TJ Clary', 'From: TJ Clary\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nSandpoint High School\nBulldogs\nRed & White\nBecky Meyer\nJacki Crossingham\nTJ Clary\nGreg Jackson\n\n---------------------------------------------------------\nSHIRTS\n\nTJ Clary\nSandpoint High School\n5A\nSwimming - Boys\n\nM: 4\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.133\nID: 0e21e35a-c409-44ed-8545-887a65e4b694\n', 'roster (8).txt', '2024-11-14 21:40:43'),
(83, 48, 2, 'Mark Mace', 'From: Mark Mace\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nOakley High School\nHornets\nRed & White\nSandra Miller\nJaren Wadsworth\nMark Mace\nTBD\n\n---------------------------------------------------------\nSHIRTS\n\nMark Mace\nOakley High School\n2A\nSwimming - Girls\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.46\nID: cc60fded-6630-4be3-bd88-6cd39289232d\n', 'roster (7).txt', '2024-11-14 21:40:43'),
(84, 49, 2, 'Jessica Muraski', 'From: Jessica Muraski\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMountain Home High School\nTigers\nOrange & Black\nJames Gilbert\nSam Gunderson\nJessica Muraski\nJeff Tibbits\n\n---------------------------------------------------------\nSHIRTS\n\nJessica Muraski\nMountain Home High School\n5A\nSwimming - Girls\n\nS: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.199\nID: 51c6f8fd-0534-479e-b510-3e7679ff74dc\n', 'roster (6).txt', '2024-11-14 21:40:43'),
(85, 49, 1, 'Jessica Muraski', 'From: Jessica Muraski\nActivity: Swimming - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMountain Home High School\nTigers\nOrange & Black\nJames Gilbert\nSam Gunderson\nJessica Muraski\nJeff Tibbits\n\n---------------------------------------------------------\nSHIRTS\n\nJessica Muraski\nMountain Home High School\n5A\nSwimming - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.199\nID: 1a580f88-c7a5-4ab2-978c-b2039ba1ab23\n', 'roster (5).txt', '2024-11-14 21:40:43'),
(86, 50, 2, 'Tina Pelkey', 'From: Tina Pelkey\nActivity: Swimming - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nNampa Christian High School\nTrojans\nMaroon & Gold\nGreg Wiles\nJim Eisentrager\nTina Pelkey\nTBD\n\n---------------------------------------------------------\nCOMMENT\n\nThank you for your generous support of our student athletes!\n\n---------------------------------------------------------\nSHIRTS\n\nTina Pelkey\nNampa Christian High School\n3A\nSwimming - Girls\n\nS: 2\nM: 1\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.200\nID: b91233fe-3765-4f61-9bb0-e7f5a97c18d3\n', 'roster (4).txt', '2024-11-14 21:40:43');
INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(87, 51, 1, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nJamshid Roomiany\nNate Armstrong\nKamran Dailami\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Liam Reed		9\n	2	Dalton Poulson		9\n	3	Jack Servoss		10\n	4	Anthonie Bravo		9\n	7	Owen Stout		12\n	9	Peyton Hepworth		11\n	11	Peja Weed		12\n	12	Rylan Stout		9\n	13	Alex Sule		12\n	17	Jairo Mclean Cardona		17\n	19	Sampson Christensen		11\n	21	Lucas Dickerson		9\n	21	Jaxon Westwood		9\n	23	Daniel McGee		12\n	24	Jonathan Waters		9\n	25	Isaiah Trejo		9\n	28	Max Agres		12\n	31	Daxon Thomson-Kidwell		12\n	33	Ammon Bitton		10\n	36	Kamron Lish		11\n	40	Liam McGee		10\n	48	Jacen Seamons		11\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nSoccer - Boys\n\nS: 2\nM: 6\nL: 9\nXL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.106\nID: 0acb6e3f-d9e1-46a0-93c2-cad5a08d5a48\n', 'CenturyBSOC.txt', '2024-11-14 21:40:43'),
(88, 52, 1, 'Travis Hobson', 'From: Travis Hobson\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nThunder Ridge High School\nTitans\nBlue, Black, Silver\nScott Woolstenhulme\nTrent Dabell\nTravis Hobson\nLogan Murri\nBrigham Redd\nJason Harris\nLuis Bocardo\nGavin Harrison (M)\nMoises Munoz (M)\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Cesar Diaz		10\n	3	Tanner Layton		10\n	4	Korven Whittier		11\n	5	Jase Webb	GK	12\n	6	Grady Peterson	GK	11\n	7	Damien Carmona		11\n	8	Jayden Ponce		12\n	9	Kai Redd		11\n	10	Kaden Palmer		12\n	11	Richard Munguia		11\n	12	Porter Beattie		12\n	13	Aaron Lasley		10\n	14	Gavin Layton		12\n	15	Owen Boyle		12\n	16	Maddux Ostergar		12\n	17	Karsyn Chadwick		12\n	19	Xavier Garcia		12\n	20	Jake Moulton		11\n	21	Cade Jorgensen		11\n	22	Ashton Prothero		12\n	23	Will Mangum		11\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Hobson\nThunder Ridge High School\n6A\nSoccer - Boys\n\nM: 10\nL: 10\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.210.205\nID: 1213a759-4b10-4290-8d36-9ff711c364a4\n', 'ThunderRidgeBSOC.txt', '2024-11-14 21:40:43'),
(89, 53, 2, 'Brandon Jackson', 'From: Brandon Jackson\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nAmerican Falls High School\nBeavers\nRed, White & Black\nRandy Jensen\nTravis Hansen\nBrandon Jackson\nBrett Reed\nReggie Jackson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Leila Jackson	MF	12\n	1	Leila Jackson	GK	12\n	2	Aliana Cruces	MF, FORW	11\n	3	Addison Jensen	D	12\n	4	Jazzy Fonseca	FORW	11\n	6	Courtney Hunt	D	11\n	7	Jelly Oseguera	MF	12\n	8	Leslie Hernandez		12\n	9	Adley Selga	D	11\n	10	Yareli Carrillo	D	10\n	11	Sherlyn Lopez	D	12\n	12	Jazmine Olsen	MF	12\n	13	Kayla Mendez	D	11\n	14	Stephanie Rosales	FORW, GK	11\n	15	Natalie Castro	MF	10\n	16	Naomi Rivas	D	10\n	18	Ixchel Fonseca	D	12\n	21	Destiny Ortiz	FORW	12\n	22	Kenzie Mendez	D	9\n	23	Brianna Morales	MF	12\n\n---------------------------------------------------------\nSHIRTS\n\nBrandon Jackson\nAmerican Falls High School\n4A\nSoccer - Girls\n\nS: 7\nM: 11\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.10\nID: 977e6855-4427-46d3-a3bd-053393782306\n', 'AmericanFallsGSOC.txt', '2024-11-14 21:40:43'),
(90, 54, 2, 'Nick Birch', 'From: Nick Birch\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nBrandon Lee\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Cami Rohrbaugh		12\n	3	Abigail Lee		12\n	4	Jenna Dewey		12\n	5	Julia McCord		12\n	6	Tabria Orgill		10\n	7	Valerie Chavez		12\n	8	Kennedy Steorts		10\n	10	Emmalee Gourley		12\n	11	Evie Anderson		12\n	12	Addison Watson		11\n	13	Ashley Anglin		11\n	15	Tess Robertson		10\n	16	Abigail Smedley		11\n	17	Kate Behrman		12\n	19	Bryton Brown		12\n	21	Ryiah Jones		11\n	22	Arianna Romero		12\n	23	Macy Cook		10\n	29	Emelia Keller		12\n	34	Helena Zalupski		9\n	40	Catherine Pontzer		11\n	53	Grace Eastman		11\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nSoccer - Girls\n\nS: 2\nM: 10\nL: 9\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.188\nID: 33094f68-0ce4-49b0-965b-eacccb0ea3b2\n', 'IdahoFallsGSOC.txt', '2024-11-14 21:40:43'),
(91, 55, 2, 'Mark Van Weerdhuizen', 'From: Mark Van Weerdhuizen\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nFruitland High School\nGrizzlies\nOrange & Black\nStoney Winston\nWade Carter\nMark Van Weerdhuizen\nJoal Herrera\nEmmanuel Perez\nAbraham Salgado\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0, 22	Jenna Jenks	GK, D	12\n	1	Payson Bratcher	GK	9\n	2	Faith Newman	MF	11\n	3	Karli Roubidoux	MF, FORW	9\n	4	Adilee Elam	D	12\n	5	Brie Freitas	MF	11\n	6	Arabella Escalante Monreal	D	10\n	7	Maisie MacKenzie	D, MF	11\n	8	Ashlyn Lloyd	MF	12\n	9	Erika Rangel	MF, FORW	10\n	10	Baylee Rawlinson	MF	12\n	11	Lydia Lindsey	STRK	12\n	12	Mckenna Rawlinson	MF	12\n	13	Hailey Juarez	D	12\n	14	Ava Gibb	MF, FORW	10\n	15	Nyah Tubbs	FORW	12\n	16	Autiana Orozco Ferreira	D	11\n	17	Amelia Elam	D	10\n	19	Brooke Tolman	D	12\n	20	Myah Juarez	MF, D	10\n	21	Paige Williams	MF	11\n\n---------------------------------------------------------\nSHIRTS\n\nMark Van Weerdhuizen\nFruitland High School\n4A\nSoccer - Girls\n\nS: 5\nM: 16\n\n\n\n\n---------------------------------------------------------\nIP: 172.69.134.214\nID: 3773eb5d-8ce3-49dc-88ab-d6e4072789ff\n', 'FruitlandGSOC.txt', '2024-11-14 21:40:43'),
(92, 56, 2, 'Douglas Henderson', 'From: Douglas Henderson\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLewiston High School\nBengals\nPurple & Gold\nLance Hansen\nKevin Driskill\nDoug Henderson\nScott Wimer\nKatie Daugherty\nBrittney Allen\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Solana Inzunza	D, GK	12\n	2	Avery Lathen	D, FORW	10\n	3	Harper Haynes	MF, FORW	9\n	4	Myla Mee	D	12\n	5	Sophia Thompson	FORW	9\n	6	Dayvee Maurer	MF	10\n	7	Morgan Cook	MF, FORW	11\n	8	Claire Kopple	D	12\n	9	Jessa Hartwig	MF	11\n	10	Eva Steele	MF	12\n	11	Sawyer Broumley	D, FORW	9\n	12	Taylor Musser	D, GK	11\n	13	Trinity Bonebrake	D, FORW	11\n	14	Asia Roberts	D	12\n	15	Brynn Wimer	MF, D	11\n	16	Madison Bruce	FORW	9\n	17	Mckinley Forth	D	11\n	18	Kaylee Sturmer	MF	11\n	20	Maria Wicks	, D	9\n	21	Lizzy Roy	D, FORW	11\n	22	Mia Gomez	MF, FORW	9\n\n---------------------------------------------------------\nSHIRTS\n\nDouglas Henderson\nLewiston High School\n5A\nSoccer - Girls\n\nS: 3\nM: 18\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.199\nID: e657f57b-c12c-4aa2-90a6-3b709595a9fc\n', 'LewistonGSOC.txt', '2024-11-14 21:40:43'),
(93, 57, 1, 'Ted Reynolds', 'From: Ted Reynolds\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCanyon Ridge High School\nRiverhawks\nCrimson & Silver\nBrady Dickinson\nRandall Miskin\nTed Reynolds\nCorey Farnsworth\nCesar Duran\nCarey Farnsworth\nSteven Thueson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Hunter Brewer	GK	11\n	1	Elias Alexander		11\n	2	Lucas Escobar		11\n	3	Ricardo Martinez		10\n	4	Adan Ruiz		11\n	5	Wasamba Bolomo		9\n	6	Cooper Nickell		9\n	7	Alejandro Valencia		11\n	8	Benjamin Kasombwa		10\n	9	Linkin Wood		12\n	10	Ethan Williams		11\n	11	Braulio Cardial		12\n	12	Kawat Adam		12\n	13	Yves Mugisha		11\n	14	Armando Murillo		11\n	15	Nathadaniel Archila		9\n	16	Giovani Juarez		11\n	17	Blake Schultz		12\n	18	Jonas Saka		10\n	19	Mwami Asukulu		9\n\n---------------------------------------------------------\nSHIRTS\n\nTed Reynolds\nCanyon Ridge High School\n6A\nSoccer - Boys\n\nS: 2\nM: 13\nL: 3\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.119\nID: eb4a64b8-eccb-48ce-8e8e-3c33b93754bb\n', 'CanyonRidgeBSOC.txt', '2024-11-14 21:40:43'),
(94, 58, 1, 'Patrick Laney', 'From: Patrick Laney\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMoscow High School\nBears\nRed, Black & White\nShawn Tiegs\nErik Perryman\nPatrick Laney\nCaleb Brooks\nZaiden Espe\nErin Brooks\nSeth Vieux\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Wyatt Thornycroft	GK	12\n	1	Moayed Radwan		11\n	2	Elijah Ting		12\n	3	McCoy Colvin		12\n	4	Connor Horne		11\n	5	Ty Kindelspire		12\n	6	Mohammed  Aboutaleb 		12\n	7	Hashem  Alayat 		12\n	8	Jeremiah Balemba		12\n	9	William  Vieux		12\n	10	Nicholas  Odberg 		12\n	11	Yazid Saad		12\n	12	Bryant Scruggs		11\n	13	Henry  Saltarella 		11\n	14	Kelton Long		11\n	15	Jonas Mordhorst		11\n	16	Tanner Fealy		12\n	17	Leo Laborie-Jessup		10\n	18	Joshua Gordon		12\n	19	Cody Brooks		9\n	20	Emeth Toebben		12\n	21	Liam Bacon		10\n\n---------------------------------------------------------\nSHIRTS\n\nPatrick Laney\nMoscow High School\n5A\nSoccer - Boys\n\nM: 13\nL: 8\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.75\nID: 5a317117-dcc0-4537-a2b1-8965fbf49084\n', 'MoscowBSOC.txt', '2024-11-14 21:40:43'),
(95, 59, 1, 'Shaun Walker', 'From: Shaun Walker\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\nBruins\nNavy, Lt Blue & White\nBrady Dickinson\nNancy Jones\nShaun Walker\nEduardo Garcia\nPete Hillman\nKatie Kauffman\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Thomas Rands	G	9\n	1	Jose Hernandez	GK	11\n	2	Austin Egbert	FORW	9\n	3	Max Serrano	MF	11\n	4	Ian Jorgensen	FORW	9\n	4	Eli Daisher	FORW	9\n	5	Kayden Clopton	D	10\n	6	Camden Call	FORW	12\n	7	Finn Bennett	FORW	9\n	8	Marcus Martinez	D	11\n	9	Joshua Spiers	FORW, MF	11\n	9	Wendell McBride	FORW	10\n	10	Abdul Luke	D, MF	11\n	11	Zanda Luke	STRK	10\n	12	Reve Andersen	MF, STRK	12\n	13	Christian Herrera	D	12\n	14	Kevin Rivera	FORW	10\n	15	Jayden Clopton	MF, D	10\n	17	Jacob Gleckler	D	10\n	18	Aydin Masic	STRK	11\n	19	Daniel Johnson	D	11\n	20	Clive Muyingo	FORW	10\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nSoccer - Boys\n\nS: 4\nM: 4\nL: 11\nXL: 1\n2XL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.102\nID: 4eaeeaa2-e52b-4538-82d7-e4413ea47543\n', 'TwinFallsBSOC.txt', '2024-11-14 21:40:43'),
(96, 60, 1, 'Cody Shelley', 'From: Cody Shelley\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBlackfoot High School\nBroncos\nKelly Green & White\nBrian Kress\nRoger Thomas\nCody Shelley\nLiam Pope\nJohn Batacan\nRamon Rivas\nEddie Ballesteros\nCarlos Labra\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Edwin Botello	GK	9\n	2	Brigham Bitter	D, MF	10\n	3	Aaron Torres	D	11\n	4	Moises Garcia	MF	9\n	5	Daniel Olivarez	GK	11\n	6	Graden Adams	D	11\n	7	Koston Thurgood	MF, STRK	12\n	8	Gio Labra	MF	11\n	9	Enrique Nevarez	MF, STRK	12\n	10	Javian Ballesteros	MF, STRK	12\n	11	Josiah Balleseros	MF	11\n	12	Mauricio Sotello	D, MF	11\n	13	Connor Searle	STRK, MF	11\n	14	Didier Perez	MF, STRK	11\n	15	Daniel Garcia	GK, MF	11\n	19	Francisco Juarez	D	10\n	20	Riley Fransen	MF, STRK	10\n	22	Boone Bowman	D, MF	10\n	24	Mattia Maderni	MF	11\n	25	Anthony Campos	D	12\n\n---------------------------------------------------------\nSHIRTS\n\nCody Shelley\nBlackfoot High School\n5A\nSoccer - Boys\n\nM: 15\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.1.198\nID: 0c17f935-3fcd-41bd-94d0-e57bb6ab5951\n', 'BlackfootBSOC.txt', '2024-11-14 21:40:43'),
(97, 61, 1, 'Aaron Lippy', 'From: Aaron Lippy\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene Charter Academy\nPanthers\nRed, White & Blue\nDaniel Nicklay\nDaniel Nicklay\nAaron Lippy\nCraig Daigle\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n		Luke Blasick	FORW	9\n		Raphael Renault		11\n		Lucas Davisson	D	9\n	1	Mattis Macmillan	GK	11\n	2	Cooper Hermes	FORW	10\n	3	Liam GarrColes	D	9\n	4	Cruz Portellas	MF	11\n	5	Anthony Haler	MF	10\n	6	Lucas Witherwax	MF	11\n	7	Brooks Judd	FORW	9\n	8	Stefan Pawlik	D	10\n	9	Elliot Engles	FORW	10\n	10	Tate Burkholder	D	12\n	11	Liam Hughes	D	11\n	12	Christian Blasick	FORW	11\n	13	Owen Sharp	MF	12\n	14	Bridger Crawford	D	11\n	15	Taylor Smith	MF	10\n	16	Joseph Nicklay	FORW	11\n	17	Sam Hines	MF	10\n	18	Treffen McCord	MF	12\n	19	Isaac Hines	MF, FORW	12\n	20	Branston Banta	D	11\n	21	Thomas Strait	D	12\n	22	Creighton LeHoist	D	10\n	23	Aedan Aguirre	MF	10\n	24	Patrick Leahy	D	9\n\n---------------------------------------------------------\nSHIRTS\n\nAaron Lippy\nCoeur d\'Alene Charter Academy\n4A\nSoccer - Boys\n\nS: 1\nM: 10\nL: 7\nXL: 3\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.27\nID: a862ec5a-448f-4edc-88d6-7e37ff1240cf\n', 'CDACharterBSOC.txt', '2024-11-14 21:40:43'),
(98, 62, 1, 'Richard Whitelaw', 'From: Richard Whitelaw\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nSun Valley Community School\nCutthroat Trout\nNavy\nBen Pettit\nKevin Campbell\nRichard Whitelaw\nRichard Whitelaw\nWill Thomas\nJason Southward\nMax Kwok\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Ry Mann	GK	12\n	3	Bodin Lee	MF	12\n	4	Paxton Sammis	MF	12\n	5	Reyn Gary	FB	12\n	7	Easton Turck	MF	12\n	8	Declan White	MF	12\n	9	Sebi Silaghi	MF	9\n	10	Tommy Hovey	MF	10\n	11	Anders Coulter	FORW	11\n	13	Cruz Bilbro	D	11\n	14	Thomas Connell	MF	11\n	15	Abel Marx	MF	12\n	16	Zeppelin Pilaro	FORW	12\n	17	Huxley Flood	D	10\n	18	Chance Dooley	D	12\n	19	Quinn Parmenter	MF	9\n	20	Reid Holman	FORW	10\n	21	Cal Davis	FORW	10\n	23	James Duffield	MF	11\n	24	Kobi Bilbro	D	9\n\n---------------------------------------------------------\nSHIRTS\n\nRichard Whitelaw\nSun Valley Community School\n3A\nSoccer - Boys\n\nM: 2\nL: 17\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.46\nID: 41213282-44e0-4a96-a087-59fe10eb9e71\n', 'SunValleyCommBSOC.txt', '2024-11-14 21:40:43'),
(99, 63, 1, 'Brandon Jackson', 'From: Brandon Jackson\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nAmerican Falls High School\nBeavers\nRed, White & Black\nRandy Jensen\nTravis Hansen\nBrandon Jackson\nMiguel Mata\nJose Mata \nCaroline Wight\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00/19	Alan Sanchez	GK	10\n	1	Hojany Aguilar Cabrera	STRK	10\n	3	Fabian Avalos	D	12\n	5	Victor Mendez	D	12\n	6	Renee Juarez	FORW	11\n	7	Eric Mendez	FORW	10\n	8	Geovani Alvarez	MF	11\n	9	Jordan Portillo	MF	12\n	10	Cristian Gonzalez	D	12\n	11	Erik Morales	MF	11\n	12	Gerardo Ibarra	FORW	9\n	13	Osvaldo Alvarez	MF	11\n	14	Oliver Rios	STRK	11\n	16	Edwin Fortanell	D	9\n	17	Aaron Oseguera	D	10\n	18	Alex Oseguera	D	11\n	21	Brian Castro	FORW	11\n	22	Juan Tomas	D	12\n	26	Yerik Rios	D	10\n	28	Gustavo Palacios	D	10\n	99	Hector Cruces	GK	9\n\n---------------------------------------------------------\nSHIRTS\n\nBrandon Jackson\nAmerican Falls High School\n4A\nSoccer - Boys\n\nS: 1\nM: 7\nL: 9\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.132\nID: 81c8344a-142c-4438-9d56-daa03c532afe\n', 'AmericanFallsBSOD.txt', '2024-11-14 21:40:43'),
(100, 64, 1, 'Nate Kerbs', 'From: Nate Kerbs\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nWendell High School\nTrojans\nNavy & Gold\nTim Perrigot\nJustin Alsterlund\nNate Kerbs\nFelipe Paniagua\nAngela Murillo\nJaime Ponce\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	3	Roberto Orozco	FB, D	11\n	5	Brian Orozco	MF, FORW	11\n	7	Fernando Ibarra Gutierrez	FORW, MF	11\n	9	Martin Nava	HB, D	11\n	11	Cesar Carmargo	FORW, MF	11\n	13	Horicio Ayala	D, HB	11\n	15	Miguel Lima	HB, D	10\n	17	Cesar Muralles	FORW, MF	11\n	21	Kayson Acevedo		11\n	23	Saul Orozco		9\n	25	Napoleon Jimenez		10\n	27	Julian Ponce	STRK, FORW	12\n	29	Tyler Magana	D	10\n	31	Adrian Ramos		9\n	33	Reinaldo Carrillo		11\n	35	Angel Ramos	STRK	11\n	37	Edgar Tena		11\n	39	Angel Diaz		9\n	43	Jeffery Gonzales		11\n	45	Alexis Hurtado		9\n	47	Alexander Hurtado		9\n	49	Jafery Bush		10\n\n---------------------------------------------------------\nCOMMENT\n\nWe would like to purchase one additional sweatshirt (large) for our manage Tony. We are willing to pay for the additional sweatshirt. Thank you. \n\n---------------------------------------------------------\nSHIRTS\n\nNate Kerbs\nWendell High School\n3A\nSoccer - Boys\n\nS: 6\nM: 14\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.18\nID: 4b63cd60-919d-413c-b12e-cee3ad31f372\n', 'WendellBSOC.txt', '2024-11-14 21:40:43'),
(101, 65, 2, 'Ted Bell', 'From: Ted Bell\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nHighland High School - Pocatello\nRams\nBlack, White & Red\nDoug Howell\nBrad Wallace\nTravis Bell\nMatt Stucki\nRandy Vawdry\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Grace Kirkpatrick	GK	11\n	2	Devree Bell	MF, FORW	11\n	3	Taryn Roth	MF, D	10\n	5	Anna Bagley	MF	11\n	6	Olivia Orr	D	9\n	7	Presley Johnson	D	11\n	8	Alexis Vawdrey	MF, FORW	9\n	9	Gracee Anderson	D	11\n	13	Lauren Flores	FORW	11\n	14	Molli Broadhead	FORW	9\n	15	Reese Valentine	FORW	10\n	17	Ava Flores	D	11\n	18	Oakli Briscoe	D	10\n	19	Ashlyn Hale	MF	10\n	22	Elizabeth Ralphs	MF	11\n	23	Cecelia Pena	D, MF	11\n	27	Norah Wilde	D	11\n	31	Grace Johnson	D	10\n	32	Peyton Looney	MF	11\n	33	Lucy Rhodehouse	FORW	11\n	36	Macey Estevez	MF	10\n	39	Makenzie Humpherys	GK	9\n\n---------------------------------------------------------\nCOMMENT\n\nWould like to order and pay for one additional sweatshirt, size Large.\n\n---------------------------------------------------------\nSHIRTS\n\nTed Bell\nHighland High School - Pocatello\n6A\nSoccer - Girls\n\nL: 18\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.234\nID: 13538304-af40-4890-a68c-e2957493e5d9\n', 'HighlandGSOC.txt', '2024-11-14 21:40:43'),
(102, 66, 2, 'Shayne Proctor', 'From: Shayne Proctor\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMadison High School\nBobcats\nRed, White & Gray\nRandy Lords\nBradee Klassen\nShayne Proctor\nJaymon Birch\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Saurey Hawkins	GK	11\n	3	Emmrie Weeks	MF	9\n	4	Courtney Fullmer	FB	10\n	5	Mavery Seal	GK, D	9\n	8	Rachel Jacobsmeyer	STRK	12\n	9	Brynlee Nielson	D	10\n	10	Laney Serrano	MF	10\n	11	Lannea Dummar	MF	12\n	12	Mia Dexter	HB, MF	9\n	13	Kesli Birch	STRK, MF	9\n	14	Makenzie Richey	MF	12\n	16	Jocelyn Mouser	MF	12\n	17	Sarah Green	MF	12\n	18	Brooke Robinson	D	10\n	19	Teos Jackson	D	12\n	21	Mykalana Hansen	D, MF	11\n	22	Maggie Anderson	MF	12\n	23	Alexia Alba	MF	12\n	26	Grace Terribilini	FB	10\n	27	Josie Parker	MF	10\n	28	Kaylea Cooper	MF, HB	11\n	29	Macey Freeman	FB	12\n\n---------------------------------------------------------\nSHIRTS\n\nShayne Proctor\nMadison High School\n6A\nSoccer - Girls\n\nM: 7\nL: 15\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.166\nID: a3465918-ede6-4bea-b506-a85bd65bf91b\n', 'MadisonGSOC.txt', '2024-11-14 21:40:43'),
(103, 67, 2, 'TJ Clary', 'From: TJ Clary\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSandpoint High School\nBulldogs\nRed & White\nBecky Meyer\nJacki Crossingham\nTJ Clary\nAlan Brinkmeier\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Lilliana Brinkmeier		12\n	2	Sam Leaverton		12\n	2	Marlee McCrum		12\n	3	Rae Olsen		9\n	4	Maddie Mitchell		12\n	6	Maggie McClure		9\n	8	Bayah Ratigan		10\n	9	Ava Glahe		11\n	10	Aspen Little-Torrez		10\n	11	Alyssa Porter		9\n	12	Vivian Haag		10\n	13	Mackenzie Mitchell		11\n	14	Cecilia Dignan		11\n	15	Willow Betz		9\n	16	Ayla Hull		12\n	16	Ayla Hull		12\n	18	Elia Howard		11\n	19	Izzy Stark		10\n	20	Adele Michael		10\n	21	Jordyn Tomco		10\n	22	Hope Barnes		11\n\n---------------------------------------------------------\nSHIRTS\n\nTJ Clary\nSandpoint High School\n5A\nSoccer - Girls\n\nS: 1\nM: 18\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.125\nID: dedc3966-f062-4b78-865c-49962cedff79\n', 'SandpointGSOC.txt', '2024-11-14 21:40:43'),
(104, 68, 2, 'Larry Stocking', 'From: Larry Stocking\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nHillcrest High School\nKnights\nRed, Black & White\nScott Woolstenhulme\nTy Salsbery\nLarry Stocking\nBrian Nelson\nScott Richens\nJose Moreno\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Kambree Stierle		10\n	2	Brinley Nelson		10\n	3	Londyn Ricks		9\n	5	Hailee Prudent		11\n	6	Kynzee Hatch 		10\n	8	Kiera Gammon		11\n	10	Olivia King		9\n	11	Maddy James		12\n	12	Rian Elzinga		10\n	13	Eliana Barnes		11\n	16	Jade Taylor		12\n	18	Finley Belnap		10\n	20	Quincy Daw		10\n	21	Kenlee Jarrell		10\n	22	Annelly Yanez		9\n	23	Harley Jarvis		11\n	24	Raine Jarvis		10\n	25	Paisley Ricks		11\n	31	Reese Titland		12\n	42	Scarlett Witte		10\n	43	Camila Vargas 		9\n	44	Amelia Woolley		11\n\n---------------------------------------------------------\nSHIRTS\n\nLarry Stocking\nHillcrest High School\n5A\nSoccer - Girls\n\nS: 5\nM: 14\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.78\nID: c29a01c3-37bd-4837-8faa-4abc67c925cf\n', 'HillcrestGSOC.txt', '2024-11-14 21:40:43'),
(105, 69, 2, 'Aaron Lippy', 'From: Aaron Lippy\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene Charter Academy\nPanthers\nRed, White & Blue\nDaniel Nicklay\nDaniel Nicklay\nAaron Lippy\nStacy Smith\nTrey Weatherly\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Emily Tannaberger		9\n	3	Sofia Rodono		11\n	4	Sierra Sheppard		10\n	5	Amy Fisch		11\n	6	Vivienne Berger		11\n	7	Sofia Keese		10\n	8	Sofia Peppin		11\n	9	Izzy Trinidad		11\n	10	Lydia Lehosit		12\n	11	Caitlin Zent		11\n	12	Mady Witherwax		9\n	13	Abigail Johnson		12\n	14	Campbell Hancock		12\n	15	Claire Leahy		12\n	17	Reagan Meine		11\n	18	Gwen Guan		11\n	20	Mallory Judd		11\n	21	Adysen Robinson		11\n	22	Sue Durkin		10\n	23	Bella Casagrande		9\n	25	Kylah Chavez		10\n\n---------------------------------------------------------\nSHIRTS\n\nAaron Lippy\nCoeur d\'Alene Charter Academy\n4A\nSoccer - Girls\n\nS: 5\nM: 11\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.179\nID: e83199e7-8894-4bbc-8cc8-c808b6b6146f\n', 'CDACharterGSOC.txt', '2024-11-14 21:40:43'),
(106, 70, 2, 'Stacy Wilson', 'From: Stacy Wilson\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBuhl High School\nIndians\nOrange & Black\nAngie Oparnico\nShari Moulton\nStacy Wilson\nDuWayne Kimball\nDaniel Peralta\nAlvey Peralta\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Aaliyah Webb	Defender	12\n	2	Pemberley Kimball	Midfield/Forward	9\n	3	Keala Jaynes	Forward	12\n	5	Olivia Cervantes	Midfield	12\n	6	Kierra Thompson	Forward	11\n	7	Yoxanna Dominguez	Midfield/Forward	10\n	8	Ruby Olsen	Forward	9\n	9	Yoselin Serrano	Defense	12\n	11	Tesla Blackhurst	Midfield	10\n	12	Lauren Hirsch	Midfield	10\n	13	Liesl Kimball	Midfield	12\n	14/42	Ashley Engbaum	Defender/Goalkeeper	12\n	15	Melanie Ramirez	Defender	10\n	16	Andrea Bonillas	Defender	9\n	17	Nicole Nunes	Defender	12\n	18	Alexcia Sullivan	Forward	12\n	21	Syley Ramirez	Defender	9\n	22	Sheila Barajas	Forward	10\n	25	Annde Schroeder	Forward	9\n	26	Maria Cortez	Midfield/Forward	9\n	28	Dakota McClymonds	Midfield	10\n	32	Brooklyn Cantrell	Goalkeeper	11\n\n---------------------------------------------------------\nSHIRTS\n\nStacy Wilson\nBuhl High School\n4A\nSoccer - Girls\n\nS: 12\nM: 9\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.97\nID: 597b7151-3755-48ad-b08c-3866fd602ee7\n', 'BuhlGSOC.txt', '2024-11-14 21:40:43'),
(107, 71, 1, 'David Joyce', 'From: David Joyce\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nTeton High School\nTimberwolves\nOrange & Maroon\nMegan Christiansen\nSam Zogg\nDavid Joyce\nKurt Mitchell\nBryan Thomas\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1/99	Kirby Martinez	GK	10\n	2	Holden Way	FB	12\n	3	Deegan Moncur	FORW	12\n	5	Wyatt Gentry	D	12\n	7	Ian Haskell	FORW	9\n	8	Israel Ramirez	MF	10\n	9	Isaac Thomas	MF	12\n	10	Sam Ordonez	FORW	11\n	11	Elliot Lifton	MF	10\n	12	Andrew Thomas	MF	9\n	13	Trey Behrens	MF	10\n	14	David Diaz	FORW	12\n	15	Kaden Hill	MF	12\n	18	Mason Beebe	D	9\n	19	Santiago Franco	FORW	10\n	20	Shea McGuire	D	10\n	21	Samson Phillips	MF	12\n	23	Francisco Sosa	FORW	11\n	25	Paycen Hill	D	10\n	27	Vaughn Butler	D	9\n	28	Ian Mollenkof	MF	9\n\n---------------------------------------------------------\nSHIRTS\n\nDavid Joyce\nTeton High School\n4A\nSoccer - Boys\n\nM: 3\nL: 14\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.211.89\nID: df2b73ac-e345-49fb-9a41-405168610237\n', 'TetonBSOC.txt', '2024-11-14 21:40:43'),
(108, 72, 1, 'Bowe von Brethorst', 'From: Bowe von Brethorst\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nWeiser High School\nWolverines\nRed & White\nKenneth Dewlen\nDrew Dickerson\nBowe vonBrethorst\nKathy Bokides\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	3	Brandon Juarez	D	12\n	4	Jackson Laird	D	11\n	5	Matthew Perez	MF	12\n	6	Jai Cervantes	HB	12\n	7	Carlos Lopez	FORW	12\n	8	Luke Brunson	HB	12\n	9	Santiago Perez	MF, STRK	12\n	11	Julio Hernandez	HB, STRK	10\n	12	Chris Rodriguez	MF	11\n	13	Everett Terry	FORW, MF	9\n	14	Henry Cisneros	D, MF	10\n	15	Dauge McClellan	D, HB	12\n	17	Ben Hansen	HB	11\n	19	Juan Molino	D, HB	11\n	20	Yahir Valdivia	HB	12\n	21	Ramiro Valdez	, D	10\n	22	Mikel Valdez	D	12\n	23	Brandon Munoz	HB, D	12\n	26	David Hernandez	GK	12\n	O	Gabe McGlaughlin	GK	11\n\n---------------------------------------------------------\nSHIRTS\n\nBowe von Brethorst\nWeiser High School\n4A\nSoccer - Boys\n\nS: 2\nM: 10\nL: 5\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.156\nID: 25a49ee3-822d-476e-998c-9b8ac228a66c\n', 'WeiserBSOC.txt', '2024-11-14 21:40:43'),
(109, 73, 1, 'Conor Kennedy', 'From: Conor Kennedy\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMcCall-Donnelly High School\nVandals\nRed, White & Blue\nTim Thomas\nTim Thomas\nConor Kennedy\nForrest Stanley\nShannon Carheden\nRich Prittie\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Michael Foster	GK	12\n	4	Sebastian Carheden		10\n	5	Cooper Berg	D, GK	11\n	6	William Caroll		11\n	7	Kage Stokes		11\n	8	Bogdan Monahan		12\n	9	Kye McCallister	D	12\n	10	Caleb Anderson		12\n	11	Jose Manuel		11\n	12	Jacob Lawless		12\n	14	Toby Klasner		12\n	15	Alex Rich		11\n	17	Solomon Arndt	D	12\n	18	Mike Siuce		10\n	20	Drake Fanslow		11\n	21	Eli Arndt		9\n	22	Cole Warren		10\n	23	Marcus Nelson		10\n	24	Conrad Alexander		12\n	30	Landen Bork	MF	9\n	31	Adam Hoban	GK, D	9\n	33	Jackson Thomas	D	10\n\n---------------------------------------------------------\nSHIRTS\n\nConor Kennedy\nMcCall-Donnelly High School\n4A\nSoccer - Boys\n\nL: 12\nXL: 8\n2XL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.116\nID: 58d3a5f8-92a8-4f54-9cec-f24ad3c57623\n', 'McCallDonnellyBSOC.txt', '2024-11-14 21:40:43'),
(110, 74, 1, 'Curt-Randall Bayer', 'From: Curt-Randall Bayer\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBonners Ferry High School\nBadgers\nNavy & White\nJan Bayer\nLisa Iverson\nCurt-Randall Bayer\nPaul Bonnell\nMatt Solis\nBrycen Lunger\nDerek Oxford\nJared Gardin\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Cardon Pluid	GK	10\n	1	Gabriel Litterell	MF	9\n	5	Omar VanDyken	MF	12\n	6	Caleb Bryant	D	10\n	10	Nikita Rawson	FORW	12\n	11	Jesse Fess	D	12\n	12	Trevor Festini	MF	10\n	13	Eli Blackmore	FORW, MF	12\n	15	Aaron Tadlock	MF	10\n	16	Noah Miller	MF	9\n	18	Ben Middleton	D, MF	10\n	19	Riser Hanson	MF	12\n	20	Lincoln Hymas	MF	11\n	21	Logan Archibald	MF	11\n	22	Dominic Solum	FORW	9\n	25	Josh Warner	MF	9\n	26	Malachi Hubbard	D	12\n	27	Riley Thompson	MF	12\n	29	Peyton Hinthorn	D	10\n	99	Kordale Burt	GK	10\n\n---------------------------------------------------------\nSHIRTS\n\nCurt-Randall Bayer\nBonners Ferry High School\n4A\nSoccer - Boys\n\nM: 5\nL: 13\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.213\nID: 74573649-0200-43e6-9f55-5f03f471e710\n', 'BonnersFerryBSOC.txt', '2024-11-14 21:40:43'),
(111, 75, 1, 'Nick Birch', 'From: Nick Birch\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nRyan Cook\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Josh Peterson		11\n	2	Jacob Evans		11\n	3	Kenyon Tyler		11\n	4	Lucas Archibald		11\n	5	Porter Robertson		12\n	6	Chase Suthers		11\n	7	Viktor Zalupskie		11\n	10	Carson Stohl		11\n	11	Paul Williams		12\n	12	Rex Sessions		11\n	16	Zach Sleight		10\n	17	Cooper Sleight		11\n	19	Tanner Fenton		12\n	21	Marcel Harward		12\n	23	Agustin Hernandez		12\n	24	Chase Greenwood		11\n	25	Scott Christofferson		12\n	27	Andrew Harris		12\n	28	Carson Sommer		11\n	29	Derric Parks		11\n	35	Drostan Ball		11\n	37	Emmet Springer		10\n	88	Sam Boyle		11\n	99	Ethan Creager		11\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nSoccer - Boys\n\nM: 6\nL: 16\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.2.96\nID: 0397f763-caf6-46e3-a030-1db08414e1c4\n', 'IdahoFallsBSOC.txt', '2024-11-14 21:40:43'),
(112, 76, 1, 'Kevin Stilling', 'From: Kevin Stilling\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nWood River High School\nWolverines\nGreen & White\nJim Foudy\nJulia Grafft\nKevin Stilling\nGreg Gvozdas\nGarret Grillo\nMatt Phillips\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Marius Alvarez	GK	10\n	0	Elian Servin	GK	10\n	1	Ben Torres	GK	12\n	2	Erick Barriga	D	11\n	3	Jack Bulls	MF	12\n	4	Owen Walker	STRK	12\n	5	Mateo de la Torre	D	11\n	6	Ryan Tenold	D	11\n	7	Jackson Wallace	FORW	11\n	8	Zackary Torres	D	11\n	9	Wes Nichols	MF	10\n	10	Maicol Quinones	MF	12\n	11	Alejandro Romero	MF	10\n	12	Christopher Lizarraga	D	12\n	13	Reidar Slotten	MF	11\n	14	Henry Page	FORW	12\n	15	Taj Redman	FORW	10\n	16	Markus Garcia	D	10\n	17	Hayden Gvozdas	MF	10\n	18	Alberto Romo	FORW	11\n	19	Andres Hernandez	STRK	11\n	20	Wyatt Gilmour	D	10\n	21	Jack Tierney	FORW	12\n	22	Dom Seig	D	11\n	23	Sylas Barrett	D	11\n	25	Ivan Reyes	D	9\n	26	Antonio Serrato	MF	9\n	27	Nandy Inga	MF	12\n	29	Juan Giraldo Yarce	D	11\n	30	Vladimir Gomez	FORW	9\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Stilling\nWood River High School\n5A\nSoccer - Boys\n\nL: 22\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.61\nID: 45722dc3-3502-4632-a343-aa509e8a74ea\n', 'WoodRiverBSOC.txt', '2024-11-14 21:40:43'),
(113, 77, 1, 'Kris Knowles', 'From: Kris Knowles\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nVallivue High School\nFalcons\nBrown & Gold\nLisa Boyd\nKellie Dean\nKris Knowles\nChristian Adamson\nFred Mora\nAdam Flores\nMartin Casillas \n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n		Juan Ballesteros		10\n	00	Connor Blaisdell	GK	12\n	0	Jackson McDonald	GK	12\n	1	Ryan Steinbach	MF	11\n	2	Gael Gomez	D, MF	12\n	3	Leo Ayala	D	11\n	6	Cesar Gomez	MF	12\n	7	Elijah Grimaldo	MF	11\n	7	Marcos Madrigal	MF	11\n	9	Isai Ramos	MF	12\n	9	Emanuel Stoica	FORW	11\n	10	Diego Rangel	D	12\n	12	Izaya Martin	D	12\n	12	Gavin Garrett	D	12\n	15	Diego Rosales	MF, D	12\n	16	Julian Gutierrez	D	12\n	16	Benjamin Martinez	D	11\n	17	Asher Adamson	D	12\n	18	Cristian Gonzalez	MF	12\n	19	Samuel Diaz Murillo	MF	12\n	19	Jose Bonilla	D, MF	11\n	24	Leo Gonzalez	D	12\n\n---------------------------------------------------------\nSHIRTS\n\nKris Knowles\nVallivue High School\n5A\nSoccer - Boys\n\nS: 9\nM: 9\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.29\nID: 63d01acb-045c-4fe3-9728-e11fbfbe8071\n', 'VallivueBSOC.txt', '2024-11-14 21:40:43'),
(114, 78, 1, 'TJ Clary', 'From: TJ Clary\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nSandpoint High School\nBulldogs\nRed & White\nBecky Meyer\nJacki Crossingham\nTJ Clary\nDan Anderson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Landon Brinkmeier 		10\n	1	Gavan Miles	GK	12\n	2	Colton Dickinson	D	9\n	3	Luke Leavitt	FORW	12\n	4	Calvin Schmidt	FORW	10\n	5	Blake McGrann	MF	9\n	6	Isaac Schmit	D	11\n	7	Jack Treman	MF	11\n	8	Bridger Cudmore	D	12\n	9	Asher Hazan	FORW	11\n	10	Henry Barnes	MF	12\n	11	Huxley Hall	FORW	11\n	12	Brennan Shaw	D	10\n	13	Jasey Treman	FORW	11\n	14	Connor McClure	FORW	12\n	15	Travis Morgan		11\n	16	Gus Penrose	D	9\n	17	Knox Williams	D	10\n	18	Pax Longanecker	MF	9\n	19	Caiden Gion	D	11\n	20	Lorenzo De Luca	MF	11\n	21	Paulo Arias Blanco		11\n\n---------------------------------------------------------\nSHIRTS\n\nTJ Clary\nSandpoint High School\n5A\nSoccer - Boys\n\nM: 2\nL: 14\nXL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.105\nID: ef1f6bca-cf23-4644-a884-b832aa702b41\n', 'SandpointBSOC.txt', '2024-11-14 21:40:43'),
(115, 79, 1, 'Troy Rice', 'From: Troy Rice\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nBill Taylor\nJosh Dalmas\nMIchael Karafi\nBen Tanner\nGian Torres\n\n---------------------------------------------------------\nROSTER\n\n	0	Paul Mercadante	GK	11\n	1	GianCarlo Salazar	GK	11\n	3	Drake Rutz	MF	11\n	4	Trey Fulmer	D	11\n	5	Sri Balamurugan	D	11\n	6	Jackson Pritchett	D	11\n	8	Garrison Torres	D	11\n	9	Taulent Hyseni	STRK	11\n	10	Rylan Mcpherson	STRK	12\n	11	Gabe Hernandez	STRK	11\n	14	Adrian Jeminez	STRK	11\n	16	Jacob Ogden	D	11\n	17	Kevin Juarez	MF	10\n	18	Taif Alsaadi	MF	10\n	19	Camden Shepard	MF	11\n	20	Bryten Rehwalt	D	11\n	21	Ethan Gulick	D	12\n	22	Tydan Doyle	D	11\n	24	Isaac Delgado	STRK	11\n	28	Taylor Martin	STRK	11\n	29	Jerod Belleza	D	10\n	33	Oslo Hart	MF	12\n\n---------------------------------------------------------\nCOMMENT\n\nThis is a re-submit with the correct information - TK 8:32am 10/17/24  Please use this submission!\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nSoccer - Boys\n\nS: 1\nM: 7\nL: 13\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.246.79\nID: 1f4d6c7a-ecb8-49a0-9171-4cf4e6888a17\n', 'RockyMountainBSOC.txt', '2024-11-14 21:40:43'),
(116, 80, 1, 'Dane Roy', 'From: Dane Roy\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nDarion Green\nLeighton Murri\nCarter Woods\nDylan Shaw\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Wyatt Blackwood		12\n	3	Josue Kuzindila		10\n	5	Samuel Vassilaros		11\n	6	Moise Kuzindila		10\n	7	Diell Gashi		12\n	8	Owen Selby		12\n	9	Kyle Jesus		12\n	10	Liam Cauble		12\n	12	Colton Papa		12\n	13	Nolan Arnold		11\n	14	Anish Bayelkoti		10\n	15	Christian Zannitto		10\n	16	Ishaq Bisharat		11\n	17	Greyson Pew		11\n	19	Jordan Shupe		11\n	20	Ryan Abernathy		11\n	21	Jason Gill		11\n	22	Brady Greenwald		12\n	23	Easton Estes		12\n	24	Graham Herzog		12\n	26	Yanis Vendee		11\n	28	Aidan Branley		10\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nSoccer - Boys\n\nM: 5\nL: 15\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.188\nID: 82f89246-3f7a-400a-85a2-4bd2033ef003\n', 'OwyheeBSOC.txt', '2024-11-14 21:40:43'),
(117, 81, 1, 'Dane Pence', 'From: Dane Pence\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nMountain View High School\nMavericks\nBlue, Green & White\nDerek Bub\nScot Montoya\nDane Pence\nAlex Saldana\nMarcos Medina\nDJ Johnston\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Ju Ju Pemany	GK	10\n	1	Isaac Manning	GK	12\n	2	Evan Silva	D	11\n	6	Jayten Duppong	MF	9\n	7	Landon Frei	FORW	11\n	8	Drew Brown	STRK	12\n	10	Sammy Alic	STRK	12\n	11	Jace Obenchain	D	11\n	12	George Baeza	GK	11\n	13	Milo Martinez	FORW	11\n	14	Gerard Alimasi	MF	11\n	15	Spencer Nelson	D	12\n	16	Denis Sumaili	STRK	12\n	17	Amjed Salim	FORW	10\n	18	Cole Cherwin	D	10\n	19	Ryan Fugal	D	12\n	20	Nate Belokas	D	12\n	21	Kade Troughton	MF	12\n	22	Jace Bowers	D	12\n	23	Dominick Tristan	FORW	10\n	24	Ammar Kapidzic	MF	10\n\n---------------------------------------------------------\nSHIRTS\n\nDane Pence\nMountain View High School\n6A\nSoccer - Boys\n\nM: 7\nL: 14\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.199\nID: e032118c-c135-4578-a2aa-9aefd63c1391\n', 'MountainViewBSOC.txt', '2024-11-14 21:40:43'),
(118, 82, 1, 'Brian Barber', 'From: Brian Barber\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBoise High School\nBrave\nRed & White\nLisa Roberts\nDeborah Watts\nBrian Barber\nMike Darrow\nGrant Hamilton\nMatt Billings\nSteve Smith\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Landon Montgomery		12\n	1	Travis Bartich		12\n	2	Noah Prince		12\n	3	Hudson Faull		11\n	4	Charlie Lamb		12\n	9	Confiance Ishimwe		11\n	10	Baraka Dayi		12\n	11	Alex Hoefer		12\n	12	Avi Rajbhandari		11\n	13	Ben Colborn		12\n	14	Kellen Hulquist		12\n	17	William Pooser		12\n	18	Jack Andonian		11\n	19	Rosdith Bisala Nkalu		11\n	21	Harper Carr		12\n	22	Fletcher Human		10\n	23	Meyer Smith		10\n	25	C.J. Zambukos		10\n	27	Miles Bailey		12\n	28	Tucker Smith		12\n	45	Aiden Kemp		10\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Barber\nBoise High School\n6A\nSoccer - Boys\n\nS: 1\nM: 12\nL: 5\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.101\nID: e2130e45-79a6-48c2-863d-43fefb7d000a\n', 'BoiseBSOC.txt', '2024-11-14 21:40:43'),
(119, 83, 1, 'Tom Shanahan', 'From: Tom Shanahan\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBishop Kelly High School\nKnights\nBlack & Gold\nBill Avey\nSarah Quilici\nTom Shanahan\nEneko Bereziartua\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Justin McGrew	GK	12\n	3	Dylan Gale	D	11\n	4	Simon Williams	FORW, MF	9\n	5	Cameron Wind	MF, D	11\n	6	Dan Hyman	D, MF	12\n	7	Diego Nava	FORW	12\n	8	Logan Kenworthy	MF, D	9\n	9	Andre Ruplinger	FORW	12\n	10	Jack Ciovacco	FORW, MF	12\n	11	Liam Running	FORW, MF	11\n	12	Patxi Bentz	FORW	12\n	13	RJ Rippert	D	12\n	14	Brayden Thomas	D, MF	12\n	15	Eduardo Longo	GK, FORW	12\n	16	Ian Novosel	D, FB	12\n	17	Jackson Burris	FORW	12\n	18	Mason Schweitzer	MF, FORW	12\n	19	JD Quilici	D	11\n	20	Jake Shepherd	D, MF	9\n	21	Carter Lauer	MF	11\n	22	Blake Delaney	MF, D	12\n	23	Simon Brotman	MF	11\n\n---------------------------------------------------------\nSHIRTS\n\nTom Shanahan\nBishop Kelly High School\n5A\nSoccer - Boys\n\nM: 7\nL: 13\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.146\nID: cb5d5d13-158a-4201-a018-cd66e2337541\n', 'BishopKellyBSOC.txt', '2024-11-14 21:40:43'),
(120, 84, 1, 'Rachael Petersen', 'From: Rachael Petersen\nActivity: Soccer - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nLake City High School\nTimberwolves\nNavy, Teal & Silver\nShon Hocker\nDeanne Clifford\nTroy Anderson\nChaz Donovan\nJosh Lewis\nRicco Ciccone\nLandon Anderson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	00	Lukas Ruchti	GK	11\n	1	Kellen Anderson	GK	9\n	2	Greyson Kortus	RW	12\n	4	Jacob Molina	CM	12\n	5	Benjamin Hannigan-Luther	LCB	12\n	6	Malakai Delio-McGuire	CM	12\n	7	Philip Du	RW	11\n	8	Sawyer Anderson	RCB	11\n	9	Reese Crawford	STRK, FORW	10\n	10	Jaelon Stimak-Eckman	LW	12\n	11	Zachary Kerns	RB	11\n	12	Johnny Shotropa	STRK, FORW	10\n	13	Carter Boykin	CM	11\n	14	Oliver Soumis	MF, FORW	10\n	15	Joshua Rojo	RB	11\n	16	Preston Samayoa	LB	11\n	17	Jonathan Kitsak	LW	11\n	18	Gabriel Jones	CM	12\n	19	Darius Kitsak	RCB	10\n	20	Reilly Smith	RW	11\n	21	Nundu Mukadama	LB, RB	12\n	99	Vann Tate	LB	10\n\n---------------------------------------------------------\nCOMMENT\n\nWill be ordering extra sweatshirts from Nancy for coaches.\n\n---------------------------------------------------------\nSHIRTS\n\nRachael Petersen\nLake City High School\n6A\nSoccer - Boys\n\nM: 4\nL: 14\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.237\nID: 18e2e0aa-8e53-4f58-9266-02bedf4609ad\n', 'LakeCityBSOC.txt', '2024-11-14 21:40:43'),
(121, 85, 2, 'Jocelyn Hobbs', 'From: Jocelyn Hobbs\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSugar-Salem High School\nDiggers\nBlue & White\nJared Jenks\nKarl Gehmlich\nJocelyn Hobbs\nScott Terry\nKristina McRae\nJeff Rebernak\nVince Tafoya\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n		Journey Jackson		11\n		Lavenia Rareba		10\n	0	Paige Luke		9\n	00	Nika Nead		12\n	1	Andee Petterson		10\n	2	Sydnie Hoopes		9\n	3	Ava Rydalch		12\n	4	Ariana Ricks		9\n	5	Hadley Chambers		9\n	6	Jaylyn Shaw		10\n	7	Allie Christensen		12\n	8	Raegan Harris		9\n	9	Alice Johansen		11\n	10	Ranadi Rareba		9\n	11	Paige Birch		9\n	12	Serena Flaig		10\n	13	Kamryn Teichert		11\n	17	Isabel Falin		11\n	20	Isabelle Tuttle		12\n	22	Kylee Johansen		11\n	55	Katie Rushforth		11\n\n---------------------------------------------------------\nSHIRTS\n\nJocelyn Hobbs\nSugar-Salem High School\n4A\nSoccer - Girls\n\nS: 7\nM: 9\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.167\nID: bccf302b-b6da-4d4a-9224-25d2a3ddbf39\n', 'SugarSalemGSOC.txt', '2024-11-14 21:40:43'),
(122, 86, 2, 'Kent Howell', 'From: Kent Howell\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMarsh Valley High School\nEagles\nBlue, Scarlet & White\nGary Tucker\nWyatt Hansen\nKent Howell\nJacinta Johnson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Gracie Young	GK	12\n	1	Shay Burmester		12\n	2	Lillian Bastian		11\n	4	Olivia Cieslak	D	10\n	5	Adeley Marshall		11\n	6	Riley Sutton		12\n	7	Sophia Harris		12\n	8	Isabelle Bastian	FORW	9\n	10	Tayzlee Belnap		11\n	11	Kamailee Singh		12\n	12	Sarai McBride	D	12\n	13	Paizley Crouch		10\n	14	Madison Foster		11\n	15	Milli Worlton		12\n	16	Jaylyn Potter		9\n	17	Olivia Medina		10\n	20	Mackie Roche	D	11\n	22	Grace Schroeder	D	12\n	25	Ava Harris		9\n	28	Ellie Lunt		10\n	33	Maylee McNabb		10\n	35	Zayli Merzlock		10\n\n---------------------------------------------------------\nSHIRTS\n\nKent Howell\nMarsh Valley High School\n4A\nSoccer - Girls\n\nS: 3\nM: 14\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.35.96\nID: a2dd0a96-d564-4709-949f-16de2da04ba3\n', 'MarshValleyGSOC.txt', '2024-11-14 21:40:43'),
(123, 87, 2, 'Richard Whitelaw', 'From: Richard Whitelaw\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSun Valley Community School\nCutthroat Trout\nNavy\nBen Pettit\nKevin Campbell\nRichard Whitelaw\nKelly Feldman\nJordan Fitzgerald\nMackenzie Price\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	5	Josie Sarchett	D	12\n	6	Scarlett Carruth	F	10\n	7	Audrey Morawitz	D	12\n	9	Maddie McCarthy	MF 	12\n	10	Margaret Fisher	D	9\n	11	Keeley Strine	FORW	11\n	12	Rylee Miller	F	10\n	13	Brynley Gage	MF	10\n	15	Taylor Hovey	D	12\n	16	Riley Siegel	D	11\n	17	Anna Taylor	F	9\n	18	Tess Lightner	MF 	11\n	19	Nina Viesturs	F	9\n	21	Reese Ammons	F	11\n	22	Lowie Watkins	D	12\n	24	Attie Murray	F	12\n	25	Sienna Loredo	D	11\n	26	Lucy Jones	MF 	9\n	28	Graysen Strine	MF	12\n	33	Torin Vandenburgh	GK	10\n\n---------------------------------------------------------\nSHIRTS\n\nRichard Whitelaw\nSun Valley Community School\n3A\nSoccer - Girls\n\nS: 2\nM: 10\nL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.244.161\nID: a493ecb9-86d7-43ed-a95b-bcd1a44e620d\n', 'SunValleyCommGSOC.txt', '2024-11-14 21:40:43'),
(124, 88, 2, 'Casey Grove', 'From: Casey Grove\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nHomedale High School\nTrojans\nRed & White\nRob Sauer\nMatt Holtry\nCasey Grove\nShelby Nicoletti\nDave Correa\nMatt Smith\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Karlie Kildow		11\n	7	Aideth Lara		12\n	8	Taylor Phelps		11\n	9	Tayvree Titus		12\n	10	Leeya Haas		12\n	11	Belen Asumendi		11\n	12	Ahbree Sandoval		12\n	13	Tiana Sorensen		11\n	14	Bertha Grace Flores		12\n	16	Evalina Costello		12\n	18	Stephanie Quezada		11\n	20	Ellie Miller		12\n	21	Morgan Nicoletti		11\n	24	Anahi Hurtado		11\n	31	Chloe Haas		9\n	33	Stella Heck		11\n	40	Cora McKerrow		11\n	45	Lainey Turner-Bowns		11\n	47	Breydyn Ford		11\n	50	Mattea Dimick		11\n	76	Diana Mendoza		10\n\n---------------------------------------------------------\nSHIRTS\n\nCasey Grove\nHomedale High School\n4A\nSoccer - Girls\n\nS: 10\nM: 9\nL: 1\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.117\nID: bed8ed19-3928-428c-82a1-0165080d477a\n', 'HomedaleGSOC.txt', '2024-11-14 21:40:43'),
(125, 89, 2, 'Robert Parker', 'From: Robert Parker\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nPocatello High School\nThunder\nRed & Blue\nDoug Howell\nLisa Delonas\nRobert Parker\nMark Wetstein\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Madysen Torngren	GK	9\n	1	Kira Jorgensem	GK	12\n	2	Brooke Murphy	D	12\n	3	Tandi Aplington	STRK, FORW	12\n	4	Skylar Nestor	FORW	12\n	5	Brooklyn Christensen	D	9\n	6	Alivia Marshall	D, MF	12\n	7	Hallie Bringhurst	FB, HB	12\n	8	Brynlee Pool	MF	10\n	9	Aryanna Gonzalez	STRK	10\n	10	Kellie Christensen	MF	12\n	11	Lexi Wells	STRK, FORW	12\n	12	Riley Wellard	D, MF	12\n	13	Emily Holm	FORW	12\n	15	Camryn Tatom	MF	10\n	16	Marcella Bills	MF	12\n	17	Hannah Armstrong	D, MF	11\n	18	Hailee Pool	MF	12\n	19	Piper Bunderson	D	11\n	20	Adelynn Shuler	FORW	10\n	21	Reagan Lyon	MF, FORW	12\n	24	Jordyn Gossett	STRK, FORW	12\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Parker\nPocatello High School\n5A\nSoccer - Girls\n\nS: 3\nM: 10\nL: 8\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.54\nID: 0dd7e1e6-e5b2-4b32-bac5-e3e5cbcc1504\n', 'PocatelloGSOC.txt', '2024-11-14 21:40:43');
INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(126, 90, 2, 'Kevin Stilling', 'From: Kevin Stilling\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nWood River High School\nWolverines\nGreen & White\nJim Foudy\nJulia Grafft\nKevin Stilling\nVicki Foster\nMandy Wilson\nJames Foster\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Taylor Heitzman	GK	11\n	0	Nahomi Lerma	GK, MF	12\n	1	Alaska Sewell	STRK	11\n	2	Grace Rushton	HB	12\n	3	Gyzelle Monjaras	MF	10\n	4	Gisele Guzman	STRK, MF	11\n	5	Hadley Vandenberg	HB	10\n	6	Gracie Wallace	MF	10\n	7	Sydney Nickum	D	12\n	8	Persia Franz	D, FB	10\n	9	Claire Buchwalter	HB, MF	11\n	10	Stella Oelerich	D, FB	12\n	11	Julia Sinnamon	HB	12\n	12	Peyton Wood	MF, STRK	12\n	13	Parker Higgins	D, FB	12\n	14	Monse Gil	STRK, FORW	10\n	16	Asha Singh	STRK, FORW	12\n	17	Anna Gilman	MF	11\n	19	Karley Johnston	MF, D	12\n	20	Hadley Walker	HB	10\n	21	Skyler Jensen	HB, MF	10\n	22	Dylan Buck	D, FB	10\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Stilling\nWood River High School\n5A\nSoccer - Girls\n\nS: 3\nM: 13\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.61\nID: 39753f56-318a-4362-9ebf-0e2bc2d431bb\n', 'WoodRiverGSOC.txt', '2024-11-14 21:40:43'),
(127, 91, 2, 'Shaun Walker', 'From: Shaun Walker\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\nBruins\nNavy, Lt Blue & White\nBrady Dickinson\nNancy Jones\nShaun Walker\nChrista Tackett\nAshley Argyle\nGrace Tigue\nJaime Tigue\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	2	Isabelle Pelayo		10\n	3	Lola Hudson		9\n	4	Sophia Schroeder		9\n	5	Addisen Kohring		9\n	8	Ellia Berrett		10\n	9	Kylie Henna		12\n	10	Olivia Thompson		10\n	11	Ava Fleming		9\n	12	Kenzie Mason		12\n	13	Chloe Waters		11\n	14	Ella Jorgensen		11\n	15	Mollie Larsen		12\n	16	Elektra Cresswell		11\n	17	Danika Dickson		11\n	18	Keiana Buican		10\n	20	Naomi Clysdale		9\n	22	Josie Carpenter		10\n	23	Addison Fiscus		12\n	31	Hayden Steen		11\n	32	Indey Caton		9\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nSoccer - Girls\n\nS: 10\nM: 9\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.80\nID: 90a6d069-e92a-4bc0-af47-299d1d8df80b\n', 'TwinFallsGSOC.txt', '2024-11-14 21:40:43'),
(128, 92, 2, 'Andy Ankeny', 'From: Andy Ankeny\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMiddleton High School\nVikings\nNavy & Gold\nMarc Gee\nJohnny Hullinger\nAndy Ankeny\nAdam Fullmer\nRyan Chris\nIneka Severa\nRoger Burbage\nTravis Moulton\nEmmy Williams\nMadi Casebolt\nMikee Miller\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	1	Reece Biorn	FORW	10\n	2	Cadence Steele	D	10\n	3	Brinklie Steele	MF	11\n	4	Claire Miller	MF	10\n	5	Brooklyn Alder	FORW, D	10\n	6	Bailey Fullmer	D	9\n	7	Alyssa Proffitt	FORW	12\n	8	Abby Linderman	MF, FORW	11\n	9	Alexandria Davis	D, FORW	11\n	10	Sydney Kim	STRK	12\n	11	Elsie Wyatt	STRK, FORW	12\n	12	Kinsley Bacon	D	12\n	13	Kaylee Banks	D	9\n	14	Autumn Herrin	GK	9\n	15	Megan Stewart	GK	10\n	16	Tyleigh Quarders	STRK	12\n	17	Kapri Austin	D, MF	12\n	18	Hailey Chris	MF, FORW	9\n	19	Allie Lantz	D, MF	10\n	20	Addie McCallister	FORW, MF	12\n	21	Ava Teixeira	FORW	9\n	22	Rylinn Bacon		9\n\n---------------------------------------------------------\nSHIRTS\n\nAndy Ankeny\nMiddleton High School\n5A\nSoccer - Girls\n\nM: 10\nL: 12\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.156\nID: 5bfc7a15-a0a5-450a-a575-6ea2dd0ec7e5\n', 'MiddletonGSOC.txt', '2024-11-14 21:40:43'),
(129, 93, 2, 'Tol Gropp', 'From: Tol Gropp\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nTimberline High School - Boise\nWolves\nBlue, Silver & Black\nLisa Roberts\nDiana Molino\nTol Gropp\nMaison O\'Neill\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Eve Engle		9\n	1	Alexis Salisbury		10\n	2	Gabriella McHargue		11\n	4	Annika Callender		9\n	5	Maura Walters		11\n	6	Jade Vachek		12\n	7	Eva Rivera		9\n	8	Allee Haynes		9\n	9	Gracen Hildebrand		9\n	10	Mackenzie Hildebrand		11\n	11	Claire Corson		9\n	12	Hailey Thistle		12\n	13	Ella St. Pierre		12\n	14	Francesca Truax		12\n	15	Abbey Arrossa		11\n	16	Aliza Boggs		10\n	17	Maya Atkinson		10\n	18	Whitney Draper		10\n	19	Morgan Woods		11\n	20	Reese Vachek		10\n	21	Riley Unruh		11\n	22	Lola Simpson		11\n\n---------------------------------------------------------\nSHIRTS\n\nTol Gropp\nTimberline High School - Boise\n6A\nSoccer - Girls\n\nS: 1\nM: 7\nL: 14\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.147\nID: 570ac0f0-31b6-47a5-8ddb-15d2252ed22a\n', 'TimberlineGSOC.txt', '2024-11-14 21:40:43'),
(130, 94, 2, 'Troy Rice', 'From: Troy Rice\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nEric Simmonsen\nGeneva Chugg\nAubree Chatterton\nAisha Reed\nKelly Potter\nAlyssa Pyle\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n		Regan Morin		11\n	0 0	Leah Subatani	GK	10\n	1	Bea Levi	GK	12\n	2	Brooklyn Brown	D	12\n	3	Madelyn Jakobson	D, FORW	11\n	4	Natali Madrigal	MF	12\n	5	Andi Hilton	FORW	12\n	6	Hallie Bentzinger	D	10\n	7	Reese Fratusco	FORW	12\n	8	Brynn Wolff	MF	11\n	9	Van Staley	D, MF	11\n	10	Addie Osterhout	MF, D	11\n	11	Liv Gonzales	D	11\n	12	Marli Fullmer	D	9\n	13	Lauren Polson	MF	12\n	14	Emma Moorcroft	D	12\n	15	Elly Levi	D	12\n	16	Addison Altwies	FORW, D	11\n	17	Faith Chatraw	FORW, D	12\n	18	MaKenna Giberson	D	12\n	19	Lydia Maisey	FORW	12\n	20	Brianna Avalos	D	11\n	21	Dilynn Revelle	FORW	10\n	22	Ella Navarro	MF	9\n	23	Kalia DeGuzman	MF	9\n	24	Teagan Weigt	MF, FORW	9\n	25	Campbell Wilson	FORW, MF	11\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nSoccer - Girls\n\nM: 4\nL: 22\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.213\nID: 9da7d109-c4dc-4d32-aab3-ea923d60c412\n', 'RockyMountainGSOC.txt', '2024-11-14 21:40:43'),
(131, 95, 2, 'Dane Roy', 'From: Dane Roy\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nMadison Graham\nJessica Whitehead\nMia Costa\nAndi McCreath\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Ashleyn Fuss		12\n	1	Griffyn Johnson		11\n	2	Paisley Pack		10\n	3	Peyton Scott		11\n	4	Alexa Zierenberg		10\n	5	Alexis Aguirre		12\n	6	Aurora Eastburn		12\n	7	Lauren Chatterton		10\n	8	Madison Guay		11\n	9	Allie Hansen		12\n	10	Jocelyn Baker		11\n	11	Lilli Denhardt		12\n	12	Sofia Lindsay		11\n	13	Andie Gardiner		12\n	14	Lily Miner		11\n	15	Lacy Zierenberg		11\n	17	AJ Takac		10\n	18	Hope Aldinger		9\n	20	Aydrie Webb		10\n	21	Brooke Sauer		12\n	22	Ashley Wright		12\n	24	Kamri Dixon		11\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nSoccer - Girls\n\nM: 3\nL: 11\nXL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.189\nID: 0f2d42d3-950f-4161-b382-9f005f7925ac\n', 'OwyheeGSOC.txt', '2024-11-14 21:40:43'),
(132, 96, 2, 'Brian Barber', 'From: Brian Barber\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBoise High School\nBrave\nRed & White\nLisa Roberts\nDeborah Watts\nBrian Barber\nAli Leonard\nNicole Arsenault\nSydney Smith\nCalle Belodoff\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n		Lucy Hopstad		10\n	0	Marin MacKenzie	GK	12\n	1	Juliette Langlet	GK	12\n	2	Nolyn Cromie		12\n	3	Leidy Nielsen		12\n	4	Lucy King		11\n	5	Avery Singer		12\n	6	Josie Reedy		9\n	7	Elle Frazier		10\n	8	Kunie Hirai		12\n	9	Maizy Kluksdal		12\n	10	Kohl Frazier		12\n	11	Emerson Shirey		11\n	13	Lily Colson		10\n	14	Claire LaMastra		10\n	15	Olivia Lamb		10\n	16	Catherine Carpenter		12\n	17	Ella Moore		12\n	18	Grace Hatch		11\n	19	Amelia Callaghan		12\n	22	Avery Morris		12\n	25	Eden Scott		10\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Barber\nBoise High School\n6A\nSoccer - Girls\n\nS: 1\nM: 12\nL: 9\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.101\nID: b2ccf6be-ff93-4a0b-ae87-a34633060ede\n', 'BoiseGSOC.txt', '2024-11-14 21:40:43'),
(133, 97, 2, 'Tom Shanahan', 'From: Tom Shanahan\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBishop Kelly High School\nKnights\nBlack & Gold\nBill Avey\nSarah Quilici\nTom Shanahan\nDawn Hill\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Brooke Hutchinson	GK	12\n	1	Katie Janzen	GK	12\n	2	Taryn Allumbaugh	FORW	11\n	3	Gwen Peterson	D	12\n	5	Erin DiVittorio	FORW, MF	11\n	6	Caitlin Staats	FORW, MF	11\n	7	Annabel Olmos	D	11\n	8	Hadley Beckley	FORW	10\n	9	Kenzie Hill	FORW	10\n	10	Beatrice Grant	D	11\n	11	Joey Klaas	MF	11\n	12	Kate Jaques	MF	11\n	13	Taylor Deitzel	MF, FORW	12\n	14	Chloe Boyd	MF	9\n	16	Annabelle Fleetwood	D	11\n	17	Madeleine Ramsey	FORW	12\n	18	Mary Higgins	D, MF	11\n	19	Brooke Hall	FORW, D	12\n	20	Sarah Colwell	D	12\n	23	Terese Stroschein	FORW	11\n\n---------------------------------------------------------\nSHIRTS\n\nTom Shanahan\nBishop Kelly High School\n5A\nSoccer - Girls\n\nM: 11\nL: 9\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.147\nID: b292f979-b736-4c4d-ab72-94cd5495fe4e\n', 'BishopKellyGSOC.txt', '2024-11-14 21:40:43'),
(134, 98, 2, 'Rachael Petersen', 'From: Rachael Petersen\nActivity: Soccer - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLake City High School\nTimberwolves\nNavy, Teal & Silver\nShon Hocker\nDeanne Clifford\nTroy Anderson\nMatt Ruchti\nNik Bjurstrom\nLaura Tolzmann\nNicole Medirios\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	grade\n	0	Savannah Spencer	GK	10\n	1	Addyson Kerley	F/M	9\n	2	Chloe Burkholder	F/M	10\n	3	Nell Hutchins	M/D	10\n	4	Makaela Randall	D	10\n	5	Adelynn Blessing	F/M/D	9\n	6	Olivia Smith	D/M	10\n	7	Kamryn Kirk	D	11\n	8	Kathryn Kovatch	F/M	10\n	9	Cameron Fischer	F/M/D	10\n	10	Bailey Koster	F	11\n	11	Finley Wright	F/M/D	9\n	12	Ella Pearson	M	10\n	13	Emerson Rakes	D	11\n	15	Ryann Blair	M/D	9\n	17	Leah Cysewski	F	12\n	18	Riley Brazle	F/M	10\n	19	Kennedy Hartzell	D/M	12\n	20	Mary Koziol	D	12\n	21	Ava Roberts	F	9\n	22	Catherine Storey	D	9\n\n---------------------------------------------------------\nSHIRTS\n\nRachael Petersen\nLake City High School\n6A\nSoccer - Girls\n\nM: 19\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.200\nID: 97fd4e2c-f831-4f33-91c4-56e58c799c45\n', 'LakeCityGSOC.txt', '2024-11-14 21:40:43'),
(135, 99, 2, 'Nichole Williamson', 'From: Nichole Williamson\nActivity: Golf - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMeridian High School\nWarriors\nBlue & Gold\nDerek Bub\nJill Lilienkamp\nNichole Williamson\nLance Beeson\n\n---------------------------------------------------------\nSHIRTS\n\nNichole Williamson\nMeridian High School\n6A\nGolf - Girls\n\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.105\nID: ae1feb9f-645b-42f3-ad08-30ba1a8f4572\n', 'roster.txt', '2024-11-14 21:40:43'),
(138, 101, 3, 'Ty Shippen', 'From: Ty Shippen\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nArmando Gonzalez\nAaron Flowers\nLogan Horrocks\nBurke Mouser\nMike Freeman\nIsaac Sahkins\nBrock Sondrup\nVic Martinez\nCarl Hooper\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	0	GAUGE LARSEN	DE			12\n	1	KASYN THOMAS	WR			12\n	2	CANNON KORTH	DB			11\n	3	PARKER GRAHAM	WR, DB			12\n	4	JAKE FLOWERS	QB			11\n	5	JERZEY DUENES	RB			12\n	6	DALLAS WALDRON	RB			12\n	8	TAYDEN OUTHENTHAPANYA	DB			12\n	9	WYATT DYE	DB			12\n	10	AMANI MOREL	RB			11\n	11	JAYDEN BELNAP	DB			11\n	12	OWEN GOLDING	WR			11\n	13	QUINN BENNETT	DB			12\n	14	MCKREE FARNSWORTH	WR			11\n	15	BRANDT BENEDICT	LB			12\n	16	KOBE WALKER	DB			11\n	17	EVAN FREEMAN	WR, DB			10\n	18	DJ BOUDRERO	LB, QB			11\n	19	WESTON CARLSON	WR			11\n	20	GAIGE JONES	LB			12\n	21	BOSTON BALSMEIER	DL, TE			11\n	22	TUCKER CLARK	DB			11\n	23	CRU CHRISTENSEN	DB			11\n	24	WYATT WALKER	LB			11\n	25	BRYSON YOUNGSTROM	RB			12\n	26	HAYDEN OLER	DB			12\n	27	ISAAC KEPPNER	DB			12\n	28	HAYDEN HARRIS	LB			11\n	29	KUE KOFE	RB, DB			10\n	31	TRACE SHIPPEN	DB			11\n	32	DAYTON SMUCK	LB			12\n	33	RJ MELANESE	RB			11\n	34	JOEL RICKS	K, P			12\n	35	MORAN GODFREY	LB			11\n	36	DALE BUTLER	K			12\n	37	STATTON BUTIKOFER	WR, DB			10\n	38	TAYSON ALLEN	FS			10\n	39	KASEN ERICKSON	WR, DB			10\n	40	ETHAN HICKMAN	LB			11\n	41	ETHAN BUTLER	K			11\n	42	BRODY DAVIS	LB			11\n	43	CACHE DIAL	DB			10\n	44	DANIEL HIPPEN	DL			11\n	45	PRESTON FERGUSON	LB			12\n	46	KOOPER STEFFLER	WR, CB			10\n	48	HUNTER SAUTTER	DT			12\n	49	GUNNAR DAVIS	QB			10\n	50	HUNTER KOSTER	OL			12\n	51	FEKI POUHA	OL, DL			12\n	54	RYKER SERRANO	OL			11\n	55	MASON BARKER	DE			12\n	56	GAGE FRENCH	DL			11\n	57	DAKOTA DOMAN	ILB			10\n	58	VINCENT MCCONNELL	OL			11\n	60	JACOBY NORDSTROM	OL			11\n	62	DONOVIN JARA	OL			11\n	63	KANNON OSWALD	OL			12\n	65	NICK JOHNSON	OL			12\n	66	CODY RICKS	DT			12\n	71	BRONSON LEWIS	OL			10\n	71	BRODY GAST	OL			11\n	72	WILL KEARSLEY	DL			11\n	74	DAYTON BOONE	OL			12\n	75	TRAECEN JACKSON	OL			10\n	76	BRAIDEN BYRD	OL			12\n	77	GABE ALVAREZ	DL			11\n	78	CACHE WILLIAMS	DL			11\n	82	BRAEDEN HARKNESS	DT			12\n	85	TYEREL GASSER	OLB			11\n	87	SETH BRADLEY	TE			11\n	96/91	CASEN SYLVESTER	DT			12\n\n---------------------------------------------------------\nRECORD\n\n9	1\n\n14	Coeur d\'Alene	24\n48	Wasatch UT	27\n47	Moses Lake WA	12\n42	Bishop Kelly	7\n35	West UT	33\n33	Highland	3\n35	Madison	21\n49	Hillcrest	39\n56	Thunder Ridge	24\n52	Post Falls	21\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nFootball\n\nM: 8\nL: 35\nXL: 23\n2XL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.80\nID: 6e6a3cd9-225e-4c29-96c0-b8b845a995c1\n', 'RigbyFB.txt', '2024-11-18 11:15:01'),
(139, 102, 3, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nJames Cluphf\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	0	Roman Walker	LB, TE	5-8	190	12\n	1	Aaron Zrno	DB	5-9	160	12\n	2	Austin Ramsey	QB	5-11	190	11\n	3	Noah Burnham	RB	5-8	170	11\n	4	Jack Giannini	LB, TE	6-	205	12\n	5	Treyson Anderson	TE	6-4	210	12\n	6	Jake Benson	WR	6-3	170	12\n	7	Chance Jones	DB	6-2	187	12\n	8	Cole Brooks	DE	6-3	225	12\n	9	Luke Mikita	RB, WR	5-11	180	10\n	10	Will Anderson	WR	5-9	145	11\n	11	Gavin Crawford	DB, WR	5-8	160	12\n	12	Zayah Wright	DB, WR	5-10	165	11\n	13	Henry Borg	DB	5-9	160	12\n	14	Dallin Snooks	WR	6-2	170	11\n	15	Cole Jones	QB	5-10	160	10\n	16	Scott Heaton	WR	6-2	165	11\n	17	Jack Gochnour	DB	5-10	160	12\n	18	Gavin Meredith	DB	6-1	175	12\n	19	Anthony Butler	LB	6-1	175	11\n	21	Thomas Priegel	LB	6-3	195	12\n	22	Brenden Ordaz	DB	5-7	170	12\n	23	Collin Duarte	DB	5-9	160	11\n	24	Emmett Hibbard	DB	5-8	170	11\n	26	Blake Feely	RB	5-10	160	10\n	27	Grayson Bruch	DB	5-11	155	11\n	28	Dawson Hood	DB	5-10	165	10\n	30	Kai Williams	LB	5-11	185	10\n	31	Paxton Modjeski	DB	6-3	200	11\n	32	Bowen Blackburn	DB	5-7	145	10\n	33	Connor LeBeau	LB, TE	6-2	195	12\n	34	Cash Craw	LB	5-7	170	10\n	37	Lucas Boockholdt	K	6-	165	12\n	41	Oliver Stephens	LB	5-11	170	12\n	44	Jaxson LeBeau	LB	5-11	200	11\n	46	Camden Harrison	RB	6-	166	9\n	54	Alexis Gonzalez	DL	6-1	210	12\n	55	J.W. Bryan	DE	6-	215	12\n	59	Owen Niehaus	OL, G	6-0	230	12\n	62	Jeremiah Dutchover	OL	6-	266	10\n	64	Quentin Noyola	OL	6-	240	12\n	66	Cash Waddell	OL	6-3	265	9\n	72	Ryder Maroevich	OL	5-10	188	12\n	73	Sione Perkins	OL	6-8	295	12\n	74	Andrew Banks	OL	6-	190	11\n	75	Kingston Critchfield	OL	6-3	260	11\n	76	Blake Rhodenbaugh	OL	6-4	215	11\n	78	Anthony Toomey	OL	6-2	285	12\n	80	Nate Williams	DL	6-4	245	12\n	81	Nathen Pautov	TE	6-3	200	11\n	83	Adam Hirschi	WR, TE	6-	150	11\n	84	Evan Shaigineik	WR, TE	5-6	150	12\n	86	Aiden Kindrick	WR, TE	6-4	180	9\n	87	Landon Bult	TE	6-4	200	10\n	88	Jeremiah Minnett	DL	5-11	230	11\n	90	Brayden Petersen	DL	6-1	195	10\n	99	Turner Simmons	DL	5-10	260	11\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nFootball\n\nS: 2\nM: 6\nL: 25\nXL: 10\n2XL: 10\n3XL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.204\nID: de543d2b-66f0-4335-8ded-fe1ddc77ae7a\n', 'EagleFB.txt', '2024-11-18 11:15:01'),
(140, 103, 3, 'Lynette Buttars', 'From: Lynette Buttars\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nWest Side High School\nPirates\nMaroon, White & Gold\nTyler Telford\nKory Kay\nTyson Moser\nTyson Moser\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	6	Jake Barzee				9\n	9	Luke  Hodges				12\n	10	Mitch Mumford				11\n	11	Trayce  Stone				12\n	12	Micah Benavidez				11\n	13	Jaden Fuller				11\n	14	Jayden Coats	CB, WR	5-8		11\n	15	Billy Woodward				9\n	17	Mason Williams				9\n	18	Crew Sage		5-8	155	12\n	20	Corry  Telford				12\n	22	Drake Sage				10\n	23	Tanner Henderson				10\n	24	Garrett Taylor				12\n	24	Trayce Stone		6-0	160	12\n	26	Bryson Mcdaniel	TE, DE	6-3	180	11\n	27	Will  Hurren				10\n	29	Judd Selley				11\n	30	Cooper Millburn				11\n	43	Raef Graves				12\n	54	Wit Keller				12\n	55	Hyrum Checketts				11\n	59	Gage Kidman				10\n	61	Danny Leavitt				10\n	62	McCoy  Winward				12\n	63	Beau Reeder				12\n	65	Dallas Nelson				12\n	66	Gage Smith				11\n	67	Jaxxon Bastian				11\n	68	Chet Ward				11\n	69	Cutler Bingham				11\n	70	Logan Hyde				11\n	70	Jarrett Anger				12\n	71	Ivan Campbell		6-0	215	12\n	72	Kale Breckencamp				12\n	73	Ezra Benavidez				10\n	74	Tommie Oson				9\n	75	Will Hadley				9\n	77	Max Breckencamp				9\n	80	Jake Naylor				10\n	85	Perry Westover				11\n	88	Abram Mumford				12\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nLynette Buttars\nWest Side High School\n3A\nFootball\n\nS: 5\nM: 11\nL: 16\nXL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.214.24\nID: 09dab2b8-3800-4414-b14b-b663425947d8\n', 'WestSideFB.txt', '2024-11-18 13:17:49'),
(141, 104, 3, 'Molly Olson', 'From: Molly Olson\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nKendrick High School\nTigers\nOrange & Black\nSteve Kirkland\nSteve Kirkland\nMolly Olson\nZane Hobart\nGreg Frisbee\nKen Hobart\nMat Anderson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	2	Ralli Roetcisoender	WR, DB	6-2	173	11\n	4	Kasch Littlefield	WR	5-9	130	9\n	5	Wyatt Cook	TE, DL	6-3	215	12\n	7	Kolt Koepp	TE, DL	6-3	171	11\n	8	Blake Morgan	QB	5-11	145	9\n	9	Jerry Anderson	DB, WR	5-10	143	9\n	10	Maddox Kirkland	QB, DB	6-1	161	10\n	11	Nathan Tweit	WR, LB	6-3	185	11\n	13	Caleb O’Bryant	OL, DL	6-0	223	12\n	15	Xavier Carpenter	RB, LB	5-10	180	12\n	18	Cade Silflow	WR, DB	6-1	154	11\n	19	Sawyer Hewett	RB, DB	6-0	170	12\n	21	Nathan Kimberling	OL, DL	6-0	191	10\n	22	Jamie Roberts	WR, DB	5-8	142	11\n	24	Landon Sneve	RB, LB	5-10	155	10\n	26	Orion Stewart	RB, LB	5-8	155	10\n	28	Brock Boyer	OL, DL	6-2	220	12\n	33	Leyton Brown-Sherrill	TE, DB	5-8	151	12\n	35	Travis Hix	OL, DL	6-2	204	11\n	36	Carson Hogan	OL, DL	5-10	208	12\n	42	Keegan Anderson	OL, DL	5-10	225	10\n	52	Tyler Hoffman	OL, DL	5-7	150	9\n	64	Evan Simpson	OL, DL	6-1	230	12\n	84	Hudson Kirkland	LB, WR	6-1	171	9\n\n---------------------------------------------------------\nRECORD\n\n	\n\n86	Troy	8\n74	Oakley	8\n58	Clearwater Valley	0\n54	Lapwai	8\n68	Potlatch	6\n56	Kamiah	12\n18	Logos	30\n52	Prairie	20\n54	Potlatch	0\n52	Logos	26\n\n---------------------------------------------------------\nSHIRTS\n\nMolly Olson\nKendrick High School\n2A\nFootball\n\nM: 5\nL: 10\nXL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.81\nID: ecd9ecc1-58ab-4566-bd5c-5ff003829557\n', 'KendrickFB.txt', '2024-11-18 13:17:49'),
(142, 105, 3, 'Casey Grove', 'From: Casey Grove\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nHomedale High School\nTrojans\nRed & White\nRob Sauer\nMatt Holtry\nCasey Grove\nMatt Holtry\nTony Uranga\nDarren Uranga\nJosh White\nBen Roberts\nTerry Moore\nDan Holtry\nCam Long\nZac Taylor\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	1	Wyatt Ingram	WR, CB	5-8	123	11\n	2	Rafael Cuenca	WR, CB	6-1	185	12\n	3	Angel Nolasco	WR, CB	5-9	167	12\n	4	Sebastian Larzelier	FB, OLB	5-7	150	11\n	5	Tyler Erikson	WR, DB	5-11	163	12\n	7	Sawyer  Nicoletti	WR, FS	5-9	140	10\n	8	Aron Sotelo	RB, DB	5-9	138	10\n	9	Luke Henry	FS, WR	5-10	165	12\n	10	Boston Garrett	TE, CB	5-11	162	10\n	11	Easton Dines	RB, DE	5-10	159	9\n	12	Alec Campos	WR, CB	6-0	155	10\n	13	Kenny Clover	WR, FS	5-10	167	12\n	14	Xavier Uranga	QB, DB	5-9	142	11\n	15	Kreece Powell	QB, CB	5-10	135	9\n	16	Donovan Uranga	QB, DB	5-7	133	9\n	17	Domingo Asumendi	WR, LB	6-0	166	11\n	20	Lorelei Johnson-kiriago	WR, CB	5-10	149	12\n	21	Chance Martell	WR, FS	5-7	153	11\n	22	Tyce Fisher	MLB, RB	5-11	170	10\n	23	Cruz Bullard	RB, LB	5-9	205	12\n	24	Lukas Hall	TE, DE	6-5	195	11\n	25	Alex Sotelo	RB, CB	5-9	154	12\n	26	David Bowden	WR, DB	6-0	150	11\n	27	Nick Schlenker	RB, OLB	5-8	156	10\n	32	Javid Blewett	RB, OLB	6-0	184	11\n	33	Brock Walker	G, MLB	6-2	194	12\n	34	William Dunne	RB, OLB	5-10	166	10\n	35	Alejandro Martinez	WR, DB, K	5-9	150	9\n	38	Tuff Neider	RB, LB	5-10	151	9\n	40	Ty Cooper	TE, LB	5-11	166	10\n	42	Kade Hall	RB, DE	6-0	185	11\n	46	Dylan Taylor	TE, LB	5-10	134	9\n	48	Mason Taylor	TE, LB	5-10	134	9\n	51	Grady Walgamott	OL, DL	6-0	230	11\n	52	Caden Layne	OL, DL	6-2	208	12\n	53	Colt Nelson	OL, DL	6-1	228	9\n	54	Brevin Blewett	OL, LB	5-10	148	9\n	55	Sebastian Soto	OL, DL	5-6	200	9\n	56	Nathan Marston	OL, DL	6-0	172	11\n	57	Blaine Bahem	OL, DL	6-1	207	10\n	58	Owen Erikson	OL, LB	5-11	156	9\n	59	James Chandler	G, DT	5-9	208	11\n	60	Diego Cortez	C, DT	6-0	205	12\n	61	Mccoy Swallow	OL, DL	6-1	230	12\n	62	Shayde Volk	G, DT	5-11	171	10\n	63	William Mcguire	OL, DL	5-9	224	12\n	70	Bradley Walker	OL, DL	6-1	154	10\n	72	Symon Carrillo	OL, DL	5-11	222	9\n	73	Kevyn Andrade	OL, DL	5-9	209	12\n	74	Carlos Hurtado vega	T, DT	6-0	330	11\n	75	Terry Volk	G, DT	6-1	275	12\n	76	Peyton Mccarney	OL, DL	5-11	195	10\n	77	Joseph Gaspar	OL, DL	6-2	295	12\n	78	Andrew Tibbett	OL, DL	5-11	162	9\n	84	Jonathan Vargas	WR, DB	5-7	159	10\n	88	Jace Clover	TE, DE	6-2	172	11\n\n---------------------------------------------------------\nRECORD\n\n10	1\n\n22	Snake River	6\n47	Filer	0\n47	Kimberly	21\n50	Jerome	0\n59	Payette	7\n6	Weiser	30\n29	Fruitland	28\n33	McCall-Donnelly	14\n54	Cole Valley Christian	0\n35	Buhl	9\n27	Weiser	7\n\n---------------------------------------------------------\nSHIRTS\n\nCasey Grove\nHomedale High School\n4A\nFootball\n\nM: 22\nL: 17\nXL: 13\n2XL: 2\n3XL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.17\nID: efbc47ab-a117-43cc-8ebb-06733df93a73\n', 'HomedaleFB.txt', '2024-11-18 13:17:49'),
(143, 106, 3, 'Larry Stocking', 'From: Larry Stocking\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nHillcrest High School\nKnights\nRed, Black & White\nScott Woolstenhulme\nTy Salsbery\nLarry Stocking\nBrennon Mossholder\nDoug Schultz\nMark Asper\nJordan Long\nTyler Belnap\nTyler Schultz\nLarry Belnap\nBlake Phippen\nDustin Medellin\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	0	Ryan Mecham	MLB, TE	5-11	195	11\n	1	Dalton Fontes	CB, WR			12\n	2	Mason Saunders	CB, WR	6-2	180	12\n	3	Titan Larsen	RB, OLB	6-3	225	12\n	4	Porter Collins	MLB, RB	6	190	12\n	5	Carter Holden	WR, CB	5-5	112	12\n	7	Markus Webster	MLB, WR	5-8	160	12\n	8	Khiano Vega				12\n	9	Lucas Fazzio	CB, WR	5-8		12\n	10	Trezden Thomson	WR, SS	6-1	185	11\n	11	Ki Simpson				10\n	11	Jace Judy	WR, OLB	6-1	175	12\n	12	Tate Prince	WR, CB	6	175	11\n	13	Gavin Lamph		5-11	175	9\n	13	Jayden Milano		6	180	11\n	14	Jaxon Miller		6-1	198	12\n	15	Canon Davis	RB, MLB	6	190	12\n	16	Creiden Nield		6	180	11\n	17	Rylan Borgmann	K, P	6-4	195	11\n	18	Tyson Sweetwood	QB, FS	6-4	182	11\n	19	Maddox Sandoval	WR, CB			10\n	19	Mason Davis	WR, CB	6-1	165	11\n	20	Krew Holland		6-2	185	11\n	21	Jairo Marin				12\n	22	Justin Spencer	SS, FS	6-3	200	11\n	23	Brody Dorning	OLB, RB	6-2	190	10\n	25	Jose Rodriguez	K, MLB	5-8	190	11\n	26	Zach Steadham	WR, FS	6-2	165	11\n	27	Carter Ruppel	OLB, RB	5-11	160	12\n	28	Ethan Lords		5-11	180	11\n	29	Tayden Packard		6-	132	10\n	30	Boston Morris	TE, MLB	6-2	190	10\n	31	Lucas Benson		5-11	175	11\n	32	Dax Sargent				11\n	33	Alex Monroy				12\n	33	Ethan Saunders	WR, SS	6	175	9\n	34	Logan Taylor		6-2	190	9\n	35	Elam Miner	RB, OLB	5-10	160	9\n	37	Maddox Ellingford	QB, WR	5-11	185	10\n	43	Cam Cates				11\n	50	Jeremiah Morris	G, NG	5-8	185	11\n	50	Austin Reeves	C, DT	6-1	240	11\n	55	Porter Boyce	T, DE	6-3	225	12\n	56	Jackson Burrows	DE, G	6-1	200	12\n	57	Kylar Christensen		6-0	173	11\n	58	Tyrell Francis	DE, T	5-10	187	11\n	60	Brandyn Vandever	T, NG	5-9	266	12\n	61	Bodie Stepp	G, NG	6-2	210	10\n	63	Maddox Medellin		6-3	175	11\n	65	Will Vasquez				11\n	66	Damien Simmons	G, DE	6-4	200	11\n	67	Ayden Allen	G, DE			12\n	71	Landon Murphy		6-1	215	11\n	72	Gavin Allen	DE, T	6-4	250	10\n	74	Gavin Hillman	G, NG	5-7	220	11\n	75	Michael Mccartney	T, DE	6-4	265	12\n	85	Austin Snarr	MLB, TE	6-	205	10\n	88	Jake Benson	TE, DE	6-1	210	12\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nLarry Stocking\nHillcrest High School\n5A\nFootball\n\nL: 20\nXL: 28\n2XL: 10\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.210.147\nID: f2f7a502-1583-4f1e-b1c5-053aba7d15ae\n', 'HillcrestFB.txt', '2024-11-18 13:17:49'),
(144, 107, 3, 'Jennifer Murdock', 'From: Jennifer Murdock\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nDeclo High School\nHornets\nOrange & Black\nSandra Miller\nRoland Bott\nJennifer Murdock\nRhett Jones\nJon Loper\nRon Jones\nScott Moulton\nKent Taylor\nBrandon Brackenbury\nWynn Osterhout\nJohn Garrard\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	2	Hayden Thaxton	QB, DB			12\n	3	Zane Snedaker	RB, DB			11\n	5	Landen Silcock	WR, DB			11\n	6	Brennen Ward	RB, OLB	5-7	140	9\n	7	Traecyn Thaxton	QB, DB			9\n	8	Ryan Taylor	RB, DB			9\n	10	Stetson Moulton	WB, DB			9\n	11	Dane Garrard	FB, QB			10\n	13	Gavin Rasmussen	WR, WB			12\n	14	Paxton Matsen	TE, DE			9\n	16	Teegan Ward	RB, ILB	5-9	150	11\n	18	Preston Worton	WB, WR	5-10	155	11\n	19	Harlin Hawker	WR, DB	6-0		9\n	20	Dawson Darrington	RB, OLB			10\n	23	Bode Brackenbury	RB, OLB			12\n	24	Tyson Christensen	FB, QB			10\n	29	Hudson Osterhout	WR, DB			10\n	34	Dacx Garrard	TE, OLB			10\n	35	Riley Matthews	TE, OLB			12\n	40	Keston Koyle	FB, ILB			12\n	52	Rhett Silcock	OL, DE			9\n	52	Leonardo Calderas	OL, DL			11\n	54	Breken Darrington	OL, ILB			10\n	55	Race Zollinger	OL, DL			11\n	57	Dodge Edgar	OL, DE			12\n	58	Kyler Fairchild	OL, DE			10\n	60	Isaac Hauser	OL,DL			10\n	62	Joey Garrard	OL, DL			12\n	64	Kolby Williams	OL, DL			9\n	65	Kyle Bott	OL, DL			11\n	66	Dacian Winmill	OL, DE			11\n	68	Cash Peterson	OL, DL			10\n	73	Braxtyn Jones	OL, DL			10\n	75	Brandon Garcia	OL, DL			12\n	76	Trevin Averett	OL, DL			11\n	77	Renan Loper	OL, DL			12\n	85	Jaxton Somsen	TE,LB			\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nJennifer Murdock\nDeclo High School\n4A\nFootball\n\nS: 1\nM: 9\nL: 16\nXL: 11\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.13\nID: b1f9d125-3f9c-43fb-aadd-71b7fbca9b0e\n', 'DecloFB.txt', '2024-11-18 13:17:49'),
(145, 108, 3, 'Greg Carpenter', 'From: Greg Carpenter\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nNampa High School\nBulldogs\nRed, Blue & White\nGregg Russell\nKasey Burkholder\nGreg Carpenter\nJoseph Bidwell\n\n---------------------------------------------------------\nSHIRTS\n\nGreg Carpenter\nNampa High School\n6A\nDrama\n\nL: 2\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.116\nID: a5cbcadb-db1f-4e8b-bc1a-fa7797f8e7ff\n', 'roster (96).txt', '2024-11-19 10:49:02'),
(146, 109, 3, 'Jocelyn Hobbs', 'From: Jocelyn Hobbs\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nSugar-Salem High School\nDiggers\nBlue & White\nJared Jenks\nKarl Gehmlich\nJocelyn Hobbs\nTyler Richins\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	1	Kooper Mace	RB, DB	6-1	185	12\n	2	Abe Baldwin	RB, DB	6-2	190	12\n	3	Wayne Caffrey	RB, LB	6-1	190	11\n	4	Tyler Williams	RB, DB	5-9	150	12\n	5	Riley Williams	WR, DB	6-0	170	12\n	6	Carter Mccluskey	RB, LB	5-8	135	10\n	7	Benjamin Hegewald	WR, DB	6-1	170	11\n	8	Latrell Markle	RB, DB	5-9	145	10\n	9	Sam Chappell	WR, DB	5-8	160	10\n	10	Ace Clark	WR, DB	6-1	195	11\n	11	Davin Carlson	WR, DB	5-10	150	11\n	12	Jack Gardner	QB	6-0	155	12\n	13	Porter Teichert	K	5-10	160	11\n	14	Hank Carter	TE, DE	6-4	215	12\n	15	Oscar De la torre	WR, DB	5-9	135	11\n	16	Frank Fillmore	QB, FS	6-1	160	10\n	17	Dawson Mcinelly	RB, LB	6-2	195	12\n	20	Payton Blaser	RB, LB	5-9	150	11\n	21	Kason Williams	RB, LB	5-5	135	12\n	22	Ben Aldrich	RB, DE	6-2	225	12\n	23	Jason Fleming	RB, LB	5-2	145	12\n	24	Jaxton Hanks	RB, LB	5-7	140	10\n	25	Kaden Nate	TE, DE	6-3	205	11\n	27	Declan Richins	RB, LB	5-10	160	9\n	28	Isaak Zollinger	RB, LB	5-5	150	10\n	33	Kimball Tonks	RB, LB	5-9	185	11\n	34	Walt Fillmore	RB, LB	5-10	155	9\n	40	Boston Nead	TE, DE	6-1	150	9\n	41	DeShane Dunlap	WR, DB	5-7	130	10\n	50	Brayden Pocock	OL, DL	6-0	215	12\n	51	Clark Siddoway	OL, DL	6-3	280	12\n	52	Kace Malstrom	OL, LB	6-0	190	12\n	53	Nathan Barrus	OL, DE	6-5	230	12\n	54	Carson Richins	OL, DE	6-0	170	11\n	55	Case Vela	OL, LB	5-8	185	12\n	56	Dax Blaser	OL, DL	6-1	185	11\n	57	Dax Crapo	OL, DL	6-0	205	10\n	58	Tegan Brown	OL, DL	6-0	230	10\n	60	Jonah Cureton	OL, DE	6-3	190	11\n	63	Tyler Harris	OL, DL	6-1	230	12\n	65	Dallin Stewart	OL, DL	6-1	245	12\n	66	Benson Schulthies	OL, DL	6-3	215	11\n	67	Braxton Hawkes	OL, DL	5-10	200	11\n	70	Boston Rubert	OL, DL	5-9	180	10\n	71	Mathias Lopez (52)	OL, DL			10\n	72	Everett Poole	OL, DL	6-4	255	10\n	73	Brooks Robinson (53)	OL, LB	5-10	170	10\n	74	Dax Rowbury	OL, DL	6-4	205	11\n	75	Mathew Madsen (60)	OL, DL	6-0	180	10\n	76	Jaxsen Mortensen (66)	OL, DL	6-0	185	10\n	77	Bryson Harris	OL, DL	6-0	240	10\n	79	Ruben Rhodes	OL, DL	5-9	300	10\n	81	Porter Summers	TE, DE	5-11	150	10\n	82	Brevin Harris	WR, DB	6-0	170	10\n	89	Adriane Williams (2)	RB, LB	5-9	165	10\n	90	Trevon Butikofer (3)	WR, DB	5-10	140	10\n	91	Colton Gardner (4)	WR, DB	5-8	140	10\n	92	Kolter Harris (7)	QB, DB	6-0	140	10\n	93	Joshua Peterson (11)	TE, DB	6-0	160	10\n	94	Barron Winegar (14)	WR, DB	5-9	150	10\n	96	Caydyn Shaw (21)	RB, LB	6-1	160	9\n	97	Korbin Wagner (22)	RB, DE	6-1	170	10\n	98	Eli Pannell (23)	TE, DE	6-0	165	10\n	99	Tayson Dalling (24)	RB, LB	5-7	150	10\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nJocelyn Hobbs\nSugar-Salem High School\n4A\nFootball\n\nM: 11\nL: 23\nXL: 21\n2XL: 4\n3XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.206.17\nID: 3d0cb455-6258-4721-b1d5-6c4605195564\n', 'SugarSalemFB.txt', '2024-11-19 11:39:04'),
(147, 110, 3, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nScott Berger\nChet Taylor\nBrett Taylor\nBridger Taylor\nChase Meyer\nTravis Perez\nCruz Taylor\nDoug Stirling\nMarco Martin\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n		Trevyn Phillipp		5-10	140	9\n		Cooper Jones	OLB			10\n		Easton Taylor	QB	6-0	185	\n		Joel Rose	QB, CB			8\n		Nolan Ma				12\n	0	Corbin Lancaster	OLB, MLB	6-3	185	12\n	1	Treyden Kirkham	SB, WR	5-10	165	12\n	2	Taylor Taylor	SB, SS	5-7	155	11\n	3	Dillon Andrews				\n	4	Victor Rivera	WR, CB	6-0	150	11\n	5	Zyan Crockett	SB, CB	5-10	170	11\n	6	Liam Lynch	RB	6-0	190	11\n	7	Carmyne Garcia	QB	6-2	200	12\n	8	Lincoln Searle	MLB	5-11	205	12\n	9	Kaesen Smith	DE, LS	6-1	215	12\n	10	Boston Hugues	WR, TE			11\n	11	Taylor Demott	WR	6-1	195	12\n	12	Cooper Thomas	QB, SS	5-10	140	10\n	13	Robert Mcpherson	DE, DT	6-2	198	11\n	14	Duncan Howell	QB, WR			9\n	15	Dominik Lopez	DT, NG	5-11	185	12\n	16	John Giannini	QB, WR	6-2	160	10\n	17	Santino Antrim	CB	5-11	149	11\n	17	Aaron Ojeda	RB, WR	6-1		11\n	18	Ulises Tafoya	RB	5-6	175	11\n	19	Paxton Nulph	FS, SS	6-0	175	12\n	20	Sawyer Davis	MLB, OLB	6-0	170	11\n	21	Will Jensen	CB	5-11	160	12\n	22	Gage Searle	SS	5-9	150	11\n	23	Jace Marlow	CB	6-3	190	12\n	24	Cage Lambson	CB			10\n	24	Johnathan Brewton				\n	25	Sawyer Danielson	DE, LS	6-0	200	12\n	26	Aaron Ojeda	RB	6-0	195	11\n	27	Riley Stewart	RB	5-9	170	9\n	28	Bennett Southwick	OLB, MLB	6-0	205	12\n	29	Spencer Dennert	SS	5-8	125	11\n	30	Adrian Luna	CB	5-6	145	12\n	32	Bray Plocher	RB	5-10	150	10\n	33	Josh Sutton	RB	5-5	130	11\n	35	Porter Frasure				9\n	40	Caden Cruz	SB			10\n	43	Ledger Searle	OLB			10\n	44	Jj Andersen		6-0	200	9\n	45	Kyler Loftus	OLB	5-10	170	11\n	50	Wyatt Cox	G, T	6-1	215	9\n	51	Braxton Orchard	OG, OT			9\n	52	Aaden Chavez	C	6-0	200	10\n	53	Oliver Holm	G, T	5-11	245	12\n	54	David Robinson	DE, DT	6-2	206	11\n	55	Ethan Elmore	MLB			10\n	56	Rodrigo Cortez	DT, NG	6-0	200	10\n	57	Caleb Johnson	DT, LS	5-10	220	12\n	57	Kyllian Mccullagh	OL	6-1	242	11\n	60	Atticus Fuhriman	C, G	6-1	290	12\n	65	Easton Lucas	OT	6-4	200	11\n	65	William Nelson	C, G	5-11	295	10\n	67	Wesley Downes	DL			12\n	68	Jaxon Brinkerhoff	OL	5-8	210	10\n	74	Dylan Meek	T, G	6-0	215	12\n	77	Daxton Perkins	T	6-7	230	12\n	78	Koen Brown	OL	6-0	150	11\n	79	Trey Blue	G, T	6-1	262	11\n	80	Jon Garcia	WR			11\n	81	Dax Clinger	WR, TE	6-4	200	10\n	82	Cash Webster	WR			10\n	84	Taleai Molifua	WR	6-2		10\n	85	Sam Demott	SB, WR			9\n	87	Ernesto Molina	WR, CB			10\n	89	Preston Allen	DE, DT			9\n	90	Kallin Starks	DT	5-9	195	11\n	99	Ricky Nila	DT	5-11	205	11\n\n---------------------------------------------------------\nRECORD\n\n10	2\n\n20	Morgan Ut	26\n42	Blackfoot	0\n27	Madison	28\n28	Hillcrest	16\n47	Idaho Falls	0\n29	Shelley	6\n28	Thunder Ridge	14\n35	Highland	14\n46	Bonneville	16\n42	Nampa	14\n35	Twin Falls	14\n35	Minico	8\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nFootball\n\nM: 6\nL: 23\nXL: 20\n2XL: 8\n3XL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.112\nID: c50ab488-6b81-4473-96d8-f1e6b25c3be9\n', 'SkylineFB.txt', '2024-11-19 11:39:04'),
(148, 111, 3, 'Rex Romander', 'From: Rex Romander\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nDietrich High School\nBlue Devils\nBlue, White & Black\nStefanie Shaw\nRex Romander\nRex Romander\nGarrett Astle\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	0	Kooper Torgerson	TE, C	6-0	165	9\n	2	Brody Torgerson	G, MLB	6-1	210	12\n	3	Chase Norman	RB, CB	5-8	155	11\n	5	Connor Perkins	QB, CB	5-9	150	12\n	6	Wyett Sneddon	QB, RB	5-6	175	11\n	8	Gavyn Hoskisson	QB, DE	5-10	180	10\n	12	Eli Weber	WR, DE	5-8	150	12\n	14	Ty Van tassel	CB	5-4	140	9\n	19	Isaac Ward	RB	5-6	150	12\n	20	Kyah Dilworth	MLB, OLB	5-3	150	12\n	21	Erick Chavez	TE, G	5-11	190	12\n	22	Jason Hollibaugh	G, DE	5-11	190	11\n	32	Angel Alvarado	QB/OLB	5-11	200	12\n	34	Kage Resz	C/NT	5-7	170	12\n	42	Crew Weber	C	5-7	115	10\n	44	Luke Johnson	OG/NT	5-8	190	11\n	52	Che Buckway	T, NG	5-11	190	12\n	57	Chris Romero	OG/NT	5-10	230	11\n\n---------------------------------------------------------\nRECORD\n\n	\n\n\n---------------------------------------------------------\nSHIRTS\n\nRex Romander\nDietrich High School\n3A\nFootball\n\nM: 1\nL: 13\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.99\nID: 41db7775-fda7-46cb-b93f-bf2c4cc3a740\n', 'DietrichFB.txt', '2024-11-19 11:39:04'),
(149, 112, 3, 'Lee Jay Cook', 'From: Lee Jay Cook\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nCarey High School\nPanthers\nBlue & Gold\nJim Foudy\nKayla Burton\nLee Jay Cook\nJohn Saili\nLane Durtschi\nDusty Simpson\nDJ Parke\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	0	Wrangler Marcroft	OL, DL	6-0	239	11\n	1	Preston Wood	QB, LB	6-2	180	12\n	2	Eddie Gamino	RB, LB	5-3	145	12\n	3	Frankie Hoy	LB, RB	5-1	98	9\n	4	Holt Koudelka	ATH, ATH	5-9	145	9\n	5	Madden Perkes	RB, LB	5-8	145	10\n	6	Gabe Saili	TE, LB	6-0	172	11\n	7	Kade O\'Crowley	DL, OL	6-0	160	12\n	9	Jonah Saili	QB, LB	5-11	167	9\n	10	Weston Baker	WR, LB	5-8	132	9\n	11	Aj Black	TE, LB	6-1	170	12\n	12	Josh Peterson	RB, LB	5-7	132	12\n	13	Garret Olsen	ATH, ATH	5-3	110	9\n	14	Brody Quillen	DE, TE	5-10	156	12\n	15	Matthew Young	TE, LB	5-10	165	12\n	17	Dawson Olsen	RB, LB	5-10	140	12\n	23	Liam Long	DE, RB	5-8	157	9\n	24	Johnathan Rojas	DE, TE	5-9	151	9\n	25	Pieran Hoy	DL, OL	5-8	160	11\n	28	Stockton Sears	RB, LB	5-10	160	11\n	34	Tripp Bailey	OL, DL	5-7	176	10\n	35	Tyler Ocrowley	DE, RB	5-11	150	9\n	40	Will Parke	TE, LB	5-10	160	11\n	45	Caden Clark	DL, OL	5-10	240	9\n	47	Kade Hansen	TE, DE	5-10	125	10\n	52	Josue Rojas	OL, DL	6-3	280	9\n	64	Jonathan Harmon	OL, DL	6-0	235	12\n	68	Gavin Long	DL, OL	6-0	267	11\n	87	Chris Ruiz	OL, DL	5-11	218	12\n	97	Luke Aquistapace	C, DL	6-0	200	12\n\n---------------------------------------------------------\nRECORD\n\n10	1\n\n62	Murtaugh	32\n20	Butte County	40\n60	Castleford	8\n80	Richfield	0\n70	Hansen	16\n64	Rockland	6\n54	Dietrich	6\n50	Shoshone	8\n15	Camas County (FF)	0\n86	Wallace	8\n70	Garden Valley	0\n\n---------------------------------------------------------\nSHIRTS\n\nLee Jay Cook\nCarey High School\n1A\nFootball\n\nS: 2\nM: 7\nL: 10\nXL: 6\n2XL: 4\n4XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.4\nID: 9f1a438c-b9d5-43f7-9a32-069761d3c7ae\n', 'CareyFB.txt', '2024-11-19 11:39:04'),
(150, 113, 3, 'Angie McAffee', 'From: Angie McAffee\nActivity: Football\n\n---------------------------------------------------------\nSCHOOL\n\nButte County High School\nPirates\nBlack, White & Orange\nJoe Steele\nAllen Carter\nAngie McAffee\nSam Thorngren\nRye McAffee\nTodd Jensen\nRussell Cummins\nDillon Waymire\nChris Peterson\nBryson Gunter\nBrian Higgenson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	weight	grade\n	1	Cooper Williams	QB, DB	6-3	160	10\n	2	Mccoy Jensen	WR, MLB	6-1	170	11\n	3	Keaton Archibald	QB, DB	5-8	150	11\n	4	Charles Bragg	OL, DL	5-7	165	12\n	5	Tripp Bowhay	TE, LB	5-8	165	9\n	7	Jose Arriaga	TE, DE	6-0	150	10\n	8	Stetson Wanstrom	QB, DB	5-9	160	11\n	9	Koden Krosch	ATH, DB	6-1	175	12\n	10	Rawson Twitchell	RB, LB	5-11	200	12\n	11	Braxtyn Parsons	WR, DB	6-0	170	11\n	12	Isaac Andersen	WR, DB	5-9	160	11\n	13	Eli Andersen	WR, DB	5-2	120	9\n	14	Bracken Powell	OL, DE	6-0	210	11\n	15	Wade Dailey	TE, DL	6-2	165	10\n	17	Lawrence Hawley	RB, DE	5-11	165	12\n	18	Levi Hendriks	TE, DB	5-10	180	12\n	21	Ethan Bogart	RB, LB	5-6	165	9\n	22	Razor Duke	RB, LB	6-1	180	12\n	24	Braxten Hymas	OL, DL	5-11	185	11\n	28	Weston Hendriks	WR, CB	5-8	150	9\n	29	Logan Ellsworth	RB, FS	5-9	130	9\n	30	Alex Stone	G, DE	6-2	250	11\n	34	Randy Andersen	WR, FS	5-9	145	10\n	42	Mason Reynolds	WR, CB	5-11	140	10\n	44	Bridger Livesay	TE, LB	6-1	170	11\n	45	Garrett Waymire	OL, DL	6-0	230	10\n	53	Jason Hooks	OL, DL	5-11	170	9\n	56	Treyson Gamett	WR, DB	5-8	140	11\n	57	Brodie Reynolds	OL, DL	6-0	230	10\n	72	Harrison Wolfe	G, NG	6-1	250	9\n	74	Kayson Parsons	OL, DL	5-10	240	11\n	80	Teagan Babcock	RB, LB	5-11	175	10\n	88	Taine Hollist	OL, DL	5-10	205	10\n\n---------------------------------------------------------\nRECORD\n\n7	1\n\n36	Logos	24\n40	Valley	22\n40	Carey	20\n67	Murtaugh	16\n83	Challis	6\n57	Raft River	14\n30	Hagerman	14\n48	Grace	22\n\n---------------------------------------------------------\nSHIRTS\n\nAngie McAffee\nButte County High School\n2A\nFootball\n\nM: 7\nL: 19\nXL: 6\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.197\nID: 7215fb83-1b12-41dd-84f7-43aff324697d\n', 'ButteCoFB.txt', '2024-11-19 11:39:04'),
(151, 114, 3, 'Jon Hallock', 'From: Jon Hallock\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCaldwell High School\nCougars\nBlue, White & Gold\nShalene French\nAnita Wilson\nJon Hallock\nLance Morris\n\n---------------------------------------------------------\nSHIRTS\n\nJon Hallock\nCaldwell High School\n6A\nDrama\n\nM: 5\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.35.163\nID: 04fdaa8e-7c71-4447-8975-4cdb419d59b0\n', 'roster (97).txt', '2024-11-20 10:21:16'),
(152, 115, 3, 'Luke Wolf', 'From: Luke Wolf\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nKuna High School\nKavemen\nBlack & Vegas Gold\nKim Bekkedahl\nRobbie Reno\nLuke Wolf\nBrett Eshelman\n\n---------------------------------------------------------\nSHIRTS\n\nLuke Wolf\nKuna High School\n6A\nDrama\n\nS: 3\nM: 2\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.80\nID: 219515c0-3011-4d62-bf24-c02b51d487e1\n', 'roster (98).txt', '2024-11-20 10:26:35'),
(153, 116, 3, 'Kevin Beard', 'From: Kevin Beard\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nEmmett High School\nHuskies\nBlue & White\nCraig Woods\nLarry Parks\nKevin Beard\nAlex Barrett\n\n---------------------------------------------------------\nCOMMENT\n\n18 Total State Qualifiers. \n\n---------------------------------------------------------\nSHIRTS\n\nKevin Beard\nEmmett High School\n5A\nDrama\n\nS: 5\nM: 8\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.119.170\nID: c21c28cd-d0fd-431d-b57e-09daf7b0136c\n', 'roster (99).txt', '2024-11-21 09:53:55'),
(154, 117, 3, 'John Hartz', 'From: John Hartz\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nRidgevue High School\nWarhawks\nOrange, Black, White & Gray\nLisa Boyd\nRobert Gwyn\nJohn Hartz\nTim Pakutka\n\n---------------------------------------------------------\nSHIRTS\n\nJohn Hartz\nRidgevue High School\n6A\nDrama\n\nS: 1\nM: 7\nL: 9\nXL: 2\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.148\nID: 2243ad71-899e-414c-8b6e-b251177a85d0\n', 'roster - 2024-11-22T203841.917', '2024-11-22 20:39:24'),
(155, 118, 3, 'Tyler Johnson', 'From: Tyler Johnson\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nBonneville High School\nBees\nGreen, Gold & White\nScott Woolstenhulme\nJustin Jolley\nTyler Johnson\nShaun Nichols\n\n---------------------------------------------------------\nSHIRTS\n\nTyler Johnson\nBonneville High School\n5A\nDrama\n\nM: 5\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 172.70.210.147\nID: d173cf1c-130c-4b1f-b753-bcf0f746c3b6\n', 'roster - 2024-11-22T203827.961', '2024-11-22 20:39:24'),
(156, 119, 3, 'Dane Pence', 'From: Dane Pence\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nMountain View High School\nMavericks\nBlue, Green & White\nDerek Bub\nScot Montoya\nDane Pence\nCamilla Boylan\n\n---------------------------------------------------------\nSHIRTS\n\nDane Pence\nMountain View High School\n6A\nDrama\n\nS: 2\nM: 7\nL: 9\nXL: 3\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 7eba9a6b-179b-49f4-acda-1639d0de9309\n', 'roster - 2024-11-22T203820.298', '2024-11-22 20:39:24'),
(157, 120, 3, 'Troy Rice', 'From: Troy Rice\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nErin Davidson\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nDrama\n\nS: 4\nM: 16\nL: 10\nXL: 1\n2XL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.135\nID: 65df59c5-dd60-4882-877c-e38bdd09b11e\n', 'roster (100).txt', '2024-11-22 20:39:24'),
(158, 121, 3, 'Norma Alley', 'From: Norma Alley\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene High School\nVikings\nRoyal & White\nShon Hocker\nMike Randles\nVictoria Beecher\nJared Helm\n\n---------------------------------------------------------\nSHIRTS\n\nNorma Alley\nCoeur d\'Alene High School\n6A\nDrama\n\nS: 1\nM: 10\nL: 14\nXL: 9\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.113\nID: 24959bbe-492a-4fe9-9f2f-513ab09e1a4d\n', 'roster - 2024-11-25T090459.556', '2024-11-25 09:07:46'),
(159, 122, 3, 'Douglas Henderson', 'From: Douglas Henderson\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nLewiston High School\nBengals\nPurple & Gold\nLance Hansen\nKevin Driskill\nDoug Henderson\nMelissa Syverson\n\n---------------------------------------------------------\nSHIRTS\n\nDouglas Henderson\nLewiston High School\n5A\nDrama\n\nM: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.18\nID: 446220c6-fa91-41bf-ae17-abab3f1f2534\n', 'roster - 2024-11-25T170741.025', '2024-11-25 17:08:35'),
(160, 123, 3, 'Ty Shippen', 'From: Ty Shippen\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nJesse Arnold\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nDrama\n\nS: 4\nM: 12\nL: 5\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.225.114\nID: 5f4ee652-255e-4e9a-93ff-ee33001c3b9c\n', 'roster - 2024-11-25T170732.551', '2024-11-25 17:08:35'),
(161, 124, 3, 'Matt Neff', 'From: Matt Neff\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nLakeland High School\nHawks\nGreen & Gold\nLisa Arnold\nJimmy Hoffman\nMatt Neff\nAllison Knoll\n\n---------------------------------------------------------\nSHIRTS\n\nMatt Neff\nLakeland High School\n5A\nDrama\n\nS: 3\nM: 4\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.102\nID: afaf934d-2d8b-4c68-861d-305e65b6cfb5\n', 'roster - 2024-11-26T100858.491', '2024-11-26 10:09:16'),
(162, 125, 3, 'Brandon Jackson', 'From: Brandon Jackson\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nAmerican Falls High School\nBeavers\nRed, White & Black\nRandy Jensen\nTravis Hansen\nBrandon Jackson\nDaniel Lammers\n\n---------------------------------------------------------\nSHIRTS\n\nBrandon Jackson\nAmerican Falls High School\n4A\nDrama\n\nM: 4\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.151.13\nID: 4a6cca1b-02ae-4349-8dfb-ea2075db974f\n', 'roster - 2024-11-26T100851.720', '2024-11-26 10:09:16'),
(163, 126, 3, 'Tim Chapman', 'From: Tim Chapman\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nShoshone High School\nIndians\nScarlet & Gray\nRob Waite\nKelly Chapman\nTim Chapman\nJulie Nordstom\n\n---------------------------------------------------------\nSHIRTS\n\nTim Chapman\nShoshone High School\n2A\nDrama\n\nS: 1\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.146.109\nID: 1df720ce-4338-493e-9e38-cc3359767a1c\n', 'roster - 2024-11-26T100846.227', '2024-11-26 10:09:16');
INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(164, 127, 3, 'Scott Burton', 'From: Scott Burton\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nJerome High School\nTigers\nBlack & Orange\nBrent Johnson\nNathan Tracy\nScott Burton\nSharmy Steele\n\n---------------------------------------------------------\nSHIRTS\n\nScott Burton\nJerome High School\n5A\nDrama\n\nS: 9\nM: 3\nL: 4\nXL: 2\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.3.14\nID: 811811c0-a65b-447f-b6b6-9000f2987b2a\n', 'roster (101).txt', '2024-12-01 11:25:04'),
(165, 128, 3, 'Rebecca Kosinski', 'From: Rebecca Kosinski\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nOrofino High School\nManiacs\nRoyal & White\nJason Hunter\nRebecca Kosinski\nRebecca Kosinski\nKathleen Tetwiler\n\n---------------------------------------------------------\nSHIRTS\n\nRebecca Kosinski\nOrofino High School\n3A\nDrama\n\nS: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.216.71\nID: ca00fc4a-342c-43f3-a001-3c526041fc34\n', 'roster - 2024-12-01T141236.074', '2024-12-01 14:12:51'),
(166, 129, 3, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nShawn Ruth\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nDrama\n\nS: 1\nM: 8\nL: 4\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.103\nID: 2d89a10a-9d21-4710-97a0-0eb7ee854709\n', 'roster - 2024-12-01T141437.480', '2024-12-01 14:14:57'),
(167, 130, 3, 'Jessica Muraski', 'From: Jessica Muraski\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nMountain Home High School\nTigers\nOrange & Black\nJames Gilbert\nSam Gunderson\nJessica Muraski\nTaunya Page\n\n---------------------------------------------------------\nSHIRTS\n\nJessica Muraski\nMountain Home High School\n5A\nDrama\n\nS: 2\nM: 9\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.90.240\nID: 6f325086-e183-4bb6-a94a-87dac5a78b0e\n', 'roster - 2024-12-01T141428.807', '2024-12-01 14:14:57'),
(168, 131, 3, 'Kevin Stilling', 'From: Kevin Stilling\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nWood River High School\nWolverines\nGreen & White\nJim Foudy\nJulia Grafft\nKevin Stilling\nKarl Nordstrom\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Stilling\nWood River High School\n5A\nDrama\n\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.34.65\nID: ab66a435-dde6-4120-bbf2-0ca7304690a6\n', 'roster - 2024-12-01T213126.459', '2024-12-01 21:31:39'),
(169, 132, 3, 'Josh Wells', 'From: Josh Wells\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nShelley High School\nRussets\nRed, Black & White\nDoug McLaren\nBurke Davis\nJosh Wells\nSarah Hartwig\n\n---------------------------------------------------------\nSHIRTS\n\nJosh Wells\nShelley High School\n5A\nDrama\n\nS: 7\nM: 8\nL: 4\nXL: 1\n3XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.2\nID: 00cb586c-6351-4ea6-8e52-db807bdc156a\n', 'roster - 2024-12-02T110224.867', '2024-12-02 11:03:55'),
(170, 133, 3, 'Rachael Petersen', 'From: Rachael Petersen\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nLake City High School\nTimberwolves\nNavy, Teal & Silver\nShon Hocker\nDeanne Clifford\nTroy Anderson\nDan Bell\n\n---------------------------------------------------------\nCOMMENT\n\nWe will be ordering one extra small separately for our alternate\n\n---------------------------------------------------------\nSHIRTS\n\nRachael Petersen\nLake City High School\n6A\nDrama\n\nS: 1\nM: 4\nL: 4\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.102\nID: 87837da1-7413-40f3-ac3b-7fd862105928\n', 'roster - 2024-12-02T110212.396', '2024-12-02 11:03:55'),
(171, 134, 3, 'Ted Bell', 'From: Ted Bell\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nHighland High School - Pocatello\nRams\nBlack, White & Red\nDoug Howell\nBrad Wallace\nTravis Bell\nAlix Van Noy\n\n---------------------------------------------------------\nSHIRTS\n\nTed Bell\nHighland High School - Pocatello\n6A\nDrama\n\nS: 4\nM: 17\nL: 9\nXL: 6\n2XL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.212\nID: c306f21e-e169-4e18-abb7-0dd4531cdce1\n', 'roster - 2024-12-02T110157.812', '2024-12-02 11:03:55'),
(172, 135, 3, 'Jason Willer', 'From: Jason Willer\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCapital High School\nEagles\nBlack, Gold & Silver\nLisa Roberts\nDerek Gardner\nJason Willer\nTracy Fuller\n\n---------------------------------------------------------\nSHIRTS\n\nJason Willer\nCapital High School\n6A\nDrama\n\nM: 3\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.101\nID: d66d172a-855b-4fb2-833a-c5685897e414\n', 'roster - 2024-12-02T110145.209', '2024-12-02 11:03:55'),
(173, 136, 3, 'Craig Christensen', 'From: Craig Christensen\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nPost Falls High School\nTrojans\nOrange & Black\nDena Naccarato\nChris Sensel\nCraig Christensen\nJared McDougall\n\n---------------------------------------------------------\nSHIRTS\n\nCraig Christensen\nPost Falls High School\n6A\nDrama\n\nM: 3\nL: 2\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.147.186\nID: 8015aa54-e151-4d27-89d0-41b634adc03d\n', 'roster - 2024-12-02T110133.656', '2024-12-02 11:03:55'),
(174, 137, 3, 'Ryan Williams', 'From: Ryan Williams\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nGarden Valley High School\nWolverines\nPurple & Gold\nHannah Spafford\nAlison Barber\nRyan Wiliams\nKea Loveland\n\n---------------------------------------------------------\nSHIRTS\n\nRyan Williams\nGarden Valley High School\n1A\nDrama\n\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.56\nID: 5c5cd4c6-8e4f-4f0d-864f-b4efe42a37ea\n', 'roster - 2024-12-02T110110.660', '2024-12-02 11:03:55'),
(175, 138, 3, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nTracy Harrison\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nDrama\n\nS: 1\nM: 7\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.113\nID: 1eb08a0b-f5f2-4336-a315-25a1c5e89123\n', 'roster - 2024-12-02T110056.764', '2024-12-02 11:03:55'),
(176, 139, 3, 'Tol Gropp', 'From: Tol Gropp\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nTimberline High School - Boise\nWolves\nBlue, Silver & Black\nLisa Roberts\nDiana Molino\nTol Gropp\nTodd King\n\n---------------------------------------------------------\nSHIRTS\n\nTol Gropp\nTimberline High School - Boise\n6A\nDrama\n\nM: 2\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.22.112\nID: 2ae90587-e04d-41e6-80b9-b9f7696a3287\n', 'roster (102).txt', '2024-12-02 11:03:55'),
(177, 140, 3, 'Aaron Lippy', 'From: Aaron Lippy\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene Charter Academy\nPanthers\nRed, White & Blue\nDaniel Nicklay\nDaniel Nicklay\nAaron Lippy\nDana Fleming\n\n---------------------------------------------------------\nSHIRTS\n\nAaron Lippy\nCoeur d\'Alene Charter Academy\n4A\nDrama\n\nS: 2\nM: 9\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.81\nID: 1a5bc661-f59c-418a-b8c3-2f908a223cb5\n', 'roster - 2024-12-03T102201.216', '2024-12-03 10:22:29'),
(178, 141, 3, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nSue Parrett\n\n---------------------------------------------------------\nCOMMENT\n\nSkyline will need to add and be billed for additional shirts.  2 Lrg, 1 XXL Hoodies, and 1 XL Crew Neck.  Will you please confirm that you recieved this additional order.  wadszair@sd91.org\r\n\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nDrama\n\nS: 3\nM: 8\nL: 3\nXL: 5\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.149\nID: 499bc194-66d6-46a8-bbc0-6322e2493c18\n', 'roster - 2024-12-03T102152.978', '2024-12-03 10:22:29'),
(179, 142, 3, 'Cody Shelley', 'From: Cody Shelley\nActivity: Debate\n\n---------------------------------------------------------\nSCHOOL\n\nBlackfoot High School\nBroncos\nKelly Green & White\nBrian Kress\nRoger Thomas\nCody Shelley\nJordan Reynolds\n\n---------------------------------------------------------\nSHIRTS\n\nCody Shelley\nBlackfoot High School\n5A\nDebate\n\nS: 4\nM: 12\nL: 10\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.5\nID: 828bcbef-9279-4541-8f50-b815551ff265\n', 'roster - 2024-12-04T102554.742', '2024-12-04 10:26:53'),
(180, 143, 3, 'Todd Cady', 'From: Todd Cady\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nColumbia High School\nWildcats\nMaroon & Gold\nGreg Russell\nCory Woolstenhulme\nTodd Cady\nGlynis Calhoun\n\n---------------------------------------------------------\nSHIRTS\n\nTodd Cady\nColumbia High School\n5A\nDrama\n\nS: 3\nM: 4\nL: 1\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.150.137\nID: b2e13926-8c85-4d71-9f1a-1a5885c063c2\n', 'roster - 2024-12-04T102545.854', '2024-12-04 10:26:53'),
(181, 144, 3, 'Jenny Wood', 'From: Jenny Wood\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nLighthouse Christian High School\nLions\nBlue & White\nDaniel Woods\nThomas Luttrell\nJenny Wood\nPaula Vander Stelt\n\n---------------------------------------------------------\nSHIRTS\n\nJenny Wood\nLighthouse Christian High School\n2A\nDrama\n\nS: 4\nM: 2\nL: 4\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.204\nID: 2c3b83bc-599b-42f6-ba3b-bf9ccff3f0b6\n', 'roster - 2024-12-04T102539.260', '2024-12-04 10:26:53'),
(182, 145, 3, 'Robert Coombs', 'From: Robert Coombs\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nSnake River High School\nPanthers\nPurple, White & Black\nMark Kress\nRay Carter\nRobert Coombs\nJana McBride\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Coombs\nSnake River High School\n4A\nDrama\n\nS: 2\nM: 3\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.176\nID: 593aadbf-0e87-4a7a-b83f-921d136fa9f4\n', 'roster - 2024-12-04T102532.969', '2024-12-04 10:26:53'),
(183, 146, 3, 'Nick Birch', 'From: Nick Birch\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nMegan Smith\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nDrama\n\nS: 3\nM: 2\nL: 5\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.142.75\nID: 1af38536-6a3e-4df3-87db-c4313eabd97d\n', 'roster - 2024-12-04T102526.439', '2024-12-04 10:26:53'),
(184, 147, 3, 'Conor Kennedy', 'From: Conor Kennedy\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nMcCall-Donnelly High School\nVandals\nRed, White & Blue\nTim Thomas\nTim Thomas\nConor Kennedy\nAudrey Swanson\n\n---------------------------------------------------------\nSHIRTS\n\nConor Kennedy\nMcCall-Donnelly High School\n4A\nDrama\n\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 108.162.245.70\nID: a5db49c4-7676-4454-ac65-04b1a34b9d41\n', 'roster - 2024-12-04T102515.384', '2024-12-04 10:26:53'),
(185, 148, 3, 'Ken Chapman', 'From: Ken Chapman\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Arts Charter School\nPhoenix\nMaroon, Black & Silver\nEd Longfield\nKen Chapman\nKen Chapman\nEric Ellis\n\n---------------------------------------------------------\nSHIRTS\n\nKen Chapman\nIdaho Arts Charter School\n3A\nDrama\n\nM: 1\nL: 1\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.41.149\nID: 1ca02018-3a9d-4ff4-b680-26493909c06e\n', 'roster - 2024-12-04T102716.449', '2024-12-04 10:27:41'),
(186, 149, 3, 'Gavin Watson', 'From: Gavin Watson\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCentennial High School\nPatriots\nMaroon & Silver\nDerek Bub\nJason Robarge\nGavin Watson\nTyler Brackhahn\n\n---------------------------------------------------------\nSHIRTS\n\nGavin Watson\nCentennial High School\n6A\nDrama\n\nS: 5\nM: 10\nL: 5\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.112\nID: 2b8b795f-203a-41de-9247-6210bde6e763\n', 'roster - 2024-12-04T103948.621', '2024-12-04 10:40:00'),
(187, 150, 3, 'Ted Reynolds', 'From: Ted Reynolds\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nCanyon Ridge High School\nRiverhawks\nCrimson & Silver\nBrady Dickinson\nRandall Miskin\nTed Reynolds\nSeve Isaacs\n\n---------------------------------------------------------\nSHIRTS\n\nTed Reynolds\nCanyon Ridge High School\n6A\nDrama\n\nS: 3\nM: 4\nL: 5\n3XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.68.23.111\nID: 9d8b0897-148b-4684-937d-d3279436dd7c\n', 'roster - 2024-12-04T132654.596', '2024-12-04 13:27:08'),
(188, 151, 3, 'Dane Roy', 'From: Dane Roy\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nJessica Hibbs\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nDrama\n\nS: 1\nM: 15\nL: 15\nXL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.158.42.18\nID: 2b318d01-abea-49ef-a4ae-d50536ba59d5\n', 'roster - 2024-12-04T140055.625', '2024-12-04 14:01:07'),
(189, 152, 3, 'Eric Bonds', 'From: Eric Bonds\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nSkyview High School\nHawks\nNavy, Silver, Light Blue & White\nGregg Russell\nDave Young\nEric Bonds\nScott Beets\n\n---------------------------------------------------------\nSHIRTS\n\nEric Bonds\nSkyview High School\n5A\nDrama\n\nS: 1\nM: 1\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 172.71.166.79\nID: 5374ca05-7319-4c91-8183-ae8e3cd5c779\n', 'roster - 2024-12-04T145523.811', '2024-12-04 14:55:39'),
(190, 153, 3, 'Shaun Walker', 'From: Shaun Walker\nActivity: Drama\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\n\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nDrama\n\nM: 10\nL: 6\nXL: 1\n\n\n\n\n---------------------------------------------------------\n\n', 'roster - Twin Falls Drama.txt', '2024-12-05 10:12:34'),
(202, 168, 2, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Golf - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nMikel Green\n\n---------------------------------------------------------\nCOMMENT\n\nAdd additional large for coach\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nGolf - Girls\n\nM: 2\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 169.197.75.240\nID: 92946104-592e-4959-8d24-fe2708dccf2c\n', 'roster (002).txt', '2025-02-14 15:10:41'),
(203, 169, 1, 'Brent Knapp', 'From: Brent Knapp\nActivity: Golf - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nPreston High School\nIndians\nBlue & White\nLance Harrison\nClint Peery\nBrent Knapp\nJohn Van Vleet\n\n---------------------------------------------------------\nSHIRTS\n\nBrent Knapp\nPreston High School\n5A\nGolf - Boys\n\nM: 2\nL: 2\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 208.98.189.205\nID: b86082c8-ed22-44fe-9cf4-96af454692ee\n', 'roster (4).txt', '2025-02-14 16:51:29'),
(204, 170, 1, 'Randy Winn', 'From: Randy Winn\nActivity: Golf - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nBurley High School\nBobcats\nGreen, Gray, Black & White\nSandra Miller\nLevi Power\nRandy Winn\nScott Draper\n\n---------------------------------------------------------\nCOMMENT\n\nIsaac Redder\n\n---------------------------------------------------------\nSHIRTS\n\nRandy Winn\nBurley High School\n5A\nGolf - Boys\n\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: 9e9a7a31-0d15-4caa-baf9-2682f2b80c4b\n', 'roster (6).txt', '2025-02-14 16:53:53'),
(205, 171, 2, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Golf - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nAly DeVries\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nGolf - Girls\n\nL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.101\nID: 48b6dd56-0888-4ca3-bdfd-add99d77a542\n', 'roster (7).txt', '2025-02-14 16:54:19'),
(206, 172, 1, 'Scott Burton', 'From: Scott Burton\nActivity: Golf - Boys\n\n---------------------------------------------------------\nSCHOOL\n\nJerome High School\nTigers\nBlack & Orange\nBrent Johnson\nNathan Tracy\nScott Burton\nMckinsey Rodriguez\n\n---------------------------------------------------------\nCOMMENT\n\nI sent an email about putting in the extras. One extra medium and one extra large. Ill pay when i get there. \n\n---------------------------------------------------------\nSHIRTS\n\nScott Burton\nJerome High School\n5A\nGolf - Boys\n\nS: 1\nM: 1\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 216.83.73.178\nID: 0e6183a3-5660-4d9f-861d-14bc415c1a4b\n', 'roster (8).txt', '2025-02-14 16:54:19'),
(207, 173, 3, 'Matt Neff', 'From: Matt Neff\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nLakeland High School\nHawks\nGreen & Gold\nLisa Arnold\nJimmy Hoffman\nMatt Neff\nCynthia Peck\nMichelle Padilla\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Tessa Bennett	10\n	Noah Best	12\n	Madeline Burk	10\n	Laina Busicchia	9\n	Avah Clark	10\n	Nora Costa	12\n	Zoie Davies	11\n	Elizabeth Duce	12\n	Marlene Edenhofer	12\n	Rylee Hall	10\n	Madelyn Kelley	9\n	Kyra Lundt	12\n	Raymond Marquez	12\n	Skylie Miller	11\n	Olivia Parker	9\n	Isabella Peterson	11\n	Lucy Salinier	12\n	Cheyenne Sardinha	9\n	Haileigh Shelton	9\n	Paige Stranahan	12\n	Annalie Terzulli	12\n	Adaira Tyler	10\n	Brittany Williams	10\n\n---------------------------------------------------------\nSHIRTS\n\nMatt Neff\nLakeland High School\n5A\nCheer\n\nS: 3\nM: 12\nL: 7\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.218.180.34\nID: 48219bb4-8293-442a-8e1e-5577ae395831\n', 'roster - 2025-02-16T052136.045', '2025-02-16 05:31:45'),
(208, 174, 3, 'Shaun Walker', 'From: Shaun Walker\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nTwin Falls High School\nBruins\nNavy, Lt Blue & White\nBrady Dickinson\nNancy Jones\nShaun Walker\nLexi Robinson\nSari Jayo\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Lauren Brown	12\n	Rees Richards	12\n	Kennedy Thompson	12\n	Kendra McCool	12\n	Elizabeth Zavala-Gonzales	12\n	Ivy Perry	11\n	Brinley Salts	11\n	Bria Kitchen	11\n	Cate Whitehead	11\n	Sunny Rose	11\n	Veda Sunkesula	11\n	Madelynn Jayo	10\n	Taislee Straubhaar	10\n	Seylor Wright	10\n	Sophie Anderson	10\n	Bella Evans	10\n	Sophia Schroeder	9\n	Hartley King	9\n	Sadie Ohlensehlen	9\n	Emilia Anderson	9\n	Peyton Durham	9\n	Ellie Whitworth	9\n	Aleah Jackson	9\n\n---------------------------------------------------------\nSHIRTS\n\nShaun Walker\nTwin Falls High School\n5A\nDance\n\nS: 2\nM: 12\nL: 9\n\n\n\n\n---------------------------------------------------------\nIP: 216.83.77.2\nID: d67cae01-a5ab-4c1f-9680-1f2c6d1f36e8\n', 'roster - 2025-02-16T052127.645', '2025-02-16 05:31:45'),
(209, 175, 3, 'Tol Gropp', 'From: Tol Gropp\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nTimberline High School - Boise\nWolves\nBlue, Silver & Black\nLisa Roberts\nDiana Molino\nTol Gropp\nJennifer Smart\nElizabeth Mallam\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Coutney Apostol	10\n	Charlotte Baker	10\n	Kinzy Barber	10\n	Annalise Berg	9\n	Kira Bills	9\n	Ellery Brewster	11\n	Lydia Drescher	10\n	Eleanor Hagans	10\n	Makena Elle	9\n	Finn Eschen	11\n	Olivia Florian	10\n	River Jensen	10\n	Dylan Keyt	11\n	Khloe Kornak	9\n	Rose Murphy	9\n	Moana Olson	11\n	Evelyn Palermo	10\n	Claire Principi	9\n	Olivia Roberts	9\n	Audrie Seamons	11\n	Sofia Smith	9\n	Barcelona Strawhun	11\n	Iliana Strawhun	9\n	Mercer Swartley	10\n	Lanie Warnock	10\n	Annalise Whitehead	9\n	Eliah White	9\n	Sophia Williams	11\n	Izabella Wright	10\n	Sophia Belsher	10\n\n---------------------------------------------------------\nSHIRTS\n\nTol Gropp\nTimberline High School - Boise\n6A\nDance\n\nS: 6\nM: 17\nL: 5\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 207.244.138.57\nID: 37d330ee-bd5f-4030-8d13-519bae093ad8\n', 'roster - 2025-02-16T052121.020', '2025-02-16 05:31:45'),
(210, 176, 3, 'Natalie Lewis', 'From: Natalie Lewis\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nAberdeen High School\nTigers\nOrange & Black\nJane Ward\nTravis Pincock\nNatalie Lewis\nTara Pratt\nAlesia Vollmer\nRyley Barclay\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Jensen King	12\n	Olivia Pratt	12\n	Maricsa Carrillo	12\n	Reegan Barclay	12\n	Anahi Cardona	12\n	Secilia Ayala	12\n	Hadley Pincock	11\n	Radley Barclay	11\n	Addie Falter	10\n	Breanna Centeno	10\n	Paislie Vollmer	9\n	Arianny Valeriano	9\n\n---------------------------------------------------------\nSHIRTS\n\nNatalie Lewis\nAberdeen High School\n3A\nCheer\n\nS: 7\nM: 3\nL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.225.191.227\nID: f38f0a31-c901-41ef-9aae-7cf8ab8362b2\n', 'roster - 2025-02-16T052112.391', '2025-02-16 05:31:45'),
(211, 177, 3, 'Shayne Proctor', 'From: Shayne Proctor\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nMadison High School\nBobcats\nRed, White & Gray\nRandy Lords\nBradee Klassen\nShayne Proctor\nLudy Navarette\nAlexis Navarette\nLydia Belnap\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Ella Jeppsen	12\n	Brinlee Hill	12\n	Hope Parkinson	11\n	Audrey Sutton	11\n	Nora Cannon	9\n	Ellie Woodward	9\n	Brinlee Lords	11\n	Sid Stoddard	12\n	Izzy Bird	12\n	Sadie Cooper	12\n	Syd Archibald	12\n	Annie Angell	11\n	Liv Hacking	11\n	Kynlee Benson	11\n	Josie Riley	11\n	KayDence Beck	10\n	Tylo Leishman	10\n	Lydia Hogg	10\n	Elli Freeman	10\n	Kennedi Nordfelt	10\n	Brylie Larsen	10\n	Eliza Fransen	9\n	Adelyn Earle	10\n	Insley Mortensen	9\n	Taylor Ricks	9\n	Reka Bedo	11\n	Kalli Kay	9\n	Della Edstrom	9\n	Addison Hebdon	9\n	Addi Baker	11\n	Elsie Marcum	12\n	Tatum Williams	12\n	Camryn Wilcox	11\n	Taylee Stock	11\n	Lexi Packard	11\n	Abrielle Valora	11\n\n---------------------------------------------------------\nSHIRTS\n\nShayne Proctor\nMadison High School\n6A\nCheer\n\nS: 7\nM: 23\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 192.225.186.74\nID: fe7e02c1-c416-4fdc-8ba8-4151388d6a00\n', 'roster - 2025-02-16T052103.689', '2025-02-16 05:31:45'),
(212, 178, 3, 'Cody Shelley', 'From: Cody Shelley\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nBlackfoot High School\nBroncos\nKelly Green & White\nBrian Kress\nRoger Thomas\nCody Shelley\nChrista Stufflebeam\nHeather Grimmett\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Maysa Baker	9\n	Avelee Barnard	10\n	Talia Beasley	11\n	Olivia Burch	12\n	Giselle Bustamante	9\n	Keyli Capson	11\n	Kynnedy Clark	9\n	Alexa Collard	12\n	Amber Deguilio	11\n	Davanie Figueroa	12\n	Alexis George	12\n	Jordyn Grimmett	11\n	Adisyn Horrocks	11\n	Tylee Hughes	12\n	McKenzie Inskeep	10\n	Sari Lilya	9\n	Ali Luna	9\n	Averie McBride	12\n	Mylee McLaughlan	9\n	Ashlyn Mortimer	9\n	Brooke Neff	12\n	Millie Pelayo	9\n	Stella Pettinger	11\n	Kaia Pope	12\n	Holly Porter	12\n	Brynlee Robison	10\n	Tessa St. John	10\n	Paisley Stephenson	9\n	Ava Stufflebeam	12\n	Halle Walker	10\n\n---------------------------------------------------------\nSHIRTS\n\nCody Shelley\nBlackfoot High School\n5A\nCheer\n\nS: 6\nM: 18\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 24.116.177.34\nID: 6bd4ce23-3614-4154-8276-dd6e2d8beff5\n', 'roster - 2025-02-16T052055.499', '2025-02-16 05:31:45'),
(213, 179, 3, 'Greg Carpenter', 'From: Greg Carpenter\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nNampa High School\nBulldogs\nRed, Blue & White\nGregg Russell\nKasey Burkholder\nGreg Carpenter\nKelli Rich\nShania Gomez\nCali Shankel\nStephanie Jackson\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Skylee Bird	\n	McKenzie Gruidl	\n	ANNABELLE LEAL	\n	ARNETT GARCIA	\n	BRAILEY BLEDSOE	\n	Brook Gunter	\n	Claire Dyer	\n	Cassie Hugo	\n	Rylon Roe	\n	Ileana Raass	\n	Mariah Villarreal	\n	Emery Farmer	\n	Emma Seable	\n	Kalli Morphey	\n	Jace Rackham	\n	Layla Wilson	\n	Brailey Bledsoe	\n	Claire Dyer	\n	Arnett Garcia	\n	Annabelle Leale	\n	Mya Watkins	\n	Madison Brown	\n	Sophie Coronado	\n	Madisyn Perez	\n	Danika Ramos	\n	Abigail Schroeder	\n	Brooklynn Shlam	\n	Brooklyn Spano	\n	Addilyn Tompkins	\n	Olivia VanKomen	\n\n---------------------------------------------------------\nSHIRTS\n\nGreg Carpenter\nNampa High School\n6A\nCheer\n\nS: 5\nM: 16\nL: 8\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 136.228.204.154\nID: f396f203-bc57-4c96-a517-adbf81be0e88\n', 'roster - 2025-02-16T052040.540', '2025-02-16 05:31:45'),
(214, 180, 3, 'Dane Roy', 'From: Dane Roy\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nMadi Haskins\nTaylor Bacon\nAllysha Ellwanger\nAllison Sherburne\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Aliana Anderson	12\n	Avery Asin	9\n	Caylee Barnes	12\n	Elizabeth Caldwell	11\n	Callie Carver	11\n	Charlotte Daggett	12\n	Ella Eaton	12\n	Gabriela Herrera	9\n	Addalyn Herrman	9\n	Brooklyn Larson	11\n	Eliza Lewis	11\n	Miley Madsen	11\n	Amaya Marshall	9\n	Adeline McGrath	11\n	Miley Middleton	9\n	Ashlynn Needs	9\n	Addisyn Olsen	9\n	Tayci Olsen	12\n	Iailey Packer	10\n	Melanie Pasko	10\n	Paislee Pew	10\n	Brynnleigh Roth	10\n	Ryelynn Shipp	12\n	McKarlee Stanford	10\n	Lily Warmerdam	11\n	Alaina Zobrist	10\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nCheer\n\nM: 21\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.160\nID: ff256f82-288b-4a69-be4c-88c78330d907\n', 'roster - 2025-02-16T052027.772', '2025-02-16 05:31:45'),
(215, 181, 3, 'Jared Hillier', 'From: Jared Hillier\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nBear Lake High School\nBears\nBlue & White\nGary Brogan\nLuke Kelsey\nJared Hillier\nJesi Earley\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	 Brielle Clark	\n	Stella Early	\n	Oaklee Morris 	\n	Daphne Porter 	\n	Alyssa Ray	\n	Brynley Shirley	\n	Addison Slivinski	\n	Ellie Smith 	\n	Emmerson Tarbet	\n	Harley Wallentine 	\n	Geri Wilkes	\n	Hayley Woolstenhulme	\n	Miya Keetch 	\n	Brinley Collins	\n	Brooklynn Leuwer	\n	Geri Wilkes 	\n	Michaela Eborn 	\n	Payten Lamm 	\n	Pyper Christophersen 	\n	Kyla Rigby	\n	Madi Michel	\n	Brooklyn Argyle 	\n	Ethan George 	\n\n---------------------------------------------------------\nSHIRTS\n\nJared Hillier\nBear Lake High School\n5A\nCheer\n\nS: 2\nM: 15\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 208.98.185.129\nID: c6738425-dc01-45d8-884a-28d589acedd0\n', 'roster - 2025-02-16T052018.932', '2025-02-16 05:31:45'),
(216, 182, 3, 'Kevin Beard', 'From: Kevin Beard\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nEmmett High School\nHuskies\nBlue & White\nCraig Woods\nLarry Parks\nKevin Beard\nGonzalo Valdez Blanco\nNicole Gough\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Brooklynn Williams	12\n	Lexi Humphries	12\n	Zyrelys Martinez	12\n	Karizma Gragg	12\n	Miley Barclay	12\n	London Palmer	12\n	Chloe Daisson	11\n	Izayah Palmer	11\n	Josh Crump	11\n	Lynden Inman	10\n	Olivia (Livy) Bettis	10\n	Lilian Waldenmyer	10\n	Lydia Cesnik	10\n	Annika Nelson	10\n	Aarlea McBride	10\n	Alyssa Want	10\n	Elizabeth Deckard	10\n	Cheyanne Griffith	10\n	Diana Ayala	10\n	Elizabeth Dinicola	10\n	Ethan Shoemaker	10\n\n---------------------------------------------------------\nSHIRTS\n\nKevin Beard\nEmmett High School\n5A\nCheer\n\nS: 4\nM: 12\nL: 3\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.111.181\nID: 942357a6-b415-4728-80d1-2abe7bd64e8f\n', 'roster - 2025-02-16T052008.974', '2025-02-16 05:31:45'),
(217, 183, 3, 'Jocelyn Hobbs', 'From: Jocelyn Hobbs\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nSugar-Salem High School\nDiggers\nBlue & White\nJared Jenks\nKarl Gehmlich\nJocelyn Hobbs\nHayli Peterson\nTerri Shirley \nKrischell Hanks \nCallie Patterson \n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Emma Norman	12\n	Megan Harris	12\n	Ella Allen	12\n	Kaybree Helm 	12\n	Emma Davis 	12\n	Ellyn Jensen	12\n	Baylee Mortensen	11\n	Journee Hanks	11\n	Tahlia Harris 	11\n	Daisy Peterson 	11\n	Gracie Blaser	10\n	Lydia Hepworth 	10\n	Barron Winegar	10\n	Evan Crapo	10\n	Bella Dye	10\n	Kamry Hales	10\n	Jaxsen Mortensen 	10\n	Addyson Stoddard	10\n	Colton Gardner	10\n	Shilowe Cook	10\n	Logan Cook	10\n	Emma Curry 	10\n	Jezley Jackson 	10\n	Zaylee Walker 	10\n	Ainsley Simper	9\n	Ariana Ricks 	9\n	Reese Hepworth 	9\n	Kaia Hemsley 	9\n	Britnee Robinson	9\n	Myra Taylor	9\n	Jaidyn Michaelson	9\n	Sophie Curtis 	9\n	Faith Blackburn	9\n	Sylvie Rumsey	9\n	Luna Machuca	9\n\n---------------------------------------------------------\nSHIRTS\n\nJocelyn Hobbs\nSugar-Salem High School\n4A\nCheer\n\nS: 13\nM: 14\nL: 7\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 96.5.130.66\nID: 9f3bce8c-4845-4d4f-b29c-f0d5941d695b\n', 'roster - 2025-02-16T052001.755', '2025-02-16 05:31:45'),
(218, 184, 3, 'Jeff Horsley', 'From: Jeff Horsley\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nSoda Springs High School\nCardinals\nRed & Black\nScott Muir\nJess McMurray\nJeff Horsley\nLacey Harris\nBrandi Carroll\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Lily Davis	12\n	Taylor Dunford	12\n	Kacie Hansen	12\n	Alivia Perkins	12\n	Ashley Dalley	11\n	Paetyn Hopkins	11\n	Macie Hansen	11\n	Elley Christensen	11\n	Chelsey Oliver	10\n	Kristin Hansen	10\n	Emerey Lakey	10\n	Kayla Obray	10\n	Penny Fullmer	10\n	Andi Carpenter	10\n	Angelina Lin	9\n	Kennedy Smith	9\n\n---------------------------------------------------------\nSHIRTS\n\nJeff Horsley\nSoda Springs High School\n3A\nCheer\n\nS: 5\nM: 11\n\n\n\n\n---------------------------------------------------------\nIP: 168.245.231.154\nID: 45eed3e9-2562-43af-94ce-12b33a0279b4\n', 'roster - 2025-02-16T051952.830', '2025-02-16 05:31:45'),
(219, 185, 3, 'Ryon Pope', 'From: Ryon Pope\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nGooding High School\nSenators\nRed & Black\nDavid Carson\nLeigh Patterson\nRyon Pope\nRachel Reed\nJami Stirewalt\nShaylynn Caswell\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Taylor Slizeski	12\n	Haley Rogers	12\n	Ariana Aguilar	9\n	Izzy Ramsey	11\n	CJ Ridley	12\n	Joe Pavkov	9\n	Ethan Anderson	12\n	Mya Rowly	11\n	Ella Sears	11\n	Breyden Bunderson	11\n	Maebri Madson	9\n	Natalee Gonzalez	10\n	Wyatt Geer	12\n	Brynna Hults	9\n	Scarlett Musillo	9\n\n---------------------------------------------------------\nSHIRTS\n\nRyon Pope\nGooding High School\n4A\nCheer\n\nS: 3\nM: 4\nL: 6\nXL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 160.3.21.42\nID: 60de977e-58cc-4d9f-bb32-95af6618c02b\n', 'roster - 2025-02-16T051944.749', '2025-02-16 05:31:45'),
(220, 186, 3, 'Travis Hobson', 'From: Travis Hobson\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nThunder Ridge High School\nTitans\nBlue, Black, Silver\nScott Woolstenhulme\nTrent Dabell\nTravis Hobson\nJessica Phippen\nAmy Stenquist\nTeagan Landon\nKendra Sutton\nKatie Astel\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Hailee Andrus	11\n	Lexie Beck	10\n	Alyssa Chambers	10\n	Jeslynn Furniss	11\n	Halle Gardner	11\n	Ashlyn Grimmer	11\n	Ariel Hill	12\n	Skyley Johnston	11\n	Ava Pelayo	10\n	Cylee Randolph	10\n	Taybree Rapp	10\n	Amber Stacey	11\n	Kalise Taylor	12\n	Naomi Beck	9\n	Ali Branson	9\n	Vanya De Los Santos	10\n	Kayleigh Farrell	9\n	Jemma Feil	9\n	Marley Grimmer	9\n	Hope Harris	10\n	Eden Hill	9\n	Chloe Jackson	9\n	Ava Lords	9\n	Ashley Mouton	9\n	Tessa Murdock	9\n	Blaikly Peterson	9\n	Sydney Potter	9\n	Lacey Price	9\n	Kinzy Sautter	9\n	Paige Christensen	9\n	LaRee Hanson	11\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Hobson\nThunder Ridge High School\n6A\nCheer\n\nS: 4\nM: 27\n\n\n\n\n---------------------------------------------------------\nIP: 192.42.147.78\nID: be576c9b-a62a-43c3-b1ab-7bbe23331dd1\n', 'roster - 2025-02-16T051932.249', '2025-02-16 05:31:45'),
(221, 187, 3, 'Todd Cady', 'From: Todd Cady\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nColumbia High School\nWildcats\nMaroon & Gold\nGreg Russell\nCory Woolstenhulme\nTodd Cady\nJacci Markham\nAndrea Williams-Rhodes\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Elyscia Rios	12\n	Sophia Kirkman	12\n	Adelynn Wall	12\n	Suzy Keller	12\n	Katie Wyne	12\n	Mia Barrios	12\n	Alexis Poole	12\n	Annalee Austin	12\n	Jenny Skeen	12\n	Averi Barrett	11\n	Abbigail Villascan	11\n	Abby Davis	11\n	Jo Sundquist	11\n	Reagan Brooks	10\n	Amayah Flores	10\n	Bella Stimpson	10\n	Deangelo Muro	10\n	Emersyn Wall	10\n	Jaidyn Davis	10\n	Joslyn Maurer	10\n	Roxy Cleverly	10\n	Alyssa Magley	9\n	Anamarie Bohlin	9\n	Brielle Suldan	9\n	Evala Tuckett	9\n	Gracee Yarbrough	9\n	Kyla Malson	9\n	Mayan Nelson	9\n	Noah Flores	9\n	Olivia Joyner	9\n	SImone Brown	9\n	Emma Vicek	9\n\n---------------------------------------------------------\nSHIRTS\n\nTodd Cady\nColumbia High School\n5A\nDance\n\nS: 1\nM: 25\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 104.225.183.7\nID: 1b220b25-8098-4331-803b-75421aa0b639\n', 'roster - 2025-02-16T051924.179', '2025-02-16 05:31:45'),
(222, 188, 3, 'Brodie Parrott', 'From: Brodie Parrott\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nFiler High School\nWildcats\nRed, White & Navy\nKelli Schroeder\nShane Hild\nBrodie Parrott\nJade White\nJosie Sackett \n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Abbie Pemberton 	11\n	Adalyia Lekey	12\n	Shiloh Hills	10\n	Caysha Whitaker	10\n	Jimena Alverez 	10\n	Berta Albeta 	11\n	Olivia Sutherland	10\n	Bevyn Pemberton	9\n\n---------------------------------------------------------\nSHIRTS\n\nBrodie Parrott\nFiler High School\n4A\nCheer\n\nS: 1\nM: 6\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 66.232.70.36\nID: da13792d-b579-4d59-863d-b0b12045247c\n', 'roster - 2025-02-16T051904.805', '2025-02-16 05:31:45'),
(223, 189, 3, 'John Hartz', 'From: John Hartz\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nRidgevue High School\nWarhawks\nOrange, Black, White & Gray\nLisa Boyd\nRobert Gwyn\nJohn Hartz\nMaggie Robertson\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Kramer, Kaylie	\n	Nihart, Payton	\n	Tierney, Mirari	\n	Haustveit, Emily	\n	Poulsen, Aubry	\n	Waggoner, Lauren	\n	Oswald, Reese	\n	Haustveit, Allison	\n	Olvera, Eliana	\n\n---------------------------------------------------------\nSHIRTS\n\nJohn Hartz\nRidgevue High School\n6A\nDance\n\nM: 7\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.27\nID: bfe39155-6423-4eda-938f-a8a28634de0d\n', 'roster - 2025-02-16T051831.264', '2025-02-16 05:31:45'),
(224, 190, 3, 'Jim Lasso', 'From: Jim Lasso\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nHansen High School\nHuskies\nGreen & White\nAngie Lakey-Campbell\nStaci Carter\nJim Lasso\nCrystal Vega\nMickenlie Hurst\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Maggie Stover	12\n	Liz Ambriz	12\n	Aspyn York	11\n	Yuki Orozco	11\n	Myla Fredericksen	10\n\n---------------------------------------------------------\nSHIRTS\n\nJim Lasso\nHansen High School\n1A\nCheer\n\nM: 3\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.109.81\nID: fe6a2e84-40e5-449e-bfaa-2c78e997abee\n', 'roster - 2025-02-16T051824.660', '2025-02-16 05:42:31'),
(225, 191, 3, 'Troy Rice', 'From: Troy Rice\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nAli Marsden\nDakota Martinez\nErin Swearhart\nMorgan Hansen\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Ashley Able	11\n	Chloe Ayers	12\n	Jordyn Birk	12\n	Natalie Bishop	9\n	Ava Carlson	12\n	Morgan Carlson	12\n	Josette Dalby	9\n	Mya Daniel	11\n	Ashlyn Everhart	11\n	Hailey McDaniel	10\n	Addilyn Owens	9\n	Maci Robbins	10\n	Lauren Scheibel	11\n	Sophia Warren	10\n	Iris Worrell	10\n	Alexandra Wright	12\n	Makenna Zimmer	11\n	Hailey Mejia	11\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nCheer\n\nM: 8\nL: 10\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.114\nID: 015bb488-0f18-4964-b088-48b2ee17a75f\n', 'roster - 2025-02-16T051816.804', '2025-02-16 05:42:31'),
(226, 192, 3, 'Troy Rice', 'From: Troy Rice\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nRocky Mountain High School\nGrizzlies\nPurple, Black & White\nDerek Bub\nDan Lunt\nTroy Rice\nKacy Banks\nJulia Moore\nMaddie Hesse\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Cambrie Ahl	9\n	Ava Allen	11\n	Hadley Andrus	10\n	Haylee Bird	11\n	Brionni Briggs	10\n	Ariana Brundage	12\n	Lily Clark	10\n	Savannah Clark	9\n	Tessa Dunlop	12\n	Callie Fineman	10\n	Claire Foss	11\n	Mylee Goto	11\n	Karina Hoeger	9\n	Sophia Hooghkirk	9\n	Samantha Jenne	9\n	Hailee Lunt	11\n	Presley Moody	10\n	Capri Payne	10\n	Laura Proudfoot	10\n	Mackayla Sheibley	12\n	Lucy Stone	9\n	Gwynn Thompson	10\n	Madisyn Walker	9\n	Spring Woods	9\n	Makayla Young	9\n\n---------------------------------------------------------\nSHIRTS\n\nTroy Rice\nRocky Mountain High School\n6A\nDance\n\nS: 1\nM: 6\nL: 17\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.114\nID: 1ebc912b-5a6f-4c30-9b4b-c9863d31bbaf\n', 'roster - 2025-02-16T051720.003', '2025-02-16 05:42:31'),
(227, 193, 3, 'Greg Carpenter', 'From: Greg Carpenter\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nNampa High School\nBulldogs\nRed, Blue & White\nGregg Russell\nKasey Burkholder\nGreg Carpenter\nStephanie Higgins\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Autumn Jones	\n	Paige Kish	\n	Skyla Parrish	\n	Amanda Shlam	\n	Jaycee Blaser	\n	Luna Haensch	\n	Rylee Northrop	\n	Paige Rayborn	\n	Anna Rowley	\n	Jessica Stradley	\n	Kennedy Wohlfeiler	\n	Ana Aguiar Osorio	\n	Sophie Anderson	\n	Lexine Lopez	\n	Madelyn Nilsson	\n	Addison Baker	\n	Audrey Crookham	\n	Mabella Kelley	\n\n---------------------------------------------------------\nSHIRTS\n\nGreg Carpenter\nNampa High School\n6A\nDance\n\nS: 7\nM: 8\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.225.183.3\nID: fbd19204-6a2e-4d7e-b2a7-a2259eeaea0a\n', 'roster - 2025-02-16T051502.285', '2025-02-16 05:42:31'),
(228, 194, 3, 'Rikki Tolmie', 'From: Rikki Tolmie\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nParma High School\nPanthers\nBlack, White & Red\nDale Layne\nMonique Jensen\nRikki Tolmie\nKiersten Hooten\nDestra Anzaldua \n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Jennifer Arteaga 	11\n	Kinzie Keele	12\n	Kora Ormsby	10\n	Beatriz Orozco	10\n	Ni\'Elly Pena 	12\n	Juelia Pool	11\n	Megan Rogers 	12\n	Ayla Salvesen	9\n	TaylorAnn Salvesen	12\n	Payzlei Serpa 	10\n	Jennavieve Stanley 	11\n\n---------------------------------------------------------\nCOMMENT\n\nWe will need to order two coaches sweatshirts size M, thank you. \n\n---------------------------------------------------------\nSHIRTS\n\nRikki Tolmie\nParma High School\n3A\nCheer\n\nS: 5\nM: 6\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.138\nID: b23b8004-078d-4431-a498-70b6245239d2\n', 'roster - 2025-02-16T051450.472', '2025-02-16 05:42:31'),
(229, 195, 3, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nFrancesca Murphy\nMcCall Godfrey\nAnna Ordaz\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Olivia Baker	9\n	Paige Brown	11\n	Adelie Cook	11\n	Bridget Cox	12\n	Elexa Cunningham	12\n	Grace Gerbitz	12\n	McKenley Gupton	10\n	Faith Hayes	11\n	Kennedy Hilde	12\n	Maggie Hume	11\n	Sloane Leija	10\n	Lexie McCarroll	12\n	Grace McFadyen	12\n	Abbey Nadler	12\n	Ava Nicholson	11\n	Addisan Petrilli	12\n	Morgan Rich	10\n	Ava Ruoff	12\n	Lilly Somerville	12\n	Sophia Suydam	9\n	Vienna Swanson	10\n	Kayla Ward	11\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nCheer\n\nS: 18\nM: 3\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.101\nID: f9627c13-acd5-4c6f-bf0a-51bef7bc2c66\n', 'roster - 2025-02-16T051442.260', '2025-02-16 05:42:31'),
(230, 196, 3, 'Brandon Jackson', 'From: Brandon Jackson\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nAmerican Falls High School\nBeavers\nRed, White & Black\nRandy Jensen\nTravis Hansen\nBrandon Jackson\nHailey Giesbrecht\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Sheyla Alvarez	9\n	Pixie Castorena	9\n	Ali Clinger	9\n	Hadyn Colucci	9\n	Addison Gugelman	9\n	Marisa Huse	9\n	Maycee Mortensen	9\n	Melyssa Orozco	9\n	Thorne Rose	9\n	Zoe Smith	9\n	Arianna Soltero	9\n	Bryn Adair	10\n	Payton Andersen	10\n	Payzlee Castorena	10\n	Ryan Crump	10\n	Devanhi Flores	10\n	Italie Giesbrecht	10\n	Shayla Hall	10\n	Khloie Hess	10\n	Brylee Hodgkiss	10\n	Kenzie Hunt	10\n	Kaylee Neibaur	10\n	Kabree Tarbet	10\n	Landon Bowen 	11\n	Ella Colucci	11\n	Elizabeth Hernandez	11\n	Sheyla Alvarez	12\n	Gabrielle Balowitsch	12\n	Adrian Carvajal	12\n	Macyee Garza	12\n	Gavin Neibaur	12\n	Benson Taylor	12\n	Bridger Warth	12\n	Ariel Barragan	10\n	Lizbeth Medel	10\n\n---------------------------------------------------------\nSHIRTS\n\nBrandon Jackson\nAmerican Falls High School\n4A\nCheer\n\nS: 19\nM: 9\nL: 4\nXL: 2\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.218.180.122\nID: 6e6eb5ab-b9b7-4e39-b185-5e0af7e80959\n', 'roster - 2025-02-16T051435.584', '2025-02-16 05:42:31'),
(231, 197, 3, 'Zach Dong', 'From: Zach Dong\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nKimberly High School\nBulldogs\nRed, Black & White\nLuke Schroeder\nDarin Gonzales\nZach Dong\nAmanda Plew\nKaci Deuel\nCaitlin Ward\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Kailee Abramowski	10\n	Jaci Cowger	12\n	Kelsie Dawson	10\n	Holly Erickson	11\n	Elisabeth Erickson	9\n	Katie Gearheart 	9\n	Reagan Gray	12\n	Maiya Greenhalgh	10\n	Vyvian Heidemann	9\n	Ainsley Jaques	9\n	Kate Lewis	11\n	Jazzminn Lierman	11\n	Haylie Moore	9\n	Maddie Morgensen	12\n	Maizee Olsen	11\n	Bentley Peterson	9\n	Ella Peterson	11\n	Leesa Phillips	9\n	Tarissa Plew	12\n	Abby Shepherd	9\n	Ericha Sorensen	11\n	Briley Stanger	11\n	Presley Stanger	12\n	Andie Stewart	12\n	Trinity Tennant	9\n	Juli Tilton	10\n	Madi Trappen	11\n	Dakota Wayment	11\n	Lucy Williams	12\n	Piper Young	9\n\n---------------------------------------------------------\nSHIRTS\n\nZach Dong\nKimberly High School\n4A\nCheer\n\nM: 22\nL: 7\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.172\nID: abaf204b-1133-4fd6-b776-86b3ba9a9119\n', 'roster - 2025-02-16T051427.764', '2025-02-16 05:42:31'),
(232, 198, 3, 'Dane Roy', 'From: Dane Roy\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nKristine Dalmas\nTori Gee\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Taylor Andreason	12\n	Carson Borst	11\n	Kennedy Cromar	10\n	Bella Goggins	10\n	Savanna Hanchett	11\n	Presley Harwood	11\n	Emery Haws	11\n	Madyson Jarvis-Pearman	12\n	Abigail Kalkman	9\n	Emma Klipfel	11\n	Hanna Later	11\n	Isabella Magdalany	12\n	Hadley McClure	10\n	Audrey McGregor	9\n	Rylynn McKean	9\n	Taylor Pabst	10\n	Ella Peil	9\n	Caroline Stokoe	10\n	Baylee Stoneberg	9\n	Stella Swallow	12\n	Evely Telford	10\n	Aurelia Vazquez	11\n	Hadley Wilson	9\n	Azure Young	11\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nDance\n\nS: 1\nM: 6\nL: 17\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.160\nID: e0dad4a5-c272-4a56-9c5d-4d33754af51f\n', 'roster - 2025-02-16T051421.428', '2025-02-16 05:42:31'),
(233, 199, 3, 'Eric Bonds', 'From: Eric Bonds\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nSkyview High School\nHawks\nNavy, Silver, Light Blue & White\nGregg Russell\nDave Young\nEric Bonds\nAnnie Calhoun\nLisa Cowman\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Jillian Badger	10\n	Charlee Brittell	10\n	Maddy Cantrell	11\n	Jayden Fuhriman	10\n	Makayla Gardner	12\n	Madison Graham	12\n	Vanessa Green	11\n	Faith Hill	9\n	Ava Huskey	10\n	Breanna Kershner	11\n	Wendi Kershner	9\n	Kinley Klassen	10\n	Bailey Koyle	10\n	Kassidy Koyle	12\n	Rowynn Lauer	11\n	Kaydence Long	10\n	Natalie Mecham	10\n	Amberlie Metcalf	10\n	Ali Pancheri	10\n	BrekLynn Pancheri	12\n	Paisli Pancheri	10\n	Keeley Roberts	11\n	Maicyn Robinson	12\n	Ellie Strothman	10\n	Amaya Thiel	11\n	Samantha Wangler	9\n	Gabby Wightman	11\n\n---------------------------------------------------------\nSHIRTS\n\nEric Bonds\nSkyview High School\n5A\nDance\n\nS: 4\nM: 23\n\n\n\n\n---------------------------------------------------------\nIP: 136.228.203.96\nID: 97474664-8028-4314-a19b-bf29e6207a63\n', 'roster - 2025-02-16T051410.684', '2025-02-16 05:42:31');
INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(234, 200, 3, 'Vince Mann', 'From: Vince Mann\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nBorah High School\nLions\nGreen & Gold\nLisa Roberts\nTim Standlee\nVince Mann\nBrittany Zeigler\nAlyssa Zeigler\nSofia Minich\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Adelynn Hassett	12\n	Alicia (Irma) Garcia	12\n	Amelia Koltonski	9\n	Anabella Shelton	11\n	Annalise Whigam	12\n	Charlotte Bolin	10\n	Chloe Fronk	11\n	Ella Howard	12\n	Ellie Journee	11\n	Hannah Crawford	12\n	Jacobi Bach	11\n	Josiah Crawford	10\n	Jovani Lopez	10\n	Lilah Kniesner	10\n	Lilah Moore	11\n	Lilian Joyocan	11\n	Liliauna Bradford	10\n	Lindynn Smith	12\n	Normandie Pfleger	10\n	Ramona Luque	10\n	Sadie Stafford	10\n	Sierra Anderson	12\n	Stella Cromwell	10\n	Stella Fletcher	12\n\n---------------------------------------------------------\nCOMMENT\n\nthank you!\n\n---------------------------------------------------------\nSHIRTS\n\nVince Mann\nBorah High School\n6A\nDance\n\nS: 5\nM: 12\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 207.244.138.11\nID: 9d54309f-12f6-4d61-8fe5-80415a023d2d\n', 'roster - 2025-02-16T051304.794', '2025-02-16 05:42:31'),
(235, 201, 3, 'Robert Coombs', 'From: Robert Coombs\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nSnake River High School\nPanthers\nPurple, White & Black\nMark Kress\nRay Carter\nRobert Coombs\nAmanda Scherbinske\nKeyLee Hone\nAmy Watt\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Gracie Scherbinske	\n	Ivy Daniels	\n	Brooklyn Morgan	\n	Mylie Adams	\n	Macie Caldwell	\n	Raegan Gardner	\n	Andrea Garza	\n	Katelyn Leavitt	\n	Claire Hunter	\n	Amaya Reyes	\n	Alesey Luong	\n	Madi Martinez	\n	Emily Monk	\n	Taylor Parks	\n	Kwincee Turpin	\n	Taylee Ramirez	\n	Juliette Tew	\n	Olivia Watt	\n	Jacey Mitchell	\n	Cara Adams	\n	Haylie Dotson	\n	Haylie Swallow	\n	Izzy VanOrden	\n	Annie Thompson	\n	Oaklee Turpin	\n	Veronica Galaviz	\n	Hanna Pagan	\n	Sophie Ward	\n	Sophia Weathers	\n	Maylie Butt	\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Coombs\nSnake River High School\n4A\nCheer\n\nS: 1\nM: 23\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.111.114\nID: 791dd4ca-1458-4fa4-98d8-d6c7a12a8584\n', 'roster - 2025-02-16T051253.368', '2025-02-16 05:42:32'),
(236, 202, 3, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nChristina Shell\nJillia Romano\nDelaney Schow\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Savi Anderson	9\n	Mailee Brown	9\n	Brielle Dahlgren	11\n	Bria Davis	11\n	Kayla Diaz	9\n	Peyton Douglas	10\n	Veronica Eliason	11\n	Samantha Gorman	12\n	Meredith Judge	11\n	Anna Martindale	10\n	Ellie McDonough	12\n	Macee Munson	9\n	Brooke Norris	10\n	Clara Paventy	11\n	Brooklyn Price	9\n	Sydnee Seeley	12\n	Alexa Shannahan	11\n	Abigail Shipp	11\n	Addyson Simpson	9\n	Hailee Simpson	11\n	Birklie Smith	10\n	Daisy Weightman	9\n	Payten Wolf	11\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nDance\n\nS: 4\nM: 18\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.101\nID: 93780b15-ba10-4d2a-ae5c-e122221379a5\n', 'roster - 2025-02-16T051259.322', '2025-02-16 05:42:32'),
(237, 203, 3, 'Bowe von Brethorst', 'From: Bowe von Brethorst\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nWeiser High School\nWolverines\nRed & White\nDave Kerby\nDrew Dickerson\nBowe vonBrethorst\nNicole Ramirez\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Angie Brown	12\n	Sophia Funkhouser	10\n	Melanie Chavez	12\n	Ashley Ortiz	9\n	Athzin Lazaro Roman	11\n	Atiya Perez	11\n	Bree Gomez	12\n	Cambria Maldonado	11\n	Kendal Nicholson	11\n	Natasha Sierra	11\n	Aylein Alva	9\n	Kynlee Sylvia	9\n	Tatem Clary	12\n	Pearl Kaewta	12\n	Isabela Lopez	12\n	Bella Federline	11\n	Doreli Villalobos	10\n	Kaleigh Frazier	10\n	McKenzie Ortiz	9\n	Olivia Ramirez	9\n	Presley Martin	12\n	Via Magana	11\n\n---------------------------------------------------------\nSHIRTS\n\nBowe von Brethorst\nWeiser High School\n4A\nCheer\n\nS: 14\nM: 7\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.165\nID: 47f7f23b-dc7a-4d8d-938f-99c03b7dc2fb\n', 'roster - 2025-02-16T051247.566', '2025-02-16 05:42:32'),
(238, 204, 3, 'Brady Trenkle', 'From: Brady Trenkle\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nMinico High School\nSpartans\nRed & Gold\nSpencer Larsen\nKimberley Kidd\nBrady Trenkle\nSandee Nelson\nLuz Gonzales\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Aaliah Ambriz	10\n	Angeles Macias	9\n	Abby Gregory	10\n	Yeimi Guadarrama	10\n	Ashley Rodriguez	10\n	Alexandria Alcantar	9\n	Natalie Vega	10\n	Jasmin Vargas	10\n	Juliette Rodriquez	12\n	Kate Rosales	12\n	Valeria Linares	10\n	Shania Ramirez	11\n	McKenna Gomez	11\n\n---------------------------------------------------------\nSHIRTS\n\nBrady Trenkle\nMinico High School\n5A\nDance\n\nS: 6\nM: 2\nL: 2\nXL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.227.228\nID: 8fc8a81b-d195-4530-93dc-a0f4820414be\n', 'roster - 2025-02-16T051241.259', '2025-02-16 05:42:32'),
(239, 205, 3, 'Tina Pelkey', 'From: Tina Pelkey\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nNampa Christian High School\nTrojans\nMaroon & Gold\nGreg Wiles\nJim Eisentrager\nTina Pelkey\nKristal Mensonides\nMandy Thompson\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Olivia Richardson	12\n	Bella Anderson	11\n	Allie Ezell	11\n	Grace Michalski	11\n	Presley Glassco	11\n	Camden Rohlke	10\n	Addison Thompson	10\n	Addison Hammon	10\n	Maddy Mello	10\n	Sasha Hoover	10\n	Fiona Gordon	10\n	Layla Richardson	10\n\n---------------------------------------------------------\nCOMMENT\n\nThank you for your generous support of our student athletes!\n\n---------------------------------------------------------\nSHIRTS\n\nTina Pelkey\nNampa Christian High School\n3A\nCheer\n\nM: 12\n\n\n\n\n---------------------------------------------------------\nIP: 96.18.117.199\nID: a41427f6-aa1e-48fb-80bf-72c5e1261cca\n', 'roster - 2025-02-16T051231.026', '2025-02-16 05:42:32'),
(240, 206, 3, 'Conor Kennedy', 'From: Conor Kennedy\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nMcCall-Donnelly High School\nVandals\nRed, White & Blue\nTim Thomas\nTim Thomas\nConor Kennedy\nJulie Carroll\nChristine Naugle\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Delaney Campbell	12\n	Elle Carroll	11\n	Heidi Class	12\n	Jordan Dewinter	10\n	Taylor Ferris	12\n	Emilia Frost	11\n	Dashia Kremer	11\n	Isabella McKnight	10\n	Delilah Moon	10\n	Clara Naugle	10\n	Tessa Nay	11\n	Iris Patton	10\n	Hillarie Peak	11\n	Callie Robles	11\n	Georgia Spilotros	9\n	Briella Stark	12\n	Taylor Swainston	11\n\n---------------------------------------------------------\nSHIRTS\n\nConor Kennedy\nMcCall-Donnelly High School\n4A\nCheer\n\nS: 2\nM: 15\n\n\n\n\n---------------------------------------------------------\nIP: 162.218.180.38\nID: 32a5e97a-64d3-4a72-a2e2-4dc594ff319c\n', 'roster - 2025-02-16T051224.306', '2025-02-16 05:42:32'),
(241, 207, 3, 'Brady Trenkle', 'From: Brady Trenkle\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nMinico High School\nSpartans\nRed & Gold\nSpencer Larsen\nKimberley Kidd\nBrady Trenkle\nKenya Aguilar\nHannah Matsen\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Adriana Gutierrez	12\n	Alivia Kowitz	12\n	Cassy Teeple	12\n	Keairha Espinoza	12\n	Alyssa Lamb	11\n	Avelina Salinas	11\n	Adalyn Nielsen	11\n	Adalynn Paul	11\n	Avery Struchen	11\n	Gracelyn Grant	11\n	Jaslene Juarez	11\n	Jaycee Catmull	11\n	Kynli Page	11\n	McKinley Anderson	11\n	Preslee Elquist	11\n	Aiyana Cantu	10\n	Brooke Quiroz	10\n	Celeste Salinas	10\n	Esmeralda Larios	10\n	Jaycei Knutson	10\n	Jaylee McCurdy	10\n	Jazlynn Ortiz	10\n	Nataly Gil	10\n	Taylei Ortiz	10\n	Tiana Frei	10\n	Allissa Matsen	9\n	Amaya Salinas	9\n	Shiloh Heuston	9\n\n---------------------------------------------------------\nSHIRTS\n\nBrady Trenkle\nMinico High School\n5A\nCheer\n\nS: 8\nM: 16\nL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.227.228\nID: fab25141-4511-4d20-96fb-3cd2b1f5c461\n', 'roster - 2025-02-16T051217.823', '2025-02-16 05:42:32'),
(242, 208, 3, 'Jennifer Murdock', 'From: Jennifer Murdock\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nDeclo High School\nHornets\nOrange & Black\nSandra Miller\nRoland Bott\nJennifer Murdock\nJulie Silcock\nMelissa Silcock\nJessica Kidd\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Anthon, Analee	11\n	Bradshaw, Gracie	10\n	Bown, Hinkley	9\n	Darrington, Ellie	12\n	Darrington, Gracie	11\n	Darrington, Rylee	11\n	Heward, Madison	9\n	Hill, Leanna	9\n	Hutchison, Ellie	9\n	Jones, Avery	10\n	Osterhout, Ashlyn	11\n	Palmer, Britton	10\n	Ramsey, Raegan	12\n	Rios, Kaylee	10\n	Robinson, Morgan	12\n	Rodriguez, Ayleen	12\n	Silcock, Anniston	11\n	Wageman, Alayna	10\n	Wells, Addyson	11\n	Wolf, Montgomery	10\n\n---------------------------------------------------------\nSHIRTS\n\nJennifer Murdock\nDeclo High School\n4A\nDance\n\nS: 13\nM: 6\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: cec8e7ba-f8c8-4c0c-8653-46d8d9b6641a\n', 'roster - 2025-02-16T051212.441', '2025-02-16 05:42:32'),
(243, 209, 3, 'Scott Adams', 'From: Scott Adams\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nFirth High School\nCougars\nBlue, White & Black\nBasil Morris\nKeith Drake\nScott Adams\nTracy Rowe\nJennifer Finch\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Desirea Bridges	12\n	Jonathon Larios	12\n	Savannah McKnight	12\n	Aydsa Rodriguez	12\n	Allie Stuart	12\n	Kimberlyn Turnage	12\n	Myelle Wood	12\n	AJ Flores	11\n	Bryci Jolley	11\n	Charlotte Jones	11\n	Daisy Boyd	10\n	Isabella Broncho	10\n	Laeni Cederberg	10\n	Kaylee Jolley	9\n	Coraline Jones	9\n	Anyssia\'s Luna	9\n	Sophie McKnight	9\n	Addy Tatton	9\n\n---------------------------------------------------------\nSHIRTS\n\nScott Adams\nFirth High School\n3A\nCheer\n\nS: 5\nM: 12\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 67.215.46.79\nID: 16c8f274-b81b-4339-b824-ec75a4955f48\n', 'roster - 2025-02-16T051205.259', '2025-02-16 05:42:32'),
(244, 210, 3, 'Ty Shippen', 'From: Ty Shippen\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nBeth Dummar\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Victoria Arteaga	10\n	Kynlee Burt	9\n	Addyson Broers	10\n	Jessica Butikofer	11\n	Brookelle Byram	10\n	Madison Cawley	9\n	Avry Colledge	11\n	Isabella Corbett	11\n	Paisley Dalling	10\n	Ellie Doman	9\n	Paizlee Gray	12\n	KynLee Green	10\n	Kaiya Jackson	9\n	Smilla Stobbe	11\n	Chloe Killian	9\n	Kayjah Killian	11\n	Lillian King	10\n	Bella Kinghorn	10\n	Ayden Lords	12\n	Kaelee Martin	9\n	Ava McClellan	10\n	Morgan Moore	9\n	Emma Montano	9\n	Mason Ogden	9\n	Cassidy Paul	11\n	Lexi Peavey	12\n	Sydney Peavey	9\n	Libbie Quirl	10\n	Tinley Ricks	9\n	Presley Sheppard	10\n	Brylie Spaulding	9\n	Brynlee Sundberg	9\n	Mallorie Thompson	11\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nCheer\n\nS: 2\nM: 13\nL: 14\nXL: 4\n\n\n\n\n---------------------------------------------------------\nIP: 166.137.163.72\nID: 65be275d-5939-47b0-8258-485bdf021c0a\n', 'roster - 2025-02-16T051155.226', '2025-02-16 05:42:32'),
(245, 211, 3, 'Nick Birch', 'From: Nick Birch\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nIdaho Falls High School\nTigers\nOrange & Black\nKarla LaOrange\nChris Powell\nNick Birch\nShelbi Boyer\nHeather Matheson\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	AJ Johnston	12\n	Ali Neri	10\n	Allie Matheson	12\n	Blythe Putnam	10\n	Cali Jones	9\n	Cesilee Fenton	10\n	Emma Neider	10\n	Emma Cheney	9\n	Emma Keeley	9\n	Grace Katseanes	9\n	Hayden Howard	12\n	Johanna Lybbert	12\n	Kailyn Wells	9\n	Karmyndee Spoklie	11\n	Kaybrie Hunter	10\n	Kennidy Hasselstrom-Case	10\n	Kiera Hansen-Barnett	10\n	Kylee Call	10\n	Londyn Spray	9\n	Mia Argyle	11\n	Preslee Olaveson	10\n	Stella Stallings	9\n	Taytum Hobley	9\n	Torri Pappa	11\n	Victoria Perez	12\n	Zariah Butler	12\n	Zoey Clark	9\n	Brooklyn Couch	10\n	Chloee Koster	12\n\n---------------------------------------------------------\nSHIRTS\n\nNick Birch\nIdaho Falls High School\n5A\nCheer\n\nS: 3\nM: 23\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 209.141.121.107\nID: cc4eb4e2-f966-43c7-9212-01e2c036d1e6\n', 'roster - 2025-02-16T051147.846', '2025-02-16 05:42:32'),
(246, 212, 3, 'Ted Bell', 'From: Ted Bell\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nHighland High School - Pocatello\nRams\nBlack, White & Red\nDoug Howell\nBrad Wallace\nTravis Bell\nJessica Gallup\nStaci Orr\nKristi Watson\nAbby Farnsworth\nMakayla Goulding\nJillian Cameron\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Xoey Anderson	9\n	Haven Barlow	12\n	Justice Bates	10\n	Cloee Bobish	10\n	Chloe Carslon	10\n	Brianna DaBell	11\n	Mia Demuzio	9\n	Peyton Eddie	9\n	Miley Gallup	11\n	Cora George	9\n	Lillian Heaney	10\n	Ellie Hedstrom	12\n	Charly Henderson	11\n	Oaklee Howard	9\n	Blaikly Larsen	10\n	Reece Larsen	12\n	Amelia Lucero	11\n	Stella Merzlock	9\n	Gracellen Michaelson	12\n	McKinley Nielsen	9\n	Alivia Pfannenstiel	9\n	Sienna Richardson	9\n	Eva Schrade	12\n	Mylie Schwartz	10\n	Taylor Solomon	12\n	Kaytlyn Thurman	12\n	Zoey Voorheis	9\n	Addisyn Walje	10\n	Maggie Ward	11\n	Kamree Wheatley	9\n\n---------------------------------------------------------\nSHIRTS\n\nTed Bell\nHighland High School - Pocatello\n6A\nCheer\n\nS: 2\nM: 17\nL: 11\n\n\n\n\n---------------------------------------------------------\nIP: 169.197.75.108\nID: aa85cd92-996d-4889-96fa-4096b542fd22\n', 'roster - 2025-02-16T051139.370', '2025-02-16 05:42:32'),
(247, 213, 3, 'Meagan Brockett', 'From: Meagan Brockett\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nCentury High School\nDiamondback\nPurple, Teal, Black & Gold\nDouglas Howell\nSheryl Brockett\nMark Pixton\nMeagan Brockett\nBrandi Schuelke\nKaydynn Burrows\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Brenna Beckstead	9\n	Millie Evans	12\n	Caden Garcia	11\n	Araceli Garcia	9\n	Elizabeth Good	9\n	Nevaeh Gutierrez	11\n	LileeAna Gutierrez	9\n	Lilia Kauhaihao-Derouen	9\n	Arya Lewis	10\n	Olivia Lovett	11\n	Sierra McCuitston	11\n	Bailey McLaughlan	9\n	Brooke Nickerson	11\n	Melissa Pierce	11\n	Nevaeh Rankin	12\n	Bentley Robertson	9\n	Brooke Schuelke	12\n	Cale Spanton	12\n	Haidyn Talbot-Velasquez	9\n	Andelyn Valentine	12\n\n---------------------------------------------------------\nSHIRTS\n\nMeagan Brockett\nCentury High School\n5A\nCheer\n\nS: 2\nM: 13\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 169.197.75.107\nID: e8ede514-c4af-4153-ab35-c12e359d56e5\n', 'roster - 2025-02-16T051119.296', '2025-02-16 05:42:32'),
(248, 214, 3, 'Travis Draper', 'From: Travis Draper\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nGrace High School\nGrizzlies\nRed & White\nJason Moss\nBryan Jensen\nTravis Draper\nTina Bitton\nJenna Waddoups\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Aleaha Medina	12\n	Skout Hardy	11\n	Tyelor Turner	10\n	Darhaa D	10\n	Presley Judd	9\n	Myan Taggart	9\n	Berklee Mathews	9\n	Bailee Mathews	9\n	Ashlyn Welch	9\n	Charlee Ambrosek	9\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Draper\nGrace High School\n2A\nCheer\n\nS: 2\nM: 5\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 138.43.109.167\nID: 71399537-d9ce-40ba-a8ce-4c879b3c82c3\n', 'roster - 2025-02-16T051105.650', '2025-02-16 05:42:32'),
(249, 215, 3, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nPaula Ashby\nHolly Taylor\nKamryn Shanks\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Jenna Risenmay	9\n	Xavery Zollinger	9\n	Crystal Ramos	9\n	Kiari VanderSloot	10\n	Shayla Higbee	10\n	Cydnee Romo	9\n	Destinee Crocker	10\n	Xoey Zollinger	12\n	Madison Bishop	11\n	Sommer Staves	9\n	Jozlyn Pina	10\n	Laynee White	12\n	Hallie Breshears	10\n	Ava Fife	11\n	Zoey Camphouse	10\n	Graciela Ferrer	11\n	Ainzley Hansen	11\n	Addy Mayes	9\n	Eyerlin McCullaugh	9\n	Libertee Vega	9\n	Elise Forbush	9\n	Sienna Jensen	12\n\n---------------------------------------------------------\nCOMMENT\n\nI would like to order 3 sweatshirts for my coaches.  Paula Ashby XL, Holly Taylor Med, and Kamryn SHanks XL.  Please email me confirmation this has been ordered wadszair@sd91.org\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nCheer\n\nS: 2\nM: 15\nL: 4\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 192.225.190.52\nID: ec807d0e-96b2-4932-ba9d-e94e9a4726d4\n', 'roster - 2025-02-16T051055.277', '2025-02-16 05:42:32'),
(250, 216, 3, 'Randy Winn', 'From: Randy Winn\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nBurley High School\nBobcats\nGreen, Gray, Black & White\nSandra Miller\nLevi Power\nRandy Winn\nJovanii Ramos\nYosune Fitzhugh\nKayla Courtright\nTiffney Ramos\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Addisyn Street	9\n	America Rios	9\n	Brooklyn Hagen	9\n	Dalia Moran	9\n	Edyn Harrell	9\n	LilyAnn Coats	9\n	Addilyn McKnight	10\n	Davnie Ostler	10\n	Elise Squire	10\n	Ivy Redder	10\n	Kinli Greener	10\n	Kyzer Lindsay	10\n	Preslie Peterson	10\n	Aspen Amen	11\n	Avery Morgan	11\n	Bentlee Guiles	11\n	Danikka Morgan	11\n	Ellie Clark	11\n	Fallon Nelson	11\n	Kait Naing	11\n	Kaylee Dayley	11\n	Keenan Trevino	11\n	Taybree Robinson	11\n	Ashlyn Warr	11\n	Aubree Tracy	12\n	Hallie Lloyd	12\n	Zoey Noble	12\n\n---------------------------------------------------------\nCOMMENT\n\nIf possible can 2 of the small be extra small.  Also, one of the medium sizes need to be in the boys color.  Thank you!\n\n---------------------------------------------------------\nSHIRTS\n\nRandy Winn\nBurley High School\n5A\nCheer\n\nS: 12\nM: 10\nL: 4\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: 3a9ea3b3-c4a6-4861-bb80-f6c5a112b48b\n', 'roster - 2025-02-16T051047.989', '2025-02-16 05:42:32'),
(251, 217, 3, 'Jennifer Murdock', 'From: Jennifer Murdock\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nDeclo High School\nHornets\nOrange & Black\nSandra Miller\nRoland Bott\nJennifer Murdock\nKatie Mitchell\nCarie Brackenbury\nAbbie Searle\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Cahoon, Krystin	12\n	Clark, Clara	9\n	Duffin, Camrynn	9\n	Evans, Jazmine	9\n	Hansen, Haedyn	12\n	Hitt, Dallas	12\n	Kidd, Deja	9\n	Rasmussen, Sophia	9\n	Schroeder, Kinsley	9\n	Searle, Adilee	9\n	Stapelman, Zabree	9\n	Stapelman, Zenna	11\n	Taylor, Tatum	9\n	Thorton, Ava	10\n	Webb, Elexia	11\n	Wickel, Shania	12\n	Wolf, Graci	9\n	Wynn, Kambree	10\n	Searle, Ruby	\n\n---------------------------------------------------------\nSHIRTS\n\nJennifer Murdock\nDeclo High School\n4A\nCheer\n\nS: 11\nM: 8\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: 41482d52-26e0-4e00-916e-b55069b549a5\n', 'roster - 2025-02-16T051040.833', '2025-02-16 05:42:32'),
(252, 218, 3, 'Ted Reynolds', 'From: Ted Reynolds\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nCanyon Ridge High School\nRiverhawks\nCrimson & Silver\nBrady Dickinson\nRandall Miskin\nTed Reynolds\nAlexis Parra\nStephanie Teske\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Paulina Haller Cruz	12\n	Morgyn Hanks	12\n	Rissa Hempleman	12\n	Brenda Jennings	12\n	Savanna Tripp	12\n	Madison Anthoney	11\n	Emilia Baltazar	11\n	Jill Jensen	11\n	Olivia Molina	11\n	Makayla Rajacich	10\n	Finley Ross	10\n	Mackenzie Chambliss	9\n	Keyera Evans	9\n	Jaqueline Gaytan Torres	9\n	Taylor Waterman	9\n\n---------------------------------------------------------\nSHIRTS\n\nTed Reynolds\nCanyon Ridge High School\n6A\nCheer\n\nS: 4\nM: 8\nL: 1\nXL: 1\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 216.83.77.2\nID: b30aeccc-a870-416a-90fb-c7d387c0ddb1\n', 'roster - 2025-02-16T051033.306', '2025-02-16 05:42:32'),
(253, 219, 3, 'Sean Porter', 'From: Sean Porter\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nMarsing High School\nHuskies\nNavy & Gold\nNorm Stewart\nSean Porter\nSean Porter\nRebecca Slaughter\nChanda Meyer \n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Claudia Arechiga	12\n	Taylor Callison	12\n	Grace Clay 	10\n	Savannah Franke	9\n	Erika Frazier	12\n	Falcon Frazier 	11\n	Junior Hurtado	12\n	Ariel Ingersoll	12\n	Lilly Lee	9\n	Brynlee McFarland	9\n	Chloe Meyer 	10\n	Sydney Nelson 	12\n	Brooklyn Roadenbaugh	11\n	Mariana Suarez	12\n	Madyson Wright	10\n	Ximena Molina	9\n	Mikayla Montgomery	11\n\n---------------------------------------------------------\nSHIRTS\n\nSean Porter\nMarsing High School\n3A\nCheer\n\nS: 8\nM: 6\nL: 2\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 96.5.132.138\nID: 494067b9-e9ef-4de1-808d-0d1acb7d89a8\n', 'roster - 2025-02-16T051026.158', '2025-02-16 05:42:32'),
(254, 220, 3, 'Randy Winn', 'From: Randy Winn\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nBurley High School\nBobcats\nGreen, Gray, Black & White\nSandra Miller\nLevi Power\nRandy Winn\nBrook Jensen\nJazmin Edgar\nWhitley Jensen\nAubree Stephens\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Kelsie Schrenk	12\n	Lynnzey Mann	12\n	Rylee Samples	12\n	Shaylin Stephens	12\n	Adyson Musick	12\n	Abigail Bingham	12\n	Julixa Cruzes	12\n	Yarely Mendoza	12\n	London Woodbury	11\n	Savanna Lara	11\n	Adalynn Kruckenberg	11\n	Kaleie Gibson	11\n	Abree Darrington	11\n	Alexyz Peters	10\n	Samantha Gee	10\n	Alexis Solis	9\n	Jaycee Anderson	9\n	Ella Stephens	9\n	Susannah Martinez	9\n	Nevaeh Rodriguez	9\n	Shailey Goodrich	9\n	Shayley Adams	9\n\n---------------------------------------------------------\nSHIRTS\n\nRandy Winn\nBurley High School\n5A\nDance\n\nS: 17\nM: 5\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: 77d9e70a-d393-46ba-9b39-4c7695d9460d\n', 'roster - 2025-02-16T051015.029', '2025-02-16 05:42:32'),
(255, 221, 3, 'Matt Neff', 'From: Matt Neff\nActivity: Dance\n\n---------------------------------------------------------\nSCHOOL\n\nLakeland High School\nHawks\nGreen & Gold\nLisa Arnold\nJimmy Hoffman\nMatt Neff\nLaura Kelley\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Sarah Allen	12\n	Alyssa Caywood	12\n	Leeann Lohf	11\n	Kimber Magnus	9\n	Kambree Marreel	11\n	Rowan McKinzie	10\n	Gracie Mobbs	9\n	Daisy Palmer	11\n	Keona Roemermann	12\n	Lilyann Still	10\n	Paige Thompson	11\n\n---------------------------------------------------------\nSHIRTS\n\nMatt Neff\nLakeland High School\n5A\nDance\n\nS: 6\nM: 5\n\n\n\n\n---------------------------------------------------------\nIP: 162.218.180.34\nID: 319d0055-19e1-4aef-95f5-3c468d80deaf\n', 'roster - 2025-02-16T051000.824', '2025-02-16 05:42:32'),
(256, 222, 3, 'Kristan Young', 'From: Kristan Young\nActivity: Cheer\n\n---------------------------------------------------------\nSCHOOL\n\nMurtaugh High School\nRed Devils\nRed, White & Black\nMichele Capps\nRod Jones\nKristan Young\nAnna Virgin\n\n---------------------------------------------------------\nROSTER\n\n	name	grade\n	Jaci Virgin	12\n	Mishaela Shetler	12\n	Hailey Grey	12\n	Makiaya Bruns	12\n	Jordyn Salvesen	12\n	Hazel Straub	12\n	Aracely Alameda	12\n	Hannah England	12\n	Marissa Truitt	12\n	Valeria Alvarez	12\n	Emily Gomez	11\n	Erminia Gomez	11\n	Jakobi Jones	11\n	Tylee Young	10\n	Hannah Tellez	10\n	Emma England	10\n	Erica Gil	9\n	Anna Norris	9\n	Ximena Aguilera	9\n	Shyloh Perkins	9\n\n---------------------------------------------------------\nSHIRTS\n\nKristan Young\nMurtaugh High School\n2A\nCheer\n\nS: 7\nM: 12\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 199.6.40.160\nID: e8a1bf81-d5ab-4ba8-b943-f3e5905359d5\n', 'roster - 2025-02-16T150908.791', '2025-02-16 15:09:52'),
(257, 223, 2, 'Rex Romander', 'From: Rex Romander\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nDietrich High School\nBlue Devils\nBlue, White & Black\nStefanie Shaw\nRex Romander\nRex Romander\nCharley Bingham\nGarrett Astle\nKade Shaw\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	11	RaeLyn Van Kleeck	F	5-6	9\n	12	Paje VanTassell	G	5-4	12\n	13	Amory Shaw	G	5-6	11\n	14	Reagan Christiansen	G, F	5-6	11\n	15	Aleigha Robertson	PG, G	5-4	12\n	21	Kyah Dilworth	F, G	5-3	12\n	22	Ada Bingham	G	5-7	10\n	24	Anna Larson	P	5-5	9\n	25	Katilyn Wanamaker	C	6-0	12\n	31	Payton Olsen	G	5-1	9\n	33	Ali Stowell	C	6-1	10\n	34	Sienna Norman	G	5-3	9\n	35	Lily Hanson	F	5-8	10\n\n---------------------------------------------------------\nRECORD\n\n12	7\n\n39	Valley 	56\n29	Raft River 	50\n26	Rockland 	35\n55	Mackay 	20\n42	Murtaugh 	51\n51	Castleford	17\n45	Richfield 	12\n62	Glenn\'s Ferry	40\n28	Butte County	53\n42	Carey 	46\n66	Hansen 	35\n34	West Jefferson	51\n72	Castleford	20\n37	Richfield	19\n36	Carey 	33\n57	Gooding	50\n63	Hansen	29\n36	Richfield	18\n42	Carey	24\n\n---------------------------------------------------------\nSHIRTS\n\nRex Romander\nDietrich High School\n3A\nBasketball - Girls\n\nS: 9\nM: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 159.118.253.69\nID: dda08d3f-3590-4c6e-b96e-7d482b801df0\n', 'DietrichGBB.txt', '2025-02-16 22:02:49'),
(258, 224, 2, 'Brian Lee', 'From: Brian Lee\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nNezperce High School\nNighthawks\nBlue & Gold\nBrian Lee\nMisti Cook\nBrian Lee\nKaci Ralstin\nMarty Lux\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	4	Avery Lux		5-7	9\n	10	Raegan Mosman		5-2	9\n	12	Paityn Ralstin		5-6	9\n	14	Aubree Lux		5-10	12\n	20	Elizabeth Duuck		5-3	11\n	24	Helen Wilcox		5-4	10\n	32	Abigail Duuck		5-6	10\n	34	Morgan Kirkland		5-5	11\n	40	Jada Jensen		5-5	9\n	42	Melia Johnson		5-4	9\n	44	Izzy Horton		5-8	11\n	50	Kairys Grant		5-8	11\n\n---------------------------------------------------------\nRECORD\n\n10	10\n\n35	Kamiah	41\n11	Orofino	25\n32	St. John Bosco	29\n49	Salmon River	34\n45	Genesee	56\n31	Highland	32\n42	Timberline	10\n45	St. John Bosco	36\n32	Genesee	58\n51	Salmon River	56\n53	Highland	36\n42	Orofino	45\n29	Deary	31\n73	Timberline	21\n45	Deary	32\n51	Genesee	57\n28	Highland	27\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Lee\nNezperce High School\n1A\nBasketball - Girls\n\nS: 5\nM: 7\n\n\n\n\n---------------------------------------------------------\nIP: 129.222.131.161\nID: ac572d5f-4fe4-4833-a6ed-49f71010ca25\n', 'NezperceGBB.txt', '2025-02-16 22:03:11'),
(259, 225, 2, 'Kelly Caldwell', 'From: Kelly Caldwell\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nGenesee High School\nBulldogs\nBlue & Gold\nWendy Moore\nKelly Caldwell\nKelly Caldwell\nGreg Hardie\nTravis Grieser\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Sydney Banks	PG, SG	5-6	11\n	2	Monica Seubert	SG, PG	5-7	12\n	3	Alia Wareham	G, SG	5-5	11\n	5	Lily Scharnhorst		5-2	9\n	10	Rylie Baysinger	SG, F	5-8	11\n	14	Miley Grieser	P, F	5-10	10\n	15	Mya White	F	5-4	9\n	20	Chloe Grieser	PG, SG	5-7	11\n	22	Kendra Meyer	SG, G	5-6	12\n	23	Sophie Johnson	F, P	5-8	11\n	30	Lindsey Herman	F	5-5	9\n\n---------------------------------------------------------\nRECORD\n\n20	1\n\n67	@ Colton	53\n58	@ Kendrick	46\n56	Nezperce	45\n66	@ Timberline	18\n34	@ Deary	29\n68	St. John Bosco	61\n54	@ Pomeroy	46\n68	Troy	46\n61	Potlatch	23\n58	@ Nezperce	32\n52	Lapwai	63\n65	Kamiah	43\n62	Highland	44\n58	Deary	40\n61	@ St. John Bosco	36\n64	Timberline	32\n52	@ Highland	44\n61	Kendrick	38\n70	Wallace	24\n48	Highland (Districts)	39\n57	Nezperce (Districts)	51\n\n---------------------------------------------------------\nSHIRTS\n\nKelly Caldwell\nGenesee High School\n1A\nBasketball - Girls\n\nS: 5\nM: 6\n\n\n\n\n---------------------------------------------------------\nIP: 50.37.228.2\nID: 674532e9-bdd9-4216-8e11-ffeae4e3ed1a\n', 'GeneseeGBB.txt', '2025-02-16 22:03:11'),
(260, 226, 2, 'Michelle Peterson', 'From: Michelle Peterson\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMackay High School\nMiners\nRed & White\nSusan Buescher\nStephanie Fullmer\nMichelle Peterson\nJosh Pehrson\nChris Holt\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	2	Arilia Peterson			10\n	3	Emma Guerrero			11\n	12	Trista Hawley			10\n	20	Addison Seefried			9\n	22	Breyan Barger			9\n	25	Jaida Rodriguez			10\n	30	Danika Seefried			11\n	33	Alyssa Pehrson			11\n	35	Mylee Drussel			12\n\n---------------------------------------------------------\nRECORD\n\n15	9\n\n46	Salmon	39\n34	Challis	63\n45	Grace Lutheran	41\n20	Dietrich	55\n44	Murtaugh	64\n50	Nampa	42\n36	Raft River	61\n35	Leadore	53\n60	North Gem	21\n31	Rockland	45\n36	Leadore	44\n54	Challis	48\n55	Grace Lutheran	21\n48	North Gem	14\n40	Butte County	79\n59	ShoBan	30\n43	Richfield	14\n66	Taylor\'s Crossing	8\n46	Watersprings	17\n61	Richfield	20\n64	American Heritage	4\n53	Grace Lutheran	22\n48	Challis	45\n38	Rockland	45\n\n---------------------------------------------------------\nCOMMENT\n\nWe would like to purchase one size Medium sweatshirt for our manager.\n\n---------------------------------------------------------\nSHIRTS\n\nMichelle Peterson\nMackay High School\n1A\nBasketball - Girls\n\nM: 8\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 172.56.148.222\nID: edac0734-ab9a-4493-ab06-16a134928418\n', 'MackayGBB.txt', '2025-02-16 22:03:11'),
(261, 227, 2, 'Lee Jay Cook', 'From: Lee Jay Cook\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCarey High School\nPanthers\nBlue & Gold\nJim Foudy\nKayla Burton\nLee Jay Cook\nMerilee Sears\nShelli Simpson\nKodi Bunn\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	2	McKenzie Hennefer	G	5-3	10\n	3	Andie Simpson	G	5-3	10\n	5	Emily Ruiz	G	5-5	10\n	10	Kora Parke	F	5-7	11\n	11	Jocelyn Ruiz	G	5-5	10\n	12	Hayley Acquistapace	G	5-7	10\n	14	Ali Simpson	G	5-8	9\n	15	Viviana Palomera	F	5-7	11\n	20	Abbi Whittier	P	5-10	11\n	21	Avery Nilsen	F	5-8	10\n	23	Carole Hatch	P	5-8	11\n	24	Heidi Rojas Esparza	F	5-8	12\n	25	Paige Black	P	5-6	12\n\n---------------------------------------------------------\nRECORD\n\n14	6\n\n37	Butte County	54\n43	Shoshone	27\n42	Rockland	36\n38	North Freemont	47\n35	Richfield	24\n57	Hansen	24\n51	Castleford	28\n39	Nyssa, Or	25\n53	Ontario, Or	25\n44	Jordan Valley, Or	68\n46	Glenns Ferry	49\n46	Dietrich	42\n56	Richfield	33\n49	Hansen	18\n46	Castleford	30\n40	Challis	33\n19	Valley	66\n33	Dietrich	36\n37	Wendell	34\n48	Castleford	21\n\n---------------------------------------------------------\nSHIRTS\n\nLee Jay Cook\nCarey High School\n1A\nBasketball - Girls\n\nS: 2\nM: 10\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 66.232.90.254\nID: 5cd3c62a-03a7-4506-a061-f772b045ddbd\n', 'CareyGBB.txt', '2025-02-16 22:03:11'),
(262, 228, 2, 'Andrew Nelson', 'From: Andrew Nelson\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRockland High School\nBulldogs\nBlue, Red & White\nGreg Larson\nGreg Larson\nAndrew Nelson\nJordan Black\nShelly Matthews \n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Madison Radford	G	5-4	11\n	3	Harmony Boyer	G	5-4	11\n	4	Kinsey McHargue	F	5-6	10\n	5	Calyn Permann	G	5-9	12\n	10	Jada Farr	P	5-9	10\n	11	Sidney Freeman	P	5-8	12\n	12	Gracie Freeman	P	5-8	9\n	13	Brilee Steidley	G	5-5	9\n	15	Trin Wiese	G	5-5	11\n	22	Alexa Permann	F	5-10	12\n	24	Whitley Ralphs	G	5-4	9\n\n---------------------------------------------------------\nRECORD\n\n	\n\n42	Hagerman 	27\n32	Raft River 	40\n49	Murtaugh 	33\n24	West Side 	33\n35	Dietrich 	26\n56	Hansen 	16\n36	Carey 	42\n51	Wood River 	22\n60	Challis 	32\n44	Grace Lutheran 	15\n45	Mackay 	31\n52	Leadore	42\n42	Richfield 	18\n32	Butte County	47\n56	North Gem 	12\n63	American Heritage	2\n52	Watersprings 	5\n53	Sho-Ban	20\n41	Aberdeen	47\n52	Taylor\'s Crossing	11\n51	North Gem 	18\n37	Leadore	31\n\n---------------------------------------------------------\nSHIRTS\n\nAndrew Nelson\nRockland High School\n1A\nBasketball - Girls\n\nS: 9\nM: 1\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.200\nID: 92c8b18d-84ec-40b8-a5f7-49ea13757611\n', 'RocklandGBB.txt', '2025-02-16 22:03:11'),
(263, 229, 2, 'Josh Leighton', 'From: Josh Leighton\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLapwai High School\nWildcats\nBlue & White\nDavid Aiken\nD\'Lisa Penney\nLori Lynn Picard\nJosh Leighton Jr.\nJoslyn Leighton\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Charize Kipp	G		12\n	2	Ella Payne	G		10\n	3	Amasone George	SG		12\n	4	Skylin Picard	SG		11\n	14	Andraeana Domebo	SG		12\n	20	Lois Oatman	F		10\n	21	Cavell Samuels	F		9\n	22	Junee Picard	F		11\n	30	Jennilia WhiteTemple	F		10\n	33	Madden Bisbee	SG		11\n\n---------------------------------------------------------\nRECORD\n\n20	4\n\n56	at Orofino	28\n70	at Potlatch	35\n54	at Kendrick	44\n45	at Kamiah	27\n65	at Logos	24\n76	Clearwater Valley	27\n52	Moscow	44\n73	Troy	27\n47	at Grangeville	51\n63	Kendrick	18\n69	Lakeside	34\n63	at Genesee	52\n49	at Prairie	55\n64	Potlatch	27\n42	Kamiah	43\n66	Logos	39\n50	Prairie	46\n85	at Clearwater Valley	39\n68	at Troy	19\n63	Orofino	20\n76	Potlatch	27\n57	Kamiah	36\n49	Prairie	68\n62	Kamiah	40\n\n---------------------------------------------------------\nSHIRTS\n\nJosh Leighton\nLapwai High School\n2A\nBasketball - Girls\n\nS: 1\nM: 9\n\n\n\n\n---------------------------------------------------------\nIP: 67.108.47.118\nID: 40a836b4-e5ea-4cfb-9b0c-b725820e1c88\n', 'LapwaiGBB.txt', '2025-02-16 22:03:11'),
(264, 230, 2, 'Angie McAffee', 'From: Angie McAffee\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nButte County High School\nPirates\nBlack, White & Orange\nJoe Steele\nAllen Carter\nAngie McAffee\nMindy Gamett\nKiya McAffee\nTrevor Andersen\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Addison Pancheri	C, PF	6-0	10\n	3	Makenzy Bird	G	5-3	11\n	10	Saige Wanstrom	PF	5-6	11\n	14	Abbie Knight	C, PF	6-0	11\n	20	Autumn Gamett	PG, SG	5-6	10\n	21	Madi Gamett	PG	5-4	10\n	22	Hazel Gamett	PG, SG	5-4	11\n	23	Cambree Lyon	C, PF	5-11	10\n	24	Paige Williams	PF, C	5-7	11\n	30	Brynn Andersen	SG, SF	5-7	11\n	44	Jessie Ashton	C	6-0	9\n	53	Siri Gamett	PG	5-3	9\n\n---------------------------------------------------------\nRECORD\n\n16	7\n\n55	North Fremont	50\n54	Carey	37\n76	Valley	71\n54	West Jeff	47\n49	North Fremont	31\n53	Mountain Home	64\n49	Capital	58\n40	Jerome	48\n59	West Jeff	56\n34	Teton	55\n26	Sugar Salem	63\n58	Raft River	47\n40	Oakley	45\n48	Challis	32\n53	Dietrich	28\n47	Rockland	32\n79	Mackay	40\n58	Murtaugh	21\n48	Grace	40\n63	Castleford	9\n46	Grace	53\n47	Grace	42\n61	Grace	54\n\n---------------------------------------------------------\nCOMMENT\n\nIn addition could we please get 2 mediums and a small? We will pay for these.\n\n---------------------------------------------------------\nSHIRTS\n\nAngie McAffee\nButte County High School\n2A\nBasketball - Girls\n\nS: 2\nM: 8\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 216.180.191.53\nID: af71dd3d-fb89-4a99-b9eb-2fba55da2d01\n', 'ButteCountyGBB.txt', '2025-02-16 22:03:11'),
(265, 231, 2, 'Mark Mace', 'From: Mark Mace\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nOakley High School\nHornets\nRed & White\nSandra Miller\nJaren Wadsworth\nMark Mace\nKristin Jones\nArden Cranney\nPaul Marchant\nKirk Craner\nAbbey Beck\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Livee Berliguet	PG	5-2	11\n	2	Makaye Cranney	F	5-6	12\n	3	Chloe Berlin	F	5-7	12\n	4	Brooke Mabey	F	5-9	11\n	5	Adelyn Maseda	F	5-10	11\n	10	Camila Magana	G, F	5-4	11\n	12	Taylin Beck	G	5-5	11\n	20	Kinslee Matthews	PG	5-5	10\n	21	Kandace Jones	PG	5-6	10\n	22	Dakota Wadsworth	G, F	5-5	12\n	23	Oaklee Wadsworth	G, F	5-3	10\n	24	Jaycee Wells	F	5-6	10\n	25	Natalie Hardy	F	5-11	10\n	32	Kylee Adams	G	5-2	9\n\n---------------------------------------------------------\nRECORD\n\n20	1\n\n61	Hagerman	17\n55	Ambrose School	19\n55	Shoshone	19\n55	Glenns Ferry	28\n46	Murtaugh	22\n37	Prairie	26\n56	New Plymouth	33\n49	Declo	32\n49	Raft River	37\n45	Butte County	40\n49	Soda Springs	35\n50	Valley	47\n47	Shoshone	17\n40	Grace	26\n54	Glenns Ferry	27\n52	Gooding	43\n58	Murtaugh	36\n50	Hagerman	12\n50	Raft River	36\n60	Valley	57\n54	Murtaugh	20\n\n---------------------------------------------------------\nSHIRTS\n\nMark Mace\nOakley High School\n2A\nBasketball - Girls\n\nS: 4\nM: 9\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 72.22.239.194\nID: aec389f7-34c5-4891-aff2-5acf6b2111e5\n', 'OakleyGBB.txt', '2025-02-16 22:03:12'),
(266, 232, 2, 'Mark Wachsmuth', 'From: Mark Wachsmuth\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLiberty Charter High School\nPatriots\nNavy, Red & White\nRebecca Stallcop\nRebecca Stallcop\nMark Wachsmuth\nBrad McCain\nDru Nicley\nBrian Haken\nRyan Albright\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	01	Rylee Camarillo	G	5-5	10\n	02	Aveyah Flores	G	5-11	10\n	03	Kasey Thompson	G	5-3	12\n	04	Jennabelle Reece	G	5-9	12\n	05	McKenna Schaffer	G	5-4	10\n	11	Sydney Albright	G	5-9	9\n	12	Emma Cardarelli	G	5-5	12\n	13	Lexi Molina	G	5-5	10\n	14	Sarah Ward	P	6-0	12\n	22	Maci Nicley	G	5-5	9\n	22.5	Addison McCain	PG, SG	5-10	10\n	30	Riley Henrickson	G	5-6	10\n	34	Sophie Criddle	G	5-10	11\n	41	Kyla Stimpson	P	5-10	11\n	44	Natalia Molina	P	5-6	12\n	45	Aliya Johnson	P	5-7	9\n\n---------------------------------------------------------\nRECORD\n\n17	5\n\n36	Tri-Valley	33\n53	Garden Valley	37\n46	Nampa Christian	56\n46	Gem State	13\n49	Vision Charter	21\n57	Idaho City	8\n31	Murtaugh	48\n36	Nampa Christian	23\n44	Council	24\n2	North Star Charter (forfeit)	0\n59	Notus	9\n25	Crane (OR)	60\n45	Centennial Baptist	12\n41	Victory Charter	18\n54	Compass Charter	25\n50	Rimrock	17\n26	Valley	71\n24	Wilder	38\n44	Riverstone	16\n51	Idaho City	10\n41	Vision Charter	16\n29	Wilder	25\n\n---------------------------------------------------------\nSHIRTS\n\nMark Wachsmuth\nLiberty Charter High School\n2A\nBasketball - Girls\n\nS: 2\nM: 7\nL: 5\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.110.232\nID: 4b927069-c31d-41d2-aa6e-ef304ab66fdb\n', 'LibertyCharterGBB.txt', '2025-02-16 22:03:12'),
(267, 233, 2, 'Travis Mader', 'From: Travis Mader\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nPrairie High School\nPirates\nBlack, White & Red\nJon Rehder\nMatt Elven\nTravis Mader-Jeff Martin-Matt Elven\nLori Mader\nDaphne Hanson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	2	Lexi Schumacher	G	5-7	12\n	3	Aubree Rehder	G	5-6	12\n	4	Sydney Shears	G/P	5-6	11\n	5	Hailey Hanson	G	5-10	11\n	10	Nadia Cash	G/P	5-6	10\n	12	Mia Anderson	G	5-3	9\n	14	Ellie Nuxoll	P	5-10	12\n	20	Kadence Kalmbach	G/P	5-5	12\n	23	Erica Schlader	G	5-6	10\n	30	Reagan Brannan	G	5-7	9\n	33	Sage Elven	G/P	5-10	11\n	34	Kylie Schumacher	P	5-10	11\n\n---------------------------------------------------------\nRECORD\n\n17	2\n\n79	Orofino	23\n69	Potlatch	14\n68	Kendrick	16\n68	Grangeville	54\n84	Clearwater Valley	31\n26	Oakley	37\n39	Grace	23\n54	Kamiah	30\n91	Logos	12\n78	Potlatch	6\n72	Troy	18\n55	Lapwai	49\n74	Kendrick	34\n57	Grangeville	56\n92	Clearwater Valley	28\n70	Troy	12\n65	Logos	28\n50	Lapwai	46\n62	Kamiah	45\n\n---------------------------------------------------------\nSHIRTS\n\nTravis Mader\nPrairie High School\n2A\nBasketball - Girls\n\nS: 6\nM: 5\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 64.126.167.18\nID: 7a21650e-40b9-4332-860f-b5411996f626\n', 'PrairieGBB.txt', '2025-02-16 22:03:12'),
(268, 234, 2, 'Avery Brown-Sonder', 'From: Avery Brown-Sonder\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nLakeside Junior/Senior High School\nKnights\nBlack, White & Red\nTara Lere\nJennifer Hall\nAdrian Brown-Sonder\nChris Dohrman\nCaleb Harms\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	00	Cassidy Gorr			11\n	1	Kimberly Pluff			11\n	2	Kyleigh Wolfe			11\n	3	Laila Charlie			9\n	5	Alayla Matheson			9\n	10	Areannia Lowley			12\n	11	Zymri Hodgson			11\n	12	Alberta Stensgar			11\n	15	Sadie Leo			9\n	20	Ambi Aldrich			9\n	21	Sylvia Matt			11\n	22	Ryanna Ortivez			9\n	24	Tylah Lambert			11\n	32	Saydee Peone			9\n	42	Fawn Abrahamson			11\n\n---------------------------------------------------------\nRECORD\n\n13	7\n\n68	Clark Fork	33\n18	Timberlake	68\n43	Inchelium	64\n60	Kellogg	57\n57	Post Falls JV	33\n51	Inchelium	47\n54	Wallace	37\n42	Inchelium	57\n42	Wellpinit	55\n55	Genesis Prep Academy	39\n34	Lapwai	69\n68	Genesis Prep Academy	58\n67	Wallace	44\n49	Lake Roosevelt	46\n25	Timberlake	69\n75	Bonners Ferry	78\n72	Clark Fork	27\n72	Clark Fork	23\n66	Genesis Prep Academy	35\n63	Wallace	45\n\n---------------------------------------------------------\nCOMMENT\n\nTami Dohrman - Score Bookkeeper \n\n---------------------------------------------------------\nSHIRTS\n\nAvery Brown-Sonder\nLakeside Junior/Senior High School\n2A\nBasketball - Girls\n\nS: 3\nM: 8\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 205.210.19.218\nID: 5f7f78ab-0bef-4e72-b870-c2c06aeb6153\n', 'LakesideGBB.txt', '2025-02-16 22:03:12'),
(269, 235, 2, 'Brian Hardy', 'From: Brian Hardy\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nValley High School\nVikings\nBlue & White\nTy Jones\nRisa Moffitt\nBrian Hardy\nDerek Malone\nAlex Raney\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	10	Joanie Lewis	G	5-5	12\n	11	Alora Godfrey	F	5-6	10\n	12	Emily Huettig	F	5-9	9\n	13	Zandie Bourn	F	5-6	12\n	14	Seleni Sanchez	G	5-3	11\n	20	Hailey Malone	G	5-5	10\n	21	Afton Godfrey	F	5-5	12\n	22	Arellie Juarez	G	5-1	12\n	23	Lexi Huettig	G	5-4	12\n\n---------------------------------------------------------\nRECORD\n\n16	4\n\n56	Dietrich	39\n71	Butte County	76\n51	Castleford	14\n39	Parma	56\n61	Murtaugh	25\n50	Raft River	54\n56	Twin Falls JV	34\n60	Shoshone	23\n62	Glenns Ferry	31\n91	Hagerman	33\n85	Rimrock	38\n47	Oakley	50\n64	Murtaugh	32\n72	Raft River	50\n66	Carey	19\n61	Shoshone	34\n69	Glenns Ferry	37\n71	Liberty Charter	26\n70	Hagerman	24\n60	Oakley	57\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Hardy\nValley High School\n2A\nBasketball - Girls\n\nS: 5\nM: 4\n\n\n\n\n---------------------------------------------------------\nIP: 97.132.139.5\nID: 9c2509f6-0d4c-46a0-91f5-ad605a024ab1\n', 'ValleyGBB.txt', '2025-02-16 22:03:12'),
(270, 236, 2, 'Matt Harris', 'From: Matt Harris\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRirie High School\nBulldogs\nRoyal Blue & Gold\nJeff Gee\nDr. Kasey Teske\nMatt Harris\nJake Landon\nKaylee Brown\nEric Taylor\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	0	Hailey Robson	Guard	5-7	11\n	1	Brinley Taylor	Forward	5-6	12\n	2	Shae Sutton	Guard	5-4	12\n	3	Lauren Robson	Guard	5-6	11\n	4	Presley Bybee	Forward	5-8	10\n	5	Niciah Young	Guard	5-5	11\n	10	Lucy Boone	Guard	5-4	11\n	11	Tristynn Gallup	Guard	5-3	10\n	12	Liza Boone	Guard	5-4	12\n	20	Hannah Moedl	Forward	5-10	11\n	22	McKall Marsh	Forward	5-9	11\n	23	Jadyn Nelson	Forward	6-0	10\n\n---------------------------------------------------------\nRECORD\n\n12	9\n\n40	Sugar-Salem	55\n42	Teton	54\n55	Grangeville	45\n46	Declo	28\n45	West Side	41\n54	Marsh Valley	51\n50	Malad	59\n24	Malad	49\n59	West Jefferson	58\n44	Firth	32\n33	South Fremont	41\n68	Declo	43\n66	Salmon	31\n51	North Fremont	55\n50	West Jefferson	43\n47	South Fremont	48\n27	Firth	40\n26	Sugar-Salem	67\n69	Salmon	19\n60	North Fremont	40\n52	Teton	50\n\n---------------------------------------------------------\nSHIRTS\n\nMatt Harris\nRirie High School\n3A\nBasketball - Girls\n\nS: 5\nM: 7\n\n\n\n\n---------------------------------------------------------\nIP: 96.5.131.85\nID: f1758f8c-e8bf-42d9-975f-a068cb99918b\n', 'RirieGBB.txt', '2025-02-16 22:03:12'),
(271, 237, 2, 'Bryan Rojas', 'From: Bryan Rojas\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nGrangeville High School\nBulldogs\nBlue & White\nAlica Holthaus\nAmanda Bush\nBryan Rojas\nMichelle Barger\nMegan Turner\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	2	Caryss Barger	PG, SG	5-5	11\n	3	Siena Wagner	SG, PG	5-5	12\n	4	Autumn Long	PG, SG	5-4	9\n	10	Kinzley Adams	SG	5-5	12\n	11	Dusty Bashaw	SF	5-8	12\n	12	Mikaela Klement	SG	5-8	10\n	20	Madalyn Green	SF, PF	6-2	12\n	22	Halle Told	SG	5-7	12\n	24	Adalei Lefebvre	PF	6-0	12\n	31	Keely MacGregor	PG	5-4	10\n	32	Addisyn Vanderwall	SG, SF	5-7	11\n	42	Allyson Green	SF	5-9	10\n	50	Ila Wilkinson	SF	5-7	11\n\n---------------------------------------------------------\nRECORD\n\n17	6\n\n65	McCall-Donnelly	56\n54	Cole Valley Christian	27\n45	Ririe	55\n54	Prairie	68\n41	Timberlake	51\n84	St. Maries	9\n41	McCall-Donnelly	28\n79	Orofino	12\n36	Lakeland	35\n42	Lewiston	36\n47	Clarkston	55\n51	Lapwai	47\n69	Kellogg	19\n52	Orofino	20\n69	Priest River	34\n56	Prairie	57\n49	Timberlake	48\n52	Deer Park	71\n70	Kellogg	19\n61	Priest River	30\n1	St. Maries (FF)	0\n76	Orofino	16\n69	Priest River	33\n\n---------------------------------------------------------\nSHIRTS\n\nBryan Rojas\nGrangeville High School\n3A\nBasketball - Girls\n\nS: 3\nM: 8\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 129.222.101.130\nID: 19c40908-c4bb-45bb-8ec4-aaad597332bf\n', 'GrangevilleGBB.txt', '2025-02-16 22:03:12');
INSERT INTO `messageorders` (`messageOrderID`, `schoolOrderID`, `genderID`, `orderedBy`, `orderText`, `fileName`, `orderDate`) VALUES
(272, 238, 2, 'Jodi Beard', 'From: Jodi Beard\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nNorth Fremont High School\nHuskies\nPurple & Gold\nBrandon Farris\nJaren Bean\nJodi Beard\nBen Lenz\nJared Hawkes\nChase Silvers\nEddy Lenz\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Brooklyn Allen			10\n	2	Yadira Patino			11\n	3	Peyton Lenz			11\n	4	Josie Richardson			12\n	5	Mackenzie Parkinson			10\n	12	Talia Hawkes			9\n	15	Nancy Morales			10\n	20	Lexi Phillips			10\n	21	Madison Powell			10\n	23	Brooklyn Ingle			10\n	32	Jayden Warnke			10\n	33	Taylor Sessions			11\n	34	Catie Pickard			10\n	42	Grace Heiner			12\n\n---------------------------------------------------------\nRECORD\n\n13	13\n\n50	Butte	55\n61	Aberdeen	29\n45	South Fremont	50\n25	Bear Lake	64\n51	Aberdeen	25\n31	Butte	49\n59	Wood River	20\n47	Carey	38\n60	Salmon	32\n53	West Jefferson	60\n57	Firth	32\n36	Teton	43\n55	Ririe	51\n50	South Fremont	59\n35	Bear Lake	57\n47	Firth	53\n65	Salmon	37\n47	Teton	50\n42	West Jefferson	48\n44	Salmon	14\n55	West Jefferson	37\n52	Firth	45\n40	Ririe	49\n48	Wendell	31\n\n---------------------------------------------------------\nCOMMENT\n\nI submitted a form earlier, but needed to make some corrections. This is the correct one.\r\nThank you\n\n---------------------------------------------------------\nSHIRTS\n\nJodi Beard\nNorth Fremont High School\n3A\nBasketball - Girls\n\nS: 9\nM: 2\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 172.56.85.217\nID: 94269b2b-dd4c-480c-bd46-7a4bab931a6e\n', 'NorthFremontGBB.txt', '2025-02-16 22:03:12'),
(273, 239, 2, 'Jeff Horsley', 'From: Jeff Horsley\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSoda Springs High School\nCardinals\nRed & Black\nScott Muir\nJess McMurray\nJeff Horsley\nMat Gronning\nJeff Parker\nKebra Gibson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	0	Josey Rasmussen	SF	5-6	11\n	1	Jayden Parker	PG, G	5-5	9\n	2	Courtnee Gronning	G	5-6	11\n	3	Rosie Harris	PF	5-7	11\n	5	Madilyn Kempe	PF	5-6	11\n	10	Taylee Tingey	G	5-5	9\n	11	Tayla Petterborg	W	5-6	9\n	13	Abby Goodin	SG, PG	5-8	12\n	14	Mylee White	G	5-6	10\n	15	Jocee Tingey	G	5-5	10\n	21	Gracie Moldenhauer	PG, SG	5-7	12\n	22	Ellie Wood	W	5-7	11\n	25	Halle Ozburn	W	5-6	9\n	33	Aspen Skinner	W	5-6	10\n	34	Haizley Mumford	PF	5-9	9\n\n---------------------------------------------------------\nRECORD\n\n10	10\n\n25	Bear Lake	51\n44	Grace	40\n29	Parma	49\n51	Melba	62\n44	Grace	32\n47	Hurricane, UT	54\n39	Desert Hills, UT	49\n28	Richfield, UT	34\n43	Wendell	32\n47	West Jefferson	40\n61	Declo	40\n54	West Side	29\n35	Oakley	49\n33	Malad	54\n28	Bear Lake	66\n48	Aberdeen	28\n50	West Side	35\n49	Declo	34\n32	Malad	41\n52	Aberdeen	44\n\n---------------------------------------------------------\nSHIRTS\n\nJeff Horsley\nSoda Springs High School\n3A\nBasketball - Girls\n\nS: 6\nM: 8\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 168.245.231.154\nID: 8eca41df-955d-42a6-bf42-181bc1864c48\n', 'SodaSpringsGBB.txt', '2025-02-16 22:03:12'),
(274, 240, 2, 'Rikki Tolmie', 'From: Rikki Tolmie\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nParma High School\nPanthers\nBlack, White & Red\nDale Layne\nMonique Jensen\nRikki Tolmie\nMichael Calkins\nTrinity Jackson\nColby Abeglan \n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	00	Abby Anderson 	G		11\n	1	Maria Gentry 	G		12\n	2	Daisy Hardcastle 	F		12\n	3	Ava Shaw 	F		11\n	4	Mollie Calkins 	G		10\n	5	Lakota Leppert 	F		12\n	11	Haylee Gentry 	F		12\n	12	Maya Jensen 	F		11\n	20	Kaidance Kaiser 	G		12\n	23	Rylie Calkins 	G		12\n	25	Aarey Harris 	F		11\n\n---------------------------------------------------------\nRECORD\n\n20	2\n\n53	Homedale	26\n49	Soda Springs	29\n40	Malad	56\n56	Valley	39\n62	Homedale 	23\n60	Mountain View 	31\n60	Marsing 	34\n47	Melba	15\n50	Nampa Christian	22\n66	Kimberly	45\n62	Gooding 	32\n55	Tri-Valley	21\n62	Ambrose 	23\n54	New Plymouth	27\n57	Marsing	15\n49	Melba	42\n55	Bishop Kelly	62\n65	Nampa Christian	15\n55	Ambrose	31\n63	New Plymouth	42\n46	Marsing	14\n51	Melba	21\n\n---------------------------------------------------------\nCOMMENT\n\nI might need to edit the sizes on this order and will do so tomorrow if needed! Thanks!\n\n---------------------------------------------------------\nSHIRTS\n\nRikki Tolmie\nParma High School\n3A\nBasketball - Girls\n\nS: 4\nM: 7\n\n\n\n\n---------------------------------------------------------\nIP: 24.116.115.85\nID: 655e378b-b77f-4272-876c-2861e0f2e242\n', 'ParmaGBB.txt', '2025-02-16 22:03:12'),
(275, 241, 2, 'Cory Dickard', 'From: Cory Dickard\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMelba High School\nMustangs\nRed & White\nSherry Ann Adams\nEric Forsgren\nCory Dickard\nDennis Lenz\nBrad Sjostedt\nMark Owen\nCheyla Volkers\nTim Moreshead\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	2	Darby Lowber	F	5-9	11\n	3	Tariah Carter	F	6-0	12\n	4	Janey Cole	G	5-4	9\n	5	Jessie Rae	G	5-2	10\n	10	Elle Crimbchin	G	5-4	11\n	11	Mackenzie Rose	G	5-2	10\n	12	Ellie Johnson	G	5-10	11\n	13	Randi Andersen	F	5-10	10\n	14	Brinley Gunstream	F	5-11	12\n	21	Quincie Hafen	G	5-4	9\n	23	Kali jo Adams	G	5-4	12\n	25	Kinlee Post	F	5-7	10\n\n---------------------------------------------------------\nRECORD\n\n17	5\n\n48	Cole Valley	49\n58	Columbia	45\n23	Malad	72\n62	Soda Springs	51\n40	Buhl	10\n38	Cole Valley	33\n44	Fruitland	43\n51	Buhl	23\n54	Nampa Chirstian	32\n15	Parma	47\n38	New Plymouth	25\n52	Fruitland	39\n46	Marsing	36\n73	Ambrose	32\n23	Nampa Christian	18\n42	Parma	49\n48	Baker	45\n45	New Plymouth	38\n52	Marsing	16\n52	Ambrose	33\n64	New Plymouth	40\n21	Parma	51\n\n---------------------------------------------------------\nSHIRTS\n\nCory Dickard\nMelba High School\n3A\nBasketball - Girls\n\nS: 7\nM: 4\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 184.99.78.223\nID: d8e13834-948d-4314-949c-cf186774e823\n', 'MelbaGBB.txt', '2025-02-16 22:03:12'),
(276, 242, 2, 'Chad Hill', 'From: Chad Hill\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSouth Fremont High School\nCougars\nRed & Black\nBrandon Farris\nDrex Hathaway\nChad Hill\nBrooke Bailey\nJackie Rowberry\nWhitney Forbush\nKaitlynd Torres\nBruce Kerbs\nCrissy Kerbs\nCarly Klingler\nMandy Lagerstrom\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Lily Christensen	SG	5-6	12\n	2	Kenzly Neville	SF	5-9	12\n	3	Ty Conger	SG	5-5	11\n	4	Blakely McNeil	SG	5-7	12\n	5	Bailee Webster	SG	5-3	11\n	11	Megan Biorn	PG, SG	5-5	11\n	12	Brindee Bailey	SF	5-10	10\n	13	Sailee Kerbs	PG	5-4	10\n	15	Katelyn Rowley	SF	5-5	12\n	21	Brianne Bailey	PG, SF	5-11	12\n	22	Hayden Larson	Post	6-1	12\n	23	Hallie Robles	SF	5-6	11\n	33	Brookie Bair	Post	6-1	10\n\n---------------------------------------------------------\nRECORD\n\n21	5\n\n55	American Falls	25\n50	North Fremont	45\n50	American Falls	41\n58	West Jefferson	39\n53	Snake River	18\n60	Firth	38\n47	Twin Falls	39\n56	West Jefferson	48\n41	Ririe	33\n54	Jackson Hole	15\n56	Bonneville	52\n55	Idaho Falls	62\n60	Snake River	25\n64	Marsh Valley	48\n55	Teton	47\n59	North Fremont	50\n48	Ririe	47\n36	Sugar-Salem	55\n55	Teton	39\n70	Firth	48\n52	Sugar-Salem	58\n55	Teton	29\n48	Sugar-Salme	49\n61	Teton	41\n45	Sugar-Salem	49\n49	Marsh Valley	45\n\n---------------------------------------------------------\nSHIRTS\n\nChad Hill\nSouth Fremont High School\n4A\nBasketball - Girls\n\nM: 4\nL: 9\n\n\n\n\n---------------------------------------------------------\nIP: 192.150.157.109\nID: b6d3c491-2017-4551-a9d1-50af1589fbfb\n', 'SouthFremontGBB.txt', '2025-02-16 22:03:12'),
(277, 243, 2, 'Tom Shanahan', 'From: Tom Shanahan\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBishop Kelly High School\nKnights\nBlack & Gold\nBill Avey\nSarah Quilici\nTom Shanahan\nDerek McCormick\nMike Griswold\nHaley Mckinnis\nAndrea Wilson\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Alaina Stiffler	G	5-4	10\n	2	Taryn Allumbaugh	G	5-4	11\n	3	Jamie Petrino	G	5-4	12\n	4	Julia Baerlocher	G	5-5	10\n	10	Brooke Hutchinson	SG	5-6	12\n	11	Mary Behrend	SF	5-7	12\n	20	Aubree McCarthy	F	5-8	11\n	21	Abby Swan	SF	5-9	12\n	22	Lauren Fettic	C	5-11	12\n	25	Caroline Henry	C	5-10	12\n	33	Katie Janzen	G	5-6	12\n	34	Reagan Williams	F	5-8	10\n	55	Jamie Baker	G	5-7	10\n\n---------------------------------------------------------\nRECORD\n\n17	7\n\n45	Mountain Home	59\n50	Jerome	39\n68	Caldwell	23\n58	Columbia	33\n33	Boise	68\n62	Emmett	42\n26	Middleton	50\n61	Nampa	24\n38	Capital	54\n52	Meridian	48\n38	Twin Falls	43\n53	Skyview	44\n59	Vallivue	21\n65	Caldwell	15\n64	Columbia	27\n62	Parma	55\n40	Emmett	26\n34	Middleton	65\n63	Nampa	18\n53	Skyview	18\n65	Vallivue	38\n60	Caldwell	21\n58	Emmett	29\n30	Middleton	57\n\n---------------------------------------------------------\nSHIRTS\n\nTom Shanahan\nBishop Kelly High School\n5A\nBasketball - Girls\n\nM: 3\nL: 10\n\n\n\n\n---------------------------------------------------------\nIP: 24.119.144.124\nID: db853976-ba0c-4deb-920e-9ca88ad58ab2\n', 'BishopKellyGBB.txt', '2025-02-16 22:03:12'),
(278, 244, 2, 'Cody Shelley', 'From: Cody Shelley\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBlackfoot High School\nBroncos\nKelly Green & White\nBrian Kress\nRoger Thomas\nCody Shelley\nRaimee Odum\nJared Arave\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Addison Tanner	PG, SG	5-10	12\n	2	Blaklee Ball	G	5-3	9\n	3	Hallie Humpherys	SG	5-5	12\n	4	Lauren Christiansen	SG	5-9	11\n	10	Lexi Jackman	G	5-3	9\n	11	Sara Hone	PF, C	6-0	12\n	21	Preslie Martin		5-7	9\n	22	Atalyn Tomazin	F	6-2	12\n	23	Oaklee Marlow		5-3	9\n	30	Jaci Capson	SG	5-8	11\n	32	Neitiri Degarmo	SF, SG	5-10	9\n	44	Cambrie Waterhouse		6-1	12\n\n---------------------------------------------------------\nRECORD\n\n18	5\n\n41	Thunder Ridge	33\n47	Century	22\n30	Rigby	18\n58	Snake River	22\n65	Idaho Falls	54\n66	Bonneville	38\n50	Herriman	20\n27	Wasatch	40\n36	Sugar Salem	53\n61	Shelley	63\n57	Snake River	27\n56	Hillcrest	51\n63	Idaho Falls	38\n49	Madison	58\n55	Skyline	64\n48	Hillcrest	40\n50	Century	19\n57	Shelley	41\n58	Bonneville 	28\n57	Skyline	45\n52	Highland	36\n52	Hillcrest	49\n61	Skyline	43\n\n---------------------------------------------------------\nSHIRTS\n\nCody Shelley\nBlackfoot High School\n5A\nBasketball - Girls\n\nS: 4\nM: 4\nL: 3\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 97.178.254.231\nID: 1cf5f889-cc30-4a10-9ff0-f18447e3c7ea\n', 'BlackfootGBB.txt', '2025-02-16 22:03:12'),
(279, 245, 2, 'Scott Burton', 'From: Scott Burton\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nJerome High School\nTigers\nBlack & Orange\nBrent Johnson\nNathan Tracy\nScott Burton\nKelly Williams\nLindsay Garrard\nTaylor Mote\nChelsie Thompson\nTony Sedano\nLandon Driscoll\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Peyton Thompson	C	5-9	11\n	2	Jensen Cook	PG, G	5-8	11\n	3	Sayuri Sedano	SG	5-3	10\n	4	Annalee Elison	SG, SF	5-4	11\n	5	Ellie Helmer	SG	5-5	11\n	11	Emma Allen	SF, PF	5-9	12\n	12	Sawyer Garrard	PG, G	5-7	9\n	13	Nyla Holtzen	PF, SF	5-8	12\n	14	Emily Lloyd	SG, PF	5-10	12\n	20	Cameron Burton	SF	5-6	12\n	22	Ainsley Wallace	PF, C	5-8	11\n\n---------------------------------------------------------\nRECORD\n\n17	8\n\n29	Eagle	55\n61	Kimberly	23\n39	Bishop Kelly	50\n43	Shelley	72\n45	Capital	33\n44	Timberline	38\n48	Butte County	40\n61	Skyview	22\n51	Burley	31\n50	Highland (Poc)	33\n40	Columbia	28\n49	Kuna	42\n39	Mt View	43\n61	Kimberly	50\n59	Minico	44\n33	Mountain Home	73\n44	Twin Falls	38\n33	Burley	29\n56	Minico	22\n48	Mountain Home	49\n37	Twin Falls	38\n50	Burley	45\n41	Mountain Home	49\n49	Twin Falls	38\n46	Emmett	37\n\n---------------------------------------------------------\nSHIRTS\n\nScott Burton\nJerome High School\n5A\nBasketball - Girls\n\nM: 9\nL: 2\n\n\n\n\n---------------------------------------------------------\nIP: 135.134.17.24\nID: c06181d3-4a0c-4080-99b1-d932fba4d433\n', 'JeromeGBB.txt', '2025-02-16 22:03:12'),
(280, 246, 2, 'Jessica Muraski', 'From: Jessica Muraski\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMountain Home High School\nTigers\nOrange & Black\nJames Gilbert\nSam Gunderson\nJessica Muraski\nBrent Keener\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Madison Cotton	SG	5-6	11\n	2	Lexi Longhurst	PG	5-4	10\n	3	Ava Johnson	P	6-0	12\n	5	Jenna Jausoro	P	6-0	12\n	10	Kloey Borgen	W	5-7	11\n	11	Juli Donez	W	5-8	11\n	12	Anya Garza	G	5-4	10\n	14	Teagan Rivas	G	5-6	10\n	15	Jemma Schutte 	G	5-3	9\n	24	Payton Blodgett	G	5-8	11\n	32	Kaylen Trombley	G	5-4	10\n	33	Luna Moehn	P	5-7	10\n\n---------------------------------------------------------\nRECORD\n\n19	4\n\n74	Kimberly 	31\n59	Bishop Kelly 	45\n52	Centennial	39\n43	Capital	38\n54	Kimberly 	48\n64	Butte County (Tournament)	53\n72	Murtaugh (Tournament)	20\n32	Timberline (Tournament) 	50\n30	Boise (Tournament)	54\n74	Minico 	35\n55	Ridgevue 	38\n57	Cole Valley Christian (Tournament)	24\n47	Rocky Mountain (Tournament)	55\n39	Borah (Tournament)	40\n73	Jerome	33\n56	Twin Falls	47\n53	Burley 	43\n60	Minico	30\n49	Jerome	48\n49	Twin Falls	27\n54	Burley	48\n67	Twin Falls (Districts)	38\n49	Jerome (Districts)	41\n\n---------------------------------------------------------\nSHIRTS\n\nJessica Muraski\nMountain Home High School\n5A\nBasketball - Girls\n\nM: 9\nL: 3\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.109.166\nID: 9c2a3db9-dbec-47ed-a56a-82f4470b3fd8\n', 'MountainHomeGBB.txt', '2025-02-16 22:03:12'),
(281, 247, 2, 'Robert Parker', 'From: Robert Parker\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nPocatello High School\nThunder\nRed & Blue\nDoug Howell\nLisa Delonas\nRobert Parker\nSunny Evans\nNatalie Lewis\nJoshua Pollard\nChris Shuler\nHeather Enslinger\nAshlynn Keller\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	0	Adrie Johnson			12\n	1	Abby Lusk			11\n	3	Alivia Marshall			12\n	4	Oakley Hirschi			11\n	5	Hailee Pool			12\n	10	Trelawna Hargraves			12\n	11	Taylee Rogers			12\n	22	Kennasyn Garza			12\n	23	Tessa Hargraves			12\n	25	Saige Hagler			12\n\n---------------------------------------------------------\nRECORD\n\n19	2\n\n56	Bonneville	20\n55	Highland	29\n60	Hillcrest	44\n55	Minico	26\n59	Rigby	40\n58	Twin Falls	38\n52	Highland	39\n52	Madison	50\n66	Preston	20\n56	Twin Falls	17\n50	Century	15\n52	Westlake UT	65\n61	Teton	24\n48	Eagle	50\n55	Shelley	32\n64	Thunder Ridge	60\n84	Minico	21\n72	Century	32\n63	Preston	39\n37	Rigby	26\n66	Idaho Falls	58\n\n---------------------------------------------------------\nSHIRTS\n\nRobert Parker\nPocatello High School\n5A\nBasketball - Girls\n\nM: 4\nL: 1\nXL: 4\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 173.47.166.81\nID: 31975751-fada-40f7-a922-15d1f194f18e\n', 'PocatelloGBB.txt', '2025-02-16 22:03:12'),
(282, 248, 2, 'Zairrick Wadsworth', 'From: Zairrick Wadsworth\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nSkyline High School\nGrizzlies\nNavy & Light Blue\nKarla LaOrange\nJosh Newell\nZairrick Wadsworth\nTyrell Keck\nKelsey Bischoff\nKalin Keck\nRanae Merzlock\nMady Boyce\nTaylor Wilcox\nDrew Chapman\nPete Narwocki\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	0	Nelly Nunez	G		11\n	3	Paige Peebles	G		11\n	4	Ella Price	SG		12\n	5	Macy Marlow	PG		10\n	10	Brooklyn Mayes	G		11\n	13	Abby Muir	G		11\n	22	Shay Shippen	PG, SG	5-11	12\n	23	Madison Merzlock	SG, SF		11\n	24	Natalya Garcia	G		10\n\n---------------------------------------------------------\nRECORD\n\n16	8\n\n38	Owyhee	43\n63	Twin Falls	32\n49	Rocky Mountain	53\n57	Kuna	45\n41	Eagle	63\n58	Hillcrest	56\n39	Rigby	52\n66	Thunder Ridge	60\n47	Madison	49\n66	Bonneville	32\n61	Shelley	49\n75	Idaho Falls	51\n71	Uintah UT	49\n50	Mead CO	56\n60	Sandpoint	47\n50	Hillcrest	43\n64	Blackfoot	55\n51	Bonneville	49\n65	Idaho Falls	62\n75	Shelley	42\n45	Blackfoot	57\n61	Shelley	49\n43	Blackfoot	61\n67	Shelley	44\n\n---------------------------------------------------------\nCOMMENT\n\nI need additional Hooded Sweatshirts for coaches\r\n1 sm, 1 med, 3 large, 3 XL, 2 XXL\r\nPlease email me confirmation at wadszair@sd91.org\n\n---------------------------------------------------------\nSHIRTS\n\nZairrick Wadsworth\nSkyline High School\n5A\nBasketball - Girls\n\nM: 8\nL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 208.76.192.120\nID: 9956f4e4-3924-47d8-ae19-6eeea43569d6\n', 'SkylineGBB.txt', '2025-02-16 22:03:12'),
(283, 249, 2, 'Andy Ankeny', 'From: Andy Ankeny\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMiddleton High School\nVikings\nNavy & Gold\nMarc Gee\nJohnny Hullinger\nAndy Ankeny\nMarianne Blackwell\nRo Wiggins\nJenna Coburn\nQuinton Erhard\nShayla Hartman\nBryce Blackwell\nRya Floyd - Manager\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Zoey Blackwell	G	5-7	11\n	2	Olivia Blackwell	G	5-8	10\n	3	Mikylee Apple	G, W	5-8	10\n	5	Cadence Steele	G, W	5-10	10\n	10	Gracie Coombs	G	5-6	11\n	11	Elsie Wyatt	G	5-6	12\n	12	Berkley Rogers	G, W	5-10	9\n	15	Miley Steele	W	5-10	11\n	20	Dawn Holman	G, W	5-8	9\n	22	Finlee Fried	P	6-0	11\n	23	Aysha Fried	W, P	5-10	11\n	24	Megan Stewart	P	5-10	10\n	33	Olivia Pietrok	P	5-9	11\n\n---------------------------------------------------------\nRECORD\n\n23	1\n\n56	Timberline	30\n61	Boise	51\n59	Twin Falls	27\n70	Columbia	22\n38	Owyhee	50\n78	Vallivue	25\n50	Bishop Kelly	26\n82	Skyview	23\n94	Caldwell	13\n54	Mead (CO)	39\n56	Eagle	37\n57	Madison	48\n70	Emmett	23\n72	Nampa	6\n87	Columbia	21\n62	Skyview	22\n81	Caldwell	11\n65	Bishop Kelly	34\n90	Vallivue	9\n59	Emmett	27\n94	Nampa	16\n77	Nampa	12\n85	Columbia	31\n57	Bishop Kelly	30\n\n---------------------------------------------------------\nSHIRTS\n\nAndy Ankeny\nMiddleton High School\n5A\nBasketball - Girls\n\nL: 5\nXL: 8\n\n\n\n\n---------------------------------------------------------\nIP: 104.245.111.2\nID: 39e3792e-38e6-4f46-b150-b660c30fe649\n', 'MiddletonGBB.txt', '2025-02-16 22:03:12'),
(284, 250, 2, 'Tony Brulotte', 'From: Tony Brulotte\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nEagle High School\nMustangs\nGreen & Silver\nDerek Bub\nSusan McInerney\nTony Brulotte\nJeremy Munroe\nKari Green\nLauren Brady\nKori Liggins\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	0	Alyson Vieira	PG, SG	5-9	12\n	2	Izzy Elitharp	SF, PF	5-8	10\n	3	Taya Nelson	PG, SG	5-8	10\n	5	Brooke Vargas	PG, SG	5-8	11\n	10	Anli Brown	PG, SG	5-3	12\n	11	Peyton Wilson	C, F	6-1	12\n	15	Bella Thompson	PG, SG	5-6	11\n	22	Camryn Hunt	PG, SG	5-4	12\n	23	Ryann Ellsworth	SG, PG	5-6	10\n	30	Berkley Jones	SF, SG	5-9	10\n	32	Peyten Taylor	SF, PF	5-8	11\n	33	Charlotte White	C	6-3	12\n	44	Porter Wood	F, C	6-1	12\n\n---------------------------------------------------------\nRECORD\n\n19	5\n\n55	Jerom	29\n60	Thunder Ridge	43\n50	Madison	45\n63	Skyline	41\n68	Coeur D\' Alene	49\n62	Lake City	49\n77	Post Falls	32\n64	Centennial	46\n59	Boise	56\n45	Borah	50\n55	Rigby	40\n37	Middleton	56\n50	Pocatello	48\n43	Owyhee	63\n53	Timberline	56\n69	Capital	62\n76	Meridian	29\n70	Mountain View	32\n68	Kuna	55\n52	Rocky Mountain	43\n54	Ridgevue	40\n55	Timberline	32\n50	Owyhee	46\n48	Boise	55\n\n---------------------------------------------------------\nSHIRTS\n\nTony Brulotte\nEagle High School\n6A\nBasketball - Girls\n\n\nM: 4\nL: 6\nXL: 3\n\n\n\n---------------------------------------------------------\nIP: 67.42.76.41\nID: b23eb482-985a-4cf7-84ce-39e26d70589d\n', 'EagleGBB.txt', '2025-02-16 22:03:12'),
(285, 251, 2, 'Shayne Proctor', 'From: Shayne Proctor\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nMadison High School\nBobcats\nRed, White & Gray\nRandy Lords\nBradee Klassen\nShayne Proctor\nLuke Sutton\nPreston Berry\nKirk Ricks\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Laci Hymas	SG		12\n	2	Torey Parker	PF		11\n	3	Sloane Humpherys	PG		10\n	10	Nora Waddoups	SF		12\n	11	Marissa Dayton	SF		11\n	13	Mia Walsh	SG		11\n	20	Jocelyn Jephson	SF		12\n	21	Aspen Boice	PF		11\n	22	Camri Call	SG		11\n	23	Maggie Anderson	SG		12\n	31	Sloane Ellingford	SG		12\n	32	Emily Stoeber	PF		12\n	33	Brielle Nite	SF		11\n\n---------------------------------------------------------\nRECORD\n\n16	8\n\n43	Idaho Falls	45\n52	Kuna	30\n45	Eagle	50\n54	Rocky Mountain	39\n49	Hillcrest	29\n49	Skyline	46\n50	Pocatello	52\n49	Canyon Ridge	21\n46	Thunder Ridge	51\n43	Regis Jesuit (CO)	33\n39	Westlake (UT)	35\n48	Middleton	57\n43	Rigby	46\n58	Blackfoot	49\n61	Canyon Ridge	24\n50	Thunder Ridge	33\n57	Bonneville	37\n60	Highland	40\n41	Rigby	43\n67	Highland 	59\n54	Shelley	45\n55	Thunder Ridge	38\n45	Rigby	55\n41	Thunder Ridge	38\n\n---------------------------------------------------------\nSHIRTS\n\nShayne Proctor\nMadison High School\n6A\nBasketball - Girls\n\nS: 1\nM: 5\nL: 7\n\n\n\n\n---------------------------------------------------------\nIP: 192.225.186.74\nID: 92226065-7a9f-478c-bc67-a89593df2add\n', 'MadisonGBB.txt', '2025-02-16 22:03:12'),
(286, 252, 2, 'Brian Barber', 'From: Brian Barber\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBoise High School\nBrave\nRed & White\nLisa Roberts\nDeborah Watts\nBrian Barber\nKim Brydges\nRon Marthe\nIssy Siegrist\nSeth Newville\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	3	Kaity Haan	G	6-0	12\n	5	RyLynn Ruffing	G	6-1	9\n	10	Morgan Montgomery	G	5-7	12\n	11	Norah Woodland	G	5-7	12\n	12	Alison Turcke	G	5-8	12\n	13	Avery Patricco	G	5-8	12\n	15	Libby Nelson	SG	5-8	11\n	21	Caroline Wyatt	G	5-7	12\n	23	Scarlett Meyer	G	5-8	10\n	24	Presley Binder	G	5-9	12\n	25	Ramsey Binder	G	5-9	11\n	32	Olivia Chatfield	G	5-8	11\n	33	Brynn Schindele	G	5-8	10\n	34	Nya Pellant-Latham	F	6-0	10\n\n---------------------------------------------------------\nRECORD\n\n18	3\n\n46	Rigby	37\n50	Kuna	49\n51	Middleton	61\n53	Coeur d\' Alene	44\n54	Lake City	30\n76	Post Falls	46\n45	Timberline	34\n66	Borah	41\n36	Owyhee	43\n68	Bishop Kelly	33\n56	Eagle	59\n57	Mountain View	29\n61	Kuna	54\n63	Ridgevue	37\n63	Centennial	28\n37	Borah	31\n58	Rocky Mountain	42\n53	Timberline	45\n55	Capital	33\n81	Meridian	34\n\n---------------------------------------------------------\nSHIRTS\n\nBrian Barber\nBoise High School\n6A\nBasketball - Girls\n\nS: 1\nM: 2\nL: 11\n\n\n\n\n---------------------------------------------------------\nIP: 207.244.138.10\nID: a8129281-66da-49d9-bb02-623d9c549113\n', 'BoiseGBB.txt', '2025-02-16 22:03:12'),
(287, 253, 2, 'Ty Shippen', 'From: Ty Shippen\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nRigby High School\nTrojans\nMaroon & Gold\nChad Martin\nBryan Lords\nTy Shippen\nTodd Barber\nErica Dansie\nAli Carpenter\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Kinzley Larsen	SG, PG	5-8	11\n	3	Sienna Clifford	SG	5-6	11\n	4	Brinley Larsen	PG, SG	5-8	10\n	5	Meika Mathews	PG, SG	5-7	10\n	11	Allie Dansie	PG	5-10	10\n	20	Bailey Barber	G	5-10	11\n	23	Sydney Berrett	SF	5-10	12\n	24	Lauren Burnside	F	6-0	11\n	32	Jillian Nelson	PF, C	5-9	12\n	33	Taycee Holm	C	6-1	10\n	45	Tiade Togiai	C	6-1	12\n\n---------------------------------------------------------\nRECORD\n\n16	7\n\n46	Boise	37\n26	Owyhee	40\n65	Bonneville	12\n18	Blackfoot	30\n40	Pocatello	59\n52	Skyline	39\n64	Shelley	57\n45	Thunder Ridge	15\n52	Highland	45\n78	Canyon Ridge	19\n40	Eagle	55\n65	Idaho Falls	39\n44	Regis Jesuit CO	54\n46	Madison	43\n54	Thunder Ridge	52\n56	Highland 	28\n74	Canyon Ridge	23\n55	West Field UT	41\n43	Madison	41\n26	Pocatello 	37\n56	Hillcrest	48\n68	Canyon Ridge	22\n55	Madison	45\n\n---------------------------------------------------------\nSHIRTS\n\nTy Shippen\nRigby High School\n6A\nBasketball - Girls\n\nM: 3\nL: 7\nXL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 162.249.30.7\nID: 451a7e38-ab38-43ba-b404-322cc862de0b\n', 'RigbyGBB.txt', '2025-02-16 22:03:12'),
(288, 254, 2, 'Dane Roy', 'From: Dane Roy\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nOwyhee High School\nStorm\nRed & Grey\nDerek Bub\nRachel Edwards\nDane Roy\nGeorge Rodgriguez\nJeff Davis\nJacob Doty\nMackenzie Radford\nSylvia Conley\nSerena Stranger\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Josie Davis	G	5-8	12\n	2	Saylor Shoemaker	G	5-8	11\n	3	Madi Brooks	G	5-7	12\n	4	Audrey McKenna	G	5-10	11\n	10	Addy Wright	G	5-7	12\n	11	Mikale Roy	G	5-11	12\n	14	Riley Beck	F	6-1	12\n	20	Grace Brooks	F	5-8	12\n	21	Aubree Hamilton	G	5-7	9\n	32	Aysha Bailey	G	5-7	12\n	33	Maiya Hardy	F	5-11	12\n\n---------------------------------------------------------\nRECORD\n\n22	2\n\n43	Skyline	38\n40	Rigby	26\n70	Post Falls	33\n50	Coeur d\'Alene	41\n59	Lake City	41\n43	Boise	36\n50	Middleton	38\n66	Meridian	37\n61	Paramount	33\n62	DPAC	63\n57	Mt Diablo	33\n47	Vanden	36\n50	Timberline	28\n63	Eagle	43\n70	Centennial	20\n53	Mountain View	32\n67	Kuna	39\n55	Ridgevue	29\n58	Capital	44\n46	Borah	29\n60	Rocky Mountain	32\n54	Ridgevue	23\n46	Eagle	50\n54	Capital	38\n\n---------------------------------------------------------\nSHIRTS\n\nDane Roy\nOwyhee High School\n6A\nBasketball - Girls\n\nL: 6\nXL: 5\n\n\n\n\n---------------------------------------------------------\nIP: 64.226.154.160\nID: c087bab2-eaf2-4dfe-9cec-726b88707181\n', 'OwyheeGBB.txt', '2025-02-16 22:03:12'),
(289, 255, 2, 'Vince Mann', 'From: Vince Mann\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nBorah High School\nLions\nGreen & Gold\nLisa Roberts\nTim Standlee\nVince Mann\nEbony Norman\nShamBrick Williams\nKayla Haley-Agbeko\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Karli Hall	PG	5-3	11\n	2	Savannah Evans	PG	5-0	12\n	3	Vita Romeo	PG	5-5	12\n	5	Rylee Hale	G, W	5-8	10\n	10	Amayah Defares	G, PG	5-9	12\n	11	Brooklyn Gardiner	PG, G	5-7	10\n	12	Abi Howington	W, G	5-10	11\n	15	Nakiyia Percell	G, W	6-0	10\n	20	Kamryn Krasselt	G, W	5-8	10\n	24	Brinley Chase	G, W	6-1	9\n	25	Kya Davis	G, W	6-1	10\n	40	Hannah Romberg	C	6-2	11\n	42	Myyah Rigsbee	W	5-8	10\n\n---------------------------------------------------------\nRECORD\n\n15	3\n\n57	Capital High School	47\n59	Ridgevue High School 	37\n64	Meridian High School	33\n66	Timberline High School-Boise	63\n41	Boise High School	66\n48	Kuna High School	43\n58	Centennial High School	42\n53	Mountain View High School 	33\n44	Timberline High School-Boise 	20\n50	Eagle High School 	45\n45	Ridgevue High School	28\n54	Rocky Mountain High School 	31\n46	Kuna High School	21\n31	Boise High School 	37\n56	Meridian High School	26\n29	Owyhee High School	46\n42	Mountain View High School 	32\n31	Capital High School	30\n\n---------------------------------------------------------\nCOMMENT\n\nthank you!\n\n---------------------------------------------------------\nSHIRTS\n\nVince Mann\nBorah High School\n6A\nBasketball - Girls\n\nS: 1\nM: 3\nL: 5\nXL: 3\n2XL: 1\n\n\n\n\n---------------------------------------------------------\nIP: 207.244.138.11\nID: 85207ae8-3955-4803-970e-4376b78e9e51\n', 'BorahGBB.txt', '2025-02-16 22:03:12'),
(290, 256, 2, 'Norma Alley', 'From: Norma Alley\nActivity: Basketball - Girls\n\n---------------------------------------------------------\nSCHOOL\n\nCoeur d\'Alene High School\nVikings\nRoyal & White\nShon Hocker\nMike Randles\nVictoria Beecher\nStacy Boyd\n\n---------------------------------------------------------\nROSTER\n\n	jersey	name	position	height	grade\n	1	Kyndal Bridge	G, F	5-6	10\n	2	Lexie Wheeler	G	5-8	9\n	5	Natalie Semprimoznik	PG	5-10	11\n	10	Karisa Wallis	F	5-10	11\n	11	Brookeslee Colvin	PG	5-10	10\n	21	Chloe Murphree	G	5-4	9\n	23	Sophie Holecek	F	5-9	10\n	24	Hannah Shafer	C	6-	10\n	40	Carlee Bowmer	F	5-8	11\n	54	Kelsey Caroll	PF	5-11	12\n	55	Sabre Reardon	C	6-	9\n\n---------------------------------------------------------\nRECORD\n\n14	7\n\n44	Boise	53\n41	Owyhee	50\n67	Mountain View	46\n70	Lewiston	33\n49	Eagle	68\n55	Meridian	35\n59	Rocky Mountain	44\n79	Sandpoint	55\n56	Dear Park (WA)	75\n40	Francis Parker (CA)	47\n75	Birmingham Charter (CA)	66\n56	Sierra Canyon (CA)	69\n59	Francis Parker (CA)	68\n49	Timberlake	38\n61	Post Falls	50\n75	Lake City	39\n62	Sandpoint	40\n63	Moscow	30\n72	Lake City	51\n82	Post Falls	57\n74	Lakeland	43\n\n---------------------------------------------------------\nSHIRTS\n\nNorma Alley\nCoeur d\'Alene High School\n6A\nBasketball - Girls\n\nM: 5\nL: 6\n\n\n\n\n---------------------------------------------------------\nIP: 162.218.182.13\nID: df56a604-9dc5-4b24-a13f-57c8d334b6ef\n', 'CoeurdAleneGBB.txt', '2025-02-16 22:03:12');

-- --------------------------------------------------------

--
-- Table structure for table `morderitems`
--

CREATE TABLE `morderitems` (
  `mOrderItemsID` int(11) NOT NULL,
  `messageOrderID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `mOrderItemsQuantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `morderitems`
--

INSERT INTO `morderitems` (`mOrderItemsID`, `messageOrderID`, `itemID`, `mOrderItemsQuantity`) VALUES
(2, 1, 35, 1),
(3, 8, 35, 1),
(4, 9, 35, 2),
(5, 15, 35, 1),
(6, 16, 35, 1),
(7, 24, 35, 1),
(8, 28, 35, 2),
(9, 30, 35, 1),
(10, 34, 35, 2),
(11, 36, 35, 1),
(12, 41, 35, 1),
(13, 42, 35, 2),
(14, 45, 35, 1),
(15, 51, 35, 1),
(16, 55, 35, 2),
(17, 59, 35, 1),
(18, 61, 35, 1),
(19, 69, 35, 1),
(20, 71, 35, 4),
(21, 72, 35, 1),
(22, 73, 35, 1),
(23, 75, 35, 1),
(24, 81, 35, 1),
(25, 84, 35, 1),
(26, 86, 35, 2),
(27, 87, 35, 2),
(28, 89, 35, 7),
(29, 90, 35, 2),
(30, 91, 35, 5),
(31, 92, 35, 3),
(32, 93, 35, 2),
(33, 95, 35, 4),
(34, 97, 35, 1),
(35, 99, 35, 1),
(36, 100, 35, 6),
(37, 103, 35, 1),
(38, 104, 35, 5),
(39, 105, 35, 5),
(40, 106, 35, 12),
(41, 108, 35, 2),
(42, 113, 35, 9),
(43, 115, 35, 1),
(44, 118, 35, 1),
(45, 121, 35, 7),
(46, 122, 35, 3),
(47, 123, 35, 2),
(48, 124, 35, 10),
(49, 125, 35, 3),
(50, 126, 35, 3),
(51, 127, 35, 10),
(52, 129, 35, 1),
(53, 132, 35, 1),
(56, 139, 35, 2),
(57, 140, 35, 5),
(58, 144, 35, 1),
(59, 149, 35, 2),
(60, 152, 35, 3),
(61, 153, 35, 5),
(62, 154, 35, 1),
(63, 156, 35, 2),
(64, 157, 35, 4),
(65, 158, 35, 1),
(66, 160, 35, 4),
(67, 161, 35, 3),
(68, 163, 35, 1),
(69, 164, 35, 9),
(70, 165, 35, 1),
(71, 166, 35, 1),
(72, 167, 35, 2),
(73, 169, 35, 7),
(74, 170, 35, 1),
(75, 171, 35, 4),
(76, 175, 35, 1),
(77, 177, 35, 2),
(78, 178, 35, 3),
(79, 179, 35, 2),
(80, 180, 35, 3),
(81, 181, 35, 4),
(82, 182, 35, 2),
(83, 183, 35, 3),
(84, 186, 35, 5),
(85, 187, 35, 3),
(86, 188, 35, 1),
(87, 189, 35, 1),
(129, 1, 36, 10),
(130, 2, 36, 2),
(131, 5, 36, 2),
(132, 6, 36, 5),
(133, 8, 36, 4),
(134, 9, 36, 4),
(135, 10, 36, 1),
(136, 11, 36, 3),
(137, 12, 36, 1),
(138, 13, 36, 1),
(139, 14, 36, 1),
(140, 15, 36, 5),
(141, 16, 36, 1),
(142, 17, 36, 1),
(143, 18, 36, 1),
(144, 19, 36, 1),
(145, 20, 36, 2),
(146, 21, 36, 3),
(147, 22, 36, 5),
(148, 23, 36, 1),
(149, 24, 36, 1),
(150, 25, 36, 4),
(151, 26, 36, 2),
(152, 28, 36, 3),
(153, 30, 36, 6),
(154, 31, 36, 5),
(155, 32, 36, 1),
(156, 34, 36, 5),
(157, 36, 36, 4),
(158, 37, 36, 4),
(159, 38, 36, 2),
(160, 40, 36, 1),
(161, 41, 36, 4),
(162, 42, 36, 4),
(163, 44, 36, 1),
(164, 45, 36, 1),
(165, 46, 36, 2),
(166, 48, 36, 1),
(167, 49, 36, 2),
(168, 51, 36, 2),
(169, 52, 36, 4),
(170, 55, 36, 2),
(171, 57, 36, 3),
(172, 58, 36, 2),
(173, 59, 36, 1),
(174, 60, 36, 1),
(175, 62, 36, 2),
(176, 64, 36, 2),
(177, 65, 36, 2),
(178, 66, 36, 4),
(179, 67, 36, 1),
(180, 68, 36, 2),
(181, 69, 36, 3),
(182, 70, 36, 1),
(183, 71, 36, 5),
(184, 72, 36, 6),
(185, 73, 36, 3),
(186, 74, 36, 1),
(187, 75, 36, 4),
(188, 76, 36, 2),
(189, 77, 36, 1),
(190, 78, 36, 3),
(191, 79, 36, 1),
(192, 80, 36, 1),
(193, 81, 36, 5),
(194, 82, 36, 4),
(195, 83, 36, 1),
(196, 86, 36, 1),
(197, 87, 36, 6),
(198, 88, 36, 10),
(199, 89, 36, 11),
(200, 90, 36, 10),
(201, 91, 36, 16),
(202, 92, 36, 18),
(203, 93, 36, 13),
(204, 94, 36, 13),
(205, 95, 36, 4),
(206, 96, 36, 15),
(207, 97, 36, 10),
(208, 98, 36, 2),
(209, 99, 36, 7),
(210, 100, 36, 14),
(211, 102, 36, 7),
(212, 103, 36, 18),
(213, 104, 36, 14),
(214, 105, 36, 11),
(215, 106, 36, 9),
(216, 107, 36, 3),
(217, 108, 36, 10),
(218, 110, 36, 5),
(219, 111, 36, 6),
(220, 113, 36, 9),
(221, 114, 36, 2),
(222, 115, 36, 7),
(223, 116, 36, 5),
(224, 117, 36, 7),
(225, 118, 36, 12),
(226, 119, 36, 7),
(227, 120, 36, 4),
(228, 121, 36, 9),
(229, 122, 36, 14),
(230, 123, 36, 10),
(231, 124, 36, 9),
(232, 125, 36, 10),
(233, 126, 36, 13),
(234, 127, 36, 9),
(235, 128, 36, 10),
(236, 129, 36, 7),
(237, 130, 36, 4),
(238, 131, 36, 3),
(239, 132, 36, 12),
(240, 133, 36, 11),
(241, 134, 36, 19),
(244, 138, 36, 8),
(245, 139, 36, 6),
(246, 140, 36, 11),
(247, 141, 36, 5),
(248, 142, 36, 22),
(249, 144, 36, 9),
(250, 146, 36, 11),
(251, 147, 36, 6),
(252, 148, 36, 1),
(253, 149, 36, 7),
(254, 150, 36, 7),
(255, 151, 36, 5),
(256, 152, 36, 2),
(257, 153, 36, 8),
(258, 154, 36, 7),
(259, 155, 36, 5),
(260, 156, 36, 7),
(261, 157, 36, 16),
(262, 158, 36, 10),
(263, 159, 36, 1),
(264, 160, 36, 12),
(265, 161, 36, 4),
(266, 162, 36, 4),
(267, 163, 36, 1),
(268, 164, 36, 3),
(269, 166, 36, 8),
(270, 167, 36, 9),
(271, 168, 36, 1),
(272, 169, 36, 8),
(273, 170, 36, 4),
(274, 171, 36, 17),
(275, 172, 36, 3),
(276, 173, 36, 3),
(277, 174, 36, 1),
(278, 175, 36, 7),
(279, 176, 36, 2),
(280, 177, 36, 9),
(281, 178, 36, 8),
(282, 179, 36, 11),
(283, 180, 36, 4),
(284, 181, 36, 2),
(285, 182, 36, 3),
(286, 183, 36, 2),
(287, 184, 36, 1),
(288, 185, 36, 1),
(289, 186, 36, 10),
(290, 187, 36, 4),
(291, 188, 36, 14),
(292, 189, 36, 1),
(293, 190, 36, 10),
(384, 1, 37, 6),
(385, 2, 37, 2),
(386, 3, 37, 1),
(387, 4, 37, 1),
(388, 5, 37, 1),
(389, 7, 37, 7),
(390, 10, 37, 2),
(391, 11, 37, 2),
(392, 12, 37, 1),
(393, 13, 37, 1),
(394, 14, 37, 8),
(395, 15, 37, 1),
(396, 17, 37, 4),
(397, 18, 37, 2),
(398, 20, 37, 1),
(399, 21, 37, 1),
(400, 22, 37, 3),
(401, 23, 37, 3),
(402, 24, 37, 1),
(403, 26, 37, 4),
(404, 27, 37, 1),
(405, 28, 37, 1),
(406, 32, 37, 2),
(407, 33, 37, 10),
(408, 35, 37, 4),
(409, 38, 37, 3),
(410, 39, 37, 4),
(411, 40, 37, 5),
(412, 41, 37, 3),
(413, 42, 37, 3),
(414, 43, 37, 2),
(415, 44, 37, 7),
(416, 45, 37, 3),
(417, 46, 37, 2),
(418, 49, 37, 4),
(419, 50, 37, 5),
(420, 51, 37, 1),
(421, 52, 37, 3),
(422, 54, 37, 1),
(423, 56, 37, 4),
(424, 57, 37, 3),
(425, 58, 37, 2),
(426, 60, 37, 4),
(427, 62, 37, 3),
(428, 63, 37, 1),
(429, 64, 37, 4),
(430, 65, 37, 2),
(431, 66, 37, 5),
(432, 67, 37, 1),
(433, 68, 37, 6),
(434, 69, 37, 2),
(435, 70, 37, 4),
(436, 72, 37, 1),
(437, 73, 37, 4),
(438, 74, 37, 2),
(439, 75, 37, 1),
(440, 76, 37, 2),
(441, 77, 37, 3),
(442, 78, 37, 1),
(443, 81, 37, 2),
(444, 82, 37, 3),
(445, 85, 37, 1),
(446, 87, 37, 9),
(447, 88, 37, 10),
(448, 89, 37, 2),
(449, 90, 37, 9),
(450, 93, 37, 3),
(451, 94, 37, 8),
(452, 95, 37, 11),
(453, 96, 37, 4),
(454, 97, 37, 7),
(455, 98, 37, 17),
(456, 99, 37, 9),
(457, 100, 37, 2),
(458, 101, 37, 18),
(459, 102, 37, 15),
(460, 103, 37, 2),
(461, 104, 37, 3),
(462, 105, 37, 5),
(463, 106, 37, 1),
(464, 107, 37, 14),
(465, 108, 37, 5),
(466, 109, 37, 12),
(467, 110, 37, 13),
(468, 111, 37, 16),
(469, 112, 37, 22),
(470, 113, 37, 4),
(471, 114, 37, 14),
(472, 115, 37, 13),
(473, 116, 37, 15),
(474, 117, 37, 14),
(475, 118, 37, 5),
(476, 119, 37, 13),
(477, 120, 37, 14),
(478, 121, 37, 5),
(479, 122, 37, 5),
(480, 123, 37, 8),
(481, 124, 37, 1),
(482, 125, 37, 8),
(483, 126, 37, 6),
(484, 127, 37, 1),
(485, 128, 37, 12),
(486, 129, 37, 14),
(487, 130, 37, 22),
(488, 131, 37, 11),
(489, 132, 37, 9),
(490, 133, 37, 9),
(491, 134, 37, 2),
(494, 138, 37, 35),
(495, 139, 37, 28),
(496, 140, 37, 16),
(497, 141, 37, 10),
(498, 142, 37, 17),
(499, 143, 37, 20),
(500, 144, 37, 16),
(501, 145, 37, 2),
(502, 146, 37, 23),
(503, 147, 37, 23),
(504, 148, 37, 13),
(505, 149, 37, 10),
(506, 150, 37, 19),
(507, 152, 37, 3),
(508, 153, 37, 4),
(509, 154, 37, 9),
(510, 155, 37, 5),
(511, 156, 37, 9),
(512, 157, 37, 10),
(513, 158, 37, 14),
(514, 160, 37, 5),
(515, 161, 37, 2),
(516, 162, 37, 3),
(517, 163, 37, 1),
(518, 164, 37, 4),
(519, 166, 37, 4),
(520, 167, 37, 5),
(521, 168, 37, 1),
(522, 169, 37, 4),
(523, 170, 37, 4),
(524, 171, 37, 9),
(525, 172, 37, 4),
(526, 173, 37, 2),
(527, 174, 37, 1),
(528, 175, 37, 3),
(529, 176, 37, 2),
(530, 177, 37, 4),
(531, 178, 37, 3),
(532, 179, 37, 10),
(533, 180, 37, 1),
(534, 181, 37, 4),
(535, 182, 37, 2),
(536, 183, 37, 5),
(537, 184, 37, 1),
(538, 185, 37, 1),
(539, 186, 37, 5),
(540, 187, 37, 5),
(541, 188, 37, 14),
(542, 189, 37, 2),
(543, 190, 37, 6),
(639, 1, 38, 4),
(640, 5, 38, 1),
(641, 6, 38, 1),
(642, 10, 38, 1),
(643, 11, 38, 1),
(644, 17, 38, 2),
(645, 18, 38, 1),
(646, 20, 38, 1),
(647, 25, 38, 3),
(648, 30, 38, 2),
(649, 32, 38, 1),
(650, 38, 38, 3),
(651, 39, 38, 2),
(652, 40, 38, 1),
(653, 42, 38, 1),
(654, 43, 38, 2),
(655, 50, 38, 1),
(656, 56, 38, 1),
(657, 62, 38, 1),
(658, 64, 38, 1),
(659, 67, 38, 2),
(660, 69, 38, 1),
(661, 70, 38, 1),
(662, 73, 38, 1),
(663, 74, 38, 1),
(664, 76, 38, 5),
(665, 82, 38, 1),
(666, 86, 38, 1),
(667, 87, 38, 5),
(668, 88, 38, 1),
(669, 90, 38, 1),
(670, 93, 38, 2),
(671, 94, 38, 1),
(672, 95, 38, 1),
(673, 96, 38, 1),
(674, 97, 38, 3),
(675, 98, 38, 1),
(676, 99, 38, 4),
(677, 101, 38, 4),
(678, 107, 38, 4),
(679, 108, 38, 3),
(680, 109, 38, 8),
(681, 110, 38, 2),
(682, 114, 38, 6),
(683, 115, 38, 1),
(684, 116, 38, 2),
(685, 118, 38, 3),
(686, 119, 38, 2),
(687, 120, 38, 4),
(688, 124, 38, 1),
(689, 125, 38, 1),
(690, 130, 38, 1),
(691, 131, 38, 8),
(692, 135, 38, 1),
(695, 138, 38, 23),
(696, 139, 38, 10),
(697, 140, 38, 8),
(698, 141, 38, 8),
(699, 142, 38, 13),
(700, 143, 38, 28),
(701, 144, 38, 11),
(702, 145, 38, 3),
(703, 146, 38, 21),
(704, 147, 38, 20),
(705, 148, 38, 4),
(706, 149, 38, 6),
(707, 150, 38, 6),
(708, 151, 38, 1),
(709, 153, 38, 1),
(710, 154, 38, 2),
(711, 156, 38, 3),
(712, 157, 38, 1),
(713, 158, 38, 9),
(714, 160, 38, 1),
(715, 162, 38, 1),
(716, 164, 38, 2),
(717, 166, 38, 4),
(718, 167, 38, 1),
(719, 169, 38, 1),
(720, 170, 38, 2),
(721, 171, 38, 6),
(722, 172, 38, 1),
(723, 173, 38, 1),
(724, 177, 38, 1),
(725, 178, 38, 5),
(726, 179, 38, 2),
(727, 180, 38, 1),
(728, 181, 38, 1),
(729, 182, 38, 1),
(730, 183, 38, 2),
(731, 185, 38, 2),
(732, 186, 38, 4),
(733, 188, 38, 5),
(734, 190, 38, 1),
(766, 1, 39, 1),
(767, 22, 39, 2),
(768, 29, 39, 1),
(769, 47, 39, 1),
(770, 56, 39, 1),
(771, 95, 39, 2),
(772, 97, 39, 1),
(773, 109, 39, 2),
(774, 138, 39, 5),
(775, 139, 39, 10),
(776, 142, 39, 2),
(777, 143, 39, 10),
(778, 146, 39, 4),
(779, 147, 39, 8),
(780, 149, 39, 4),
(781, 150, 39, 1),
(782, 154, 39, 1),
(783, 156, 39, 1),
(784, 157, 39, 2),
(785, 160, 39, 1),
(786, 164, 39, 1),
(787, 167, 39, 1),
(788, 171, 39, 3),
(789, 173, 39, 1),
(790, 178, 39, 1),
(791, 180, 39, 1),
(792, 181, 39, 1),
(797, 139, 40, 4),
(798, 142, 40, 2),
(799, 146, 40, 1),
(800, 147, 40, 3),
(801, 169, 40, 1),
(802, 187, 40, 1),
(803, 53, 36, 4),
(804, 53, 37, 8),
(805, 202, 36, 2),
(806, 202, 37, 3),
(807, 203, 36, 2),
(808, 203, 37, 2),
(809, 203, 38, 1),
(810, 204, 37, 1),
(811, 205, 37, 5),
(812, 206, 35, 1),
(813, 206, 36, 1),
(814, 206, 37, 3),
(815, 207, 35, 3),
(816, 207, 36, 12),
(817, 207, 37, 7),
(818, 207, 38, 1),
(819, 208, 35, 2),
(820, 208, 36, 12),
(821, 208, 37, 9),
(822, 209, 35, 6),
(823, 209, 36, 17),
(824, 209, 37, 5),
(825, 209, 38, 2),
(826, 210, 35, 7),
(827, 210, 36, 3),
(828, 210, 37, 1),
(829, 210, 39, 1),
(830, 211, 35, 7),
(831, 211, 36, 23),
(832, 211, 37, 6),
(833, 212, 35, 6),
(834, 212, 36, 18),
(835, 212, 37, 4),
(836, 213, 35, 5),
(837, 213, 36, 16),
(838, 213, 37, 8),
(839, 213, 38, 1),
(840, 214, 36, 21),
(841, 214, 37, 4),
(842, 214, 38, 1),
(843, 215, 35, 2),
(844, 215, 36, 15),
(845, 215, 37, 4),
(846, 215, 38, 1),
(847, 216, 35, 4),
(848, 216, 36, 12),
(849, 216, 37, 3),
(850, 216, 38, 2),
(851, 217, 35, 13),
(852, 217, 36, 14),
(853, 217, 37, 7),
(854, 217, 38, 1),
(855, 218, 35, 5),
(856, 218, 36, 11),
(857, 219, 35, 3),
(858, 219, 36, 4),
(859, 219, 37, 6),
(860, 219, 38, 2),
(861, 220, 35, 4),
(862, 220, 36, 27),
(863, 221, 35, 1),
(864, 221, 36, 25),
(865, 221, 37, 6),
(866, 222, 35, 1),
(867, 222, 36, 6),
(868, 222, 37, 1),
(869, 223, 36, 7),
(870, 223, 37, 2),
(871, 224, 36, 3),
(872, 224, 37, 2),
(873, 225, 36, 8),
(874, 225, 37, 10),
(875, 226, 35, 1),
(876, 226, 36, 6),
(877, 226, 37, 17),
(878, 226, 38, 1),
(879, 227, 35, 7),
(880, 227, 36, 8),
(881, 227, 37, 3),
(882, 227, 38, 1),
(883, 228, 35, 5),
(884, 228, 36, 6),
(885, 229, 35, 18),
(886, 229, 36, 3),
(887, 229, 37, 1),
(888, 230, 35, 19),
(889, 230, 36, 9),
(890, 230, 37, 4),
(891, 230, 38, 2),
(892, 230, 39, 1),
(893, 231, 36, 22),
(894, 231, 37, 7),
(895, 231, 38, 1),
(896, 232, 35, 1),
(897, 232, 36, 6),
(898, 232, 37, 17),
(899, 233, 35, 4),
(900, 233, 36, 23),
(901, 234, 35, 5),
(902, 234, 36, 12),
(903, 234, 37, 6),
(904, 235, 35, 1),
(905, 235, 36, 23),
(906, 235, 37, 1),
(907, 236, 35, 4),
(908, 236, 36, 18),
(909, 236, 37, 1),
(910, 237, 35, 14),
(911, 237, 36, 7),
(912, 237, 37, 1),
(913, 238, 35, 6),
(914, 238, 36, 2),
(915, 238, 37, 2),
(916, 238, 38, 3),
(917, 239, 36, 12),
(918, 240, 35, 2),
(919, 240, 36, 15),
(920, 241, 35, 8),
(921, 241, 36, 16),
(922, 241, 37, 4),
(923, 242, 35, 13),
(924, 242, 36, 6),
(925, 242, 37, 1),
(926, 243, 35, 5),
(927, 243, 36, 12),
(928, 243, 37, 1),
(929, 244, 35, 2),
(930, 244, 36, 13),
(931, 244, 37, 14),
(932, 244, 38, 4),
(933, 245, 35, 3),
(934, 245, 36, 23),
(935, 245, 37, 3),
(936, 246, 35, 2),
(937, 246, 36, 17),
(938, 246, 37, 11),
(939, 247, 35, 2),
(940, 247, 36, 13),
(941, 247, 37, 4),
(942, 247, 38, 1),
(943, 248, 35, 2),
(944, 248, 36, 5),
(945, 248, 37, 3),
(946, 249, 35, 2),
(947, 249, 36, 15),
(948, 249, 37, 4),
(949, 249, 39, 1),
(950, 250, 35, 12),
(951, 250, 36, 10),
(952, 250, 37, 4),
(953, 250, 38, 1),
(954, 251, 35, 11),
(955, 251, 36, 8),
(956, 252, 35, 4),
(957, 252, 36, 8),
(958, 252, 37, 1),
(959, 252, 38, 1),
(960, 252, 39, 1),
(961, 253, 35, 8),
(962, 253, 36, 6),
(963, 253, 37, 2),
(964, 253, 39, 1),
(965, 254, 35, 17),
(966, 254, 36, 5),
(967, 255, 35, 6),
(968, 255, 36, 5),
(969, 256, 35, 7),
(970, 256, 36, 12),
(971, 256, 37, 1),
(972, 257, 35, 9),
(973, 257, 36, 3),
(974, 257, 38, 1),
(975, 258, 35, 5),
(976, 258, 36, 7),
(977, 259, 35, 5),
(978, 259, 36, 6),
(979, 260, 36, 8),
(980, 260, 37, 1),
(981, 261, 35, 2),
(982, 261, 36, 10),
(983, 261, 37, 1),
(984, 262, 35, 9),
(985, 262, 36, 1),
(986, 262, 37, 1),
(987, 263, 35, 1),
(988, 263, 36, 9),
(989, 264, 35, 2),
(990, 264, 36, 8),
(991, 264, 37, 2),
(992, 265, 35, 4),
(993, 265, 36, 9),
(994, 265, 37, 1),
(995, 266, 35, 2),
(996, 266, 36, 7),
(997, 266, 37, 5),
(998, 266, 38, 1),
(999, 267, 35, 6),
(1000, 267, 36, 5),
(1001, 267, 37, 1),
(1002, 268, 35, 3),
(1003, 268, 36, 8),
(1004, 268, 37, 3),
(1005, 268, 38, 1),
(1006, 269, 35, 5),
(1007, 269, 36, 4),
(1008, 270, 35, 5),
(1009, 270, 36, 7),
(1010, 271, 35, 3),
(1011, 271, 36, 8),
(1012, 271, 37, 2),
(1013, 272, 35, 9),
(1014, 272, 36, 2),
(1015, 272, 37, 3),
(1016, 273, 35, 6),
(1017, 273, 36, 8),
(1018, 273, 37, 1),
(1019, 274, 35, 4),
(1020, 274, 36, 7),
(1021, 275, 35, 7),
(1022, 275, 36, 4),
(1023, 275, 37, 1),
(1024, 276, 36, 4),
(1025, 276, 37, 9),
(1026, 277, 36, 3),
(1027, 277, 37, 10),
(1028, 278, 35, 4),
(1029, 278, 36, 4),
(1030, 278, 37, 3),
(1031, 278, 38, 1),
(1032, 279, 36, 9),
(1033, 279, 37, 2),
(1034, 280, 36, 9),
(1035, 280, 37, 3),
(1036, 281, 36, 4),
(1037, 281, 37, 1),
(1038, 281, 38, 4),
(1039, 281, 39, 1),
(1040, 282, 36, 8),
(1041, 282, 37, 1),
(1042, 283, 37, 5),
(1043, 283, 38, 8),
(1044, 284, 36, 4),
(1045, 284, 37, 6),
(1046, 284, 38, 3),
(1047, 285, 35, 1),
(1048, 285, 36, 5),
(1049, 285, 37, 7),
(1050, 286, 35, 1),
(1051, 286, 36, 2),
(1052, 286, 37, 11),
(1053, 287, 36, 3),
(1054, 287, 37, 7),
(1055, 287, 38, 1),
(1056, 288, 37, 6),
(1057, 288, 38, 5),
(1058, 289, 35, 1),
(1059, 289, 36, 3),
(1060, 289, 37, 5),
(1061, 289, 38, 3),
(1062, 289, 39, 1),
(1063, 290, 36, 5),
(1064, 290, 37, 6);

-- --------------------------------------------------------

--
-- Table structure for table `oldschoolorders`
--

CREATE TABLE `oldschoolorders` (
  `schoolOrderID` int(11) NOT NULL,
  `eventSiteHasDivisionID` int(11) NOT NULL,
  `eventID` int(11) NOT NULL,
  `divisionID` tinyint(4) NOT NULL,
  `schoolID` int(11) NOT NULL,
  `isDone` tinyint(1) NOT NULL DEFAULT 0,
  `due` int(11) DEFAULT NULL,
  `paid` tinyint(1) DEFAULT NULL,
  `schoolOrderNote` text DEFAULT NULL,
  `invoiceSent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `oldschoolorders`
--

INSERT INTO `oldschoolorders` (`schoolOrderID`, `eventSiteHasDivisionID`, `eventID`, `divisionID`, `schoolID`, `isDone`, `due`, `paid`, `schoolOrderNote`, `invoiceSent`) VALUES
(1, 87, 7, 6, 169, 1, NULL, NULL, NULL, NULL),
(2, 85, 5, 6, 154, 1, NULL, NULL, NULL, NULL),
(3, 86, 5, 5, 108, 0, NULL, NULL, NULL, NULL),
(4, 85, 5, 6, 163, 1, NULL, NULL, NULL, NULL),
(5, 86, 5, 5, 148, 0, NULL, NULL, NULL, NULL),
(6, 86, 5, 5, 146, 0, NULL, NULL, NULL, NULL),
(7, 86, 5, 5, 136, 0, NULL, NULL, NULL, NULL),
(8, 85, 5, 6, 158, 1, NULL, NULL, NULL, NULL),
(9, 86, 5, 5, 144, 0, NULL, NULL, NULL, NULL),
(10, 85, 5, 6, 162, 1, NULL, NULL, NULL, NULL),
(11, 86, 5, 5, 142, 0, NULL, NULL, NULL, NULL),
(12, 85, 5, 6, 152, 1, NULL, NULL, NULL, NULL),
(13, 86, 5, 5, 124, 0, NULL, NULL, NULL, NULL),
(14, 85, 5, 6, 167, 0, NULL, NULL, NULL, NULL),
(15, 86, 5, 5, 129, 0, NULL, NULL, NULL, NULL),
(16, 86, 5, 5, 127, 0, NULL, NULL, NULL, NULL),
(17, 85, 5, 6, 156, 1, NULL, NULL, NULL, NULL),
(18, 86, 5, 5, 131, 0, NULL, NULL, NULL, NULL),
(19, 85, 5, 6, 169, 0, NULL, NULL, NULL, NULL),
(20, 86, 5, 5, 106, 0, NULL, NULL, NULL, NULL),
(21, 86, 5, 5, 122, 0, NULL, NULL, NULL, NULL),
(22, 85, 5, 6, 161, 1, NULL, NULL, NULL, NULL),
(23, 86, 5, 5, 133, 0, NULL, NULL, NULL, NULL),
(24, 85, 5, 6, 155, 1, NULL, NULL, NULL, NULL),
(25, 85, 5, 6, 160, 1, NULL, NULL, NULL, NULL),
(26, 85, 5, 6, 159, 1, NULL, NULL, NULL, NULL),
(27, 86, 5, 5, 138, 0, NULL, NULL, NULL, NULL),
(28, 86, 5, 5, 132, 0, NULL, NULL, NULL, NULL),
(29, 86, 5, 5, 66, 0, NULL, NULL, NULL, NULL),
(30, 85, 5, 6, 165, 0, NULL, NULL, NULL, NULL),
(31, 85, 5, 6, 168, 0, NULL, NULL, NULL, NULL),
(32, 85, 5, 6, 149, 1, NULL, NULL, NULL, NULL),
(33, 86, 5, 5, 107, 0, NULL, NULL, NULL, NULL),
(34, 86, 5, 5, 126, 0, NULL, NULL, NULL, NULL),
(35, 86, 5, 5, 135, 0, NULL, NULL, NULL, NULL),
(36, 86, 5, 5, 110, 0, NULL, NULL, NULL, NULL),
(37, 86, 5, 5, 125, 0, NULL, NULL, NULL, NULL),
(38, 85, 5, 6, 157, 1, NULL, NULL, NULL, NULL),
(39, 86, 5, 5, 130, 0, NULL, NULL, NULL, NULL),
(40, 85, 5, 6, 164, 0, NULL, NULL, NULL, NULL),
(41, 86, 5, 5, 143, 0, NULL, NULL, NULL, NULL),
(42, 85, 5, 6, 170, 0, NULL, NULL, NULL, NULL),
(43, 86, 5, 5, 112, 0, NULL, NULL, NULL, NULL),
(44, 86, 5, 5, 134, 0, NULL, NULL, NULL, NULL),
(45, 85, 5, 6, 166, 0, NULL, NULL, NULL, NULL),
(46, 86, 5, 5, 92, 0, NULL, NULL, NULL, NULL),
(47, 86, 5, 5, 141, 0, NULL, NULL, NULL, NULL),
(48, 86, 5, 5, 60, 0, NULL, NULL, NULL, NULL),
(49, 86, 5, 5, 137, 0, NULL, NULL, NULL, NULL),
(50, 86, 5, 5, 87, 0, NULL, NULL, NULL, NULL),
(51, 71, 2, 5, 126, 0, NULL, NULL, NULL, NULL),
(52, 69, 2, 6, 169, 0, NULL, NULL, NULL, NULL),
(53, 73, 2, 4, 102, 0, NULL, NULL, NULL, NULL),
(54, 71, 2, 5, 130, 0, NULL, NULL, NULL, NULL),
(55, 73, 2, 4, 109, 0, NULL, NULL, NULL, NULL),
(56, 71, 2, 5, 133, 0, NULL, NULL, NULL, NULL),
(57, 69, 2, 6, 152, 0, NULL, NULL, NULL, NULL),
(58, 71, 2, 5, 136, 0, NULL, NULL, NULL, NULL),
(59, 71, 2, 5, 146, 0, NULL, NULL, NULL, NULL),
(60, 71, 2, 5, 123, 0, NULL, NULL, NULL, NULL),
(61, 73, 2, 4, 105, 0, NULL, NULL, NULL, NULL),
(62, 73, 2, 4, 97, 0, NULL, NULL, NULL, NULL),
(63, 73, 2, 4, 102, 0, NULL, NULL, NULL, NULL),
(64, 73, 2, 4, 99, 0, NULL, NULL, NULL, NULL),
(65, 69, 2, 6, 157, 0, NULL, NULL, NULL, NULL),
(66, 69, 2, 6, 160, 0, NULL, NULL, NULL, NULL),
(67, 71, 2, 5, 141, 0, NULL, NULL, NULL, NULL),
(68, 71, 2, 5, 129, 0, NULL, NULL, NULL, NULL),
(69, 73, 2, 4, 105, 0, NULL, NULL, NULL, NULL),
(70, 73, 2, 4, 104, 0, NULL, NULL, NULL, NULL),
(71, 73, 2, 4, 118, 0, NULL, NULL, NULL, NULL),
(72, 73, 2, 4, 120, 0, NULL, NULL, NULL, NULL),
(73, 73, 2, 4, 114, 0, NULL, NULL, NULL, NULL),
(74, 73, 2, 4, 103, 0, NULL, NULL, NULL, NULL),
(75, 71, 2, 5, 130, 0, NULL, NULL, NULL, NULL),
(76, 71, 2, 5, 148, 0, NULL, NULL, NULL, NULL),
(77, 71, 2, 5, 147, 0, NULL, NULL, NULL, NULL),
(78, 71, 2, 5, 141, 0, NULL, NULL, NULL, NULL),
(79, 69, 2, 6, 168, 0, NULL, NULL, NULL, NULL),
(80, 69, 2, 6, 164, 0, NULL, NULL, NULL, NULL),
(81, 69, 2, 6, 162, 0, NULL, NULL, NULL, NULL),
(82, 69, 2, 6, 149, 0, NULL, NULL, NULL, NULL),
(83, 71, 2, 5, 122, 0, NULL, NULL, NULL, NULL),
(84, 69, 2, 6, 159, 0, NULL, NULL, NULL, NULL),
(85, 73, 2, 4, 117, 0, NULL, NULL, NULL, NULL),
(86, 73, 2, 4, 113, 0, NULL, NULL, NULL, NULL),
(87, 73, 2, 4, 97, 0, NULL, NULL, NULL, NULL),
(88, 73, 2, 4, 111, 0, NULL, NULL, NULL, NULL),
(89, 71, 2, 5, 138, 0, NULL, NULL, NULL, NULL),
(90, 71, 2, 5, 148, 0, NULL, NULL, NULL, NULL),
(91, 71, 2, 5, 146, 0, NULL, NULL, NULL, NULL),
(92, 71, 2, 5, 134, 0, NULL, NULL, NULL, NULL),
(93, 69, 2, 6, 170, 0, NULL, NULL, NULL, NULL),
(94, 69, 2, 6, 168, 0, NULL, NULL, NULL, NULL),
(95, 69, 2, 6, 164, 0, NULL, NULL, NULL, NULL),
(96, 69, 2, 6, 149, 0, NULL, NULL, NULL, NULL),
(97, 71, 2, 5, 122, 0, NULL, NULL, NULL, NULL),
(98, 69, 2, 6, 159, 0, NULL, NULL, NULL, NULL),
(99, 67, 1, 6, 161, 1, NULL, NULL, NULL, NULL),
(100, 0, 3, 1, 171, 0, 36, NULL, NULL, NULL),
(101, 132, 6, 6, 167, 1, NULL, NULL, NULL, NULL),
(102, 132, 6, 6, 156, 1, NULL, NULL, NULL, NULL),
(103, 137, 6, 3, 101, 1, NULL, NULL, NULL, NULL),
(104, 133, 6, 2, 51, 1, NULL, NULL, NULL, NULL),
(105, 135, 6, 4, 111, 1, NULL, NULL, NULL, NULL),
(106, 136, 6, 5, 129, 1, NULL, NULL, NULL, NULL),
(107, 137, 6, 3, 107, 1, NULL, NULL, NULL, NULL),
(108, 87, 7, 6, 163, 1, NULL, NULL, NULL, NULL),
(109, 135, 6, 4, 117, 1, NULL, NULL, NULL, NULL),
(110, 136, 6, 5, 143, 1, NULL, NULL, NULL, NULL),
(111, 134, 6, 1, 78, 1, NULL, NULL, NULL, NULL),
(112, 134, 6, 1, 5, 1, NULL, NULL, NULL, NULL),
(113, 133, 6, 2, 39, 1, NULL, NULL, NULL, NULL),
(114, 87, 7, 6, 151, 1, NULL, NULL, NULL, NULL),
(115, 87, 7, 6, 158, 1, NULL, NULL, NULL, NULL),
(116, 88, 7, 5, 128, 1, NULL, NULL, NULL, NULL),
(117, 87, 7, 6, 166, 1, NULL, NULL, NULL, NULL),
(118, 88, 7, 5, 124, 1, NULL, NULL, NULL, NULL),
(119, 87, 7, 6, 162, 1, NULL, NULL, NULL, NULL),
(120, 87, 7, 6, 168, 1, NULL, NULL, NULL, NULL),
(121, 87, 7, 6, 155, 1, NULL, NULL, NULL, NULL),
(122, 88, 7, 5, 133, 1, NULL, NULL, NULL, NULL),
(123, 87, 7, 6, 167, 1, NULL, NULL, NULL, NULL),
(124, 88, 7, 5, 132, 1, NULL, NULL, NULL, NULL),
(125, 89, 7, 4, 102, 1, NULL, NULL, NULL, NULL),
(126, 89, 7, 4, 68, 1, NULL, NULL, NULL, NULL),
(127, 88, 7, 5, 131, 1, NULL, NULL, NULL, NULL),
(128, 89, 7, 4, 91, 1, NULL, NULL, NULL, NULL),
(129, 88, 7, 5, 126, 1, NULL, NULL, NULL, NULL),
(130, 88, 7, 5, 137, 1, NULL, NULL, NULL, NULL),
(131, 88, 7, 5, 148, 1, NULL, NULL, NULL, NULL),
(132, 88, 7, 5, 142, 1, NULL, NULL, NULL, NULL),
(133, 87, 7, 6, 159, 1, NULL, NULL, NULL, NULL),
(134, 87, 7, 6, 157, 1, NULL, NULL, NULL, NULL),
(135, 87, 7, 6, 153, 1, NULL, NULL, NULL, NULL),
(136, 87, 7, 6, 165, 1, NULL, NULL, NULL, NULL),
(137, 89, 7, 4, 14, 1, NULL, NULL, NULL, NULL),
(138, 87, 7, 6, 156, 1, NULL, NULL, NULL, NULL),
(139, 87, 7, 6, 170, 1, NULL, NULL, NULL, NULL),
(140, 89, 7, 4, 105, 1, NULL, NULL, NULL, NULL),
(141, 88, 7, 5, 143, 1, NULL, NULL, NULL, NULL),
(142, 88, 7, 5, 123, 1, NULL, NULL, NULL, NULL),
(143, 88, 7, 5, 127, 1, NULL, NULL, NULL, NULL),
(144, 89, 7, 4, 55, 1, NULL, NULL, NULL, NULL),
(145, 89, 7, 4, 116, 1, NULL, NULL, NULL, NULL),
(146, 88, 7, 5, 130, 1, NULL, NULL, NULL, NULL),
(147, 89, 7, 4, 114, 1, NULL, NULL, NULL, NULL),
(148, 89, 7, 4, 81, 0, NULL, NULL, NULL, NULL),
(149, 87, 7, 6, 154, 1, NULL, NULL, NULL, NULL),
(150, 87, 7, 6, 152, 1, NULL, NULL, NULL, NULL),
(151, 87, 7, 6, 164, 1, NULL, NULL, NULL, NULL),
(152, 88, 7, 5, 144, 1, NULL, NULL, NULL, NULL),
(153, 88, 7, 5, 146, 1, NULL, NULL, NULL, NULL),
(168, 68, 1, 5, 126, 0, NULL, NULL, NULL, NULL),
(169, 68, 1, 5, 139, 0, NULL, NULL, NULL, NULL),
(170, 68, 1, 5, 125, 0, NULL, NULL, NULL, NULL),
(171, 67, 1, 6, 156, 0, NULL, NULL, NULL, NULL),
(172, 68, 1, 5, 131, 0, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `schoolorders`
--

CREATE TABLE `schoolorders` (
  `schoolOrderID` int(11) NOT NULL,
  `eventSiteHasDivisionID` int(11) NOT NULL,
  `schoolID` int(11) NOT NULL,
  `isDone` tinyint(1) NOT NULL DEFAULT 0,
  `due` int(11) DEFAULT NULL,
  `paid` tinyint(1) DEFAULT NULL,
  `schoolOrderNote` text DEFAULT NULL,
  `invoiceSent` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schoolorders`
--

INSERT INTO `schoolorders` (`schoolOrderID`, `eventSiteHasDivisionID`, `schoolID`, `isDone`, `due`, `paid`, `schoolOrderNote`, `invoiceSent`) VALUES
(1, 87, 169, 1, NULL, NULL, NULL, NULL),
(2, 85, 154, 1, NULL, NULL, NULL, NULL),
(3, 86, 108, 0, NULL, NULL, NULL, NULL),
(4, 85, 163, 1, NULL, NULL, NULL, NULL),
(5, 86, 148, 0, NULL, NULL, NULL, NULL),
(6, 86, 146, 0, NULL, NULL, NULL, NULL),
(7, 86, 136, 0, NULL, NULL, NULL, NULL),
(8, 85, 158, 1, NULL, NULL, NULL, NULL),
(9, 86, 144, 0, NULL, NULL, NULL, NULL),
(10, 85, 162, 1, NULL, NULL, NULL, NULL),
(11, 86, 142, 0, NULL, NULL, NULL, NULL),
(12, 85, 152, 1, NULL, NULL, NULL, NULL),
(13, 86, 124, 0, NULL, NULL, NULL, NULL),
(14, 85, 167, 0, NULL, NULL, NULL, NULL),
(15, 86, 129, 0, NULL, NULL, NULL, NULL),
(16, 86, 127, 0, NULL, NULL, NULL, NULL),
(17, 85, 156, 1, NULL, NULL, NULL, NULL),
(18, 86, 131, 0, NULL, NULL, NULL, NULL),
(19, 85, 169, 0, NULL, NULL, NULL, NULL),
(20, 86, 106, 0, NULL, NULL, NULL, NULL),
(21, 86, 122, 0, NULL, NULL, NULL, NULL),
(22, 85, 161, 1, NULL, NULL, NULL, NULL),
(23, 86, 133, 0, NULL, NULL, NULL, NULL),
(24, 85, 155, 1, NULL, NULL, NULL, NULL),
(25, 85, 160, 1, NULL, NULL, NULL, NULL),
(26, 85, 159, 1, NULL, NULL, NULL, NULL),
(27, 86, 138, 0, NULL, NULL, NULL, NULL),
(28, 86, 132, 0, NULL, NULL, NULL, NULL),
(29, 86, 66, 0, NULL, NULL, NULL, NULL),
(30, 85, 165, 0, NULL, NULL, NULL, NULL),
(31, 85, 168, 0, NULL, NULL, NULL, NULL),
(32, 85, 149, 1, NULL, NULL, NULL, NULL),
(33, 86, 107, 0, NULL, NULL, NULL, NULL),
(34, 86, 126, 0, NULL, NULL, NULL, NULL),
(35, 86, 135, 0, NULL, NULL, NULL, NULL),
(36, 86, 110, 0, NULL, NULL, NULL, NULL),
(37, 86, 125, 0, NULL, NULL, NULL, NULL),
(38, 85, 157, 1, NULL, NULL, NULL, NULL),
(39, 86, 130, 0, NULL, NULL, NULL, NULL),
(40, 85, 164, 0, NULL, NULL, NULL, NULL),
(41, 86, 143, 0, NULL, NULL, NULL, NULL),
(42, 85, 170, 0, NULL, NULL, NULL, NULL),
(43, 86, 112, 0, NULL, NULL, NULL, NULL),
(44, 86, 134, 0, NULL, NULL, NULL, NULL),
(45, 85, 166, 0, NULL, NULL, NULL, NULL),
(46, 86, 92, 0, NULL, NULL, NULL, NULL),
(47, 86, 141, 0, NULL, NULL, NULL, NULL),
(48, 86, 60, 0, NULL, NULL, NULL, NULL),
(49, 86, 137, 0, NULL, NULL, NULL, NULL),
(50, 86, 87, 0, NULL, NULL, NULL, NULL),
(51, 71, 126, 0, NULL, NULL, NULL, NULL),
(52, 69, 169, 0, NULL, NULL, NULL, NULL),
(53, 73, 102, 0, NULL, NULL, NULL, NULL),
(54, 71, 130, 0, NULL, NULL, NULL, NULL),
(55, 73, 109, 0, NULL, NULL, NULL, NULL),
(56, 71, 133, 0, NULL, NULL, NULL, NULL),
(57, 69, 152, 0, NULL, NULL, NULL, NULL),
(58, 71, 136, 0, NULL, NULL, NULL, NULL),
(59, 71, 146, 0, NULL, NULL, NULL, NULL),
(60, 71, 123, 0, NULL, NULL, NULL, NULL),
(61, 73, 105, 0, NULL, NULL, NULL, NULL),
(62, 73, 97, 0, NULL, NULL, NULL, NULL),
(63, 73, 102, 0, NULL, NULL, NULL, NULL),
(64, 73, 99, 0, NULL, NULL, NULL, NULL),
(65, 69, 157, 0, NULL, NULL, NULL, NULL),
(66, 69, 160, 0, NULL, NULL, NULL, NULL),
(67, 71, 141, 0, NULL, NULL, NULL, NULL),
(68, 71, 129, 0, NULL, NULL, NULL, NULL),
(69, 73, 105, 0, NULL, NULL, NULL, NULL),
(70, 73, 104, 0, NULL, NULL, NULL, NULL),
(71, 73, 118, 0, NULL, NULL, NULL, NULL),
(72, 73, 120, 0, NULL, NULL, NULL, NULL),
(73, 73, 114, 0, NULL, NULL, NULL, NULL),
(74, 73, 103, 0, NULL, NULL, NULL, NULL),
(75, 71, 130, 0, NULL, NULL, NULL, NULL),
(76, 71, 148, 0, NULL, NULL, NULL, NULL),
(77, 71, 147, 0, NULL, NULL, NULL, NULL),
(78, 71, 141, 0, NULL, NULL, NULL, NULL),
(79, 69, 168, 0, NULL, NULL, NULL, NULL),
(80, 69, 164, 0, NULL, NULL, NULL, NULL),
(81, 69, 162, 0, NULL, NULL, NULL, NULL),
(82, 69, 149, 0, NULL, NULL, NULL, NULL),
(83, 71, 122, 0, NULL, NULL, NULL, NULL),
(84, 69, 159, 0, NULL, NULL, NULL, NULL),
(85, 73, 117, 0, NULL, NULL, NULL, NULL),
(86, 73, 113, 0, NULL, NULL, NULL, NULL),
(87, 73, 97, 0, NULL, NULL, NULL, NULL),
(88, 73, 111, 0, NULL, NULL, NULL, NULL),
(89, 71, 138, 0, NULL, NULL, NULL, NULL),
(90, 71, 148, 0, NULL, NULL, NULL, NULL),
(91, 71, 146, 0, NULL, NULL, NULL, NULL),
(92, 71, 134, 0, NULL, NULL, NULL, NULL),
(93, 69, 170, 0, NULL, NULL, NULL, NULL),
(94, 69, 168, 0, NULL, NULL, NULL, NULL),
(95, 69, 164, 0, NULL, NULL, NULL, NULL),
(96, 69, 149, 0, NULL, NULL, NULL, NULL),
(97, 71, 122, 0, NULL, NULL, NULL, NULL),
(98, 69, 159, 0, NULL, NULL, NULL, NULL),
(99, 67, 161, 1, 36, NULL, NULL, NULL),
(101, 132, 167, 1, NULL, NULL, NULL, NULL),
(102, 132, 156, 1, NULL, NULL, NULL, NULL),
(103, 137, 101, 1, NULL, NULL, NULL, NULL),
(104, 133, 51, 1, NULL, NULL, NULL, NULL),
(105, 135, 111, 1, NULL, NULL, NULL, NULL),
(106, 136, 129, 1, NULL, NULL, NULL, NULL),
(107, 137, 107, 1, NULL, NULL, NULL, NULL),
(108, 87, 163, 1, NULL, NULL, NULL, NULL),
(109, 135, 117, 1, NULL, NULL, NULL, NULL),
(110, 136, 143, 1, NULL, NULL, NULL, NULL),
(111, 134, 78, 1, NULL, NULL, NULL, NULL),
(112, 134, 5, 1, NULL, NULL, NULL, NULL),
(113, 133, 39, 1, NULL, NULL, NULL, NULL),
(114, 87, 151, 1, NULL, NULL, NULL, NULL),
(115, 87, 158, 1, NULL, NULL, NULL, NULL),
(116, 88, 128, 1, NULL, NULL, NULL, NULL),
(117, 87, 166, 1, NULL, NULL, NULL, NULL),
(118, 88, 124, 1, NULL, NULL, NULL, NULL),
(119, 87, 162, 1, NULL, NULL, NULL, NULL),
(120, 87, 168, 1, NULL, NULL, NULL, NULL),
(121, 87, 155, 1, NULL, NULL, NULL, NULL),
(122, 88, 133, 1, NULL, NULL, NULL, NULL),
(123, 87, 167, 1, NULL, NULL, NULL, NULL),
(124, 88, 132, 1, NULL, NULL, NULL, NULL),
(125, 89, 102, 1, NULL, NULL, NULL, NULL),
(126, 89, 68, 1, NULL, NULL, NULL, NULL),
(127, 88, 131, 1, NULL, NULL, NULL, NULL),
(128, 89, 91, 1, NULL, NULL, NULL, NULL),
(129, 88, 126, 1, NULL, NULL, NULL, NULL),
(130, 88, 137, 1, NULL, NULL, NULL, NULL),
(131, 88, 148, 1, NULL, NULL, NULL, NULL),
(132, 88, 142, 1, NULL, NULL, NULL, NULL),
(133, 87, 159, 1, NULL, NULL, NULL, NULL),
(134, 87, 157, 1, NULL, NULL, NULL, NULL),
(135, 87, 153, 1, NULL, NULL, NULL, NULL),
(136, 87, 165, 1, NULL, NULL, NULL, NULL),
(137, 89, 14, 1, NULL, NULL, NULL, NULL),
(138, 87, 156, 1, NULL, NULL, NULL, NULL),
(139, 87, 170, 1, NULL, NULL, NULL, NULL),
(140, 89, 105, 1, NULL, NULL, NULL, NULL),
(141, 88, 143, 1, NULL, NULL, NULL, NULL),
(142, 88, 123, 1, NULL, NULL, NULL, NULL),
(143, 88, 127, 1, NULL, NULL, NULL, NULL),
(144, 89, 55, 1, NULL, NULL, NULL, NULL),
(145, 89, 116, 1, NULL, NULL, NULL, NULL),
(146, 88, 130, 1, NULL, NULL, NULL, NULL),
(147, 89, 114, 1, NULL, NULL, NULL, NULL),
(148, 89, 81, 0, NULL, NULL, NULL, NULL),
(149, 87, 154, 1, NULL, NULL, NULL, NULL),
(150, 87, 152, 1, NULL, NULL, NULL, NULL),
(151, 87, 164, 1, NULL, NULL, NULL, NULL),
(152, 88, 144, 1, NULL, NULL, NULL, NULL),
(153, 88, 146, 1, NULL, NULL, NULL, NULL),
(168, 68, 126, 1, NULL, NULL, NULL, NULL),
(169, 68, 139, 1, NULL, NULL, NULL, NULL),
(170, 68, 125, 1, NULL, NULL, NULL, NULL),
(171, 67, 156, 0, NULL, NULL, NULL, NULL),
(172, 68, 131, 1, NULL, NULL, NULL, NULL),
(173, 144, 132, 1, NULL, NULL, NULL, NULL),
(174, 101, 146, 0, NULL, NULL, NULL, NULL),
(175, 100, 170, 0, NULL, NULL, NULL, NULL),
(176, 142, 75, 1, NULL, NULL, NULL, NULL),
(177, 145, 160, 0, NULL, NULL, NULL, NULL),
(178, 144, 123, 1, NULL, NULL, NULL, NULL),
(179, 145, 163, 1, NULL, NULL, NULL, NULL),
(180, 145, 164, 1, NULL, NULL, NULL, NULL),
(181, 144, 121, 1, NULL, NULL, NULL, NULL),
(182, 144, 128, 1, NULL, NULL, NULL, NULL),
(183, 143, 117, 1, NULL, NULL, NULL, NULL),
(184, 142, 95, 1, NULL, NULL, NULL, NULL),
(185, 143, 110, 1, NULL, NULL, NULL, NULL),
(186, 145, 169, 0, NULL, NULL, NULL, NULL),
(187, 101, 127, 0, NULL, NULL, NULL, NULL),
(188, 143, 108, 1, NULL, NULL, NULL, NULL),
(189, 100, 166, 0, NULL, NULL, NULL, NULL),
(190, 142, 17, 1, NULL, NULL, NULL, NULL),
(191, 145, 168, 1, NULL, NULL, NULL, NULL),
(192, 100, 168, 0, 108, NULL, NULL, NULL),
(193, 100, 163, 0, NULL, NULL, NULL, NULL),
(194, 142, 92, 0, 72, NULL, NULL, NULL),
(195, 145, 156, 1, NULL, NULL, NULL, NULL),
(196, 143, 102, 1, NULL, NULL, NULL, NULL),
(197, 143, 112, 1, 108, NULL, NULL, NULL),
(198, 100, 164, 0, NULL, NULL, NULL, NULL),
(199, 101, 144, 0, NULL, NULL, NULL, NULL),
(200, 100, 150, 0, NULL, NULL, NULL, NULL),
(201, 143, 116, 1, NULL, NULL, NULL, NULL),
(202, 100, 156, 0, NULL, NULL, NULL, NULL),
(203, 143, 120, 1, NULL, NULL, NULL, NULL),
(204, 101, 135, 0, NULL, NULL, NULL, NULL),
(205, 142, 87, 1, 72, NULL, NULL, NULL),
(206, 143, 114, 1, NULL, NULL, NULL, NULL),
(207, 144, 135, 1, NULL, NULL, NULL, NULL),
(208, 102, 107, 0, NULL, NULL, NULL, NULL),
(209, 142, 79, 1, NULL, NULL, NULL, NULL),
(210, 145, 167, 1, NULL, NULL, NULL, NULL),
(211, 144, 130, 1, NULL, NULL, NULL, NULL),
(212, 145, 157, 1, NULL, NULL, NULL, NULL),
(213, 144, 126, 1, 66, NULL, NULL, NULL),
(214, 142, 46, 1, NULL, NULL, NULL, NULL),
(215, 144, 143, 1, NULL, NULL, NULL, NULL),
(216, 144, 125, 1, NULL, NULL, NULL, NULL),
(217, 143, 107, 1, NULL, NULL, NULL, NULL),
(218, 145, 152, 1, NULL, NULL, NULL, NULL),
(219, 142, 85, 1, NULL, NULL, NULL, NULL),
(220, 101, 125, 0, NULL, NULL, NULL, NULL),
(221, 101, 132, 0, NULL, NULL, NULL, NULL),
(222, 142, 57, 1, NULL, NULL, NULL, NULL),
(223, 93, 78, 0, NULL, NULL, NULL, NULL),
(224, 95, 27, 0, NULL, NULL, NULL, NULL),
(225, 95, 15, 0, NULL, NULL, NULL, NULL),
(226, 95, 23, 0, NULL, NULL, NULL, NULL),
(227, 95, 5, 0, NULL, NULL, NULL, NULL),
(228, 95, 30, 0, NULL, NULL, NULL, NULL),
(229, 94, 53, 0, NULL, NULL, NULL, NULL),
(230, 94, 39, 0, NULL, NULL, NULL, NULL),
(231, 94, 60, 0, NULL, NULL, NULL, NULL),
(232, 94, 54, 0, NULL, NULL, NULL, NULL),
(233, 94, 62, 0, NULL, NULL, NULL, NULL),
(234, 94, 52, 0, NULL, NULL, NULL, NULL),
(235, 94, 70, 0, NULL, NULL, NULL, NULL),
(236, 93, 93, 0, NULL, NULL, NULL, NULL),
(237, 93, 80, 0, NULL, NULL, NULL, NULL),
(238, 93, 89, 0, NULL, NULL, NULL, NULL),
(239, 93, 95, 0, NULL, NULL, NULL, NULL),
(240, 93, 92, 0, 108, NULL, NULL, NULL),
(241, 93, 86, 0, NULL, NULL, NULL, NULL),
(242, 92, 145, 0, NULL, NULL, NULL, NULL),
(243, 91, 122, 0, NULL, NULL, NULL, NULL),
(244, 91, 123, 0, NULL, NULL, NULL, NULL),
(245, 91, 131, 0, NULL, NULL, NULL, NULL),
(246, 91, 137, 0, NULL, NULL, NULL, NULL),
(247, 91, 138, 0, NULL, NULL, NULL, NULL),
(248, 91, 143, 0, NULL, NULL, NULL, NULL),
(249, 91, 134, 0, 36, NULL, NULL, NULL),
(250, 90, 156, 0, NULL, NULL, NULL, NULL),
(251, 90, 160, 0, NULL, NULL, NULL, NULL),
(252, 90, 149, 0, NULL, NULL, NULL, NULL),
(253, 90, 167, 0, NULL, NULL, NULL, NULL),
(254, 90, 164, 0, NULL, NULL, NULL, NULL),
(255, 90, 150, 0, 108, NULL, NULL, NULL),
(256, 90, 155, 0, 216, 1, NULL, NULL),
(257, 93, 88, 0, 216, NULL, NULL, NULL),
(258, 94, 73, 0, 108, NULL, NULL, NULL),
(259, 92, 112, 0, 144, NULL, NULL, NULL),
(260, 92, 114, 0, 72, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `schoolID` int(11) NOT NULL,
  `schoolName` varchar(60) NOT NULL,
  `divisionID` tinyint(4) NOT NULL,
  `districtID` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`schoolID`, `schoolName`, `divisionID`, `districtID`) VALUES
(1, 'American Heritage Charter School', 1, 6),
(2, 'Bliss High School', 1, 4),
(3, 'Camas County High School', 1, 4),
(4, 'Cambridge High School', 1, 3),
(5, 'Carey High School', 1, 4),
(6, 'Cascade High School', 1, 3),
(7, 'Castleford High School', 1, 4),
(8, 'Challis High School', 1, 6),
(10, 'Coeur du Christ Academy', 1, 1),
(11, 'Council High School', 1, 3),
(12, 'Culdesac High School', 1, 2),
(13, 'Deary High School', 1, 2),
(14, 'Garden Valley High School', 1, 3),
(15, 'Genesee High School', 1, 2),
(16, 'Grace Lutheran High School', 1, 5),
(17, 'Hansen High School', 1, 4),
(18, 'Highland High School - Craigmont', 1, 2),
(19, 'Horseshoe Bend High School', 1, 3),
(20, 'Idaho School for the Deaf & the Blind', 1, 4),
(21, 'Kootenai High School', 1, 1),
(22, 'Leadore High School', 1, 6),
(23, 'Mackay High School', 1, 6),
(24, 'Meadows Valley High School', 1, 3),
(25, 'Midvale High School', 1, 3),
(26, 'Mullan High School', 1, 1),
(27, 'Nezperce High School', 1, 2),
(28, 'North Gem High School', 1, 5),
(29, 'Richfield High School', 1, 4),
(30, 'Rockland High School', 1, 5),
(31, 'Sage International School Middleton', 1, 3),
(32, 'Salmon River High School', 1, 3),
(33, 'Shoshone-Bannock High School', 1, 5),
(34, 'St. John Bosco Academy', 1, 2),
(35, 'Taylor\'s Crossing Public Charter School', 1, 6),
(36, 'Timberline High School - Weippe', 1, 2),
(37, 'Watersprings School', 1, 6),
(38, 'Alturas Preparatory Academy', 2, 6),
(39, 'Butte County High School', 2, 6),
(40, 'Centennial Baptist School', 2, 3),
(41, 'Clark Fork High School', 2, 1),
(42, 'Clearwater Valley High School', 2, 2),
(43, 'Gem State Adventist Academy', 2, 3),
(44, 'Genesis Prep Academy', 2, 1),
(45, 'Glenns Ferry High School', 2, 4),
(46, 'Grace High School', 2, 5),
(47, 'Greenleaf Friends Academy', 2, 3),
(48, 'Hagerman High School', 2, 4),
(49, 'Idaho City High School', 2, 3),
(50, 'Kamiah High School', 2, 2),
(51, 'Kendrick High School', 2, 2),
(52, 'Lakeside Junior/Senior High School', 2, 1),
(53, 'Lapwai High School', 2, 2),
(54, 'Liberty Charter High School', 2, 3),
(55, 'Lighthouse Christian High School', 2, 4),
(56, 'Logos School', 2, 2),
(57, 'Murtaugh High School', 2, 4),
(58, 'North Idaho Stem Charter Academy', 2, 1),
(59, 'Notus High School', 2, 3),
(60, 'Oakley High School', 2, 4),
(61, 'Potlatch High School', 2, 2),
(62, 'Prairie High School', 2, 2),
(63, 'Priest River Lamanna High School', 2, 1),
(64, 'Raft River High School', 2, 4),
(65, 'Rimrock Jr/Sr High School', 2, 3),
(66, 'Riverstone International School', 2, 3),
(67, 'Sage International School Boise', 2, 3),
(68, 'Shoshone High School', 2, 4),
(69, 'Troy High School', 2, 2),
(70, 'Valley High School', 2, 4),
(71, 'Victory Charter High School', 2, 3),
(72, 'Wallace High School', 2, 1),
(73, 'Wilder High School', 2, 3),
(74, 'Xavier Charter School', 2, 4),
(75, 'Aberdeen High School', 3, 5),
(76, 'Ambrose School', 3, 3),
(77, 'Compass Charter High School', 3, 3),
(78, 'Dietrich High School', 3, 4),
(79, 'Firth High School', 3, 6),
(80, 'Grangeville High School', 3, 2),
(81, 'Idaho Arts Charter School', 3, 3),
(82, 'Kellogg High School', 3, 1),
(83, 'Magic Valley High School', 3, 4),
(84, 'Malad High School', 3, 5),
(85, 'Marsing High School', 3, 3),
(86, 'Melba High School', 3, 3),
(87, 'Nampa Christian High School', 3, 3),
(88, 'New Plymouth High School', 3, 3),
(89, 'North Fremont High School', 3, 6),
(90, 'North Star Charter School', 3, 3),
(91, 'Orofino High School', 3, 2),
(92, 'Parma High School', 3, 3),
(93, 'Ririe High School', 3, 6),
(94, 'Salmon High School', 3, 6),
(95, 'Soda Springs High School', 3, 5),
(96, 'St Maries High School', 3, 1),
(97, 'Sun Valley Community School', 3, 4),
(98, 'Vision Charter School', 3, 3),
(99, 'Wendell High School', 3, 4),
(100, 'West Jefferson High School', 3, 6),
(101, 'West Side High School', 3, 5),
(102, 'American Falls High School', 4, 5),
(103, 'Bonners Ferry High School', 4, 1),
(104, 'Buhl High School', 4, 4),
(105, 'Coeur d\'Alene Charter Academy', 4, 1),
(106, 'Cole Valley Christian High School', 4, 3),
(107, 'Declo High School', 4, 4),
(108, 'Filer High School', 4, 4),
(109, 'Fruitland High School', 4, 3),
(110, 'Gooding High School', 4, 4),
(111, 'Homedale High School', 4, 3),
(112, 'Kimberly High School', 4, 4),
(113, 'Marsh Valley High School', 4, 5),
(114, 'McCall-Donnelly High School', 4, 3),
(115, 'Payette High School', 4, 3),
(116, 'Snake River High School', 4, 5),
(117, 'Sugar-Salem High School', 4, 6),
(118, 'Teton High School', 4, 6),
(119, 'Timberlake High School', 4, 1),
(120, 'Weiser High School', 4, 3),
(121, 'Bear Lake High School', 5, 5),
(122, 'Bishop Kelly High School', 5, 3),
(123, 'Blackfoot High School', 5, 6),
(124, 'Bonneville High School', 5, 6),
(125, 'Burley High School', 5, 4),
(126, 'Century High School', 5, 5),
(127, 'Columbia High School', 5, 3),
(128, 'Emmett High School', 5, 3),
(129, 'Hillcrest High School', 5, 6),
(130, 'Idaho Falls High School', 5, 6),
(131, 'Jerome High School', 5, 4),
(132, 'Lakeland High School', 5, 1),
(133, 'Lewiston High School', 5, 2),
(134, 'Middleton High School', 5, 3),
(135, 'Minico High School', 5, 4),
(136, 'Moscow High School', 5, 2),
(137, 'Mountain Home High School', 5, 4),
(138, 'Pocatello High School', 5, 5),
(139, 'Preston High School', 5, 5),
(140, 'Renaissance High School', 5, 3),
(141, 'Sandpoint High School', 5, 1),
(142, 'Shelley High School', 5, 6),
(143, 'Skyline High School', 5, 6),
(144, 'Skyview High School', 5, 3),
(145, 'South Fremont High School', 5, 6),
(146, 'Twin Falls High School', 5, 4),
(147, 'Vallivue High School', 5, 3),
(148, 'Wood River High School', 5, 4),
(149, 'Boise High School', 6, 3),
(150, 'Borah High School', 6, 3),
(151, 'Caldwell High School', 6, 3),
(152, 'Canyon Ridge High School', 6, 4),
(153, 'Capital High School', 6, 3),
(154, 'Centennial High School', 6, 3),
(155, 'Coeur d\'Alene High School', 6, 1),
(156, 'Eagle High School', 6, 3),
(157, 'Highland High School - Pocatello', 6, 5),
(158, 'Kuna High School', 6, 3),
(159, 'Lake City High School', 6, 1),
(160, 'Madison High School', 6, 6),
(161, 'Meridian High School', 6, 3),
(162, 'Mountain View High School', 6, 3),
(163, 'Nampa High School', 6, 3),
(164, 'Owyhee High School', 6, 3),
(165, 'Post Falls High School', 6, 1),
(166, 'Ridgevue High School', 6, 3),
(167, 'Rigby High School', 6, 6),
(168, 'Rocky Mountain High School', 6, 3),
(169, 'Thunder Ridge High School', 6, 6),
(170, 'Timberline High School - Boise', 6, 3),
(171, 'Test', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sites`
--

CREATE TABLE `sites` (
  `siteID` int(11) NOT NULL,
  `siteName` varchar(50) NOT NULL,
  `siteCity` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sites`
--

INSERT INTO `sites` (`siteID`, `siteName`, `siteCity`) VALUES
(1, 'Highland GC', 'Pocatello'),
(2, 'River\'s Edge GC', 'Burley'),
(3, 'Coeur d\'Alene HS', 'Coeur d\'Alene'),
(4, 'Sandpoint HS', 'Sandpoint'),
(5, 'Bonneville HS', 'Idaho Falls'),
(6, 'Hillcrest HS', 'Ammon'),
(7, 'Real Life Turf Fields', 'Post Falls'),
(8, 'Eagle Island State Park', 'Eagle'),
(9, 'Mountain America Center', 'Idaho Falls'),
(10, 'Lake City HS', 'Coeur d\'Alene'),
(11, 'University of Idaho', 'Moscow'),
(12, 'Jerome HS', 'Jerome'),
(13, 'Canyon Ridge HS', 'Twin Falls'),
(14, 'West YMCA', 'Meridian'),
(15, 'Ford Idaho Center', 'Nampa'),
(16, 'Mountain View HS', 'Meridian'),
(17, 'Middleton HS', 'Middleton'),
(18, 'Bishop Kelly HS', 'Boise'),
(19, 'Columbia HS', 'nampa'),
(20, 'ICCU Dome', 'Pocatello'),
(21, 'Rocky Mountain HS', 'Meridian'),
(22, 'Eagle HS', 'Eagle'),
(23, 'Capital HS', 'Boise'),
(24, 'Vallivue HS', 'Caldwell'),
(25, 'Caldwell HS', 'Caldwell'),
(26, 'Kimberly HS', 'Kimberly'),
(27, 'Clear Lake CC', 'Buhl'),
(28, 'Skyview HS', 'Nampa'),
(29, 'Quad Park', 'Caldwell'),
(30, 'Hawks Stadium', 'Garden City'),
(31, 'College of Idaho', 'Caldwell'),
(32, 'Melaleuca Field', 'Idaho Falls'),
(33, 'Northwest Nazarene University', 'Nampa'),
(34, 'Orofino HS', 'Orofino'),
(35, 'Appleton Tennis Complex', 'Boise'),
(36, 'Boise Racquet Club', 'Boise'),
(37, 'Ridgevue HS', 'Nampa'),
(38, 'Nampa HS', 'Nampa'),
(39, 'Albertsons Stadium', 'Boise'),
(40, 'Kibbie Dome', 'Moscow'),
(41, 'Blackfoot HS', 'Blackfoot'),
(42, 'TBD', 'TBD');

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `sizeID` tinyint(4) NOT NULL,
  `sizeName` varchar(20) NOT NULL,
  `charName` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`sizeID`, `sizeName`, `charName`) VALUES
(1, 'Small', 'S'),
(2, 'Medium', 'M'),
(3, 'Large', 'L'),
(4, 'X-Large', 'XL'),
(5, '2X-Large', '2XL'),
(6, '3X-Large', '3XL'),
(7, '4X-Large', '4XL'),
(8, '5X-Large', '5XL'),
(9, 'Youth Small', 'YS'),
(10, 'Youth Medium', 'YM'),
(11, 'Youth Large', 'YL'),
(12, 'Youth X-Large', 'YXL');

-- --------------------------------------------------------

--
-- Table structure for table `sorderitems`
--

CREATE TABLE `sorderitems` (
  `sOrderItemsID` int(11) NOT NULL,
  `schoolOrderID` int(11) NOT NULL,
  `itemID` int(11) NOT NULL,
  `sOrderItemsQuantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sorderitems`
--

INSERT INTO `sorderitems` (`sOrderItemsID`, `schoolOrderID`, `itemID`, `sOrderItemsQuantity`) VALUES
(2, 112, 35, 6),
(3, 120, 35, 1),
(4, 133, 35, 1),
(5, 142, 35, 2),
(6, 153, 35, 5),
(8, 99, 36, 1),
(9, 103, 36, 2),
(10, 112, 36, 3),
(11, 120, 36, 1),
(12, 142, 36, 1),
(15, 102, 37, 4),
(16, 110, 37, 8),
(17, 112, 37, 2),
(18, 120, 37, 3),
(19, 141, 37, 2),
(22, 99, 38, 4),
(23, 102, 38, 2),
(24, 110, 38, 15),
(25, 112, 38, 1),
(26, 120, 38, 1),
(27, 141, 38, 1),
(29, 110, 39, 2),
(30, 112, 39, 2),
(31, 141, 39, 1),
(32, 103, 40, 1),
(33, 110, 40, 2),
(34, 192, 37, 2),
(35, 192, 38, 1),
(36, 197, 36, 1),
(37, 197, 37, 1),
(38, 197, 40, 1),
(39, 205, 35, 2),
(40, 213, 35, 1),
(41, 213, 36, 1),
(42, 194, 36, 2),
(43, 257, 35, 4),
(44, 257, 36, 1),
(45, 257, 38, 1),
(46, 240, 36, 1),
(47, 240, 37, 1),
(48, 240, 39, 1),
(49, 258, 36, 1),
(50, 258, 38, 1),
(51, 258, 39, 1),
(52, 255, 36, 1),
(53, 255, 37, 2),
(54, 256, 37, 4),
(55, 256, 38, 2),
(56, 259, 36, 1),
(57, 259, 37, 2),
(58, 259, 40, 1),
(59, 260, 36, 1),
(60, 260, 38, 1),
(61, 249, 36, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sports`
--

CREATE TABLE `sports` (
  `sportID` tinyint(4) NOT NULL,
  `sportName` varchar(30) NOT NULL,
  `isGendered` tinyint(1) NOT NULL,
  `isIndividualed` tinyint(1) NOT NULL,
  `maxTeamSize` tinyint(4) DEFAULT NULL,
  `minDiv` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sports`
--

INSERT INTO `sports` (`sportID`, `sportName`, `isGendered`, `isIndividualed`, `maxTeamSize`, `minDiv`) VALUES
(1, 'Golf', 1, 1, 5, 3),
(2, 'Soccer', 1, 0, 22, 4),
(3, 'Volleyball', 0, 0, 15, 1),
(4, 'Cross Country', 1, 1, NULL, 2),
(5, 'Swimming', 1, 1, NULL, 5),
(6, 'Football', 0, 0, 60, 1),
(7, 'Drama', 0, 1, NULL, 4),
(8, 'Girls Basketball', 0, 0, 15, 1),
(9, 'Wrestling', 1, 1, NULL, 3),
(10, 'Dance', 0, 0, NULL, 4),
(11, 'Cheer', 0, 0, NULL, 3),
(12, 'Boys Basketball', 0, 0, 15, 1),
(13, 'Debate', 0, 1, NULL, 4),
(14, 'Speech', 0, 1, NULL, 4),
(15, 'Softball', 0, 0, 17, 2),
(16, 'Baseball', 0, 0, 17, 2),
(17, 'Tennis', 1, 1, NULL, 4),
(18, 'Track', 1, 1, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `styles`
--

CREATE TABLE `styles` (
  `styleID` int(11) NOT NULL,
  `styleCode` varchar(10) NOT NULL,
  `styleName` varchar(100) NOT NULL,
  `styleShortName` varchar(50) NOT NULL,
  `brandID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `styles`
--

INSERT INTO `styles` (`styleID`, `styleCode`, `styleName`, `styleShortName`, `brandID`) VALUES
(1, '5170', 'Hanes® - EcoSmart® 50/50 Cotton/Poly T-Shirt', 'Adult S/S Ts', 1),
(2, '5370', 'Hanes® - Youth EcoSmart® 50/50 Cotton/Poly T-Shirt', 'Youth S/S Ts', 1),
(3, '29LS', 'Jerzees® - Dri-Power® 50/50 Cotton/Poly Long Sleeve T-Shirt', 'Adult L/S Ts', 3),
(4, 'PC90', 'Port & Company® Essential Fleece Crewneck Sweatshirt', 'Adult Crews', 2),
(5, 'PC90Y', 'Port & Company® Youth Core Fleece Crewneck Sweatshirt', 'Youth Crews', 2),
(6, 'PC78H', 'Port & Company® Core Fleece Pullover Hooded Sweatshirt', 'Adult Hoods', 2),
(7, 'PC90YH', 'Port & Company® Youth Core Fleece Pullover Hooded Sweatshirt', 'Youth Hoods', 2),
(8, 'PC78ZH', 'Port & Company® Core Fleece Full-Zip Hooded Sweatshirt', 'Adult Zip Up Hoods', 2);

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `testID` int(11) NOT NULL,
  `testText` text NOT NULL,
  `testTime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`testID`, `testText`, `testTime`) VALUES
(1, '[\"Sport.php: line 49\",[{\"sportID\":7,\"sportName\":\"Drama\",\"isGendered\":0,\"isIndividualed\":1,\"maxTeamSize\":null,\"minDiv\":4}]]', '2025-02-14 07:43:24'),
(2, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 07:55:41'),
(3, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 07:56:21'),
(4, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 07:57:16'),
(5, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 07:58:03'),
(6, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 07:59:07'),
(7, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 08:01:09'),
(8, '[\"SchoolOrder.php: line 189\",null]', '2025-02-14 08:01:42'),
(9, '[\"SchoolOrder.php: line 189\",{\"id\":7,\"name\":\"Drama\",\"isGendered\":false,\"isIndividualed\":true,\"maxTeamSize\":null,\"minDiv\":4}]', '2025-02-14 08:04:38');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `vehicleID` tinyint(4) NOT NULL,
  `vehicleName` varchar(30) NOT NULL,
  `vehicleIsUnique` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`vehicleID`, `vehicleName`, `vehicleIsUnique`) VALUES
(1, 'Highland Van', 1),
(2, 'Transit Van', 1),
(3, 'Rental', 0),
(4, 'Personal Vehicle', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brandID`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`colorID`);

--
-- Indexes for table `districts`
--
ALTER TABLE `districts`
  ADD PRIMARY KEY (`districtID`);

--
-- Indexes for table `divisions`
--
ALTER TABLE `divisions`
  ADD PRIMARY KEY (`divisionID`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employeeID`);

--
-- Indexes for table `eventhassport`
--
ALTER TABLE `eventhassport`
  ADD PRIMARY KEY (`eventHasSportID`),
  ADD KEY `eventID` (`eventID`),
  ADD KEY `sportID` (`sportID`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eventID`),
  ADD KEY `sportID` (`sportID`);

--
-- Indexes for table `eventsitehasdivision`
--
ALTER TABLE `eventsitehasdivision`
  ADD PRIMARY KEY (`eventSiteHasDivisionID`),
  ADD KEY `eventSiteID` (`eventSiteID`),
  ADD KEY `divisionID` (`divisionID`);

--
-- Indexes for table `eventsitehasemployee`
--
ALTER TABLE `eventsitehasemployee`
  ADD PRIMARY KEY (`eventSiteHasEmployeeID`),
  ADD KEY `eventSiteID` (`eventSiteID`),
  ADD KEY `employeeID` (`employeeID`);

--
-- Indexes for table `eventsitehasgender`
--
ALTER TABLE `eventsitehasgender`
  ADD PRIMARY KEY (`eventSiteHasGenderID`),
  ADD KEY `eventSiteID` (`eventSiteID`),
  ADD KEY `genderID` (`genderID`);

--
-- Indexes for table `eventsiteinventories`
--
ALTER TABLE `eventsiteinventories`
  ADD PRIMARY KEY (`eventSiteInventoryID`),
  ADD KEY `eventSiteID` (`eventSiteID`),
  ADD KEY `itemID` (`itemID`);

--
-- Indexes for table `eventsites`
--
ALTER TABLE `eventsites`
  ADD PRIMARY KEY (`eventSiteID`),
  ADD KEY `eventID` (`eventID`),
  ADD KEY `siteID` (`siteID`),
  ADD KEY `vehicleID` (`vehicleID`);

--
-- Indexes for table `genders`
--
ALTER TABLE `genders`
  ADD PRIMARY KEY (`genderID`);

--
-- Indexes for table `inventoryitems`
--
ALTER TABLE `inventoryitems`
  ADD PRIMARY KEY (`itemID`),
  ADD KEY `colorID` (`colorID`),
  ADD KEY `styleID` (`styleID`),
  ADD KEY `sizeID` (`sizeID`);

--
-- Indexes for table `messageorders`
--
ALTER TABLE `messageorders`
  ADD PRIMARY KEY (`messageOrderID`),
  ADD KEY `schoolOrderID` (`schoolOrderID`),
  ADD KEY `genderID` (`genderID`);

--
-- Indexes for table `morderitems`
--
ALTER TABLE `morderitems`
  ADD PRIMARY KEY (`mOrderItemsID`),
  ADD KEY `messageOrderID` (`messageOrderID`),
  ADD KEY `itemID` (`itemID`);

--
-- Indexes for table `oldschoolorders`
--
ALTER TABLE `oldschoolorders`
  ADD PRIMARY KEY (`schoolOrderID`),
  ADD KEY `eventID` (`eventID`),
  ADD KEY `divisionID` (`divisionID`),
  ADD KEY `schoolID` (`schoolID`);

--
-- Indexes for table `schoolorders`
--
ALTER TABLE `schoolorders`
  ADD PRIMARY KEY (`schoolOrderID`),
  ADD KEY `schoolID` (`schoolID`),
  ADD KEY `eventSiteHasDivisionID` (`eventSiteHasDivisionID`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`schoolID`),
  ADD KEY `divisionID` (`divisionID`),
  ADD KEY `districtID` (`districtID`);

--
-- Indexes for table `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`siteID`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`sizeID`);

--
-- Indexes for table `sorderitems`
--
ALTER TABLE `sorderitems`
  ADD PRIMARY KEY (`sOrderItemsID`),
  ADD KEY `itemID` (`itemID`),
  ADD KEY `schoolOrderID` (`schoolOrderID`);

--
-- Indexes for table `sports`
--
ALTER TABLE `sports`
  ADD PRIMARY KEY (`sportID`),
  ADD KEY `minDiv` (`minDiv`);

--
-- Indexes for table `styles`
--
ALTER TABLE `styles`
  ADD PRIMARY KEY (`styleID`),
  ADD KEY `brandID` (`brandID`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`testID`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`vehicleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brandID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `colorID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `districts`
--
ALTER TABLE `districts`
  MODIFY `districtID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `divisions`
--
ALTER TABLE `divisions`
  MODIFY `divisionID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employeeID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventhassport`
--
ALTER TABLE `eventhassport`
  MODIFY `eventHasSportID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventsitehasdivision`
--
ALTER TABLE `eventsitehasdivision`
  MODIFY `eventSiteHasDivisionID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventsitehasemployee`
--
ALTER TABLE `eventsitehasemployee`
  MODIFY `eventSiteHasEmployeeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventsitehasgender`
--
ALTER TABLE `eventsitehasgender`
  MODIFY `eventSiteHasGenderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventsiteinventories`
--
ALTER TABLE `eventsiteinventories`
  MODIFY `eventSiteInventoryID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `eventsites`
--
ALTER TABLE `eventsites`
  MODIFY `eventSiteID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `genders`
--
ALTER TABLE `genders`
  MODIFY `genderID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventoryitems`
--
ALTER TABLE `inventoryitems`
  MODIFY `itemID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messageorders`
--
ALTER TABLE `messageorders`
  MODIFY `messageOrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `morderitems`
--
ALTER TABLE `morderitems`
  MODIFY `mOrderItemsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `oldschoolorders`
--
ALTER TABLE `oldschoolorders`
  MODIFY `schoolOrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schoolorders`
--
ALTER TABLE `schoolorders`
  MODIFY `schoolOrderID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `schools`
--
ALTER TABLE `schools`
  MODIFY `schoolID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sites`
--
ALTER TABLE `sites`
  MODIFY `siteID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `sizeID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sorderitems`
--
ALTER TABLE `sorderitems`
  MODIFY `sOrderItemsID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sports`
--
ALTER TABLE `sports`
  MODIFY `sportID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `styles`
--
ALTER TABLE `styles`
  MODIFY `styleID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `testID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `vehicleID` tinyint(4) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `eventhassport`
--
ALTER TABLE `eventhassport`
  ADD CONSTRAINT `eventhassport_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  ADD CONSTRAINT `eventhassport_ibfk_2` FOREIGN KEY (`sportID`) REFERENCES `sports` (`sportID`);

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `sportID` FOREIGN KEY (`sportID`) REFERENCES `sports` (`sportID`);

--
-- Constraints for table `eventsitehasdivision`
--
ALTER TABLE `eventsitehasdivision`
  ADD CONSTRAINT `eventsitehasdivision_ibfk_1` FOREIGN KEY (`eventSiteID`) REFERENCES `eventsites` (`eventSiteID`),
  ADD CONSTRAINT `eventsitehasdivision_ibfk_2` FOREIGN KEY (`divisionID`) REFERENCES `divisions` (`divisionID`);

--
-- Constraints for table `eventsitehasemployee`
--
ALTER TABLE `eventsitehasemployee`
  ADD CONSTRAINT `eventsitehasemployee_ibfk_1` FOREIGN KEY (`eventSiteID`) REFERENCES `eventsites` (`eventSiteID`),
  ADD CONSTRAINT `eventsitehasemployee_ibfk_2` FOREIGN KEY (`employeeID`) REFERENCES `employees` (`employeeID`);

--
-- Constraints for table `eventsitehasgender`
--
ALTER TABLE `eventsitehasgender`
  ADD CONSTRAINT `eventsitehasgender_ibfk_1` FOREIGN KEY (`eventSiteID`) REFERENCES `eventsites` (`eventSiteID`),
  ADD CONSTRAINT `eventsitehasgender_ibfk_2` FOREIGN KEY (`genderID`) REFERENCES `genders` (`genderID`);

--
-- Constraints for table `eventsiteinventories`
--
ALTER TABLE `eventsiteinventories`
  ADD CONSTRAINT `eventsiteinventories_ibfk_1` FOREIGN KEY (`eventSiteID`) REFERENCES `eventsites` (`eventSiteID`),
  ADD CONSTRAINT `eventsiteinventories_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `inventoryitems` (`itemID`);

--
-- Constraints for table `eventsites`
--
ALTER TABLE `eventsites`
  ADD CONSTRAINT `eventsites_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  ADD CONSTRAINT `eventsites_ibfk_2` FOREIGN KEY (`siteID`) REFERENCES `sites` (`siteID`),
  ADD CONSTRAINT `eventsites_ibfk_3` FOREIGN KEY (`vehicleID`) REFERENCES `vehicles` (`vehicleID`);

--
-- Constraints for table `inventoryitems`
--
ALTER TABLE `inventoryitems`
  ADD CONSTRAINT `inventoryitems_ibfk_1` FOREIGN KEY (`colorID`) REFERENCES `colors` (`colorID`),
  ADD CONSTRAINT `inventoryitems_ibfk_2` FOREIGN KEY (`styleID`) REFERENCES `styles` (`styleID`),
  ADD CONSTRAINT `inventoryitems_ibfk_3` FOREIGN KEY (`sizeID`) REFERENCES `sizes` (`sizeID`);

--
-- Constraints for table `messageorders`
--
ALTER TABLE `messageorders`
  ADD CONSTRAINT `messageorders_ibfk_1` FOREIGN KEY (`schoolOrderID`) REFERENCES `schoolorders` (`schoolOrderID`),
  ADD CONSTRAINT `messageorders_ibfk_2` FOREIGN KEY (`genderID`) REFERENCES `genders` (`genderID`);

--
-- Constraints for table `morderitems`
--
ALTER TABLE `morderitems`
  ADD CONSTRAINT `morderitems_ibfk_1` FOREIGN KEY (`messageOrderID`) REFERENCES `messageorders` (`messageOrderID`),
  ADD CONSTRAINT `morderitems_ibfk_2` FOREIGN KEY (`itemID`) REFERENCES `inventoryitems` (`itemID`);

--
-- Constraints for table `schoolorders`
--
ALTER TABLE `schoolorders`
  ADD CONSTRAINT `schoolorders_ibfk_3` FOREIGN KEY (`schoolID`) REFERENCES `schools` (`schoolID`),
  ADD CONSTRAINT `schoolorders_ibfk_4` FOREIGN KEY (`eventSiteHasDivisionID`) REFERENCES `eventsitehasdivision` (`eventSiteHasDivisionID`);

--
-- Constraints for table `schools`
--
ALTER TABLE `schools`
  ADD CONSTRAINT `schools_ibfk_1` FOREIGN KEY (`divisionID`) REFERENCES `divisions` (`divisionID`),
  ADD CONSTRAINT `schools_ibfk_2` FOREIGN KEY (`districtID`) REFERENCES `districts` (`districtID`);

--
-- Constraints for table `sorderitems`
--
ALTER TABLE `sorderitems`
  ADD CONSTRAINT `sorderitems_ibfk_1` FOREIGN KEY (`itemID`) REFERENCES `inventoryitems` (`itemID`),
  ADD CONSTRAINT `sorderitems_ibfk_2` FOREIGN KEY (`schoolOrderID`) REFERENCES `schoolorders` (`schoolOrderID`);

--
-- Constraints for table `sports`
--
ALTER TABLE `sports`
  ADD CONSTRAINT `sports_ibfk_1` FOREIGN KEY (`minDiv`) REFERENCES `divisions` (`divisionID`);

--
-- Constraints for table `styles`
--
ALTER TABLE `styles`
  ADD CONSTRAINT `styles_ibfk_1` FOREIGN KEY (`brandID`) REFERENCES `brands` (`brandID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
