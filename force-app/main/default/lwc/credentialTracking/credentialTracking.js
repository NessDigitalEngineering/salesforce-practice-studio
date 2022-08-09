import { LightningElement, api, wire, track } from "lwc";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS from "@salesforce/schema/User_Credential__c.Status__c";
import getUserCredentials from "@salesforce/apex/CredentialTrackingController.getUserCredentials";
import updateUserCredential from "@salesforce/apex/CredentialTrackingController.updateUserCredential";
import USER_ID from "@salesforce/user/Id";
import CompTitle from "@salesforce/label/c.CredentialTracking_Title";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import Credential_Object from "@salesforce/schema/Credential_Exam_Attempt__c";
import CredentialName from "@salesforce/schema/Credential_Exam_Attempt__c.Credential__c";
import ExamDate from "@salesforce/schema/Credential_Exam_Attempt__c.Exam_Date_Time__c";
import Comments from "@salesforce/schema/Credential_Exam_Attempt__c.Preparation_Comments__c";

export default class CredentialTracking extends LightningElement {
	label = { CompTitle };
	examDetailsObject = Credential_Object;
	examFields = [CredentialName, ExamDate, Comments];
	userIds = USER_ID;
	title;
	Icn = TasksIcon;
	statusValuesReady = false;
	@track userCredentialsData;
	@track statusValues = [];
	@track countRec;
	@track showIcon = false;
	@track emptyRecords = true;
	@track isShowModal = false;
	@track displayExamDetailsModal = false;

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
					if (e.Status__c != "Ready") {
						this.hideModalBox();
						e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
						e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
						e.credentialName = e.Credential__r.Name;
					} else {
						this.isShowModal = true;
						e.credentialName = e.Credential__r.Name;
					}
					// e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
					// e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
					// e.credentialName = e.Credential__r.Name;
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

	@track date = "";
	credential;
	@track comments = "";

	handleNameChange(event) {
		this.credential = event.detail.value;
		console.log("credential---" + this.credential);
	}

	handleDateChange(event) {
		this.date = event.target.value;
		console.log("date---" + this.date);
	}

	handleCommentChange(event) {
		this.comments = event.target.value;
		console.log("comments---" + this.comments);
	}

	createNewRecord() {
		var fields = {
			Credential__c: this.credential,
			Exam_Date_Time__c: this.date,
			Preparation_Comments__c: this.comments
		};
		console.log("fields" + JSON.stringify(fields));
		var objRecordInput = { apiName: "Credential_Exam_Attempt__c", fields };
		createRecord(objRecordInput)
			.then((response) => {
				alert("CredentialExamAttempt created with id:" + response.id);
			})
			.catch((error) => {
				alert("Error: " + JSON.stringify(error));
			});
	}

	navigateToDetails() {
		this.CredentialName = this.credential;
		this.ExamDate = this.date;
		this.Comments = this.comments;

		const recordInput = { fieldApiName: credentialExamAttempt.objectApiName, fields };
		createRecord(recordInput)
			.then((examAttemptObj) => {
				this.examAttempId = examAttemptObj.Id;
				this.dispatchEvent(
					new ShowToastEvent({
						title: "Success",
						message: "Contact record has been created",
						variant: "success"
					})
				);
				this[NavigationMixin.Navigate]({
					type: "standard__recordPage",
					attributes: {
						objectApiName: "Credential_Exam_Attempt__c",
						actionName: "view"
					}
				});
			})
			.catch((error) => {
				this.dispatchEvent(
					new ShowToastEvent({
						title: "Error creating record",
						message: error.body.message,
						variant: "error"
					})
				);
			});
	}

	hideModalBox() {
		this.isShowModal = false;
	}

	closeModal() {
		this.displayExamDetailsModal = false;
	}

	showExamDetailsModal() {
		this.displayExamDetailsModal = true;
	}
}
