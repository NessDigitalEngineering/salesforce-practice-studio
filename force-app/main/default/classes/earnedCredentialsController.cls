public with sharing class earnedCredentialsController 
{
   @AuraEnabled(cacheable=true)
   public static List<User_Credential__c> getUserCredentials(String userId)
   {
    
       return [Select Id,Credential__r.Name,Badge_Icon__c,Status__c,User__c from User_Credential__c where User__c=:userId and Status__c= 'Completed'];
   } 

   

}
