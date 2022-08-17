<<<<<<< HEAD
import { LightningElement, wire, track } from "lwc";
=======
import { LightningElement, api, wire, track } from "lwc";
>>>>>>> origin/Pseudo-Develop
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS from "@salesforce/schema/User_Credential__c.Status__c";
import getUserCredentials from "@salesforce/apex/CredentialTrackingController.getUserCredentials";
import updateUserCredential from "@salesforce/apex/CredentialTrackingController.updateUserCredential";
import USER_ID from "@salesforce/user/Id";
import CompTitle from "@salesforce/label/c.CredentialTracking_Title";
<<<<<<< HEAD
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";

export default class CredentialTracking extends LightningElement {
	label = { CompTitle };
=======
import EmptyMsg from "@salesforce/label/c.CredentailAssignment_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";

export default class CredentialTracking extends LightningElement {
	label = { CompTitle, EmptyMsg };
>>>>>>> origin/Pseudo-Develop
	userIds = USER_ID;
	title;
	Icn = TasksIcon;
	statusValuesReady = false;
	@track userCredentialsData;
	@track statusValues = [];
	@track countRec;
	@track showIcon = false;
	@track emptyRecords = true;
<<<<<<< HEAD
	@track isShowModal = false;
	@track credential;

	/*
		@description    :   Wire service is used to get metadata for a single object 
		@param          :   passing object(User_Credential__c) API name 
	*/
=======

	/*
        @description    :   Wire service is used to get metadata for a single object
        @param          :   passing object(User_Credential__c) API name
    */
>>>>>>> origin/Pseudo-Develop
	@wire(getObjectInfo, { objectApiName: "User_Credential__c" })
	userCredentialMetadata;

	/*
<<<<<<< HEAD
		@description    :   Using wire service to get all picklist values 
		@param          :   defaultRecordTypeId & STATUS
	*/
=======
        @description    :   Using wire service to get all picklist values
        @param          :   defaultRecordTypeId & STATUS
    */
>>>>>>> origin/Pseudo-Develop
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
<<<<<<< HEAD
		@description    :   Displays logged IN user current assignments. 
		@param          :   userIds
	*/
=======
        @description    :   Displays logged IN user current assignments.
        @param          :   userIds
    */
>>>>>>> origin/Pseudo-Develop
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
<<<<<<< HEAD
		@description    :   Displays all active user credential records when status value is not equal to completed 
		@param          :   event target value & event target title
	*/
=======
        @description    :   Displays all active user credential records when status value is not equal to completed
        @param          :   event target value & event target title
    */
>>>>>>> origin/Pseudo-Develop
	handleClick(event) {
		updateUserCredential({ id: event.target.value, status: event.target.title })
			.then((result) => {
				if (result === true) {
					getUserCredentials({ userId: this.userIds })
						.then((rs) => {
							this.totalUserCredentials = rs;
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
<<<<<<< HEAD
		@description    :   Update status value
	*/
=======
        @description    :   Update status value
    */
>>>>>>> origin/Pseudo-Develop
	processStatusValues() {
		if (this.statusValuesReady) {
			this.totalUserCredentials.forEach((e) => {
				if (e.Status__c && e.Status__c != "Completed") {
<<<<<<< HEAD
					if (e.Status__c === "Ready") {
						this.template.querySelector("c-voucher-request").handleExamInputs(e.Credential__r.Name);
					}
					e.credentialName = e.Credential__r.Name;
					e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
					e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
=======
					e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
					e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
					e.credentialName = e.Credential__r.Name;
>>>>>>> origin/Pseudo-Develop
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
<<<<<<< HEAD
		@description    :   Displays logged IN user current assignments and title, also shows the Icon if no records are found.
		@param          :   data
	*/
=======
        @description    :   Displays logged IN user current assignments and title, also shows the Icon if no records are found.
        @param          :   data
    */
>>>>>>> origin/Pseudo-Develop
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
