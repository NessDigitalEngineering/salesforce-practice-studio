@isTest
public class CredentialTrackingLWCAPEX_Test {
@isTest
    public static void setupmethod() {
        TestDataFactory.createCredentials();
        List<Credential__c> creds = [Select id from Credential__c limit 1];
        TestDataFactory.createUserCredentials(userinfo.getUserId(),creds[0].Id);
        User_Credential__c uc= TestDataFactory.createUserCredentials(userinfo.getUserId(),creds[0].Id);
        insert uc;
    }

	@isTest
    public static void getUserCredentials(){ 
        List<User_Credential__c> ucList = CredentialTrackingLWCAPEX.getUserCredentials(userinfo.getUserId());
        CredentialTrackingLWCAPEX.updateUserCredential(ucList[0].Id, ucList[0].Status__c);
   }
}