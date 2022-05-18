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
        try{
            return [Select id, Credential__c, Status__c, User__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c != 'Completed' WITH SECURITY_ENFORCED];        
        }
        catch (Exception ex){
            throw ex;
        }
    }
    
    /*******************************************************************************************************
    * @description Returns completed User Credentials    
    * @param userId SF id of user
    * @return List of User Credentials 
    */  
    public List<User_Credential__c> getCompletedUserCredentials(Id userId) {        
        try{
            return [Select id, Credential__c, Status__c, User__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c = 'Completed' WITH SECURITY_ENFORCED];        
        }
        catch (Exception ex){
            throw ex;
        }
    }
    
    /*******************************************************************************************************
    * @description create User Credentials    
    * @param userCredentials List of User Credentials
    * @return List of Database.SaveResult 
    */  
    public List<Database.SaveResult> createUserCredentials(List<User_Credentials__c> userCredentials){
        try{
            return Database.insert(userCredentials,true);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    
    /*******************************************************************************************************
    * @description update User Credentials    
    * @param userCredentials List of User Credentials
    * @return List of Database.SaveResult 
    */
    public List<Database.SaveResult> updateUserCredentials(List<User_Credentials__c> userCredentials){
        try{
            return Database.update(userCredentials,true);
        }
        catch (Exception ex){
            throw ex;
        }
    }
}
