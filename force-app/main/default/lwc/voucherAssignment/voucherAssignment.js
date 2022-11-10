import { LightningElement,track } from 'lwc';
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import ExamAttempt_EmptyMsg from "@salesforce/label/c.ExamAttempt_EmptyMsg";
import voucher_Assignment from "@salesforce/label/c.voucher_Assignment";
import VoucherAssigned_ToastMessage from "@salesforce/label/c.VoucherAssigned_ToastMessage";
import Voucher_Price from "@salesforce/label/c.Voucher_Price";
import Continue from "@salesforce/label/c.Continue";
import getVoucherApprovedUsers from "@salesforce/apex/VoucherRequestController.getVoucherApprovedUsers";
import getAllExamVouchers from "@salesforce/apex/VoucherRequestController.getAllExamVouchers";
import updateExamRecords from "@salesforce/apex/VoucherRequestController.updateExamRecords";
import updateVouchersStatus from "@salesforce/apex/VoucherRequestController.updateVouchersStatus";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
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
    { label: 'Sponsor', fieldName: 'Sponsor__c' , sortable: "true"},
    { label: 'Expiry Date', fieldName: 'Expiry_Date__c' , sortable: "true" },
];
export default class VoucherAssignment extends LightningElement {
    variant = 'success';
    @track lstCred;
    @track lstVoucher;
    columns = columns;
    columns1 = columns1;
    @track countRec;
    @track isShowButton = false;
    @track showAssignButton = false;
    @track isShowModal = false;
    @track openDialog = false;
    @track showIcon = false;
    Icn = TasksIcon;
    @track emptyRecords = true;
    @track showImage = false;
    @track noRecords = true;
    @track credentialName;
    @track voucherCost;
    @track credType;
    @track credCost;
    @track exmVoucher;
    @track parentID;
    @track sortBy
    @track sortDirection;
    @track cost;
    @track attemptID;


    label = {
		ExamAttempt_EmptyMsg,
        voucher_Assignment,
        VoucherAssigned_ToastMessage,
        Continue,
        Voucher_Price
	};
    @track isDialogVisible = false;
    @track originalMessage;

/*
        @description    :   This Method is to show available Voucher Approved User.      
    */
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
        eval("$A.get('e.force:refreshView').fire();");
       
    })
    .catch((error) => {
        console.log("error" + JSON.stringify(error));
    });
    }   
    getSelectedName() {
        this.isShowButton = true;
}
/*
        @description    :   This Method is to show available Exam Voucher.      
    */
    examVoucherData()
    {
        getAllExamVouchers({credentialType:this.credType,credentialCost:this.credCost}).then((response) => {
            this.lstVoucher= response;
            console.log('response=='+ this.lstVoucher);

            if (response.length === 0) {
                this.showImage = true;
                this.noRecords = false;
             }
        })
        .catch((error) => {
            console.log("error==" + JSON.stringify(error));
        });
    }

     /*
        @description    :   This Method is to show available Exam Voucher.      
    */
    showModalBox() {  
        let selectedRec = this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRec.length > 0){
            let credName = '';
            
            selectedRec.forEach(currentItem => {
                this.credType= currentItem.User_Credential__r.Credential__r.Type__c;
                this.credCost= currentItem.User_Credential__r.Credential__r.Registration_fee__c; 
                credName = currentItem.Credential__c + ' $' +currentItem.User_Credential__r.Credential__r.Registration_fee__c;
                this.credentialName = credName;
                this.parentID=currentItem.Id;
            });
            this.isShowModal = true;
        }
      this.examVoucherData();
    }
    hideModalBox() {  
        this.isShowModal = false;
        this.openDialog = false;
    }
    hideDialog() {  
        this.openDialog = false;
    }

 /*
        @description    :   This Method is to show confirmation Message.      
    */

    handleClick(event){
        this.showAssignButton = true;
        let selectedRows = event.detail.selectedRows;
        console.log(JSON.stringify(selectedRows));
                for (let i of selectedRows.keys()) {
            this.exmVoucher=selectedRows[i].Id;
            
            this.cost=selectedRows[i].Cost__c;                  
         }
    }
updateRecords(){
    this.handleRecords();
}


updateExmRecord(){
    if(this.cost > this.credCost){
        this.openDialog = true;
    }else{
        this.handleRecords();
    }
}
  handleRecords(){
        updateExamRecords({recordId : this.parentID, examVoucher: this.exmVoucher}).then((response)=>{
            const evt = new ShowToastEvent({
                message: this.label.VoucherAssigned_ToastMessage,
                variant: this.variant,
            });
            this.dispatchEvent(evt);
            this.openDialog = false;
            this.isShowModal = false;
            
        }).catch((error) => {});
        alert(this.parentID);
        updateVouchersStatus({voucherId: this.exmVoucher ,voucherStatus : "Assigned", examAttemptId: this.parentID}).then((response)=>{
             this.isShowModal = false;
         }).catch((error) => {});

        window.location.reload();
        this.connectedCallback();
}


  /*
        @description    :   This Method is to sort Expiry Date.      
    */
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;
        // sort direction
        this.sortDirection = event.detail.sortDirection;
        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(this.sortBy, this.sortDirection);
    }

        sortData(fieldname, direction) {
            // serialize the data before calling sort function
            let parseData = JSON.parse(JSON.stringify(this.lstVoucher));
            // Return the value stored in the field
            let keyValue = (a) => {
                return a[fieldname];
            };
            // cheking reverse direction
            let isReverse = direction === 'asc' ? 1: -1;
            // sorting data
            parseData.sort((x, y) => {
                x = keyValue(x) ? keyValue(x) : ''; // handling null values
                y = keyValue(y) ? keyValue(y) : '';
                // sorting values based on direction
                return isReverse * ((x > y) - (y > x));
            });
            // set the sorted data to data table data
            this.lstVoucher = parseData;
        }
}