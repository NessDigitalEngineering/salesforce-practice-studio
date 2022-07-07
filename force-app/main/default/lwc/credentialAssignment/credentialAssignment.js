import { api, LightningElement, track } from "lwc";
import getUserCredentials from "@salesforce/apex/CredentialAssignmentController.getUserCredentials";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import insertCredAssignments from "@salesforce/apex/CredentialAssignmentController.insertCredAssignments";
import { loadStyle } from "lightning/platformResourceLoader";
import REMOVEROW from "@salesforce/resourceUrl/removeRow";

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
  headerTitle = 'Credential Assignment';
  title = 'List of Assignments';
  wiredRecords;
  refreshTable;
  myMap = {};
  @track sortBy;
  @track sortDirection;
  handleUserName(event) {
    this.selectedUserName = event.detail.currentRecId;
    this.handleCredential(event);
  }

  handleCredential(event) {
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
    } else {
      this.template.querySelector("c-Credential-Search").resetCredentials();
      this.selectedCredentials = tempSelectRecords;
      this.isDataAvaialable = false;
    }

    if (this.selectedUserName != "") {
      this.getdata();
    }
  }
  handleDelete(event) {
    try {
      const action = event.detail.action.name;

      //check for save or delete action

      if (action != "" && action == this.constant.ROWACTION_DELETE) {
        this.rowactionDelete(event);
      }
    } catch (errorMsg) {
      console.log("error msg" + errorMsg);
    }
  }
  rowactionDelete(event) {
    //confirm to delete & invoke deleteRecord()

    if (window.confirm(this.constant.DEL_CONFIRM)) {
      for (let cred in this.credentials) {
        if (this.credentials[cred].credName === event.detail.row.credName){
          if(this.credentials[cred].status == ""){
          this.saveButtonHide = true;
          this.template
            .querySelector("c-Credential-Search")
            .removeCredentials(this.credentials[cred].credName);
          this.credentials.splice(cred, 1);
          }
        }
      }

      let tempResponse = [];
      let tempObject = {};
      this.saveButtonHide = false;
      if (this.credentials) {
        for (const res of this.credentials) {
          tempObject = { ...res };
          tempResponse.push(tempObject);
          tempObject = {};
          
        }
      }

      this.credentials = tempResponse;
      this.removeCredentials = this.credentials;
      if (this.credentials.length == 0) {
          this.isDataAvaialable = false;
      }
    }
  }
  renderedCallback() {
    Promise.all([
      // loadStyle( this, REMOVEROW)

      loadStyle(this, REMOVEROW),
    ])
      .then(() => {
        console.log("Files loaded");
      })
      .catch((error) => {
        console.log("error", error);
      });
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
            } else {
              tempObject.controlEditField = false;
              tempObject.deleteIcon = true;

              this.saveButtonHide = false;
            }

            tempResponse.unshift(tempObject);
          }
        }

        this.credentials = tempResponse;
        if (this.credentials.length > 0) {
          this.isDataAvaialable = true;
        } else {
          this.isDataAvaialable = false;
         }
      })
      .catch((error) => {
        console.log("error msg", error);
      });
  }

  handleClick(event) {
    insertCredAssignments({ credAssignmentList: this.credentials })
      .then((_result) => {

       this.dispatchEvent(
          new ShowToastEvent({
            //title: this.constant.VAR_SUCCESS,


            message: this.constant.MSG_UPD,

            variant: this.constant.VAR_SUCCESS,
          })
        );

        this.credentials = [];

        this.template.querySelector("c-Credential-Search").resetCredentials();
        this.template.querySelector("c-User-Search").resetData();

        this.selectedCredentials = [];

        this.isDataAvaialable = false;

      })

      .catch((error) => {
        console.log("Errorured:- " + error.body.message);
      });

    this.draftValues = event.detail.draftValues;
    this.draftValues = [];

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

}
