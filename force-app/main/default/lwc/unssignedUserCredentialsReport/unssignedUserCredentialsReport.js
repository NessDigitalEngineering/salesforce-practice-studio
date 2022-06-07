import { api, LightningElement, track,wire} from 'lwc';
import USER_ID from '@salesforce/user/Id';
import getUnassignedReport from '@salesforce/apex/CredentialsUnAssignedReport.getUnassignedReport';

const colms = [{ label: 'Name', fieldName: 'uname', type: "text",hideDefaultActions: "true"  },
{ label: 'Last Credential śAttempt', fieldName: 'completionDate', type: 'text',hideDefaultActions: "true" },];

export default class UnssignedUserCredentialsReport extends LightningElement {

    @track columns = colms;
    @track credentials;
    
    @wire(getUnassignedReport,{userId: USER_ID})
    creds({ data, error }) {
        if (data) {
            console.log('hai'+JSON.stringify(data));
            //this.credentials = JSON.parse(JSON.stringify(data));
            this.credentials = data;

           console.log('dattttttttkkkkk');
        }
        if (error) {
            console.log(error);
        } 
    }

    
}