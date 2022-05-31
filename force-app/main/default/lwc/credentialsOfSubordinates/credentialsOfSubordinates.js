import { LightningElement, api, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import getCredentialsOfSubordinates from '@salesforce/apex/CredentialsOfSubordinatesAPEX.getCredentialsOfSubordinates';

export default class CredentialsOfSubordinates extends LightningElement {
    title = 'My Reports';
    @track loaded = false;

    @wire(getCredentialsOfSubordinates, { userId: USER_ID })
    creds({ data, error }) {
        if (data) {
            var tempData = JSON.parse(JSON.stringify(data));

            tempData.forEach(sci => {
                sci.ucList.forEach(uc => {
                    uc.credentialName = uc.Credential__r.Name;
                });
            });

            this.resp = tempData;
            this.loaded = true;
        }
        if (error) {
            console.log(error);
        }
    }

}