import { api, LightningElement, track} from 'lwc';
import { updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import getUserCredentials from '@salesforce/apex/CredentialAssignmentController.getUserCredentials';

import {loadStyle} from 'lightning/platformResourceLoader'
import REMOVEROW from '@salesforce/resourceUrl/removeRow'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const cols = [ { type: 'button-icon',fixedWidth:35,
typeAttributes:
{  
    iconName: 'utility:delete',
    name: 'delete',
   // iconClass: 'slds-icon-text-error',
    
}},
    { label: 'Credential Name', fieldName: 'CredentialName', type: "text"},
{ label: 'Assigned Date', fieldName: 'Assigned_Date__c', type: 'date-local',editable: false, typeAttributes: {  
    day: 'numeric',  
    month: 'numeric',  
    year: 'numeric'}},
{ label: 'Due Date', fieldName: 'Due_Date__c', type: 'date-local', editable: true, typeAttributes: {  
    day: 'numeric',  
    month: 'numeric',  
    year: 'numeric'}},
{ label: 'Status', fieldName: 'Status__c', type: 'Picklist' },];

export default class CredentialAssignment extends LightningElement {
    @api constant = {
        ERROR_TITLE : 'Error Found',
        ROWACTION_DELETE : 'delete',
        VAR_SUCCESS : 'Success',
        ROWACTION_SAVE : 'save',
        VAR_ERROR : 'error',
        MSG_DELETE : 'Record Deleted',
        MSG_ERR_DEL : 'Error deleting record',
        MSG_ERR_UPD_RELOAD : 'Error updating or reloading record',
        MSG_UPD : 'Certificate Updated',
        DEL_CONFIRM : 'Want to delete?',
        MODE_BATCH : 'batch',
        MODE_SINGLE : 'single'
    }
@track columns;

@api selectedUserName;
@track credentials;
@track selectedCredentials = [];
@track DataFlag = false;
draftValues = [];

wiredRecords;
refreshTable;
handlefireEvent(event){

    this.selectedUserName = event.detail.currentRecId;

}

fireEvent(event){
    this.DataFlag = true;
    this.columns = cols;

   
    var tempSelectRecords = [];
    if(event.detail.selRecords){
        for (let index = 0; index < event.detail.selRecords.length; index++) {
            
            tempSelectRecords.push(event.detail.selRecords[index].recId);
            
        }
    }
   
   
    this.selectedCredentials = tempSelectRecords;
    
    getUserCredentials(
        {credentialsId : this.selectedCredentials}
    ).then(response=>{
        this.refreshTable = response;
        var tempResponse = [];
        var tempObject = {};
        if(response){
    
             for (let index = 0; index < response.length; index++) {
                console.log("==="+response[index].Credential__r.Name);  
                tempObject = {...response[index]};

                tempObject.CredentialName = response[index].Credential__r.Name;
                tempResponse.push(tempObject);
                tempObject = {};

            
             }

        }
        
        this.credentials = tempResponse;
        console.log("==="+JSON.stringify(tempResponse));
        
    }).catch(error=>{
        //alert('Failed');
    }); 
}
handleSave(event) {
 
    try {

         const recordInputs =  event.detail.draftValues.slice().map(draft => {
             const fields = Object.assign({}, draft);
             return { fields };
         }); 

         //invoke updaterecord() for batch update
         const promises = recordInputs.map(recordInput => 
                                                 updateRecord(recordInput));
         Promise.all(promises).then(contacts => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.VAR_SUCCESS,
                     message: this.constant.MSG_UPD,
                     variant: this.constant.VAR_SUCCESS
                 })
             );

         //refresh data in the datatable
         return refreshApex(this.credentials);            
         })

         //display error message in case of errors
         .catch(error => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.MSG_ERR_UPD_RELOAD,
                     message: error.body.message,
                     variant: this.constant.VAR_ERROR
                 })
             );
         });
     } catch (errorMsg) {
         console.log ('error at save'+errorMsg.message );
     }         
 }

 rowactionSave(event) {

     try {

         //get the changed records using queryselector.draftValues

        let qslct = this.template.querySelector('lightning-datatable').
                  draftValues.find(x => x.Id == event.detail.row.Id);


         let row = [];
         row = [...row, qslct];


         const recordInputs = row.slice().map(draft => {
             const fields = Object.assign({}, draft);
             return { fields };
         });    

         //invoke updaterecord() for single row update
         const promises = recordInputs.map(recordInput => 
                                                   updateRecord(recordInput));
         Promise.all(promises).then(contacts => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.VAR_SUCCESS,
                     message: this.constant.MSG_UPD,
                     variant: this.constant.VAR_SUCCESS
                 })
             );

         //refresh data in the datatable
         return refreshApex(this.refreshTable);            
         })

         //display error message in case of errors

        .catch(error => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.MSG_ERR_UPD_RELOAD,
                     message: error.body.message,
                     variant: this.constant.VAR_ERROR
                 })
             );
         });
     } catch (errorMsg) {
         console.log ('error at save record');
     }         
 } 

handleDelete(event) {

    try {
            const action = event.detail.action.name;

            //check for save or delete action
            switch (action) {
                
                case this.constant.ROWACTION_DELETE: 
                    this.rowactionDelete(event);
                    break;
                }        
        } catch (errorMsg) {
            console.log ('error msg');
        } 
}
rowactionDelete(event) {
 
    //confirm to delete & invoke deleteRecord()

     if (window.confirm(this.constant.DEL_CONFIRM)) {

         deleteRecord(event.detail.row.Id)
         .then(() => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.VAR_SUCCESS,
                     message: this.constant.MSG_DELETE,
                     variant: this.constant.VAR_SUCCESS
                 })
             );

         //refresh data in the datatable
         console.log('refresh date'+this.credentials);
         //return refreshApex(this.credentials); 
         //return this.refresh(); 
         this.refresh(); 
         console.log('refresh date1234'+this.credentials);      
         })

         //display error message in case of errors
         .catch(error => {
             this.dispatchEvent(
                 new ShowToastEvent({
                     title: this.constant.MSG_ERR_DEL,
                     message: error.body.message,
                     variant: this.constant.VAR_ERROR
                 })
             );
         });            
     }       
 }
renderedCallback(){ 
    Promise.all([
        loadStyle( this, REMOVEROW)
        ]).then(() => {
            console.log( 'Files loaded' );
        })
        .catch(error => {
            console.log( 'error',error );
    });
}
@api
async refresh() {
        
    await refreshApex(this.credentials);
   
}

}