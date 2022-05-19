import { api, LightningElement, track, wire} from 'lwc';

export default class CredentialAssignment extends LightningElement {

@api selectedUserName;

handlefireEvent(event){

    this.selectedUserName = event.detail.currentRecId;
    //alert(this.selectedUserName);

}

}