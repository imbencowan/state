// if we're ever updating this, just take the first 8 schools of a division rather than randoming 8 times and potentially getting repeats
	// probably just schoolID = schoolOffset + k;
		// the code brings McCall-Donnelly in as Call-Donnelly ///////////


class School {
	constructor(name, division, district, adName, adPhone, adEmail) {
		this.name = name;
		this.division = division;
		this.district = district;
		this.adName = adName;
		this.adPhone = adPhone;
		this.adEmail = adEmail;
	}
}



let year = 23;
let orders = [];
let schools = [[], [], [], [], [], []];
let schoolID = "";
let sizes = "";
let orderedBy = "";

function run() {
		// make schools
	readSchools();
	builtSchoolsInsert();
	
		// each sport
	for (i = 1; i < 25; ++i) {
		let divs = 2;
		switch (i) {
			 case 8:
			 case 9:
				divs = 2;
				break;
			 case 11:
			 case 14:
			 case 17:
			 case 18:
			 case 21:
			 case 22:
				divs = 3;
				break;
			 case 1:
			 case 2:
			 case 13:
			 case 15:
				divs = 4;
				break;
			 case 6:
			 case 7:
			 case 20:
			 case 23:
			 case 24:
				divs = 5;
				break;
			 case 5:
			 case 10:
			 case 12:
			 case 16:
			 case 19:
				divs = 6;
				break;
		}
			// each division
		for (j = 6; j > 6 - divs; --j) {
			let schoolOffset;
			switch(j){
				case 6: 
					schoolOffset = 148;
					break;
				case 5: 
					schoolOffset = 120;
					break;
				case 4: 
					schoolOffset = 101;
					break;
				case 3: 
					schoolOffset = 74;
					break;
				case 2: 
					schoolOffset = 37;
					break;
				case 1: 
					schoolOffset = 0;
					break;
			}
				
		
				// 8 qualifiers
			for (k = 0; k < 8; ++k) {
					//make an order
				let schoolRand = getIntRand(1, 18);
				let schoolID = schoolRand + schoolOffset;
				let orderedBy = schools[j-1][schoolRand - 1].adName;
				let s = getIntRand(0, 5);
				let m = getIntRand(0, 12);
				let l = getIntRand(0, 12);
				let xl = getIntRand(0, 4);
				let xxl = getIntRand(0, 1);
				let xxxl = getIntRand(0, 1);
				orders.push([year, i, j, schoolID, s, m, l, xl, xxl, xxxl, orderedBy]);
				
			}
		}
	}
	// console.log(orders);
	
	buildOrdersInsert(orders);
}

function getIntRand(min, max) {
	let factor = max - min + 1;
	let part = Math.floor(Math.random() * factor);
	return part + min;
}


	// wow
function readSchools() {
	let str = schoolText;
	let schoolStrings = [];
	let subStop = str.search(/[a-z][A-Z]/) + 1;
	
	while (subStop != 0) {
		let sub = str.slice(0, subStop);
		let check = sub.search(/[1-6][A]/);
		if (check != -1) schoolStrings.push(sub);
		else schoolStrings[schoolStrings.length - 1] += ', ' + sub;
		str = str.slice(subStop);
		subStop = str.search(/[a-z][A-Z]/) + 1;
	}
		// once more to get the last one
	schoolStrings.push(str.slice(0));
	// console.log(schoolStrings);
	
	schoolStrings.forEach((str) => {
		let subStart = 0;
		let subStop = str.indexOf('\t', subStart);
		let subs = [];
		while (subStop != -1) {
			let subSlice = str.slice(subStart, subStop)
				// check if the subSlice contains a comma. this only occurred where we inserted one between repeat ad names
			let check = subSlice.indexOf(',');
			if (check != -1) subSlice = str.slice(subStart, check);
			
			subs.push(subSlice);
			subStart = subStop + 1;
			subStop = str.indexOf('\t', subStart);
		}
		subs.push(str.slice(subStart));
		// console.log(subs[0]);
		// console.log(subs[1]);
		// console.log(subs[2]);
			// i think this is slicing the 'A' off the division, to array schools by division
		let x = subs[1].slice(0, 1) - 1;
		schools[x].push(new School(subs[0], subs[1], subs[2], subs[3], subs[4], subs[5]));
	});
	
	console.log(schools);
}


