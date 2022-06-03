import { LightningElement,track, wire, api } from 'lwc';
import getVoucher from '@salesforce/apex/NewExamVoucherController.getVoucher';
import getDecryptedData from '@salesforce/apex/NewExamVoucherController.getDecryptedData';
const columns = [
    { label: 'Exam Voucher ID', fieldName: 'Name', type: 'Auto Number', sortable: true },
    { label: 'Invoice Number', fieldName: 'Invoice_Number__c', type: 'text', sortable: true},
    { label: 'Cost', fieldName: 'Cost__c', type: 'Currency', sortable: true},
    { label: 'Expiry Date', fieldName: 'Expiry_Date__c', type: 'Date', sortable: true},
    { label: 'Voucher Code Encrypted', fieldName: 'Voucher_Code_Encrypted__c', type: 'Text', sortable: true}
];
export default class NewExamVoucher extends LightningElement {
    VoucherList = [];
    error;
    columns = columns;
    rowLimit = 20;
    rowOffSet = 0;
    connectedCallback() {
        this.loadData();
    }
    loadData(){
        return  getVoucher({ limitSize: this.rowLimit , offset : this.rowOffSet })
        .then(result => {
            console.log('hhh'+result);
            let updatedRecords = [...this.VoucherList, ...result];
            this.VoucherList = updatedRecords;
            console.log('Data::'+this.voucherList);
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.VoucherList = undefined;
        });
    }

    loadMoreData(event) {
        const currentRecord = this.VoucherList;
        const { target } = event;
        target.isLoading = true;
       console.log('More');
        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadData();
               
    }

    handleDecryption(event)
    {
        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        if(selectedRecords.length > 0){
            var setRows = [];
          selectedRecords.forEach(currentItem => {
              setRows.push(currentItem.Id);
          });
          getDecryptedData({strId: setRows})
          .then(result =>{
           console.log('Results:::Decrypt:'+result);
           this.VoucherList = result;
          })
          .catch(error => {
			this.error = error;
            
		})
        }
    } 
}