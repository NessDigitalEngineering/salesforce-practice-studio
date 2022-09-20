import { LightningElement,track } from 'lwc';
import globalSrch from '@salesforce/apex/GlobalSearchController.globalSrch';
import id from '@salesforce/user/Id';

const cols= [
    {label:'Name',fieldName:'Name',type:'text'},
    {label:'Account Number',fieldName:'AccountNumber',type:'text'},
    {label:'Website',fieldName:'Website',type:'url'}
]

const conCols= [
    {label: 'Name', fieldName: 'Name', type: 'text'},
    {label: 'Email', fieldName: 'Email', type: 'email'},
    {label: 'Mobile', fieldName: 'MobilePhone', type: 'phone'},
]

export default class Globalsearch extends LightningElement {

    @track accColumns = cols;
    @track conColumns = conCols;
    @track srchVal;
    @track accData;
    @track conData;

    onsrchFunctionality(event){
        this.srchVal = event.target.value;
        console.log(this.srchVal);
        globalSrch({srchValue : this.srchVal}).then((response)=>{
            this.accData = response[0];
            this.conData = response[1];
            console.log(response);
            console.log('Passing data from client side to server side');
        }).catch((error)=>{
            console.log('failed');
        });
    }
}