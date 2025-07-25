export class InputOrder {
		//we're using 'sport' in place of 'event' because event is a key word
	constructor(orderedBy, school, division, sport, gender, sizes, fileName, orderText, comment) {
		this.sport = sport;
		this.division = division;
		this.school = school;
		this.gender = gender;
		this.sizes = sizes;
		this.fileName = fileName;
		this.orderedBy = orderedBy;
		this.orderText = orderText;
		this.comment = comment;
	}
}


export class ActionRequest {
	constructor(action, actionClass, data) {
		this.action = action;
		this.actionClass = actionClass;
		this.data = data;
	}
}