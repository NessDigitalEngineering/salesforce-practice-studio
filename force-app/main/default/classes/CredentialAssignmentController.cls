public with sharing class CredentialAssignmentController {
    
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c>  getUserCredentials(list<Id> credentialsId){
        List<User_Credential__c> credentialsRec = [select Id,Name ,Credential__r.name ,Assigned_Date__c,Due_Date__c ,Status__c from User_Credential__c where Credential__r.Id IN:credentialsId WITH SECURITY_ENFORCED];
        return credentialsRec;
    } 
    
}