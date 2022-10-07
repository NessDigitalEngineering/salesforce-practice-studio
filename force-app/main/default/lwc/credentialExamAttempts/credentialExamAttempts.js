import { LightningElement, track } from "lwc";
import getActiveExamAttemptsForUser from "@salesforce/apex/CredentialExamAttemptController.getExamAttempts";
import updateStatus from "@salesforce/apex/CredentialExamAttemptController.updateStatus";
import updateDate from "@salesforce/apex/CredentialExamAttemptController.updateDate";
import USER_ID from "@salesforce/user/Id";
import Exam from "@salesforce/label/c.Exam";
import ExamAttemptID from "@salesforce/label/c.CredentialExamAttempt_ExamAttemptID";
import User_Credential from "@salesforce/label/c.credentailExamAttempt_User_Credential";
import Credential_Name from "@salesforce/label/c.credentialExamAttempt_Credential_Name";
import Exam_Date_Time from "@salesforce/label/c.credentialExamAttempt_Exam_Date_Time";
import Status from "@salesforce/label/c.credentailExamAttempt_Status";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import LOCALE from "@salesforce/i18n/locale";
import TIME_ZONE from "@salesforce/i18n/timeZone";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class CredentialExamAttempts extends LightningElement {
	userId = USER_ID;
	@track timeZone = TIME_ZONE;
	@track locale = LOCALE;
	@track searchRecords;
	title;
	Icn = TasksIcon;
	@track countRec;
	@track showIcon = false;
	@track emptyRecords = true;

	dt;

	label = {
		ExamAttemptID,
		User_Credential,
		Credential_Name,
		Exam_Date_Time,
		Status,
		Exam,
		ExamAttempt_EmptyMsg
	};

	/*
        @description    :   This Method is to itrate data and show the buttons as per status.
        @param          :   event
    */
	connectedCallback() {
		let srchRecords = [];
		getActiveExamAttemptsForUser({ userId: this.userId })
			.then((res) => {
				this.searchRecords = res;
				for (const r of res) {
					srchRecords.push(r);
				}
				for (let rs of srchRecords.keys()) {
					srchRecords[rs].showButton = false;
					srchRecords[rs].editExamDate = false;
					if (srchRecords[rs].Status__c == "Voucher Assigned") {
						srchRecords[rs].showButton = true;
						srchRecords[rs].buttonName = "Exam Schedule";
					}
					if (srchRecords[rs].Status__c == "Exam Scheduled") {
						srchRecords[rs].showButton = true;
						srchRecords[rs].buttonName = "Upload Result";
					}
				}

				console.log("SRCH" + JSON.stringify(this.searchRecords));

				this.countRec = res.length;
				if (res.length === 0) {
					this.showIcon = true;
					this.emptyRecords = false;
				}
				if (this.countRec > 0) {
					this.title = this.label.Exam + " (" + res.length + ")";
				} else {
					this.title = this.label.Exam;
				}
			})
			.catch((error) => {
				console.log("error" + JSON.stringify(error));
			});
	}
	/*
        @description    :   This Method is to update the Status.
        @param          :   event
    */
	handleClick(event) {
		updateStatus({ examAttemptRecordId: event.target.value, examStatus: "Exam Scheduled" })
			.then((response) => {
				console.log("Record updated successfully");
			})
			.catch((error) => {});
	}
	/*
        @description    :   Enables edit for exam date
    */

	handleDateEdit(event) {
		let credId = event.target.value;
		let index = this.searchRecords.findIndex((x) => x.Id === credId);
		console.log("index: ", index);
		this.searchRecords[index].editExamDate = true;
		// this.editExamDate = true;
	}

	/*
        @description    :   Saves any change in exam date
    */
	handleActionCheck(event) {
		try {
			let credId = event.target.name;
			let examDate = this.template.querySelector('[data-name="' + credId + '"]').value;
			console.log("credExamAttemptId:", credId);
			console.log("exmDate:", examDate);
			updateDate({ examAttemptRecordId: credId, dt: examDate })
				.then((res) => {
					console.log("Record updated successfully");
					let index = this.searchRecords.findIndex((x) => x.Id === credId);
					this.searchRecords[index].Exam_Date_Time__c = examDate;
					this.showNotification(
						"Success",
						this.searchRecords[index].Name + " updated sucessfully",
						"success"
					);
				})
				.catch((error) => {});
			this.disableEditOfDate(credId);
		} catch (error) {
			console.error(error.message);
		}
	}

	/*
        @description    :   Closes edit option
    */
	handleActionClose(event) {
		this.disableEditOfDate(event.target.value);
	}

	/*
        @description    :  Helper method to target element of list
    */
	disableEditOfDate(credId) {
		let index = this.searchRecords.findIndex((x) => x.Id === credId);
		console.log("index to disable: ", index);
		this.searchRecords[index].editExamDate = false;
	}

	/*
    description: method to display notification as toast message
  	*/
	showNotification(title, message, variant) {
		const evt = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(evt);
	}
}
