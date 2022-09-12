import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Voucher_Preparation from "@salesforce/label/c.Voucher_Preparation";
import Voucher_ExamDate from "@salesforce/label/c.Voucher_ExamDate";
import Voucher_CredentialName from "@salesforce/label/c.Voucher_CredentialName";
import Voucher_Comments from "@salesforce/label/c.Voucher_Comments";
import PreparationDocs_HelpText from "@salesforce/label/c.PreparationDocs_HelpText";
import createCredExempt from '@salesforce/apex/VoucherRequestController.createCredExempt';
import methodVRC from '@salesforce/apex/VoucherRequestController.methodVRC';

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
    fileContentsArray = [];
    file;
    fileName = '';
    fileReader;
    content;
    fileContents;
    @track statusValue;
    @track displayExamDetailsModal = false;
    @track isShowModal = false;
    @api recordId;
    @track filesData = [];
    showSpinner = false;
    @track credId;

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
        console.log("this.userCredentialId---" + this.userCredentialId);
    }

    handleCommentChange(event) {
        this.examComments = event.target.value;
        console.log("comments---" + this.examComments);
    }

    handleFileUpload(event) {
        if (event.target.files.length > 0) {
            for(var i=0; i< event.target.files.length; i++){
                if (event.target.files[i].size > MAX_FILE_SIZE) {
                    this.showToast('Error!', 'error', 'File size exceeded the upload size limit.');
                    return;
                }
                let file = event.target.files[i];
                let reader = new FileReader();
                reader.onload = e => {
                    var fileContents = reader.result.split(',')[1]
                    this.filesData.push({'fileName':file.name, 'fileContent':fileContents});
                };
                reader.readAsDataURL(file);
            }
        }

        console.log('files data :',this.filesData);
    }
    saveNewRecord() {
        var credId;
        if(this.filesData == [] || this.filesData.length == 0) {
            this.showToast('Error', 'error', 'Please select files first'); return;
        }
        this.showSpinner = true;
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
        
    console.log('jsonData:',JSON.parse(JSON.stringify(this.filesData)));
      createCredExempt({
          examAttemptRec:examAttemptFields
      })
        .then((result)=>{
           
            console.log('result',result);
            this.UploadFiles(result);
             this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            variant: "success",
                            message: "Credential Exam Attempt Successfully created"
                        })
                    );
        }).catch((error)=>{
            console.log('Error',error);
        }) 
    }

    UploadFiles(Cid){
            console.log('inside file upload');
      methodVRC({
            recid:Cid,
            filedata: this.filesData
            
        })
            .then((result) => {
                console.log('inside uploading...',result);
                if (result == 'Success') {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            variant: "success",
                            message: "File Uploaded SuccessFully"
                        })
                    );
                    this.isShowModal = false;
                }
            })
            .catch((error) => {
                alert('error');
                console.log("error ", error);
            }).finally(() => this.showSpinner = false );
        this.displayExamDetailsModal = false;
   }
    removeReceiptImage(event) {
        var index = event.currentTarget.dataset.id;
        this.filesData.splice(index, 1);
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
    closeFirstModal(event){
        this.isShowModal = false;

    }
     closeSecondModal(event){
       this.displayExamDetailsModal = false;
       this.isShowModal = false;

    }
}