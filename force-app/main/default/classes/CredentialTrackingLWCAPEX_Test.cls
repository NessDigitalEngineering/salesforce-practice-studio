@isTest
public class CredentialTrackingLWCAPEX_Test {
	@isTest
    public static void getUserCredentials(){         
        	user u =TestDataFactory.createUser();
        	TestDataFactory.assignPboAdminPermissions(u);
            TestDataFactory.createCredentials();
            List<Credential__c> creds = [Select id from Credential__c limit 1];
            User_Credential__c uc= TestDataFactory.createUserCredentials(u.Id,creds[0].Id);
            insert uc;
        	List<User_Credential__c> ucList = CredentialTrackingLWCAPEX.getUserCredentials(u.Id);
        	CredentialTrackingLWCAPEX.updateUserCredential(u.Id, ucList[0].Status__c);
   }
}