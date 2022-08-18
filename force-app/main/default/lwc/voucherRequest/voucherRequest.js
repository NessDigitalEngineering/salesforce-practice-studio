import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import uploadDocuments from "@salesforce/apex/documentsUploadController.uploadDocuments";

const MAX_FILE_SIZE = 50000000;

export default class VoucherRequest extends LightningElement {
    @track examDate;
    @track credentialValue;
    @track userCredentialId;
    @track examComments;
    @track status;
    @track fileData;
    uploadedFiles = [];
    file;
    fileName;
    fileReader;
    content;
    fileContents;
    @track statusValue;
    @track displayExamDetailsModal = false;
    @track isShowModal = false;

    @api handleCredentialName(credentialName) {
        this.isShowModal = true;
        this.credentialValue = credentialName;
    }

    @api handleCredentialId(credentialId) {
        this.isShowModal = true;
        this.userCredentialId = credentialId;
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
        this.isShowModal = false;
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

    saveExamAttemptRecord() {
        this.isShowModal = false;
        const examAttemptFields = {
            'sobjectType': 'Credential_Exam_Attempt__c',
            'User_Credential__c': this.userCredentialId,
            'Exam_Date_Time__c': this.examDate,
            'Preparation_Comments__c': this.examComments,
            'Status__c': this.statusValue,
            'Proof_of_Preparation__c': true
        }

        uploadDocuments({
            examAttemptRec: examAttemptFields,
            file: encodeURIComponent(this.fileContents),
            fileName: this.fileName
        })
            .then((examAttemptRecId) => {
                if (examAttemptRecId) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            variant: "success",
                            message: "Credential Exam Attempt Successfully created"
                        })
                    );
                }
            })
            .catch((error) => {
                alert('error');
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