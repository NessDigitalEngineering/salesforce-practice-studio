import { api, LightningElement, track } from "lwc";
import getUserCredentials from "@salesforce/apex/CredentialAssignmentController.getUserCredentials";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import insertCredAssignments from "@salesforce/apex/CredentialAssignmentController.insertCredAssignments";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import headerTitle from "@salesforce/label/c.headerTitle";
const cols = [
  {
    type: "button-icon",
    fixedWidth: 35,
    typeAttributes: {
      iconName: "utility:delete",
      name: "deleteIcon",
      disabled: { fieldName: "deleteIcon" },
    },
  },
  {
    label: "Credential Name",
    fieldName: "credName",
    type: "text",
    hideDefaultActions: "true",
    wrapText: true,
    cellAttributes: { class: "slds-text-color_default" },
  },
  {
    label: "Assigned Date",
    fieldName: "assignedDate",
    type: "date-local",
    editable: false,
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    },
  },
  {
    label: "Due Date",
    fieldName: "dueData",
    sortable: "true",
    type: "date-local",
    editable: { fieldName: "controlEditField" },
    typeAttributes: {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    },
    cellAttributes:{ class: "fa fa-pencil" },
    
  },
  {
    label: "Status",
    fieldName: "status",
    type: "text",
    hideDefaultActions: "true",
  },
];

export default class CredentialAssignment extends LightningElement {
  @api constant = {
    ERROR_TITLE: "Error Found",
    ROWACTION_DELETE: "deleteIcon",
    VAR_SUCCESS: "Success",
    ROWACTION_SAVE: "save",
    VAR_ERROR: "error",
    MSG_DELETE: "Record Deleted",
    MSG_ERR_DEL: "Error deleting record",
    MSG_ERR_UPD_RELOAD: "Error updating or reloading record",
    MSG_UPD: "Credential(s) Successfully Assigned.",
    DEL_CONFIRM: "Are you sure you want to delete this item ?",
    MODE_BATCH: "batch",
    MODE_SINGLE: "single",
  };
  @track columns;
  @api removeCredentials;
  @api selectedUserName = "";
  @track credentials;
  @track selectedCredentials;
  @track isDataAvaialable = false;
  @track saveButtonHide = false;
  draftValues = [];
  headerTitle = headerTitle;
  title = 'List of Assignments';
  wiredRecords;
  refreshTable;
  myMap = {};
  @track sortBy;
  @track sortDirection;
  @track disableButton = false;
  icon = TasksIcon;
  @track showIcon = true;
  @track isDialogVisible = false;
  @track deleteRow;
  confirmMessage= 'Are you sure you want to delete this item ?';
  conf = 'Confirmation';
  defaultMessage = 'Nothing needs your attention right now. Check back later.';
  dataTableStyle=false;
  @track earnedCredentialsTitle = "Earned Credentials";

  handleUserName(event) {
    this.selectedUserName = event.detail.currentRecId;
    this.handleCredential(event);
  }

