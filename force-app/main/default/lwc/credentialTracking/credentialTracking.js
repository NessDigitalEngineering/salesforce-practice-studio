import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import STATUS from '@salesforce/schema/User_Credential__c.Status__c';
import getUserCredentials from '@salesforce/apex/CredentialTrackingController.getUserCredentials';
import updateUserCredential from '@salesforce/apex/CredentialTrackingController.updateUserCredential';
import USER_ID from '@salesforce/user/Id';
import CompTitle from '@salesforce/label/c.CredentialTracking_Title';
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";

export default class CredentialTracking extends LightningElement {
 
    label = { CompTitle};
    userIds = USER_ID;
    title;
    Icn = TasksIcon;
    statusValuesReady = false;
    @track userCredentialsData;
    @track statusValues = [];
    @track countRec;
    @track showMre = false;
    @track initialRecords = false;
    @track showMoreRecords = false; 
    @track showIcon = false;
    @track emptyRecords = true;
    @wire(getObjectInfo, { objectApiName: 'User_Credential__c' })
    userCredentialMetadata;

    @wire(getPicklistValues, { recordTypeId: '$userCredentialMetadata.data.defaultRecordTypeId', fieldApiName: STATUS })
    picklistValues({ data, error }) {
        
        if (data) {
            for (const statusVal of data.values) {
                this.statusValues.push(statusVal.value);
            }
            this.statusValuesReady = true;
            
        }
        if (error) {
            console.log(error);
        }
    }


    connectedCallback() {
        getUserCredentials({ userId: this.userIds })
            .then((res) => {
                this.totalUserCredentials = res;
                this.processStatusValues();
            })
            .catch((error) => {
                console.log("error" + JSON.stringify(error));
            });
    }
    handleClick(event) {
       
        updateUserCredential({ id: event.target.value, status: event.target.title })
            .then((result) => {
                if (result === true) {
                    getUserCredentials({ userId: this.userIds })
                        .then((rs) => {
                            this.totalUserCredentials = rs;
                            this.processStatusValues();
                        })
                        .catch((error) => {
                            console.log("error" + JSON.stringify(error));
                        });
                }
            })
            .catch((error) => {
                console.log("error" + JSON.stringify(error));
            });
    }
    processStatusValues() {
        
        
        if (this.statusValuesReady) {
            this.totalUserCredentials.forEach(e => {
                if (e.Status__c && e.Status__c != 'Completed') {
                    e.nextStatusLbl = this.statusValues[this.statusValues.indexOf('' + e.Status__c) + 1] + ' >';
                    e.nextStatus = this.statusValues[this.statusValues.indexOf('' + e.Status__c) + 1];
                    e.credentialName = e.Credential__r.Name;
                }
            });
            this.processData(this.totalUserCredentials);
        } else { 
            this._interval = setInterval(() => {
                this.processStatusValues();
                clearInterval(this._interval);
            }, 0);
        }
    }
    processData(data) { 
        this.totalUserCredentials = data;
        this.countRec = data.length;
        let selectedRec = [];
        if (!this.showMoreRecords) {
            if (data.length === 0) {
                this.showIcon = true;
                this.emptyRecords = false;
            }
            this.initialRecords = true;
            this.userCredentialsData = data;
        } else {
            this.userCredentialsData = data; 
        }
        if(this.countRec > 0){
            this.title = this.label.CompTitle + " (" + data.length + ")";
        }else{
            this.title = this.label.CompTitle;
        }
    }
}