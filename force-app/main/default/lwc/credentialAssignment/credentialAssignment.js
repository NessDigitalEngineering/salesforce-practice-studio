import { api, LightningElement, track, wire } from "lwc";
import getUserCredentials from "@salesforce/apex/CredentialAssignmentController.getUserCredentials";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import insertCredAssignments from "@salesforce/apex/CredentialAssignmentController.insertCredAssignments";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import HeaderTitle from "@salesforce/label/c.headerTitle";
import SelectUser from "@salesforce/label/c.Select_User";
import SelectCredentials from "@salesforce/label/c.Select_Credentials";
import ConfirmationMsg from "@salesforce/label/c.CredentailAssignment_ConfirmationMsg";
import Confirmation from "@salesforce/label/c.CredentailAssignment_Confirmation";
import EarnedCredentials from "@salesforce/label/c.Earned_Credentials";
import ListOfAssignments from "@salesforce/label/c.CredentailAssignment_ListOfAssignments";
import EmptyMsg from "@salesforce/label/c.CredentailAssignment_EmptyMsg1";
import SuccessMsg from "@salesforce/label/c.CredentailAssignment_Success";
import Cancel from "@salesforce/label/c.Cancel";
import OK from "@salesforce/label/c.OK";
import { publish, MessageContext } from "lightning/messageService";
import refreshChannel from "@salesforce/messageChannel/RefreshComponent__c";

const cols = [
	{
		type: "button-icon",
		fixedWidth: 35,
		typeAttributes: {
			iconName: "utility:delete",
			name: "deleteIcon",
			disabled: { fieldName: "deleteIcon" }
		}
	},
	{
		label: "Credential Name",
		fieldName: "credName",
		type: "text",
		hideDefaultActions: "true",
		wrapText: true,
		cellAttributes: { class: "slds-text-color_default" }
	},
	{
		label: "Assigned Date",
		fieldName: "assignedDate",
		type: "date-local",
		editable: false,
		typeAttributes: {
			day: "numeric",
			month: "numeric",
			year: "numeric"
		}
	},
	{
		label: "Due Date",
		fieldName: "dueDate",
		sortable: "true",
		type: "date-local",
		editable: { fieldName: "controlEditField" },
		typeAttributes: {
			day: "numeric",
			month: "numeric",
			year: "numeric"
		},
		cellAttributes: { class: "fa fa-pencil" }
	},
	{
		label: "Status",
		fieldName: "status",
		type: "text",
		hideDefaultActions: "true"
	}
];

export default class CredentialAssignment extends LightningElement {
	@api constant = {
		ROWACTION_DELETE: "deleteIcon",
		VAR_SUCCESS: "Success",
		DEL_CONFIRM: ConfirmationMsg
	};
	label = {
		HeaderTitle,
		SelectUser,
		SelectCredentials,
		Confirmation,
		ConfirmationMsg,
		EarnedCredentials,
		ListOfAssignments,
		EmptyMsg,
		SuccessMsg,
		Cancel,
		OK
	};
	columns = cols;
	@track selectedUserName = "";
	@track credentials;
	@track isDataAvaialable = false;
	@track saveButtonHide = false;
	@track sortBy = "dueDate";
	@track sortDirection = "asc";
	@track disableButton = false;
	icon = TasksIcon;
	@track showIcon = true;
	@track isDialogVisible = false;
	@track deleteRow;
	@track earnedCredentialsTitle = this.label.EarnedCredentials;
	assignedCreds = [];

	@wire(MessageContext)
	messageContext;

