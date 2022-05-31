public with sharing class UserCredentialService {
    public List<User> getSubordinates(Id userId) {        
        try{
              return [SELECT Id, IsProfilePhotoActive, FullPhotoUrl FROM User where ManagerId=:userId ];        
            }
        catch (Exception ex){ 
            throw ex;
        }
    }
    public List<User_Credential__c> getActiveUserCredentials(List<Id> userIds) {        
        try{
              return [Select Id, Credential__c, Status__c, User__c, Credential__r.Name, Credential__r.Icon__c, Badge_Icon__c from User_Credential__c where User__r.id IN :userIds and User_Credential__c.Status__c != 'Completed' Order by User__c];        
            }
        catch (Exception ex){ 
            throw ex;
        }
    }
    

    public List<User_Credential__c> getActiveUserCredentials(Id userId) {        
        try{
              return [Select Id, Credential__c, Status__c, User__c, Credential__r.Name, Credential__r.Icon__c, Badge_Icon__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c != 'Completed' ];        
            }
        catch (Exception ex){ 
            throw ex;
        }
    }
    
 
    public List<User_Credential__c> getCompletedUserCredentials(Id userId) {        
        try{
            return [Select id, Credential__c, Status__c, User__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c = 'Completed' WITH SECURITY_ENFORCED];        
        }
        catch (Exception ex){
            throw ex;
        }
    }
    

    public List<Database.SaveResult> createUserCredentials(List<User_Credential__c> userCredentials){
        try{
            return Database.insert(userCredentials,true);
        }
        catch (Exception ex){
            throw ex;
        }
    }
    

    public List<Database.SaveResult> updateUserCredentials(List<User_Credential__c> userCredentials){
        try{
            return Database.update(userCredentials,true);
        }
        catch (Exception ex){
            throw ex;
        }
    }
}