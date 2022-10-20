import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Voucher_Preparation from "@salesforce/label/c.Voucher_Preparation";
import Voucher_CredentialName from "@salesforce/label/c.Voucher_CredentialName";
import Voucher_Comments from "@salesforce/label/c.Voucher_Comments";
import PreparationDocs_HelpText from "@salesforce/label/c.PreparationDocs_HelpText";
import createCredExempt from "@salesforce/apex/VoucherRequestController.createCredExempt";
import methodVRC from "@salesforce/apex/VoucherRequestController.methodVRC";
import Confirmation from "@salesforce/label/c.ConfirmationVoucherRequestComponent";
import DoYouNeedVoucher from "@salesforce/label/c.VoucherRequestDoYouNeedVoucher";
import CredentialExamAttempt from "@salesforce/label/c.CredentialExamAttemptVoucherRequest";
import ExamPlan from "@salesforce/label/c.Exam_Plan";
const MAX_FILE_SIZE = 50000000;
export default class VoucherRequest extends LightningElement {
	label = {
		Voucher_Comments,
		Voucher_CredentialName,
		Voucher_Preparation,
		PreparationDocs_HelpText,
		Confirmation,
		DoYouNeedVoucher,
		CredentialExamAttempt,
		ExamPlan
	};
	@track examDate;
	@track examComments;
	@track status;
	@track fileData;
	@track statusValue;
	@track displayExamDetailsModal = false;
	@track filesData = [];
	@track fileList = [];
	@track isShowModal = false;
	@api credobj;

	fileNames = [];
	fileContentsArray = [];
	file;
	fileName = "";
	fileReader;
	content;
	fileContents;
	showSpinner = false;
	credentialStatus;
	credentialName;
	userCredentialId;

	/* 
       @ description setting variables
    */

	connectedCallback() {
		console.log("credObj:", JSON.stringify(this.credobj));
		this.isShowModal = true;
		this.credentialName = this.credobj.credName;
		this.userCredentialId = this.credobj.credId;
		this.credentialStatus = this.credobj.credStatus;
	}

	/* 
       @ description  handleDateChange this is a function which is used to get the Exam Date from user  ;
       @ param - Standard Event
    */

	handleDateChange(event) {
		this.examDate = event.target.value;
		console.log("date---" + this.examDate);
		console.log("this.userCredentialId---" + this.userCredentialId);
	}

	/* 
       @description  handleCommentChange this is a function which is used to comments from user  ;
     @param - Standard Event
    */

	handleCommentChange(event) {
		this.examComments = event.target.value;
		console.log("comments---" + this.examComments);
	}
	/* 
      @description  handleFileUpload this is a function which is used to get files data  from user  ;
           @param - Standard Event
    */
	handleFileUpload(event) {
		if (event.target.files.length > 0) {
			for (let x of event.target.files) {
				if (x.size > MAX_FILE_SIZE) {
					this.showToast("Error!", "error", this.filelimitError);
					return;
				}
				let file = x;
				let reader = new FileReader();
				reader.onload = (e) => {
					let fileContents = reader.result.split(",")[1];
					this.filesData.push({ fileName: file.name, fileContent: fileContents });
				};
				reader.readAsDataURL(file);
			}
		}

		console.log("files data :", this.filesData);
	}

	/* 
      @description - saveNewRecord this is a function which is used to  send the data in apex classes   ;
         @param-  Did'nt recieve any parameter
    */

	saveNewRecord() {
		this.showSpinner = true;
		this.fileList.push(JSON.stringify(this.filesData));
		console.log("New FileData:", this.fileList);
		try {
			const allValid = [...this.template.querySelectorAll(".validate")].reduce((validSoFar, inputCmp) => {
				inputCmp.reportValidity();
				return validSoFar && inputCmp.checkValidity();
			}, true);
			if (!allValid) {
				console.log("Errors when a user didnt put value");
			} else {
				this.showSpinner = true;
				this.isShowModal = false;
				const examAttemptFields = {
					sobjectType: "Credential_Exam_Attempt__c",
					User_Credential__c: this.userCredentialId,
					Exam_Date_Time__c: this.examDate,
					Preparation_Comments__c: this.examComments,
					Status__c: this.statusValue,
					Proof_of_Preparation__c: true
				};
				console.log("examAttemptRec---" + JSON.stringify(examAttemptFields));

				console.log("jsonData:", JSON.stringify(this.filesData));
				createCredExempt({
					examAttemptRec: examAttemptFields
				})
					.then((result) => {
						this.isShowExamModal = false;
						console.log("result", result);
						if (this.fileList.length > 0) {
							this.UploadFilest(result);
						}
						let recId = this.userCredentialId;
						let statusToBeUpdated = this.credentialStatus;
						this.dispatchEvent(
							new CustomEvent("success", {
								detail: { recId, statusToBeUpdated }
							})
						);
						this.dispatchEvent(
							new ShowToastEvent({
								title: "Success",
								variant: "success",
								message: this.sucessmsg
							})
						);
						this.displayExamDetailsModal = false;
						this.showSpinner = false;
					})
					.catch((error) => {
						console.log("Error", error);
					});
			}
		} catch (error) {
			console.log("error", error);
		}
	}
	/* 
      @description - saveNewRecord this is a function which is used to  send the data in apex classes   ;
         @param- recieves credential Exam RecordId
    */

	UploadFilest(Cid) {
		console.log("inside file upload");
		methodVRC({
			ParentRecId: Cid,
			filedata: this.fileList
		})
			.then((result) => {
				this.isShowExamModal = false;
				console.log("inside uploading...", result);
				if (result == "Success") {
				}
			})
			.catch((error) => {
				alert("error");
				console.log("error ", error);
			});
	}
	/* 
      @description - removeReceiptImage this is used to delete the selected document files from UI   ;
         @param-  Did'nt recieve any parameter
    */
	removeReceiptImage(event) {
		let index = event.currentTarget.dataset.id;
		this.filesData.splice(index, 1);
	}
	/* 
      @description - closeModal this is used to close the modal from UI   ;
         @param-  Did'nt recieve any parameter
    */
	closeModal() {
		this.displayExamDetailsModal = false;
	}
	/* 
      @description - showModalOnNo this is used to open  the Exam Details  modal on value no from UI;
         @param-  Did'nt recieve any parameter
    */
	showModalOnNo() {
		this.statusValue = "Voucher Assigned";
		this.displayExamDetailsModal = true;
	}

	/* 
      @description - showModalOnYes this is used to open  the Exam Details  modal on value yes from UI;
         @param-  Did'nt recieve any parameter
    */
	showModalOnYes() {
		this.statusValue = "Voucher Requested";
		this.displayExamDetailsModal = true;
	}
	/* 
      @description - showExamDetailsModal this is used to open Exam details  modal from UI;
         @param-   Standard Event
    */
	showExamDetailsModal() {
		this.displayExamDetailsModal = true;
	}

	/* 
      @description - closeFirstModal this is used to close the first modal from UI   ;
         @param-   Standard Event
    */
	closeFirstModal(event) {
		this.isShowModal = false;
		this.closeEvent();
	}
	/* 
      @description - closeSecondModal this is used to close the second modal from UI   ;
         @param-   Standard Event
    */
	closeSecondModal(event) {
		this.displayExamDetailsModal = false;
		this.isShowModal = false;
		this.closeEvent();
	}

	/* 
      @description - fires event on close of any modal to reset voucher request flag
    */
	closeEvent() {
		let recId = this.userCredentialId;
		this.dispatchEvent(
			new CustomEvent("close", {
				detail: { recId }
			})
		);
	}
}
