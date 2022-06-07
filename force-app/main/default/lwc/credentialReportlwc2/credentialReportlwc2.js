import { api, LightningElement, track,wire} from 'lwc';
import USER_ID from '@salesforce/user/Id';
import getCredentialsReport from '@salesforce/apex/CredentialsReport.getCredentialsReport';

const colms = [{ label: 'Name', fieldName: 'userName', type: "text" ,hideDefaultActions: "true" },
{ label: 'Credential', fieldName: 'creadName', type: 'text',hideDefaultActions: "true"},
{ label: 'Due Date', fieldName: 'Due_Date__c', type: 'date-local', typeAttributes: {  
day: 'numeric',  
month: 'numeric',  
year: 'numeric'}},
{ label: 'Status', fieldName: 'Status__c', type: 'text',hideDefaultActions: "true" },];

export default class CredentialReportlwc2 extends LightningElement {

    @track columns = colms;
    @track credentials = [];
    
    @wire(getCredentialsReport, { userId: USER_ID })
    creds({ data, error }) {
        if (data) {
            console.log('hai'+JSON.stringify(data));
            this.credentials = JSON.parse(JSON.stringify(data));
            this.credentials.forEach(function(uc){
                uc.userName = uc.User__r.Name;
                uc.creadName = uc.Credential__r.Name});

           console.log('dattttttttkkkkk');
        }
        if (error) {
            console.log(error);
        } 
    }

    
}