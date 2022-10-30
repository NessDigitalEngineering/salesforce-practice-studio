import {LightningElement,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import uploadFiles from '@salesforce/apex/FileUploadMultiController.uploadFiles'
const MAX_FILE_SIZE = 50000000;

export default class FileUploadMultiLWC extends LightningElement {
 @api examid;
    @api credname;
    @api isfile;
   // @api recordId;
    @track filesData = [];
    showSpinner = false;

    handleFileUploaded(event) {
          let rand = parseInt(Math.random()*10000);
        if (event.target.files.length > 0) {
            for(var i=0; i< event.target.files.length; i++){
                if (event.target.files[i].size > MAX_FILE_SIZE) {
                    this.showToast('Error!', 'error', 'File size exceeded the upload size limit.');
                    return;
                }
                let file = event.target.files[i];
                let reader = new FileReader();
                reader.onload = e => {
                    var fileContents = reader.result.split(',')[1]
                 //   this.filesData.push({'fileName':file.name, 'fileContent':fileContents});
                     if(this.isfile){
                        this.filesData.push({'fileName':this.examid + '_'+this.credname + '_'+rand+'_Reciept'+ '.pdf','fileContent':fileContents});
                     
                     }else{
                         this.filesData.push({'fileName':file.name, 'fileContent':fileContents});
                     }
                };
                reader.readAsDataURL(file);
            }
        }
		   

		   const selectEvent = new CustomEvent('upload', {
            detail: this.filesData
        });
      	 this.dispatchEvent(selectEvent);
       //  this.checkValidity();
    }

 
    removeReceiptImage(event) {
        var index = event.currentTarget.dataset.id;
        this.filesData.splice(index, 1);
    }

    showToast(title, variant, message) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                variant: variant,
                message: message,
            })
        );
    }

   @api checkValidity(){
    try{
    console.log('inside functionss');
    const allValid1value  = this.template.querySelector('.fup').value;
    const allValid1  = this.template.querySelector('.fup');
    if(!allValid1value){
        allValid1.setCustomValidity("This Field is Required");
        allValid1.reportValidity();
        return true;

    }else{
        console.log('pass');
        return false;

    }
    

    }catch(error){
        console.log('error',error);

    }

  }


}