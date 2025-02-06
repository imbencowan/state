/* here we have code to recreate the db if we ever need */

-- -----------------------	
-- create the database
DROP DATABASE IF EXISTS state2;
CREATE DATABASE state2;
USE state2;		-- sets the database to use

	
-- -----------------------
-- create the table for the divisions
CREATE TABLE divisions (
	divisionID					TINYINT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	divisionName				VARCHAR(5)			NOT NULL,
	minPop						INT					NOT NULL,
	pre24DivisionName			VARCHAR(5)			NULL			DEFAULT NULL
);
-- populate the divisions table
INSERT INTO divisions
	(divisionName, minPop, pre24DivisionName)
VALUES
	('1A', 0, '1A DII'),
	('2A', 85, '1A DI'),
	('3A', 160, '2A'),
	('4A', 320, '3A'),
	('5A', 640, '4A'),
	('6A', 1280, '5A');

-- ------------------------
-- create a sports table
CREATE TABLE sports (
	sportID						TINYINT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	sportName					VARCHAR(30)			NOT NULL,
	isGendered					BOOLEAN				NOT NULL,
	isIndividualed				BOOLEAN				NOT NULL,
	maxTeamSize					TINYINT				NULL			DEFAULT NULL,
	-- we don't know all team's max sizes, so it can be null
	minDiv						TINYINT				NULL			DEFAULT NULL,
	FOREIGN KEY (minDiv) REFERENCES divisions (divisionID)
);

-- populate sports
INSERT INTO sports
	(sportName, isGendered, isIndividualed, maxTeamSize, minDiv)
VALUES
	('Golf', 1, 1, 5, 3),
	('Soccer', 1, 0, 22, 4),
	('Volleyball', 0, 0, 15, 1),
	('Cross Country', 1, 1, null, 2),
	('Swimming', 1, 1, null, 5),
	-- football actually has max team sizes based off division 60/60/40/40/30/25
		-- but it would probably take an additional table just to accomodate that
			-- which i guees wouldn't be that much trouble, but eh, may be some day
				-- kinda seems wasteful just for that
	('Football', 0, 0, 60, 1),
	('Drama', 0, 1, null, 4),
	('Girls Basketball', 0, 0, 15, 1),
	('Wrestling', 1, 1, null, 3),
	('Dance', 0, 0, null, 4),
	('Cheer', 0, 0, null, 3),
	('Boys Basketball', 0, 0, 15, 1),
	('Debate', 0, 1, null, 4),
	('Speech', 0, 1, null, 4),
	('Softball', 0, 0, 17, 2),
	('Baseball', 0, 0, 17, 2),
	('Tennis', 1, 1, null, 4),
	('Track', 1, 1, null, 2);
	
-- -----------------------
-- create the table for events
CREATE TABLE events (
	eventID							INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventYear						TINYINT			NOT NULL,
	startDate						DATE				NOT NULL,
	endDate							DATE				NOT NULL
);

-- -----------------------
-- create the table to tie events to sites. necessary for dance and cheer to be one event with two sports
CREATE TABLE eventHasSport (
	eventHasSportID				INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventID							INT				NOT NULL,
	sportID							TINYINT			NOT NULL,
	FOREIGN KEY (eventID) REFERENCES events (eventID),
	FOREIGN KEY (sportID) REFERENCES sports (sportID)
);

-- -----------------------
-- create the table for sites
CREATE TABLE sites (
	siteID							INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	siteName							VARCHAR(50)		NOT NULL,
	city								VARCHAR(20)		NOT NULL
);

-- -----------------------
-- create the table for vehicles
CREATE TABLE vehicles (
	vehicleID			TINYINT			NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	vehicleName			VARCHAR(30)		NOT NULL,
	isUnique				BOOLEAN			NOT NULL
);

-- populate some vehicles
INSERT INTO vehicles
	(vehicleName, isUnique)
VALUES
	('Highland Van', 1),
	('Transit Van', 1),
	('Rental', 0),
	('Personal Vehicle', 0);
	