  handleCredential(event) {
    this.disableButton = true;
    this.columns = cols;
    let tempSelectRecords = [];
    this.myMap = {};
    if (this.selectedUserName && event.detail.selRecords) {
      for (const rec of event.detail.selRecords) {
        tempSelectRecords.push(rec.recId);
        this.myMap[rec.recId] = rec.recName;
      }
      this.selectedCredentials = tempSelectRecords;
      this.isDataAvaialable = true;
      this.showIcon = false;
      
    } else {
      this.template.querySelector("c-Credential-Search").resetCredentials();
      this.template.querySelector("c-Earned-Credentials").resetCredentials();
      this.selectedCredentials = tempSelectRecords;
      
      this.isDataAvaialable = false;
      this.saveButtonHide = false;
      this.showIcon = true;
      
    }

    if (this.selectedUserName != "") {
      this.getdata();
    }
  }
  handleDelete(event) {
    this.isDialogVisible = true;
    this.deleteRow = event;

  }
  deleteRecord(){
    try {
      const action = this.deleteRow.detail.action.name;
      //check for save or delete action

      if (action != "" && action == this.constant.ROWACTION_DELETE) {
        this.rowactionDelete(this.deleteRow);
        }
    } catch (errorMsg) {
      console.log("error msg" + errorMsg);
    }
  }
  rowactionDelete(event) {
    //confirm to delete & invoke deleteRecord()
   if (this.constant.DEL_CONFIRM) {
      for (let cred in this.credentials) {
        if (this.credentials[cred].credName === event.detail.row.credName && 
          this.credentials[cred].status == "" ) {
           this.template
            .querySelector("c-Credential-Search")
            .removeCredentials(this.credentials[cred].credName);
          this.credentials.splice(cred, 1);
          
        }
      }

      let tempResponse = [];
      let tempObject = {};
      this.disableButton = true;
      this.myMap = {};
        for (const res of this.credentials) {
          tempObject = { ...res };
          tempResponse.push(tempObject);
          tempObject = {};
        if(res.status == ""){
            this.saveButtonHide = true;
            this.disableButton = false;
          }
          
        }
      this.isDialogVisible = false;
      this.credentials = tempResponse;
      this.removeCredentials = this.credentials;
      if (this.credentials.length == 0) {
          this.isDataAvaialable = false;
          this.showIcon = true;
          
      }
    }
  }
  renderedCallback() {
    try {
      const style = document.createElement('style');
      style.innerText = `c-credential-assignment .slds-table_header-fixed_container {
          background-color: white;
      }`;
      this.template.querySelector('lightning-datatable').appendChild(style);

    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }
  getdata() {
    getUserCredentials({ credmap: this.myMap, userId: this.selectedUserName })
      .then((response) => {
        let tempResponse = [];
        let tempObject = {};

        if (response) {
          for (const res of response) {
            tempObject = { ...res };

            if (res.status == "") {
              tempObject.controlEditField = true;
              tempObject.deleteIcon = false;
              this.saveButtonHide = true;
              this.disableButton = false;
            } else {
              tempObject.controlEditField = false;
              tempObject.deleteIcon = true;

              this.saveButtonHide = true;
              this.disableButton = true;
            }

            tempResponse.unshift(tempObject);
          }
        }

        this.credentials = tempResponse;
        if (this.credentials.length > 0) {
          this.isDataAvaialable = true;
          this.showIcon = false;
        } else {
          this.isDataAvaialable = false;
          this.showIcon = true;
         }
      })
      .catch((error) => {
        console.log("error msg", error);
      });
  }

  handleClick(event) {
    insertCredAssignments({ credAssignmentList: this.credentials })
      .then((_result) => {
        let tempResponse = [];
        let tempObject = {};
        for (const res of this.credentials) {
              tempObject = { ...res };

            if (res.status == "") {
              res.status = 'Assigned';
              tempObject = { ...res };
              tempResponse.push(tempObject);
              tempObject.controlEditField = false;
              tempObject.deleteIcon = true;

              this.saveButtonHide = true;
              this.disableButton = true;
            } else {
              tempResponse.push(tempObject);
              tempObject.controlEditField = false;
              tempObject.deleteIcon = true;

              this.saveButtonHide = true;
              this.disableButton = true;
            }

          }
        
        this.credentials = tempResponse;
        this.dispatchEvent(
          new ShowToastEvent({
           message: this.constant.MSG_UPD,

            variant: this.constant.VAR_SUCCESS,
          })
        );

     this.template.querySelector("c-Credential-Search").resetCredentials();

     this.disableButton = true;
     })

      .catch((error) => {
        console.log("Errorured:- " + error.body.message);
      });

    this.draftValues = event.detail.draftValues;
  }
  handleSortCaseData(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortCaseData(this.sortBy, this.sortDirection);
  }

  sortCaseData(fieldname, direction) {
    let parseData = JSON.parse(JSON.stringify(this.credentials));
    // Return the value stored in the field
    let keyValue = (a) => {
      return a[fieldname];
    };
    // cheking reverse direction
    let isReverse = direction === "asc" ? 1 : -1;
    // sorting data
    parseData.sort((x, y) => {
      x = keyValue(x) ? keyValue(x) : ""; // handling null values
      y = keyValue(y) ? keyValue(y) : "";
      // sorting values based on direction
      return isReverse * ((x > y) - (y > x));
    });
    this.credentials = parseData;
  }
  closeModal(){
    this.isDialogVisible = false;
  }

  handleTitle(event){
    console.log('title is:',event.detail);
    this.earnedCredentialsTitle = event.detail;
  }

}
