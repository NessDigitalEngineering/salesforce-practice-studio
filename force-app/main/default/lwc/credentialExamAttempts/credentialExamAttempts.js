import { LightningElement, track } from 'lwc';
import getActiveExamAttemptsForUser from "@salesforce/apex/CredentialExamAttemptController.getExamAttempts";
import USER_ID from "@salesforce/user/Id";
import Exam from "@salesforce/label/c.Exam";
import ExamAttemptID from "@salesforce/label/c.CredentialExamAttempt_ExamAttemptID";
import User_Credential from "@salesforce/label/c.credentailExamAttempt_User_Credential";
import Credential_Name from "@salesforce/label/c.credentialExamAttempt_Credential_Name";
import Exam_Date_Time from "@salesforce/label/c.credentialExamAttempt_Exam_Date_Time";
import Status from "@salesforce/label/c.credentailExamAttempt_Status";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import LOCALE from '@salesforce/i18n/locale';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import updateCredExempt from '@salesforce/apex/CredentialExamAttemptController.updateCredExempt';
import uploadReciept from '@salesforce/apex/CredentialExamAttemptController.uploadReciept';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const MAX_FILE_SIZE = 50000000;

import updateStatus from "@salesforce/apex/CredentialExamAttemptController.updateStatus";
import updateDate from "@salesforce/apex/CredentialExamAttemptController.updateDate";

