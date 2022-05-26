import { LightningElement, wire, api, track } from 'lwc';
import getCompletedUserCredentials from '@salesforce/apex/UserCredentialService.getCompletedUserCredentials';
export default class EarnedCredentials extends LightningElement {
title = 'Earned Credentials';
userCredentialsData;
userCredData;
@track countRec;
@track showMore = false;
@track showMre =  false;
@track initialRecords = false;
@track showMoreRecords = false;
@api datesend;
@wire(getCompletedUserCredentials, {userId:'$datesend'}) userdata({data,error}){
    console.log('data'+ this.datesend);
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

    getCompletedUserCredentials({userId:this.datesend}).then(response=>{
        console.log('userids' +this.datesend);

                             this.initialRecords = false;
                             this.showMoreRecords = true;
                             this.showMore = false;
                             this.userCredentialsData = response;
              }).catch(error=>{
                  console.log("error" +error);
              });
}
}
