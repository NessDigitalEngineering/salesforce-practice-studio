/**
 * @author Lavanya Bonthala
 * @date   6/28/2022
 * @description Apex controller for credentialTracking component
 */
public with sharing class CredentialTrackingController {

    /*******************************************************************************************************
      * @description Returns User Credentials that are in progress
      * @param userId SF id of user
      * @return List of User Credentials
      */ 
    @AuraEnabled
    public static List<User_Credential__c> getUserCredentials(String userId)
    {
        UserCredentialService ucs = new UserCredentialService();
        List<User_Credential__c> totalUserCredentials = ucs.getActiveUserCredentials(userId);
        return totalUserCredentials;  
    } 
 
    /*******************************************************************************************************
      * @description Returns boolean value
      * @param id,status
      * @return true or false
      */
    @AuraEnabled
    public static Boolean updateUserCredential(String id, string status)
    {
         UserCredentialService ucs = new UserCredentialService();
         List<User_Credential__c> userCredentials = new List<User_Credential__c>{new User_Credential__c(id=id,status__c=status)};
         List<Database.SaveResult> srList = ucs.updateUserCredentials(userCredentials);
         
         Boolean isSuccess= true;
         for (Database.SaveResult sr : srList) {
             if (sr.isSuccess()) {
                 //console.log(sr.getId());
                                 }else {isSuccess =false; for(Database.Error err : sr.getErrors()) {
                                    // console.log(err.getMessage());
                                 }
             }
         }
         return isSuccess; 
    } 
 }
