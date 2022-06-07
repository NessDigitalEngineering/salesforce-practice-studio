import { api, LightningElement, track} from 'lwc';
import { updateRecord} from 'lightning/uiRecordApi';
import getUserCredentials from '@salesforce/apex/CredentialAssignmentController.getUserCredentials';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import insertCredAssignments from '@salesforce/apex/CredentialAssignmentController.insertCredAssignments';
import {loadStyle} from 'lightning/platformResourceLoader';
import REMOVEROW from '@salesforce/resourceUrl/removeRow'

const cols = [ { type: 'button-icon',fixedWidth:35,
typeAttributes:
{  
iconName: 'utility:delete',
    name: 'deleteIcon',
 disabled: {fieldName:'deleteIcon'}
}},
{ label: 'Credential Name', fieldName: 'credName', type: "text" ,hideDefaultActions: "true",wrapText: true },
{ label: 'Assigned Date', fieldName: 'assignedDate', type: 'date-local',editable: false, typeAttributes: {  
day: 'numeric',  
month: 'numeric',  
year: 'numeric'}},
{ label: 'Due Date', fieldName: 'dueData', type: 'date-local', editable: {fieldName: 'controlEditField'}, typeAttributes: {  
day: 'numeric',  
month: 'numeric',  
year: 'numeric'}},
{ label: 'Status', fieldName: 'status', type: 'text',hideDefaultActions: "true" },];

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
@api selectedUserName='';
@track credentials;
@track selectedCredentials;
@track isDataAvaialable = false;
draftValues=[] ;

wiredRecords;
refreshTable;
handleUserName(event){
this.selectedUserName = event.detail.currentRecId;
this.handleCredential(event);
}

handleCredential(event){
this.columns = cols;
var tempSelectRecords = [];

console.log('this.selRecords-'+event.detail.selRecords);
if(this.selectedUserName && event.detail.selRecords){
    for (const rec of event.detail.selRecords)        
        tempSelectRecords.push(rec.recId)    
        this.selectedCredentials = tempSelectRecords;
        this.isDataAvaialable=true;
}
else
{
this.template.querySelector("c-Credential-Search").resetCredentials();
this.selectedCredentials = tempSelectRecords;
this.isDataAvaialable = false;
}
console.log('this.selRecords-'+event.detail.selRecords);

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

       // loadStyle( this, REMOVEROW)

        loadStyle( this, REMOVEROW)

        ]).then(() => {
            console.log( 'Files loaded' );
        })
        .catch(error => {
            console.log( 'error',error );
    });
    } 
getdata(){
    console.log('getUserCredentials--'+this.selectedCredentials);

getUserCredentials(
    {credmap : this.selectedCredentials, userId:this.selectedUserName}
).then(response=>{
   
   
    var tempResponse = [];
    var tempObject = {};
    if(response){
        
        for (const res of response) {
            
            tempObject = {...res};
            
        if (res.status == 'Assigned') {
            
            tempObject.controlEditField = true;
            tempObject.deleteIcon = false;
            }               
            else { 
                
            tempObject.controlEditField = false;
            tempObject.deleteIcon = true;
           }
            
            tempResponse.push(tempObject);
            
        }
    }  
    this.credentials = tempResponse;
    if(this.credentials.length>0)
    this.isDataAvaialable = true;
    else
    this.isDataAvaialable = false;

    console.debug('this.credentials-'+this.credentials);
    
}).catch(error=>{
    console.log ('error msg',error);
});

}

handleClick(event)
{
    insertCredAssignments({credAssignmentList:this.credentials})
       .then(result => {
             
       })
       .catch(error => {
           console.log('Errorured:- '+error.body.message);
       });

       this.draftValues=event.detail.draftValues;

       const recordInputs =  event.detail.draftValues.slice().map(draft => {
        const fields = Object.assign({}, draft);
        return { fields };
    }); 
    this.draftValues = [];


    console.log('Button Click Check'+JSON.stringify(this.credentials));
    
}

}