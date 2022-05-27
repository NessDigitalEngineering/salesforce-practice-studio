public with sharing class UserCredentialController {
    @AuraEnabled
    public static List<User_Credential__c> methodName(){
        return [SELECT Status__c,User__c,Name,Credential__c FROM User_Credential__c WHERE User__c =:UserInfo.getUserId() WITH SECURITY_ENFORCED];
    }
}
