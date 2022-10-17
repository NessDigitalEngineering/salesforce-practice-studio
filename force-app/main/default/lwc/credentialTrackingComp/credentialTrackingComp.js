import { LightningElement, track, wire, api } from 'lwc';
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import STATUS from "@salesforce/schema/User_Credential__c.Status__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getUserCredentials from "@salesforce/apex/CredentialTrackingController.getUserCredentials";
import updateUserCredential from "@salesforce/apex/CredentialTrackingController.updateUserCredential";
import USER_ID from "@salesforce/user/Id";
import CompTitle from "@salesforce/label/c.CredentialTracking_Title";
import EmptyMsg from "@salesforce/label/c.CredentailAssignment_EmptyMsg";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import Voucher_Preparation from "@salesforce/label/c.Voucher_Preparation";
import Voucher_ExamDate from "@salesforce/label/c.Voucher_ExamDate";
import Voucher_CredentialName from "@salesforce/label/c.Voucher_CredentialName";
import Voucher_Comments from "@salesforce/label/c.Voucher_Comments";
import PreparationDocs_HelpText from "@salesforce/label/c.PreparationDocs_HelpText";
import createCredExempt from '@salesforce/apex/VoucherRequestController.createCredExempt';
import methodVRC from '@salesforce/apex/VoucherRequestController.methodVRC';
import ConfirmationVoucherRequestComponent from "@salesforce/label/c.ConfirmationVoucherRequestComponent";
import VoucherRequestDoYouNeedVoucher from "@salesforce/label/c.VoucherRequestDoYouNeedVoucher";
import CredentialExamAttemptVoucherRequest from "@salesforce/label/c.CredentialExamAttemptVoucherRequest";
import FileSizeErrorLimitMessage from "@salesforce/label/c.FileSizeErrorLimitMessage";
import FilesnotselectedErrorMessage from "@salesforce/label/c.FilesnotselectedErrorMessage";
import CredentialCreatedSuccessMessage from "@salesforce/label/c.CredentialCreatedSuccessMessage";
import FileUploadSuccessFully from "@salesforce/label/c.FileUploadSuccessFully";
const MAX_FILE_SIZE = 50000000;
export default class NewCredentialComponent extends LightningElement {
    label = { CompTitle, EmptyMsg };
    userIds = USER_ID;
    title;
    Icn = TasksIcon;
    statusValuesReady = false;
    @track userCredentialsData;
    @track statusValues = [];
    @track countRec;
    @track showIcon = false;
    @track emptyRecords = true;
    @track userCredentialId;
    @track credentialValue;
    label = { Voucher_Comments, Voucher_CredentialName, Voucher_ExamDate, Voucher_Preparation, PreparationDocs_HelpText };
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
    @track credIds;

    @wire(getObjectInfo, { objectApiName: "User_Credential__c" })
    userCredentialMetadata;

    /*
        @description    :   Using wire service to get all picklist values
        @param          :   defaultRecordTypeId & STATUS
    */

    @wire(getPicklistValues, { recordTypeId: "$userCredentialMetadata.data.defaultRecordTypeId", fieldApiName: STATUS })
    picklistValues({ data, error }) {
        if (data) {
            for (const statusVal of data.values) {
                this.statusValues.push(statusVal.value);
            }
            this.statusValuesReady = true;
        }
        if (error) {
            console.log(error);
        }
    }
    /*
    @description  - this is a connected Callback method it is used to fetch details on load 
    */
    connectedCallback() {
        this.getuserDetails();
        this.processStatusValues();
    }
    /*
     this method is used to set credential name
    */
    handleCredentialName(credentialName) {

        this.credentialValue = credentialName;
    }
    /*
      @ description - this method  is used  to update status field and  to open the credential Exam Attempt Maodal. 
      @param - event
    **/
    handleClick(event) {
       try{
        let credName = event.target.name;
        let credId = event.target.value;
        this.credIds = event.target.value;
        let credStatus = event.target.title;
        console.log('cred status :', credStatus);
        console.log('StatusValueReady:',this.statusValuesReady);
       if (credStatus == "Ready") {
            console.log('insides clicks:');
            this.handleCredentialName(credName);
            this.handleCredentialId(credId);
            this.filesData = [];
            this.Filelist = [];
           console.log('files data',this.filesData);
            this.isShowModal = true;
        } 
        else if (credStatus == "Completed" || credStatus!='Completed') {
            this.updateStatus(credId, credStatus);
            this.getuserDetails();
            this.processData(this.totalUserCredentials);
        }
        this.processStatusValues();
    }catch(error){
        console.log('error',error);
    }
    }

    /* @description - this method is used to set user credentials data 
       @param - data
    */

    processData(data) {
        this.countRec = data.length;
        if (data.length === 0) {
            this.showIcon = true;
            this.emptyRecords = false;
        }
        this.userCredentialsData = data;
        if (this.countRec > 0) {
            this.title = " My Assignments" + " (" + data.length + ")";
        } else {
            this.title = " My Assignments";
        }
    }

