import { LightningElement, api, track } from "lwc";
import getResults from "@salesforce/apex/UserSearchController.getUsers";

export default class UserSearch extends LightningElement {
	@track txtclassname = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
	@track clearIconFlag = false;
	@track inputReadOnly = false;
	@track searchRecords = [];
	@track selectRecordName;
	@track selectRecordId = "";
	@track required = false;

	iconName = "standard:user";

	/*
    description: onchange event handler, gets all the users as per the search key.
  */
	searchField(event) {
		const currentText = event.target.value;

		getResults({ searchKeyWord: currentText })
			.then((response) => {
				this.searchRecords = response;

				this.txtclassname =
					response.length > 0
						? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open"
						: "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";

				if (this.selectRecordId != null && this.selectRecordId.length > 0) {
					this.clearIconFlag = true;
				} else {
					this.clearIconFlag = false;
				}
			})
			.catch((error) => {
				console.log("-------error-------------" + error);
			});
	}

	/*
    description: handler for onclick event, stores the selected user form drop down.
  */
	setSelectedRecord(event) {
		const currentRecId = event.currentTarget.dataset.id;
		const selectName = event.currentTarget.dataset.name;

		this.txtclassname = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
		this.clearIconFlag = true;
		this.selectRecordName = event.currentTarget.dataset.name;

		this.selectRecordId = currentRecId;
		this.inputReadOnly = true;

		const selectedEvent = new CustomEvent("selected", {
			detail: { selectName, currentRecId }
		});
		this.dispatchEvent(selectedEvent);
	}

	/*
    description: Custom event handler to reset the component.
  */
	@api
	resetData(event) {
		this.selectRecordName = "";
		this.selectRecordId = "";
		this.inputReadOnly = false;
		this.clearIconFlag = false;
		let currentRecId = this.selectRecordName;
		let selectName = this.selectRecordId;

		const selectedEvent = new CustomEvent("selected", {
			detail: { selectName, currentRecId }
		});

		this.dispatchEvent(selectedEvent);
	}
}
