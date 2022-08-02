import { LightningElement, wire, track, api } from "lwc";
import getCompletedUserCredentials from "@salesforce/apex/UserCredentialService.getCompletedUserCredentials";
import strUserId from "@salesforce/user/Id";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import ShowmoreTitle from "@salesforce/label/c.CredentialTracking_ShowmoreTitle";
import ShowlessTitle from "@salesforce/label/c.CredentialTracking_ShowlessTitle";
export default class EarnedCredentials extends LightningElement {
	label = { ShowmoreTitle, ShowlessTitle };
	userIds = strUserId;
	title;
	userCredentialsData;
	@track userCredData;
	@track countRec;
	@track showMore = false;
	@track showLess = false;
	@track initialRecords = false;
	//@track showMoreRecords = false;
	@track loaded = false;
	@track totalUserCredentials;
	@api senddata = "";
	@track showIcon = true;
	icon = TasksIcon;
	@track showUtilityIcon = false;

	@wire(getCompletedUserCredentials, { userId: "$senddata" }) userdata({ data, error }) {
		if (data) {
			this.totalUserCredentials = data;
			this.countRec = data.length;
			let selectedRec = [];

			if (this.countRec > 2) {
				this.showMore = true;
				this.initialRecords = true;
				for (let i = 0; i < this.countRec; i++) {
					if (i < 2) {
						selectedRec.push(data[i]);
					}
				}
				this.userCredentialsData = selectedRec;
				this.userCredData = selectedRec;
			} else {
				if (this.countRec === 0) {
					this.showUtilityIcon = true;
					this.title = "Earned Credentials (" + data.length + ")";
				}
				this.showMore = false;
				this.initialRecords = true;
				this.userCredentialsData = data;
			}

			if (this.countRec > 0) {
				this.showIcon = false;
				this.title = "Earned Credentials (" + data.length + ")";
			} else {
				this.showIcon = true;
				this.showUtilityIcon = false;
				this.title = "Earned Credentials";
			}

			this.loaded = true;
		} else if (error) {
			console.log("error1" + JSON.stringify(error));
		}
	}

	connectedCallback() {
		getCompletedUserCredentials({ userId: this.senddata })
			.then((res) => {
				this.totalUserCredentials = res;
			})
			.catch((error) => {
				console.log("error2" + JSON.stringify(error));
			});
	}
	showMoreRec() {
		this.initialRecords = false;
		this.showMoreRecords = true;
		this.showMore = false;
		this.showLess = true;
		this.userCredentialsData = this.totalUserCredentials;
	}

	showLessRec() {
		this.initialRecords = false;
		this.showMoreRecords = true;
		this.showMore = true;
		this.showLess = false;
		this.userCredentialsData = this.userCredData;
	}
}