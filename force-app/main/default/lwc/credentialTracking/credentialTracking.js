import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS from "@salesforce/schema/User_Credential__c.Status__c";
import getUserCredentials from "@salesforce/apex/CredentialTrackingController.getUserCredentials";
import updateUserCredential from "@salesforce/apex/CredentialTrackingController.updateUserCredential";
import USER_ID from "@salesforce/user/Id";
import CompTitle from "@salesforce/label/c.CredentialTracking_Title";
import EmptyMsg from "@salesforce/label/c.CredentailAssignment_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import { subscribe, unsubscribe, APPLICATION_SCOPE, MessageContext } from "lightning/messageService";
import refreshChannel from "@salesforce/messageChannel/RefreshComponent__c";

export default class CredentialTracking extends LightningElement {
	label = { CompTitle, EmptyMsg };
	userId = USER_ID;
	title;
	Icn = TasksIcon;
	statusValuesReady = false;
	@track userCredentialsData;
	@track statusValues = [];
	@track countRec;
	@track showIcon = false;
	@track emptyRecords = true;
	@track showVoucherReq = false;
	@track credObj = {};
	subscription = null;

	@wire(MessageContext)
	messageContext;
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
		@param          :   userId
	*/

	connectedCallback() {
		this.subscribeToMessageChannel();
		this.getUserCredentials();
	}

	disconnectedCallback() {
		this.unsubscribeToMessageChannel();
	}

	subscribeToMessageChannel() {
		if (!this.subscription) {
			this.subscription = subscribe(
				this.messageContext,
				refreshChannel,
				(message) => this.handleMessage(message),
				{ scope: APPLICATION_SCOPE }
			);
		}
	}

	handleMessage(message) {
		if (message.refresh && message.userId === this.userId) {
			this.getUserCredentials();
		}
	}

	unsubscribeToMessageChannel() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	getUserCredentials() {
		getUserCredentials({ userId: this.userId })
			.then((res) => {
				this.totalUserCredentials = res;
				this.processStatusValues();
			})
			.catch((error) => {
				console.log("error" + JSON.stringify(error));
			});
	}

	/*
		@description    :   Event handler to update the status of user credential record
		@param          :   event target value & event target title
	*/

	handleClick(event) {
		let credName = event.target.name;
		let credId = event.target.value;
		let credStatus = event.target.title;
		this.credObj = { credName: credName, credId: credId, credStatus: credStatus };
		if (credStatus === "Ready") {
			let index = this.userCredentialsData.findIndex((x) => x.Id === credId);
			this.userCredentialsData[index].showVoucherReq = true;
		} else if (credStatus !== "Completed") {
			this.updateStatus(credId, credStatus);
		}
	}

	/*
		@description    :  Updates the status of user credential record
		@param  recordId :record id of User Credential record
		@param status: record status to be updated
	*/
	updateStatus(recordId, status) {
		updateUserCredential({ id: recordId, status: status })
			.then((result) => {
				if (result) {
					getUserCredentials({ userId: this.userId })
						.then((rs) => {
							this.totalUserCredentials = rs;
							this.processStatusValues();
						})
						.catch((error) => {
							console.error(error.message);
						});
				}
			})
			.catch((error) => {
				console.error(error.message);
			});
	}
	
	/*
		@description    :  Event handler on sucessfully creation of exam attempt record
	*/
	handleSuccess(event) {
		this.updateStatus(event.detail.recId, event.detail.statusToBeUpdated);
		let index = this.userCredentialsData.findIndex((x) => x.Id === event.detail.recId);
		this.userCredentialsData[index].showVoucherReq = false;
	}

	/*
		@description    : Resets voucher request flag
	*/
	resetVoucherReq(event) {
		let index = this.userCredentialsData.findIndex((x) => x.Id === event.detail.recId);
		this.userCredentialsData[index].showVoucherReq = false;
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