-- -----------------------
-- create the table for the eventSites
CREATE TABLE eventSites (
	eventSiteID				INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventID					INT				NOT NULL,
	siteID					INT				NULL, 	-- the last three fields can be null when they have not yet been assigned
	managerName				VARCHAR(20)		NULL,
	vehicleID				TINYINT			NULL,
	FOREIGN KEY (eventID) REFERENCES events (eventID),
	FOREIGN KEY (siteID) REFERENCES sites (siteID),
	FOREIGN KEY (vehicleID) REFERENCES vehicles (vehicleID)
);

-- -----------------------
-- create the table for the sizes
CREATE TABLE sizes (
	sizeID					TINYINT			NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	sizeName					VARCHAR(20)		NOT NULL,
	sizeChars				VARCHAR(5)		NOT NULL
);

-- populate sizes
INSERT INTO sizes
	(sizeName, sizeChars)
VALUES
	('Small', 'S'),
	('Medium', 'M'),
	('Large', 'L'),
	('X-Large', 'XL'),
	('2X-Large', '2XL'),
	('3X-Large', '3XL'),
	('4X-Large', '4XL'),
	('5X-Large', '5XL'),
	('6X-Large', '6XL'),
	('Youth Small', 'YS'),
	('Youth Medium', 'YM'),
	('Youth Large', 'YL'),
	('Youth X-Large', 'YXL');

-- i think we'll rework how we handle inventory Items with an EAV model
-- -- -----------------------
-- -- create the table for the styles
-- CREATE TABLE styles (
	-- styleID			INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	-- styleNumber		VARCHAR(10)		NOT NULL,
	-- styleName		VARCHAR(25)		NOT NULL
	-- description		VARCHAR(100)	NULL	-- i don't particularly care if this is used
-- );

-- -----------------------
-- create the table for the inventoryItems
CREATE TABLE inventoryItems (
	itemID					INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	itemName					VARCHAR(5)		NOT NULL,
	price						FLOAT				NOT NULL,
	stock						INT				NOT NULL
);

-- -----------------------
-- create the table for the eventSiteInventories
CREATE TABLE eventSiteInventories (
	eventSiteInventoryID		INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventSiteID					INT				NOT NULL,
	itemID						INT				NOT NULL,
	startQ						INT				NOT NULL,
	endQ							INT				NOT NULL,
	price							DECIMAL(5, 2)	NOT NULL,
	addedQ						INT				NOT NULL		DEFAULT 0,	
	removedQ						INT				NOT NULL		DEFAULT 0,
	FOREIGN KEY (eventSiteID) REFERENCES eventSites (eventSiteID),
	FOREIGN KEY (itemID) REFERENCES inventoryItems (itemID)
);	
	
-- -----------------------
-- create the table for employees
CREATE TABLE employees (
	employeeID					TINYINT			NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	employeeName				VARCHAR(30)		NOT NULL,
	employeeShortName			VARCHAR(15)		NOT NULL,
	employeePhone				VARCHAR(20)		NULL,
	employeeEmail				VARCHAR(320)	NULL
);

-- -----------------------
-- create the table for eventSiteHasEmployee
CREATE TABLE eventSiteHasEmployee (
	eventSiteHasEmployeeID	INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventSiteID					INT				NOT NULL,
	employeeID					TINYINT			NOT NULL,
	FOREIGN KEY (eventSiteID) REFERENCES eventSites (eventSiteID),
	FOREIGN KEY (employeeID) REFERENCES employees (employeeID)
);
	
-- -----------------------
-- create the table for the districts
CREATE TABLE districts (
	districtID					TINYINT			NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	districtName				VARCHAR(5)		NOT NULL,
	districtDescription		VARCHAR(50)		NOT NULL,
	primaryCity					VARCHAR(20)		NOT NULL
);
-- populate the districts table
INSERT INTO districts
	(districtName, districtDescription, primaryCity)
