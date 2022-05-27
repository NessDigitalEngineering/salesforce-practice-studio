public class CredentialTrackingLWCAPEX {
    @AuraEnabled
    public static List<User_Credential__c> getUserCredentials(String userId)
    {
        UserCredentialService ucs = new UserCredentialService();
        List<User_Credential__c> totalUserCredentials = ucs.getActiveUserCredentials(userId);
        return totalUserCredentials;  
    } 
 
    
    @AuraEnabled
    public static Boolean updateUserCredential(String id, string status)
    {
         UserCredentialService ucs = new UserCredentialService();
         List<User_Credential__c> userCredentials = new List<User_Credential__c>{new User_Credential__c(id=id,status__c=status)};
         List<Database.SaveResult> srList = ucs.updateUserCredentials(userCredentials);
         
         Boolean isSuccess= true;
         for (Database.SaveResult sr : srList) {
             if (sr.isSuccess()) {
                 
                 System.debug('Successfully updated the record.' + sr.getId());
             }
             else {
                 isSuccess =false;
                                
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