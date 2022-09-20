import { LightningElement, track } from 'lwc';
import getActiveExamAttemptsForUser from "@salesforce/apex/credentialExamAttemptController.getExamAttempts";
import updateStatus from "@salesforce/apex/credentialExamAttemptController.updateStatus";
import updateDate from "@salesforce/apex/credentialExamAttemptController.updateDate";
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
export default class CredentialExamAttempts extends LightningElement {
    userIds = USER_ID;
    @track timeZone = TIME_ZONE;
    @track locale =LOCALE;
    @track searchRecords;
    userIds = USER_ID;
    title;
    Icn = TasksIcon;
    @track userCredentialsData;
    @track countRec;
    @track showIcon = false;
    @track emptyRecords = true;
    @track editDate = false;
    @track editExamDate = false;
    @track exmDate;
    @track credExamAttemptId;

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
        getActiveExamAttemptsForUser({ userId: this.userIds })
        .then((res) => {
            this.searchRecords = res;
            for(const r of res){
                srchRecords.push(r);
            }
            for(let rs=0; rs < srchRecords.length; rs++){
                srchRecords[rs].showButton=false;

           if(srchRecords[rs].Status__c == 'Voucher Assigned' )
           {
            srchRecords[rs].showButton=true;

            srchRecords[rs].buttonName='Exam Schedule';
            
           }
           if( srchRecords[rs].Status__c == 'Exam Scheduled')
           {
            srchRecords[rs].showButton=true;
            
            srchRecords[rs].buttonName='Upload Result';
            
           }
            }

            console.log('SRCH'+JSON.stringify(srchRecords));

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
    handleClick(event){
        updateStatus({examAttemptRecordId : event.target.value, examStatus: 'Exam Scheduled'}).then((response)=>{
            console.log('Record updated successfully');
        }).catch((error) => {});
       
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
      updateExmDate(event){
        this.credExamAttemptId = event.target.name;
        this.exmDate = event.target.value;
        updateDate({examAttemptRecordId : this.credExamAttemptId, dt: this.exmDate})
        .then((res) => {
            console.log('Record updated successfully');
        })
        .catch((error) => {});
    }
      
}
