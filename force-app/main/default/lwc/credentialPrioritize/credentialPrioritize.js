import { LightningElement, track } from "lwc";
import getRecords from "@salesforce/apex/CredentialPrioritizeController.getRecords";
import updatePriority from "@salesforce/apex/CredentialPrioritizeController.updatePriority";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import successMsg from "@salesforce/label/c.CredentialPrioritySuccess";
import title from "@salesforce/label/c.CredentialPriorityTitle";
import priorityColName from "@salesforce/label/c.CredentialPriorityCol";
import credentialName from "@salesforce/label/c.CredentialPriorityName";

export default class CredentialPrioritize extends LightningElement {
	@track dragStartItem;
	@track elementList = [];
	@track index = 0;
	@track isPriorityChanged = false;
	existingElementList = [];
	label = { successMsg, title, priorityColName, credentialName };
	/*
    description: getter to increment index by 1. Displayed as Priority in UI
  	*/
	get currentIndex() {
		console.log("index:", this.index);
		this.index += 1;
		return this.index;
	}

	/*
    description: Get Prioritized Credentials
  	*/
	connectedCallback() {
		getRecords({})
			.then((result) => {
				for (let i = 0; i < result.length; i++) {
					this.elementList.push(result[i]);
				}
				this.existingElementList = [...this.elementList];
			})
			.catch((error) => {
				console.log("###Error : " + error.body.message);
			});
	}

	/*
    description: drag start event on html table
  	*/
	dragStart(event) {
		this.dragStartItem = event.target.title;
		event.target.classList.add("drag");
	}

	/*
    description: drag complete event on html table
  	*/
	dragOver(event) {
		event.preventDefault();
		return false;
	}

	/*
    description: drop event on html table. Rearranging elementList as per the drop
  	*/
	drop(event) {
		event.stopPropagation();
		const dragValName = this.dragStartItem;
		const dropValName = event.target.title;
		if (dragValName === dropValName) {
			return false;
		}
		const index = dropValName;
		const currentIndex = dragValName;
		const newIndex = dropValName;
		Array.prototype.move = function (from, to) {
			this.splice(to, 0, this.splice(from, 1)[0]);
		};
		this.elementList.move(currentIndex, newIndex);
		this.resetIndex();
		this.isPriorityChanged = true;
	}

	/*
    description: add credentials searched in credentialSearch cmp to elementList
  	*/
	handleCredential(event) {
		if (event.detail.selRecords.length > 0) {
			let existingPriorityRecs = [];
			existingPriorityRecs.push(...this.elementList);
			for (const rec of event.detail.selRecords) {
				existingPriorityRecs.push(this.createNode(rec));
			}
			this.elementList = existingPriorityRecs;
			this.isPriorityChanged = true;
			this.resetIndex();
			console.log("element list:", JSON.stringify(this.elementList));
		} else {
			this.resetIndex();
			this.elementList = this.existingElementList;
		}
	}

	/*
    description: helper method to populate creds that needs to be displayed
  	*/
	createNode(rec) {
		let obj = {};
		obj.Id = rec.recId;
		obj.Name = rec.recName;
		obj.Icon__c = rec.recIcon;
		return obj;
	}

	/*
    description: event handler for cancel button click
  	*/
	handleCancel(event) {
		this.isPriorityChanged = false;
		this.elementList = [];
		this.elementList = [...this.existingElementList];
		this.resetIndex();
		this.template.querySelector("c-Credential-Search").resetCredentials();
	}

	/*
    description: event handler for Save button click. Calls apex controller to save updated Priority
  	*/
	handleSave(event) {
		let updatedPriority = [];
		for (let i = 0; i < this.elementList.length; i++) {
			let obj = {};
			obj.Id = this.elementList[i].Id;
			obj.Priority__c = i + 1;
			updatedPriority.push(obj);
		}
		if (updatedPriority.length > 0) {
			updatePriority({ recordList: JSON.stringify(updatedPriority) })
				.then((result) => {
					this.showNotification("Success", this.label.successMsg, "success");
					this.isPriorityChanged = false;
					this.resetIndex();
					this.template.querySelector("c-Credential-Search").resetCredentials();
				})
				.catch((error) => {
					console.log("###Error : " + error.body.message);
					this.showNotification("Error", error.body.message, "error");
				});
		}

		console.log("onSave:", JSON.stringify(updatedPriority));
	}

	/*
    description: helper method to reset index
  	*/
	resetIndex() {
		this.index = 0;
	}

	/*
    description: method to display notification as toast message
  	*/
	showNotification(title, message, variant) {
		const evt = new ShowToastEvent({
			title: title,
			message: message,
			variant: variant
		});
		this.dispatchEvent(evt);
	}
}
