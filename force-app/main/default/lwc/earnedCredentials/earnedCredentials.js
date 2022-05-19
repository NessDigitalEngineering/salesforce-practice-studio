import { LightningElement, api, wire, track } from 'lwc';
import getUserCredentials from '@salesforce/apex/earnedCredentialsController.getUserCredentials';
import strUserId from '@salesforce/user/Id';


export default class EarnedCredentials extends LightningElement {
userIds = strUserId;
title;
userCredentialsData;
userCredData;
@track countRec;
@track showMore = false;
@track showMre =  false;
@track initialRecords = false;
@track showMoreRecords = false;

@wire(getUserCredentials, {userId:'$userIds'}) userdata({data,error}){
    if(data){
       this.countRec = data.length;
       let selectedRec = [];
       if(this.countRec > 2){
            this.showMore = true;
        for(let i=0;i<this.countRec;i++){
            if(i<2){
                selectedRec.push(data[i]);
            }
        }
                             this.initialRecords = true;
        this.userCredentialsData = selectedRec;
       }else{
                             this.initialRecords = true;
        this.userCredentialsData = data;
       }
        
        
        this.title = 'Earned Credentials (' + data.length + ')';

    }else if(error)
    {
            console.log("error" + error);

    }
}

showMoreRec(){
    getUserCredentials({userId:'$userIds'}).then(response=>{
                             this.initialRecords = false;
                             this.showMoreRecords = true;
                             this.showMore = false;
                             this.userCredentialsData = response;
              }).catch(error=>{});
}
}
