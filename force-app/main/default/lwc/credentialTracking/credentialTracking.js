import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS from "@salesforce/schema/User_Credential__c.Status__c";
import getUserCredentials from "@salesforce/apex/CredentialTrackingController.getUserCredentials";
import updateUserCredential from "@salesforce/apex/CredentialTrackingController.updateUserCredential";
import USER_ID from "@salesforce/user/Id";
import CompTitle from "@salesforce/label/c.CredentialTracking_Title";
import EmptyMsg from "@salesforce/label/c.CredentailAssignment_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";

export default class CredentialTracking extends LightningElement {
	label = { CompTitle, EmptyMsg };
	userIds = USER_ID;
	title;
	Icn = TasksIcon;
	statusValuesReady = false;
	@track userCredentialsData;
	@track statusValues = [];
	@track countRec;
	@track showIcon = false;
	@track emptyRecords = true;

	/*
		@description    :   Wire service is used to get metadata for a single object
		@param          :   passing object(User_Credential__c) API name
	*/
	@wire(getObjectInfo, { objectApiName: "User_Credential__c" })
	userCredentialMetadata;

	/*
		@description    :   Using wire service to get all picklist values
		@param          :   defaultRecordTypeId & STATUS
	*/

	@wire(getPicklistValues, { recordTypeId: "$userCredentialMetadata.data.defaultRecordTypeId", fieldApiName: STATUS })
	picklistValues({ data, error }) {
		if (data) {
			for (const statusVal of data.values) {
				this.statusValues.push(statusVal.value);
			}
			this.statusValuesReady = true;
		}
		if (error) {
			console.log(error);
		}
	}

	/*
		@description    :   Displays logged IN user current assignments.
		@param          :   userIds
	*/

	connectedCallback() {
		getUserCredentials({ userId: this.userIds })
			.then((res) => {
				this.totalUserCredentials = res;
				this.processStatusValues();
			})
			.catch((error) => {
				console.log("error" + JSON.stringify(error));
			});
	}

	/*
		@description    :   Displays all active user credential records when status value is not equal to completed
		@param          :   event target value & event target title
	*/
	handleClick(event) {
		updateUserCredential({ id: event.target.value, status: event.target.title })
			.then((result) => {
				if (result === true) {
					getUserCredentials({ userId: this.userIds })
						.then((rs) => {
							this.totalUserCredentials = rs;
							this.totalUserCredentials.forEach((e) => {
								if (e.Status__c === "Ready") {
									this.template.querySelector('c-voucher-request').handleCredentialName(e.Credential__r.Name);
									this.template.querySelector('c-voucher-request').handleCredentialId(e.Id);
								}
							});
							this.processStatusValues();
						})
						.catch((error) => {
							console.log("error" + JSON.stringify(error));
						});
				}
			})
			.catch((error) => {
				console.log("error" + JSON.stringify(error));
			});
	}
	/*
		@description    :   Update status value
	*/
	processStatusValues() {
		if (this.statusValuesReady) {
			this.totalUserCredentials.forEach((e) => {
				if (e.Status__c && e.Status__c != "Completed") {
					e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
					e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
					e.credentialName = e.Credential__r.Name;
				}
			});
			this.processData(this.totalUserCredentials);
		} else {
			this._interval = setInterval(() => {
				this.processStatusValues();
				clearInterval(this._interval);
			}, 0);
		}
	}
	/*
		@description    :   Displays logged IN user current assignments and title, also shows the Icon if no records are found.
		@param          :   data
	*/
	processData(data) {
		this.countRec = data.length;
		if (data.length === 0) {
			this.showIcon = true;
			this.emptyRecords = false;
		}
		this.userCredentialsData = data;
		if (this.countRec > 0) {
			this.title = this.label.CompTitle + " (" + data.length + ")";
		} else {
			this.title = this.label.CompTitle;
		}
	}
}