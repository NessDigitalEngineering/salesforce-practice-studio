import { LightningElement, api, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import Voucher_Preparation from "@salesforce/label/c.Voucher_Preparation";
import Voucher_ExamDate from "@salesforce/label/c.Voucher_ExamDate";
import Voucher_CredentialName from "@salesforce/label/c.Voucher_CredentialName";
import Voucher_Comments from "@salesforce/label/c.Voucher_Comments";
import PreparationDocs_HelpText from "@salesforce/label/c.PreparationDocs_HelpText";
import getExamDetails from '@salesforce/apex/ExamScheduleController.getExamDetails';
import ConfirmationVoucherRequestComponent from "@salesforce/label/c.ConfirmationVoucherRequestComponent";
import VoucherRequestDoYouNeedVoucher from "@salesforce/label/c.VoucherRequestDoYouNeedVoucher";
//import ConfirmationVoucherRequestDoYouNeedVoucherVoucherRequestComponent  from "@salesforce/label/c.ConfirmationVoucherRequestDoYouNeedVoucherVoucherRequestComponent";
import CredentialExamAttemptVoucherRequest from "@salesforce/label/c.CredentialExamAttemptVoucherRequest";
import FileSizeErrorLimitMessage from "@salesforce/label/c.FileSizeErrorLimitMessage";
import FilesnotselectedErrorMessage from "@salesforce/label/c.FilesnotselectedErrorMessage";
import CredentialCreatedSuccessMessage from "@salesforce/label/c.CredentialCreatedSuccessMessage";
import FileUploadSuccessFully from "@salesforce/label/c.FileUploadSuccessFully";
import { CloseActionScreenEvent } from 'lightning/actions';
const MAX_FILE_SIZE = 50000000;
import UpdateCredExempt from '@salesforce/apex/ExamScheduleController.UpdateCredExempt';
import UploadReciept from '@salesforce/apex/ExamScheduleController.UploadReciept';
export default class VoucherRequest extends LightningElement {
    label = { Voucher_Comments, Voucher_CredentialName, Voucher_ExamDate, Voucher_Preparation, PreparationDocs_HelpText };
    @api examid;
    @track examRecordId;

    connectedCallback() {
        this.examRecordId = this.examid;
        console.log('examId',this.examid);
        console.log('examRecordId:' ,this.examRecordId);


    }



    //  @api recordId;
    @track examDate;
    @track credentialValue;
    @track userCredentialId;
    @track examComments;
    @track status;
    @track fileData;
    fileNames = [];
    fileContentsArray = [];
    file;
    fileName = '';
    fileReader;
    content;
    fileContents;
    @track statusValue;
    @track displayExamDetailsModal = false;
    @track isShowModal = false;
    @api recordId;
    @track filesData = [];
    showSpinner = false;
    @track credId;
    @track confirm = ConfirmationVoucherRequestComponent;
    @track DoYouNeedVoucher = VoucherRequestDoYouNeedVoucher;
    @track CredentialExamAttempt = CredentialExamAttemptVoucherRequest;
    @track VoucherExamDate = Voucher_ExamDate;
    @track filelimitError = FileSizeErrorLimitMessage;
    @track fileNotSelect = FilesnotselectedErrorMessage;
    @track sucessmsg = CredentialCreatedSuccessMessage;
    @track fileUploadMsg = FileUploadSuccessFully;
    @track Filelist = [];
    @track credentialName;
    @track ExamId;

    @wire(getExamDetails, { examId: '$examRecordId' })
    WiredExamData(result) {
         console.log('Function Executed;--');
        if (result.data) {
           console.log('result',result.data);
            this.ExamId = result.data.ExamId;
            this.credentialName = result.data.credentialId;

        }
        else {
            console.log('error', result.error);

        }

    }


    @api handleCredentialName(credentialName) {

        this.credentialValue = credentialName;
    }



    handleDateChange(event) {
        this.examDate = event.target.value;
        console.log("date---" + this.examDate);

    }

    handleCommentChange(event) {
        this.examComments = event.target.value;
        console.log("comments---" + this.examComments);
    }

    handleFileUpload(event) {
        var obj = {};
        if (event.target.files.length > 0) {
            for (let x of event.target.files) {
                if (x.size > MAX_FILE_SIZE) {
                    this.showToast('Error!', 'error', this.filelimitError);
                    return;
                }
                let file = x;
                let reader = new FileReader();
                reader.onload = e => {
                    let fileContents = reader.result.split(',')[1]
                    this.filesData.push({ 'fileName': file.name, 'fileContent': fileContents });
                };
                reader.readAsDataURL(file);
            }
        }

        console.log('files data :', this.filesData);
    }
    saveNewRecord() {
        this.Filelist.push(JSON.stringify(this.filesData));
        console.log('New FileData:', this.Filelist);
        try {
            //validate
            const allValid = [
                ...this.template.querySelectorAll('.validate'),
            ].reduce((validSoFar, inputCmp) => {
                inputCmp.reportValidity();
                return validSoFar && inputCmp.checkValidity();
            }, true);
            if (!allValid) {

                console.log('Errors when a user didnt put value');
            }
            else {

                if (this.filesData == [] || this.filesData.length == 0) {
                    this.showToast('Error', 'error', this.fileNotSelect); return;
                }
                this.showSpinner = true;
                this.isShowModal = false;
                const examAttemptFields = {
                    'sobjectType': 'Credential_Exam_Attempt__c',
                    'Exam_Date_Time__c': this.examDate,
                    'Id': this.examRecordId,
                    'Status__c': 'Exam Scheduled'

                }
                console.log('examAttemptRec---' + JSON.stringify(examAttemptFields));

                console.log('jsonData:', JSON.stringify(this.filesData));
                UpdateCredExempt({
                    examAttemptRec: examAttemptFields
                })
                    .then((result) => {

                        console.log('result', result);
                        this.UploadFilest(result);
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: "Success",
                                variant: "success",
                                message: this.sucessmsg
                            })
                        );
                    }).catch((error) => {
                        console.log('Error', error);
                    })
            }
        } catch (error) {
            console.log('error', error);

        }
    }

    UploadFilest(Cid) {
        console.log('inside file upload');
        UploadReciept({
            ParentId: Cid,
            filedata: this.Filelist

        })
            .then((result) => {
                console.log('inside uploading...', result);
                if (result == 'success') {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: "Success",
                            variant: "success",
                            message: this.fileUploadMsg
                        })
                    );
                    this.isShowModal = false;
                }
            })
            .catch((error) => {
                alert('error');
                console.log("error ", error);
            }).finally(() => this.showSpinner = false);
        this.displayExamDetailsModal = false;
    }
    removeReceiptImage(event) {
        let index = event.currentTarget.dataset.id;
        this.filesData.splice(index, 1);
    }

    closeQuickAction() {
        this.dispatchEvent(new CloseActionScreenEvent());
    }
}