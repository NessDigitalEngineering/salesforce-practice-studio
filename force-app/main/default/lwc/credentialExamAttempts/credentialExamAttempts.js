import { LightningElement , api, track } from 'lwc';
import getExamAttemptsForUser from "@salesforce/apex/credentialExamAttemptController.getExamAttempts";
import USER_ID from "@salesforce/user/Id";
export default class CredentialExamAttempts extends LightningElement {
    userIds = USER_ID;
    @track searchRecords;

    connectedCallback() {
		getExamAttemptsForUser({ userId: this.userIds })
        .then((res) => {
            this.searchRecords = res;
        })
        .catch((error) => {
            console.log("error" + JSON.stringify(error));
        });
    }
}