	/*
		@description: Event handler for user selection
	*/
	handleUserName(event) {
		try {
			this.selectedUserName = event.detail.currentRecId;
			console.log("userid: ", this.selectedUserName);
			if (this.selectedUserName !== "") {
				this.getdata();
			} else {
				this.template.querySelector("c-Credential-Search").resetCredentials();
				this.template.querySelector("c-Earned-Credentials").resetCredentials();
				this.credentials = [];
				this.showIcon = true;
				this.saveButtonHide = false;
				this.isDataAvaialable = false;
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	/*
		@description: Event handler for Credential selection
	*/
	handleCredential(event) {
		this.disableButton = true;
		// this.columns = cols;
		console.log("sel Recs:", JSON.stringify(event.detail.selRecords));
		try {
			if (this.selectedUserName && event.detail.selRecords) {
				this.credentials = this.assignedCreds;
				let currentSelection = event.detail.selRecords;
				for (const rec of currentSelection) {
					let tmpCredList = [];
					tmpCredList.push(...this.credentials);
					if (tmpCredList.length > 0) {
						tmpCredList.push(
							this.addCredentials(rec.recId, rec.recName, tmpCredList[tmpCredList.length - 1].dueDate)
						);
					} else {
						tmpCredList.push(this.addCredentials(rec.recId, rec.recName, null));
					}
					this.credentials = tmpCredList;
				}
				this.sortCaseData("dueDate", "asc");
				this.isDataAvaialable = true;
				this.showIcon = false;
			} else {
				this.isDataAvaialable = false;
				this.showIcon = true;
				this.saveButtonHide = false;
			}
		} catch (error) {
			console.error(error.message);
		}
	}

	/*
		@description: Method to add selected Credentials to the datatable
		@param credId: Credential record id
		@param credName: Credential Name
		@param previousCredDate: Due date of previous credential
	*/
	addCredentials(credId, credName, previousCredDate) {
		try {
			let lastCred = {};
			let credRec = {};
			credRec.credName = credName;
			credRec.credId = credId;
			credRec.dueDate =
				previousCredDate === null ? this.addDaysToDate(null) : this.addDaysToDate(previousCredDate);
			credRec.assigneId = this.selectedUserName;
			credRec.assignedDate = new Date();
			credRec.deleteIcon = false;
			credRec.controlEditField = true;
			credRec.status = "";
			this.saveButtonHide = true;
			this.disableButton = false;

			return credRec;
		} catch (error) {
			console.error(error.message);
		}
	}

	/*
		@description: Method to add days to due date
		@param dt: Duedate of previous record
		@return: date in ISO8061 format 
	*/
	addDaysToDate(dt) {
		console.log("dt:", dt);
		// eslint-disable-next-line no-useless-catch
		try {
			let date;
			if (dt === null) {
				date = new Date();
				date.setDate(date.getDate() + 90);
			} else {
				date = new Date(dt);
				date.setDate(date.getDate() + 90);
				console.log("date:", date);
			}
			return date.toISOString();
		} catch (error) {
			console.error(error.message);
		}
	}

	/*
		@description: Event handler to handle delete in datatable row
	*/
	handleDelete(event) {
		this.isDialogVisible = true;
		this.deleteRow = event;
	}

	/*
		@description: Method to seggregate delete action
	*/
	deleteRecord() {
		try {
			const action = this.deleteRow.detail.action.name;
			if (action !== "" && action === this.constant.ROWACTION_DELETE) {
				this.rowactionDelete(this.deleteRow);
			}
		} catch (errorMsg) {
			console.log("error msg" + errorMsg);
		}
	}

	/*
		@description: Method to delete row and change due date accordingly
	*/
	rowactionDelete(event) {
		let tmpList = [];
		let updatedList = [];
		tmpList.push(...this.credentials);
		updatedList.push(...this.credentials);
		if (this.constant.DEL_CONFIRM) {
			// eslint-disable-next-line guard-for-in
			for (let cred in tmpList) {
				if (tmpList[cred].credName === event.detail.row.credName && tmpList[cred].status === "") {
					updatedList.splice(cred, 1);
					this.credentials = updatedList;
					this.isDialogVisible = false;
					this.template.querySelector("c-Credential-Search").removeCredentials(tmpList[cred].credName);
				} else if (tmpList[cred].status === "") {
					let index = updatedList.findIndex((x) => x.credName === tmpList[cred].credName);
					updatedList.splice(
						index,
						1,
						this.addCredentials(
							tmpList[cred].credId,
							tmpList[cred].credName,
							index > 0 ? updatedList[index - 1].dueDate : null
						)
					);

					this.credentials = updatedList;
				}
			}
		}
	}

	/*
		@description: Life cycle hook. Setting css for inner elements of datatable
	*/
	renderedCallback() {
		try {
			const style = document.createElement("style");
			style.innerText = `c-credential-assignment .slds-table_header-fixed_container {
	      background-color: white;
	  }`;
			this.template.querySelector("lightning-datatable").appendChild(style);
		} catch (error) {
			console.log(JSON.stringify(error));
		}
	}

	/*
		@description: Method used to get the Credentials for selected user
	*/
	getdata() {
		getUserCredentials({ userId: this.selectedUserName })
			.then((response) => {
				let tempResponse = [];
				let tempObject = {};

				if (response) {
					for (const res of response) {
						tempObject = { ...res };
						tempObject.controlEditField = false;
						tempObject.deleteIcon = true;
						this.saveButtonHide = true;
						this.disableButton = true;
						tempResponse.unshift(tempObject);
					}
				}
				this.credentials = tempResponse;
				this.sortCaseData("dueDate", "asc");
				this.assignedCreds = this.credentials;
				console.log("credentials:", JSON.stringify(this.credentials));
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

	/*
		@description: Onclick event handler for Save button, responsible to insert user credentials selected on UI
	*/
	handleClick(event) {
		console.log("final values:", JSON.stringify(this.credentials));
		insertCredAssignments({ credAssignmentList: this.credentials })
			.then((result) => {
				let tempResponse = [];
				let tempObject = {};
				for (const res of this.credentials) {
					tempObject = { ...res };

					if (res.status == "") {
						res.status = "Assigned";
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
				this.sortCaseData("dueDate", "asc");
				this.assignedCreds = this.credentials;
				this.dispatchEvent(
					new ShowToastEvent({
						message: this.label.SuccessMsg,
						variant: this.constant.VAR_SUCCESS
					})
				);
				let payload = { refresh: true, userId: this.selectedUserName };
				publish(this.messageContext, refreshChannel, payload);
				this.template.querySelector("c-Credential-Search").resetCredentials();

				this.disableButton = true;
			})

			.catch((error) => {
				console.log("Errorured:- " + error.body.message);
			});
	}

	/*
		@description: Event handler to sort rows in datatable
	*/
	handleSortCaseData(event) {
		this.sortBy = event.detail.fieldName;
		this.sortDirection = event.detail.sortDirection;
		this.sortCaseData(this.sortBy, this.sortDirection);
	}

	/*
		@description: Method responsible to sort the rows of datatable
	*/
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

	/*
		@description: Method responsible to close the confirmation modal
	*/
	closeModal() {
		this.isDialogVisible = false;
	}

	/*
		@description: Event handler to set the title for Earned Credentials lightning card
	*/
	handleTitle(event) {
		console.log("title is:", event.detail);
		this.earnedCredentialsTitle = event.detail;
	}

	/*
		@description: Event handler to detect changes in datatable row cells
	*/
	handleCellChange(event) {
		console.log("draft values:", JSON.stringify(event.detail.draftValues[0]));
		let draftValue = event.detail.draftValues[0];
		let tmpCreds = [];
		tmpCreds = [...this.credentials];
		for (const cred of tmpCreds) {
			if (cred.credName === draftValue.credName) {
				cred.dueDate = draftValue.dueDate;
			}
		}
		this.credentials = tmpCreds;
	}
}
