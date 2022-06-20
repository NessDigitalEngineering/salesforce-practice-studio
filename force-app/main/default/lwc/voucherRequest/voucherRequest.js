import { LightningElement, track } from 'lwc';

export default class VoucherRequest extends LightningElement {
    @track isShowModal = false;
    @track showComponent = false;
       userCredentials = [
        {
            Id: 1,
            name :'Salesforce CPQ',
            status : 'Assigned',
            nextStatus: 'Ready'
        }
];
voucherRequestModal(){
    this.isShowModal=true;
}

closeModal() {
    this.isShowModal = false;
}

hideModalBox() {  
    this.isShowModal = false;
}
}