import { LightningElement, track } from 'lwc';

export default class CredentialTracking extends LightningElement {
    

    userCredentialList = [
        {
            Id: 1,
            name :'Salesforce CPQ',
            status : 'Assigned'
        },
        {
            id: 2,
            name :'Salesforce PD1',
            status : 'Pending'
        },
        {
            id: 3,
            name :'Salesforce PD2',
            status : 'Complete'
        },
];

statusChange(event){
console.log('called:');
}

}