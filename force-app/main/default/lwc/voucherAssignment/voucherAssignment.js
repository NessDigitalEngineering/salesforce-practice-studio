import { LightningElement ,track } from 'lwc';
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import voucher_Assignment from "@salesforce/label/c.voucher_Assignment";
import getVoucherApprovedUsers from "@salesforce/apex/CredentialExamAttemptController.getVoucherApprovedUsers";
import getAllExamVouchers from "@salesforce/apex/VoucherAssignmentController.getAllExamVouchers";
import updateExamRecords from "@salesforce/apex/CredentialExamAttemptController.updateExamRecords";
const columns = [
    { label: 'Exam Attempt Id', fieldName: 'Name' },
    { label: 'Credential Name', fieldName: 'Credential__c' },
    { label: 'Submitted By', fieldName: 'User__c' },
    { label: 'Status', fieldName: 'Status__c' },
];
const columns1 = [
    { label: 'Exam Voucher', fieldName: 'Name' },
    { label: 'Credential Type', fieldName: 'Credential_Type__c' },
    { label: 'Cost', fieldName: 'Cost__c' },
    { label: 'Value', fieldName: 'Value__c' },
    { label: 'Sponsor', fieldName: 'Sponsor__c' },
    { label: 'Expiry Date', fieldName: 'Expiry_Date__c' },
];
export default class VoucherAssignment extends LightningElement {
    @track lstCred;
    @track lstVoucher;
    columns = columns;
    columns1 = columns1;
    @track countRec;
    @track isShowModal = false;
    @track openDialog = false;
    @track showIcon = false;
    Icn = TasksIcon;
    @track emptyRecords = true;
    @track credentialName;
    @track voucherCost;
    @track credType;
    @track credCost;
    label = {
		ExamAttempt_EmptyMsg,
        voucher_Assignment
	};
    @track isDialogVisible = false;
    @track originalMessage;

    connectedCallback() {   
        getVoucherApprovedUsers().then((res) => {
            this.lstCred = res;
        
         this.countRec = res.length;
         if (res.length === 0) {
            this.showIcon = true;
            this.emptyRecords = false;
         }

        if (this.countRec > 0) {
            this.title = this.label.voucher_Assignment + " (" + res.length + ")";
        } else {
            this.title = this.label.voucher_Assignment;
        }
    })
    .catch((error) => {
        console.log("error" + JSON.stringify(error));
    });
    }   

    examVoucherData()
    {
        getAllExamVouchers({credentialType:this.credType,credentialCost:this.credCost}).then((response) => {
            this.lstVoucher= response;
            console.log('response=='+ this.lstVoucher);
        })
        .catch((error) => {
            console.log("error==" + JSON.stringify(error));
        });
    }
    showModalBox() {  
        let selectedRec = this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRec.length > 0){
            console.log('selectedRecord '+selectedRec);
            let credName = '';
            selectedRec.forEach(currentItem => {
                this.credType= currentItem.User_Credential__r.Credential__r.Type__c;
                this.credCost= currentItem.User_Credential__r.Credential__r.Registration_fee__c; 
                credName = currentItem.Credential__c + '$' +currentItem.User_Credential__r.Credential__r.Registration_fee__c;
                this.credentialName = credName;
            });
            this.isShowModal = true;
        }
      this.examVoucherData();
    }
    hideModalBox() {  
        this.isShowModal = false;
    }
    hideDialog() {  
        this.openDialog = false;
    }

    handleClick(event){
        let selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++) {
            if(selectedRows[i].Cost__c > this.credCost){
                this.openDialog = true;
            }                       
        }
    }

    /*
        @description    :   This Method is to update the Exam Status and Exam Voucher record.      
    */
   updateExmRecord(event){
    updateExamRecords({recordId : event.target.value, examVoucher: selectedRows[i].ID}).then((response)=>{
        console.log('Record updated successfully');
        this.openDialog = false;
    }).catch((error) => {});

    updateStatus({ examAttemptRecordId: event.target.value, examStatus: "Voucher Assigned" })
			.then((response) => {
				console.log("Record updated successfully");
			})
			.catch((error) => {});
}


}