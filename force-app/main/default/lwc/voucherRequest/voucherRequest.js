import { LightningElement, api, track } from "lwc";
import Credential_Object from "@salesforce/schema/Credential_Exam_Attempt__c";
import CredentialName from "@salesforce/schema/Credential_Exam_Attempt__c.Credential__c";
import ExamDate from "@salesforce/schema/Credential_Exam_Attempt__c.Exam_Date_Time__c";
import Comments from "@salesforce/schema/Credential_Exam_Attempt__c.Preparation_Comments__c";

export default class VoucherRequest extends LightningElement {
	@track date = "";
	@track credentialValue;
	@track comments = "";
	@track displayExamDetailsModal = false;
	@track isShowModal = false;
	examDetailsObject = Credential_Object;
	examFields = [CredentialName, ExamDate, Comments];

	hideModalBox() {
		this.isShowModal = false;
	}

	@api handleStatus(cred) {
		this.credentialValue = cred;
		this.isShowModal = true;
	}

	closeModal() {
		this.displayExamDetailsModal = false;
	}

	showExamDetailsModal() {
		this.displayExamDetailsModal = true;
	}

	// handleNameChange() {
	// 	this.credential = credentialValue;
	// 	console.log("credential---" + this.credential);
	// }

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
			Credential__c: this.credentialValue,
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

	// navigateToDetails() {
	// 	this.CredentialName = this.credential;
	// 	this.ExamDate = this.date;
	// 	this.Comments = this.comments;

	// 	const recordInput = { fieldApiName: credentialExamAttempt.objectApiName, fields };
	// 	createRecord(recordInput)
	// 		.then((examAttemptObj) => {
	// 			this.examAttempId = examAttemptObj.Id;
	// 			this.dispatchEvent(
	// 				new ShowToastEvent({
	// 					title: "Success",
	// 					message: "Contact record has been created",
	// 					variant: "success"
	// 				})
	// 			);
	// 		})
	// 		.catch((error) => {
	// 			this.dispatchEvent(
	// 				new ShowToastEvent({
	// 					title: "Error creating record",
	// 					message: error.body.message,
	// 					variant: "error"
	// 				})
	// 			);
	// 		});
	// }
}
