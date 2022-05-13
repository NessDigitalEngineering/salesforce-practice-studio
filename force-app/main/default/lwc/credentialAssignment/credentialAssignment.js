import { LightningElement, track, wire} from 'lwc';
import selectedcredentials from '@salesforce/apex/picklistLookupController.selectedcredentials';

const cols = [
    {label:'Credential Name', fieldName:'Name', type:'text'}
]

export default class CredentialAssignment extends LightningElement {

    columns = cols;
    credentials;
    @track selectedCredentials = [];

    handlefireEvent(event){
        this.selectedCredentials = event.detail;
        //alert(this.selectedCredentials);
        
       // const recordsdata = this.selectedCredentials;
      // @wire(selectedcredentials) credentials;
        selectedcredentials(
            {credentialsId : this.selectedCredentials}
        ).then(response=>{
            
            this.credentials = response;
            //alert(this.credentials);
            //alert('Records successfully displayed')
        }).catch(error=>{
            //alert('Failed');
        });
    }



}