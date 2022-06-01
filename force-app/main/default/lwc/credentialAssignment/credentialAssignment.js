import { api, LightningElement, track} from 'lwc';
import { updateRecord, deleteRecord } from 'lightning/uiRecordApi';
import getUserCredentials from '@salesforce/apex/CredentialAssignmentController.getUserCredentials';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import REMOVEROW from '@salesforce/resourceUrl/removeRow';
import {loadStyle} from 'lightning/platformResourceLoader';

const cols = [ { type: 'button-icon',fixedWidth:35,
typeAttributes:
{  
iconName: 'utility:delete',
    name: 'delete',
 disabled: {fieldName:'Delete'},
}},
{ label: 'Credential Name', fieldName: 'CredName', type: "text" ,hideDefaultActions: "true" },
{ label: 'Assigned Date', fieldName: 'AssignedDate', type: 'date-local',editable: false, typeAttributes: {  
day: 'numeric',  
month: 'numeric',  
year: 'numeric'}},
{ label: 'Due Date', fieldName: 'DueData', type: 'date-local', editable: {fieldName: 'controlEditField'}, typeAttributes: {  
day: 'numeric',  
month: 'numeric',  
year: 'numeric'}},
{ label: 'Status', fieldName: 'Status', type: 'text',hideDefaultActions: "true" },];

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
@api removeCredentials;
@api selectedUserName;
@track credentials;
@track selectedCredentials;
@track DataFlag = false;
draftValues = [];

wiredRecords;
refreshTable;
@track credNamess;
handlefireEvent(event){

this.selectedUserName = event.detail.currentRecId;

}

fireEvent(event){
this.DataFlag = true;
this.columns = cols;

this.credNamess = event.detail.selectName;

var tempSelectRecords = [];
if(event.detail.selRecords){
    
    for (const rec of event.detail.selRecords) {
        
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
                alert('action11'+action);
                this.rowactionDelete(event);
                
                }    
    } catch (errorMsg) {
        console.log ('error msg'+errorMsg);
    } 
}
rowactionDelete(event) {

//confirm to delete & invoke deleteRecord()

    if (window.confirm(this.constant.DEL_CONFIRM)) {
    
        for(let cred in this.credentials)
    {
        

        if(this.credentials[cred].CredName===event.detail.row.CredName && this.credentials[cred].Status=='Assigned')
        {
           
            this.template.querySelector("c-Credential-Search").removeCredentials(this.credentials[cred].CredName);
            this.credentials.splice(cred,1);
            
            
        }
        
    }

    var tempResponse = [];
    var tempObject = {};
    if(this.credentials){

        for (const res of this.credentials) {
             
            tempObject = {...res};
            tempResponse.push(tempObject);
            tempObject = {};

        }
}
    
    this.credentials = tempResponse;
    this.removeCredentials = this.credentials;
        
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
    {credmap : this.selectedCredentials, userId:this.selectedUserName,credentialsName: this.credNamess}
).then(response=>{
   
   
    var tempResponse = [];
    var tempObject = {};
    if(response){
        
        for (const res of response) {
            
            tempObject = {...res};
            
        if (res.Status === 'Assigned') {
            
            tempObject.controlEditField = true;
            tempObject.Delete = false;
            }               
            else { 
                
            tempObject.controlEditField = false;
            tempObject.Delete = true;
           }
            
            tempResponse.push(tempObject);
            tempObject = {};
        }
    }  
    this.credentials = tempResponse;
    
   
    
}).catch(error=>{
    console.log ('error msg',error);
});

}
handleClick (){

    
}


}