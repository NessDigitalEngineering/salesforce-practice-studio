/*
Author      :   Pendyala Shravani
Description :   Controller for CredentialTrackingLWC component
TestClass   :   
Related Components  :   credentialTrackingLWC, UserCredentialService
Date        : 19-May-2022

Update Log:
CH1         :   19-May-2022 - Pendyala Shravani - 
*/
public with sharing class CredentialTrackingLWCCtrl {
 
    // Gets Active Credentials for the provided user
   @AuraEnabled
   public static List<User_Credential__c> getUserCredentials(String userId)
   {
       UserCredentialService ucs = new UserCredentialService();
       List<User_Credential__c> totalUserCredentials = ucs.getActiveUserCredentials(userId);
       return totalUserCredentials; 
   } 

   // Updates the User Credential record with provided Status value
   @AuraEnabled
   public static Boolean updateUserCredential(String id, string status)
   {
        UserCredentialService ucs = new UserCredentialService();
        List<User_Credential__c> userCredentials = new List<User_Credential__c>{new User_Credential__c(id=id,status__c=status)};
        List<Database.SaveResult> srList = ucs.updateUserCredentials(userCredentials);
        
        Boolean isSuccess= true;
        for (Database.SaveResult sr : srList) {
            if (sr.isSuccess()) {
                // Operation was successful, so get the ID of the record that was processed
                System.debug('Successfully updated the record.' + sr.getId());
            }
            else {
                isSuccess =false;
                // Operation failed, so get all errors                
                for(Database.Error err : sr.getErrors()) {
                    System.debug('The following error has occurred.');                    
                    System.debug(err.getStatusCode() + ': ' + err.getMessage());
                    System.debug('Record fields that affected this error: ' + err.getFields());
                }
            }
        }
        
        return isSuccess; 
        
   } 

}