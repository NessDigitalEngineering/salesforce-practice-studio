import { LightningElement, api, track } from "lwc";
// import { createRecord } from "lightning/uiRecordApi";
// import Credential_Object from "@salesforce/schema/Credential_Exam_Attempt__c";
// import CredentialName from "@salesforce/schema/Credential_Exam_Attempt__c.Credential__c";
// import ExamDate from "@salesforce/schema/Credential_Exam_Attempt__c.Exam_Date_Time__c";
// import Comments from "@salesforce/schema/Credential_Exam_Attempt__c.Preparation_Comments__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import uploadDocuments from "@salesforce/apex/documentsUploadController.uploadDocuments";

const MAX_FILE_SIZE = 50000000;

export default class VoucherRequest extends LightningElement {
	// fields = [Credential_Object, CredentialName, ExamDate,Comments];
	@track examDate;
	@track credentialValue;
	@track userCredentialId;
	@track examComments;
	@track status;
	@track fileData;
	@api recordId;
	@api voucherRequestValues;
	uploadedFiles = [];
	file;
	fileName;
	fileReader;
	content;
	fileContents;
	@track statusValue;
	@track displayExamDetailsModal = false;
	@track isShowModal = false;

	@api handleExamInputs() {
		this.credentialValue = cred;
		this.userCredentialId = id;
		alert('userCredName----' + this.userCredentialId);
		this.isShowModal = true;
	}

	handleDateChange(event) {
		this.examDate = event.target.value;
		console.log("date---" + this.examDate);
	}

	handleCommentChange(event) {
		this.examComments = event.target.value;
		console.log("comments---" + this.examComments);
	}

	handleFileUpload(event) {
		if (event.target.files.length > 0) {
			this.uploadedFiles = event.target.files;
			this.fileName = event.target.files[0].name;
			this.file = this.uploadedFiles[0];
			if (this.file.size > this.MAX_FILE_SIZE) {
				alert("File Size Can not exceed" + MAX_FILE_SIZE);
			}
		}
	}

	saveNewRecord() {
		this.fileReader = new FileReader();
		this.fileReader.onloadend = () => {
			this.fileContents = this.fileReader.result;
			let base64 = "base64,";
			this.content = this.fileContents.indexOf(base64) + base64.length;
			this.fileContents = this.fileContents.substring(this.content);
			console.log("fileContents----" + this.fileContents);
			this.saveExamAttemptRecord();
		};
		this.fileReader.readAsDataURL(this.file);
		this.isShowModal = false;
	}
	// if (event.target.files.length > 0) {
	// 	this.uploadedFiles = event.target.files;
	// 	this.fileName = event.target.files[0].name;
	// 	console.log("file---" + JSON.stringify(file));
	// 	this.file = event.target.files[0];
	// 	if (this.file.size > this.MAX_FILE_SIZE) {
	// 		alert("File Size Can not exceed" + MAX_FILE_SIZE);
	// 	}
	// }

	// saveExamAttemptRecord() {
	// 	this.fileReader = new FileReader();
	// 	reader.onload = () => {
	// 		this.fileContents = this.fileReader.result;
	// 		let base64 = "base64,";
	// 		this.content = this.fileContents.indexOf(base64) + base64.length;
	// 		this.fileContents = this.fileContents.substring(this.content);
	// 		this.uploadDocuments();
	// 	};
	// 	this.fileReader.readAsDataURL(this.file);
	// }

	saveExamAttemptRecord() {
		alert(this.credentialValue);
		alert(this.examDate);
		alert(this.examComments);
		examAttemptFields = {
			'sobjectType': 'Credential_Exam_Attempt__c',
			'User_Credential__c': this.voucherRequestValues.userCredentialId,
			'Credential__c': this.credentialValue,
			'Exam_Date_Time__c': this.examDate,
			'Preparation_Comments__c': this.examComments
			// 'Status__c': this.statusValue
		};
		console.log("examAttemptFields---" + this.examAttemptFields);
		console.log("fileName---" + this.fileName);
		console.log("file---" + JSON.stringify(this.file));
		uploadDocuments({
			examAttemptRec: this.examAttemptFields,//{'Credential__c':'a011y000003DTQCAA4','Exam_Date_Time__c':this.examDate,'Preparation_Comments__c':this.examComments,
			file: encodeURIComponent(this.fileContents),
			fileName: this.fileName
		})
			.then((response) => {
				alert(response);
				if (response) {
					console.log("response---" + this.response);
					this.dispatchEvent(
						new ShowToastEvent({
							title: "Success",
							variant: "success",
							message: "Contact Successfully created"
						})
					);
				}
			})
			.catch((error) => {
				console.log("error ", error);
			});
		this.displayExamDetailsModal = false;
	}

	hideModalBox() {
		this.isShowModal = false;
	}

	closeModal() {
		this.displayExamDetailsModal = false;
	}

	showModalOnNo() {
		this.statusValue = "Voucher Assigned";
		this.displayExamDetailsModal = true;
	}

	showModalOnYes() {
		this.statusValue = "Voucher Requested";
		this.displayExamDetailsModal = true;
	}

	showExamDetailsModal() {
		this.displayExamDetailsModal = true;
	}
}
