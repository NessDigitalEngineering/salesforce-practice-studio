public with sharing class UserCredentialService {

    /*******************************************************************************************************
    * @description Returns User Credentials that are in progress     
    * @param userId SF id of user
    * @return List of User Credentials 
    */ 
    @AuraEnabled(cacheable=true) 
    public static List<User_Credential__c> getActiveUserCredentials(Id userId) {        

        try{
              return [Select Id, Credential__c, Status__c, User__c, Credential__r.Name, Credential__r.Icon__c, Badge_Icon__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c != 'Completed' WITH SECURITY_ENFORCED];        
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
    @AuraEnabled(cacheable=true) 
    public static List<User_Credential__c> getCompletedUserCredentials(Id userId) {  
             
        
            return [Select id, Credential__r.Name,Badge_Icon__c, Status__c, User__c from User_Credential__c where User__r.id= :userId and User_Credential__c.Status__c = 'Completed' WITH SECURITY_ENFORCED];        
        
        
    }
    
    /*******************************************************************************************************
    * @description create User Credentials    
    * @param userCredentials List of User Credentials
    * @return List of Database.SaveResult 
    */
    

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
            return Database.insert(userCredentials,false);
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
 
    public List<Database.SaveResult> updateUserCredentials(List<User_Credential__c> userCredentials){

        try{
            return Database.update(userCredentials,false);
        }
        catch (Exception ex){
            throw ex;
        }
    }
}