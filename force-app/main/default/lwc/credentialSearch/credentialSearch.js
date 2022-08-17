import { LightningElement, api, track } from "lwc";
import getResults from "@salesforce/apex/CredentialSearchController.getCredentials";

// eslint-disable-next-line @lwc/lwc/no-leading-uppercase-api-name
export default class CredentialSearch extends LightningElement {
	@track searchRecords = [];
	@track selectedRecords = [];
	@track iconName;
	@track txtclassname = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
	@api selecteduser = "";

	/*
    description: onchange event handler, gets credentials.
  	*/
	searchField(event) {
		const currentText = event.target.value;
		const selectRecId = [];

		for (const selRec of this.selectedRecords) {
			selectRecId.push(selRec.recId);
		}

		getResults({
			searchKey: currentText,
			selectedRecId: selectRecId,
			userId: this.selecteduser
		})
			.then((result) => {
				this.searchRecords = result;
				this.txtclassname =
					result.length > 0
						? "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open "
						: "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ";

				this.dispatchEvent(new CustomEvent("credentialsevent", { detail: selectRecId }));
			})
			.catch((error) => {
				console.log("-------error-------------" + JSON.stringify(error));
			});
	}

	/*
    description: onclick event handler, selects the credential from dropdown
  	*/
	setSelectedRecord(event) {
		const recId = event.currentTarget.dataset.id;
		const selectName = event.currentTarget.dataset.name;
		const iconName = event.currentTarget.dataset.icon;

		let newsObject = { recId: recId, recName: selectName, recIcon: iconName };

		this.selectedRecords.push(newsObject);
		this.txtclassname = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click ";
		let selRecords = this.selectedRecords;

		this.template.querySelectorAll("lightning-input").forEach((each) => {
			each.value = "";
		});
		const selectedEvent = new CustomEvent("selected", {
			detail: { selRecords, selectName }
		});
		// Dispatches the event.
		this.dispatchEvent(selectedEvent);
	}

	/*
    description: onremove event handler, removes the selected credentials from pill cmp
  	*/
	removeRecord(event) {
		let selectRecId = [];

		for (const selRec of this.selectedRecords) {
			if (event.detail.name !== selRec.recId) {
				selectRecId.push(selRec);
			}
		}

		this.selectedRecords = [...selectRecId];
		let selRecords = this.selectedRecords;
		const selectedEvent = new CustomEvent("selected", {
			detail: { selRecords }
		});
		// Dispatches the event.
		this.dispatchEvent(selectedEvent);
	}

	/*
    description: Method called from credentialAssignment cmp when the record is removed from datatable
  	*/
	@api
	removeCredentials(assignments) {
		for (const selRec of this.selectedRecords) {
			if (assignments == selRec.recName) {
				const index = this.selectedRecords.indexOf(selRec);
				if (index > -1) {
					this.selectedRecords.splice(index, 1); // 2nd parameter means remove one item only
				}
			}
		}
	}

	/*
    description: Method called from credentialAssignment cmp when the user is unselected
  	*/
	@api
	resetCredentials() {
		this.selectedRecords = [];
		this.searchRecords = [];
		this.template.querySelector('lightning-input[data-name="searchText"]').value = null;
		this.txtclassname = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";
	}
}
