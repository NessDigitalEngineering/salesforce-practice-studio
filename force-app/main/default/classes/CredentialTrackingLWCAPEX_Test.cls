@isTest
public class CredentialTrackingLWCAPEX_Test {

    @testSetup 
    public static void setupmethod() {
        TestDataFactory.createCredentials();
        List<Credential__c> creds = [Select id from Credential__c limit 1];
        TestDataFactory.createUserCredentials(userinfo.getUserId(),creds[0].Id);
    }
    
	@isTest
    public static void getUserCredentials(){
        List<User_Credential__c> ucList = CredentialTrackingLWCAPEX.getUserCredentials(userinfo.getUserId());
        CredentialTrackingLWCAPEX.updateUserCredential(ucList[0].Id, ucList[0].Status__c);
   }
}