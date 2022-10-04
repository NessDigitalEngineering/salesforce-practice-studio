import { LightningElement, track, api, wire } from 'lwc';
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
import LOCALE from '@salesforce/i18n/locale';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import UpdateCredExempt from '@salesforce/apex/ExamScheduleController.UpdateCredExempt';
import UploadReciept from '@salesforce/apex/ExamScheduleController.UploadReciept';
import getExamDetails from '@salesforce/apex/ExamScheduleController.getExamDetails';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
const MAX_FILE_SIZE = 50000000;

export default class CredentialExamAttempts extends LightningElement {

    userIds = USER_ID;
    @track timeZone = TIME_ZONE;
    @track locale = LOCALE;
    @track searchRecords;
    userIds = USER_ID;
    title;
    @track Filelist = [];
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
    @track Filelist = [];
    @track credentialName;
    @track examId;
    @track examname;
    @track examComments;
    @track filesData = [];

    @wire(getExamDetails, { examId: '$examId' })
    WiredExamData(result) {
        console.log('Function Executed;--');
        if (result.data) {
            console.log('result', result.data);
            this.examname = result.data.ExamId;
            this.credentialName = result.data.credentialId;
        }
        else {
            console.log('error', result.error);

        }
    }
    
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

    getAllActiveExamAttemptUsers(){
         let srchRecords = [];
        getActiveExamAttemptsForUser({ userId: this.userIds })
            .then((res) => {
                this.searchRecords = res;
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
            @description    :   This Method is to update the Status.
            @param          :   event
        */
    handleClick(event) {
        try {
            this.examId = event.target.value;
            console.log('RecId on Button Click :', event.target.value);
            this.searchRecords.forEach(Element => {
                if (Element.Id == event.target.value) {
                    console.log('Inside If');
                    this.isShowExamModal = true;
                    console.log('showModal', this.isShowExamModal);
                }
            });

          /*  updateStatus({ examAttemptRecordId: event.target.value, examStatus: 'Exam Scheduled' }).then((response) => {
                console.log('Record updated successfully');
            }).catch((error) => { });
*/
        } catch (error) {
            console.log('error', error);
        }
    }
    /*
        @description    :   This Method is make boolean value True..
    */

    handleDateEdit() {
        this.editExamDate = true;
    }

	/*
        @description    :   This Method is to update the Exam Date and Time.
        @param          :   event
    */
  /*  updateExmDate(event) {
        this.credExamAttemptId = event.target.name;
        this.exmDate = event.target.value;
        updateDate({ examAttemptRecordId: this.credExamAttemptId, dt: this.exmDate })
            .then((res) => {
                console.log('Record updated successfully');
            })
            .catch((error) => { });
    }
    */
    hideModalBox(event) {
        this.isShowExamModal = false;
    }
    handlesaveModal(event) {
        console.log('save data');
    }
    handleModalData(event) {
        console.log('handle change');
    }
    removeReceiptImage(event) {
        let index = event.currentTarget.dataset.id;
        this.filesData.splice(index, 1);
    }

    handleFileUploaded(event) {
        try {
            console.log('File Upload :', event.target.files);

            let obj = {};
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
                        let fileContents = reader.result.split(',')[1]
                        this.filesData.push({ 'fileName': file.name, 'fileContent': fileContents });


                    };
                    reader.readAsDataURL(file);
                }
                console.log('Files Data: ', this.filesData);
            }


        } catch (error) {
            console.log('error', error);
        }
    }
    saveNewRecord() {
        this.Filelist.push(JSON.stringify(this.filesData));
        console.log('New FileData:', this.Filelist);
        try {
            //validate
            const allValid = [
                ...this.template.querySelectorAll('.validate'),
            ].reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
            if (!allValid) {

                console.log('Errors when a user didnt put value');
            }
            else {

                
                this.showSpinner = true;
                this.isShowModal = false;
                const examAttemptFields = {
                    'sobjectType': 'Credential_Exam_Attempt__c',
                    'Exam_Date_Time__c': this.examDate,
                    'Id':  this.examId,
                    'Status__c': 'Exam Scheduled',
                   
                }
                console.log('examAttemptRec---' + JSON.stringify(examAttemptFields));

                console.log('jsonData:', JSON.stringify(this.filesData));
                UpdateCredExempt({
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

    UploadFilest(Cid) {
        console.log('inside file upload');
        UploadReciept({
            ParentId: Cid,
            filedata: this.Filelist

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
            }).finally(() => this.showSpinner = false);
      
    }
    showToast(toastTitle, toastMessage, variant) {
        const event = new ShowToastEvent({
            title: toastTitle,
            message: toastMessage,
            variant: variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
    handleDateChange(event) {
        this.examDate = event.target.value;
        console.log("date---" + this.examDate);

    }

}
