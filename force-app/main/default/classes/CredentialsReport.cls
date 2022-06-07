public with sharing class CredentialsReport {
    
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c> getCredentialsReport(string userId){

        List<User_Credential__c> credentialsRec = [select User__r.Name ,Credential__r.name,Assigned_Date__c,Due_Date__c ,Status__c from User_Credential__c where user__r.managerid =:userId  and Status__c != 'Completed' Order by Due_Date__c];
   
        return credentialsRec;
    }
}