VALUES
	('I', 'North', "Coeur d'Alene"),
	('II', 'North Central', 'Lewiston'),
	('III', 'Southwest', 'Boise'),
	('IV', 'South Central', 'Twin Falls'),
	('V', 'Southeast', 'Pocatello'),
	('VI', 'East', 'Idaho Falls');

-- -----------------------	
-- create the table for schools
CREATE TABLE schools (
	schoolID						INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	schoolName					VARCHAR(60)		NOT NULL,
	divisionID					TINYINT			NOT NULL,
	districtID					TINYINT			NOT NULL,
	FOREIGN KEY (divisionID) REFERENCES divisions (divisionID),
	FOREIGN KEY (districtID) REFERENCES districts (districtID)
);

-- ------------------------
-- create the table for genders
CREATE TABLE genders (
	genderID						TINYINT			NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	genderName					VARCHAR(10)		NULL	-- we will use NULL to represent a mixed gender event or order
);
-- populate the genders table
INSERT INTO genders
	(genderName)
VALUES
	('boys'),
	('girls'),
	(null);

-- ------------------------
-- create the table for eventSiteHasDivisionAndGenders
CREATE TABLE eventSiteHasDivision (
	eventSiteHasDivisionID	INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventSiteID				INT				NOT NULL,
	divisionID				TINYINT			NOT NULL,
	FOREIGN KEY (eventSiteID) REFERENCES eventSites (eventSiteID),
	FOREIGN KEY (divisionID) REFERENCES divisions (divisionID)
);

-- ------------------------
-- create the table for eventSiteHasDivisionAndGenders
CREATE TABLE eventSiteHasGender (
	eventSiteHasGenderID	INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventSiteID				INT				NOT NULL,
	genderID					TINYINT			NOT NULL,
	FOREIGN KEY (eventSiteID) REFERENCES eventSites (eventSiteID),
	FOREIGN KEY (genderID) REFERENCES genders (genderID)
);

-- ------------------------
-- create the table for schoolOrders
CREATE TABLE schoolOrders (
	schoolOrderID			INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	eventID					INT				NOT NULL,
	divisionID				TINYINT			NOT NULL,
	schoolID					INT				NOT NULL,
	isDone					BOOLEAN			NOT NULL		DEFAULT FALSE,
		-- the following all only apply to orders with add ons, and will default to NULL
	addedS					TINYINT			NULL			DEFAULT NULL,
	addedM					TINYINT			NULL			DEFAULT NULL,
	addedL					TINYINT			NULL			DEFAULT NULL,
	addedXL					TINYINT			NULL			DEFAULT NULL,
	addedXXL					TINYINT			NULL			DEFAULT NULL,
	addedXXXL				TINYINT			NULL			DEFAULT NULL,
	due						INT				NULL			DEFAULT NULL,
	paid					BOOLEAN			NULL			DEFAULT NULL,
	schoolOrderNote			TEXT			NULL			DEFAULT NULL,
	invoiceSent					BOOLEAN			NULL			DEFAULT NULL,
	FOREIGN KEY (eventID) REFERENCES events (eventID),
	FOREIGN KEY (divisionID) REFERENCES divisions (divisionID),
	FOREIGN KEY (schoolID) REFERENCES schools (schoolID)
);

-- ------------------------
-- create the table for messageOrders
CREATE TABLE messageOrders (
	messageOrderID			INT				NOT NULL		PRIMARY KEY		AUTO_INCREMENT,
	schoolOrderID			INT				NOT NULL,
	genderID					TINYINT			NOT NULL,
	s							TINYINT			NOT NULL,
	m							TINYINT			NOT NULL,
	l							TINYINT			NOT NULL,
	xl							TINYINT			NOT NULL,
	xxl						TINYINT			NOT NULL,
	xxxl						TINYINT			NOT NULL,
	orderedBy				VARCHAR(60)		NOT NULL,
	orderText				TEXT,			-- nullable
	orderDate				DATETIME		NOT NULL		DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (schoolOrderID) REFERENCES schoolOrders (schoolOrderID),
	FOREIGN KEY (genderID) REFERENCES genders (genderID)
);
