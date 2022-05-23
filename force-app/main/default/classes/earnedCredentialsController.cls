public with sharing class EarnedCredentialsController {
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c> getUserCredentials(String userId)
   {
    
       return [Select Id,Credential__r.Name,Badge_Icon__c,Status__c from User_Credential__c where CreatedById = '0056D0000057TC8QAM'and Status__c= 'Completed'];
   }
}
