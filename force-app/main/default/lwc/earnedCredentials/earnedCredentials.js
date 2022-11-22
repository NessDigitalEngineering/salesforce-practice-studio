import { LightningElement, wire, track, api } from "lwc";
import getCompletedUserCredentials from "@salesforce/apex/UserCredentialService.getCompletedUserCredentials";
import TasksIcon from "@salesforce/resourceUrl/EmptyCmpImage";
import EmptyCard from "@salesforce/label/c.emptyCard";
import Earned_Credentials from "@salesforce/label/c.Earned_Credentials";
export default class EarnedCredentials extends LightningElement {
  @track loaded = false;
  @api senddata = "";
  @track showIcon = true;
  label = { EmptyCard, Earned_Credentials };
  title;
  userCredentialsData;
  icon = TasksIcon;

  /* 
		@description: Wire service to get the completed credentials for a given user. 
		@param userId: selected user if from userSearch cmp.
	*/
  @wire(getCompletedUserCredentials, { userId: "$senddata" }) userdata({
    data,
    error
  }) {
    if (data) {
      let selectedRec = [];

      for (let i = 0; i < data.length; i++) {
        selectedRec.push(data[i]);
      }
      this.userCredentialsData = selectedRec;

      if (data.length > 0) {
        this.showIcon = false;
        this.fireCountEvent(Earned_Credentials + " (" + data.length + ")");
      } else {
        this.showIcon = true;
        this.fireCountEvent(Earned_Credentials);
      }

      this.loaded = true;
    } else if (error) {
      console.log("error1" + JSON.stringify(error));
    }
  }

  /* 
		@description: Custom event to propogate the total number of credentials to lightning card titile of parent cmp.		
		@param title: Title of the child cmp along with number of credentials completed
	*/
  fireCountEvent(title) {
    const countEvent = new CustomEvent("title", {
      detail: title
    });
    this.dispatchEvent(countEvent);
  }

  /* 
		@description: Public method to clear the variables. Used to reset the component.
	*/
  @api
  resetCredentials() {
    this.userCredentialsData = [];
    this.showIcon = true;
  }
}
