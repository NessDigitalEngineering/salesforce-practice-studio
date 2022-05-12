/**
* @author Vidhya Balasubramaniam
* @date   5/12/2022
*
* @description Service Class containing methods specific to user credentials
*/
public with sharing class UserCredentialService {
    /*******************************************************************************************************
    * @description Returns active user credentials for a given user 
    * @param User_Credential__c get active user credentials for a user from user object
    * @param userId a string of current user Id based on which active credentials will be retrieved
    * @return returns a list of active credentials for a user 
    * @example
    * User_Credential__c userCredential = new User_Credential__c();
    */
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c> getActiveUserCredentials(String userId) {
        String userId = '%' + userId + '%';
        List<User_Credential__c> userCredentialList = new List<User_Credential__c>();
            User_Credential__c userCredential = [Select id, Credential__c, Status__c, User__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c != 'Completed' WITH SECURITY_ENFORCED];
            userCredentialList.add(userCredential);                                            
        return userCredentialList;
    }
}
