import { LightningElement, wire, track, api } from "lwc";
import getCompletedUserCredentials from "@salesforce/apex/UserCredentialService.getCompletedUserCredentials";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import EmptyCard from "@salesforce/label/c.emptyCard";
import Earned_Credentials from "@salesforce/label/c.Earned_Credentials";
export default class EarnedCredentials extends LightningElement {
	label = { EmptyCard, Earned_Credentials };
	title;
	userCredentialsData;
	@track loaded = false;
	@api senddata = "";
	@track showIcon = true;
	icon = TasksIcon;

	@wire(getCompletedUserCredentials, { userId: "$senddata" }) userdata({ data, error }) {
		if (data) {
			let selectedRec = [];

			for (let i = 0; i < data.length; i++) {
				selectedRec.push(data[i]);
			}
			this.userCredentialsData = selectedRec;


			if (data.length > 0) {
				this.showIcon = false;
				this.fireCountEvent( Earned_Credentials +" (" + data.length + ")");
			} else {
				this.showIcon = true;
				this.fireCountEvent(Earned_Credentials);
			}

			this.loaded = true;
		} else if (error) {
			console.log("error1" + JSON.stringify(error));
		}
	}

	fireCountEvent(title){
		const countEvent = new CustomEvent("title", {
			detail: title
		});
		console.log('fired event: ',title);
		this.dispatchEvent(countEvent);
	}

	@api
	resetCredentials() {
	  this.userCredentialsData = [];
	  this.showIcon = true;
	}
}