    /* @ Description - this method is used fetch user credential details */
    getuserDetails() {
        getUserCredentials({ userId: this.userIds })
            .then((res) => {
                this.totalUserCredentials = res;
                this.processStatusValues();
            })
            .catch((error) => {
                console.log("error" + JSON.stringify(error));
            });
    }
    /* 
     @Description - This Method is used to manage  status values.
    
     */
    processStatusValues() {
        if (this.statusValuesReady) {
            this.totalUserCredentials.forEach((e) => {
                if (e.Status__c && e.Status__c != "Completed") {
                    e.nextStatusLbl = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1] + " >";
                    e.nextStatus = this.statusValues[this.statusValues.indexOf("" + e.Status__c) + 1];
                    e.credentialName = e.Credential__r.Name;
                }
            });
            this.processData(this.totalUserCredentials);
        } else {
            this._interval = setInterval(() => {
                this.processStatusValues();
                clearInterval(this._interval);
            }, 0);
        }
    }
    /*
     @Description - this method is used to update status  on user credentials
     @param - record Id , status
     */
    updateStatus(recordId, status) {
        updateUserCredential({ id: recordId, status: status })
            .then((result) => {
                console.log('result', result);

            })
            .catch((error) => {
                console.log('error', error);

            })
    }
    /*
    @Description - This method is used to set credential Id
    @param - credentialId
     */
    handleCredentialId(credentialId) {
        this.userCredentialId = credentialId;
    }

    /*
     @Description - This method is used get date from user
     @param - Event
     */
    handleDateChange(event) {
        this.examDate = event.target.value;
        console.log("date---" + this.examDate);
        console.log("this.userCredentialId---" + this.userCredentialId);
    }
    /* 
           @description  handleCommentChange this is a function which is used to comments from user  ;
         @param - Standard Event
        */

    handleCommentChange(event) {
        this.examComments = event.target.value;
        console.log("comments---" + this.examComments);
    }
    /* 
          @description  handleFileUpload this is a function which is used to get files data  from user  ;
               @param - Standard Event
        */
    handleFileUpload(event) {
      
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
    /* 
          @description - saveNewRecord this is a function which is used to  send the data in apex classes   ;
             @param-  Did'nt recieve any parameter
        */
    saveNewRecord() {
      
        this.Filelist.push(JSON.stringify(this.filesData));
    
        
        console.log('New FileData:', this.Filelist);
        try {
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
                for (let hj of this.userCredentialsData) {
                    if (this.credIds == hj.Id) {
                        hj.nextStatusLbl = 'Completed';
                        hj.nextStatus = 'Completed';
                        hj.Status__c = 'Ready';
                        this.updateStatus(this.credIds, hj.Status__c);
                    }
                }
                this.showSpinner = true;
                this.isShowModal = false;
                const examAttemptFields = {
                    'sobjectType': 'Credential_Exam_Attempt__c',
                    'User_Credential__c': this.userCredentialId,
                    'Exam_Date_Time__c': this.examDate,
                    'Preparation_Comments__c': this.examComments,
                    'Status__c': this.statusValue,
                    'Proof_of_Preparation__c': true
                }
                console.log('examAttemptRec---' + JSON.stringify(examAttemptFields));

                console.log('jsonData:', JSON.stringify(this.filesData));
                createCredExempt({
                    examAttemptRec: examAttemptFields
                })
                    .then((result) => {
                        this.isShowExamModal = false;
                        console.log('result', result);
                        this.UploadFilest(result);
      //  ===================================================

                        // =======================================================
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
    /* 
          @description - saveNewRecord this is a function which is used to  send the data in apex classes   ;
             @param- recieves credential Exam RecordId
        */

    UploadFilest(Cid) {
        console.log('inside file upload');
        methodVRC({
            ParentRecId: Cid,
            filedata: this.Filelist

        })
            .then((result) => {
                this.isShowExamModal = false;
                console.log('inside uploading...', result);
                if (result == 'Success') {
                    console.log('result:',result);
                }
            })
            .catch((error) => {
                alert('error');
                console.log("error ", error);
            }).finally(() => this.showSpinner = false);
        this.displayExamDetailsModal = false;
    }
    /* 
      @description - removeReceiptImage this is used to delete the selected document files from UI   ;
         @param-  Did'nt recieve any parameter
    */
    removeReceiptImage(event) {
        let index = event.currentTarget.dataset.id;
        this.filesData.splice(index, 1);
    }
    /* 
      @description - closeModal this is used to close the modal from UI   ;
         @param-  Did'nt recieve any parameter
    */
    closeModal() {
        this.displayExamDetailsModal = false;
    }
    /* 
        @description - showModalOnNo this is used to open  the Exam Details  modal on value no from UI;
           @param-  Did'nt recieve any parameter
      */
    showModalOnNo() {
        this.statusValue = "Voucher Assigned";
        this.displayExamDetailsModal = true;
    }

    /* 
         @description - showModalOnYes this is used to open  the Exam Details  modal on value yes from UI;
            @param-  Did'nt recieve any parameter
       */
    showModalOnYes() {
        this.statusValue = "Voucher Requested";
        this.displayExamDetailsModal = true;

    }
    /* 
         @description - showExamDetailsModal this is used to open Exam details  modal from UI;
            @param-   Standard Event
       */
    showExamDetailsModal() {
        this.displayExamDetailsModal = true;
    }

    /* 
      @description - closeFirstModal this is used to close the first modal from UI   ;
         @param-   Standard Event
    */
    closeFirstModal(event) {
        this.isShowModal = false;
    }
    /* 
      @description - closeSecondModal this is used to close the second modal from UI   ;
         @param-   Standard Event
    */
    closeSecondModal(event) {
        this.displayExamDetailsModal = false;
    }

} 