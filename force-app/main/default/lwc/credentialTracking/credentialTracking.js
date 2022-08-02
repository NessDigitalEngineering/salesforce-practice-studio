import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import STATUS from '@salesforce/schema/User_Credential__c.Status__c';
import getUserCredentials from '@salesforce/apex/CredentialTrackingController.getUserCredentials';
import updateUserCredential from '@salesforce/apex/CredentialTrackingController.updateUserCredential';
import USER_ID from '@salesforce/user/Id';
import CompTitle from '@salesforce/label/c.CredentialTracking_Title';
import ShowmoreTitle from '@salesforce/label/c.CredentialTracking_ShowmoreTitle';
import ShowlessTitle from '@salesforce/label/c.CredentialTracking_ShowlessTitle';
import AssignmentIcon from "@salesforce/resourceUrl/Assignment_Icon";

export default class CredentialTracking extends LightningElement {
 
    label = { CompTitle, ShowmoreTitle , ShowlessTitle};
    userIds = USER_ID;
    title;
    Icn = AssignmentIcon;
    userCredData;
    statusValuesReady = false;
    @api boxStyle = "height:10.8rem;";
    //@track loaded = false;
    @track userCredentialsData;
    @track statusValues = [];
    @track countRec;
    @track showMore = false;
    @track showMre = false;
    @track initialRecords = false;
    @track showMoreRecords = false; 
    @track showLess=false;
    @track userCredData;
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
       // this.loaded = false;
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
        
        //const three_sec = 1000;

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
            //this.progress = three_sec;
            this._interval = setInterval(() => {
               // this.progress = this.progress + three_sec;
                this.processStatusValues();
                //if (this.progress === (three_sec * 2)) {
                    clearInterval(this._interval);
               // }
            }, 0);
        }
    }
    processData(data) { 
        this.totalUserCredentials = data;
        this.countRec = data.length;
        let selectedRec = [];
       // let slctRec= [];
        //let slctRecords= [];
        if (!this.showMoreRecords) {
            if (this.countRec > 2) {
                this.showMore = true;
                this.initialRecords = true;
                for (let i = 0; i < this.countRec; i++) {
                    if (i < 2) {
                        selectedRec.push(data[i]);
                        //slctRec.push(data[i].Credential__r.Name);
                        //slctRecords.concat(selectedRec,slctRec);
                    }
                }
                this.userCredentialsData = selectedRec;
                this.userCredData = selectedRec;
            } else {
                if (data.length === 0) {
					this.showIcon = true;
                    this.emptyRecords = false;
				}
                this.showMore = false;
                this.initialRecords = true;
                this.userCredentialsData = data;
            }
        } else {
            this.userCredentialsData = data;
        }
        if(this.countRec > 0){
            this.title = this.label.CompTitle + " (" + data.length + ")";
        }else{
            this.title = this.label.CompTitle;
        }
        //this.loaded = true;
    }
    showMoreRec() {
        this.initialRecords = false;
        this.showMoreRecords = true;
        this.showMore = false;
        this.showLess = true;
        this.userCredentialsData = this.totalUserCredentials;

    }

    showLessRec() {
        this.initialRecords = false;
        this.showMoreRecords = false;
        this.showMore = true;
        this.showLess = false;
        this.userCredentialsData = this.userCredData;

    }
}