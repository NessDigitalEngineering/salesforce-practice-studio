import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo,getPicklistValues  } from 'lightning/uiObjectInfoApi';
import STATUS from '@salesforce/schema/User_Credential__c.Status__c';
import getUserCredentials from '@salesforce/apex/CredentialTrackingLWCAPEX.getUserCredentials';
import updateUserCredential from '@salesforce/apex/CredentialTrackingLWCAPEX.updateUserCredential';
import USER_ID from '@salesforce/user/Id';
import CompTitle from '@salesforce/label/c.CredentialTrackingLWC_Title';
import ShowmoreTitle from '@salesforce/label/c.CredentialTrackingLWC_ShowmoreTitle';

export default class CredentialTrackingLWC extends LightningElement {

label = {CompTitle, ShowmoreTitle}; 
userIds = USER_ID;
title;
userCredData;
statusValuesReady=false;
@track loaded = false;
@track userCredentialsData;
@track statusValues = [];
@track countRec; 
@track showMore = false;
@track showMre =  false;
@track initialRecords = false;
@track showMoreRecords = false;

@wire(getObjectInfo, { objectApiName: 'User_Credential__c' })
    userCredentialMetadata;

@wire(getPicklistValues, { recordTypeId: '$userCredentialMetadata.data.defaultRecordTypeId', fieldApiName: STATUS })
picklistValues({data,error}){
    if(data){
        for (const statusVal of data.values) {
            this.statusValues.push(statusVal.value); 
        }
            this.statusValuesReady=true
    }
    if(error){
        console.log(error);
    }
}


connectedCallback(){
    getUserCredentials({userId:this.userIds})
                    .then((res) => {
                        this.totalUserCredentials = res;
                        this.processStatusValues();
                    })
                    .catch((error) => {
                        console.log("error" + JSON.stringify(error));
                    });
}
handleClick(event){
    this.loaded = false;
    console.log(event.target.title);
    updateUserCredential({ id: event.target.value, status:event.target.title })
            .then((result) => {
                if (result===true) {
                    getUserCredentials({userId:this.userIds})
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
processStatusValues(){
    if(this.statusValuesReady){
        this.totalUserCredentials.forEach(e => {
            if(e.Status__c && e.Status__c!='Completed'){ 
             e.nextStatusLbl = this.statusValues[this.statusValues.indexOf(''+e.Status__c)+1] +' >';
             e.nextStatus = this.statusValues[this.statusValues.indexOf(''+e.Status__c)+1] ;
             e.credentialName=e.Credential__r.Name;
            }
        });
        this.processData(this.totalUserCredentials);
    } else{
        this.progress=3000;
            this._interval = setInterval(() => {  
                this.progress = this.progress + 3000;  
                this.processStatusValues();
                if ( this.progress === 6000 ) {  
                    clearInterval(this._interval);  
                }  
            }, this.progress);
    }
}
processData(data){
    this.totalUserCredentials = data;
    this.countRec = data.length;
    let selectedRec = [];
    console.log('this.countRec=='+ this.countRec);
    if(!this.showMoreRecords){
    if(this.countRec > 2){
        console.log('>2');
        
            this.showMore = true;
            this.initialRecords = true;
        
     for(let i=0;i<this.countRec;i++){
        if(i<2){ 
             selectedRec.push(data[i]);
        }
     }
                          
     this.userCredentialsData = selectedRec;
    }else{
        console.log('else >2');
        this.showMore = false;
                          this.initialRecords = true;
     this.userCredentialsData = data;
    }
} else{
    this.userCredentialsData = data;
}
     this.title = this.label.CompTitle +' (' + data.length + ')';
     this.loaded = true;
} 
showMoreRec(){
        this.initialRecords = false;
        this.showMoreRecords = true;
        this.showMore = false;
        this.userCredentialsData = this.totalUserCredentials
                             
}
}