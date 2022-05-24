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
    console.log('testing');
    for (const rec of event.detail.selRecords) {
        console.log('rec'+rec.recId);
        tempSelectRecords.push(rec.recId);
    }

}


this.selectedCredentials = tempSelectRecords;
this.getdata();

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
        Promise.all(promises).then(_contacts => {
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
        Promise.all(promises).then(_contacts => {
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
                    mode: 'dismissible',
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
            
            if (action != '' && action == this.constant.ROWACTION_DELETE){

                this.rowactionDelete(event);
                
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
        
        
    for(let cred in this.credentials)
    {
        console.log('cred--'+this.credentials[cred].Id+'--'+event.detail.row.Id);

        if(this.credentials[cred].Id===event.detail.row.Id)
        {
            console.log('log check');
            this.credentials.splice(cred,1);
        }
        
    }
    var tempResponse=[];var tempObject={};
    
    for (const credn of this.credentials) {
    tempObject = {...credn};

    tempResponse.push(tempObject);
        tempObject = {};
    }
    
    this.credentials=tempResponse;
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

getdata(){
getUserCredentials(
    {credentialsId : this.selectedCredentials}
).then(response=>{
    this.refreshTable = response;
    var tempResponse = [];
    var tempObject = {};
    if(response){

        for (const res of response) {
            console.log("==="+res.Credential__r.Name);  
            tempObject = {...res};

            tempObject.CredentialName = res.Credential__r.Name;
            tempResponse.push(tempObject);
            tempObject = {};

        }
}
    
    this.credentials = tempResponse;
    
    console.log("==="+JSON.stringify(tempResponse));
    
}).catch(error=>{
    console.log ('error msg',error);
});

}


}