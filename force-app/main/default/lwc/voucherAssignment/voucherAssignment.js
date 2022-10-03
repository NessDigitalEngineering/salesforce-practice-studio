import { LightningElement ,track } from 'lwc';
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import voucher_Assignment from "@salesforce/label/c.voucher_Assignment";
import getVoucherApprovedUsers from "@salesforce/apex/CredentialExamAttemptController.getVoucherApprovedUsers";
import getAllExamVouchers from "@salesforce/apex/VoucherAssignmentController.getAllExamVouchers";

const columns = [
    { label: 'Exam Attempt Id', fieldName: 'Name' },
    { label: 'Credential Name', fieldName: 'Credential__c' },
    { label: 'Submitted By', fieldName: 'CreatedById' },
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
    label = {
		ExamAttempt_EmptyMsg,
        voucher_Assignment
	};
    @track isDialogVisible = false;
    @track originalMessage;

    connectedCallback() {   
        getVoucherApprovedUsers().then((res) => {
            this.lstCred = res;
            this.examVoucherData();
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
        getAllExamVouchers().then((response) => {
            this.lstVoucher= response;
        })
        .catch((error) => {
            console.log("error" + JSON.stringify(error));
        });
    }
    showModalBox() {  
        let selectedRec = this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRec.length > 0){
            console.log('selectedRecord '+selectedRec);
            let credName = '';
            selectedRec.forEach(currentItem => {
                credName = currentItem.Credential__c + ' ' +currentItem.Cost__c;
                this.credentialName = credName;
            });
            this.isShowModal = true;
        }
    }
    hideModalBox() {  
        this.isShowModal = false;
    }
    hideDialog() {  
        this.openDialog = false;
    }
    handleClick(){
        let selectedRecord = this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecord.length > 0){
            this.openDialog = true;
    }

    }
}