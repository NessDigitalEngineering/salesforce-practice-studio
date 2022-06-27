import { LightningElement,api,track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getUserCredentials from '@salesforce/apex/CredentialTrackingLWCAPEX.getUserCredentials';
import uploadFile from '@salesforce/apex/newVoucherRequestController.uploadFile';
import createNewVoucherRecord from '@salesforce/apex/newVoucherRequestController.createNewVoucherRecord';

export default class NewVoucherRequest extends LightningElement {
    @track 
    isShowModal = true;
    totalUserCredentials=[];
    Credential;
    examDate;
    fileHolder;
    fileData;
    newRecId;
    // TODO::
   @api
   userId = USER_ID;

    get acceptedFormats() {
        return ['.docx','.pdf', '.png'];
    }
    handleFilesChange(event){
        this.fileHolder = event.target.files[0];
        
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': this.fileHolder.name,
                'base64': base64,
                'recordId': this.newRecId
            }
            console.log(this.fileData);
        }
        reader.readAsDataURL(this.fileHolder);
    }
    handleFile(){
        if(!this.fileData.recordId){
            this.fileData.recordId = this.newRecId;
        }
        const {base64, filename, recordId} = this.fileData;
        uploadFile({ base64, filename, recordId }).then(result=>{
            this.fileData = null;
            let title = `${filename} uploaded successfully!!`;
            this.toast(title);
        })
    }
    toast(title){
        const toastEvent = new ShowToastEvent({
            title, 
            variant:"success"
        })
        this.dispatchEvent(toastEvent)
    }
    connectedCallback() {
        getUserCredentials({ userId: this.userId })
            .then((res) => {
                console.log(JSON.stringify(res));
                if(res && res.length>0){
                this.totalUserCredentials = res;
                this.totalUserCredentials.forEach(e => {
                    console.log(e);
                        if (e.Credential__r && e.Credential__r.Name) {
                            e.label = e.Credential__r.Name;
                            e.value = e.Id;
                        }
                    });
                }
            })
            .catch((error) => {
                console.log("error" + JSON.stringify(error));
            });
    }

    handleCredentialChange(event) {        
        this.Credential = event.detail.value;
        console.log(this.Credential);
    }

    handleExamDateChangeEvent(event){
        this.examDate = event.target.value;   
        console.log(this.examDate);     
    }
    handleCommentsChangeEvent(event){
        this.comments = event.target.value;   
        console.log(this.comments);  
    } 

    handleSubmit(){
        console.log('handleSubmit----');
        createNewVoucherRecord({VoucherRecord:{
                                    'User_Credential__c':this.Credential,       
                                    'Exam_Date_Time__c':this.examDate,  
                                    'Preparation_Comments__c':this.comments              
                                    }})
        .then(result=>{
            window.console.log('after save' + result.Id);
            if(result.Id){
                    this.newRecId = result.Id;
                    if(this.fileHolder){
                        this.handleFile();
                    }                   
            }
        })
        .catch(error=>{
           this.error=error.message;
           window.console.log(this.error);
        });

    }
    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
}