function builtSchoolsInsert() {
	let insertString = 'INSERT INTO schools (schoolName, divisionID) VALUES ';
	let d = 1;
	schools.forEach((division) => {
		division.forEach((school) => {
			let districtID;
			switch (school.district) {
				case 'I':
					districtID = 1;
					break;
				case 'II':
					districtID = 2;
					break;
				case 'III':
					districtID = 3;
					break;
				case 'IV':
					districtID = 4;
					break;
				case 'V':
					districtID = 5;
					break;
				case 'VI':
					districtID = 6;
					break;
			}
			insertString += '("' + school.name + '", ' + d + ', ' + districtID + '),\n';
		});
		++d;
	});
	insertString = insertString.slice(0, -2);
	insertString += ';';
	console.log(insertString);
	let x = document.getElementById('display');
	x.value = insertString;
}

function buildOrdersInsert(orders) {
	let insertString = 'INSERT INTO orders (orderYear, sportID, divisionID, schoolID, s, m, l, xl, xxl, xxxl, orderedBy) VALUES '
	orders.forEach((order) => {
		insertString += '('
		order.forEach((o) => {
			if (typeof o === 'string' || o instanceof String) {
				if (o.length == 0) o = 'John Smith';
				insertString += '"' + o + '", ';
			} else {			
				insertString += o +', ';
			}
			// console.log(o);
		});
	insertString = insertString.slice(0, -2);
	insertString += '),\n';
	});
	insertString = insertString.slice(0, -2);
	insertString += ';';
	console.log(insertString);
}
	

	