export default class CredentialExamAttempts extends LightningElement {
    @track timeZone = TIME_ZONE;
    @track locale = LOCALE;
    @track searchRecords;
    userIds = USER_ID;
    title;
    @track Fileslist = [];
    Icn = TasksIcon;
    @track userCredentialsData;
    @track countRec;
    @track showIcon = false;
    @track emptyRecords = true;
    @track editDate = false;
    @track editExamDate = false;
    @track exmDate;
    @track credExamAttemptId;
    @track isShowExamModal = false;
    @track examAttemptIdForModal;
    dt;
    @track credentialName;
    @track examId;
    @track examname;
    @track examComments;
    @track filesDatas = [];
    /* filesDataslist
     @description - this method is used to fetch the credenntial Id
      @param - ExamId.
    */
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
        this.getAllActiveExamAttemptUsers();
    }
    /* 
        @description - this method is used to get all Active Exam Attempt users.
         @param - userId.
       */
    getAllActiveExamAttemptUsers() {
        let srchRecords = [];
        getActiveExamAttemptsForUser({ userId: this.userIds })
            .then((res) => {
                this.searchRecords = res;
                console.log('search records:', this.searchRecords);
                for (const r of res) {
                    srchRecords.push(r);
                }
                for (let rs of srchRecords.keys()) {
                    srchRecords[rs].showButton = false;

                    if (srchRecords[rs].Status__c == 'Voucher Assigned') {
                        srchRecords[rs].showButton = true;
                        srchRecords[rs].buttonName = 'Exam Schedule';
                    }
                    if (srchRecords[rs].Status__c == 'Exam Scheduled') {
                        srchRecords[rs].showButton = true;
                        srchRecords[rs].buttonName = 'Upload Result';

                    }
                }
                console.log('SRCH' + JSON.stringify(srchRecords));

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
            @description    :   This Method is to update the open exam schedule .
            @param          :   event
        */
    handleClick(event) {
        try {
            this.examId = event.target.value;
            this.credentialName = event.target.dataset.credentialname;
            this.examname = event.target.dataset.name;
            console.log('RecId on Button Click :', event.target.value);
            this.searchRecords.forEach(Element => {
                if (Element.Id == event.target.value) {
                    console.log('Inside If');
                    this.filesDatas = [];
                    this.Fileslist = [];
                    this.isShowExamModal = true;
                    console.log('showModal', this.isShowExamModal);
                }
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    /*
        @description    :   This Method is to update the Exam Date and Time.
        @param          :   event
    */
    handleDateEdit(event) {
        try{
        this.editExamDate = true;
        let credId = event.target.value;
        let index = this.searchRecords.findIndex((x) => x.Id === credId);
        console.log("index: ", index);
      
        this.searchRecords[index].editExamDate = true;
        }catch(error){
                console.log('error',error);

        }


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
                .catch((error) => { });
            this.disableEditOfDate(credId);
        } catch (error) {
            console.error(error.message);
        }
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
	/*
        @description    :   Closes edit option
    */
    handleActionClose(event) {
        this.disableEditOfDate(event.target.value);
    }

    /* 
        @description -this function is used to close modal.
         @param - event.
       */
    hideModalBox(event) {
        this.isShowExamModal = false;
    }
    /* 
    @description -this function is used to remove the uploaded files.
     @param - event.
   */
    removeReceiptImage(event) {
        let index = event.currentTarget.dataset.id;
        this.filesDatas.splice(index, 1);
    }

    /* 
        @description -this function is used to  upload files.
         @param - event.
       */
    handleFileUploaded(event) {
        try {
            console.log('File Upload :', event.target.files);
            if (event.target.files.length > 0) {
                console.log('Inside file upload');
                for (let x of event.target.files) {
                    if (x.size > MAX_FILE_SIZE) {
                        this.showToast('Error!', 'error', 'File Limit Exceed');
                        return;
                    }
                    let file = x;
                    console.log('file:', file);
                    let reader = new FileReader();
                    console.log('reader:', reader);
                    reader.onload = e => {
                        var fileContents = reader.result.split(',')[1]
                        this.filesDatas.push({ 'fileName': file.name, 'fileContent': fileContents });
                    };
                    reader.readAsDataURL(file);
                }
                console.log('Files : ', this.filesDatas);
            }
        } catch (error) {
            console.log('error', error);
        }
    }
    /* 
    @description -this function is used to update exam details and upload files.
   */
    saveRecord() {
        this.Fileslist.push(JSON.stringify(this.filesDatas));
        console.log('New FilesData:', this.Fileslist);
        try {
            //validate
            const allValids = [
                ...this.template.querySelectorAll('.validate'),
            ].reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
            if (!allValids) {

                console.log('Errors when a user not put value');
            }
            else {

                this.isShowModal = false;
                const examAttemptFields = {
                    'sobjectType': 'Credential_Exam_Attempt__c',
                    'Exam_Date_Time__c': this.examDate,
                    'Id': this.examId,
                    'Status__c': 'Exam Scheduled',
                }
                console.log('examAttemptRec---' + JSON.stringify(examAttemptFields));

                console.log('jsonData:', JSON.stringify(this.filesDatas));
                updateCredExempt({
                    examAttemptRec: examAttemptFields
                })
                    .then((result) => {
                        this.isShowExamModal = false;
                        console.log('result', result);
                        this.UploadFilest(result);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: "Success",
                                variant: "success",
                                message: 'success'
                            })
                        );
                        this.getAllActiveExamAttemptUsers();
                    }).catch((error) => {
                        console.log('Error', error);
                        this.isShowExamModal = false;
                    })
            }
        } catch (error) {
            console.log('error', error);

        }
    }
    /* 
       @description -this function is used to  upload files.
       @param - examId
      */
    UploadFilest(Cid) {
        console.log('inside file upload');
        uploadReciept({
            parentId: Cid,
            filedata: this.Fileslist

        })
            .then((result) => {
                this.isShowExamModal = false;
                console.log('inside uploading...', result);
                if (result == 'success') {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            variant: "success",
                            message: 'success'
                        })
                    );
                    this.getAllActiveExamAttemptUsers();
                }
            })
            .catch((error) => {
                console.log("error ", error);
                this.isShowExamModal = false;
            })
    }
    /* 
   @description -this function is used to showToast message.
  */
    showToast(toastTitle, toastMessage, variant) {
        const event = new ShowToastEvent({
            title: toastTitle,
            message: toastMessage,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    /* 
   @description -this function is used to handleDateChange.
   @param - event
  */
    handleDateChange(event) {
        this.examDate = event.target.value;
        console.log("date---" + this.examDate);
    }

}