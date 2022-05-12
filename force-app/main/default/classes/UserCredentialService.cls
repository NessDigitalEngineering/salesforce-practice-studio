public with sharing class UserCredentialService {
    @AuraEnabled(cacheable=true)
    public static List<User_Credential__c> getActiveUserCredentials(String currentUserId) {
        String userId = '%' + currentUserId + '%';
        List<User_Credential__c> userCredentialList = new List<User_Credential__c>();
            User_Credential__c userCredential = [Select id, Credential__c, Status__c, User__c from User_Credential__c where User__r.id= '0056D0000053bZYQAY'and (User_Credential__c.Status__c = 'Preparing' or User_Credential__c.Status__c='Ready' or User_Credential__c.Status__c='Assigned')  WITH SECURITY_ENFORCED];
            userCredentialList .add(userCredential);                                            

            System.debug('credentials---'+userCredentialList);
        return userCredentialList;
    }
}
