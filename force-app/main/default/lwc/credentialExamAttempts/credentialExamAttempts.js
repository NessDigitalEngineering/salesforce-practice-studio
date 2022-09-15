import { LightningElement , api, track } from 'lwc';
import getExamAttemptsForUser from "@salesforce/apex/credentialExamAttemptController.getExamAttempts";
import updateStatus from "@salesforce/apex/credentialExamAttemptController.updateStatus";
import USER_ID from "@salesforce/user/Id";
import EXAM_DATE from "@salesforce/schema/Credential_Exam_Attempt__c.Exam_Date_Time__c";
import Exam from "@salesforce/label/c.Exam";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
export default class CredentialExamAttempts extends LightningElement {
    userIds = USER_ID;
    @track searchRecords;
    label = { Exam, ExamAttempt_EmptyMsg };
	userIds = USER_ID;
	title;
	Icn = TasksIcon;
    @track userCredentialsData;
    @track countRec;
	@track showIcon = false;
	@track emptyRecords = true;
    @track editDate = false;
    dt;

    connectedCallback() {
		getExamAttemptsForUser({ userId: this.userIds })
        .then((res) => {
            this.searchRecords = res;
            
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

    handleClick(event){
        //alert('id'+event.target.value);
        updateStatus({examAttemptRecordId : event.target.value, examStatus: 'Exam Scheduled'}).then((response)=>{
            console.log('Record updated successfully');
            
        }).catch((error) => {});
       
    }
    handleDateEdit() {
        this.editDate = true;
      }
      handleDateChange(event) {
        this.dt = event.target.value;
      }
    handleUpdate(event){
        const fields = {};
        fields[examAttemptRecordId] = event.target.value;
        fields[EXAM_DATE.fieldApiName] = this.dt;
        const recordInput = { fields };
        updateDate(recordInput)
        .then((response)=>{
            this.editDate = false;
        }).catch((error) => {});
    }

}