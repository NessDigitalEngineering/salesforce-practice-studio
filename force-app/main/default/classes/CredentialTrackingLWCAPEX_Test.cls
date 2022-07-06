@isTest
public class CredentialTrackingLWCAPEX_Test {

    @isTest
    public static void getUserCredentials(){
        User usrs = TestDataFactory.createUser();
        TestDataFactory.assignPboAdminPermissions(usrs);
        System.runAs(usrs){
        TestDataFactory.createCredentials();
        List<Credential__c> creds = [Select id from Credential__c limit 1];
        TestDataFactory.createUserCredentials(usrs.Id,creds[0].Id);
        User_Credential__c uc= TestDataFactory.createUserCredentials(usrs.id,creds[0].Id);
        insert uc;
        List<User_Credential__c> ucList = CredentialTrackingLWCAPEX.getUserCredentials(usrs.id);
        CredentialTrackingLWCAPEX.updateUserCredential(ucList[0].Id, ucList[0].Status__c);
        }
   }
}
