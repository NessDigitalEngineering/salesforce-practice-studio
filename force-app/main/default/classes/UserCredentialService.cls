/**
 * @author Vidhya Balasubramaniam
 * @date   5/12/2022
 * @description Service Class containing methods specific to user credentials
 */

public with sharing class UserCredentialService {
    /*******************************************************************************************************
     * @description Returns User Credentials that are in progress
     * @param userId SF id of user
     * @return List of User Credentials
     */
    public List<User_Credential__c> getActiveUserCredentials(Id userId) {
        try {
            return [
                SELECT id, Credential__c, Credential__r.name, Assigned_Date__c, Due_Date__c, Status__c, User__c, Badge_Icon__c
                FROM User_Credential__c
                WHERE User__r.id = :userId AND User_Credential__c.Status__c != 'Completed'
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*******************************************************************************************************
     * @description Returns completed User Credentials
     * @param userId SF id of user
     * @return List of User Credentials
     */
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c> getCompletedUserCredentials(String userId) {
        system.debug('userid--' + userid);
        try {
            return [
                SELECT id, Credential__c, Credential__r.Name, Status__c, User__c, Badge_Icon__c
                FROM User_Credential__c
                WHERE User__c = :userId AND User_Credential__c.Status__c = 'Completed'
                WITH SECURITY_ENFORCED
            ];
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*******************************************************************************************************
     * @description create User Credentials
     * @param userCredentials List of User Credentials
     * @return List of Database.SaveResult
     */
    public List<Database.SaveResult> createUserCredentials(List<User_Credential__c> userCredentials) {
        try {
            return Database.insert(userCredentials, true);
        } catch (Exception ex) {
            throw ex;
        }
    }

    /*******************************************************************************************************
     * @description update User Credentials
     * @param userCredentials List of User Credentials
     * @return List of Database.SaveResult
     */
    public List<Database.SaveResult> updateUserCredentials(List<User_Credential__c> userCredentials) {
        try {
            return Database.update(userCredentials, true);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
