import { LightningElement,wire,api,track } from 'lwc';
import getResults from '@salesforce/apex/CredentialSearchController.getCredentials';
//import getCredentials from '@salesforce/apex/apecExample1.getCredentials';
import UserSearchLabel from '@salesforce/label/c.UserSearchLabel';


export default class CredentialSearch extends LightningElement {
@api objectName = 'Credential__c';
@api fieldName = 'Name';
@api selectRecordId = '';
@api selectRecordName;
@api Label;
@api searchRecords = [];
@api required = false;
@api iconName ;
@api LoadingText = false;
@track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track messageFlag = false;
@track iconFlag =  true;
@track clearIconFlag = false;
@track inputReadOnly = false;
@track userRoleSelect;
@track usersearchlists = UserSearchLabel ;

searchField(event) {
const regixs = /^(?=^\w{3,20}$)[a-z0-9]+_?[a-z0-9]+$/;
var currentText = event.target.value;


if(currentText.match(regixs)){

this.LoadingText = true;
getResults({searchKeyWord: currentText}).then(response=>{
    this.searchRecords= response;
    this.LoadingText = false;
    
    this.txtclassname =  response.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    if(currentText.length > 0 && response.length == 0) {
        this.messageFlag = true;
    }
    else {
        this.messageFlag = false;
    }

    if(this.selectRecordId != null && this.selectRecordId.length > 0) {
        this.iconFlag = false;
        this.clearIconFlag = true;
    }
    else {
        this.iconFlag = true;
        this.clearIconFlag = false;
    }
})
.catch(error => {
    console.log('-------error-------------'+error);
    console.log(error);
});



} 

}



setSelectedRecord(event) {
var currentRecId = event.currentTarget.dataset.id;
var selectName =  event.currentTarget.dataset.name;
alert(selectName);
this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
this.iconFlag = false;
this.clearIconFlag = true;
this.selectRecordName = event.currentTarget.dataset.name;
this.selectRecordId = currentRecId;
this.inputReadOnly = true;
const selectedEvent = new CustomEvent('selected', { detail: {selectName, currentRecId}, });
// Dispatches the event.
this.dispatchEvent(selectedEvent);
}

resetData(event) {
this.selectRecordName = "";
this.selectRecordId = "";
this.inputReadOnly = false;
this.iconFlag = true;
this.clearIconFlag = false;

}

}