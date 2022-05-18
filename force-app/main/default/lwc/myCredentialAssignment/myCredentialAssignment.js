import { LightningElement, track, wire, api } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import getActiveUserCredentials from '@salesforce/apex/UserCredentialService.getActiveUserCredentials';  
export default class CredentialTracking extends LightningElement {  
    @track coulmns = [
        {label: 'Credential', fieldName: 'Credential__c', type: 'text'},
        {label: 'Status', fieldName: 'Status__c', type: 'Picklist'},
        {label: 'User', fieldName: 'User__c', type: 'text'}
    ] 
     @api currentUserId = USER_ID;
    @track userCredentials;

    @wire(getActiveUserCredentials, {userId: '$currentUserId'})
    getActiveUsers({data,error}){
       if(data){
           this.userCredentials = data;
           console.log('data---'+this.userCredentials);
          this.error = undefined;
       }else if(error){
        this.error = error;
       this.userCredentials = undefined;
       }
   }
   connectedCallback(){
    this.userId = this.recordId;
}
}