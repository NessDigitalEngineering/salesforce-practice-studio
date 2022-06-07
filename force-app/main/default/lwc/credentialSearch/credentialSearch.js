import { LightningElement,api,track } from 'lwc';
import getResults from '@salesforce/apex/CredentialSearchController.getCredentials';

import UserSearchLabel from '@salesforce/label/c.UserSearchLabel';

export default class CredentialSearch extends LightningElement {

@api Label;
@track searchRecords = [];
@track selectedRecords = [];
@api required = false;
@api iconName ;
@api LoadingText = false;
@track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track messageFlag = false;
UserLabels = UserSearchLabel;

@api datesend='' ;


searchField(event) {
    
    var currentText = event.target.value;
    var selectRecId = [];
    
    for (const selRec of this.selectedRecords) {
        selectRecId.push(selRec.recId);
        
    }
    
    this.LoadingText = true;
    console.log('check creds');
    
    getResults({searchKey: currentText, selectedRecId : selectRecId,userId: this.datesend })
    .then(result => {
        this.searchRecords= result;
        this.LoadingText = false;
        
        this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        if(currentText.length > 0 && result.length == 0) {
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
        
        this.dispatchEvent(new CustomEvent('credentialsevent', {detail:selectRecId}));
    })
    .catch(error => {
        console.log('-------error-------------'+error);
        console.log(error);
    });
    
}

setSelectedRecord(event) {
    console.log('aaa datsends bbb'+JSON.stringify(this.datsends));
    var recId = event.currentTarget.dataset.id;
    var selectName = event.currentTarget.dataset.name;
    
    let newsObject = { 'recId' : recId ,'recName' : selectName };
    this.selectedRecords.push(newsObject);
    this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    let selRecords = this.selectedRecords;
    
    this.template.querySelectorAll('lightning-input').forEach(each => {
        each.value = '';
    });
    const selectedEvent = new CustomEvent('selected', { detail: {selRecords,selectName}, });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
}

removeRecord (event){
    let selectRecId = [];
    
    for (const selRec of this.selectedRecords) {
        if(event.detail.name !== selRec.recId){
            selectRecId.push(selRec);
        }     
    }
    
    this.selectedRecords = [...selectRecId];
    let selRecords = this.selectedRecords;
    const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
}
@api
removeCredentials(assignments){
    
    for (const selRec of this.selectedRecords) {

        if( assignments == selRec.recName){

            const index = this.selectedRecords.indexOf(selRec);
            if (index > -1) {
           this.selectedRecords.splice(index, 1); // 2nd parameter means remove one item only
                     }

        }     
    }
   
} 

@api
resetCredentials(){
    this.selectedRecords=[];  
} 


} 