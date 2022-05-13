import { LightningElement,wire,api,track } from 'lwc';
import getResults from '@salesforce/apex/apecExample1.getResults';
import getCredentials from '@salesforce/apex/apecExample1.getCredentials';
//import getResults from '@salesforce/apex/lwcCustomLookupController.getResults';
import UserSearchLabel from '@salesforce/label/c.UserSearchLabel';

export default class LwcCustomLookup extends LightningElement {
    @api objectName = 'User';
    @api fieldName = 'Name';
    @api selectRecordId = '';
    @api selectRecordName;
    @api Label;
    @api searchRecords = [];
    @api required = false;
    @api iconName = 'standard:user';
    @api LoadingText = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track messageFlag = false;
    @track iconFlag =  true;
    @track clearIconFlag = false;
    @track inputReadOnly = false;
     userLabel = UserSearchLabel;
   

    searchField(event) {
        var currentText = event.target.value;
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

       /* getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText  })
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
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });*/
        
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