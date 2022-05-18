import { LightningElement, api, wire, track } from 'lwc';
import getUserCredentials from '@salesforce/apex/earnedCredentialsController.getUserCredentials';

import strUserId from '@salesforce/user/Id';

const FIELDS = [
    'User_Credential__c.Name',
    'User_Credential__c.Badge_Icon__c',
    'User_Credential__c.Status__c'
];

export default class EarnedCredentials extends LightningElement {
userIds = strUserId;
title;
userCredentialsData;
userCredData;
@track countRec;
@track showMore = false;
//@track NoshowMore = false;
@track showMre =  false;
//@track iconNm = 'standard:user';

@wire(getUserCredentials, {userId:'$userIds'}) userdata({data,error}){
    if(data){
        
        this.countRec = data.length;
       let selectedRec = [];

       if(this.countRec > 3){
            this.showMore = true;
        for(let i=0;i<this.countRec;i++){
            if(i<3){
                selectedRec.push(data[i]);
            }
        }
       // console.log("selectedRec" + JSON.stringify(selectedRec));
        this.userCredentialsData = selectedRec;
       }else{
        this.userCredentialsData = data;
       }
        
        //console.log("data :"  + JSON.stringify(data));
        this.title = 'Earned Credentials (' + data.length + ')';

    }else if(error)
    {
            console.log("error" + error);

    }
}

showMoreRecords(event){
    //alert("inside show" );
    //console.log("selectedRec" + JSON.stringify(userCredentialsData));
   this.querySelector('c-earnedCredentialsModalPopUp');

}
}