let schoolText = "Aberdeen High School	3A	V	Natalie Lewis	208-241-7625	lewisn@aberdeen58.org" + "Alturas Preparatory Academy	2A	VI	Morgan Stewart	208-313-9896	morgan.stewart@alturasacademy.org" + "Ambrose School	3A	III	Kelly Barbour	208-323-3888	kbarbour@theambroseschool.org" + "American Falls High School	4A	V	Brandon Jackson	208-226-2531	brandonj@sd381.k12.id.us" + "American Heritage Charter School	1A	VI	Shawn Rose	208-243-1090	roses@ahcspatriots.us" + "Bear Lake High School	5A	V	Jared Hillier	208-847-0294	jhillier@blsd.net" + "Bishop Kelly High School	5A	III	Tom Shanahan" + "Cheryl Hutchinson	208-375-6010 x2030" + "208-724-2180	tshanahan@bk.org" + "chutchinson@bk.org" + "Blackfoot High School	5A	VI	Cody Shelley	208-317-5510	shelcody@d55.k12.id.us" + "Bliss High School	1A	IV	Brent Bjornn" + "Emily Roe	208-352-4445" + "208-352-4445	brent.bjornn@bliss234.org" + "emily.roe@bliss234.org" + "Boise High School	6A	III	Brian Barber" + "Rod Daron	208-854-4329" + "208-863-1242	brian.barber@boiseschools.org" + "rod.daron@boiseschools.org" + "Bonners Ferry High School	4A	I	Curt-Randall Bayer" + "Lisa Iverson	208-267-3149 x1110" + "208-267-3149 x1104	curt.bayer@mail.bcsd101.com" + "lisa.iverson@mail.bcsd101.com" + "Bonneville High School	5A	VI	Tyler Johnson	208-525-4406	johnsont@d93.k12.id.us" + "Borah High School	6A	III	Vince Mann	208-854-4391	vince.mann@boiseschools.org" + "Buhl High School	4A	IV	Stacy Wilson	208-543-8262 x209	swilson@buhlschools.org" + "Burley High School	5A	IV	Randy Winn	208-878-6606	winrandy@cassiaschools.org" + "Butte County High School	2A	VI	Angie McAffee	208-604-0189	mcafangi@butteschools.org" + "Caldwell High School	6A	III	Jon Hallock	208-455-3304	jhallock@caldwellschools.org" + "Camas County High School	1A	IV	Michelle Ruetmann	208-764-2472	mruetmann@camascountyschools.org" + "Cambridge High School	1A	III	Brendon Wolfe" + "Sara Kindall	801-319-5731" + "208-566-1097	bwolfe@cambridge432.org" + "skindall@cambridge432.org" + "Canyon Ridge High School	6A	IV	Ted Reynolds	208-732-7555	reynoldste@tfsd.org" + "Capital High School	6A	III	Jason Willer	208-854-4501	jason.willer@boiseschools.org" + "Carey High School	1A	IV	Lee Jay Cook" + "Merrilee Sears	208-481-0542	ljcook@blaineschools.org" + "msears@blaineschools.org" + "Cascade High School	1A	III	Ron Emry	208-971-1253	ronem@cascadeschools.org" + "Castleford High School	1A	IV	Brian Lowry	208-537-6511	blowry@castlefordschools.org" + "Centennial Baptist School	2A	III	Jo Holloway	208-249-6831	jholloway@cbschool.org" + "Centennial High School	6A	III	Gavin Watson" + "Josh Aipperspach	208-855-4250	watson.gavin@westada.org" + "aipperspach.josh@westada.org" + "Century High School	5A	V	Mark Pixton	208-478-6863	pixtonma@sd25.us" + "Challis High School	1A	VI	Linda Zollinger" + "Jennifer Zollinger	208-833-4840" + "208-879-2439	zolly2232@gmail.com" + "zolljenn@d181.k12.id.us" + "Clark County High School	1A	VI	Jill Grover" + "Erica Perez	208-374-5215" + "208-374-5215	ccad@ccsd161.org" + "ccad@ccsd161.org" + "Clark Fork High School	2A	I	KC MacDonald	208-255-7177	kc.macdonald@lposd.org" + "Clearwater Valley High School	2A	II	Allen Hutchens	208-926-4511	hutchensa@sd244.org" + "Coeur d'Alene Charter Academy	4A	I	Aaron Lippy" + "Rachel Reiswig	208-676-1667" + "208-676-1667	alippy@cdacharter.org" + "rreiswig@cdacharter.org" + "Coeur d'Alene High School	6A	I	Victoria Beecher	208-667-4500	victoria.beecher@cdaschools.org" + "Coeur du Christ Academy	1A	I	Kellen Clemens	541-521-7211	k.clemens@coeurduchrist.org" + "Cole Valley Christian High School	4A	III	Connor Jackson	208-947-1212 x1508	connor.jackson@cvcsonline.org" + "Columbia High School	5A	III	Todd Cady	208-880-2810	tcady@nsd131.org" + "Compass Charter High School	3A	III	Jake Trudeau	208-401-8056	jtrudeau@compasscharter.org" + "Council High School	1A	III	Paula Tucker" + "N/A	208-630-4997	ptucker@csd13.org" + "Culdesac High School	1A	II	Lindsey Felton	208-843-5413	lfelton@culsch.org" + "Deary High School	1A	II	Jalen Kirk	208-877-1151	jkirk@sd288.org" + "Declo High School	4A	IV	Jennifer Murdock	208-360-3800	murjenni@cassiaschools.org" + "Dietrich High School	3A	IV	Brody Astle	208-544-2158	brodya@dietrichschools.org" + "Eagle High School	6A	III	Tony Brulotte	208-251-5964	brulotte.tony@westada.org" + "Emmett High School	5A	III	Kevin Beard	208-365-6323 x1655	kbeard@isd221.net" + "Filer High School	4A	IV	Brodie Parrott	208-326-5944	brodie.parrott@filer.k12.id.us" + "Firth High School	3A	VI	Scott Adams	208-346-6812	sadams@d59.k12.id.us" + "Fruitland High School	4A	III	Mark Van Weerdhuizen	208-452-4411	mvanwee@fruitlandschools.org" + "Garden Valley High School	1A	III	Ryan Wiliams	208-462-3756 x1075	rwilliams@gvsd.net" + "Gem State Adventist Academy	2A	III	Aurora Gault	208-283-1084	jperkins@gemstate.org" + "Genesee High School	1A	II	Kelly Caldwell	208-285-1162 x4117	kcaldwell@sd282.org" + "Genesis Prep Academy	2A	I	Jessica Whaley	208-691-0712	jwhaley@genesisprep.org" + "Glenns Ferry High School	2A	IV	Kelli McHone	208-366-7434 x103	kmchone@glennsferryschools.org" + "Gooding High School	4A	IV	Ryon Pope" + "Joelann Cope	208-934-4321 x3349" + "208-293-8245	ryon.pope@goodingschools.org" + "joelann.cope@goodingschools.org" + "Grace High School	2A	V	Travis Draper	208-425-3731	tdraper@sd148.org" + "Grace Lutheran High School	1A	V	Jeremy Hess	208-317-4566	jhess@gracepocatello.org" + "Grangeville High School	3A	II	Bryan Rojas	208-983-0580	gvad@sd244.org" + "Greenleaf Friends Academy	2A	III	Nate Freeman	208-459-6346	gfaathletics@gfaschools.org" + "Hagerman High School	2A	IV	Corey Bobryk	208-837-4572	corey.bobryk@hjsd.org" + "Hansen High School	1A	IV	Jim Lasso	208-423-5593 x2214	jlasso@hansenschools.org" + "Highland High School - Craigmont	1A	II	Tana Kellogg	208-924-5211 x2502	tkellogg@sd305.org" + "Highland High School - Pocatello	6A	V	Travis Bell	208-530-0293	belltr@sd25.us" + "Hillcrest High School	5A	VI	Larry Stocking	208-525-4429 x5286	stockinl@d93mail.com" + "Homedale High School	4A	III	Casey Grove	208-340-4611	cgrove@homedaleschools.org" + "Horseshoe Bend High School	1A	III	Dennis Chesnut	208-793-2225	chesnutd@hsbschools.org" + "Idaho Arts Charter School	3A	III	Ken Chapman" + "Marie McGrath	208-463-4324 x467" + "208-463-4324 x448	ken.chapman@idahoartscharter.org" + "marie.mcgrath@idahoartscharter.org" + "Idaho City High School	2A	III	Jason Roeber	208-392-4183 x1295	jroeber@basinschools.net" + "Idaho Falls High School	5A	VI	Nick Birch	208-525-7798	bircnich@sd91.org" + "Idaho School for the Deaf & the Blind	1A	IV	Ken Anderson	208-944-2504	ken.anderson@iesdb.org" + "Jerome High School	5A	IV	Scott Burton" + "Anne Newbry	208-404-1098	scott.burton@jeromeschools.org" + "anne.newbry@jeromeschools.org" + "Kamiah High School	2A	II	Todd Nygaard	208-935-5429	tnygaard@kamiah.org" + "Kellogg High School	3A	I	Scott Miller	208-784-1371	scott.miller@kelloggschools.org" + "Kendrick High School	2A	II	Molly Olson	208-289-4202	molly.olson@sd283.org" + "Kimberly High School	4A	IV	Zach Dong	208-423-4170 x3147	zdong@kimberly.edu" + "Kootenai High School	1A	I	Nolan Kerby	208-689-3311	nkerby@sd274.com" + "Kuna High School	6A	III	Luke Wolf	208-955-0200	lswolf@kunaschools.org" + "Lake City High School	6A	I	Troy Anderson	208-769-0769 x44013	tanderson@cdaschools.org" + "Lakeland High School	5A	I	Matt Neff	208-687-0181	mneff@lakeland272.org" + "Lakeside Junior/Senior High School	2A	I	Adrian Brown-Sonder" + "Avery Brown-Sonder	208-686-1937" + "208-686-1937	brown-sonder.adrian@lakesidesch.org" + "brown-sonder.avery@lakesidesch.org" + "Lapwai High School	2A	II	Lori Lynn Picard" + "Jene Ane Carlin	208-843-2241" + "208-843-2960	wildcats@lapwai.org" + "wildcats@lapwai.org" + "Leadore High School	1A	VI	Ryan Mayo	307-703-0386	rmayo@leadoreschool.org" + "Lewiston High School	5A	II	Doug Henderson	208-748-3105	drhenderson@lewistonschools.net" + "Liberty Charter High School	2A	III	Mark Wachsmuth	208-466-7952	mwachsmuth@libertycharterschool.com" + "Lighthouse Christian High School	2A	IV	Jenny Wood" + "Jenny Wood	208-737-1425 x103" + "208-737-1425	jwood@lighthousecs.org" + "jwood@lighthousecs.org" + "Logos School	2A	II	Patrick Lopez	208-883-3137	plopez@logosschool.com" + "Mackay High School	1A	VI	Michelle Peterson	208-588-2262 x36	michpete@mackayschools.org" + "Madison High School	6A	VI	Shayne Proctor	208-359-3305	proctors@msd321.com" + "Magic Valley High School	3A	IV	Jason Kiester	208-733-8823	kiesterja@tfsd.org" + "Malad High School	3A	V	Joshua Smith" + "Tori Green	208-497-2588" + "208-497-2588	joshua.smith1@malad.us" + "tori.green@malad.us" + "Marsh Valley High School	4A	V	Kent Howell" + "Wyatt Hansen	208-251-0709" + "208-254-3711	khowell@mvsd21.org" + "whansen@mvsd21.org" + "Marsing High School	3A	III	Sean Porter	208-649-5411 x296" + "208-649-5411 x215	sporter@marsingschools.org" + "McCall-Donnelly High School	4A	III	Conor Kennedy	208-315-2759	ckennedy@mdsd.org" + "Meadows Valley High School	1A	III	Brandy Padgett	208-469-0015	bpadgett@mvsd11.org" + "Melba High School	3A	III	Cory Dickard	208-495-2221	cdickard@melbaschools.org" + "Meridian High School	6A	III	Nichole Williamson	208-350-4160	williamson.nichole@westada.org" + "Middleton High School	5A	III	Andy Ankeny" + "Nichole Williamson	208-585-6657 x2017" + "208-585-6657	aankeny@msd134.org" + "nwilliamson@msd134.org" + "Midvale High School	1A	III	Jennifer Uhlenkott	208-355-2234	uhlenkottj@msd433.org" + "Minico High School	5A	IV	Brady Trenkle	208-436-4721 x007	bratrenkle@minidokaschools.org" + "Moscow High School	5A	II	Patrick Laney" + "Jessica Brown	208-892-1109" + "206-919-3865	laneyp@msd281.org" + "brownj@msd281.org" + "Mountain Home High School	5A	IV	Jessica Muraski	208-587-2570	muraski_ja@mtnhomesd.org" + "Mountain View High School	6A	III	Dane Pence	208-855-4050	pence.dane@westada.org" + "Mullan High School	1A	I	Dakota Dykes	208-744-1126	ddykes@mullanschools.com" + "Murtaugh High School	2A	IV	Kristan Young	208-432-5451	kristan.young@murtaugh.k12.id.us" + "Nampa Christian High School	3A	III	Tina Pelkey	208-475-1719	tpelkey@nampachristianschools.com" + "Nampa High School	6A	III	Greg Carpenter	208-498-0551	gcarpenter@nsd131.org" + "New Plymouth High School	3A	III	Blayne Marples	208-739-7519	marplesb@npschools.us" + "Nezperce High School	1A	II	Brian Lee" + "Misti Cook	208-937-2551 x201" + "208-937-2251	blee@nezpercesd.us" + "mcook@nezpercesd.us" + "North Fremont High School	3A	VI	Jodi Beard	208-652-7468	jodibe@sd215.net" + "North Gem High School	1A	V	Camille Yost" + "Brenda Barnes	208-281-8643" + "208-281-8643	ngad@sd149.com" + "ngad@sd149.com" + "North Idaho Stem Charter Academy	2A		Travis Swick	208-687-8002	tswick@northidahostem.org" + "North Star Charter School	3A	III	Kevin Hutchens" + "Erik Hansen	208-939-9600 x307	khutchens@northstarcharter.org" + "erikhansen26@gmail.com" + "Notus High School	2A	III	Jen Wright" + "Brad Huter	208-459-7442 x2113" + "208-459-7442	wrightj@notusschools.org" + "huterb@notusschools.org" + "Oakley High School	2A	IV	Mark Mace	208-862-3328	macmark@cassiaschools.org" + "Orofino High School	3A	II	Rebecca Kosinski	208-476-5557	kosinskir@jsd171.org" + "Owyhee High School	6A	III	Dane Roy" + "Matt Rasmussen	208-350-4620 x1025" + "208-350-4620	roy.dane@westada.org" + "rasmussen.matt@westada.org" + "Parma High School	3A	III	Rikki Tolmie	208-779-4069	rtolmie@parmaschools.org" + "Payette High School	4A	III	Jeremy Burgess" + "Tracy Bratcher	208-940-0782" + "208-739-0691	jeburgess@payetteschools.org" + "trbratcher@payetteschools.org" + "Pocatello High School	5A	V	Robert Parker	208-233-2056	parkerro@sd25.us" + "Post Falls High School	6A	I	Craig Christensen	208-773-0581 x6314	craig.christensen@sd273.com" + "Potlatch High School	2A	II	Katie Ball	208-875-1231	katie.ball@psd285.org" + "Prairie High School	2A	II	Travis Mader" + "Jeff Martin	208-962-3901" + "208-962-3901	mader@sd242.org" + "martinj@sd242.org" + "Preston High School	5A	V	Brent Knapp" + "Ben Szabo	208-852-0280" + "208-852-0280	brent.knapp@psd201.org" + "ben.szabo@psd201.org" + "Priest River Lamanna High School	2A	I	Alex Zepeda	208-448-1211	alexzepeda@sd83.org" + "Raft River High School	2A	IV	Randy Spaeth	208-645-2220	sparandy@cassiaschools.org" + "Renaissance High School	5A	III	Wyatt Tustin	208-350-4380	tustin.wyatt@westada.org" + "Richfield High School	1A	IV	Buck Hendren	208-490-0935	buckhend@richfieldsd.org" + "Ridgevue High School	6A	III	John Hartz	208-453-4480	john.hartz@vallivue.org" + "Rigby High School	6A	VI	Ty Shippen	208-745-7704	tyshippen@sd251.org" + "Rimrock Jr/Sr High School	2A	III	Ashley Merrick	208-834-2260	amerrick@sd365.us" + "Ririe High School	3A	VI	Matt Harris	208-538-7311 x351	mharris@ririe252.org" + "Riverstone International School	2A	III	Kim Liebich	208-484-1560	athletics@riverstoneschool.org" + "Rockland High School	1A	V	Andrew Nelson" + "Greg Larson	208-548-2221" + "208-548-2221	nelsandy@rbulldogs.org" + "larsgreg@rbulldogs.org" + "Rocky Mountain High School	6A	III	Troy Rice	208-350-4358	rice.troy@westada.org" + "Sage International School Boise	2A	III	Arron Walton	208-343-7243 x284	arron.walton@sageintl.org" + "Sage International School Middleton	1A	III	Jarret Ellsworth	208-412-2166	jarret.ellsworth@sageintl.org" + "Salmon High School	3A	VI	Craig Larsen	208-756-2415	craig.larsen@salmon291.org" + "Salmon River High School	1A	III	Jayce Allred		allredj@jsd243.org" + "Sandpoint High School	5A	I	TJ Clary	208-263-3034 x4017	thomas.clary@lposd.org" + "Shelley High School	5A	VI	Josh Wells	208-357-7400 x403	jwells@shelleyschools.org" + "Shoshone High School	2A	IV	Tim Chapman	208-886-2381 x212	tim.chapman@shoshonesd.org" + "Shoshone-Bannock High School	1A	V	Andrew Baldwin	208-238-4200 x1009	abaldwin@sbd537.org" + "Skyline High School	5A	VI	Zairrick Wadsworth	208-525-7767	wadszair@sd91.org" + "Skyview High School	5A	III	Eric Bonds	208-498-0561 x5340	ebonds@nsd131.org" + "Snake River High School	4A	V	Robert Coombs	208-684-3061	coomrobe@snakeriver.org" + "Soda Springs High School	3A	V	Jeff Horsley	208-221-3183	horswill@sodaschools.org" + "South Fremont High School	5A	VI	Chad Hill	208-624-3416	chadh@sd215.net" + "St Maries High School	3A	I	Dakota Wickard	208-245-2142	dwickard@sd41.org" + "St. John Bosco Academy	1A	II	Gene Weckman	530-624-9206	weckman@johnbosco.org" + "Sugar-Salem High School	4A	VI	Jocelyn Hobbs	208-356-0274	jhobbs@sugarsalem.com" + "Sun Valley Community School	3A	IV	Richard Whitelaw	208-727-7776	rwhitelaw@communityschool.org" + "Taylor's Crossing Public Charter School	1A	VI	Seth Boyle	916-420-7057	sboyle@tceagles.org" + "Teton High School	4A	VI	David Joyce	479-236-5054	djoyce@d401.k12.id.us" + "Thunder Ridge High School	6A	VI	Travis Hobson	208-523-4739 x5604	hobsont@d93.k12.id.us" + "Timberlake High School	4A	I	Catey Walton	208-623-6303	cwalton@lakeland272.org" + "Timberline High School - Boise	6A	III	Tol Gropp	208-854-6273	tol.gropp@boiseschools.org" + "Timberline High School - Weippe	1A	II	Cori Pinque	208-435-4411	pinquec@jsd171.org" + "Troy High School	2A	II	James Stoner	208-835-2361	jstoner@troysd287.org" + "Twin Falls High School	5A	IV	Shaun Walker	208-733-6551 x3003	walkersh@tfsd.org" + "Valley High School	2A	IV	Brian Hardy	208-829-5961	hardyb@valley262.org" + "Vallivue High School	5A	III	Kris Knowles	208-454-9253 x1476	kristopher.knowles@vallivue.org" + "Victory Charter High School	2A	III	Mandy Frank	208-442-9400	mfrank@victorycharterschool.net" + "Vision Charter School	3A	III	William Lamitina" + "Darla Harrold	208-455-9220 x310" + "208-455-9002 x351	williamlamitina@visioncsd.org" + "darlaharrold@visioncsd.org" + "Wallace High School	2A	I	Corey Miller	208-753-5315	cmiller@wsd393.org" + "Watersprings School	1A	VI	Evan Bindenagel	208-542-6250	ebindenagel@waterspringsschool.net" + "Weiser High School	4A	III	Bowe vonBrethorst	208-414-2595	vonbrethorstb@weiserschools.org" + "Wendell High School	3A	IV	Nate Kerbs	208-351-0262	nkerbs@wendellschools.org" + "West Jefferson High School	3A	VI	Raquel Torgerson	208-243-0665	raqueltorgerson@wjsd.org" + "West Side High School	3A	V	Tyson Moser	208-747-3411 x440	tmoser@westside202.com" + "Wilder High School	2A	III	Travis Deardorff	208-337-7400 x1108	tdeardorff@wilderschools.org" + "Wood River High School	5A	IV	Kevin Stilling	208-578-5020 x2295	kstilling@blaineschools.org" + "Xavier Charter School	2A	IV	Gary Moon	208-734-3947	gmoon@xaviercharter.org";



