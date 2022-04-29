public with sharing class UserCredentialsController {
    public static List<User_Credential__c> getActiveUserCredentials(List<User> userList) {
        List<User_Credential__c> userCredentialList = new List<User_Credential__c>();
        for(User user :userList){
            User_Credential__c userCredential = [Select id, Assigned_By__c, Assigned_Date__c, Completion_Date__c, Credential__c, Due_Date__c, Maintenance_Due__c, Status__c, User__c
                                                       from User_Credential__c where User__c =:userinfo.getuserid() WITH SECURITY_ENFORCED];
            userCredentialList .add(userCredential);                                          
        }

        return userCredentialList;
    }
}