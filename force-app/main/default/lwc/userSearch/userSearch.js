import { LightningElement, api, track } from "lwc";
import getResults from "@salesforce/apex/UserSearchController.getUsers";

//import UserSearchLabel from "@salesforce/label/c.UserSearchLabel";

export default class UserSearch extends LightningElement {
  @api objectName = "User";
  @api fieldName = "Name";
  @api selectRecordId = "";
  @api selectRecordName;
  @api Label;
  @api searchRecords = [];
  @api required = false;
  @api iconName = "standard:user";
  @api LoadingText = false;
  @track txtclassname =
    "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
  @track messageFlag = false;
  @track iconFlag = true;
  @track clearIconFlag = false;
  @track inputReadOnly = false;
  userLabel = 'User';
  title = 'Select User';
  searchField(event) {
    const currentText = event.target.value;
    this.LoadingText = true;

    getResults({ searchKeyWord: currentText })
      .then((response) => {
        this.searchRecords = response;
        this.LoadingText = false;

        this.txtclassname =
          response.length > 0
            ? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
            : "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
        if (currentText.length > 0 && response.length == 0) {
          this.messageFlag = true;
        } else {
          this.messageFlag = false;
        }

        if (this.selectRecordId != null && this.selectRecordId.length > 0) {
          this.iconFlag = false;
          this.clearIconFlag = true;
        } else {
          this.iconFlag = true;
          this.clearIconFlag = false;
        }
      })
      .catch((error) => {
        console.log("-------error-------------" + error);
      });
  }

  setSelectedRecord(event) {
    const currentRecId = event.currentTarget.dataset.id;
    const selectName = event.currentTarget.dataset.name;

    this.txtclassname =
      "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
    this.iconFlag = false;
    this.clearIconFlag = true;
    this.selectRecordName = event.currentTarget.dataset.name;

    this.selectRecordId = currentRecId;
    this.inputReadOnly = true;

    const selectedEvent = new CustomEvent("selected", {
      detail: { selectName, currentRecId },
    });
    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
  }
  @api
  resetData(_event) {
    this.selectRecordName = "";
    this.selectRecordId = "";
    this.inputReadOnly = false;
    this.iconFlag = true;
    this.clearIconFlag = false;
    let currentRecId = this.selectRecordName;
    let selectName = this.selectRecordId;

    const selectedEvent = new CustomEvent("selected", {
      detail: { selectName, currentRecId },
    });

    // Dispatches the event.
    this.dispatchEvent(selectedEvent);
  }
}