// Highland Rams - (Pocatello)
// Idaho Falls Tigers
// Madison Bobcats - (Rexburg)
// Rigby Trojans
// Thunder Ridge Titans - (Idaho Falls)
// Inland Empire League (5A) - (north)

// Coeur d'Alene Vikings
// Lake City Timberwolves - (Coeur d'Alene)
// Lewiston Bengals
// Post Falls Trojans
// Southern Idaho Conference (5A) - (southwest)

// Boise Brave
// Borah Lions - (Boise)
// Capital Eagles - (Boise)
// Centennial Patriots - (Boise, W. Ada S.D.)
// Eagle Mustangs
// Kuna Kaveman
// Meridian Warriors
// Middleton Vikings
// Mountain View Mavericks - (Meridian)
// Nampa Bulldogs
// Owyhee Storm - (Meridian)
// Rocky Mountain Grizzlies - (Meridian)
// Timberline Wolves - (Boise)



// 4 golf
// 4 golf
// 3 soccer
// 3 soccer
// 6 volleyball
// 5 x country
// 5 x country
// 2 swimming
// 2 swimming
// 6 football
// 3 drama
// 6 g basket
// 4 wrestling
// 3 dance
// 4 cheer
// 6 b basket
// 3 debate
// 6 softball
// 5 baseball
// 3 tennis
// 3 tennis
// 5 track
// 5 track
