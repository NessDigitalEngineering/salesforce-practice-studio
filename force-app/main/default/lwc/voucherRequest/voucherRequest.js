import { LightningElement, api, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import uploadDocuments from "@salesforce/apex/documentsUploadController.uploadDocuments";
import Voucher_Preparation from "@salesforce/label/c.Voucher_Preparation";
import Voucher_ExamDate from "@salesforce/label/c.Voucher_ExamDate";
import Voucher_CredentialName from "@salesforce/label/c.Voucher_CredentialName";
import Voucher_Comments from "@salesforce/label/c.Voucher_Comments";
import PreparationDocs_HelpText from "@salesforce/label/c.PreparationDocs_HelpText";

const MAX_FILE_SIZE = 50000000;

export default class VoucherRequest extends LightningElement {
    label = { Voucher_Comments, Voucher_CredentialName, Voucher_ExamDate, Voucher_Preparation, PreparationDocs_HelpText };
    @track examDate;
    @track credentialValue;
    @track userCredentialId;
    @track examComments;
    @track status;
    @track fileData;
    fileNames = [];
    @track fileContentsArray = [];
    file;
    fileName = '';
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
        console.log('files---' + event.target.files.length);
        if (event.target.files.length > 0) {
            for (var i = 0; i < event.target.files.length; i++) {
                this.file = event.target.files[i];
                if (this.file.size > this.MAX_FILE_SIZE) {
                    alert("File Size Can not exceed" + MAX_FILE_SIZE);
                }
                this.fileName = this.file.name;
                console.log('fileName---' + this.fileName);
                this.fileReader = new FileReader();
                this.fileReader.onloadend = () => {
                    let base64 = "base64,";
                    this.content = this.fileContent.indexOf(base64) + base64.length;
                    this.fileContents = this.fileContents.substring(this.content);
                    this.fileContents = this.fileReader.result.split(',')[1];
                    console.log('fileContents---' + this.fileContents);
                    // this.fileContentsArray.push({ Title: this.fileName, VersionData: this.fileContents });
                    // console.log('fileContentsArray---' + this.fileContentsArray);
                    // this.fileNames.push(this.fileName);
                    // this.fileContentsArray.push(this.fileContents);

                }
                this.fileReader.readAsDataURL(this.file);
                this.fileNames.push(this.fileName);
                console.log('fileNames---' + this.fileNames);
            }
        }
    }

    saveNewRecord() {
        this.isShowModal = false;
        const examAttemptFields = {
            'sobjectType': 'Credential_Exam_Attempt__c',
            'User_Credential__c': this.userCredentialId,
            'Exam_Date_Time__c': this.examDate,
            'Preparation_Comments__c': this.examComments,
            'Status__c': this.statusValue,
            'Proof_of_Preparation__c': true
        }
        console.log('examAttemptRec---' + JSON.stringify(examAttemptFields));
        console.log('fileData---' + JSON.stringify(fileNames));
        // console.log('fileName---' + this.fileNames);
        uploadDocuments({
            examAttemptRec: examAttemptFields,
            fileData: JSON.stringify(this.fileContentsArray)
            // fileName: this.fileName
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
                    this.isShowModal = false;
                }
            })
            .catch((error) => {
                alert('error');
                console.log("error ", error);
            });
        this.displayExamDetailsModal = false;
    }

    removeReceiptImage(event) {
        var index = event.currentTarget.dataset.id;
        this.uploadedFiles.splice(index, 1);
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