public with sharing class CredentialAssignmentController {

@AuraEnabled(cacheable=true)
public static List<User_Credential__c>  getUserCredentials(list<Id> credentialsId){
List<User_Credential__c> credentialsRec = [select id,Name ,Credential__r.name ,Assigned_Date__c,Due_Date__c ,Status__c from User_Credential__c where Credential__r.Id IN:credentialsId];
return credentialsRec;
} 

@AuraEnabled
public static string updateCredentials( Object data ) {
    
    List < User_Credential__c > accsForUpdate = ( List < User_Credential__c > ) JSON.deserialize(
        JSON.serialize( data ),
        List < User_Credential__c >.class
    );
    try {
        update accsForUpdate;
        return 'Success: User Credentials(s) updated successfully';
    }
    catch (Exception e) {
        return 'The following exception has occurred: ' + e.getMessage();
    }

}

}